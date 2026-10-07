# tech-demos

A sticky monorepo of small public tech demos: every demo lands here, in its own folder under `apps/`, rather than in a separate repository. The installable app today is the [LLM Wiki Playground](apps/llm-wiki-playground/), a Karpathy-style local wiki of interlinked notes on how large language models work.

**This repository is public.** No account, API key, or cloud setup is required to run the wiki.

## Run the wiki

Prerequisite: [Bun](https://bun.sh).

```bash
git clone https://github.com/deserteaglemj/tech-demos.git
cd tech-demos/apps/llm-wiki-playground
bun install
bun run dev
```

Open the local URL it prints (normally http://localhost:5173).

No Bun yet? On macOS or Linux, run `./install.sh` from `apps/llm-wiki-playground` instead of the two `bun` commands. It installs Bun if needed, installs dependencies, and starts the dev server.

## Static build and installable app

From the repo root:

```bash
cd apps/llm-wiki-playground
bun install
bun run build
bun run preview
```

`bun run build` writes a static site to `dist/`, and `bun run preview` serves it at http://127.0.0.1:4173. Open that URL and use your browser's install prompt (for example, the Install icon in Chrome's address bar) to add the wiki as an app (PWA). It works offline after the first load and still needs no API key.

## What the wiki does

- **5 seeded topics:** short markdown notes on transformers, attention, tokenization, context windows, and RLHF.
- **Interlinked pages:** `[[wiki-links]]` between notes become real links, and each page lists the pages that link back to it.
- **Link graph:** a clickable map of how the topics connect.
- **Ask the wiki (mock mode):** answers come from local keyword retrieval over the wiki text, with the source pages cited. No API key and no network requests.

A real LLM is used only if you set `VITE_OPENAI_API_KEY` in a local `.env` file. It is off by default. Read the [app README](apps/llm-wiki-playground/README.md) and [SECURITY.md](SECURITY.md) before turning it on.

## Other apps

Every other folder under `apps/` holds only a `PLAN.md` for a future demo. They are plans, not runnable apps yet.

## License

[MIT](LICENSE). For security notes and how to report a problem, see [SECURITY.md](SECURITY.md).
