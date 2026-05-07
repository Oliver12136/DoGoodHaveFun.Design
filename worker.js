/**
 * DoGood — Social Design Jobs Map
 * Cloudflare Worker: API layer over D1, static assets via env.ASSETS
 */

const CATEGORY_KEYS = new Set([
  "studio", "lab", "civic", "climate",
  "ngo", "research", "consult", "community",
]);
const RESEARCH_CATEGORY_KEYS = new Set([
  "sustain", "inclusion", "embodied", "urban",
  "culture", "migration", "postcolonial", "health",
]);

/* ── Response helpers ─────────────────────────────────────────────────────── */
function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extra,
    },
  });
}

/* ── Auth ─────────────────────────────────────────────────────────────────── */
function isAdmin(request, env) {
  const url = new URL(request.url);
  const token =
    request.headers.get("x-admin-token") ||
    url.searchParams.get("token") ||
    "";
  const adminToken = env.ADMIN_TOKEN || "";
  if (!token || !adminToken || token.length !== adminToken.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ adminToken.charCodeAt(i);
  }
  return diff === 0;
}

/* ── D1 helpers ───────────────────────────────────────────────────────────── */
async function getMeta(db) {
  const [rows, pending] = await Promise.all([
    db.prepare("SELECT key, value FROM meta").all(),
    db.prepare("SELECT COUNT(*) AS n FROM submissions WHERE status='pending'").first(),
  ]);
  const m = {};
  for (const r of rows.results) m[r.key] = r.value;
  return {
    lastUpdate: m.lastUpdate || new Date().toISOString(),
    newJobsCount: Number(m.newJobsCount || 0),
    pendingSubmissions: pending?.n ?? 0,
    nextUpdate: m.nextUpdate || "Wed 20:00 CET",
  };
}

function rowToOrg(row) {
  return {
    id: row.id,
    name: row.name,
    cat: row.cat,
    city: row.city,
    country: row.country,
    coord: JSON.parse(row.coord || "[0,0]"),
    url: row.url || "",
    blurb: row.blurb || "",
    jobs: JSON.parse(row.jobs || "[]"),
    groups: JSON.parse(row.groups || "[]"),
  };
}

function rowToSubmission(row) {
  return {
    id: row.id,
    status: row.status,
    name: row.name,
    url: row.url || "",
    category: row.category,
    city: row.city,
    country: row.country,
    blurb: row.blurb || "",
    jobTitle: row.job_title || "",
    jobUrl: row.job_url || "",
    coord: row.coord_lng != null ? [row.coord_lng, row.coord_lat] : null,
    approvedOrgId: row.approved_org_id || null,
    source: row.source,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at || null,
  };
}

