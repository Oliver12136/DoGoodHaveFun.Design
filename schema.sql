-- DoGood — Social Design Jobs Map
-- Cloudflare D1 schema

CREATE TABLE IF NOT EXISTS orgs (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  cat       TEXT NOT NULL,
  city      TEXT NOT NULL,
  country   TEXT NOT NULL,
  coord     TEXT NOT NULL DEFAULT '[]',
  url       TEXT NOT NULL DEFAULT '',
  blurb     TEXT NOT NULL DEFAULT '',
  jobs      TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS submissions (
  id              TEXT PRIMARY KEY,
  status          TEXT NOT NULL DEFAULT 'pending',
  name            TEXT NOT NULL,
  url             TEXT NOT NULL DEFAULT '',
  category        TEXT NOT NULL DEFAULT 'studio',
  city            TEXT NOT NULL,
  country         TEXT NOT NULL,
  blurb           TEXT NOT NULL DEFAULT '',
  job_title       TEXT NOT NULL DEFAULT '',
  job_url         TEXT NOT NULL DEFAULT '',
  coord_lng       REAL,
  coord_lat       REAL,
  approved_org_id TEXT,
  source          TEXT NOT NULL DEFAULT 'web',
  submitted_at    TEXT NOT NULL DEFAULT (datetime('now')),
  reviewed_at     TEXT
);

CREATE TABLE IF NOT EXISTS meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT OR IGNORE INTO meta (key, value) VALUES
  ('lastUpdate',   datetime('now')),
  ('newJobsCount', '0'),
  ('nextUpdate',   'Wed 20:00 CET');
