const http = require("http");
const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
const DB_PATH = path.join(ROOT, "data", "socialdesignjobs.json");
const PORT = Number(process.env.PORT || 4173);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || (process.env.NODE_ENV === "production" ? "" : "jobmap2024");

const CATEGORY_KEYS = new Set([
  "studio",
  "lab",
  "civic",
  "climate",
  "ngo",
  "research",
  "consult",
  "community",
]);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jsx": "text/babel; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(body);
}

function sendText(res, status, text) {
  res.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
  res.end(text);
}

function redirect(res, location) {
  res.writeHead(302, { location });
  res.end();
}

async function readDb() {
  const raw = await fs.readFile(DB_PATH, "utf8");
  const db = JSON.parse(raw);
  db.orgs ||= [];
  db.submissions ||= [];
  db.meta ||= {};
  return db;
}

async function writeDb(db) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  const tmp = `${DB_PATH}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, `${JSON.stringify(db, null, 2)}\n`);
  await fs.rename(tmp, DB_PATH);
}

function publicMeta(db) {
  const pendingSubmissions = db.submissions.filter((s) => s.status === "pending").length;
  return {
    lastUpdate: db.meta.lastUpdate || new Date().toISOString(),
    newJobsCount: Number(db.meta.newJobsCount || 0),
    pendingSubmissions,
    nextUpdate: db.meta.nextUpdate || "Wed 20:00 CET",
  };
}

function isAdmin(req, url) {
  const token = req.headers["x-admin-token"] || url.searchParams.get("token") || "";
  if (!token || token.length !== ADMIN_TOKEN.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(ADMIN_TOKEN));
}

async function readJsonBody(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1_000_000) throw Object.assign(new Error("Payload too large"), { status: 413 });
  }
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw Object.assign(new Error("Invalid JSON"), { status: 400 });
  }
}

function cleanString(value, max = 200) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function cleanUrl(value) {
  const input = cleanString(value, 500);
  if (!input) return "";
  try {
    const url = new URL(input);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    return url.toString();
  } catch {
    return "";
  }
}

function slugify(value) {
  const slug = cleanString(value, 80)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `org-${Date.now()}`;
}

function parseCoord(payload) {
  if (Array.isArray(payload.coord) && payload.coord.length === 2) {
    const lng = Number(payload.coord[0]);
    const lat = Number(payload.coord[1]);
    if (Number.isFinite(lng) && Number.isFinite(lat)) return [lng, lat];
  }
  const lat = Number(payload.lat);
  const lng = Number(payload.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) return [lng, lat];
  return null;
}

function normalizeSubmission(payload) {
  const name = cleanString(payload.name, 120);
  const city = cleanString(payload.city, 80);
  const country = cleanString(payload.country, 80);
  const category = CATEGORY_KEYS.has(payload.category) ? payload.category : "studio";
  const errors = [];

  if (!name) errors.push("Organization is required.");
  if (!city) errors.push("City is required.");
  if (!country) errors.push("Country is required.");

  return {
    errors,
    submission: {
      id: `sub_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
      status: "pending",
      name,
      url: cleanUrl(payload.url),
      category,
      city,
      country,
      blurb: cleanString(payload.blurb, 500),
      jobTitle: cleanString(payload.jobTitle, 120),
      jobUrl: cleanUrl(payload.jobUrl),
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      approvedOrgId: null,
      coord: parseCoord(payload),
      source: "web",
    },
  };
}

