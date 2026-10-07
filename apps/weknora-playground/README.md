# WeKnora Playground

Bun + Vite demo of [Tencent/WeKnora](https://github.com/Tencent/WeKnora)’s three modes — **Library**, **RAG Quick Q&A**, **ReAct Agent**, and **Wiki + graph** — over a seeded local knowledge base (mock retrieval, no API key).

## Run

```bash
cd apps/weknora-playground
bun install
bun run dev
```

Open http://127.0.0.1:5173

Measured RAG results (real WeKnora v0.8.2, not the mock UI): [public/rag-brief.html](public/rag-brief.html), also at http://127.0.0.1:5173/rag-brief.html while `bun run dev` is running.

## Upstream install

See [INSTALL.md](./INSTALL.md) for how this environment ran the real WeKnora Docker Compose stack (v0.8.2) for validation.
