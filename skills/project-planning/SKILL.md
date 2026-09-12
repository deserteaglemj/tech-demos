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
7. **Validation** — must capture ≥1 screenshot and ≥1 video of the running app for the PR

Keep plans short (under ~80 lines). Prefer one vertical slice over polish.
