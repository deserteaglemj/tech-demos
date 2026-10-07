# PLAN — context-mode-playground

## Goal
Demo Context Mode the way it is meant to be used: an AI agent completing the same task with far fewer context tokens when tool output is sandboxed via MCP.

## Source
- Tech: Context Mode — https://github.com/mksglu/context-mode
- npm: `context-mode@1.0.169`

## MVP scope (in)
- Real `context-mode` MCP over stdio
- One agent task: analyze a large access log for ERROR lines
- Side-by-side agent sessions:
  - **Without:** `Read` dumps the whole file into context
  - **With:** `ctx_execute` keeps raw bytes in the sandbox; only stdout enters context
- Live token estimate + context-window fill for each session
- README: `bun install && bun run dev`

## Out of scope
- Product marketing UI for Context Mode itself
- Cursor/Claude Code plugin marketplace install
- Full multi-turn coding agent

## Stack
- Bun + Vite + React + TypeScript + `context-mode` MCP
- Run: `cd apps/context-mode-playground && bun install && bun run dev`

## File sketch
- `server/` MCP client + agent-run API
- `src/` dual agent transcripts + context meters
- `fixtures/access.log`, `README.md`, this `PLAN.md`

## Acceptance criteria
- [ ] `bun install && bun run dev` works
- [ ] Same task, two agent paths; with-path uses real `ctx_execute`
- [ ] Token/context meter clearly shows the with-path is much smaller
- [ ] PR includes ≥1 screenshot and ≥1 video

## Validation
Screenshot + video of the agent token comparison. Not optional.
