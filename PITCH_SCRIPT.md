# Study-Recon: Demo Script (about 2.5 minutes)

Live site: https://study-recon.vercel.app
Keep this tab open before you start: the /ask page with **DBMS** selected.

---

## 1. The hook (0:00 to 0:20)

> It's three days before your DBMS exam. You need last year's paper, good normalization notes, and a plan.
> The paper is somewhere in a WhatsApp group from last semester. The notes are in a Google Drive link that
> needs access. And the plan is in your head, panicking.
>
> Every student here has lived this. The resources exist. They're just **scattered**.

## 2. The solution (0:20 to 0:35)

> So I built **Study-Recon**: one searchable hub where students **share, find, upvote and request** notes,
> previous-year papers, lab manuals and videos, plus an **AI exam-prep assistant** that turns
> "exam in 3 days" into a real plan.

*[Show the landing page, then click into Browse.]*

## 3. Live demo: find it (0:35 to 1:05)

> Right now there are 33 resources across 6 subjects from 9 contributors.
> I can search **"normalization"**, filter by subject, semester and type (Notes, PYQ, Lab Manual)
> and sort by Top, Newest or Most viewed.

*[Open "DBMS Unit 3 Normalization Notes".]*

> This is a real PDF I uploaded. Anyone can open it, upvote it, bookmark it for exam week,
> or share it straight to WhatsApp, because that's where students already are.
>
> Now I click **✨ Key topics**. The AI reads the resource and gives me a summary, the key topics,
> and likely exam questions with marks.

## 4. Live demo: plan it (1:05 to 1:40)

*[Go to the Exam Prep Assistant.]*

> This is the part I'm proudest of. I pick **DBMS, 3 days left, weak topic: normalization**.

*[Click generate and wait a few seconds.]*

> I get a day-by-day plan: weak topics first, and the last day saved for previous-year papers and revision.
> Every resource it cites is a **real, clickable resource from our database**. The AI only picks from our
> library, and the server checks every ID, so it can't invent fake links.
>
> And if the AI is ever down, the app switches to a smart offline mode built from the same data.
> The demo never breaks.

## 5. Contribute and request (1:40 to 2:00)

> When I add a resource, **✨ Auto-tag** fills the subject, type, semester and tags from just the title.
> And if something is missing, students post it on the **Request Board**. Others upvote it, and whoever
> has it clicks "I have this" to upload it.
>
> Sign-in is limited to **@bmsce.ac.in** emails, so it stays a trusted, college-only space.

## 6. How I built it (2:00 to 2:25)

> I built this in under an hour with **Claude Code** as my AI pair programmer.
> I wrote the plan in a CLAUDE.md file with features in priority order: core first, then AI, then polish.
> I added custom skills for the AI and UI rules, and hooks that **syntax-check every edit** and
> **smoke-test the server** automatically, so the site stayed working after every phase.
>
> The stack is simple on purpose: **Flask, a real SQLite database, Tailwind and the Gemini API**.
> Before deploying to Vercel I ran a security pass. The API key never reaches the browser, cookies are
> secured, AI calls are rate-limited, and only the app code gets deployed.

## 7. Impact and close (2:25 to 2:40)

> This supports **UN SDG 4, Quality Education**: equal access to learning resources.
> Toppers shouldn't have an advantage just because they're in the right WhatsApp group.
>
> **Study-Recon: find it, plan it, pass it.** Thank you.

---

### Backup lines if something goes wrong
- **AI is slow:** "While that loads: every AI call has a 20-second limit and a fallback, so it never crashes."
- **You get an "offline mode" badge:** "That's the offline fallback working. The plan is still built from real resources."
- **Wi-Fi is down:** run `python app.py` and demo on http://127.0.0.1:5000. It works fully offline.
