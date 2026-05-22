# Four Paws Training & Enrichment Academy

**Luxury Canine Transformation Platform — ODIN Tier**

A full-stack offline-first PWA delivering an elite behavioural intelligence experience for premium dog training clients.

---

## Stack

- **Framework:** React 18 + Vite 5
- **Styling:** Tailwind CSS + custom luxury design system
- **Motion:** Framer Motion
- **PWA:** vite-plugin-pwa + Workbox
- **AI Layer:** Offline LBIL (Living Behavioural Intelligence Layer) — no external APIs

---

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

**Demo credentials:**
- Admin: `admin@fourpawsacademy.com` / `admin2024`
- Client: `v.hartley@hartleygroup.co.uk` / `demo123`

---

## Build

```bash
# Standard build (advisory firewall)
npm run build

# Production build with hard firewall enforcement
npm run build:strict
```

---

## Deployment (Vercel)

The `vercel.json` at the root configures the build command automatically:

```
NODE_ENV=production FP_ENFORCE_FIREWALL=1 node build/firewall/mockDataGuard.js --production && FP_ENFORCE_FIREWALL=1 vite build
```

The **Deployment Firewall** runs before every build. It will block deployment if any mock/demo data is detected in the production module graph.

To deploy:
1. Push to GitHub
2. Connect repo to Vercel
3. Vercel auto-detects `vercel.json` — no further config needed

---

## Deployment Firewall

```bash
# Advisory check (warnings only)
node build/firewall/mockDataGuard.js

# Hard production check (exits 1 on any violation)
node build/firewall/mockDataGuard.js --production
npm run build:check
```

Violations are reported with file path, line number, and remediation guidance.

---

## Architecture

```
LBIL (intelligenceCore.js)
  └── Narrative Engine (narrativeVoice.js)
        └── Three Experience Surfaces:
              ├── Intelligence Feed
              ├── Guidance Layer
              └── Companion View
```

**Product Lock:** ODIN Tier — Feature Freeze active. See `src/config/productLock.js`.

---

## Project Structure

```
src/
  ai/           — Offline intelligence layer (LBIL)
  components/   — Shared UI components
  config/       — Product lock + academy config
  context/      — AppContext (SSOT)
  data/         — Production-safe static data only
  dev/          — Mock/demo data (dev + runtime only)
  hooks/        — Custom React hooks
  layouts/      — Route layouts
  pages/        — Public, academy, admin pages
  routes/       — Route definitions
  styles/       — Global CSS + design tokens
  utils/        — License, identity, activation utilities
build/
  firewall/     — Deployment firewall scripts
```
