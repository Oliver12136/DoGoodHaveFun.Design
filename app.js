/* ── Config ── */
const CATEGORIES = {
  social:       { label: 'Social Design',      color: '#F59E0B' },
  public:       { label: 'Public Sector',       color: '#60A5FA' },
  sustainable:  { label: 'Sustainable Design',  color: '#34D399' },
  civic:        { label: 'Civic & Community',   color: '#A78BFA' },
  research:     { label: 'Design Research',     color: '#22D3EE' },
  humanitarian: { label: 'Humanitarian Design', color: '#F87171' }
};

const DOT_SPACING = 5;
const DOT_RADIUS  = 1.6;
const MARKER_R    = 6;

let companies   = [];
let activeFilter = 'all';
let projection, width, height;

/* ── Init ── */
window.addEventListener('DOMContentLoaded', async () => {
  resize();
  window.addEventListener('resize', debounce(resize, 150));
  await Promise.all([loadMap(), loadCompanies()]);
  renderMarkers();
  bindSearch();
  bindLegend();
  bindClose();
  updateWedChip();
  setInterval(updateWedChip, 60_000);
});

/* ── Resize ── */
function resize() {
  width  = window.innerWidth;
  height = window.innerHeight;
  const canvas = document.getElementById('map-canvas');
  canvas.width  = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width  = width  + 'px';
  canvas.style.height = height + 'px';

  const svg = document.getElementById('markers-svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  buildProjection();
  drawDotMap();
  if (companies.length) renderMarkers();
}

/* ── Projection ── */
function buildProjection() {
  projection = d3.geoNaturalEarth1()
    .scale(width / 6.1)
    .translate([width / 2, height / 2]);
}

/* ── Dotted world map ── */
async function loadMap() {
  const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
  const land  = topojson.feature(world, world.objects.land);
  window._land = land;
  drawDotMap();
}

function drawDotMap() {
  if (!window._land || !projection) return;
  const land = window._land;
  const canvas = document.getElementById('map-canvas');
  const ctx    = canvas.getContext('2d');
  const dpr    = devicePixelRatio;

  // background gradient
  const cx = width * 0.55 * dpr, cy = height * 0.5 * dpr;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.72 * dpr);
  grad.addColorStop(0,   '#2e2e32');
  grad.addColorStop(0.5, '#1e1e22');
  grad.addColorStop(1,   '#0f0f11');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // render land to temp canvas to determine land pixels quickly
  const tmp    = document.createElement('canvas');
  tmp.width    = width;
  tmp.height   = height;
  const tmpCtx = tmp.getContext('2d');
  const path   = d3.geoPath().projection(projection).context(tmpCtx);
  tmpCtx.beginPath();
  path(land);
  tmpCtx.fillStyle = '#fff';
  tmpCtx.fill();
  const imgData = tmpCtx.getImageData(0, 0, width, height).data;

  // draw dots on main canvas (scaled for dpr)
  ctx.fillStyle = 'rgba(255,255,255,0.68)';
  for (let x = 0; x < width; x += DOT_SPACING) {
    for (let y = 0; y < height; y += DOT_SPACING) {
      const i = (Math.floor(y) * width + Math.floor(x)) * 4;
      if (imgData[i + 3] > 128) {
        ctx.beginPath();
        ctx.arc(x * dpr, y * dpr, DOT_RADIUS * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // vignette overlay
  const vign = ctx.createRadialGradient(cx, cy, height * 0.3 * dpr, cx, cy, width * 0.78 * dpr);
  vign.addColorStop(0,   'rgba(0,0,0,0)');
  vign.addColorStop(0.7, 'rgba(0,0,0,0)');
  vign.addColorStop(1,   'rgba(0,0,0,0.72)');
  ctx.fillStyle = vign;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/* ── Load companies ── */
async function loadCompanies() {
  const res  = await fetch('data/companies.json');
  companies  = await res.json();
  const pending = JSON.parse(localStorage.getItem('sdm_pending') || '[]');
  // merge approved pending items
  const approved = pending.filter(p => p._approved);
  companies = [...companies, ...approved];
}

/* ── Render markers ── */
function renderMarkers() {
  const svg = document.getElementById('markers-svg');
  svg.innerHTML = '';

  companies.forEach(co => {
    const [px, py] = projection([co.lng, co.lat]) || [null, null];
    if (px == null || px < 0 || px > width || py < 0 || py > height) return;

    const cat   = CATEGORIES[co.category] || CATEGORIES.social;
    const g     = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'marker');
    g.setAttribute('data-id', co.id);
    g.setAttribute('transform', `translate(${px},${py})`);

    // pulse ring (for wed-active companies)
    if (co.wednesdayJobs && isWedActiveNow()) {
      const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulse.setAttribute('r', MARKER_R + 4);
      pulse.setAttribute('fill', 'none');
      pulse.setAttribute('stroke', cat.color);
      pulse.setAttribute('stroke-width', '1');
      pulse.setAttribute('opacity', '0.4');
      pulse.innerHTML = `<animate attributeName="r" from="${MARKER_R}" to="${MARKER_R+8}" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite"/>`;
      g.appendChild(pulse);
    }

    // white border
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('class', 'ring');
    ring.setAttribute('r', MARKER_R + 1.2);
    ring.setAttribute('fill', 'rgba(255,255,255,0.12)');
    g.appendChild(ring);

    // dot
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('class', 'dot');
    dot.setAttribute('r', MARKER_R);
    dot.setAttribute('fill', cat.color);
    dot.setAttribute('stroke', 'rgba(255,255,255,0.25)');
    dot.setAttribute('stroke-width', '1');
    g.appendChild(dot);

    g.addEventListener('click', () => showPopup(co));
    g.addEventListener('mouseenter', e => showTooltip(e, co.name));
    g.addEventListener('mouseleave', hideTooltip);

    svg.appendChild(g);
  });

  applyFilter(activeFilter, false);
}

/* ── Filter ── */
function applyFilter(cat, animate = true) {
  activeFilter = cat;
  document.querySelectorAll('.marker').forEach(m => {
    const id = m.getAttribute('data-id');
    const co = companies.find(c => c.id === id);
    if (!co) return;
    if (cat === 'all' || co.category === cat) {
      m.classList.remove('filtered-out', 'dimmed');
    } else {
      m.classList.add('dimmed');
      m.classList.remove('filtered-out');
    }
  });
}

function applySearchFilter(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.marker').forEach(m => {
    const id = m.getAttribute('data-id');
    const co = companies.find(c => c.id === id);
    if (!co) return;
    if (activeFilter !== 'all' && co.category !== activeFilter) {
      m.classList.add('dimmed');
      return;
    }
    if (!q) {
      m.classList.remove('filtered-out', 'dimmed');
      return;
    }
    const match = co.name.toLowerCase().includes(q) ||
                  co.city.toLowerCase().includes(q) ||
                  co.country.toLowerCase().includes(q) ||
                  (co.tags || []).some(t => t.toLowerCase().includes(q));
    m.classList.toggle('dimmed',       !match);
    m.classList.toggle('filtered-out', false);
  });
}

/* ── Popup ── */
function showPopup(co) {
  const cat    = CATEGORIES[co.category] || CATEGORIES.social;
  const popup  = document.getElementById('popup');
  document.getElementById('popup-category-bar').style.background = cat.color;
  document.getElementById('popup-name').textContent = co.name;
  document.getElementById('popup-location').textContent = `${co.city} · ${co.country}`;
  document.getElementById('popup-desc').textContent = co.description;

  const tagsEl = document.getElementById('popup-tags');
  tagsEl.innerHTML = '';
  (co.tags || []).forEach(t => {
    const span = document.createElement('span');
    span.className = 'popup-tag';
    span.textContent = t;
    tagsEl.appendChild(span);
  });

  const wedEl = document.getElementById('popup-wed');
  if (co.wednesdayJobs) {
    wedEl.classList.remove('hidden');
    wedEl.classList.toggle('active-today', isWedActiveNow());
  } else {
    wedEl.classList.add('hidden');
  }

  const linkEl = document.getElementById('popup-link');
  linkEl.href = co.website || '#';
  linkEl.textContent = '';
  const svg = `<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3"/><polyline points="9,1 15,1 15,7"/><line x1="15" y1="1" x2="7" y2="9"/></svg>`;
  linkEl.innerHTML = svg + ' Visit';

  popup.classList.remove('hidden');
  // re-trigger animation
  popup.style.animation = 'none';
  popup.offsetHeight;
  popup.style.animation = '';
}

function hidePopup() {
  document.getElementById('popup').classList.add('hidden');
}

/* ── Wednesday logic ── */
function isWedActiveNow() {
  const now = new Date();
  // CET = UTC+1 (or UTC+2 in summer)
  const cetOffset = getCETOffset();
  const cetMs     = now.getTime() + cetOffset * 3600_000;
  const cet       = new Date(cetMs);
  const day  = cet.getUTCDay();    // 3 = Wednesday
  const hour = cet.getUTCHours();
  return day === 3 && hour >= 20;
}

function getCETOffset() {
  // simple approximation: CEST (UTC+2) Mar–Oct, CET (UTC+1) rest
  const now   = new Date();
  const month = now.getUTCMonth(); // 0-based
  return (month >= 2 && month <= 9) ? 2 : 1;
}

function getNextWednesday8pmCET() {
  const cetOffset = getCETOffset();
  const now       = new Date();
  const cetMs     = now.getTime() + cetOffset * 3600_000;
  const cet       = new Date(cetMs);

  let dayOfWeek = cet.getUTCDay(); // 0=Sun…6=Sat
  const daysUntilWed = (3 - dayOfWeek + 7) % 7;
  let targetCet = new Date(cetMs);
  targetCet.setUTCDate(targetCet.getUTCDate() + daysUntilWed);
  targetCet.setUTCHours(20, 0, 0, 0);

  // if it's already past Wed 20:00, go to next week
  if (cetMs >= targetCet.getTime()) {
    targetCet.setUTCDate(targetCet.getUTCDate() + 7);
  }

  const diffMs = targetCet.getTime() - cetMs;
  return diffMs;
}

function updateWedChip() {
  const chip  = document.getElementById('wed-chip');
  const dot   = document.getElementById('wed-dot');
  const label = document.getElementById('wed-label');

  if (isWedActiveNow()) {
    dot.classList.remove('countdown');
    label.textContent = 'Jobs live now';
    return;
  }

  dot.classList.add('countdown');
  const ms    = getNextWednesday8pmCET();
  const h     = Math.floor(ms / 3_600_000);
  const m     = Math.floor((ms % 3_600_000) / 60_000);
  const days  = Math.floor(h / 24);
  const hrs   = h % 24;

  if (days > 0) {
    label.textContent = `Jobs in ${days}d ${hrs}h · Wed 20:00 CET`;
  } else if (hrs > 0) {
    label.textContent = `Jobs in ${hrs}h ${m}m · Wed 20:00 CET`;
  } else {
    label.textContent = `Jobs in ${m}m · Wed 20:00 CET`;
  }
}

/* ── Bind UI ── */
function bindSearch() {
  const input = document.getElementById('search-input');
  input.addEventListener('input', () => applySearchFilter(input.value));
}

function bindLegend() {
  document.querySelectorAll('.legend-dot').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.legend-dot').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      applyFilter(cat);
      const input = document.getElementById('search-input');
      if (input.value) applySearchFilter(input.value);
    });
  });
}

function bindClose() {
  document.getElementById('popup-close').addEventListener('click', hidePopup);
  document.getElementById('map-canvas').addEventListener('click', hidePopup);
}

/* ── Tooltip ── */
function showTooltip(e, text) {
  const t = document.getElementById('tooltip');
  t.textContent = text;
  t.classList.add('visible');
  moveTooltip(e);
  document.addEventListener('mousemove', _moveTooltip);
}
function _moveTooltip(e) { moveTooltip(e); }
function moveTooltip(e) {
  const t = document.getElementById('tooltip');
  t.style.left = (e.clientX + 14) + 'px';
  t.style.top  = (e.clientY - 28) + 'px';
}
function hideTooltip() {
  document.getElementById('tooltip').classList.remove('visible');
  document.removeEventListener('mousemove', _moveTooltip);
}

/* ── Util ── */
function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}
