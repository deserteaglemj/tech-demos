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
- Bun + Vite + React
- Local markdown in `content/` (5 docs, front matter + `[[slug]]` wiki-links)
- No heavy extra deps for routing/graph: a ~15-line hash router
  (`src/lib/useHashRoute.ts`) and a hand-rolled force-directed layout
  (`src/lib/graph-layout.ts`) instead of react-router / d3
- Run: `cd apps/llm-wiki-playground && bun install && bun run dev`

## File sketch
- `package.json`, `tsconfig.json`, `vite.config.ts`
- `src/lib/` — wiki parsing/index (`wiki.ts`), link rendering (`markdown.ts`),
  mock retrieval (`retrieval.ts`), optional real-LLM call (`llm.ts`),
  routing (`route.ts`, `useHashRoute.ts`), graph layout (`graph-layout.ts`)
- `src/components/` — `Sidebar`, `IndexPage`, `TopicPage`, `LinkGraph`, `AskPanel`
- `content/` — 5 seed markdown docs (transformers, attention, tokenization,
  context-window, rlhf), cross-linked with `[[slug]]` syntax
- `README.md`, this `PLAN.md`

## Acceptance criteria (shipped)
- [x] `bun install && bun run dev` starts without errors
- [x] Seed wiki loads with index + clickable interlinked pages
- [x] Link graph renders relationships between topics (hover-highlight + click-to-open)
- [x] Ask panel returns a useful mock answer from local wiki text without requiring an API key (keyword-retrieval + cited excerpt, not a hardcoded string)
- [x] README documents run + optional real-LLM path (gated behind `VITE_OPENAI_API_KEY`, off by default)
- [x] PR includes ≥1 screenshot of the running UI
- [x] PR includes ≥1 video of browsing + asking the wiki

## Validation
Capture screenshot + video from the running app and attach both to the PR. Not optional.
