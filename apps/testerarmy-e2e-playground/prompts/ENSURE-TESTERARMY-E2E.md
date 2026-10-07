# Prompt: Install TesterArmy e2e, find real use cases, and make sure it gets used

Copy everything below the line into your local coding agent (Cursor / Claude Code / etc.).

---

## Role

You are my **staff engineer + QA architect**. Your job is not to “demo” TesterArmy e2e — it is to **install it correctly, discover where it pays rent in THIS repo, wire it so future agents prefer it, and leave behind green tests that prove it is used.**

## North-star outcome

By the end of this session:

1. TesterArmy **e2e** is installed and runnable in this project.
2. You have identified **≥3 concrete use cases** from *this* codebase (not generic examples).
3. At least **2 of those use cases** are implemented as real `*.e2e.ts` tests that **pass**.
4. Project instructions force future agents to use e2e for new UI E2E work.
5. You report a short **adoption ledger** (what changed, how to run, what still needs a model key).

## Hard constraints

- Prefer the official path: docs at https://e2e.tester.army/docs and the package skill via `npx e2e init` / `npx e2e guide`.
- Stack default for this monorepo demo world is Bun when applicable; otherwise match the repo’s package manager.
- **One `agent.act` per goal**, then pin the outcome with `expect(...)` (or `agent.assert` for semantic checks).
- **No `sleep()` / arbitrary waits.** Locators and `expect` already retry.
- **No secrets in tests.** Use `credentials` / `secrets` in config.
- Do **not** add Playwright/Cypress/Selenium as the primary E2E layer for new UI flows in this task. If the repo already has them, migrate **one** critical path to e2e instead of duplicating forever.
- Do **not** invent fake product flows. Discover real routes/components first.
- If `AI_GATEWAY_API_KEY` (or another configured provider key) is missing: still ship **locator-only** tests that pass; mark agent tests with an explicit skip reason; document exactly which env var unlocks them.
- Keep changes scoped; no drive-by refactors.

## Prompt patterns you must follow (meta)

Use these internally while working:

1. **Plan → Act → Verify** loops (never “write all tests then maybe run”).
2. **ReAct**: after every failure, state Observation → Hypothesis → Next action.
3. **Rubric gating**: do not claim done until the Acceptance Rubric below is all green.
4. **Progressive disclosure**: read `.agents/skills/e2e/SKILL.md` (or `npx e2e guide`) *before* writing config/tests.
5. **Use-case mining**: derive tests from user-visible risk, not from “what’s easy to automate.”

## Phase 0 — Orient (15 minutes max)

1. Detect package manager, app start command, ports, framework (Vite/Next/etc.).
2. Search for existing E2E (`playwright`, `cypress`, `e2e`, `tests/**/*.e2e.ts`).
3. Identify how to run the app locally (`dev` script, required env).
4. Output a 5-bullet **Orientation Brief** before installing anything.

Gate: Orientation Brief exists and names the start command + URL.

## Phase 1 — Install (official path)

1. From the app package root (or a dedicated `e2e/` workspace if the monorepo requires it):

```bash
npx e2e init
# or: bunx e2e init / pnpm dlx e2e init
```

2. Ensure these land (or equivalent):
   - `e2e` + `@e2e-dev/web` (+ `playwright`) in package.json
   - `e2e.config.ts` with `web()` target and `app.url` / `app.command`
   - skill at `.agents/skills/e2e/` (and Cursor MCP entry if `init` offers it)
   - scripts such as `"test:e2e": "e2e run"`
3. Install browser deps if needed: `npx playwright install chromium`
4. Node runtime: if CLI rejects the Node version, upgrade to a supported Node (e2e currently wants recent Node 22.22+ or 24.8+) rather than hacking around it.
5. Configure a model **only if a key is available**. Prefer Vercel AI Gateway:

```ts
import { gateway } from 'ai'
agents: { default: { model: gateway('openai/gpt-4.1-mini'), system: 'Thorough QA. Verify on-screen outcomes.' } }
```

Gate: `npx e2e run --help` works and config loads without `CONFIG_LOAD_FAILED`.

## Phase 2 — Find use cases in THIS product

Mine the repo for UI risk. Produce a **Use Case Matrix** with columns:

