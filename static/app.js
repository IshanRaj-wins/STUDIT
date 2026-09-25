// ---------- helpers ----------
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ---------- theme ----------
function paintTheme() {
  const b = document.getElementById("theme-btn");
  if (b) b.textContent = document.documentElement.classList.contains("dark") ? "☀️" : "🌙";
}
function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  try { localStorage.setItem("sv_theme", dark ? "dark" : "light"); } catch {}
  paintTheme();
}
paintTheme();

function toast(msg, kind = "ok") {
  const box = $("#toasts");
  if (!box) return;
  const el = document.createElement("div");
  const color = kind === "err" ? "bg-rose-600 shadow-rose-600/30" : kind === "ai" ? "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-violet-600/30" : "bg-slate-900/95 shadow-slate-900/20";
  el.className = `${color} pointer-events-auto text-white text-sm font-medium px-4 py-3 rounded-xl shadow-xl backdrop-blur fade-in max-w-sm`;
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => { el.style.transition = "opacity .3s"; el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, 2500);
}

function setLoading(btn, on, label) {
  if (!btn) return;
  if (on) {
    btn.dataset.label = btn.innerHTML;
    btn.disabled = true;
    btn.classList.add("opacity-80", "cursor-wait");
    btn.innerHTML = `<span class="spinner"></span> ${label || "Thinking…"}`;
  } else {
    btn.disabled = false;
    btn.classList.remove("opacity-80", "cursor-wait");
    btn.innerHTML = btn.dataset.label;
  }
}

function needLogin(msg) {
  toast(msg || "Sign in with your @bmsce.ac.in email first", "err");
  setTimeout(() => { location.href = "/login?next=" + encodeURIComponent(location.pathname + location.search); }, 1200);
}

async function postJSON(url, body) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
  if (r.status === 401) { const d = await r.json().catch(() => ({})); needLogin(d.error); throw Object.assign(new Error(d.error), { login: true }); }
  if (!r.ok) throw new Error("Request failed");
  return r.json();
}

function aiBadge(mode) {
  return mode === "offline"
    ? `<span class="inline-flex items-center gap-1 rounded-full text-xs px-2.5 py-0.5 font-medium bg-amber-50 text-amber-700 border border-amber-200">⚡ Smart offline mode</span>`
    : `<span class="inline-flex items-center gap-1 rounded-full text-xs px-2.5 py-0.5 font-medium bg-violet-50 text-violet-700 border border-violet-200">✨ AI generated</span>`;
}

const TYPE_COLORS = {
  "Notes": "bg-blue-50 text-blue-700 border-blue-200",
  "PYQ": "bg-rose-50 text-rose-700 border-rose-200",
  "Reference": "bg-amber-50 text-amber-700 border-amber-200",
  "Video": "bg-red-50 text-red-700 border-red-200",
  "Lab Manual": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Syllabus": "bg-slate-100 text-slate-700 border-slate-200",
};
const TYPE_ACCENT = {
  "Notes": "from-blue-400 to-indigo-500", "PYQ": "from-rose-400 to-pink-500", "Reference": "from-amber-300 to-orange-400",
  "Video": "from-red-400 to-rose-500", "Lab Manual": "from-emerald-400 to-teal-500", "Syllabus": "from-slate-300 to-slate-400",
};
const typeBadge =(t) => `<span class="rounded-full text-xs px-2.5 py-0.5 font-medium border ${TYPE_COLORS[t] || TYPE_COLORS.Syllabus}">${esc(t)}</span>`;

// ---------- bookmarks (localStorage) ----------
const BM_KEY = "studyvault_bookmarks";
function getBookmarks() { try { return JSON.parse(localStorage.getItem(BM_KEY)) || []; } catch { return []; } }
function isBookmarked(id) { return getBookmarks().includes(Number(id)); }
function toggleBookmark(id, btn) {
  id = Number(id);
  let bm = getBookmarks();
  const on = !bm.includes(id);
  bm = on ? [...bm, id] : bm.filter((x) => x !== id);
  try { localStorage.setItem(BM_KEY, JSON.stringify(bm)); } catch {}
  document.querySelectorAll(`[data-bm="${id}"]`).forEach((b) => paintBookmark(b, on));
  toast(on ? "🔖 Saved to bookmarks" : "Removed from bookmarks");
  document.dispatchEvent(new CustomEvent("bookmarks-changed"));
}
function paintBookmark(btn, on) {
  btn.classList.toggle("text-indigo-600", on);
  btn.classList.toggle("bg-indigo-50", on);
  btn.title = on ? "Remove bookmark" : "Bookmark";
  const lbl = btn.querySelector("[data-bm-label]");
  if (lbl) lbl.textContent = on ? "Saved" : "Save";
}

