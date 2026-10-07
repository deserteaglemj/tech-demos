# tech-demos

A public cloud bench for testing tools before local installation. Its job is to judge efficacy and give a short verdict: **worth installing**, **worth installing with limits**, or **skip**. Keep the monorepo; do not create a new GitHub repository per test.

## Evaluate a pick

1. Define the claimed benefit and a small set of observable checks. Use `playground/<slug>/` for the assigned test.
2. Test the thing as itself. A normal library or product gets a tiny playground only when running it is necessary to judge it. A full product clone is not the default.
3. If the input is an agent skill from GitHub, vendor or install it in gitignored cloud scratch, run 3 to 5 realistic tasks, and record pass and fail. Do not build an app. Remove the owned scratch copy when the verdict is skip.
4. Write `TEST_REPORT.md`: input and revision, expected benefit, test method, results, failures, limits and one of the three verdicts. Recommend whether to install locally.

A `PLAN.md`, Bun app, Cloudflare preview, screenshot, video or PR is optional. The written test report is required. Existing `apps/` folders stay in place. Add a new app only when a throwaway UI is necessary for evaluation, and label it **temporary**.

This repository is public. Use synthetic fixtures; keep customer records, exports, credentials and private internal data out of every test and evidence artifact. See [AGENTS.md](AGENTS.md) for the complete evaluation rules.

## Existing wiki demo

The app already in the repo is [folio](apps/llm-wiki-playground/), a fake computer that shows an LLM wiki working: a raw folder is compiled into linked pages, and an agent answers by searching that wiki instead of grepping the files.

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

- **A raw directory:** meeting notes, memos, and clippings on a fake machine at `~/sources`.
- **A compiled wiki:** the agent files those notes into linked pages (`~/wiki`) and keeps a concept index (for example, “shopping the renewal” is filed as churn).
- **Agent search:** a question shows a literal grep of the folder beside the wiki hits. “Who is about to churn?” misses every raw file and still opens the Northwind page.
- **No API key:** the concept index is local. A real model is used only if you set `VITE_OPENAI_API_KEY`.

A real LLM is used only if you set `VITE_OPENAI_API_KEY` in a local `.env` file. It is off by default. Read the [app README](apps/llm-wiki-playground/README.md) and [SECURITY.md](SECURITY.md) before turning it on.

## Other apps

Every other folder under `apps/` holds only a `PLAN.md` for a future demo. They are plans, not runnable apps yet.

## License

[MIT](LICENSE). For security notes and how to report a problem, see [SECURITY.md](SECURITY.md).
