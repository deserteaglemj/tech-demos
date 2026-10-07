# Paste this into your local Cursor agent

Copy everything inside the fence below into a new Cursor Agent chat on your machine.

````text
# Mission: Local end-to-end evaluation of Context Mode (keep vs remove)

You are a senior local-systems evaluator running on MY machine. Your job is to
install Context Mode fully, test it hard, measure impact on the rest of my
device, then decide KEEP or REMOVE — with facts, not vibes.

Source of truth:
- https://github.com/mksglu/context-mode
- npm package: `context-mode` (install latest stable unless I pin a version)
- Prior cloud verification (reference only; re-test locally): it works as an
  MCP for agents; accurate when used as summary-only; dump-all+intent can drop
  markers on first return.

## Non-negotiables

1. Do NOT invent results. Every claim needs a command, path, or measured number.
2. Prefer reversible changes. Record everything you install/modify so REMOVE is clean.
3. Do not weaken my existing security (no disabling firewalls, no broad `chmod -R`,
   no committing secrets, no installing unrelated global junk).
4. If a step needs my approval (sudo, rewriting global Cursor config), STOP and ask.
5. Work in phases. After Phase 0 grilling, WAIT for my answers before installing.
6. Final deliverable is a written report with a clear KEEP / REMOVE decision.

## Prompt patterns you must use

- Role + mission (above)
- Phased plan with exit criteria
- Explicit measurement plan before/after
- Rubric-based decision (numeric + qualitative)
- Grilling interview before install (Phase 0) — do not skip
- Adversarial testing (accuracy, performance, interference)
- Clean uninstall path if REMOVE

---

## Phase 0 — Grill me before touching my machine

Use a grilling interview style. Ask hard, specific questions. Do NOT install yet.
Ask these (adapt follow-ups based on my answers). Wait for my reply.

### A. Purpose & need
1. What exact workflows would you use Context Mode for in the next 30 days?
   (e.g. log analysis, repo greps, Playwright dumps, multi-file refactors)
2. What concrete pain are you solving? (context compaction? cost? lost state?)
3. How often does that pain hit — daily / weekly / rarely?
4. Which AI clients do you actually use here: Cursor / Claude Code / Codex /
   OpenCode / other? Which is primary?

### B. Fit & alternatives
5. What are you doing today instead? (bigger models, manual summaries, ignoring dumps)
6. Why is Context Mode better than “just be careful with tools” or smaller prompts?
7. If it only saved tokens but made answers slightly worse, would you still want it?

### C. Trade-offs I must force you to confront
8. Acceptable trade-offs: extra Node process? SQLite DBs under `~/.cursor/`?
   hooks intercepting Shell/Read? possible first-pass omissions if misused?
9. Unacceptable trade-offs: slower agent turns? broken MCP ecosystem? privacy
   worry about indexed content? interference with other projects?
10. Are you willing to change agent habits (prefer `ctx_execute` summaries over
    dumping raw Read/Bash output)? If not, hooks may fight you.
11. Keep threshold: what measured win would justify keeping it?
    (e.g. “≥50% less tool tokens on log tasks, zero broken workflows”)
12. Remove threshold: what failure would make you uninstall immediately?

### D. Environment constraints
13. Any machines/projects where agents must NOT install hooks globally?
14. Corporate policy / secrets constraints I should respect?
15. Should install be user-global (`~/.cursor`) or project-local only?

After I answer: summarize my goals, constraints, keep/remove thresholds in 5–8
bullets, then proceed.

---

## Phase 1 — Baseline (before install)

Capture a baseline snapshot. Save outputs under a folder like:
`~/context-mode-eval-YYYYMMDD/`

Record:
- OS, CPU/RAM, disk free
- `node -v`, `npm -v`, `bun -v` if present
- Existing Cursor MCP config paths and whether `context-mode` already exists
  (`~/.cursor/mcp.json`, project `.cursor/mcp.json`, hooks files)
- List currently configured MCP servers (names only)
- Idle resource sample: CPU%, memory used, number of node processes
- Optional: time one representative agent-style task WITHOUT context-mode
  (e.g. analyze a large log via normal Read/shell) and note rough context bulk

Write `00-baseline.md` with these facts.

---

## Phase 2 — Full end-to-end install (Cursor-first)

Install for my primary client from Phase 0. Default to Cursor if I said Cursor.

### 2a. Package
```bash
npm install -g context-mode
context-mode doctor
```
Record doctor PASS/FAIL/WARN lines verbatim.

### 2b. MCP registration
Add MCP server (prefer project-local if I asked; else user global):

`.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "context-mode": {
      "command": "context-mode"
    }
  }
}
```
If a file already exists, MERGE carefully — do not wipe other servers.
Diff before/after. Back up originals to the eval folder.

### 2c. Hooks + routing (full install)
Follow upstream Cursor instructions from the repo README:
- hooks.json (`preToolUse` / `postToolUse` / `stop` as documented)
- copy `context-mode.mdc` routing rules into `.cursor/rules/` if required
- Prefer `context-mode upgrade` when it safely fixes hooks

Restart Cursor / reload MCP as needed. Confirm MCP shows connected.

