# EcoLogix.AI — Unified Sustainable Logistics Platform
EcoLogix.AI is a unified logistics operations platform featuring four modules: an eco-route optimizer using golden ratio dispatch scoring, a predictive backhauling engine to eliminate empty miles, a headless SMS assistant for driver communication with auto-reassignment, and a live analytics dashboard — all served from a single Node.js backend.

## Features

| Tab | What it does |
|---|---|
| **Dashboard** | Live fleet analytics, carbon savings, driver leaderboard, shipment tracking |
| **Eco-Routing** | Golden ratio dispatch scoring, weight-aware route optimization, weather alerts, micro-hub pickups |
| **Backhauling** | AI match engine to eliminate empty return miles, green bonus calculator, offer/accept flow |
| **SMS Assistant** | Headless driver communication via SMS — load dispatch, auto-reassignment, edge-cached offline navigation |


## Project Structure
ecologix/
├── server.js          ← unified backend (all 4 features, single Express server)
├── package.json
├── .env
└── public/
├── index.html     ← main shell with 4-tab navigation
├── shared/
│   └── theme.css  ← unified design system injected across all tabs
├── dashboard/
├── ecorouting/
├── backhauling/
└── sms/

## How to Run the Prototype

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/SoumyaSuman05/DPWH044.git
cd ecologix
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the server**
```bash
npm start
```

**4. Open in browser**

## Tech Stack

- **Backend** — Node.js, Express
- **Frontend** — Vanilla HTML/CSS/JS (no framework)
- **Data** — In-memory (no database required)
- **SMS** — Simulated Twilio integration
- **Charts** — Chart.js (loaded via CDN)

## Contributors
- Soumya Suman
- Rakshita Arora
