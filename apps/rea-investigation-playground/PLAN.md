# PLAN — rea-investigation-playground

## Goal
Ship a Bun + Vite playground that demos REA’s Decompile → Understand → Recreate investigation loop on a local JavaScript app fixture, using real `analyze_javascript_application` Evidence.

## Source
- Tech: REA — Reverse Engineer Anything (https://github.com/morluto/rea)
- Package: `rea-agents` on npm

## MVP scope (in)
- Guided investigation UI for Inkdesk offline search (fixture under `fixture/`)
- Show real Evidence envelope fields: evidence_id, provider, modules, edges, limitations
- Module graph + source inspection steps
- Recreate panel: ported TypeScript offline-search feature with live query demo
- **REA web walkthrough:** inspect Resend.com via CDP (`list_browser_targets`, `inspect_web_page`, `analyze_web_bundle`), recover paired preview switches, apply adapted Desktop/Mobile + Light/Dark board preview to an **M Studios** page
- README: `bun install && bun run dev`

## Out of scope
- Hopper / Ghidra / IDA native providers
- Live MCP server wiring
- Full REA CLI packaging inside the demo

## Stack
- Bun + Vite + React + TypeScript
- Precomputed Evidence from `rea analyze-javascript-application` on the fixture
- Run: `cd apps/rea-investigation-playground && bun install && bun run dev`

## File sketch
- `PLAN.md`, `README.md`, `package.json`, Vite/TS config
- `fixture/` — Inkdesk JS app under investigation
- `src/evidence.json` — compact real Evidence summary
- `src/` — investigation UI, graph, recreate demo

## Acceptance criteria
- [ ] `bun install && bun run dev` works
- [ ] User can step Decompile → Understand → Recreate with Evidence visible
- [ ] Recreated offline search runs live in the browser
- [ ] PR includes ≥1 screenshot and ≥1 video

## Validation
Screenshot + video of the running app in the PR. Not optional.
