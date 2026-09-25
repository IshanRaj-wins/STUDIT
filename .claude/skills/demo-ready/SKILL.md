---
name: demo-ready
description: Final-minutes checklist for Studit — seed data quality, README, pitch script. Use when asked to finalize, prepare the demo, or write the README.
---
# Demo readiness (Creativity & Presentation 10 + Impact 10)

## Seed data quality
- Realistic titles: "DBMS Unit 3 — Normalization handwritten notes", "OS PYQ 2023 (VTU) with solutions",
  "CN Subnetting cheat sheet". Mix types, semesters, upvotes (3–120), views, uploader names.
- At least 4 resources per subject so filters and the AI planner always have data.

## README.md sections
1. Problem (scattered resources, WhatsApp/Drive chaos before exams)
2. Solution + feature list with emoji
3. AI features — what each does and why it's grounded in the database (no hallucinated links)
4. Database — schema summary (SQLite, 2 tables)
5. Impact — SDG 4 Quality Education: free, equal access; request board closes resource gaps
6. Run instructions (3 lines)
7. Built with Claude Code — CLAUDE.md, skills, and hooks (syntax check + smoke test)

## 60-second pitch (print at end)
Hook (the night-before-exam scramble) → live demo: search + filter → open resource, ✨ Key topics →
✨ Exam Prep Assistant with "DBMS, 3 days, normalization" → Request Board → SDG 4 impact →
how AI was used both in the product and to build it.

## Final checklist
- [ ] `python app.py` from a clean DB works (delete studyvault.db, restart, reseeds)
- [ ] Every nav link works, no 500s, no console errors
- [ ] AI works with key AND without key (offline mode)
- [ ] Mobile width looks fine
- [ ] Page `<title>` and favicon emoji set
