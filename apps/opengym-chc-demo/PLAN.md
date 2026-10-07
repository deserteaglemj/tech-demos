# PLAN — opengym-chc-demo

## Goal
Ship a single-user openGym-style workout tracker demo branded for Chris Harris Coaching (CHC / Breaking Limits).

## Source
- Tech: openGym — https://github.com/DuarteSantos8/openGym
- Brand: Chris Harris Coaching — https://chrisharrizcoaching.com (silver + ember orange “Structure” identity)

## MVP scope (in)
- Home: today’s CHC session, streak, body-weight glance
- Guided workout: log sets (weight × reps), rest timer, PR callout
- Progress: week heatmap + simple lift chart (seeded demo data)
- Full CHC branding: logo mark, Fraunces + Space Grotesk, dark surfaces, ember accent, hero imagery
- Local persistence (localStorage) so a logged set survives refresh
- README: `bun install && bun run dev`

## Out of scope
- Full openGym fork, passkeys, Docker/self-host, import from Strong/Hevy, AI coach, multi-user sync

## Stack
- Bun + Vite + React
- Run: `cd apps/opengym-chc-demo && bun install && bun run dev`

## File sketch
- `package.json`, `vite.config.ts`, `index.html`
- `src/main.tsx`, `src/App.tsx`, `src/styles.css`
- `src/data/seed.ts`, `src/lib/store.ts`
- `src/components/{Home,Workout,Progress,Shell}.tsx`
- `public/brand/` (CHC mark + hero)
- `README.md`, this `PLAN.md`

## Acceptance criteria
- [ ] `bun install && bun run dev` works
- [ ] Home → start workout → log a set → rest timer → see PR / progress update
- [ ] UI clearly reads as Chris Harris Coaching (brand-first, not generic gym chrome)
- [ ] PR includes ≥1 screenshot and ≥1 video of the running app

## Validation
Screenshot + video of the running app in the PR. Not optional.
