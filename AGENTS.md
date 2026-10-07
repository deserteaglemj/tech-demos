# AGENTS.md — tech-demos sticky monorepo

This is the single sticky monorepo for weekday X-bookmark tech demos. Never create a new GitHub repository per demo.

## Layout

- `apps/<kebab-slug>/` — one self-contained demo per pick
- `skills/project-planning/` — vendored planning skill; write `apps/<slug>/PLAN.md` before building
- `tracking/seen-bookmarks.json` — proposed / approved / skipped bookmark ids (do not re-propose)

## What a demo is

Demos prove the pick **the way the owner would use it** — not a marketing clone or a playground that merely *looks like* the tech.

| Pick kind | How to demo |
|---|---|
| **Agent skill / CLI / GitHub tool** (e.g. Claude Code skill, Codex plugin, `npx …` package meant for agents) | Install it for real. Drive it with an AI agent (this Cursor agent or a subagent) using a **real prompt**. Ship the prompt, the invocation notes, and the **actual output** the tool produced. |
| **Library / UI kit / runtime** meant to be embedded in an app | Build a thin Bun app that exercises the library’s real API — still one vertical slice, not a site clone. |

If the pick is a GitHub repo whose README says “install this skill/plugin and ask your agent…”, treat it as the first row. **Do not** rebuild their gallery, landing page, or component catalog as the demo.

## Rules for cloud agents

1. Only add or update files under `apps/<kebab-slug>/` for the assigned pick (plus the matching `PLAN.md` there). Exception: when the owner asks to change monorepo directions, update `AGENTS.md`, `README.md`, and `skills/project-planning/` as needed.
2. Do not modify other apps, or create sibling repositories.
3. Stack default for **app** demos: **Bun**. Those must run with `bun install && bun run dev` from `apps/<slug>/`.
4. For **tool-usage** demos: install the tool as documented; record the exact prompt; keep the generated artifact(s) under `apps/<slug>/`. A tiny static viewer (`bun run dev`) that opens the output is fine; a reimplementation of the tool is not.
5. Model: **claude-sonnet-5 (Claude Sonnet 5)**. Do not use Fable 5 unless the owner explicitly asks. Fable launches fail empty on this repo.
6. Write `PLAN.md` first. Implement **every item** in it. Do not skip planned MVP parts.
7. Open **one PR**. Attach **both** at least one screenshot **and** at least one video of the real demo (agent/tool run and/or resulting artifact on screen). Not optional.
8. Keep the MVP single-user and demable in one sitting.

### Tool-usage demo checklist (skills / agent tools / CLIs)

- [ ] Installed from the real upstream (marketplace, `npx skills add`, git clone of the skill path — whatever their README says)
- [ ] Used via an AI agent with a concrete, realistic prompt (paste the prompt in `PROMPT.md`)
- [ ] Committed the real output the tool/agent produced (e.g. HTML/SVG/diagram/file), not a hand-faked stand-in unless the tool failed (then document the failure)
- [ ] README explains how to re-run the same usage path
- [ ] PR validation shows the prompt → output path (screenshot + video)

## Cloudflare previews

One Pages project for the whole monorepo (path per `apps/<slug>/`), not one project per app. Repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
