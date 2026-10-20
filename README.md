# SIGNAL — Creator Intelligence

A polished mobile-responsive demo-first SaaS MVP for YouTube content creators. All topics, scores and chart values are **illustrative demo data**, not live YouTube analytics or validated predictions.

## Setup

Requires Node.js 20+.

```bash
npm install
npm run dev
```

## Tests and build

```bash
npm test
npm run build
```

## Features

- Responsive landing/overview dashboard with futuristic black and neon-red design
- Opportunity discovery with keyword search, category and video format filters
- Topic details with demo charts, creative angles and sample scores
- Saved-ideas watchlist persisted locally in browser localStorage
- Accessible navigation, mobile drawer and reduced-motion support

## Deployment

Static Vite build. On a static hosting platform, use `npm run build` and publish `dist`. No paid services, secrets, or API keys required. For SPA navigation, the app uses in-memory navigation and does not require server rewrites.

## Architecture and future integration

- `src/data.js`: typed-by-convention demo topic fixtures and pure filtering helper
- `src/App.jsx`: React UI and local watchlist state
- `src/styles.css`: responsive visual system
- `src/data.test.js`: Node built-in tests

Watchlist persistence is local to one browser and is not synchronized across devices. Real YouTube data requires explicit API integration, source attribution, credential protection on a backend, and a clearly defined scoring methodology. Never present sample scores as prediction accuracy.
