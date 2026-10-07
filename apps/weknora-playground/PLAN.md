# PLAN — weknora-playground

## Goal
Ship a Bun playground that demos WeKnora’s three modes (RAG Quick Q&A, ReAct Agent, Wiki) against a seeded knowledge base, with optional notes for running upstream Tencent/WeKnora via Docker.

## Source
- Tech: WeKnora (Tencent open-source LLM knowledge platform)
- URL: https://github.com/Tencent/WeKnora

## MVP scope (in)
- Seed knowledge base: 4–6 short documents (product notes / FAQ / architecture)
- **RAG mode**: ask questions; mock retrieval + cited answers (no API key)
- **Agent mode**: multi-step mock tool trace (search → read → answer)
- **Wiki mode**: distilled interlinked topic pages + simple knowledge graph
- Knowledge library browser (folders + document preview)
- README: `bun install && bun run dev`
- INSTALL.md: how we ran upstream WeKnora with Docker Compose for validation video

## Out of scope
- Full Docker stack vendored into the monorepo
- Real LLM / embedding API calls (optional env path only if trivial)
- Multi-tenant RBAC, MCP, sandboxes, IM channels

## Stack
- Bun + Vite + React + TypeScript
- Local seed data in `content/`
- Run: `cd apps/weknora-playground && bun install && bun run dev`

## File sketch
- `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`
- `src/` UI: shell, KB browser, RAG chat, agent trace, wiki + graph
- `src/data/` seed documents + wiki graph JSON
- `README.md`, `INSTALL.md`, this `PLAN.md`

## Acceptance criteria
- [ ] `bun install && bun run dev` starts without errors
- [ ] Seed KB loads; documents open in the library
- [ ] RAG mode returns a cited mock answer from local text
- [ ] Agent mode shows a multi-step tool trace then an answer
- [ ] Wiki mode lists interlinked pages and a graph
- [ ] README documents run instructions
- [ ] Upstream WeKnora Docker install attempted; INSTALL.md records result
- [ ] PR includes ≥1 screenshot of the running UI
- [ ] PR includes ≥1 video of RAG + Agent + Wiki flows

## Validation
Capture screenshot + video from the running app (and upstream WeKnora UI if available) and attach both to the PR. Not optional.
