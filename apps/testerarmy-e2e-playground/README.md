# testerarmy-e2e-playground

Interactive demo of [TesterArmy e2e](https://github.com/tester-army/e2e): mix natural-language `agent.act` / `agent.assert` with deterministic `expect` locators, then replay a verified act from cache with **zero model calls**.

This playground simulates the runner in the browser (no Playwright, no API key). The test source mirrors the public SDK example.

## Run

```bash
cd apps/testerarmy-e2e-playground
bun install
bun run dev
```

## Try

1. **Run test** — live agent path upgrades Free → Pro, then writes `.e2e/cache`.
2. **Run test** again — cache HIT, replayed act, model calls drop (assert still live).
3. Toggle **Scramble UI labels** and run — cache miss → handoff → re-record.
4. **Force live agent** behaves like `--no-cache`.

## Source

https://github.com/tester-army/e2e
