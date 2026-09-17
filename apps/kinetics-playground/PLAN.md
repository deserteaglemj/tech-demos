# PLAN — kinetics-playground

## Goal
Ship a Bun + Vite + React playground of 6–8 Kinetics-style spring micro-interactions with live stiffness/damping knobs and copy-ready snippets.

## Source
- Tech: Kinetics (https://kinetics.colorion.co)
- Bookmark: https://x.com/tranmautritam/status/2076963534307790926

## MVP scope (in)
- Magnetic button, toast overshoot, gliding tabs, rubber slider, like burst, hold-to-confirm (+ 1–2 more if easy)
- Live stiffness/damping controls
- Copy-ready CSS/React snippets where practical
- README: `bun install && bun run dev`

## Out of scope
- Full Kinetics site clone, design-system packaging

## Stack
- Bun + Vite + React; Kinetics springs via library or equivalent CSS/React springs matching Kinetics feel
- Run: `cd apps/kinetics-playground && bun install && bun run dev`

## File sketch
- `package.json`, Vite config, `src/` demos + knobs, `README.md`, this `PLAN.md`

## Acceptance criteria
- [ ] `bun install && bun run dev` works
- [ ] 6–8 interactive springs with knobs
- [ ] PR includes ≥1 screenshot and ≥1 video of interactions

## Validation
Screenshot + video of the running app in the PR. Not optional.
