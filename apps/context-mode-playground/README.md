# context-mode-playground

Interactive demo of [Context Mode](https://github.com/mksglu/context-mode) — an MCP server that sandboxes tool output so only stdout enters the agent context window.

This playground installs the real `context-mode` package, bridges its MCP tools over stdio, and shows a live before/after comparison on a fixture access log.

## Run

```bash
cd apps/context-mode-playground
bun install
bun run dev
```

Open the printed local URL (default `http://localhost:5173`).

## Try

1. **Run comparison** — dumps the raw log size vs `ctx_execute` filtered stdout and shows `ctx_stats`.
2. **Run doctor** — live `ctx_doctor` diagnostics (runtimes, FTS5, version).
3. **Index fixtures** then **Search** — FTS5/BM25 over `fixtures/docs`.

## Smoke test (no UI)

```bash
bun run test:mcp
```

## Source

https://github.com/mksglu/context-mode
