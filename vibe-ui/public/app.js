// Content Planner – GUI für /ui-api
// Alle Regeln (erlaubte Aktionen, Editierbarkeit, Validierung) kommen vom Backend.
const API = "/ui-api";

const STATUS_COLORS = {
  DRAFT: "var(--mustard)",
  SCHEDULED: "var(--pumpkin)",
  PUBLISHED: "var(--olive)",
};
const CHANNEL_STYLE = {
  INSTAGRAM: { color: "#b5452f", short: "IG" },
  LINKEDIN: { color: "#6b4a2b", short: "in" },
  X: { color: "#3b2416", short: "X" },
  FACEBOOK: { color: "#8a5a1c", short: "f" },
};
const FALLBACK_STATUS = { DRAFT: "Entwurf", SCHEDULED: "Eingeplant", PUBLISHED: "Veröffentlicht" };

const state = {
  channels: [],
  posts: [],
  statuses: new Map(Object.entries(FALLBACK_STATUS)), // key -> label
  filter: { channel: "", status: "", q: "" },
  editing: null,
};

const $ = (sel) => document.querySelector(sel);
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ---------- API ----------
class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function api(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(API + path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "NETWORK", "Keine Verbindung zum Server.");
  }
  if (res.status === 204) return null;
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    throw new ApiError(res.status, data?.code || "HTTP_" + res.status, data?.message || `Fehler ${res.status}`);
  }
  return data;
}
function safeJson(t) {
  try { return JSON.parse(t); } catch { return t; }
}

// ---------- Formatierung ----------
const dtf = new Intl.DateTimeFormat("de-AT", { dateStyle: "medium", timeStyle: "short" });
const fmt = (iso) => (iso ? dtf.format(new Date(iso)) : "–");

function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
const fromLocalInput = (v) => (v ? new Date(v).toISOString() : null);

const statusColor = (s) => STATUS_COLORS[s] || "var(--rust)";
function channelIcon(key, name) {
  const st = CHANNEL_STYLE[key] || { color: "var(--bark)", short: (name || key || "?").slice(0, 2) };
  return `<span class="channel-ico" style="background:${st.color}">${esc(st.short)}</span>`;
}
const channelByKey = (k) => state.channels.find((c) => c.channel === k);

// ---------- Laden ----------
async function loadChannels() {
  state.channels = await api("/channels");
  renderChips();
  $("#channelSelect").innerHTML = state.channels
    .map((c) => `<option value="${esc(c.channel)}">${esc(c.displayName)}</option>`)
    .join("");
}

async function loadPosts() {
  const grid = $("#grid");
  if (!state.posts.length) grid.innerHTML = '<div class="skeleton"></div>'.repeat(3);
  const qs = new URLSearchParams();
  if (state.filter.channel) qs.set("channel", state.filter.channel);
  if (state.filter.status) qs.set("status", state.filter.status);
  try {
    state.posts = await api("/posts" + (qs.toString() ? "?" + qs : ""));
    state.posts.forEach((p) => state.statuses.set(p.status, p.statusLabel));
    renderStatusFilter();
    renderPosts();
    if (!state.filter.channel && !state.filter.status) renderStats(state.posts);
    else api("/posts").then(renderStats).catch(() => {});
  } catch (e) {
    grid.innerHTML = "";
    toast(e);
  }
}

// ---------- Rendern ----------
function renderChips() {
  const all = [{ channel: "", displayName: "Alle Kanäle" }, ...state.channels];
  $("#channelChips").innerHTML = all
    .map(
      (c) =>
        `<button class="chip" data-channel="${esc(c.channel)}" aria-pressed="${state.filter.channel === c.channel}">${esc(c.displayName)}</button>`
    )
    .join("");
}

function renderStatusFilter() {
  const sel = $("#statusFilter");
  const cur = sel.value;
  sel.innerHTML =
    '<option value="">Alle</option>' +
    [...state.statuses].map(([k, l]) => `<option value="${esc(k)}">${esc(l)}</option>`).join("");
  sel.value = cur;
}

function renderStats(posts) {
  const counts = new Map();
  posts.forEach((p) => counts.set(p.status, (counts.get(p.status) || 0) + 1));
  const items = [
    { label: "Posts gesamt", n: posts.length, color: "var(--maroon)" },
    ...[...state.statuses].map(([k, l]) => ({ label: l, n: counts.get(k) || 0, color: statusColor(k) })),
  ];
  $("#stats").innerHTML = items
    .map((i) => `<div class="stat"><div class="stat-dot" style="background:${i.color}"></div><div><b>${i.n}</b><span>${esc(i.label)}</span></div></div>`)
    .join("");
}

