# PLAN — context-mode-playground

## Goal
Prove [context-mode](https://github.com/mksglu/context-mode) works as an **agent MCP** (fewer context tokens), via real install + tool tests — not as a fake product UI.

## Source
https://github.com/mksglu/context-mode · npm `context-mode@1.0.169`

## MVP scope (in)
- Install real package; MCP stdio client
- `bun run verify` — doctor, execute, index, search, batch, stats with PASS/FAIL
- `VERIFICATION.md` with verdict + local Cursor install steps
- Optional small viewer: same agent task with/without sandbox to visualize token delta
- README: `bun install && bun run verify` (and `bun run dev` for the viewer)

## Out of scope
- Marketing site for Context Mode
- Auto-wiring this cloud agent’s Cursor hooks

## Stack
Bun + TypeScript + `context-mode` MCP; thin Vite viewer optional.

## Acceptance criteria
- [ ] `bun run verify` exits 0 with all core checks PASS
- [ ] VERIFICATION.md states clear WORKS / how to install locally
- [ ] PR includes screenshot and/or video of verification evidence

## Validation
Artifact evidence from real MCP runs. Not optional.