| ID | User goal | Entry URL/route | Why e2e (risk) | Agent vs locator | Priority |
| --- | --- | --- | --- | --- | --- |

Selection heuristics (pick the highest scores):

- **Money / auth / irreversible** actions (billing, signup, delete, permissions)
- **Multi-step** wizards where selectors rot
- **Copy-dependent** flows (labels change; agent.act helps)
- **Smoke paths** every PR should protect (home → primary CTA → success)
- **Known flaky** areas in existing suites

Require at least:

- 1 **smoke** path (locators OK)
- 1 **multi-step / fuzzy UI** path (`agent.act` if model available; else locator with a TODO)
- 1 **negative / validation** path (empty submit, bad email, etc.)

Gate: Matrix has ≥3 rows grounded in real files/routes you cite.

## Phase 3 — Ensure it is used (adoption plumbing)

Do all of the following that fit the repo:

1. Add/adjust **AGENTS.md** (or project rules) with:

```md
End-to-end UI tests use TesterArmy e2e. Read `.agents/skills/e2e/SKILL.md` before writing or running one. Prefer `agent.act` + `expect` over new Playwright/Cypress specs for UI flows.
```

2. Add npm/bun scripts: `test:e2e`, optionally `test:e2e:smoke`.
3. If CI exists, add a job that runs **locator/smoke** tests without requiring a model key; agent tests may be `if: env.AI_GATEWAY_API_KEY`.
4. Commit guidance: mention that verified agent recordings live under `.e2e/cache/` when you adopt agent tests.
5. Register `e2e mcp` for Cursor if not already (`.cursor/mcp.json`) so agents can `observe`/`locate` before writing selectors.

Gate: a new contributor (or agent) can discover e2e from AGENTS.md + package scripts alone.

## Phase 4 — Implement & prove

For each selected use case (min 2 implemented now):

1. Inspect the live UI (dev server, headed run, or `e2e mcp`) to learn **accessible names**.
2. Write `tests/<feature>.e2e.ts` using the official style:

```ts
import { test } from '@e2e-dev/web'
import { expect } from 'e2e'

test('…', async ({ app, agent, screen }) => {
  await app.open('/path')
  await agent.act('one concrete goal')
  await expect(screen.getByRole('…', '…')).toBeVisible()
})
```

3. Prefer placeholders/roles that exist in the DOM; if labels lack `for`/`id`, use `getByPlaceholder` / roles — do not force brittle CSS.
4. Run **one file at a time**:

```bash
npx e2e run tests/<feature>.e2e.ts --reporter list,markdown
```

5. On failure: read `.e2e/summary.md` / failure pages / trace — fix locator, expectation, or app. No sleeps.
6. Re-run until green. For agent tests with a key, run a **second** time and note whether act steps replay from cache.

Gate: ≥2 tests green in the last run; paste the command + pass summary.

## Phase 5 — Adoption ledger (your final reply format)

Return exactly these sections:

### 1. Orientation Brief
### 2. Install actions (commands + versions)
### 3. Use Case Matrix
### 4. Tests shipped (paths + what they cover)
### 5. How to run
### 6. Adoption hooks (AGENTS.md / CI / MCP)
### 7. Gaps (model key, flaky areas, not-yet-migrated Playwright)
### 8. Rubric self-score (table below)

## Acceptance Rubric (all must be ✅)

| # | Criterion | ✅/❌ |
| --- | --- | --- |
| R1 | `e2e` installed; config loads | |
| R2 | Skill or `e2e guide` reachable offline | |
| R3 | ≥3 repo-specific use cases documented | |
| R4 | ≥2 passing `*.e2e.ts` tests | |
| R5 | Package script `test:e2e` works | |
| R6 | AGENTS.md/rules steer future agents to e2e | |
| R7 | No new primary Playwright/Cypress suite added for these flows | |
| R8 | Final ledger lists exact run commands | |

## Anti-goals (fail the task if you do these)

- Stop after `e2e init` with only the sample greeting test and no product-specific coverage.
- Write tests that never run.
- Use e2e against a URL you didn’t verify is this app.
- Claim agent/cache benefits without a model key or a second-run observation.
- Flood the PR with unrelated formatting changes.

## Kickoff

Start with Phase 0. Do not install until the Orientation Brief is written. Then proceed phase by phase, verifying each gate.
