# Verification — context-mode@1.0.169

**Verdict: WORKS for its intended use (MCP sandbox tools for AI agents).**

Tested 2026-10-07 on Linux (Node 22.14 + Bun 1.4.2) against a fresh `npm install context-mode@1.0.169`.

## What Context Mode is

An **MCP server** you attach to an AI coding agent (Cursor, Claude Code, etc.). Agents call tools like `ctx_execute` so raw logs/files stay in a sandbox and **only stdout enters the conversation** — fewer context tokens.

It is not a web app.

## Checks run

| Check | Result | Evidence |
|---|---|---|
| `npm install context-mode@1.0.169` | PASS | Clean install |
| MCP `initialize` | PASS | `context-mode@1.0.169` |
| `tools/list` | PASS | 11 tools registered |
| `ctx_doctor` | PASS | Runtimes OK, FTS5 PASS, server PASS |
| `ctx_execute` JS on 167 KB / 2000-line log | PASS | ~41.8k tok raw → ~253 tok sandbox (**99.4% less**) |
| `ctx_execute` Python | PASS | Printed `2000` line count |
| `ctx_execute` Shell | PASS | `grep -c ERROR` → `28` |
| `ctx_index` | PASS | Indexed markdown sections |
| `ctx_search` (BM25) | PASS | Hit “payment gateway timeout” / “exponential backoff” |
| `ctx_batch_execute` | PASS | Batch `wc` + `grep` + queries returned answers |
| `ctx_stats` | PASS | Reported **98.5% reduction** / 163 KB kept out on the log task |
| CLI `context-mode index/search/doctor` | PASS | Works (search needs matching `--project`) |

Re-run locally from this folder:

```bash
bun install
bun run verify
```

## Doctor notes (this cloud VM)

- **PASS:** storage, FTS5/SQLite, MCP server init, npm package v1.0.169, Bun JS/TS
- **FAIL/WARN (environment only):** no Cursor `hooks.json` / `mcp.json` in this VM — expected. On your machine you wire those once so the agent auto-uses context-mode.

Core MCP tools do **not** depend on hooks. Hooks only enforce routing so the model prefers sandbox tools.

## Accuracy (do key facts stay correct?)

Run the intense suite:

```bash
bun run test:accuracy
```

Open `accuracy-out/accuracy-report.html` (also served at `/accuracy-report.html` during `bun run dev`).

**Findings (latest run):**
- Exact extracts, aggregates, Python/shell parity, FinOps totals, BM25 fact retrieval: **PASS**
- Recommended pattern (print summary only): **PASS / exact**
- Anti-pattern (dump entire log + `intent` filter): first return can **omit** critical markers — a real misuse pitfall
- Follow-up `ctx_search` after that dump: **recovered** the facts in our run

**Bottom line:** No accuracy downside when you use it as designed (sandbox computes, stdout is the answer). Dumping huge stdout and hoping intent-filter keeps every marker is the risky path.

## Should you install it locally?

**Yes, if** you use Cursor / Claude Code / similar and want fewer tokens burned on tool dumps.

### Cursor (manual MCP)

```bash
npm install -g context-mode
```

Add to `~/.cursor/mcp.json` (or project `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "context-mode": {
      "command": "context-mode"
    }
  }
}
```

Optional but recommended: copy hooks + routing rules from the [upstream README Cursor section](https://github.com/mksglu/context-mode#cursor).

Verify in a chat: ask the agent `ctx stats` or run `context-mode doctor`.

## Source

https://github.com/mksglu/context-mode
