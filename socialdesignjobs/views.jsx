/* global React, ReactDOM, maplibregl, ORGS, CATEGORIES, SDComponents */
const { useState, useEffect, useMemo, useRef } = React;
const { Tooltip, OrgCard, SubmitModal, fmtRelative } = window.SDComponents;

const JOB_SOURCE_ID = "sd-jobs";
const JOB_POINT_LAYER_ID = "sd-job-points";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function stableUnit(value) {
  const str = String(value || "");
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function orgRevealScore(org) {
  const jobBonus = Math.min(0.18, Math.max(0, (org.jobs?.length || 1) - 1) * 0.06);
  return clamp(stableUnit(org.id || org.name) * 0.86 - jobBonus, 0, 1);
}

function jobRevealScore(point) {
  const orgBase = orgRevealScore(point.org) * 0.72;
  const jobSpread = stableUnit(point.id) * 0.2;
  const laterJobDelay = Math.min(0.26, point.jobIndex * 0.08);
  return clamp(orgBase + jobSpread + laterJobDelay, 0, 1);
}

function globeRevealThreshold(zoom) {
  return clamp(0.34 + (zoom - 1.1) * 0.24, 0.32, 1);
}

function emptyFeatureCollection() {
  return { type: "FeatureCollection", features: [] };
}

function hexToRgb(hex) {
  const clean = String(hex || "#E8B339").replace("#", "");
  const full = clean.length === 3
    ? clean.split("").map((ch) => ch + ch).join("")
    : clean.padEnd(6, "0").slice(0, 6);
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function makeDotImage(color) {
  const size = 64;
  const data = new Uint8Array(size * size * 4);
  const fill = hexToRgb(color);
  const center = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - center;
      const dy = y + 0.5 - center;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const i = (y * size + x) * 4;

      if (dist <= 15) {
        data[i] = fill.r;
        data[i + 1] = fill.g;
        data[i + 2] = fill.b;
        data[i + 3] = 255;
      } else if (dist <= 21) {
        data[i] = 14;
        data[i + 1] = 14;
        data[i + 2] = 16;
        data[i + 3] = dist <= 18 ? 245 : 185;
      } else if (dist <= 28) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = Math.round((1 - ((dist - 21) / 7)) * 72);
      }
    }
  }

  return { width: size, height: size, data };
}

function syncDotImages(map) {
  Object.entries(CATEGORIES).forEach(([key, cat]) => {
    const id = `sd-dot-${key}`;
    const image = makeDotImage(cat.color);
    if (map.hasImage(id)) {
      if (map.updateImage) map.updateImage(id, image);
      return;
    }
    map.addImage(id, image);
  });
}

function visualCoord(point, visibleIndex, visibleCount) {
  const [lng, lat] = point.org.coord;
  if (visibleCount <= 1) return [lng, lat];

  const angle = stableUnit(point.id) * Math.PI * 2 + (Math.PI * 2 * visibleIndex / visibleCount);
  const radius = Math.min(0.045, 0.014 + visibleCount * 0.0035);
  const lngScale = Math.max(0.35, Math.cos((lat * Math.PI) / 180));
  return [
    lng + (Math.cos(angle) * radius) / lngScale,
    lat + Math.sin(angle) * radius,
  ];
}

function mapEventClientPosition(event, map) {
  const original = event.originalEvent || {};
  if (Number.isFinite(original.clientX) && Number.isFinite(original.clientY)) {
    return { x: original.clientX, y: original.clientY };
  }
  const rect = map.getCanvas().getBoundingClientRect();
  return { x: rect.left + event.point.x, y: rect.top + event.point.y };
}

function pointerLngLat(map, event) {
  const rect = map.getContainer().getBoundingClientRect();
  const clientX = Number.isFinite(event.clientX) ? event.clientX : rect.left + rect.width / 2;
  const clientY = Number.isFinite(event.clientY) ? event.clientY : rect.top + rect.height / 2;
  return map.unproject([clientX - rect.left, clientY - rect.top]);
}

