---
name: project-planning
description: Use before building any playground/<slug>/ test — write PLAN.md with the kind of thing, what good means, the end-to-end test, and the metrics that fit it.
---

# Project planning (tech-demos)

Before implementing a pick, write `PLAN.md` in its directory (`playground/<kebab-slug>/`, or `apps/<kebab-slug>/` only when the pick is an app). Include:

1. **Kind** — skill, plugin, app, tool, MCP server, or another specific form. Do not default to an app.
2. **Goal** — one sentence about what this test is for.
3. **Source** — bookmark URL / tech name.
4. **Scope** — what this test covers, and what it leaves out.
5. **Form** — the real artifact (skill files, plugin, server, CLI, app). How to run it. Bun only if it needs a JavaScript runtime.
6. **File sketch** — key paths inside the pick's directory.
7. **Metrics** — the measures that fit this thing, and the bar for "good".
8. **End-to-end test** — the steps that exercise it for real, and the evidence the PR will include. Screenshot and video are required only when the thing has a UI.

Keep plans short (under ~80 lines). Prefer one real test over polish.
