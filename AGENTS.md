# AGENTS.md — tech-demos sticky monorepo

This is the single sticky monorepo for weekday X-bookmark tech demos. Never create a new GitHub repository per demo.

## Layout

- `apps/<kebab-slug>/` — one self-contained demo app per pick
- `skills/project-planning/` — vendored planning skill; write `apps/<slug>/PLAN.md` before building
- `tracking/seen-bookmarks.json` — proposed / approved / skipped bookmark ids (do not re-propose)

## Rules for cloud agents

1. Only add or update files under `apps/<kebab-slug>/` for the assigned pick (plus the matching `PLAN.md` there).
2. Do not modify other apps, root tooling beyond what that app needs, or create sibling repositories.
3. Stack default: **Bun**. App must run with `bun install && bun run dev` from `apps/<slug>/`.
4. Model: **claude-sonnet-5 (Claude Sonnet 5)**. Do not use Fable 5 unless the owner explicitly asks. Fable launches fail empty on this repo.
5. Implement **every item** in `apps/<slug>/PLAN.md`. Do not skip planned MVP parts.
6. Open **one PR**. Attach **both** at least one screenshot **and** at least one video of the running app in the PR body (validation artifacts). Not optional.
7. Keep the MVP single-user and demable in one sitting.

## Cloudflare previews

One Pages project for the whole monorepo (path per `apps/<slug>/`), not one project per app. Repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
