---
name: project-planning
description: Use before building any apps/<slug>/ demo — write PLAN.md with goal, MVP scope, stack, acceptance criteria, and validation (screenshot + video).
---

# Project planning (tech-demos)

Before implementing `apps/<kebab-slug>/`, write `apps/<kebab-slug>/PLAN.md` with:

1. **Goal** — one sentence
2. **Source** — bookmark URL / tech name
3. **MVP scope** — what ships in the first PR (and what is explicitly out)
4. **Stack** — Bun + primary library; how to run (`bun install && bun run dev`)
5. **File sketch** — key paths under `apps/<slug>/`
6. **Acceptance criteria** — checklist including Player/Studio or UI works locally
7. **Validation** — must capture ≥1 screenshot and ≥1 video of the **running** app for the PR
8. **Done when** — mirror the monorepo checklist from `AGENTS.md` (install/dev, MVP behavior, PR + artifacts, PLAN accuracy)

Keep plans short (under ~80 lines). Prefer one vertical slice over polish.

## Hard constraints (copy into every plan's out-of-scope / notes)

- Model for the build agent: **Claude Sonnet 5** only. Do not plan or request Fable 5.
- No Cloudflare setup unless the owner explicitly asks.
- No root monorepo scaffolding changes beyond what `apps/<slug>/` needs.
- Validation artifacts must come from the live Studio/Player/UI, not placeholders.
