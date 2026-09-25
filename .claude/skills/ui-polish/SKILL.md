---
name: ui-polish
description: Design system and UI rules for StudyVault. Use whenever creating or editing any template, CSS, or frontend JS.
---
# StudyVault UI system (15 marks — make it look like a real product)

## Setup (base.html head)
- `<script src="https://cdn.tailwindcss.com"></script>`
- Google Font **Inter** (400/500/600/700) with `font-family: Inter, system-ui, sans-serif`
- `<meta name="viewport" content="width=device-width, initial-scale=1">`

## Tokens
- Background `bg-slate-50`, text `text-slate-800`, muted `text-slate-500`
- Primary: indigo → violet gradient (`bg-gradient-to-r from-indigo-600 to-violet-600`)
- Cards: `bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition`
- Buttons: primary gradient `rounded-xl px-4 py-2 font-semibold text-white`; secondary `bg-white border`
- AI elements always use a ✨ and a violet accent (`bg-violet-50 text-violet-700 border-violet-200`)
- Type badges (pill `rounded-full text-xs px-2.5 py-0.5 font-medium`):
  Notes=blue, PYQ=rose, Reference=amber, Video=red, Lab Manual=emerald, Syllabus=slate

## Layout
- Sticky top nav: logo "📚 StudyVault", links: Browse · ✨ Exam Prep AI · Request Board · + Add (primary button)
- Home hero: gradient background, big headline ("Every note, PYQ and reference. One place."),
  large rounded search bar, quick-filter subject chips below it
- Stats bar under hero (3–4 numbers, big bold)
- Grid: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`
- Card content: type badge + semester · title (font-semibold, 2-line clamp) · subject · tags as small chips ·
  footer row: ▲ upvotes, 👁 views, 🔖 bookmark, share
- Footer with SDG 4 "Quality Education" badge and one line about equal access

## Must-haves
- Empty states with an emoji + helpful sentence + CTA (never a blank area)
- Loading spinner (animated border) on every AI button; disable button while loading
- Toast notifications (bottom-right, auto-hide 2.5s) for upvote, bookmark, add, copy
- Mobile first: everything usable at 375px; nav collapses to icons
- Filters update results without full page reload (fetch `/api/resources?...`) with a 250ms debounce on search
- Consistent spacing: sections `py-10`, container `max-w-6xl mx-auto px-4`
