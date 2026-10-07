# AGENTS.md — tech-demos sticky monorepo

This is the single sticky monorepo for weekday X-bookmark tech demos. Never create a new GitHub repository per demo.

## Layout

- `apps/<kebab-slug>/` — one self-contained demo app per pick
- `skills/project-planning/` — vendored planning skill; write `apps/<slug>/PLAN.md` before building
- `tracking/seen-bookmarks.json` — proposed / approved / skipped bookmark ids (do not re-propose)

## Rules for cloud agents

1. Only add or update files under `apps/<kebab-slug>/` for the assigned pick (plus the matching `PLAN.md` there). Exception: process/docs fixes may touch `AGENTS.md`, `README.md`, and `skills/` when the task is about monorepo agent guidance.
2. Do not modify other apps, root tooling beyond what that app needs, or create sibling repositories.
3. Stack default: **Bun**. App must run with `bun install && bun run dev` from `apps/<slug>/`.
4. Model: **Cursor Auto** only (default / Auto). Do not pin or request a named model — especially not **Fable 5** / `claude-fable-5`, and not Sonnet either. Fable launches fail empty here, and unacknowledged Fable data-retention policy prompts abort the run. If this run is on Fable or hits a Fable retention error: stop immediately and tell the owner to relaunch with **Cursor Auto** — do not retry on Fable.
5. Implement **every item** in `apps/<slug>/PLAN.md`. Do not skip planned MVP parts. Keep `PLAN.md` acceptance checkboxes accurate for what shipped.
6. Open **one PR**. Attach **both** at least one screenshot **and** at least one video of the **actual running** Studio/Player/UI in the PR body (validation artifacts). Capture from the live app — not mocks, not code screenshots. Not optional.
7. Keep the MVP single-user and demable in one sitting.
8. **Do not set up Cloudflare** (Pages, Workers, wrangler, project creation) unless the owner explicitly asks. Local `bun run dev` is enough for the MVP PR.
9. **Do not change root monorepo scaffolding** (package managers at repo root, shared CI, new top-level apps tooling) beyond what the assigned `apps/<slug>/` needs.

## Done when (every demo PR)

- [ ] `bun install && bun run dev` works from `apps/<slug>/`
- [ ] Planned MVP behavior works (composition/UI plays with prop-driven or interactive behavior as in `PLAN.md`)
- [ ] One PR is open with **both** a screenshot and a video of the running app attached
- [ ] `PLAN.md` still matches what shipped (checkboxes updated)

## Cloudflare previews

One Pages project for the whole monorepo (path per `apps/<slug>/`), not one project per app — and only when the owner asks for preview deploy. Repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
