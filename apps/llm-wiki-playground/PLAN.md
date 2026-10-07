# PLAN — llm-wiki-playground

## Goal
Ship a tiny Bun app that shows a Karpathy-style LLM wiki working on a fake computer: a raw folder is compiled into interlinked wiki pages, and an agent answers by searching that wiki (concept index, no API key) instead of grepping the files.

## Source
- Tech: LLM Wiki (Karpathy-style agent wiki)
- Bookmark: https://x.com/mem0ai/status/2079585032587694582

## MVP scope (in)
- A fake computer (`folio`) with `~/sources`, `~/wiki`, and an agent window
- 7 raw notes and 5 compiled wiki pages, cross-linked, each page citing the files it was filed from
- Replay the filing so the directory organization is visible
- Agent search that shows literal grep misses beside concept-index hits (no API key)
- Link graph of the compiled pages
- README: `bun install && bun run dev`, plus `./install.sh` and a static PWA (`bun run build && bun run preview`)

## Out of scope
- Hosted multi-user auth / sync
- Full Mem0 / LangChain OpenWiki integration
- Production-grade RAG evaluation harness

## Stack
- Bun + Vite + React
- Local markdown in `content/sources/` and `content/wiki/` (front matter + `[[slug]]` wiki-links)
- No heavy extra deps for routing/graph: a ~15-line hash router
  (`src/lib/useHashRoute.ts`) and a hand-rolled force-directed layout
  (`src/lib/graph-layout.ts`) instead of react-router / d3
- Run: `cd apps/llm-wiki-playground && bun install && bun run dev`

## File sketch
- `package.json`, `tsconfig.json`, `vite.config.ts`
- `src/lib/` — wiki parsing/index (`wiki.ts`), link rendering (`markdown.ts`),
  mock retrieval (`retrieval.ts`), optional real-LLM call (`llm.ts`),
  routing (`route.ts`, `useHashRoute.ts`), graph layout (`graph-layout.ts`)
- `src/components/` — `SourcesPane`, `WikiPane`, `AgentPane`, `LinkGraph`
- `content/sources/` — raw notes; `content/wiki/` — compiled pages with concepts
- `README.md`, this `PLAN.md`

## Acceptance criteria (shipped)
- [x] `bun install && bun run dev` starts without errors
- [x] Seed wiki loads with index + clickable interlinked pages
- [x] Link graph renders relationships between topics (hover-highlight + click-to-open)
- [x] Agent answers from the compiled wiki without an API key, and shows when grep of the raw folder misses (“churn”)
- [x] README documents run + optional real-LLM path (gated behind `VITE_OPENAI_API_KEY`, off by default)
- [x] Installable without an API key: `./install.sh`, `bun run dev`, and a preview PWA that works offline after the first load
- [x] `bun test` covers mock retrieval
- [x] Repo root has a public README, MIT license, and SECURITY.md
- [x] PR includes ≥1 screenshot of the running UI
- [x] PR includes ≥1 video of browsing + asking the wiki

## Validation
Capture screenshot + video from the running app and attach both to the PR. Not optional.
