# वाणी (Vaani) — India's Intelligent Newsroom

> **ET AI Hackathon 2026 · Problem Statement #8: AI-Native News Experience**

**Not translation. Understanding.**

---

## The idea in one line

ET spent 40 years building the best business journalism in India — for 5 crore English readers.
Vaani gives the other 135 crore access to it — in their language, at their literacy level,
with their local market context.

---

## Four pillars

| # | Pillar | What it does |
|---|--------|-------------|
| 1 | **My ET** | Personalised feed — every article culturally adapted per user in real time |
| 2 | **News Navigator** | One deep interactive briefing instead of 8 articles — with follow-up Q&A inside the document |
| 3 | **Story Arc Tracker** | Living D3.js timeline of any ongoing story — sentiment shifts, contrarian views, predictions, silence signals |
| 4 | **Vaani Cultural Engine** | Cultural adaptation (not translation) + Silence Detector + SEBI Circular Mapper + Voice-first |

---

## Features confirmed unbuilt anywhere

- **Cultural adaptation engine** — rewrites with culturally resonant analogies per language, literacy, and city. "Repo rate hike" → "RBI ne loan mahenga kar diya"
- **The Silence Detector** — tracks what journalism *stopped* covering and surfaces that absence as an intelligence signal
- **Paragraph-level "Explain this"** — rewrites any single confusing sentence with a local analogy, in your language
- **SEBI Circular Impact Mapper** — reads a SEBI PDF and maps it to specific sectors and stocks in plain language, within minutes
- **Story memory** — remembers which stories you followed; surfaces updates next session
- **Voice-first scripts** — generates natural conversational audio scripts, not robotic TTS
- **Contrarian perspective surfacer** — automatically finds the minority view in any story arc

---

## Quick start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env: add your ANTHROPIC_API_KEY

python agents/scraper.py        # Test DB + feeds
uvicorn main:app --reload --port 8000
```



### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: **[http://localhost:3000](https://vaani-et.lovable.app/)**

---

## Pages

| URL | Feature |
|-----|---------|
| `/` | My ET — live feed with adapt, explain, voice on every article |
| `/onboard` | 4-step identity setup (dark, cinematic) |
| `/arc` | Story Arc Tracker with D3.js interactive timeline |
| `/brief` | News Navigator — deep briefings + in-document Q&A |
| `/sebi` | SEBI Circular Impact Mapper |
| `/silence` | Silence Detector |

---

## API reference

| Method | Endpoint | What it does |
|--------|----------|-------------|
| GET | `/feed` | Live ET articles by category |
| POST | `/adapt` | Culturally adapt an article |
| POST | `/explain` | Explain one paragraph simply |
| POST | `/voice` | Generate voice script |
| POST | `/arc` | Build a story arc |
| GET | `/arc/demo` | Pre-built Jio vs Airtel arc (no API call needed) |
| POST | `/briefing` | Build deep briefing personalised to user |
| POST | `/followup` | Answer a follow-up inside a briefing |
| POST | `/sebi` | Map SEBI circular to affected stocks |
| POST | `/silence` | Detect what journalism stopped covering |
| POST | `/onboard` | Process onboarding answers → user profile |

---

## Tech stack

| Layer | What |
|-------|------|
| AI | Claude API (`claude-sonnet-4-20250514`) — cultural adaptation, briefings, arc synthesis, voice |
| Backend | Python 3.11, FastAPI, SQLite, feedparser, APScheduler |
| Frontend | Next.js 14, React 18, TypeScript, TailwindCSS, D3.js |
| Fonts | Playfair Display (editorial serif) + DM Sans (clean sans) |
| Data | ET public RSS feeds, SEBI public RSS, NSE public API — all free, all legal |
| Deploy | Vercel (frontend) + Render (backend) — both free tier |

---

## Data sources — all public and legal

```
ET Markets RSS:    https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms
ET Economy RSS:    https://economictimes.indiatimes.com/news/economy/rssfeeds/20680862.cms
ET Startups RSS:   https://economictimes.indiatimes.com/tech/startups/rssfeeds/78570550.cms
SEBI Circulars:    https://www.sebi.gov.in/sebi_data/rss/rss.xml
```

No paywalled content. No licensed datasets. No scraping behind login walls.

---

## Demo stories (pre-processed — no API call needed)

1. **Jio vs Airtel price war** — 8 timeline events, 5 players, 3 predictions, 2 silence signals
2. **India EV Revolution** — 6 events, Ola crisis arc, contrarian hydrogen view
3. **SEBI algo trading crackdown (April 1, 2026)** — live SEBI circular mapped to stocks

---

## Impact model

| Metric | Number |
|--------|--------|
| ET current English users | ~5 crore |
| Addressable vernacular market | 135 crore |
| Near-term vernacular internet users | ~30 crore |
| Assumed ET Prime conversion (half current rate) | 2% |
| Incremental annual revenue for ET | **₹600 crore** |

---

## The pitch (say this on stage)

*"ET spent 40 years building the best business journalism in India — for 5 crore English readers.
Vaani gives the other 135 crore access to it — in their language, at their literacy level,
with their local market context, as a living story arc, as a deep interactive briefing,
as a voice in their ear. Not translation. Understanding."*

---

Built for ET AI Hackathon 2026 · Problem Statement #8: AI-Native News Experience