function renderPosts() {
  const q = state.filter.q.trim().toLowerCase();
  const posts = state.posts.filter(
    (p) => !q || (p.title || "").toLowerCase().includes(q) || (p.text || "").toLowerCase().includes(q)
  );
  $("#empty").hidden = posts.length > 0;
  $("#grid").innerHTML = posts.map(cardHtml).join("");
}

function cardHtml(p, i) {
  const actions = (p.actions || [])
    .map((a) => `<button class="btn btn-action btn-sm" data-act="status" data-id="${p.id}" data-target="${esc(a.targetStatus)}">${esc(a.label)}</button>`)
    .join("");
  return `
  <article class="card" style="--accent:${statusColor(p.status)};animation-delay:${Math.min(i * 40, 400)}ms">
    <div class="card-top">
      <span class="channel">${channelIcon(p.channel, p.channelName)} ${esc(p.channelName)}</span>
      <span class="badge">${esc(p.statusLabel)}</span>
    </div>
    <h3 data-act="open" data-id="${p.id}">${esc(p.title)}</h3>
    <p class="card-text">${esc(p.text)}</p>
    <div class="meta">
      ${p.scheduledAt ? `<span title="Geplant">🗓️ ${fmt(p.scheduledAt)}</span>` : ""}
      ${p.publishedAt ? `<span title="Veröffentlicht">🍁 ${fmt(p.publishedAt)}</span>` : ""}
      <span title="Zuletzt geändert">✎ ${fmt(p.updatedAt)}</span>
    </div>
    <div class="card-actions">
      ${actions}
      <span class="spacer"></span>
      ${p.editable ? `<button class="icon-btn" title="Bearbeiten" data-act="edit" data-id="${p.id}">✎</button>` : `<button class="icon-btn" title="Ansehen" data-act="open" data-id="${p.id}">👁</button>`}
      ${p.deletable ? `<button class="icon-btn danger" title="Löschen" data-act="delete" data-id="${p.id}">🗑</button>` : ""}
    </div>
  </article>`;
}

// ---------- Formular ----------
const form = $("#postForm");
const dialog = $("#postDialog");

function openForm(post = null) {
  state.editing = post;
  $("#dialogTitle").textContent = post ? "Post bearbeiten" : "Neuer Post";
  form.reset();
  form.title.value = post?.title || "";
  form.text.value = post?.text || "";
  form.channel.value = post?.channel || state.filter.channel || state.channels[0]?.channel || "";
  form.scheduledAt.value = toLocalInput(post?.scheduledAt);
  setFormError(null);
  updateCounter();
  dialog.showModal();
  form.title.focus();
}

function updateCounter() {
  const max = channelByKey(form.channel.value)?.maxLength;
  const len = form.text.value.length;
  const counter = $("#counter");
  const fill = $("#meterFill");
  counter.textContent = max ? `${len} / ${max.toLocaleString("de-AT")}` : `${len}`;
  const ratio = max ? len / max : 0;
  counter.classList.toggle("over", ratio > 1);
  fill.style.width = Math.min(ratio * 100, 100) + "%";
  fill.style.background = ratio > 1 ? "var(--maroon)" : ratio > 0.85 ? "var(--pumpkin)" : "var(--olive)";
}

function setFormError(msg) {
  const el = $("#formError");
  el.hidden = !msg;
  el.textContent = msg || "";
}

form.addEventListener("input", updateCounter);
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = {
    title: form.title.value.trim(),
    text: form.text.value,
    channel: form.channel.value,
    scheduledAt: fromLocalInput(form.scheduledAt.value),
  };
  const btn = $("#saveBtn");
  btn.disabled = true;
  try {
    if (state.editing) await api(`/posts/${state.editing.id}`, { method: "PUT", body });
    else await api("/posts", { method: "POST", body });
    dialog.close();
    toast(state.editing ? "Post gespeichert." : "Post angelegt. 🍂");
    await loadPosts();
  } catch (err) {
    setFormError(err.message);
  } finally {
    btn.disabled = false;
  }
});

