# folio — LLM wiki

A fake computer that shows a Karpathy-style LLM wiki **working**, not an
encyclopedia about models. `~/sources` is a messy folder of calls, memos,
and clippings. An agent has filed them into `~/wiki`. When you ask a
question, you see a literal grep of the raw files next to a search of the
wiki’s concept index. No API key.

## Install

The default local mock mode needs no API key.

### One-shot launcher

```bash
cd apps/llm-wiki-playground
./install.sh
```

The script installs Bun when needed, installs dependencies, and starts the
app at `http://127.0.0.1:5173/`.

### Bun development server

```bash
cd apps/llm-wiki-playground
bun install
bun run dev
```

### Install as a Chrome app

Build and preview the portable static production bundle:

```bash
cd apps/llm-wiki-playground
bun run build
bun run preview
```

Open `http://127.0.0.1:4173/` in Chrome, then use the browser's **Install**
action (from the address bar or menu) to install LLM Wiki Playground. PWA
installation works on localhost (or an HTTPS static host).

Run tests with:

```bash
bun test
```

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

- **Raw directory** — `content/sources/` is the machine’s `~/sources`: a
  renewal call, a board draft, a pricing scratch, a hiring debrief, an
  outage ledger, and a competitor clipping. None of them contain the word
  “churn”.
- **Compiled wiki** — `content/wiki/` is what the agent maintains. Pages
  cross-link with `[[slug]]`, list the files they were compiled from, and
  carry a concept the raw notes never name (`churn`, `pricing`, `hiring`…).
  **Replay filing** walks those filings one file at a time.
- **Agent** — `src/lib/retrieval.ts` greps `~/sources` literally, then scores
  wiki pages through `src/lib/lexicon.ts`. “Who is about to churn?” shows
  zero grep hits and a Northwind page whose evidence is the phrase
  “shopping the renewal”.
- **Link graph** — arrows are the links the agent wrote between compiled pages.
- **Optional real-LLM path (gated by env, off by default)** — see below. The
  local concept index stays on either way.

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
content/sources/     raw files shown as ~/sources
content/wiki/        compiled pages shown as ~/wiki
src/lib/             wiki index, concept lexicon, grep + concept search
src/components/      SourcesPane, WikiPane, AgentPane, LinkGraph, MarkdownView
  App.tsx, main.tsx, styles.css
```

## Notes / out of scope

- Single-user, no auth, no persistence beyond the seed markdown files.
- No production RAG pipeline or evaluation harness — the retrieval is
  intentionally simple keyword scoring, good enough to ground a demo
  answer with a real citation.
- The link graph layout is a lightweight custom force simulation, tuned for
  a handful of nodes; it is not meant to scale to a large wiki.