/* ── Sanitisation ─────────────────────────────────────────────────────────── */
function clean(v, max = 200) {
  return String(v || "").replace(/\s+/g, " ").trim().slice(0, max);
}
function cleanUrl(v) {
  const s = clean(v, 500);
  if (!s) return "";
  try {
    const u = new URL(s);
    return ["http:", "https:"].includes(u.protocol) ? u.toString() : "";
  } catch { return ""; }
}
function slugify(v) {
  const s = clean(v, 80)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/, "");
  return s || `org-${Date.now()}`;
}
function parseCoord(p) {
  if (Array.isArray(p?.coord) && p.coord.length === 2) {
    const [lng, lat] = [Number(p.coord[0]), Number(p.coord[1])];
    if (isFinite(lng) && isFinite(lat)) return [lng, lat];
  }
  const lat = Number(p?.lat), lng = Number(p?.lng);
  if (isFinite(lat) && isFinite(lng)) return [lng, lat];
  return null;
}
function normalizeSubmission(p) {
  const name = clean(p.name, 120);
  const city = clean(p.city, 80);
  const country = clean(p.country, 80);
  const errors = [];
  if (!name) errors.push("Organization is required.");
  if (!city)  errors.push("City is required.");
  if (!country) errors.push("Country is required.");
  return {
    errors,
    sub: {
      id: `sub_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
      status: "pending",
      name, city, country,
      url: cleanUrl(p.url),
      category: CATEGORY_KEYS.has(p.category) ? p.category : "studio",
      blurb: clean(p.blurb, 500),
      job_title: clean(p.jobTitle, 120),
      job_url: cleanUrl(p.jobUrl),
      coord: parseCoord(p),
      source: "web",
    },
  };
}
function normalizeResearchSubmission(p) {
  const name = clean(p.name, 120);
  const city = clean(p.city, 80);
  const country = clean(p.country, 80);
  const errors = [];
  if (!name) errors.push("Organization is required.");
  if (!city)  errors.push("City is required.");
  if (!country) errors.push("Country is required.");
  return {
    errors,
    sub: {
      id: `rsub_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
      status: "pending",
      name, city, country,
      url: cleanUrl(p.url),
      category: RESEARCH_CATEGORY_KEYS.has(p.category) ? p.category : "sustain",
      blurb: clean(p.blurb, 500),
      job_title: clean(p.jobTitle, 120),
      job_url: cleanUrl(p.jobUrl),
      coord: parseCoord(p),
      source: "research-web",
    },
  };
}
async function geocodeCity(query) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`;
    const res = await fetch(url, { headers: { "Accept-Language": "en", "User-Agent": "JobMapWorker/1.0" } });
    const data = await res.json();
    if (data?.[0]) return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
  } catch { }
  return null;
}

function submissionToOrg(sub, updates = {}) {
  const merged = { ...sub, ...updates };
  const coord = parseCoord(merged);
  const jobTrack = ["intern","full-time","fellowship","contract"].includes(merged.jobTrack)
    ? merged.jobTrack : "full-time";
  const jobType = ["role","project"].includes(merged.jobType) ? merged.jobType : "role";
  return {
    id: merged.approvedOrgId || slugify(merged.name),
    name: clean(merged.name, 120),
    cat: CATEGORY_KEYS.has(merged.category) ? merged.category : "studio",
    city: clean(merged.city, 80),
    country: clean(merged.country, 80),
    coord,
    url: cleanUrl(merged.url) || "#",
    blurb: clean(merged.blurb, 500) || "Submitted by the community.",
    jobs: [{
      title: clean(merged.jobTitle || merged.job_title, 120) || "Open positions",
      type: jobType,
      track: jobTrack,
      level: "0-3",
      location: clean(merged.jobLocation, 100) || clean(merged.city, 80) || "See listing",
      remote: clean(merged.remote, 80),
      url: cleanUrl(merged.jobUrl || merged.job_url),
    }],
  };
}

/* ── JSON body reader ─────────────────────────────────────────────────────── */
async function readBody(request) {
  const ct = request.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return {};
  const text = await request.text();
  if (!text.trim()) return {};
  try { return JSON.parse(text); }
  catch { const e = new Error("Invalid JSON"); e.status = 400; throw e; }
}

/* ── API router ───────────────────────────────────────────────────────────── */
async function handleApi(request, url, env) {
  const { DB } = env;
  const method = request.method;
  const path   = url.pathname;

  /* health */
  if (method === "GET" && path === "/api/health") {
    return json({ ok: true });
  }

  /* public orgs list */
  if (method === "GET" && path === "/api/orgs") {
    const [rows, meta] = await Promise.all([
      DB.prepare("SELECT * FROM orgs ORDER BY name ASC").all(),
      getMeta(DB),
    ]);
    return json({ orgs: rows.results.map(rowToOrg), meta });
  }

  /* ── admin orgs ── */
  if (path === "/api/admin/orgs") {
    if (!isAdmin(request, env)) return json({ error: "Admin token required." }, 401);
    if (method !== "GET") return json({ error: "Method not allowed." }, 405);
    const [rows, meta] = await Promise.all([
      DB.prepare("SELECT * FROM orgs ORDER BY name ASC").all(),
      getMeta(DB),
    ]);
    return json({ orgs: rows.results.map(rowToOrg), meta });
  }

  /* PATCH /api/admin/orgs/:id — update coord (and optionally other fields) */
  const orgPatchMatch = path.match(/^\/api\/admin\/orgs\/([^/]+)$/);
  if (orgPatchMatch && method === "PATCH") {
    if (!isAdmin(request, env)) return json({ error: "Admin token required." }, 401);
    const orgId = decodeURIComponent(orgPatchMatch[1]);
    const body  = await request.json().catch(() => ({}));
    const sets = []; const binds = [];
    if (Array.isArray(body.coord) && body.coord.length === 2) {
      const [lng, lat] = [Number(body.coord[0]), Number(body.coord[1])];
      if (Number.isFinite(lng) && Number.isFinite(lat)) {
        sets.push("coord = ?"); binds.push(JSON.stringify([lng, lat]));
      }
    }
    if (body.city    != null) { sets.push("city = ?");    binds.push(String(body.city).slice(0, 80)); }
    if (body.country != null) { sets.push("country = ?"); binds.push(String(body.country).slice(0, 80)); }
    if (body.name    != null) { sets.push("name = ?");    binds.push(String(body.name).slice(0, 120)); }
    if (body.blurb   != null) { sets.push("blurb = ?");   binds.push(String(body.blurb).slice(0, 500)); }
    if (body.url     != null) { sets.push("url = ?");     binds.push(String(body.url).slice(0, 300)); }
    if (body.cat     != null) { sets.push("cat = ?");     binds.push(String(body.cat).slice(0, 30)); }
    if (!sets.length) return json({ error: "Nothing to update." }, 400);
    binds.push(orgId);
    const result = await DB.prepare(`UPDATE orgs SET ${sets.join(", ")} WHERE id = ?`).bind(...binds).run();
    if (!result.meta.changes) return json({ error: "Organization not found." }, 404);
    await DB.prepare("INSERT OR REPLACE INTO meta (key,value) VALUES ('lastUpdate',?)").bind(new Date().toISOString()).run();
    return json({ ok: true, meta: await getMeta(DB) });
  }

  /* DELETE /api/admin/orgs/:id/jobs/:index */
  const jobMatch = path.match(/^\/api\/admin\/orgs\/([^/]+)\/jobs\/(\d+)$/);
  if (jobMatch) {
    if (!isAdmin(request, env)) return json({ error: "Admin token required." }, 401);
    if (method !== "DELETE") return json({ error: "Method not allowed." }, 405);
    const orgId   = decodeURIComponent(jobMatch[1]);
    const jobIdx  = Number(jobMatch[2]);
    const row = await DB.prepare("SELECT * FROM orgs WHERE id = ?").bind(orgId).first();
    if (!row) return json({ error: "Organization not found." }, 404);
    const jobs = JSON.parse(row.jobs || "[]");
    if (jobIdx < 0 || jobIdx >= jobs.length) return json({ error: "Job not found." }, 404);
    const [removed] = jobs.splice(jobIdx, 1);
    if (jobs.length === 0) {
      await DB.prepare("DELETE FROM orgs WHERE id = ?").bind(orgId).run();
      await DB.prepare("INSERT OR REPLACE INTO meta (key,value) VALUES ('lastUpdate',?)")
        .bind(new Date().toISOString()).run();
      return json({ removedJob: removed, removedOrg: rowToOrg(row), meta: await getMeta(DB) });
    }
    await DB.prepare("UPDATE orgs SET jobs = ? WHERE id = ?")
      .bind(JSON.stringify(jobs), orgId).run();
    await DB.prepare("INSERT OR REPLACE INTO meta (key,value) VALUES ('lastUpdate',?)")
      .bind(new Date().toISOString()).run();
    return json({ removedJob: removed, removedOrg: null, meta: await getMeta(DB) });
  }

  /* DELETE /api/admin/orgs/:id */
  const orgMatch = path.match(/^\/api\/admin\/orgs\/([^/]+)$/);
  if (orgMatch) {
    if (!isAdmin(request, env)) return json({ error: "Admin token required." }, 401);
    if (method !== "DELETE") return json({ error: "Method not allowed." }, 405);
    const orgId = decodeURIComponent(orgMatch[1]);
    const row = await DB.prepare("SELECT * FROM orgs WHERE id = ?").bind(orgId).first();
    if (!row) return json({ error: "Organization not found." }, 404);
    await DB.prepare("DELETE FROM orgs WHERE id = ?").bind(orgId).run();
    await DB.prepare("INSERT OR REPLACE INTO meta (key,value) VALUES ('lastUpdate',?)")
      .bind(new Date().toISOString()).run();
    return json({ removedOrg: rowToOrg(row), meta: await getMeta(DB) });
  }

  /* ── submissions ── */
  if (path === "/api/submissions") {
    /* public POST */
    if (method === "POST") {
      const payload = await readBody(request);
      const { errors, sub } = normalizeSubmission(payload);
      if (errors.length) return json({ errors }, 422);
      const coord = sub.coord;
      await DB.prepare(
        `INSERT INTO submissions
          (id,status,name,url,category,city,country,blurb,job_title,job_url,coord_lng,coord_lat,source)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`
      ).bind(
        sub.id, sub.status, sub.name, sub.url, sub.category,
        sub.city, sub.country, sub.blurb, sub.job_title, sub.job_url,
        coord ? coord[0] : null, coord ? coord[1] : null, sub.source
      ).run();
      return json({ submission: rowToSubmission({ ...sub, coord_lng: coord?.[0], coord_lat: coord?.[1] }), meta: await getMeta(DB) }, 201);
    }
    /* admin GET */
    if (method === "GET") {
      if (!isAdmin(request, env)) return json({ error: "Admin token required." }, 401);
      const status = url.searchParams.get("status") || "pending";
      const rows = status === "all"
        ? await DB.prepare("SELECT * FROM submissions ORDER BY submitted_at DESC").all()
        : await DB.prepare("SELECT * FROM submissions WHERE status = ? ORDER BY submitted_at DESC").bind(status).all();
      return json({ submissions: rows.results.map(rowToSubmission), meta: await getMeta(DB) });
    }
    return json({ error: "Method not allowed." }, 405);
  }

  /* PATCH /api/submissions/:id */
  const subMatch = path.match(/^\/api\/submissions\/([^/]+)$/);
  if (subMatch) {
    if (!isAdmin(request, env)) return json({ error: "Admin token required." }, 401);
    if (method !== "PATCH") return json({ error: "Method not allowed." }, 405);
    const id      = decodeURIComponent(subMatch[1]);
    const payload = await readBody(request);
    const row     = await DB.prepare("SELECT * FROM submissions WHERE id = ?").bind(id).first();
    if (!row) return json({ error: "Submission not found." }, 404);

    if (payload.status === "rejected") {
      await DB.prepare("UPDATE submissions SET status='rejected', reviewed_at=? WHERE id=?")
        .bind(new Date().toISOString(), id).run();
      const updated = await DB.prepare("SELECT * FROM submissions WHERE id=?").bind(id).first();
      return json({ submission: rowToSubmission(updated), meta: await getMeta(DB) });
    }

    if (payload.status === "approved") {
      const sub = rowToSubmission(row);
      const org = submissionToOrg(sub, payload.updates || {});
      if (!org.coord) {
        org.coord = await geocodeCity(`${org.city}, ${org.country}`) || [0, 0];
      }
      const coordStr = JSON.stringify(org.coord);
      const jobsStr  = JSON.stringify(org.jobs);
      await DB.prepare(
        `INSERT INTO orgs (id,name,cat,city,country,coord,url,blurb,jobs)
         VALUES (?,?,?,?,?,?,?,?,?)
         ON CONFLICT(id) DO UPDATE SET
           name=excluded.name, cat=excluded.cat, city=excluded.city,
           country=excluded.country, coord=excluded.coord, url=excluded.url,
           blurb=excluded.blurb, jobs=excluded.jobs`
      ).bind(org.id, org.name, org.cat, org.city, org.country,
             coordStr, org.url, org.blurb, jobsStr).run();
      const now = new Date().toISOString();
      await DB.prepare("UPDATE submissions SET status='approved', reviewed_at=?, approved_org_id=?, coord_lng=?, coord_lat=? WHERE id=?")
        .bind(now, org.id, org.coord[0], org.coord[1], id).run();
      await DB.prepare("INSERT OR REPLACE INTO meta (key,value) VALUES ('lastUpdate',?)")
        .bind(now).run();
      const newCount = await DB.prepare("SELECT value FROM meta WHERE key='newJobsCount'").first();
      await DB.prepare("INSERT OR REPLACE INTO meta (key,value) VALUES ('newJobsCount',?)")
        .bind(String(Number(newCount?.value || 0) + org.jobs.length)).run();
      const updated = await DB.prepare("SELECT * FROM submissions WHERE id=?").bind(id).first();
      return json({ submission: rowToSubmission(updated), org, meta: await getMeta(DB) });
    }

    return json({ error: 'Use status "approved" or "rejected".' }, 422);
  }

  /* ── public: research orgs ── */
  if (method === "GET" && path === "/api/research/orgs") {
    const rows = await DB.prepare("SELECT * FROM research_orgs ORDER BY name ASC").all();
    return json({ orgs: rows.results.map(rowToOrg) });
  }

  /* ── admin: research orgs ── */
  if (path === "/api/admin/research/orgs") {
    if (!isAdmin(request, env)) return json({ error: "Admin token required." }, 401);
    if (method !== "GET") return json({ error: "Method not allowed." }, 405);
    const rows = await DB.prepare("SELECT * FROM research_orgs ORDER BY name ASC").all();
    return json({ orgs: rows.results.map(rowToOrg) });
  }

  /* PATCH /api/admin/research/orgs/:id */
  const rOrgPatchMatch = path.match(/^\/api\/admin\/research\/orgs\/([^/]+)$/);
  if (rOrgPatchMatch && method === "PATCH") {
    if (!isAdmin(request, env)) return json({ error: "Admin token required." }, 401);
    const orgId = decodeURIComponent(rOrgPatchMatch[1]);
    const body  = await request.json().catch(() => ({}));
    const sets = []; const binds = [];
    if (Array.isArray(body.coord) && body.coord.length === 2) {
      const [lng, lat] = [Number(body.coord[0]), Number(body.coord[1])];
      if (Number.isFinite(lng) && Number.isFinite(lat)) {
        sets.push("coord = ?"); binds.push(JSON.stringify([lng, lat]));
      }
    }
    if (body.city    != null) { sets.push("city = ?");    binds.push(String(body.city).slice(0, 80)); }
    if (body.country != null) { sets.push("country = ?"); binds.push(String(body.country).slice(0, 80)); }
    if (body.name    != null) { sets.push("name = ?");    binds.push(String(body.name).slice(0, 120)); }
    if (body.blurb   != null) { sets.push("blurb = ?");   binds.push(String(body.blurb).slice(0, 500)); }
    if (body.url     != null) { sets.push("url = ?");     binds.push(String(body.url).slice(0, 300)); }
    if (body.cat     != null) { sets.push("cat = ?");     binds.push(String(body.cat).slice(0, 30)); }
    if (Array.isArray(body.groups)) {
      sets.push("groups = ?"); binds.push(JSON.stringify(body.groups));
    }
    if (!sets.length) return json({ error: "Nothing to update." }, 400);
    binds.push(orgId);
    const result = await DB.prepare(`UPDATE research_orgs SET ${sets.join(", ")} WHERE id = ?`).bind(...binds).run();
    if (!result.meta.changes) return json({ error: "Lab not found." }, 404);
    return json({ ok: true });
  }

  /* DELETE /api/admin/research/orgs/:id/jobs/:index */
  const rJobMatch = path.match(/^\/api\/admin\/research\/orgs\/([^/]+)\/jobs\/(\d+)$/);
  if (rJobMatch) {
    if (!isAdmin(request, env)) return json({ error: "Admin token required." }, 401);
    if (method !== "DELETE") return json({ error: "Method not allowed." }, 405);
    const orgId  = decodeURIComponent(rJobMatch[1]);
    const jobIdx = Number(rJobMatch[2]);
    const row = await DB.prepare("SELECT * FROM research_orgs WHERE id = ?").bind(orgId).first();
    if (!row) return json({ error: "Organization not found." }, 404);
    const jobs = JSON.parse(row.jobs || "[]");
    if (jobIdx < 0 || jobIdx >= jobs.length) return json({ error: "Job not found." }, 404);
    const [removed] = jobs.splice(jobIdx, 1);
    if (jobs.length === 0) {
      await DB.prepare("DELETE FROM research_orgs WHERE id = ?").bind(orgId).run();
      return json({ removedJob: removed, removedOrg: rowToOrg(row) });
    }
    await DB.prepare("UPDATE research_orgs SET jobs = ? WHERE id = ?")
      .bind(JSON.stringify(jobs), orgId).run();
    return json({ removedJob: removed, removedOrg: null });
  }

  /* DELETE /api/admin/research/orgs/:id */
  const rOrgMatch = path.match(/^\/api\/admin\/research\/orgs\/([^/]+)$/);
  if (rOrgMatch) {
    if (!isAdmin(request, env)) return json({ error: "Admin token required." }, 401);
    if (method !== "DELETE") return json({ error: "Method not allowed." }, 405);
    const orgId = decodeURIComponent(rOrgMatch[1]);
    const row = await DB.prepare("SELECT * FROM research_orgs WHERE id = ?").bind(orgId).first();
    if (!row) return json({ error: "Organization not found." }, 404);
    await DB.prepare("DELETE FROM research_orgs WHERE id = ?").bind(orgId).run();
    return json({ removedOrg: rowToOrg(row) });
  }

  /* ── admin: research submissions ── */
  if (path === "/api/admin/research/submissions") {
    if (!isAdmin(request, env)) return json({ error: "Admin token required." }, 401);
    if (method === "GET") {
      const status = url.searchParams.get("status") || "pending";
      const rows = status === "all"
        ? await DB.prepare("SELECT * FROM research_submissions ORDER BY submitted_at DESC").all()
        : await DB.prepare("SELECT * FROM research_submissions WHERE status = ? ORDER BY submitted_at DESC").bind(status).all();
      return json({ submissions: rows.results.map(rowToSubmission) });
    }
    return json({ error: "Method not allowed." }, 405);
  }

  /* PATCH /api/admin/research/submissions/:id */
  const rsubMatch = path.match(/^\/api\/admin\/research\/submissions\/([^/]+)$/);
  if (rsubMatch) {
    if (!isAdmin(request, env)) return json({ error: "Admin token required." }, 401);
    if (method !== "PATCH") return json({ error: "Method not allowed." }, 405);
    const id = decodeURIComponent(rsubMatch[1]);
    const payload = await readBody(request);
    const row = await DB.prepare("SELECT * FROM research_submissions WHERE id = ?").bind(id).first();
    if (!row) return json({ error: "Submission not found." }, 404);
    if (payload.status === "rejected") {
      await DB.prepare("UPDATE research_submissions SET status='rejected', reviewed_at=? WHERE id=?")
        .bind(new Date().toISOString(), id).run();
      const updated = await DB.prepare("SELECT * FROM research_submissions WHERE id=?").bind(id).first();
      return json({ submission: rowToSubmission(updated) });
    }
    if (payload.status === "approved") {
      const sub = rowToSubmission(row);
      const org = submissionToOrg(sub, { ...(payload.updates || {}), category: undefined });
      // Use research category if valid, else sustain
      org.cat = RESEARCH_CATEGORY_KEYS.has(payload.updates?.category || sub.category)
        ? (payload.updates?.category || sub.category) : "sustain";
      if (!org.coord) {
        org.coord = await geocodeCity(`${org.city}, ${org.country}`) || [0, 0];
      }
      const coordStr = JSON.stringify(org.coord);
      const jobsStr  = JSON.stringify(org.jobs);
      await DB.prepare(
        `INSERT INTO research_orgs (id,name,cat,city,country,coord,url,blurb,jobs)
         VALUES (?,?,?,?,?,?,?,?,?)
         ON CONFLICT(id) DO UPDATE SET
           name=excluded.name, cat=excluded.cat, city=excluded.city,
           country=excluded.country, coord=excluded.coord, url=excluded.url,
           blurb=excluded.blurb, jobs=excluded.jobs`
      ).bind(org.id, org.name, org.cat, org.city, org.country,
             coordStr, org.url, org.blurb, jobsStr).run();
      await DB.prepare("UPDATE research_submissions SET status='approved', reviewed_at=? WHERE id=?")
        .bind(new Date().toISOString(), id).run();
      const updated = await DB.prepare("SELECT * FROM research_submissions WHERE id=?").bind(id).first();
      return json({ submission: rowToSubmission(updated), org });
    }
    return json({ error: 'Use status "approved" or "rejected".' }, 422);
  }

  /* ── research submissions (separate table) ── */
  if (path === "/api/research/submissions") {
    if (method === "POST") {
      const payload = await readBody(request);
      const { errors, sub } = normalizeResearchSubmission(payload);
      if (errors.length) return json({ errors }, 422);
      const coord = sub.coord;
      await DB.prepare(
        `INSERT INTO research_submissions
          (id,status,name,url,category,city,country,blurb,job_title,job_url,coord_lng,coord_lat,source)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`
      ).bind(
        sub.id, sub.status, sub.name, sub.url, sub.category,
        sub.city, sub.country, sub.blurb, sub.job_title, sub.job_url,
        coord ? coord[0] : null, coord ? coord[1] : null, sub.source
      ).run();
      const pending = await DB.prepare("SELECT COUNT(*) AS n FROM research_submissions WHERE status='pending'").first();
      return json({ submission: sub, meta: { pendingSubmissions: pending?.n ?? 1 } }, 201);
    }
    if (method === "GET") {
      if (!isAdmin(request, env)) return json({ error: "Admin token required." }, 401);
      const status = url.searchParams.get("status") || "pending";
      const rows = status === "all"
        ? await DB.prepare("SELECT * FROM research_submissions ORDER BY submitted_at DESC").all()
        : await DB.prepare("SELECT * FROM research_submissions WHERE status = ? ORDER BY submitted_at DESC").bind(status).all();
      return json({ submissions: rows.results.map(rowToSubmission) });
    }
    return json({ error: "Method not allowed." }, 405);
  }

  return json({ error: "API route not found." }, 404);
}

/* ── Main entry ───────────────────────────────────────────────────────────── */
export default {
  async fetch(request, env, ctx) {
    const url    = new URL(request.url);
    const path   = url.pathname;

    try {
      /* API */
      if (path.startsWith("/api/")) {
        const res = await handleApi(request, url, env);
        res.headers.set("access-control-allow-origin", "*");
        return res;
      }

      /* CORS preflight */
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS", "access-control-allow-headers": "content-type,x-admin-token" } });
      }

      /* root → index */
      if (path === "/" || path === "") {
        return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request));
      }

      /* Static assets */
      return env.ASSETS.fetch(request);
    } catch (err) {
      return json({ error: err.message || "Server error" }, err.status || 500);
    }
  },
};
