# Studit — Hackathon Build (HARD LIMIT: 40 minutes)

## Context
One-hour website hackathon. Scoring: Problem & Solution 20 · Use of AI 20 · Functionality 25 ·
UI/UX 15 · Impact/SDG 10 · Creativity & Presentation 10. Bonus marks for a real database.
Judges reward quality, creativity, functionality and effective AI use, not lines of code.

**Problem:** Before exams, students can't find the right notes, previous-year papers (PYQs) and
reference material. Resources are scattered across WhatsApp groups, Google Drive links and random sites.
**Solution:** Studit, one searchable hub where students share, find, upvote and request resources,
with an AI Exam Prep Assistant that turns "exam in 3 days" into a plan built from real resources in the DB.
**SDG:** SDG 4 (Quality Education), target 4.3/4.a: equal access to learning resources.

## Prime directives
- Working beats perfect. After every phase the app MUST start and the home page MUST load.
- Do not ask me questions. Make a sensible choice, state it in one line, keep going.
- No over-engineering: no auth, no ORM, no build step, no npm, no Docker, no test suites.
- Keep replies short. Don't explain code unless something failed.
- Guard the server with `if __name__ == "__main__":` (the Stop hook imports app.py).

## Phase 0 — Bootstrap (do this yourself, never ask me)
1. Detect the interpreter: try `python3 --version`, else `python --version`, else `py --version`. Use it everywhere.
2. Install deps globally for this user: `<python> -m pip install -r requirements.txt`
   (add `--user` or `--break-system-packages` only if the plain install fails). Do NOT create a venv.
3. If `.env` does not exist, copy `.env.example` to `.env`. Never print, read back, or log the API key.
   If the key is still the placeholder, continue — offline AI fallbacks handle it.
4. `mkdir uploads` if missing.
5. Run the dev server in the BACKGROUND (`<python> app.py &` or the Bash tool's background option) so you
   are never blocked waiting on it. Restart it after changes to app.py/db.py/ai.py.
6. When P0 works, open http://127.0.0.1:5000 in my browser (`start` on Windows, `open` on Mac, `xdg-open` on Linux).

## Stack (locked, do not change)
- Python 3.10+, Flask, SQLite via stdlib `sqlite3` (raw SQL, `row_factory = sqlite3.Row`)
- Jinja templates + Tailwind CSS via CDN + vanilla JS (`fetch`) — no frameworks
- AI: Gemini REST API via `requests` (see `ai-features` skill). Key in `.env` → `GEMINI_API_KEY`
- `python-dotenv` for config

## File layout
```
app.py            # routes + JSON API
db.py             # get_db(), init_db(), seed() — auto-runs on startup if DB empty
ai.py             # ALL AI calls + offline fallbacks
templates/        # base.html, index.html, resource.html, add.html, ask.html, requests.html
static/app.js     # upvote, bookmarks, AI buttons, toasts
uploads/          # uploaded PDFs
studyvault.db     # created automatically (gitignored)
```

## Database schema
- `resources(id, title, description, subject, semester INT, type, url, file_path, tags,
   uploader, upvotes INT DEFAULT 0, views INT DEFAULT 0, created_at)`
   type ∈ Notes | PYQ | Reference | Video | Lab Manual | Syllabus
- `requests(id, subject, topic, requested_by, upvotes INT DEFAULT 0, fulfilled INT DEFAULT 0, created_at)`
- Seed ~30 realistic resources across 6 subjects (DSA, DBMS, Operating Systems, Computer Networks,
  Engineering Maths, OOP with Java), semesters 3–5, mixed types, plausible URLs, varied upvotes.
  Seed ~5 open requests.

## Features by priority (build in this order)
**P0 — Core (must work):**
home with hero search + filters (subject, semester, type) + sort (Top / Newest / Most viewed);
resource cards; detail page (increments views); Add Resource form (link OR PDF upload);
upvote; stats bar (resources, subjects, contributors).
**P1 — AI (20 marks, make it visible):**
1. `/ask` Exam Prep Assistant: subject + days left + weak topics → day-by-day plan that cites
   actual resources from the DB (clickable links).
2. "✨ Auto-tag" button on Add form: AI fills subject/type/tags from title + description.
3. "✨ Key topics" on detail page: AI summary + likely exam questions for that resource.
**P2 — Impact & polish:** Request Board (students ask for missing material, others upvote/fulfil);
"🔥 Trending before exams" strip; bookmarks via localStorage; "Share to WhatsApp" button
(`https://wa.me/?text=`); SDG 4 section in footer/about.

## AI rules
- Every AI call lives in `ai.py`, 20s timeout, wrapped in try/except.
- No key OR any error → return a deterministic fallback built from DB data, tagged
  `"mode": "offline"`. The demo must NEVER crash because of AI.
- Request JSON output, strip ``` fences, `json.loads`, validate keys.
- Never expose the API key to the frontend. Frontend calls `/api/ai/...` routes only.
- Show a loading spinner while AI runs and an "✨ AI generated" badge on results.

## Run
`pip install -r requirements.txt` then `python app.py` → http://127.0.0.1:5000

## Definition of done (every phase)
Server starts · `/` returns 200 · new feature clickable end-to-end · no JS console errors.
If the schema changes, delete `studyvault.db` and let it reseed.
