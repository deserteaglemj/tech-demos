# testerarmy-e2e-playground

Interactive + Studio demo of [TesterArmy e2e](https://github.com/tester-army/e2e).

## Studio (default — website narrative)

Opens a ~25s walkthrough:

1. You prompt a coding agent to use e2e for billing upgrade
2. The agent writes `tests/checkout.e2e.ts`
3. e2e runs, drives the app Free → Pro
4. Output: PASS, model calls, `.e2e/cache` ready for CI

```bash
cd apps/testerarmy-e2e-playground
bun install
bun run dev
```

- Autoplay for capture: open `http://localhost:5173/?play=1`
- Interactive lab: `http://localhost:5173/?mode=lab`
- Efficacy results (Cursor vs e2e on mstudios.digital): `http://localhost:5173/?mode=results`

## Live efficacy bench

`bench/` runs TesterArmy `e2e` against https://mstudios.digital (Get Started → contact).

```bash
cd apps/testerarmy-e2e-playground/bench
# needs Node >= 24.8 (or >= 22.22.3)
bun install
bunx playwright install chromium
E2E_TELEMETRY_DISABLED=1 npx e2e run tests/contact.locators.e2e.ts
# agent path needs AI_GATEWAY_API_KEY
```

See `results/COMPARISON.md` for the Cursor-native vs e2e scoreboard.

## Prompt for your local agent

Copy `prompts/ENSURE-TESTERARMY-E2E.md` into Cursor/Claude Code to force install → use-case mining → adoption hooks → green tests.

## Lab mode

Simulated runner (no Playwright / API key):

1. **Run test** — live agent path, writes cache
2. **Run again** — cache HIT, fewer model calls
3. **Scramble UI labels** — miss → handoff → re-record

## Source

https://github.com/tester-army/e2e
