# AGENTS.md — tech-demos testing ground

This repo is a testing ground for the AI agent space. A pick may be a skill, a plugin, an app, a tool, an MCP server, or anything else that could improve the owner's AI capabilities and technical efficacy. Test the thing as itself. Never create a new GitHub repository per pick, and do not wrap a pick in an app unless the thing being tested is an app.

## Layout

- `playground/<kebab-slug>/` — one self-contained test per new pick. `PLAN.md` names the kind. The directory does not.
- `apps/<kebab-slug>/` — picks already started as applications. Leave them there. Do not put a skill, plugin, tool, or MCP server in `apps/`.
- `skills/project-planning/` — planning skill. Write `PLAN.md` in the pick's directory before building.
- `tracking/seen-bookmarks.json` — proposed / approved / skipped bookmark ids (do not re-propose)

## Rules for cloud agents

1. Only add or update files for the assigned pick (its directory and its `PLAN.md`). Do not modify other picks, and do not create a sibling repository.
2. Match the form to the thing. A skill stays a skill. A plugin stays a plugin. A tool stays a tool. An MCP server stays an MCP server. Build an app only when the pick is an app.
3. Use Bun when the test needs a JavaScript runtime. Do not add Vite, React, or a browser UI to satisfy this repo.
4. Model: **claude-sonnet-5 (Claude Sonnet 5)**. Do not use Fable 5 unless the owner explicitly asks. Fable launches fail empty on this repo.
5. Implement **every item** in the pick's `PLAN.md`.
6. Test it end to end. Choose metrics that fit that exact thing, run the test, and state whether it is good against those metrics. Put the evidence on **one PR**.
   - Skill or prompt: run the fixture cases. Report each metric as pass or fail.
   - Tool or CLI: run the commands on the fixture. Report the output against the metrics.
   - MCP server: connect and call the tools. Report each result.
   - Plugin: install it and run the scenario it claims.
   - App, or anything with a UI: exercise the real interface. Attach at least one screenshot and one video.
7. Keep the test single-user and finishable in one sitting.

## Cloudflare

Use the shared Pages project only when the pick is a web app that needs a preview. One project for the monorepo, not one per pick. Repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