function zoomFocusCenter(map, event, nextZoom, lockedFocus) {
  const focus = lockedFocus || pointerLngLat(map, event);
  const center = map.getCenter();
  const zoomDelta = Math.max(0, nextZoom - map.getZoom());
  const attraction = clamp(1 - Math.pow(0.5, zoomDelta * 1.15), 0, 0.96);
  let lngDelta = focus.lng - center.lng;
  while (lngDelta > 180) lngDelta -= 360;
  while (lngDelta < -180) lngDelta += 360;
  return [
    center.lng + lngDelta * attraction,
    center.lat + (focus.lat - center.lat) * attraction,
  ];
}

function normalizedWheelDelta(event) {
  if (event.deltaMode === 1) return event.deltaY * 16;
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
  return event.deltaY;
}

function kineticBoost(state, delta, now) {
  const dt = state.lastTime ? clamp(now - state.lastTime, 8, 80) : 16;
  const previous = Number.isFinite(state.lastDelta) ? state.lastDelta : 0;
  const velocity = Math.abs(delta) / dt;
  const acceleration = Math.abs(delta - previous) / dt;
  state.lastTime = now;
  state.lastDelta = delta;
  return 1 + clamp(velocity * 0.034 + acceleration * 0.42, 0, 0.45);
}

// ──────────────────────────────────────────────────────────────────────────
// Map view — real globe/OSM-style interaction. Each visible job is one point.
// ──────────────────────────────────────────────────────────────────────────
function MapView({ orgs, palette, onSelectOrg, selectedOrg, hoverOrg, onVisibleCount, onHover }) {
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const callbacksRef = useRef({ onHover, onSelectOrg });
  const jobLookupRef = useRef(new Map());
  const [mapReady, setMapReady] = useState(false);
  const [mapZoom, setMapZoom] = useState(1.2);
  const [hoveredPointId, setHoveredPointId] = useState(null);

  useEffect(() => {
    callbacksRef.current = { onHover, onSelectOrg };
  }, [onHover, onSelectOrg]);

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current || !window.maplibregl) return;

    const initialZoom = window.innerWidth <= 760 ? 0.72 : 1.2;
    const map = new window.maplibregl.Map({
      container: mapNodeRef.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [12, 24],
      zoom: initialZoom,
      minZoom: 0.25,
      maxZoom: 15.5,
      projection: { type: "globe" },
      attributionControl: false,
      renderWorldCopies: false,
      pitchWithRotate: false,
      dragRotate: false,
      touchPitch: false,
    });

    map.addControl(new window.maplibregl.NavigationControl({ showCompass: false, visualizePitch: false }), "top-right");
    map.addControl(new window.maplibregl.AttributionControl({ compact: true }), "bottom-right");
    mapRef.current = map;

    const pinchState = {
      pendingZoomDelta: 0,
      lastEvent: null,
      raf: 0,
      lastWheelDelta: 0,
      lastWheelTime: 0,
      wheelFocus: null,
      lastGestureScale: 1,
      lastGestureDelta: 0,
      lastGestureTime: 0,
      gestureFocus: null,
    };
    const syncZoom = () => {
      if (pinchState.zoomRaf) return;
      pinchState.zoomRaf = requestAnimationFrame(() => {
        pinchState.zoomRaf = 0;
        setMapZoom(map.getZoom());
      });
    };
    const setGlobeProjection = () => {
      try {
        map.setProjection({ type: "globe" });
      } catch {
        // Older cached builds may already have constructor projection applied.
      }
    };
    const ensureJobLayers = () => {
      if (!map.getSource(JOB_SOURCE_ID)) {
        map.addSource(JOB_SOURCE_ID, {
          type: "geojson",
          data: emptyFeatureCollection(),
        });
      }
      syncDotImages(map);
      if (!map.getLayer(JOB_POINT_LAYER_ID)) {
        map.addLayer({
          id: JOB_POINT_LAYER_ID,
          type: "symbol",
          source: JOB_SOURCE_ID,
          layout: {
            "icon-image": ["get", "icon"],
            "icon-size": [
              "case",
              ["boolean", ["get", "selected"], false], 0.42,
              ["boolean", ["get", "hovered"], false], 0.37,
              0.31,
            ],
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
            "icon-anchor": "center",
          },
        });
      }
    };
    const applyPinchFrame = (event, zoomDelta, lockedFocus) => {
      pinchState.pendingZoomDelta += zoomDelta;
      pinchState.lastEvent = {
        clientX: Number.isFinite(event.clientX) ? event.clientX : undefined,
        clientY: Number.isFinite(event.clientY) ? event.clientY : undefined,
      };
      pinchState.lastFocus = lockedFocus || null;
      if (pinchState.raf) return;

      pinchState.raf = requestAnimationFrame(() => {
        pinchState.raf = 0;
        const delta = pinchState.pendingZoomDelta;
        pinchState.pendingZoomDelta = 0;
        if (!delta) return;

        const nextZoom = clamp(map.getZoom() + delta, map.getMinZoom(), map.getMaxZoom());
        map.stop();
        map.jumpTo({
          zoom: nextZoom,
          center: zoomFocusCenter(map, pinchState.lastEvent || {}, nextZoom, pinchState.lastFocus),
        });
      });
    };
    const accelerateTrackpadPinch = (event) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      event.preventDefault();
      event.stopPropagation();

      const delta = normalizedWheelDelta(event);
      const now = event.timeStamp || performance.now();
      if (!pinchState.lastWheelTime || now - pinchState.lastWheelTime > 140) {
        pinchState.wheelFocus = pointerLngLat(map, event);
      }
      const boost = kineticBoost({
        get lastTime() { return pinchState.lastWheelTime; },
        set lastTime(value) { pinchState.lastWheelTime = value; },
        get lastDelta() { return pinchState.lastWheelDelta; },
        set lastDelta(value) { pinchState.lastWheelDelta = value; },
      }, delta, now);
      applyPinchFrame(event, clamp(-delta * 0.01 * boost, -0.9, 0.9), pinchState.wheelFocus);
    };
    const acceleratePlainWheel = () => {
      if (map.scrollZoom?.setWheelZoomRate) map.scrollZoom.setWheelZoomRate(1 / 72);
      if (map.scrollZoom?.setZoomRate) map.scrollZoom.setZoomRate(1 / 34);
    };
    const beginGesturePinch = (event) => {
      event.preventDefault();
      event.stopPropagation();
      pinchState.lastGestureScale = typeof event.scale === "number" ? event.scale : 1;
      pinchState.lastGestureDelta = 0;
      pinchState.lastGestureTime = event.timeStamp || performance.now();
      pinchState.gestureFocus = map.getCenter();
    };
    const accelerateGesturePinch = (event) => {
      if (typeof event.scale !== "number") return;
      event.preventDefault();
      event.stopPropagation();

      const safeScale = Math.max(0.05, event.scale);
      const previousScale = Math.max(0.05, pinchState.lastGestureScale || 1);
      const scaleDelta = Math.log2(safeScale / previousScale);
      const boost = kineticBoost({
        get lastTime() { return pinchState.lastGestureTime; },
        set lastTime(value) { pinchState.lastGestureTime = value; },
        get lastDelta() { return pinchState.lastGestureDelta; },
        set lastDelta(value) { pinchState.lastGestureDelta = value; },
      }, scaleDelta, event.timeStamp || performance.now());
      pinchState.lastGestureScale = safeScale;
      applyPinchFrame(event, clamp(scaleDelta * 2.55 * boost, -1.8, 1.8), pinchState.gestureFocus);
    };
    const endGesturePinch = (event) => {
      event.preventDefault();
      pinchState.lastGestureScale = 1;
      pinchState.lastGestureDelta = 0;
      pinchState.gestureFocus = null;
    };
    const handleJobMove = (event) => {
      const feature = event.features?.[0];
      const point = feature && jobLookupRef.current.get(feature.properties?.pointId);
      if (!point) return;
      map.getCanvas().style.cursor = "pointer";
      setHoveredPointId((current) => current === point.id ? current : point.id);
      callbacksRef.current.onHover({
        ...point.org,
        _hoverJobTitle: point.job.title || null,
      }, mapEventClientPosition(event, map));
    };
    const handleJobLeave = () => {
      map.getCanvas().style.cursor = "";
      setHoveredPointId(null);
      callbacksRef.current.onHover(null);
    };
    const handleJobClick = (event) => {
      const feature = event.features?.[0];
      const point = feature && jobLookupRef.current.get(feature.properties?.pointId);
      if (point) callbacksRef.current.onSelectOrg(point.org);
    };
    let jobEventsBound = false;
    const bindJobEvents = () => {
      if (jobEventsBound) return;
      map.on("mousemove", JOB_POINT_LAYER_ID, handleJobMove);
      map.on("mouseleave", JOB_POINT_LAYER_ID, handleJobLeave);
      map.on("click", JOB_POINT_LAYER_ID, handleJobClick);
      jobEventsBound = true;
    };
    const unbindJobEvents = () => {
      if (!jobEventsBound) return;
      map.off("mousemove", JOB_POINT_LAYER_ID, handleJobMove);
      map.off("mouseleave", JOB_POINT_LAYER_ID, handleJobLeave);
      map.off("click", JOB_POINT_LAYER_ID, handleJobClick);
      jobEventsBound = false;
    };

    map.on("style.load", setGlobeProjection);
    map.on("load", () => {
      setGlobeProjection();
      ensureJobLayers();
      bindJobEvents();
      acceleratePlainWheel();
      if (map.touchZoomRotate?.enable) map.touchZoomRotate.enable();
      if (map.touchZoomRotate?.disableRotation) map.touchZoomRotate.disableRotation();
      if (map.dragRotate?.disable) map.dragRotate.disable();
      syncZoom();
      setMapReady(true);
    });
    map.on("zoom", syncZoom);
    map.on("zoomend", syncZoom);
    const canvasContainer = map.getCanvasContainer();
    canvasContainer.addEventListener("wheel", accelerateTrackpadPinch, { passive: false });
    canvasContainer.addEventListener("gesturestart", beginGesturePinch, { passive: false });
    canvasContainer.addEventListener("gesturechange", accelerateGesturePinch, { passive: false });
    canvasContainer.addEventListener("gestureend", endGesturePinch, { passive: false });

    return () => {
      canvasContainer.removeEventListener("wheel", accelerateTrackpadPinch);
      canvasContainer.removeEventListener("gesturestart", beginGesturePinch);
      canvasContainer.removeEventListener("gesturechange", accelerateGesturePinch);
      canvasContainer.removeEventListener("gestureend", endGesturePinch);
      if (pinchState.raf) cancelAnimationFrame(pinchState.raf);
      if (pinchState.zoomRaf) cancelAnimationFrame(pinchState.zoomRaf);
      unbindJobEvents();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const jobPoints = useMemo(() => {
    return orgs.flatMap((org) => {
      if (!Array.isArray(org.coord) || org.coord.length !== 2) return [];
      return (org.jobs || []).map((job, jobIndex) => ({
        id: `${org.id || org.name}::${job.title || "job"}::${jobIndex}`,
        org,
        job,
        jobIndex,
      }));
    });
  }, [orgs]);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;
    syncDotImages(map);
    map.triggerRepaint?.();
  }, [mapReady, palette]);

  const revealedJobs = useMemo(() => {
    if (jobPoints.length <= 12) return jobPoints;
    const threshold = globeRevealThreshold(mapZoom);
    return jobPoints.filter((point) => {
      if (selectedOrg?.id === point.org.id || hoverOrg?.id === point.org.id) return true;
      return mapZoom >= 5.25 || jobRevealScore(point) <= threshold;
    });
  }, [jobPoints, selectedOrg, hoverOrg, mapZoom]);

  const jobData = useMemo(() => {
    const grouped = new Map();
    for (const point of revealedJobs) {
      const key = point.org.id || point.org.name;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(point);
    }

    const lookup = new Map();
    const features = [];
    grouped.forEach((points) => {
      const sorted = [...points].sort((a, b) => jobRevealScore(a) - jobRevealScore(b));
      sorted.forEach((point, index) => {
        const cat = CATEGORIES[point.org.cat] || CATEGORIES.studio;
        lookup.set(point.id, point);
        features.push({
          type: "Feature",
          id: point.id,
          properties: {
            pointId: point.id,
            orgId: point.org.id,
            color: cat.color,
            icon: `sd-dot-${point.org.cat || "studio"}`,
            selected: selectedOrg?.id === point.org.id,
            hovered: hoveredPointId === point.id,
            title: point.job.title || "Open position",
            orgName: point.org.name,
          },
          geometry: {
            type: "Point",
            coordinates: visualCoord(point, index, sorted.length),
          },
        });
      });
    });

    return {
      lookup,
      collection: { type: "FeatureCollection", features },
    };
  }, [revealedJobs, selectedOrg, hoveredPointId]);

  useEffect(() => {
    jobLookupRef.current = jobData.lookup;
    onVisibleCount?.(jobData.collection.features.length);
    const map = mapRef.current;
    const source = map?.getSource(JOB_SOURCE_ID);
    if (!mapReady || !source?.setData) return;
    source.setData(jobData.collection);
  }, [jobData, mapReady, onVisibleCount]);

  return (
    <div className="sd-map sd-real-map">
      <div ref={mapNodeRef} className="sd-maplibre-map" />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// List view
// ──────────────────────────────────────────────────────────────────────────
function ListView({ orgs, onSelectOrg }) {
  return (
    <div className="sd-list">
      {orgs.map(o => {
        const cat = CATEGORIES[o.cat];
        return (
          <div key={o.id} className="sd-list-row" onClick={() => onSelectOrg(o)}>
            <span className="sd-list-dot" style={{ background: cat.color }} />
            <div className="sd-list-main">
              <div className="sd-list-name">{o.name}</div>
              <div className="sd-list-meta">{cat.label} · {o.city}, {o.country}</div>
            </div>
            <div className="sd-list-jobs">{o.jobs.length} open</div>
          </div>
        );
      })}
      {orgs.length === 0 && <div className="sd-empty">No matches</div>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Filter bar
// ──────────────────────────────────────────────────────────────────────────
function FilterBar({ filters, setFilters, position, search, setSearch }) {
  const cats = Object.entries(CATEGORIES);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleCat = (k) => {
    const next = new Set(filters.cats);
    if (next.has(k)) next.delete(k); else next.add(k);
    setFilters({ ...filters, cats: next });
  };
  const setKind = (k) => setFilters({ ...filters, kind: filters.kind === k ? "all" : k });
  const setTrack = (k) => setFilters({ ...filters, track: filters.track === k ? "all" : k });
  const activeFilterCount = [
    filters.kind !== "all",
    filters.track !== "all",
    filters.cats.size !== cats.length,
  ].filter(Boolean).length;

  return (
    <div className={`sd-filters sd-filters-${position} ${mobileOpen ? "is-open" : ""}`}>
      <div className="sd-filter-search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        <input placeholder="Search org or city" value={search} onChange={(e) => setSearch(e.target.value)} />
        {search && <button className="sd-clear" onClick={() => setSearch("")}>×</button>}
      </div>

      <button
        className="sd-mobile-filter-toggle"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        <span>Filters</span>
        <span>{activeFilterCount ? `${activeFilterCount} active` : "All"}</span>
      </button>

      <div className="sd-filter-advanced">
        <div className="sd-filter-group">
          <Chip active={filters.kind === "role"} onClick={() => setKind("role")}>Role-based</Chip>
          <Chip active={filters.kind === "project"} onClick={() => setKind("project")}>Project-based</Chip>
        </div>

        <div className="sd-filter-group">
          <Chip active={filters.track === "intern"} onClick={() => setTrack("intern")}>Intern</Chip>
          <Chip active={filters.track === "full-time"} onClick={() => setTrack("full-time")}>Full-time</Chip>
          <Chip active={filters.track === "fellowship"} onClick={() => setTrack("fellowship")}>Fellowship</Chip>
        </div>

        <div className="sd-filter-cats">
          {cats.map(([k, c]) => (
            <button key={k}
              className={`sd-cat-chip ${filters.cats.has(k) ? "active" : ""}`}
              onClick={() => toggleCat(k)}
              style={{ "--cat-color": c.color }}
            >
              <span className="sd-cat-dot" style={{ background: c.color }} />
              {c.label}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}

function Chip({ active, onClick, children }) {
  return <button className={`sd-chip ${active ? "active" : ""}`} onClick={onClick}>{children}</button>;
}

window.SDViews = { MapView, ListView, FilterBar };
