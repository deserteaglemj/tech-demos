# PLAN — testerarmy-e2e-playground

## Goal
Ship a Bun + Vite playground that demos TesterArmy's `e2e`, including a website-ready Studio narrative: talk to an AI agent → it uses e2e → show the output.

## Source
- Tech: e2e by TesterArmy — https://github.com/tester-army/e2e
- Site: https://tester.army/e2e

## MVP scope (in)
- **Studio mode (default):** cinematic walkthrough — user prompts a coding agent to use e2e, agent writes `tests/checkout.e2e.ts`, runs the suite, drives billing Free→Pro, shows PASS + cache output
- **Lab mode (`?mode=lab`):** interactive simulated runner with cache replay + scramble handoff
- Mini billing app under test
- README: `bun install && bun run dev` (+ `?play=1` autoplay for capture)

## Out of scope
- Real Playwright / LLM / npm `e2e` package install
- Mobile engines, CI reporter, Kernel/EAS hosts

## Stack
- Bun + Vite + React + TypeScript
- Run: `cd apps/testerarmy-e2e-playground && bun install && bun run dev`

## File sketch
- `src/studio/StudioDemo.tsx`, `src/studio/script.ts`
- `src/App.tsx` (studio | lab), billing/lab components, `README.md`, this `PLAN.md`

## Acceptance criteria
- [ ] `bun install && bun run dev` works
- [ ] Studio Play demo shows chat → write test → run → output
- [ ] Lab still demos live act, cache replay, scramble handoff
- [ ] PR includes ≥1 screenshot and ≥1 website-style studio video

## Validation
Screenshot + video of the Studio narrative in the PR. Not optional.
