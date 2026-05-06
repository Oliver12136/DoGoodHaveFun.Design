/* global React, ReactDOM, ORGS, CATEGORIES, SDComponents, SDViews, useTweaks */
const { useState, useEffect, useMemo } = React;
const { Tooltip, OrgCard, SubmitModal, fmtRelative } = window.SDComponents;
const { MapView, ListView, FilterBar } = window.SDViews;

const REGION_BOUNDS = {
  americas: ([lng]) => lng < -30,
  europe:   ([lng, lat]) => lng >= -30 && lng < 60 && lat > 35,
  africa:   ([lng, lat]) => lng >= -20 && lng < 55 && lat <= 35,
  asia:     ([lng, lat]) => lng >= 60 && lng < 150 && lat > -10,
  oceania:  ([lng, lat]) => lng >= 100 && lat <= -10,
};

const TWEAK_DEFAULS = /*EDITMODE-BEGIN*/{
  "cardPosition": "drawer",
  "palette": "warm",
  "fontFamily": "sans",
  "filterPosition": "floating"
}/*EDITMODE-END*/;

const PALETTES = {
  warm: { /* default colors already defined in data.js */ },
  cool: {
    studio:    "#7BA8E8",
    lab:       "#A0CFD8",
    civic:     "#B8C5E8",
    climate:   "#9DD9CC",
    ngo:       "#D8B4DD",
    research:  "#E8B4C7",
    consult:   "#C9D8E8",
    community: "#A8D8C5",
  },
  vivid: {
    studio:    "#F4A261",
    lab:       "#2A9D8F",
    civic:     "#E76F51",
    climate:   "#264653",
    ngo:       "#9B5DE5",
    research:  "#F15BB5",
    consult:   "#FFC857",
    community: "#00BBF9",
  },
  mono: {
    studio:    "#FFFFFF",
    lab:       "#D4D4D4",
    civic:     "#B0B0B0",
    climate:   "#909090",
    ngo:       "#E8E8E8",
    research:  "#C0C0C0",
    consult:   "#A0A0A0",
    community: "#858585",
  },
};

const BASE_CATEGORY_COLORS = Object.fromEntries(
  Object.entries(window.CATEGORIES).map(([key, value]) => [key, value.color])
);

function normalizeMeta(meta = {}) {
  const parsed = typeof meta.lastUpdate === "number" ? meta.lastUpdate : Date.parse(meta.lastUpdate);
  return {
    lastUpdate: Number.isFinite(parsed) ? parsed : Date.now(),
    newJobsCount: Number(meta.newJobsCount || 0),
    pendingSubmissions: Number(meta.pendingSubmissions || 0),
    nextUpdate: meta.nextUpdate || "Wed 20:00 CET",
  };
}

function countJobs(orgs) {
  return orgs.reduce((sum, org) => sum + (org.jobs?.length || 0), 0);
}

