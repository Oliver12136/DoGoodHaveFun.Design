const CATEGORIES = {
  studio: "Social design studio",
  lab: "Public sector lab",
  civic: "Civic / gov tech",
  climate: "Sustainability & climate",
  ngo: "NGO design team",
  research: "Academic research lab",
  consult: "Impact consultancy",
  community: "Community collective",
};

const els = {
  login: document.getElementById("admin-login"),
  panel: document.getElementById("admin-panel"),
  token: document.getElementById("admin-token"),
  enter: document.getElementById("admin-enter"),
  loginError: document.getElementById("admin-login-error"),
  logout: document.getElementById("admin-logout"),
  status: document.getElementById("admin-status"),
  filter: document.getElementById("status-filter"),
  list: document.getElementById("submissions-list"),
};

let adminToken = sessionStorage.getItem("sdj_admin_token") || "";

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function setStatus(message, tone = "") {
  els.status.textContent = message || "";
  els.status.dataset.tone = tone;
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "content-type": "application/json",
      "x-admin-token": adminToken,
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.errors?.join(" ") || `Request failed (${res.status})`);
  return data;
}

function showPanel() {
  els.login.hidden = true;
  els.panel.hidden = false;
  loadSubmissions();
}

function showLogin() {
  els.panel.hidden = true;
  els.login.hidden = false;
  els.token.focus();
}

async function enter() {
  adminToken = els.token.value.trim();
  els.loginError.textContent = "";
  try {
    await api(`/api/submissions?status=${els.filter.value}`);
    sessionStorage.setItem("sdj_admin_token", adminToken);
    showPanel();
  } catch (error) {
    els.loginError.textContent = error.message;
  }
}

async function loadSubmissions() {
  setStatus("Loading…");
  els.list.innerHTML = "";
  try {
    const data = await api(`/api/submissions?status=${encodeURIComponent(els.filter.value)}`);
    renderSubmissions(data.submissions || []);
    setStatus(`${data.submissions?.length || 0} submissions`);
  } catch (error) {
    setStatus(error.message, "error");
    if (/token|unauthorized/i.test(error.message)) showLogin();
  }
}

function categoryOptions(active) {
  return Object.entries(CATEGORIES)
    .map(([key, label]) => `<option value="${key}" ${active === key ? "selected" : ""}>${esc(label)}</option>`)
    .join("");
}

function renderSubmissions(submissions) {
  if (!submissions.length) {
    els.list.innerHTML = `<div class="sd-admin-empty">No submissions in this view.</div>`;
    return;
  }

  els.list.innerHTML = submissions.map((sub) => {
    const coord = Array.isArray(sub.coord) ? sub.coord : ["", ""];
    const submitted = sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : "";
    return `
      <article class="sd-admin-card" data-id="${esc(sub.id)}">
        <div class="sd-admin-card-head">
          <div>
            <span class="sd-admin-pill">${esc(sub.status || "pending")}</span>
            <h2>${esc(sub.name)}</h2>
            <p>${esc(sub.city)}, ${esc(sub.country)} · ${submitted}</p>
          </div>
          ${sub.url ? `<a class="sd-admin-link" href="${esc(sub.url)}" target="_blank" rel="noreferrer">Website</a>` : ""}
        </div>

        <div class="sd-admin-grid">
          <label>Organization<input name="name" value="${esc(sub.name)}"></label>
          <label>Category<select name="category">${categoryOptions(sub.category)}</select></label>
          <label>City<input name="city" value="${esc(sub.city)}"></label>
          <label>Country<input name="country" value="${esc(sub.country)}"></label>
          <label>Longitude<input name="lng" type="number" step="0.0001" value="${esc(coord[0])}" placeholder="-0.1278"></label>
          <label>Latitude<input name="lat" type="number" step="0.0001" value="${esc(coord[1])}" placeholder="51.5074"></label>
          <label class="sd-admin-span">Website<input name="url" value="${esc(sub.url)}" placeholder="https://"></label>
          <label class="sd-admin-span">Blurb<textarea name="blurb" rows="3">${esc(sub.blurb)}</textarea></label>
          <label>Listing title<input name="jobTitle" value="${esc(sub.jobTitle || "Open positions")}"></label>
          <label>Listing URL<input name="jobUrl" value="${esc(sub.jobUrl)}" placeholder="https://"></label>
        </div>

        <div class="sd-admin-card-actions">
          <button class="sd-btn-primary" data-action="approve">Approve to map</button>
          <button class="sd-admin-danger" data-action="reject">Reject</button>
        </div>
      </article>
    `;
  }).join("");
}

function valuesFromCard(card) {
  const data = {};
  card.querySelectorAll("input, select, textarea").forEach((field) => {
    data[field.name] = field.value.trim();
  });
  return data;
}

async function handleListClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const card = button.closest(".sd-admin-card");
  const id = card?.dataset.id;
  if (!id) return;

  button.disabled = true;
  setStatus(button.dataset.action === "approve" ? "Approving…" : "Rejecting…");
  try {
    if (button.dataset.action === "reject") {
      await api(`/api/submissions/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "rejected" }),
      });
    } else {
      await api(`/api/submissions/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "approved", updates: valuesFromCard(card) }),
      });
    }
    await loadSubmissions();
  } catch (error) {
    setStatus(error.message, "error");
    button.disabled = false;
  }
}

els.enter.addEventListener("click", enter);
els.token.addEventListener("keydown", (event) => {
  if (event.key === "Enter") enter();
});
els.logout.addEventListener("click", () => {
  sessionStorage.removeItem("sdj_admin_token");
  adminToken = "";
  els.token.value = "";
  showLogin();
});
els.filter.addEventListener("change", loadSubmissions);
els.list.addEventListener("click", handleListClick);

if (adminToken) showPanel();
else showLogin();
