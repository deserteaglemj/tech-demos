# PLAN — gods-eye-view

## Goal
Install and run God's Eye View (open-source spy-satellite / live globe console) as a demable Bun app in this monorepo, keyless start.

## Source
- Tech: God's Eye View — https://github.com/bilawalsidhu/gods-eye-view
- Live site: https://maptheworld.ai/

## MVP scope (in)
- Vendored upstream checkout under `apps/gods-eye-view/`
- `bun install && bun run dev` starts the Vite + Cesium app (keyless Esri/OSM basemap)
- First-run mission panel usable; enable Flights / Satellites / Earthquakes without API keys
- Thin monorepo README pointing at upstream docs + run commands
- Capture ≥1 screenshot and ≥1 video of the running globe for the PR

## Out of scope
- Cesium ion / Google Maps / OpenAI keys (optional POWER UP)
- Voice agent, photorealistic 3D tiles, Pinokio packaging
- Upstream feature changes or rebasing onto a fork workflow

## Stack
- Bun (install + scripts) with Node 24+ available for Vite/doctor scripts
- Cesium, Vite 6, satellite.js, hls.js (upstream deps)
- Run: `cd apps/gods-eye-view && bun install && bun run doctor && bun run dev`
- Open `http://localhost:4173`

## File sketch
- Upstream tree: `src/`, `server/`, `public/`, `index.html`, `vite.config.js`, `package.json`
- `PLAN.md` (this file), monorepo-facing `DEMO.md` (run notes)

## Acceptance criteria
- [ ] `bun install && bun run doctor` succeeds (or documents non-blocking warnings)
- [ ] `bun run dev` serves the globe at localhost:4173
- [ ] First-run UI loads; at least one live keyless layer (e.g. Flights or Satellites) can be toggled
- [ ] PR includes ≥1 screenshot and ≥1 video of the running app

## Validation
Screenshot + video of the running app in the PR. Not optional.
