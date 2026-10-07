# PLAN — openrig-playground

## Goal
Install/test OpenRig, demo its stub-team lifecycle in a Bun UI, and compare it side-by-side with Paperclip.

## Source
- Tech: OpenRig — https://github.com/mvschwarz/openrig
- Comparison: Paperclip — https://github.com/paperclipai/paperclip

## MVP scope (in)
- Live comparison page: metaphor, runtime model, install path, surfaces, when-to-pick
- Interactive OpenRig stub-team board (pods/seats/edges) driven by fixture data from real install findings
- Captured install/test notes from this environment (`rig doctor`, daemon health, stub `rig up`, Paperclip Node/engine notes)
- README with `bun install && bun run dev`

## Out of scope
- Full Claude Code / Codex authenticated team launch
- Running Paperclip’s full company dashboard in-process (document install findings instead)
- Publishing or forking either upstream project

## Stack
- Bun + Vite + React
- Run: `cd apps/openrig-playground && bun install && bun run dev`

## File sketch
- `package.json`, Vite/TS configs, `index.html`
- `src/App.tsx` — comparison composition + stub board
- `src/data/findings.ts` — install/test evidence
- `src/data/comparison.ts` — OpenRig vs Paperclip axes
- `README.md`, this `PLAN.md`

## Acceptance criteria
- [ ] `bun install && bun run dev` works
- [ ] First viewport communicates OpenRig vs Paperclip clearly
- [ ] Interactive stub-team demo section works without provider auth
- [ ] Findings reflect real CLI/install attempts from this run
- [ ] PR includes ≥1 screenshot and ≥1 video of the running app

## Validation
Screenshot + video of the running app in the PR. Not optional.
