# context-mode-playground

Demo of [Context Mode](https://github.com/mksglu/context-mode) **as an agent MCP**, not as a standalone product UI.

Context Mode’s job: keep huge tool dumps out of an AI agent’s conversation so the model spends context tokens on the answer, not on raw logs.

## What you see

One agent task (“find ERROR lines in a large access log”) runs two ways:

1. **Without** — agent `Read`s the whole file → tens of KB enter context  
2. **With** — agent calls real `ctx_execute` over MCP → only stdout enters context  

Side-by-side transcripts + context-window meters show the token difference.

## Run

```bash
cd apps/context-mode-playground
bun install
bun run dev
```

Open the local URL, then click **Run agent comparison**.

## Smoke (no UI)

```bash
bun run test:mcp
```

## Source

https://github.com/mksglu/context-mode
