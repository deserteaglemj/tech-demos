# Efficacy comparison — M Studios contact intake

**Target:** https://mstudios.digital  
**Flow:** Home → **Get Started** → fill Name/Email/Company/Message → **Send Message** → thank-you toast  
**Date:** 2026-10-07  

Test payload was clearly marked discardable evaluation data (not a real lead).

## Scoreboard

| Metric | Cursor native (computer-use agent) | TesterArmy `e2e` locators | TesterArmy `e2e` agent (`agent.act`) |
| --- | ---: | ---: | ---: |
| Outcome | **PASS** | **PASS** | **SKIPPED** (no `AI_GATEWAY_API_KEY`) |
| Wall / attempt time | **220s** | **4.3s** (run1) / **3.9s** (run2) | n/a |
| Model tokens (metered) | opaque (Cursor) | **0** | would require paid model |
| Setup before first run | none | Node 24 + Playwright Chromium + npm pkgs | same + API key |
| CI-reproducible script | no | **yes** | yes (once keyed + cached) |
| Natural-language goals | yes (chat to agent) | no (hand-written locators) | yes (`agent.act`) |
| Cache replay (0 model on re-run) | no | n/a (no model) | feature exists; **not measured** (no key) |
| Retries / errors | 0 / 0 | 0 / 0 | n/a |

## What each runner actually did better

### Cursor native won for: “just make it work once”
- Zero install friction in this environment.
- Handled the real site from a plain English goal.
- Verified success via the toast UI.

**Cost of that win:** ~**36× slower** than the scripted e2e path on the same flow, and not something you drop into CI as a regression gate.

### TesterArmy e2e locators won for: speed, determinism, CI
- Same happy path completed in **~4s**, twice.
- Strong typed assertions (`expect(...).toBeVisible()`).
- Trace artifact produced for debugging.

**Cost of that win:** you (or an agent) must **author locators** up front. On this site, `getByLabel` was a poor fit (labels without `for`/`id`); placeholders were the stable hook — a real maintenance detail.

### TesterArmy e2e agent path: not comparable today
The differentiator advertised by TesterArmy — natural-language `agent.act` + verified cache replay — **did not run** here because this VM has **no model API key**. That is itself an efficacy finding:

> If you already have Cursor, you already have a model-backed agent that can drive a browser. e2e’s agent mode needs **another** keyed model subscription (`AI_GATEWAY_API_KEY` or equivalent) before it can beat Cursor on NL goals — then it can potentially beat Cursor on **repeat** runs via cache.

## Verdict (for this flow)

1. **One-off exploratory application / intake check:** Cursor native is enough and was easier to start.
2. **Repeated regression / PR gate on this form:** TesterArmy `e2e` **locator** suite is clearly better (speed + reproducibility).
3. **Whether e2e-the-product is “better than tools you already have” for NL agent flows:** **inconclusive on this run** — the agent/cache story needs a model key to prove value over Cursor. Without that, e2e still adds value as a **Playwright-class test runner with a nice API**, not as a Cursor replacement.

## Artifacts

- Cursor result screenshot: `/opt/cursor/artifacts/screenshots/mstudios-cursor-native-result.png`
- Metrics JSON: `results/cursor-native.json`, `results/e2e-locators.json`
- Raw reports: `results/e2e-locators-run.log`, `results/e2e-agent-run.log`
- Bench tests: `bench/tests/contact.locators.e2e.ts`, `bench/tests/contact.agent.e2e.ts`
