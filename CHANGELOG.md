# Studit — Changelog

One line per major change or bug. Newest section at the bottom.

## Phase 0 — Bootstrap
- Detected Python 3.14 (`python`; `python3` not on PATH); installed flask, requests, python-dotenv globally.
- Created `.env` from `.env.example`; `uploads/` exists.

## Phase 1 — Core (P0)
- `db.py`: SQLite schema (`resources`, `requests`), auto-seed of 31 resources across 6 subjects + 5 requests.
- `app.py`: home, `/api/resources` (q, subject, semester, type, sort, ids), detail (+views), add (link or PDF), upvote, stats.
- Templates: base, index, resource, add, 404; `static/app.js` with toasts, cards, upvote, bookmarks, WhatsApp share.
- BUG fixed: seed timestamps were local time while new rows use UTC, so "Newest" sort was wrong; seed now uses UTC.

## Phase 2 — AI
- `ai.py`: Gemini REST helper + offline fallbacks for study plan, auto-tag and key topics (in-memory cache).
- Routes `/ask`, `/api/ai/plan`, `/api/ai/tag`, `/api/ai/insights/<id>`; AI badges and spinners wired into the UI.
- Plan resource ids are validated server-side against the DB, so there are no hallucinated links.
- BUG fixed: `gemini-2.5-flash` returned 404 (retired); switched `GEMINI_MODEL` to `gemini-3.8-flash` in `.env`.
- BUG fixed: calls took 15–18s (close to 20s timeout); disabled thinking (`thinkingBudget: 0`) → ~3s.
- Added fallback to `gemini-flash-latest` on 404/429/5xx.
- OPEN: Gemini returned 503 on both models throughout testing; app runs in offline mode until Google recovers.

## Phase 3 — Impact
- Request Board: post, upvote, "I have this" (marks fulfilled and pre-fills the Add form).
- Trending strip, localStorage bookmarks section, SDG 4 footer.
- `.gitignore`: server logs and `.playwright-mcp/`.

## UI polish
- Plus Jakarta Sans headings + Inter body; gradient logo tile and wordmark; page glow; redesigned footer.
- Home: dark gradient hero with grid/glow, glowing search, horizontally scrolling chips on mobile, divided stats card.
- Cards: type-coloured top strip, hover lift with coloured shadow; trending cards with rank watermark.
- Exam Prep: dated timeline, checkable tasks with per-day and overall progress, stepped loading state, empty-state cards.
- Dark mode toggle (persists, respects OS preference) via CSS remap of light utilities in `base.html`.
- BUG fixed: stats dividers were white in dark mode (Tailwind `divide-*` specificity); override now matches its selector.
- Note: Flask caches templates with debug off, so restart the server after template edits.

## Landing + BMSCE auth
- Installed skills: `gsap-scrolltrigger` (GreenSock), `supabase` (Supabase), `threejs-shaders` (cloudai-x).
- `/` is now a cinematic landing page; the old home moved to `/browse` (nav, 404 and back links updated).
- Hero: user's ShaderGradient "halo" plane (#ff5005 / #dbba95 / #d0bce1) ported to raw three.js GLSL + dust particles + cursor bend.
- Scroll story (GSAP ScrollTrigger + Lenis): pinned "problem" chips sucked into the halo, horizontal feature panels, live DB counters, SDG 4, final CTA.
- Reduced-motion / no-WebGL fallback: static CSS halo, no pinning. Mobile stacks the panels.
- Supabase email+password auth, `@bmsce.ac.in` only: checked in the browser, by a Supabase before-user-created hook (`SUPABASE_SETUP.md`) and by Flask via `/auth/v1/user`.
- Soft gate: browsing is open; `/add` and Request Board actions need a session (page 302 → `/login`, API 401 → toast + redirect).
- `/dashboard`: uploads, upvotes earned, views, your requests, saved bookmarks, sign out.
- Palette: app chrome (logo, primary buttons, gradient text, browse hero) moved off indigo/violet to ember/sand/black; Instrument Serif + Geist.
- BUG fixed: flat-shaded facets in the shader; normals are now computed by finite differences in the vertex shader.
- BUG fixed: the plane edge showed after the halo moved right; plane enlarged to 18×18.
- BUG fixed: placeholder Supabase values counted as "configured"; `AUTH_READY` now rejects placeholders.
- BUG fixed: Vercel login said "Auth isn't configured" despite env vars set; values now stripped of quotes/whitespace/\r, login card lists which check fails (no values shown).