function submissionToOrg(submission, updates = {}) {
  const merged = { ...submission, ...updates };
  const coord = parseCoord(merged);
  if (!coord) {
    const err = new Error("Latitude and longitude are required before approval.");
    err.status = 422;
    throw err;
  }

  const baseId = slugify(merged.name);
  const orgId = merged.approvedOrgId || baseId;
  const jobTitle = cleanString(merged.jobTitle, 120) || "Open positions";
  const jobTrack = ["intern", "full-time", "fellowship", "contract"].includes(merged.jobTrack)
    ? merged.jobTrack
    : "full-time";
  const jobType = ["role", "project"].includes(merged.jobType) ? merged.jobType : "role";
  const jobUrl = cleanUrl(merged.jobUrl);

  return {
    id: orgId,
    name: cleanString(merged.name, 120),
    cat: CATEGORY_KEYS.has(merged.category) ? merged.category : "studio",
    city: cleanString(merged.city, 80),
    country: cleanString(merged.country, 80),
    coord,
    url: cleanUrl(merged.url) || "#",
    blurb: cleanString(merged.blurb, 500) || "Submitted by the community for the social design jobs map.",
    jobs: [
      {
        title: jobTitle,
        type: jobType,
        track: jobTrack,
        level: "0-3",
        location: cleanString(merged.jobLocation, 100) || cleanString(merged.city, 80) || "See listing",
        remote: cleanString(merged.remote, 80),
        url: jobUrl,
      },
    ],
  };
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/health") {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "GET" && url.pathname === "/api/orgs") {
    const db = await readDb();
    return sendJson(res, 200, { orgs: db.orgs, meta: publicMeta(db) });
  }

  if (url.pathname === "/api/admin/orgs") {
    if (!isAdmin(req, url)) return sendJson(res, 401, { error: "Admin token required." });
    if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed." });

    const db = await readDb();
    const orgs = [...db.orgs].sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return sendJson(res, 200, { orgs, meta: publicMeta(db) });
  }

  const orgJobMatch = url.pathname.match(/^\/api\/admin\/orgs\/([^/]+)\/jobs\/(\d+)$/);
  if (orgJobMatch) {
    if (!isAdmin(req, url)) return sendJson(res, 401, { error: "Admin token required." });
    if (req.method !== "DELETE") return sendJson(res, 405, { error: "Method not allowed." });

    const orgId = decodeURIComponent(orgJobMatch[1]);
    const jobIndex = Number(orgJobMatch[2]);
    const db = await readDb();
    const orgIndex = db.orgs.findIndex((org) => org.id === orgId);
    if (orgIndex === -1) return sendJson(res, 404, { error: "Organization not found." });

    const org = db.orgs[orgIndex];
    if (!Array.isArray(org.jobs) || jobIndex < 0 || jobIndex >= org.jobs.length) {
      return sendJson(res, 404, { error: "Job point not found." });
    }

    const [removedJob] = org.jobs.splice(jobIndex, 1);
    let removedOrg = null;
    if (!org.jobs.length) {
      [removedOrg] = db.orgs.splice(orgIndex, 1);
    }
    db.meta.lastUpdate = new Date().toISOString();
    await writeDb(db);
    return sendJson(res, 200, { removedJob, removedOrg, meta: publicMeta(db) });
  }

  const orgMatch = url.pathname.match(/^\/api\/admin\/orgs\/([^/]+)$/);
  if (orgMatch) {
    if (!isAdmin(req, url)) return sendJson(res, 401, { error: "Admin token required." });
    if (req.method !== "DELETE") return sendJson(res, 405, { error: "Method not allowed." });

    const orgId = decodeURIComponent(orgMatch[1]);
    const db = await readDb();
    const orgIndex = db.orgs.findIndex((org) => org.id === orgId);
    if (orgIndex === -1) return sendJson(res, 404, { error: "Organization not found." });

    const [removedOrg] = db.orgs.splice(orgIndex, 1);
    db.meta.lastUpdate = new Date().toISOString();
    await writeDb(db);
    return sendJson(res, 200, { removedOrg, meta: publicMeta(db) });
  }

  if (req.method === "POST" && url.pathname === "/api/submissions") {
    const payload = await readJsonBody(req);
    const { errors, submission } = normalizeSubmission(payload);
    if (errors.length) return sendJson(res, 422, { errors });

    const db = await readDb();
    db.submissions.unshift(submission);
    await writeDb(db);
    return sendJson(res, 201, { submission, meta: publicMeta(db) });
  }

  if (url.pathname === "/api/submissions") {
    if (!isAdmin(req, url)) return sendJson(res, 401, { error: "Admin token required." });

    if (req.method === "GET") {
      const db = await readDb();
      const status = url.searchParams.get("status") || "pending";
      const submissions = db.submissions.filter((s) => status === "all" || s.status === status);
      return sendJson(res, 200, { submissions, meta: publicMeta(db) });
    }
  }

  const match = url.pathname.match(/^\/api\/submissions\/([^/]+)$/);
  if (match) {
    if (!isAdmin(req, url)) return sendJson(res, 401, { error: "Admin token required." });
    if (req.method !== "PATCH") return sendJson(res, 405, { error: "Method not allowed." });

    const id = decodeURIComponent(match[1]);
    const payload = await readJsonBody(req);
    const db = await readDb();
    const idx = db.submissions.findIndex((s) => s.id === id);
    if (idx === -1) return sendJson(res, 404, { error: "Submission not found." });

    const current = db.submissions[idx];
    if (payload.status === "rejected") {
      db.submissions[idx] = { ...current, status: "rejected", reviewedAt: new Date().toISOString() };
      await writeDb(db);
      return sendJson(res, 200, { submission: db.submissions[idx], meta: publicMeta(db) });
    }

    if (payload.status === "approved") {
      const updates = payload.updates || {};
      const org = submissionToOrg(current, updates);
      const existingOrgIndex = db.orgs.findIndex((o) => o.id === org.id);
      if (existingOrgIndex >= 0) db.orgs[existingOrgIndex] = org;
      else db.orgs.unshift(org);

      db.submissions[idx] = {
        ...current,
        ...updates,
        status: "approved",
        coord: org.coord,
        reviewedAt: new Date().toISOString(),
        approvedOrgId: org.id,
      };
      db.meta.lastUpdate = new Date().toISOString();
      db.meta.newJobsCount = Number(db.meta.newJobsCount || 0) + org.jobs.length;
      await writeDb(db);
      return sendJson(res, 200, { submission: db.submissions[idx], org, meta: publicMeta(db) });
    }

    return sendJson(res, 422, { error: "Use status \"approved\" or \"rejected\"." });
  }

  return sendJson(res, 404, { error: "API route not found." });
}