// ---------- Detail ----------
async function openDetail(id) {
  try {
    const p = await api(`/posts/${id}`);
    $("#detailTitle").textContent = p.title;
    $("#detailBody").innerHTML = `
      <p class="detail-text">${esc(p.text)}</p>
      <dl class="detail-meta">
        <dt>Kanal</dt><dd>${esc(p.channelName)}</dd>
        <dt>Status</dt><dd>${esc(p.statusLabel)}</dd>
        <dt>Geplant</dt><dd>${fmt(p.scheduledAt)}</dd>
        <dt>Veröffentlicht</dt><dd>${fmt(p.publishedAt)}</dd>
        <dt>Geändert</dt><dd>${fmt(p.updatedAt)}</dd>
      </dl>`;
    $("#detailFoot").innerHTML =
      (p.actions || [])
        .map((a) => `<button class="btn btn-action" data-act="status" data-id="${p.id}" data-target="${esc(a.targetStatus)}">${esc(a.label)}</button>`)
        .join("") +
      (p.editable ? `<button class="btn btn-primary" data-act="edit" data-id="${p.id}">Bearbeiten</button>` : "") +
      `<button class="btn btn-ghost" data-close>Schließen</button>`;
    $("#detailDialog").showModal();
  } catch (e) {
    toast(e);
  }
}

// ---------- Aktionen ----------
function confirmDialog(text) {
  const d = $("#confirmDialog");
  $("#confirmText").textContent = text;
  d.returnValue = "";
  d.showModal();
  return new Promise((resolve) => d.addEventListener("close", () => resolve(d.returnValue === "yes"), { once: true }));
}

async function changeStatus(id, targetStatus, btn) {
  if (btn) btn.disabled = true;
  try {
    const p = await api(`/posts/${id}/status`, { method: "POST", body: { targetStatus } });
    $("#detailDialog").close();
    toast(`„${p?.title ?? "Post"}“ → ${p?.statusLabel ?? targetStatus}`);
    await loadPosts();
  } catch (e) {
    toast(e);
    if (btn) btn.disabled = false;
  }
}

async function deletePost(id) {
  const p = state.posts.find((x) => x.id === id);
  if (!(await confirmDialog(`„${p?.title ?? "Post"}“ wirklich löschen? Das kann nicht rückgängig gemacht werden.`))) return;
  try {
    await api(`/posts/${id}`, { method: "DELETE" });
    toast("Post gelöscht. Wie ein Blatt im Wind. 🍃");
    await loadPosts();
  } catch (e) {
    toast(e);
  }
}

document.addEventListener("click", async (e) => {
  if (e.target.closest("[data-close]")) {
    e.target.closest("dialog")?.close();
    return;
  }
  const chip = e.target.closest(".chip");
  if (chip) {
    state.filter.channel = chip.dataset.channel;
    renderChips();
    loadPosts();
    return;
  }
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const id = Number(el.dataset.id);
  switch (el.dataset.act) {
    case "edit": {
      $("#detailDialog").close();
      try { openForm(await api(`/posts/${id}`)); } catch (err) { toast(err); }
      break;
    }
    case "open": openDetail(id); break;
    case "delete": deletePost(id); break;
    case "status": changeStatus(id, el.dataset.target, el); break;
  }
});

// Klick auf Backdrop schließt Dialog
document.querySelectorAll("dialog").forEach((d) =>
  d.addEventListener("click", (e) => { if (e.target === d) d.close(); })
);

$("#newBtn").addEventListener("click", () => openForm());
$("#statusFilter").addEventListener("change", (e) => { state.filter.status = e.target.value; loadPosts(); });
$("#search").addEventListener("input", (e) => { state.filter.q = e.target.value; renderPosts(); });

// ---------- Toasts ----------
function toast(msgOrErr) {
  const isErr = msgOrErr instanceof Error;
  const el = document.createElement("div");
  el.className = "toast" + (isErr ? " error" : "");
  el.innerHTML = isErr
    ? `${esc(msgOrErr.message)}<small>${esc(msgOrErr.code || "")}${msgOrErr.status ? " · " + msgOrErr.status : ""}</small>`
    : esc(msgOrErr);
  $("#toasts").append(el);
  setTimeout(() => el.remove(), isErr ? 6000 : 3000);
}

// ---------- Blätter ----------
(function leaves() {
  const box = document.querySelector(".leaves");
  const glyphs = ["🍁", "🍂", "🍃"];
  for (let i = 0; i < 14; i++) {
    const l = document.createElement("span");
    l.className = "leaf";
    l.textContent = glyphs[i % glyphs.length];
    l.style.left = Math.random() * 100 + "vw";
    l.style.fontSize = 14 + Math.random() * 18 + "px";
    l.style.animationDuration = 12 + Math.random() * 14 + "s";
    l.style.animationDelay = -Math.random() * 20 + "s";
    box.append(l);
  }
})();

// ---------- Start ----------
(async () => {
  try {
    await loadChannels();
  } catch (e) {
    toast(e);
  }
  await loadPosts();
})();
