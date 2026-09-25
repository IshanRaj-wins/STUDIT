---
name: ai-features
description: How to implement Studit's AI features with the Gemini API plus offline fallbacks. Use when writing ai.py or any /api/ai route.
---
# AI features (20 marks) — reliable, visible, grounded in the database

## Gemini REST helper (put in ai.py)
```python
import os, json, re, requests
KEY = os.getenv("GEMINI_API_KEY", "")
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"

def ask_json(prompt: str):
    """Returns parsed dict, or None on any failure (caller uses fallback)."""
    if not KEY:
        return None
    try:
        r = requests.post(URL, headers={"x-goog-api-key": KEY, "Content-Type": "application/json"},
            json={"contents": [{"parts": [{"text": prompt}]}],
                  "generationConfig": {"temperature": 0.4, "responseMimeType": "application/json"}},
            timeout=20)
        r.raise_for_status()
        text = r.json()["candidates"][0]["content"]["parts"][0]["text"]
        text = re.sub(r"^```(json)?|```$", "", text.strip(), flags=re.M).strip()
        return json.loads(text)
    except Exception as e:
        print("AI error:", e)
        return None
```
Load `.env` (dotenv) BEFORE importing ai.py. If the model name 404s, set `GEMINI_MODEL` in `.env`
to a current Flash model.

## Feature 1 — Exam Prep Assistant (`POST /api/ai/plan`) — the star feature
Input: subject, days_left (1–14), weak_topics (text).
1. Query DB for up to 15 resources of that subject ordered by upvotes (id, title, type, tags).
2. Prompt: act as a study coach; given ONLY these resources (JSON), build a day-by-day plan.
   Return JSON: `{"summary": str, "days": [{"day": 1, "focus": str, "tasks": [str], "resource_ids": [int]}], "tips": [str]}`.
   Rule: resource_ids must come from the provided list.
3. Server-side: drop any resource_id not in the list, attach title+link for each.
4. Fallback: split top resources across days (PYQs on the last day), generic tips. `"mode": "offline"`.
UI: render as a vertical timeline, each day a card with resource links as chips.

## Feature 2 — Auto-tag (`POST /api/ai/tag`)
Input: title, description. Return `{"subject", "type", "semester", "tags": [3-6 strings]}`
constrained to known subjects/types. Fallback: keyword matching against subject names and
words like "pyq/question paper" → PYQ, "lab" → Lab Manual.

## Feature 3 — Key topics (`POST /api/ai/insights/<id>`)
Return `{"summary": str, "key_topics": [str], "likely_questions": [str]}` from title/description/tags.
Fallback: tags as key topics, templated questions ("Explain {tag} with an example").
Cache the result in memory dict by id so repeat clicks are instant.

## Presentation rules
- Every AI result shows a "✨ AI generated" badge; offline results show "⚡ Smart offline mode".
- Spinner while waiting; friendly error toast; never a raw stack trace.