### 2d. Install ledger
Maintain `01-install-ledger.md`:
- packages installed
- files created/modified (absolute paths)
- backups created
- how to reverse each change

Exit criteria: `context-mode doctor` mostly green; MCP tools reachable
(`ctx_doctor` / `ctx stats` in agent, or MCP tool list).

---

## Phase 3 — Functional tests (does it work?)

Create a disposable fixture project under the eval folder with:
- a large access log (≥2k lines, known ERROR count)
- an `orders.json` with known revenue totals
- markdown docs with planted facts (SLA number, codeword, owner name)

Run at least these scenarios via real MCP tools (`ctx_execute`, `ctx_index`,
`ctx_search`, `ctx_batch_execute`, `ctx_stats`, `ctx_doctor`):

| ID | Scenario | Pass rule |
|----|----------|-----------|
| T1 | `ctx_doctor` | Server/FTS5/runtimes OK |
| T2 | JS `ctx_execute` ERROR count vs ground truth | Exact match |
| T3 | Same facts via Python and shell | Exact match |
| T4 | Orders revenue / paid count via sandbox | Exact match |
| T5 | Index docs + search planted facts | All mustContain hit; no invented codewords |
| T6 | Batch execute + queries for key numbers | Asked numbers present & correct |
| T7 | Summary-only pattern | Exact JSON metrics |
| T8 | Anti-pattern: dump-all + intent | Document whether first return drops markers |
| T9 | Recovery search after T8 | Critical facts recoverable? |
| T10 | `ctx_stats` after suite | Reports savings; numbers sane |

Save raw outputs to `02-functional/` and a table in `02-functional-summary.md`.

Also run any local harness if present:
`apps/context-mode-playground` → `bun install && bun run verify && bun run test:accuracy`
(only if that repo exists on this machine).

---

## Phase 4 — Impact / interference / harm tests

Goal: detect slowdowns or damage to other systems.

### 4a. Process & resource impact
While MCP idle and during a heavy `ctx_execute` on a big file, measure:
- extra `node`/MCP processes
- RSS/memory delta vs baseline
- CPU during a 30–60s sample
- disk usage of Context Mode storage dirs (`CONTEXT_MODE_DIR` / adapter defaults
  under `~/.cursor/context-mode` or similar)

### 4b. Interference with existing tooling
Check whether install broke or degraded:
- other MCP servers still listed/connected
- normal Shell / Read / Grep still work in a non-context-mode task
- hooks unexpectedly blocking common commands (note denials)
- git status in an unrelated repo still healthy
- time-to-first-tool-result for a simple agent prompt before vs after (best-effort)

### 4c. Safety / privacy footprint
List what gets persisted (session DBs, content index). Confirm no secrets from
unrelated projects were indexed unless a test explicitly did that.

### 4d. Uninstall dry-run readiness
From the ledger, produce exact REMOVE steps and estimate cleanup time.

Write `03-impact.md` with numbers and pass/fail interference checks.

---

## Phase 5 — Scorecard & decision

Score each dimension 0–5 (5 best). Show justification with data.

| Dimension | Question |
|-----------|----------|
| Installability | Clean full Cursor install? |
| Functional correctness | Ground-truth accuracy on T2–T7? |
| Token/context benefit | Measured reduction on log/order tasks? |
| Misuse risk | How bad is dump+intent pitfall; is it manageable? |
| System impact | CPU/RAM/disk/process overhead acceptable? |
| Interference | Other MCPs/workflows unharmed? |
| Reversibility | Easy REMOVE? |
| Fit to my Phase-0 goals | Matches what I said I’d use it for? |

Decision rules (override with my stated thresholds from Phase 0 if stricter):

- **KEEP** if: core functional tests pass, no serious interference, measurable
  context benefit on my workflows, and I accepted the trade-offs in Phase 0.
- **REMOVE** if: install unstable, accuracy regressions on summary-only path,
  hooks break normal work, material slowdown, or it doesn’t match my use case.
- **KEEP WITH GUARDRAILS** if useful but only under project-local install /
  summary-only rules / no global hooks.

Announce ONE decision: `KEEP` | `KEEP WITH GUARDRAILS` | `REMOVE`.

If REMOVE: execute uninstall only after I confirm (show the ledger first).
If KEEP: leave it installed and give “how to use it safely” rules.

---

## Phase 6 — Final report format (mandatory)

Write `04-FINAL-REPORT.md` (and paste the same structure in chat):

# Context Mode local evaluation — FINAL

## Decision
**KEEP | KEEP WITH GUARDRAILS | REMOVE** — one paragraph why.

## My stated goals (from grilling)
- …

## Facts & data points
- Versions installed
- Doctor highlights
- Functional table (T1–T10) with pass/fail + key numbers
- Token/context comparisons (without vs with) for at least one log task
- Resource deltas (CPU/RAM/disk/processes)
- Interference findings
- Files modified (paths)

## Trade-offs (including what I said vs what you measured)
- …

## Risks / pitfalls
- Especially dump-all + intent

## Exact next steps
- If KEEP: safe usage rules + verify command
- If REMOVE: exact uninstall commands from ledger

## Open questions (if any)
- …

Then stop.

---

## Start now

Begin with Phase 0 grilling only. Do not install until I answer.
````
