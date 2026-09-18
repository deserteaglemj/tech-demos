# LLM Wiki Playground

A tiny Karpathy-style wiki of interlinked notes on how large language models
work — index page, clickable interlinked topic pages, a link-graph browser,
and an "Ask the wiki" panel that answers questions **without any API key**
by retrieving from the local wiki text.

## Run it

```bash
cd apps/llm-wiki-playground
bun install
bun run dev
```

Open the printed local URL (defaults to `http://localhost:5173/`).

Other scripts: `bun run build` (production build to `dist/`), `bun run preview`
(preview the production build).

## What's here

- **Seed content** — 5 short markdown docs in `content/` (Transformer
  Architecture, Attention Mechanism, Tokenization, Context Window, RLHF),
  each with YAML-ish front matter (`title`, `summary`) and body text that
  cross-references other docs with `[[slug]]` wiki-link syntax.
- **Index + interlinked pages** — the app parses every markdown file at
  build/dev time (`src/lib/wiki.ts`), resolves `[[slug]]` links into real
  in-app links with the target page's title (`src/lib/markdown.ts`), and
  tracks backlinks so every topic page shows both "Links to" and
  "Linked from" panels.
- **Link graph** — `src/components/LinkGraph.tsx` renders the topic graph as
  an SVG with a small hand-rolled force-directed layout
  (`src/lib/graph-layout.ts`, no extra graph-layout dependency). Hover a
  node to highlight its neighbors, click to open that page.
- **Ask the wiki (mock mode, default, no API key)** — `src/lib/retrieval.ts`
  does simple keyword-overlap scoring against the seeded pages, pulls the
  most relevant sentences out of the best-matching page(s), and formats them
  as a grounded, cited answer (`src/lib/retrieval.ts#formatMockAnswer`).
  This is genuinely local retrieval over the wiki text, not a canned string
  — try asking about topics that aren't in the wiki and you'll get an
  honest "I couldn't find that" response with suggested topics instead.
- **Optional real-LLM path (gated by env, off by default)** — see below.

## Optional real-LLM path

By default there is **no LLM call and no network request** when you ask a
question — everything in "Mock mode" is computed client-side from the
markdown in `content/`.

If you want the Ask panel to instead call a real model, copy `.env.example`
to `.env` and set `VITE_OPENAI_API_KEY` (plus optionally
`VITE_OPENAI_MODEL` / `VITE_OPENAI_BASE_URL` for OpenAI-compatible
alternatives):

```bash
cp .env.example .env
# edit .env and set VITE_OPENAI_API_KEY=sk-...
bun run dev
```

When a key is present, the panel switches its badge to "LLM mode" and
`src/lib/llm.ts` sends the same retrieved wiki context plus your question to
the Chat Completions API, asking it to answer using only that context.

**Security note:** this calls the API directly from the browser, so the key
ends up in client-side network requests. That's fine for a local `bun run
dev` demo on your own machine, but this pattern is **not safe to deploy** —
a real deployment would need a small server-side proxy to keep the key off
the client. Mock mode has no such caveat, which is why it's the default.

## File layout

```
content/            seed markdown docs (front matter + [[wiki-links]] body)
src/
  lib/
    frontmatter.ts   minimal front-matter parser
    wiki.ts          loads content/*.md, builds pages/links/backlinks index
    markdown.ts      rewrites [[slug]] -> real in-app links for rendering
    retrieval.ts      mock/local keyword retrieval + grounded answer formatting
    llm.ts           optional real-LLM call, gated by VITE_OPENAI_API_KEY
    graph-layout.ts  tiny force-directed layout for the link graph (no d3)
    route.ts / useHashRoute.ts   minimal hash-based router (no react-router)
  components/
    Sidebar.tsx, IndexPage.tsx, TopicPage.tsx, LinkGraph.tsx, AskPanel.tsx
  App.tsx, main.tsx, styles.css
```

## Notes / out of scope

- Single-user, no auth, no persistence beyond the seed markdown files.
- No production RAG pipeline or evaluation harness — the retrieval is
  intentionally simple keyword scoring, good enough to ground a demo
  answer with a real citation.
- The link graph layout is a lightweight custom force simulation, tuned for
  a handful of nodes; it is not meant to scale to a large wiki.
