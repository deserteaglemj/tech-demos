# PLAN — opengym-chc-demo (full app)

## Goal
Ship a full openGym-style training app demo (all primary screens) branded for Chris Harris Coaching, plus a walkthrough that visits every page.

## Source
- Tech: openGym — https://github.com/DuarteSantos8/openGym
- Brand: Chris Harris Coaching — https://chrisharrizcoaching.com

## MVP scope (in)
Mirror openGym’s primary chrome and pages with seeded CHC data:

**Tab bar (openGym layout)**
- Home · Plan · Start/Workout · Stats · Exercises

**Pages**
- Home — today card, body weight, streak, quick links
- Plan — Mon–Sun week with CHC Upper/Lower/Push routines
- Workout — guided sets, rest timer, PR toast, finish session
- Stats — year heatmap strip, body-weight chart, lift PRs, link to History
- Exercises (Library) — searchable list + muscle filter chips
- History — past sessions list (from Stats)
- Muscles — balance / fatigue / detrained modes on a simple muscle map
- Settings — athlete profile, units, accent preview, reset demo

**Also**
- CHC Structure branding throughout
- localStorage persistence
- README: `bun install && bun run dev`
- Walkthrough video covering every page + screenshots

## Out of scope
- Forking openGym source, passkeys, Docker/self-host, Strong/Hevy import, AI coach, multi-user sync, 1,324 real exercise media

## Stack
- Bun + Vite + React + TypeScript
- Run: `cd apps/opengym-chc-demo && bun install && bun run dev`

## File sketch
- `src/App.tsx`, `src/styles.css`, `src/data/seed.ts`, `src/lib/store.ts`
- `src/components/Shell.tsx` (5-tab openGym bar)
- `src/pages/{Home,Plan,Workout,Stats,Library,History,Muscles,Settings}.tsx`
- `public/brand/`, `PLAN.md`, `README.md`

## Acceptance criteria
- [x] `bun install && bun run dev` works
- [x] All 8 pages reachable and interactive with seeded data
- [x] Tab bar matches openGym Home / Plan / Start / Stats / Exercises
- [x] CHC branding reads clearly on every surface
- [x] PR includes screenshots of each page + one full walkthrough video

## Validation
Screenshot every page + one video walking the full app. Not optional.