// ---------- upvote / share ----------
async function upvote(id, btn) {
  const key = `sv_voted_${id}`;
  let voted = false;
  try { voted = localStorage.getItem(key); } catch {}
  if (voted) return toast("You already upvoted this 👍");
  try {
    const d = await postJSON(`/api/resources/${id}/upvote`);
    try { localStorage.setItem(key, "1"); } catch {}
    document.querySelectorAll(`[data-votes="${id}"]`).forEach((el) => (el.textContent = d.upvotes));
    document.querySelectorAll(`[data-up="${id}"]`).forEach((b) => b.classList.add("text-indigo-600", "bg-indigo-50"));
    toast("▲ Upvoted — thanks for helping others!");
  } catch { toast("Couldn't upvote, try again", "err"); }
}

function shareWhatsApp(title, path) {
  const link = location.origin + path;
  const text = `📚 ${title}\nFound this on StudyVault — ${link}`;
  window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank", "noopener");
}

// ---------- cards ----------
function cardHTML(r) {
  const tags = (r.tags || []).slice(0, 3).map((t) => `<span class="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">#${esc(t)}</span>`).join("");
  const bm = isBookmarked(r.id);
  let voted = false;
  try { voted = localStorage.getItem(`sv_voted_${r.id}`); } catch {}
  return `
  <article class="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 hover:-translate-y-1 transition duration-300 flex flex-col fade-in">
    <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${TYPE_ACCENT[r.type] || TYPE_ACCENT.Syllabus} opacity-80 group-hover:opacity-100"></div>
    <a href="/resource/${r.id}" class="p-5 flex-1 block">
      <div class="flex items-center gap-2 mb-3">${typeBadge(r.type)}${r.semester ? `<span class="text-xs text-slate-500 font-medium">Sem ${r.semester}</span>` : ""}${r.file_path ? `<span class="text-xs text-slate-500">📄 PDF</span>` : ""}</div>
      <h3 class="font-semibold leading-snug line-clamp-2 group-hover:text-indigo-700">${esc(r.title)}</h3>
      <div class="text-sm text-slate-500 mt-1">${esc(r.subject)} · by ${esc(r.uploader || "Anonymous")}</div>
      <div class="flex flex-wrap gap-1.5 mt-3">${tags}</div>
    </a>
    <div class="px-3 py-2 border-t border-slate-100 flex items-center gap-1 text-sm text-slate-600">
      <button data-up="${r.id}" onclick="upvote(${r.id}, this)" class="px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 font-semibold ${voted ? "text-indigo-600 bg-indigo-50" : ""}" title="Upvote">▲ <span data-votes="${r.id}">${r.upvotes}</span></button>
      <span class="px-2 py-1.5 text-slate-500" title="Views">👁 ${r.views}</span>
      <span class="flex-1"></span>
      <button data-bm="${r.id}" onclick="toggleBookmark(${r.id}, this)" class="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 ${bm ? "text-indigo-600 bg-indigo-50" : ""}" title="Bookmark">🔖</button>
      <button data-title="${esc(r.title)}" onclick="shareWhatsApp(this.dataset.title, '/resource/${Number(r.id)}')" class="px-2.5 py-1.5 rounded-lg hover:bg-green-50 hover:text-green-700" title="Share to WhatsApp">📤</button>
    </div>
  </article>`;
}

function emptyState(emoji, title, text, ctaHref, ctaText) {
  return `<div class="col-span-full text-center bg-white border border-dashed border-slate-300 rounded-2xl py-14 px-6 fade-in">
    <div class="w-20 h-20 mx-auto rounded-2xl bg-indigo-50 grid place-items-center text-4xl">${emoji}</div>
    <div class="font-display font-bold text-lg mt-4">${title}</div>
    <p class="text-sm text-slate-500 mt-1 max-w-md mx-auto">${text}</p>
    ${ctaHref ? `<a href="${ctaHref}" class="inline-block mt-5 rounded-xl px-5 py-2.5 font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:-translate-y-px transition">${ctaText}</a>` : ""}
  </div>`;
}

const skeleton = (n = 6) => Array.from({ length: n }, () =>
  `<div class="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse"><div class="h-4 w-20 bg-slate-100 rounded-full"></div><div class="h-4 bg-slate-100 rounded mt-4"></div><div class="h-4 w-2/3 bg-slate-100 rounded mt-2"></div><div class="h-3 w-1/2 bg-slate-100 rounded mt-4"></div></div>`).join("");

document.querySelectorAll("[data-bm]").forEach((b) => paintBookmark(b, isBookmarked(b.dataset.bm)));
