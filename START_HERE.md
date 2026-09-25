# StudyVault kit — fully automatic mode

## Before the timer (≈1 minute, the only manual part)
1. Unzip into an empty folder (keep the hidden `.claude/` folder).
2. OPTIONAL but worth it: get a free Gemini key at https://aistudio.google.com/apikey
   (needs your Google login — Claude Code can't do that part), then either:
   - copy `.env.example` → `.env` and paste the key, OR
   - skip it: the app runs in "offline AI mode" and you can add the key later.
3. Open a terminal in the folder and run:
   ```
   claude
   ```
   The project's `.claude/settings.json` starts it in **auto mode**. Check the mode indicator
   at the bottom; if it isn't "auto", press **Shift+Tab** until it is, or start with:
   ```
   claude --permission-mode auto
   ```
   If auto mode isn't available on your plan, use `claude --dangerously-skip-permissions`
   (only on your own hackathon machine, in this folder).

Claude Code will then install packages, create `.env`, start the server, build everything,
self-test via hooks, and open the site in your browser.

## Timeline (40 min)
| Time | Do |
|---|---|
| 0–1 | Paste PROMPT 1, then watch the browser |
| 1–22 | It builds all phases on its own |
| 22–30 | PROMPT 2 (polish) |
| 30–35 | PROMPT 3 (demo-ready + pitch) |
| 35–40 | Rehearse. STOP coding. |

---

## PROMPT 1 — start (one paste, fully autonomous)
```
Read CLAUDE.md and every skill in .claude/skills. You are in auto mode — work fully autonomously,
never ask me anything, never pause between phases.
Phase 0: bootstrap exactly as CLAUDE.md says (detect python, pip install, create .env if missing, run server in background).
Phase 1: db.py with schema + rich seed data (30 resources, 5 requests); app.py with all P0 routes and
/api/resources (search, subject, semester, type, sort); templates using the ui-polish skill. Open the site in my browser.
Phase 2: ai.py and the 3 AI features from the ai-features skill, with offline fallbacks, wired into the UI.
Phase 3: Request Board, trending strip, bookmarks, WhatsApp share, SDG 4 footer.
After each phase restart the server and curl every route; fix any error before moving on.
Finish with a 5-line summary and the URL.
```

## PROMPT 2 — polish
```
Use the ui-polish skill. Review every page at mobile and desktop width and make it look like a
polished real product: hero, empty states, spinners, toasts, hover states, consistent spacing.
Make the Exam Prep Assistant result a beautiful day-by-day timeline. Add a dark mode toggle if
it takes under 3 minutes. Don't break anything that works. Restart the server when done.
```

## PROMPT 3 — demo-ready
```
Use the demo-ready skill. Improve seed data realism, write README.md, run the final checklist
(fresh-DB restart and no-API-key test), fix anything broken, restart the server, then print my 60-second pitch.
```

## Added the Gemini key mid-way?
```
I just put my Gemini key in .env. Restart the server and test all 3 AI features return "mode": "online". Don't print the key.
```

## EMERGENCY
```
The app is broken: <paste error>. Fix the root cause with the smallest change. No refactors. Restart and confirm / loads.
```
