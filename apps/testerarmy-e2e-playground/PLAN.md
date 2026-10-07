# PLAN — testerarmy-e2e-playground

## Goal
Ship a Bun + Vite playground that demos TesterArmy's `e2e`: natural-language `agent.act`, locator `expect`, and verified-act cache replay with zero model calls on the second run.

## Source
- Tech: e2e by TesterArmy — https://github.com/tester-army/e2e
- Site: https://tester.army/e2e

## MVP scope (in)
- Mini "billing settings" app under test (Free → Pro upgrade)
- Side-by-side test script matching the public SDK shape (`app`, `agent`, `screen`, `expect`)
- Simulated runner: first run = model path (records actions); second run = cache replay (0 model calls)
- Live step trace + model-call counter + cache HIT/MISS
- "Scramble UI labels" control to force a cache miss / agent handoff
- README: `bun install && bun run dev`

## Out of scope
- Real Playwright / LLM / npm `e2e` package install
- Mobile engines, CI reporter, Kernel/EAS hosts

## Stack
- Bun + Vite + React + TypeScript
- Run: `cd apps/testerarmy-e2e-playground && bun install && bun run dev`

## File sketch
- `package.json`, Vite config, `src/App.tsx`, `src/components/{BillingApp,TestPanel,RunTrace}.tsx`, `src/lib/{runner,cache,scenarios}.ts`, `README.md`, this `PLAN.md`

## Acceptance criteria
- [ ] `bun install && bun run dev` works
- [ ] Run upgrades the mini-app via simulated `agent.act` + locator assert
- [ ] Second run replays from cache with 0 model calls
- [ ] Scramble labels causes miss/handoff, then re-records
- [ ] PR includes ≥1 screenshot and ≥1 video

## Validation
Screenshot + video of the running app in the PR. Not optional.