function applyPalette(palette) {
  const map = palette === "warm" ? BASE_CATEGORY_COLORS : PALETTES[palette];
  if (!map) return;
  Object.entries(map).forEach(([k, v]) => {
    if (window.CATEGORIES[k]) window.CATEGORIES[k].color = v;
  });
}

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULS);
  applyPalette(tweaks.palette);

  const [orgs, setOrgs] = useState(() => window.ORGS || []);
  const [meta, setMeta] = useState(() => normalizeMeta(window.META));
  const [apiOnline, setApiOnline] = useState(false);
  const [visibleMapCount, setVisibleMapCount] = useState(() => countJobs(window.ORGS || []));

  const [filters, setFilters] = useState({
    cats: new Set(Object.keys(CATEGORIES)),
    kind: "all",      // role / project
    track: "all",     // intern / full-time / fellowship
    region: "all",
    entry: true,      // 0-3yrs only
  });
  const [search, setSearch] = useState("");
  const [view, setView] = useState("map");
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [hoverOrg, setHoverOrg] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submitHovered, setSubmitHovered] = useState(false);

  useEffect(() => {
    let alive = true;
    const endpoint = window.RESEARCH_MODE ? "/api/research/orgs" : "/api/orgs";
    fetch(endpoint, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("API unavailable");
        return res.json();
      })
      .then((data) => {
        if (!alive) return;
        if (Array.isArray(data.orgs)) {
          window.ORGS = data.orgs;
          setOrgs(data.orgs);
        }
        if (data.meta) {
          window.META = normalizeMeta(data.meta);
          setMeta(window.META);
        }
        setApiOnline(true);
      })
      .catch(() => {
        if (alive) setApiOnline(false);
      });
    return () => { alive = false; };
  }, []);

  // Filter logic
  const filtered = useMemo(() => {
    return orgs.flatMap(o => {
      if (!filters.cats.has(o.cat)) return [];
      if (filters.region !== "all") {
        const fn = REGION_BOUNDS[filters.region];
        if (fn && !fn(o.coord)) return [];
      }
      if (search) {
        const q = search.toLowerCase();
        if (!o.name.toLowerCase().includes(q) && !o.city.toLowerCase().includes(q) && !o.country.toLowerCase().includes(q)) return [];
      }
      // Job-level filters: org passes if any job matches
      const matchKind = (j) => filters.kind === "all" || j.type === filters.kind;
      const matchTrack = (j) => filters.track === "all" || j.track === filters.track;
      const matchEntry = (j) => !filters.entry || j.level === "0-3";
      const jobs = o.jobs.filter(j => matchKind(j) && matchTrack(j) && matchEntry(j));
      return jobs.length ? [{ ...o, jobs }] : [];
    });
  }, [orgs, filters, search]);

  // Keyboard: esc closes card / modal
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") {
        if (submitOpen) setSubmitOpen(false);
        else setSelectedOrg(null);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [submitOpen]);

  // Keep browser zoom out of the experience: shortcuts/pinch gestures belong
  // to the map, not to the page chrome.
  useEffect(() => {
    const blockPageZoomKeys = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (["+", "=", "-", "_", "0"].includes(e.key)) e.preventDefault();
    };
    const blockPagePinchWhenNoMap = (e) => {
      if ((e.ctrlKey || e.metaKey) && !document.querySelector(".sd-map")) e.preventDefault();
    };
    window.addEventListener("keydown", blockPageZoomKeys, { capture: true });
    document.addEventListener("wheel", blockPagePinchWhenNoMap, { passive: false, capture: true });
    return () => {
      window.removeEventListener("keydown", blockPageZoomKeys, { capture: true });
      document.removeEventListener("wheel", blockPagePinchWhenNoMap, { capture: true });
    };
  }, []);

  const totalJobCount = countJobs(filtered);
  const counterValue = view === "map" ? visibleMapCount : totalJobCount;
  const counterLabel = view === "map" && visibleMapCount < totalJobCount
    ? `of ${totalJobCount} jobs shown`
    : "jobs";

  return (
    <div className={`sd-root sd-font-${tweaks.fontFamily}`}>
      {/* meta tab — top left */}
      <div className="sd-meta-tab">
        <span className="sd-pulse" />
        <span>Updated {fmtRelative(meta.lastUpdate)}</span>
        <span className="sd-banner-sep">·</span>
        <span>{counterValue} {counterLabel}</span>
      </div>

      {/* submit button — top right, both pages */}
      <button
        className="sd-submit-fab"
        onClick={() => setSubmitOpen(true)}
        onMouseEnter={() => setSubmitHovered(true)}
        onMouseLeave={() => setSubmitHovered(false)}
      >
        {submitHovered ? "add a new one" : "some works missing?"}
      </button>

      {/* nav link — below submit button */}
      {window.RESEARCH_MODE ? (
        <a className="sd-research-link" href="/">← Social Design Jobs</a>
      ) : (
        <a className="sd-research-link" href="/research">Academic Research →</a>
      )}

      <div className={`sd-shell sd-shell-${tweaks.filterPosition}`}>
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          position={tweaks.filterPosition}
          search={search}
          setSearch={setSearch}
        />

        <div className="sd-stage">
          {view === "map" ? (
            <MapView
              orgs={filtered}
              palette={tweaks.palette}
              onSelectOrg={setSelectedOrg}
              selectedOrg={selectedOrg}
              hoverOrg={hoverOrg}
              onVisibleCount={setVisibleMapCount}
              onHover={(o, pos) => { setHoverOrg(o); if (pos) setHoverPos(pos); }}
            />
          ) : (
            <ListView orgs={filtered} onSelectOrg={setSelectedOrg} />
          )}
          {view === "map" && (
            <div className="sd-stage-counter" aria-label={`${counterValue} ${counterLabel}`}>
              <span>{counterValue}</span>
              <span className="sd-counter-label">{counterLabel}</span>
            </div>
          )}
        </div>
      </div>

      {/* view toggle — bottom left */}
      <div className="sd-view-toggle-fab">
        <button className={`sd-chip ${view === "map" ? "active" : ""}`} onClick={() => setView("map")}>Map</button>
        <button className={`sd-chip ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>List</button>
      </div>

      {hoverOrg && view === "map" && !selectedOrg && (
        <Tooltip x={hoverPos.x} y={hoverPos.y} org={hoverOrg} />
      )}

      {selectedOrg && (
        <OrgCard
          org={selectedOrg}
          onClose={() => setSelectedOrg(null)}
          position={tweaks.cardPosition}
          anchor={hoverPos}
        />
      )}

      <SubmitModal
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        meta={meta}
        apiOnline={apiOnline}
        endpoint={window.RESEARCH_MODE ? "/api/research/submissions" : "/api/submissions"}
        onSubmitted={(nextMeta) => {
          if (nextMeta) setMeta(normalizeMeta(nextMeta));
        }}
      />

      <Tweaks tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
}

function Tweaks({ tweaks, setTweak }) {
  return (
    <window.TweaksPanel title="Tweaks">
      <window.TweakSection label="Map">
        <window.TweakSelect label="Color palette" value={tweaks.palette} onChange={(v) => setTweak("palette", v)}
          options={[
            {label: "Warm (default)", value: "warm"},
            {label: "Cool", value: "cool"},
            {label: "Vivid", value: "vivid"},
            {label: "Mono", value: "mono"},
          ]}
        />
      </window.TweakSection>
      <window.TweakSection label="Card">
        <window.TweakRadio label="Position" value={tweaks.cardPosition} onChange={(v) => setTweak("cardPosition", v)}
          options={[{label: "Drawer", value: "drawer"}, {label: "Modal", value: "modal"}, {label: "Follow", value: "follow"}]}
        />
      </window.TweakSection>
      <window.TweakSection label="Layout">
        <window.TweakRadio label="Filters" value={tweaks.filterPosition} onChange={(v) => setTweak("filterPosition", v)}
          options={[{label: "Floating", value: "floating"}, {label: "Top", value: "top"}, {label: "Left", value: "left"}]}
        />
        <window.TweakRadio label="Font" value={tweaks.fontFamily} onChange={(v) => setTweak("fontFamily", v)}
          options={[{label: "Sans", value: "sans"}, {label: "Mono", value: "mono"}, {label: "Serif", value: "serif"}]}
        />
      </window.TweakSection>
    </window.TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
