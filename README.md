# 242Go — WATER Leadership Development Platform

> *"They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer... And the Lord added to their number daily."* — Acts 2:42, 47

Built by **GGI Solutions / Coach Reno** for Jesus Generation and the global church.

---

## What This Is

242Go is an AI-powered church leadership assessment and development platform built on the **WATER Leadership Development Pipeline**:

| Letter | Phase | Purpose |
|--------|-------|---------|
| **W** | Watch | Capture who's here and where they are |
| **A** | Analyze | Run the full assessment framework |
| **T** | Train | Build their personalized development plan |
| **E** | Equip | Deploy them in their assignment |
| **R** | Review | Measure, promote, or intervene |

---

## Three Tools in One Platform

### 1. Member Assessment (`/`)
50 questions across 5 sections:
- **WHO** — DISC Kingdom Profile (Driver / Influencer / Steadfast / Craftsman)
- **WHERE** — FAT Screen (Faithful, Available, Teachable)
- **CARRY** — Three T's (Time, Talent, Treasure)
- **MATURE** — Three C's (Character, Competency, Consistency)
- **WHY** — Kingdom WHY (Fan → Follower)

Results in: Current Tier (0–5), DISC Profile, Risk Level (Green/Yellow/Red), AI Kingdom Profile

### 2. Pastoral Dashboard (`/#/dashboard`)
Real-time pipeline view showing:
- Total members assessed
- DISC breakdown across the congregation
- Tier distribution (Seeker → Architect)
- Individual score bars per dimension
- Green/Yellow/Red risk classification

### 3. Church Health Score (`/#/qualify`)
5-question qualifying assessment for prospective church clients.
Outputs one of three tiers:
- **Growth Partner** ($3,500 + $499/mo)
- **Church Starter** ($2,500 + $149/mo)
- **Blueprint Session** ($497 one-time)

---

## Leadership Journey

```
Tier 0 — Seeker      → Still deciding
Tier 1 — Disciple    → Learning and growing
Tier 2 — Servant     → Deployed in gifting
Tier 3 — Leader      → Leading others
Tier 4 — Multiplier  → Developing leaders
Tier 5 — Architect   → Building systems
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS v3 + shadcn/ui |
| Backend | Express.js |
| Database | SQLite (via Drizzle ORM) |
| Build | Vite |
| AI Profiles | Anthropic Claude API |
| Hosting | Hostinger Node.js |
| Deployment | GitHub → Hostinger auto-deploy |

---

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5000

---

## Deployment (Hostinger)

1. Push this repo to GitHub
2. In Hostinger: **Create Website → Node.js → Connect GitHub**
3. Select this repo, Framework: **Vite**
4. Add environment variables (see `.env.example`):
   - `ANTHROPIC_API_KEY`
   - `VITE_ANTHROPIC_API_KEY`
5. Click Deploy — auto-deploys on every future push

---

## Google Sheets Integration (Optional)

Deploy `242go-apps-script.gs` to Google Apps Script as a Web App.
Paste the Web App URL into the Pastoral Dashboard → "Connect to Google Sheets."

Every submission will:
- Auto-populate your Google Sheet
- Color-code the risk level (Green/Yellow/Red)
- Send an email alert to the pastor

---

## Markets

| Market | Product |
|--------|---------|
| Church | 242Go Church Edition |
| School | 242Go Leadership Academy |
| Business | 242Go People Development |

---

## Built With

- GGI Solutions — [ggihub.com](https://ggihub.com)
- Jesus Generation Movement
- Go Get It Motivation

*"The wall is still standing. Don't come down."* — Nehemiah 6:3
