/* global React, ReactDOM */
const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ──────────────────────────────────────────────────────────────────────────
// Tooltip
// ──────────────────────────────────────────────────────────────────────────
function Tooltip({ x, y, org }) {
  if (!org) return null;
  return (
    <div className="sd-tooltip" style={{ left: x, top: y }}>
      <span className="sd-tt-name">{org.name}</span>
      {org._hoverJobTitle && <span className="sd-tt-city">{org._hoverJobTitle}</span>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Org Card (popup)
// ──────────────────────────────────────────────────────────────────────────
function OrgCard({ org, onClose, position, anchor }) {
  if (!org) return null;
  const cat = window.CATEGORIES[org.cat];

  const fmtJobLabel = (j) => {
    const bits = [];
    if (j.type === "project") bits.push("Project");
    else bits.push("Role");
    if (j.track === "intern") bits.push("Intern");
    else if (j.track === "fellowship") bits.push("Fellowship");
    else if (j.track === "contract") bits.push("Contract");
    else bits.push("Full-time");
    return bits.join(" · ");
  };

  let style = {};
  if (position === "drawer") {
    style = { right: 16, top: 16, bottom: 16, width: 380 };
  } else if (position === "modal") {
    style = { left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 420, maxHeight: "82vh" };
  } else if (position === "follow" && anchor) {
    const left = Math.min(anchor.x + 16, window.innerWidth - 400);
    const top = Math.min(anchor.y + 16, window.innerHeight - 460);
    style = { left, top, width: 380, maxHeight: 460 };
  }

  return (
    <>
      {position === "modal" && <div className="sd-card-backdrop" onClick={onClose} />}
      <div className="sd-card" style={style}>
        <div className="sd-card-head">
          <div className="sd-card-cat">
            <span className="sd-cat-dot" style={{ background: cat.color }} />
            <span>{cat.label}</span>
          </div>
          <button className="sd-card-close" onClick={onClose}>×</button>
        </div>
        <h2 className="sd-card-name">{org.name}</h2>
        <div className="sd-card-loc">{org.city}, {org.country}</div>
        <p className="sd-card-blurb">{org.blurb}</p>
        {org.url && org.url !== "#" && (
          <a className="sd-card-url" href={org.url} target="_blank" rel="noreferrer">
            {org.url.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
          </a>
        )}

        <div className="sd-card-jobs-head">
          <span>Open positions</span>
          <span className="sd-card-jobs-count">{org.jobs.length}</span>
        </div>
        <div className="sd-card-jobs">
          {org.jobs.map((j, i) => (
            <div key={i} className="sd-job">
              <div className="sd-job-title">{j.title}</div>
              <div className="sd-job-meta">
                <span className={`sd-tag sd-tag-${j.type}`}>{fmtJobLabel(j)}</span>
                <span className="sd-job-loc">{j.location}{j.remote ? ` · ${j.remote}` : ""}</span>
                {j.salary && <span className="sd-job-sal">{j.salary}</span>}
                {j.duration && <span className="sd-job-dur">{j.duration}</span>}
                {j.language && <span className="sd-job-lang">{j.language}</span>}
              </div>
              {j.url && (
                <a className="sd-job-link" href={j.url} target="_blank" rel="noreferrer">View listing ↗</a>
              )}
            </div>
          ))}
        </div>

        <div className="sd-card-foot">
          Updated {fmtRelative(window.META?.lastUpdate)} · Next refresh {window.META?.nextUpdate || "Wed 20:00 CET"}
        </div>
      </div>
    </>
  );
}

function fmtRelative(ts) {
  const value = typeof ts === "number" ? ts : Date.parse(ts);
  const diff = Date.now() - (Number.isFinite(value) ? value : Date.now());
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ──────────────────────────────────────────────────────────────────────────
// Submit modal (GitHub PR style)
// ──────────────────────────────────────────────────────────────────────────
function SubmitModal({ open, onClose, meta, apiOnline, onSubmitted }) {
  const emptyForm = { name: "", url: "", category: "studio", city: "", country: "", blurb: "", jobTitle: "", jobUrl: "" };
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [offline, setOffline] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [queueNumber, setQueueNumber] = useState(null);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setOffline(false);
      setStatus("idle");
      setError("");
      setQueueNumber(null);
    }
  }, [open]);

  if (!open) return null;
  const set = (k, v) => setForm({ ...form, [k]: v });
  const pending = Number(meta?.pendingSubmissions || 0);

  const saveOffline = () => {
    const entry = {
      ...form,
      id: `offline-${Date.now()}`,
      status: "pending",
      submittedAt: new Date().toISOString(),
      source: "local-fallback",
    };
    const pendingLocal = JSON.parse(localStorage.getItem("sdj_pending_offline") || "[]");
    pendingLocal.unshift(entry);
    localStorage.setItem("sdj_pending_offline", JSON.stringify(pendingLocal));
    setOffline(true);
    setQueueNumber(pending + 1);
    onSubmitted?.({ ...(meta || {}), pendingSubmissions: pending + 1 });
  };

  const submit = async () => {
    setError("");
    if (!form.name.trim() || !form.city.trim() || !form.country.trim()) {
      setError("Organization, city, and country are required.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.errors?.join(" ") || data.error || "Submission failed.");
      setQueueNumber(Number(data.meta?.pendingSubmissions || pending + 1));
      onSubmitted?.(data.meta);
      setSubmitted(true);
      setStatus("idle");
      setForm(emptyForm);
    } catch (err) {
      if (!apiOnline) {
        saveOffline();
        setSubmitted(true);
        setStatus("idle");
        setForm(emptyForm);
      } else {
        setError(err.message || "Submission failed.");
        setStatus("idle");
      }
    }
  };

  return (
    <div className="sd-card-backdrop" onClick={onClose}>
      <div className="sd-submit" onClick={(e) => e.stopPropagation()}>
        <div className="sd-submit-head">
          <div className="sd-pr-tag">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M5 3v10M11 3v6M5 3a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4zm0 8v2a2 2 0 002 2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>New submission</span>
          </div>
          <span className="sd-pr-status">{pending} pending</span>
          <button className="sd-card-close" onClick={onClose}>×</button>
        </div>

        {submitted ? (
          <div className="sd-submit-done">
            <div className="sd-submit-check">✓</div>
            <h3>{offline ? "Saved locally" : "Submitted"}</h3>
            <p>{offline ? "The API is offline, so this is stored in this browser for now." : `Thanks. Sits in the review queue with #${queueNumber || pending + 1}.`}</p>
            <button className="sd-btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="sd-submit-body">
              <Field label="Organization" v={form.name} on={(v) => set("name", v)} placeholder="e.g. Civic Design Lab" />
              <Field label="Website" v={form.url} on={(v) => set("url", v)} placeholder="https://" />
              <div className="sd-row-2">
                <Field label="City" v={form.city} on={(v) => set("city", v)} />
                <Field label="Country" v={form.country} on={(v) => set("country", v)} />
              </div>
              <div className="sd-field">
                <label>Category</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)}>
                  {Object.entries(window.CATEGORIES).map(([k, c]) => (
                    <option key={k} value={k}>{c.label}</option>
                  ))}
                </select>
              </div>
              <Field label="One-line description" v={form.blurb} on={(v) => set("blurb", v)} placeholder="What do they do?" />
              <Field label="Listing title" v={form.jobTitle} on={(v) => set("jobTitle", v)} placeholder="e.g. Junior Service Designer" />
              <Field label="Jobs page URL" v={form.jobUrl} on={(v) => set("jobUrl", v)} placeholder="https://" />
            </div>
            <div className="sd-submit-foot">
              <span className={`sd-pr-hint ${error ? "sd-submit-error" : ""}`}>{error || "Reviewed weekly. Wed 20:00 CET."}</span>
              <button className="sd-btn-primary" disabled={status === "submitting"} onClick={submit}>
                {status === "submitting" ? "Submitting…" : "Submit for review"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, v, on, placeholder }) {
  return (
    <div className="sd-field">
      <label>{label}</label>
      <input value={v} onChange={(e) => on(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

window.SDComponents = { Tooltip, OrgCard, SubmitModal, fmtRelative };
