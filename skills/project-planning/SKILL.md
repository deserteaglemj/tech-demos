---
name: project-planning
description: Use before building any apps/<slug>/ demo — write PLAN.md with goal, MVP scope, stack, acceptance criteria, and validation (screenshot + video).
---

# Project planning (tech-demos)

Before implementing `apps/<kebab-slug>/`, write `apps/<kebab-slug>/PLAN.md` with:

1. **Goal** — one sentence (what real usage is being proven)
2. **Source** — bookmark URL / tech name / GitHub repo
3. **Demo kind** — `tool-usage` (install + agent prompt → real output) **or** `app` (Bun vertical slice)
4. **MVP scope** — what ships in the first PR (and what is explicitly out)
5. **Stack / install** — how the owner would install and run it; for apps: `bun install && bun run dev`
6. **File sketch** — key paths under `apps/<slug>/` (for tool-usage: include `PROMPT.md` + output artifact paths)
7. **Acceptance criteria** — checklist; for tool-usage must include “real prompt produced real artifact via the installed tool”
8. **Validation** — ≥1 screenshot and ≥1 video of the real demo for the PR

Keep plans short (under ~80 lines). Prefer one vertical slice over polish.

## Choosing demo kind

- GitHub skill / agent plugin / “ask your coding agent to…” → **`tool-usage`**. Do **not** plan a showcase playground that reimplements their gallery.
- Embeddable library / UI runtime → **`app`**.
