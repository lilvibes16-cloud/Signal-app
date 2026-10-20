# SIGNAL — Creator Intelligence

A mobile-responsive, demo-first workspace for YouTube content creators. Topics, scores, competition labels and charts are **illustrative demo data**, not live YouTube analytics or validated predictions.

## Setup

Requires Node.js 20+ and npm. Dependencies are locked for reproducible installations.

```bash
npm ci
npm run dev
```

Open the local URL Vite prints. The development server also accepts `terminal.local` for the managed preview environment; it does not allow arbitrary hostnames.

## Tests and build

```bash
npm test
npm run build
npm run preview
```

Tests use Node's built-in runner. They cover filtering, restored watchlists, invalid storage, blocked/quota-exceeded writes, research progress validation, sorting and brief content. The production build currently reports a non-fatal warning for its chart-heavy JavaScript bundle; reducing this bundle is future work.

## Features

- Responsive overview and discovery dashboard with black and neon-red styling
- Keyword search, category/format filters, and sorting by demo score, demo competition or title
- Topic details with clearly labeled synthetic charts and creative angles
- Browser-local saved ideas, with existing `signal.savedIdeas.v1` watchlists preserved
- Per-topic research notes, source links, seven-item checklist and production stage
- Downloadable Markdown research briefs including notes, checklist progress and demo disclosure
- External YouTube keyword searches, explicitly labeled as links rather than imported research
- Mobile menu with focus containment, Escape to close, and focus restoration
- Reduced-motion support, including JavaScript chart animations

## Research workflow

1. Open an idea from Discover and save it to your watchlist.
2. In the topic's research workspace, select a stage and record sources and observation dates.
3. Complete the checklist as you validate the concept; progress never changes the demo score.
4. Download the brief to keep a portable copy of your work.

Notes and progress save for any topic, even when it is not bookmarked. Removing a bookmark keeps its research. All data stays in the current browser; there are no accounts, cross-device sync, backend, API keys or payments. Clearing site storage removes saved work. If storage is blocked or full, the app continues in memory and displays a warning; download briefs before leaving. Multiple tabs do not synchronize editing, so use one tab for research at a time.

## Deployment

This is a static Vite app. Use `npm ci && npm run build` and publish `dist` on a static host. The app uses in-memory navigation, so server-side route rewrites are not required. Keep the host at a root URL, or configure Vite's `base` for subpath hosting. Do not upload `.env`, `node_modules`, or development tooling. No deployment or hosting subscription is created by this repository.

## Architecture

- `src/data.js`: demo fixtures and filtering
- `src/App.jsx`: navigation, discovery, details and workspace composition
- `src/components/Trend.jsx`: isolated charts with unique gradient IDs
- `src/components/ResearchWorkspace.jsx`: research form and brief download
- `src/hooks/usePersistentState.js`: guarded browser persistence
- `src/workspace.js`: data normalization, checklist, stages and sorting
- `src/research.js`: pure Markdown brief generation
- `src/styles.css`: responsive visual system
- `src/*.test.js`: regression tests

Real YouTube data still requires an explicit API integration, source attribution, backend-protected credentials, quota handling and a defined scoring methodology. Never present demo scores as prediction accuracy.
