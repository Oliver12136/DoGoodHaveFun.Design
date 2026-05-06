// World map: real dot positions extracted from designer SVG (812×398 viewBox).
// Dots are normalized to 0..1 (x=lng, y=lat in equirectangular SVG space).
//
// Provides:
//   WorldMap.loadDots()        → Promise<Array<{x, y}>>  in 0..1
//   WorldMap.projectLngLat(lng, lat)  → {x, y} in 0..1 matching the same projection
//
// SVG bounds: x ∈ [3, 811] / 812, y ∈ [1.7, 396.3] / 398.
// We assume the SVG covers approximately:
//   lng: -170..190 (centered ~0)  → roughly the visible world
//   lat:  85..-58
// We calibrate by aligning known anchor dots if needed.

(function () {
  let cached = null;

  // The SVG is approximately equirectangular but the designer cropped/projected it.
  // From inspecting the SVG: the western edge dots cluster at x ≈ 0.005-0.01, eastern at 0.99.
  // Latitude top dots ≈ 0.005, bottom ≈ 0.99.
  // We'll map lng/lat linearly into this 0..1 box with these calibrated bounds:
  const LNG_MIN = -169;
  const LNG_MAX = 191;
  const LAT_MAX = 84;
  const LAT_MIN = -58;

  async function loadDots() {
    if (cached) return cached;
    const res = await fetch("map-dots.json");
    const data = await res.json();
    cached = data;
    return data;
  }

  function projectLngLat(lng, lat) {
    const x = (lng - LNG_MIN) / (LNG_MAX - LNG_MIN);
    const y = (LAT_MAX - lat) / (LAT_MAX - LAT_MIN);
    return { x, y };
  }

  // Find nearest dot index given a normalized (x,y) target.
  // Used to "recolor" the closest map dot for an org point.
  function nearestDotIndex(dots, target) {
    let best = -1, bestD = Infinity;
    for (let i = 0; i < dots.length; i++) {
      const dx = dots[i].x - target.x;
      const dy = dots[i].y - target.y;
      const d = dx * dx + dy * dy;
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  window.WorldMap = { loadDots, projectLngLat, nearestDotIndex };
})();