## Pending / ideas
- Demo data: signed up ishanraj.cs25@bmsce.ac.in (awaiting email confirm); uploaded PDF resource #32 DBMS Unit 3 Normalization Notes as Ishan Raj
- Demo data: uploaded DSA-BASICS.pdf (BMSCE Unit 1 slides) as resource #33, DSA Sem 3, by Ishan Raj
- Security: secure/HttpOnly/SameSite session cookies, security headers (nosniff, DENY framing, HSTS on Vercel), per-IP AI rate limit (15/min).
- Security: PDF uploads verified by magic bytes; /uploads serves only .pdf as application/pdf; input length caps on add form.
- Deploy: Vercel project `study-recon` (Flask preset); DB + uploads use /tmp on Vercel; .vercelignore allowlist keeps .env/db/uploads/logs private.
- Deploy: shipped Ishan's 2 PDFs (DBMS Unit 3 #32, DSA Unit 1 #33) via seed_files/ + SEED_PDFS so they persist on Vercel.
- Security audit 2: BUG fixed stored XSS in card share button (`&quot;` in a title broke out of onclick); now uses a data attribute.
- Security: rate limiter no longer trusts spoofable X-Forwarded-For locally; buckets for AI (8/min, 40/day per IP), writes, uploads, auth, global flood; memory capped.
- Security: AI billing guard: AI_DAILY_LIMIT (200 Gemini calls/instance/day, then offline), AI_DISABLED kill switch, maxOutputTokens caps, cache for repeated prompts.
- Security: CSP, same-origin check on every POST, no-store on API/session pages, sandboxed /uploads, generic 500s, Supabase service_role key refused.
- Security: weak/placeholder FLASK_SECRET_KEY replaced by a random one; open redirect via `/\` in ?next= fixed; upvotes/views/request votes once per session.
- Security: uploader/requester name forced to the signed-in user; form validated before a PDF is saved.

## UI overhaul (halo everywhere)
- All app pages moved to the dark halo system (`static/app.css`); light theme, theme toggle and the dark-remap CSS removed.
- Emoji icons replaced by Lucide line icons; `icons()` helper renders them after dynamic HTML.
- One shared floating pill nav (`templates/_nav.html`) with a sliding active thumb, plus a mobile bottom tab bar.
- `static/glyph.js`: glyph-dither canvas art (pixels dissolving into `+ □ · ▪`), used in headers, bento, empty states, AI loading, 404.
- Glyph "burst" on upvote/save/share; cursor-spotlight cards; command search with `/` shortcut; segmented sort control.
- Landing: problem pin shortened (240% → 130%), horizontal scroll-jack replaced by a bento grid, scroll progress bar, glyph core.
- BUG fixed: `canvas[data-glyph]{display:block}` beat Tailwind `hidden` on mobile; the rule now uses `:where()`.
- Footer redesigned: SDG 4 card with glyph book, 3 link columns, back-to-top, oversized serif wordmark; red SDG block removed.

## Rename + phone performance
- Renamed StudyVault → Studit in all user-facing text (DB file and localStorage keys kept, so data and bookmarks survive).
- Footer replaced: "Exam soon?" search panel (GET /browse?q=) with subject chips + slim bar (links, SDG 4 chip, ©).
- Perf: full Lucide CDN (82KB) replaced by `static/icons.js`, a 7KB subset of the 37 icons used; app pages ~300ms faster first paint.
- Perf (phones): WebGL at 0.65x resolution and 30fps, fewer particles and mesh segments, three.js lazy-loaded after first paint behind the CSS halo.
- Perf (phones): no Lenis, no blur() tweens, no backdrop blur over WebGL, no grain overlay; glyph art at 20fps, paused while scrolling.
- Perf result (mid-range phone emulation, 4x CPU, slow 4G): landing scroll 46 → 60fps, p95 frame 50 → 33ms; app pages steady 60fps.
- UX: hover effects only on hover-capable devices; 42px touch targets; press feedback on touch; scrim behind the problem titles.
- BUG fixed: footer search button overflowed on narrow phones (grid column min-width).

- Security audit 3: no new issues (pip-audit clean, all innerHTML escaped, CSRF/traversal/SQLi/open-redirect probes blocked, 0 CSP errors); redeployed Studit to study-recon.vercel.app. studit.vercel.app is taken by another account.
