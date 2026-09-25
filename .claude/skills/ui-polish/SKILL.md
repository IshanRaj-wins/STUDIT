---
name: ui-polish
description: Design system and UI rules for Studit. Use whenever creating or editing any template, CSS, or frontend JS.
---
# Studit UI system: "halo" (dark-only, matches the landing hero)

## Files
- `static/halo.css`: tokens (`--ink --bone --muted --ember --sand --lilac --line`, `--serif --sans --mono`), `.btn .btn-ember .btn-ghost .glass`, pill nav + mobile tab bar, `.burst`, glyph canvas glow.
- `static/app.css`: app components: `.sv-card` (cursor spotlight), `.sv-input .sv-select .sv-label .sv-range .sv-check .sv-file`, `.cmd` (command search), `.chip-s`, `.seg` (segmented control), `.type-dot`, `.meta`, `.tag-s`, `.icon-btn` (+`data-tip` tooltip, `.on`), `.ai-badge` + `.shimmer`, `.toast`, `.skel`, `.mesh-bg`, `.page-top`, `.eyebrow-s`, `.h-serif`.
- `templates/_nav.html`: the ONE navbar (floating pill + sliding thumb; bottom tab bar under 720px). Included by `base.html` and `landing.html`.
- `static/glyph.js`: glyph-dither art. `<canvas data-glyph="search|sparkles|book|vault|hand|bookmark|send|files|unlink|flame|inbox|text:404" data-size="150">`.

## Rules
- Dark only. Never use white/slate/indigo/violet Tailwind surfaces. Tailwind theme colours: `ink bone ember sand lilac` (`text-bone/55`, `border-bone/10`).
- Type: Instrument Serif for headings (`.h-serif`, `em` = italic sand), Geist body, Geist Mono for labels/meta (uppercase, tracked).
- **No emoji as icons.** Small icons are Lucide (`<i data-lucide="name">`) served from `static/icons.js` (a subset: add new icon names there, from lucide-static@0.469.0); call `icons()` after any dynamic `innerHTML` (it also mounts glyph canvases).
- Glyph art only in large spots (≥ 64px): headers, empty states (`emptyState(glyphName, …)`), AI loading (`data-boost="1"`), 404.
- Micro-interaction: `burst(el)` on upvote / save / share.
- Type colours (`TYPE_COLOR` in app.js): Notes=sand, PYQ=ember, Reference=lilac, Video=#ff8a52, Lab Manual=#9fd3b0, Syllabus=muted.
- AI: lilac accent, `aiBadge(mode)` (shimmer "AI generated" / sand "Smart offline mode"), spinner via `setLoading`.
- Pages start with `.page-top` (clears the fixed nav). Cards grid: `grid gap-3 sm:grid-cols-2 lg:grid-cols-3`. Container `max-w-6xl mx-auto px-4`.
- Everything usable at 375px with no horizontal scroll; respect `prefers-reduced-motion`.
- Phones (≤720px) get lighter effects: no backdrop blur over WebGL, no blur() tweens, glyphs at 20fps. Keep new effects cheap there.
