# context-mode verification

Proves [Context Mode](https://github.com/mksglu/context-mode) works as an **MCP for AI agents** (sandbox tool output → fewer context tokens).

See **[VERIFICATION.md](./VERIFICATION.md)** for the full report.

## Verify install works

```bash
cd apps/context-mode-playground
bun install
bun run verify
```

## Accuracy tests (key facts survive?)

```bash
bun run test:accuracy
```

Generates `accuracy-out/accuracy-report.html` — walkthrough of intense with/without ground-truth checks (logs, orders FinOps, search, batch, intent-filter pitfall).

Open the HTML:

```bash
bun run dev
# then visit /accuracy-report.html
```

## Optional token viewer

```bash
bun run dev
```

Side-by-side agent comparison (Read dump vs real `ctx_execute`).

## Install on your machine (Cursor)

```bash
npm install -g context-mode
```

Then register the MCP server (see VERIFICATION.md).
