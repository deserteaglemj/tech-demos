# PLAN — llm-wiki-playground

## Goal
Ship a tiny Bun app that turns a few markdown sources into a Karpathy-style LLM wiki: index, interlinked topic pages, link graph, and a question box (mock mode without an API key).

## Source
- Tech: LLM Wiki (Karpathy-style agent wiki)
- Bookmark: https://x.com/mem0ai/status/2079585032587694582

## MVP scope (in)
- Seed 3–5 short markdown documents (sample notes)
- Build/maintain an index + interlinked topic pages (deterministic local pipeline; optional LLM path gated behind env)
- Browse pages and a simple link graph visualization
- Ask-the-wiki panel that works in **mock mode** with no API key (canned or retrieval-only answers from local wiki text)
- README: `bun install && bun run dev`

## Out of scope
- Hosted multi-user auth / sync
- Full Mem0 / LangChain OpenWiki integration
- Production-grade RAG evaluation harness

## Stack
- Bun + Vite + React (or lightweight Bun server + HTML if simpler — prefer React)
- Local markdown in `content/` or `wiki/`
- Run: `cd apps/llm-wiki-playground && bun install && bun run dev`

## File sketch
- `package.json`, `tsconfig.json`, Vite config
- `src/` UI: library browser, page view, link graph, ask panel
- `content/` sample markdown seeds
- `README.md`, this `PLAN.md`

## Acceptance criteria
- [ ] `bun install && bun run dev` starts without errors
- [ ] Seed wiki loads with index + clickable interlinked pages
- [ ] Link graph renders relationships between topics
- [ ] Ask panel returns a useful mock answer from local wiki text without requiring an API key
- [ ] README documents run + optional real-LLM path if present
- [ ] PR includes ≥1 screenshot of the running UI
- [ ] PR includes ≥1 video of browsing + asking the wiki

## Validation
Capture screenshot + video from the running app and attach both to the PR. Not optional.