async function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") return redirect(res, "/socialdesignjobs/");
  if (pathname === "/map") return redirect(res, "/socialdesignjobs/");
  if (pathname === "/admin") return redirect(res, "/socialdesignjobs/admin.html");
  if (pathname === "/socialdesignjobs") return redirect(res, "/socialdesignjobs/");
  if (pathname === "/favicon.ico") {
    res.writeHead(204, { "cache-control": "public, max-age=86400" });
    res.end();
    return;
  }
  if (pathname.endsWith("/")) pathname += "index.html";

  const fullPath = path.normalize(path.join(ROOT, pathname));
  if (!fullPath.startsWith(ROOT)) return sendText(res, 403, "Forbidden");

  try {
    const stat = await fs.stat(fullPath);
    if (!stat.isFile()) return sendText(res, 404, "Not found");
    const ext = path.extname(fullPath).toLowerCase();
    const headers = {
      "content-type": MIME[ext] || "application/octet-stream",
      "cache-control": ext === ".html" ? "no-store" : "public, max-age=60",
    };
    res.writeHead(200, headers);
    fsSync.createReadStream(fullPath).pipe(res);
  } catch {
    sendText(res, 404, "Not found");
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  try {
    if (url.pathname.startsWith("/api/")) return await handleApi(req, res, url);
    return await serveStatic(req, res, url);
  } catch (error) {
    const status = error.status || 500;
    sendJson(res, status, { error: error.message || "Server error" });
  }
});

function listen(port, attempts = 0) {
  server.removeAllListeners("error");
  server.removeAllListeners("listening");
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && attempts < 20) {
      listen(port + 1, attempts + 1);
      return;
    }
    throw error;
  });
  server.once("listening", () => {
    const actual = server.address().port;
    console.log(`socialdesignjobs running at http://localhost:${actual}`);
    console.log(`admin page: http://localhost:${actual}/admin`);
  });
  server.listen(port);
}

listen(PORT);
