# context-mode verification

Proves [Context Mode](https://github.com/mksglu/context-mode) works as an **MCP for AI agents** (sandbox tool output → fewer context tokens).

See **[VERIFICATION.md](./VERIFICATION.md)** for the full report.

## Verify (primary)

```bash
cd apps/context-mode-playground
bun install
bun run verify
```

Expect all checks `PASS` and a `verify-results.json` summary.

## Optional viewer

```bash
bun run dev
```

Opens a side-by-side agent comparison (Read dump vs real `ctx_execute`) so you can see the token difference visually.

## Install on your machine (Cursor)

```bash
npm install -g context-mode
```

Then register the MCP server (see VERIFICATION.md).
