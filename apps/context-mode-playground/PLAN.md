# PLAN — context-mode-playground

## Goal
Ship a Bun + Vite playground that installs real `context-mode`, runs its MCP tools, and demos the 98% context-savings sandbox live.

## Source
- Tech: Context Mode — https://github.com/mksglu/context-mode
- npm: `context-mode@1.0.169`

## MVP scope (in)
- Local install of `context-mode` + Vite API bridge over MCP stdio
- Interactive before/after: raw log dump vs `ctx_execute` filtered stdout
- Live `ctx_stats` savings meter after each run
- `ctx_doctor` diagnostics panel
- Fixture index + `ctx_search` (BM25) on sample markdown
- README: `bun install && bun run dev`

## Out of scope
- Claude Code / Cursor plugin marketplace install
- Insight dashboard, hooks wiring into this agent session
- All 12 language runtimes in the UI (JS + shell is enough)

## Stack
- Bun + Vite + React + TypeScript + `context-mode` (MCP over stdio)
- Run: `cd apps/context-mode-playground && bun install && bun run dev`

## File sketch
- `package.json`, Vite plugin API (`server/`), `src/` UI, `fixtures/`, `README.md`, this `PLAN.md`

## Acceptance criteria
- [ ] `bun install && bun run dev` works
- [ ] Sandbox demo shows raw bytes vs sandboxed stdout from real MCP
- [ ] Doctor + stats + index/search work against live `context-mode`
- [ ] PR includes ≥1 screenshot and ≥1 video

## Validation
Screenshot + video of the running app in the PR. Not optional.
