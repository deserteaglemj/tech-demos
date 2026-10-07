# PLAN — hyperframes-vs-remotion

## Goal
Install HyperFrames, prove local render works, and ship a side-by-side studio that compares the same 3s title card in HyperFrames HTML vs Remotion React.

## Source
- Tech: HyperFrames (HeyGen) — https://github.com/heygen-com/hyperframes
- Comparison guide: https://hyperframes.heygen.com/guides/hyperframes-vs-remotion
- Foil: Remotion (already planned in `apps/remotion-promo-studio/`)

## MVP scope (in)
- HyperFrames composition: fade-in / hold / fade-out “HELLO” title card (3s @ 30fps, 1280×720)
- Remotion composition: identical animation via `useCurrentFrame` + `interpolate`
- Comparison studio UI: dual players, authoring snippets, decision matrix
- CLI smoke: `hyperframes lint` + `hyperframes render` of the HTML composition
- README: `bun install && bun run dev` (+ optional `bun run render:hf`)

## Out of scope
- AWS Lambda / HeyGen cloud render
- Agent skills install / Remotion→HyperFrames migration skill
- Audio, multi-scene promos, Studio desktop app

## Stack
- Bun + Vite + React + TypeScript
- `hyperframes` CLI + `@hyperframes/player`
- `remotion` + `@remotion/player`
- Run: `cd apps/hyperframes-vs-remotion && bun install && bun run dev`

## File sketch
- `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- `public/hyperframes/index.html` — HyperFrames composition
- `src/remotion/TitleCard.tsx` — Remotion composition
- `src/App.tsx` — dual-player comparison studio
- `README.md`, this `PLAN.md`

## Acceptance criteria
- [ ] `bun install && bun run dev` serves the comparison studio
- [ ] HyperFrames player and Remotion Player both play the same HELLO title card
- [ ] `bun run render:hf` produces a 3s MP4 via HyperFrames
- [ ] UI surfaces authoring + license / build-step differences
- [ ] PR includes ≥1 screenshot and ≥1 video of the running studio

## Validation
Capture screenshot + video from the running dual-player UI and attach both to the PR. Not optional.
