# SESSION — tech-demo-pipeline diagram

## Skill used
`/workspace/apps/diagram-design-playground/.agents/skills/diagram-design/` (Diagram Design, v2.6)

## References loaded (in order, per SKILL.md)
1. `SKILL.md` — full read (philosophy, type selection, design system, connector rules, complexity budget, taste gate).
2. `references/style-guide.md` — confirmed shipped defaults (`paper #f5f5f5`, `ink #2d3142`, `muted #4f5d75`, `accent #eb6c36`), typography (Instrument Serif / Geist / Geist Mono), node-type → treatment table.
3. `references/type-architecture.md` — layout conventions, orthogonal elbow-path formulas, zone-grouping markup, crossing bridge/hop primitive.
4. `references/primitives-core.md` — exact node-box / arrow-label / legend markup, the six mandatory connector rules, accessible-SVG contract.
5. `references/layout-budget.md` — 4px grid, allowed node width/height/gap/radius values, universal + per-type complexity budgets.
6. `references/output-spec.md` — skimmed for size-preset conventions (this is a fresh diagram, not an import, so the four import dials don't strictly apply; used `doc-inline`-style proportions as a sizing reference).
7. `assets/template.html` and `assets/example-architecture.html` — read for exact page scaffold and node/legend markup conventions. **Not copied verbatim** — this diagram's nodes, arrows, labels, and layout were authored fresh for the tech-demo pipeline content.

## Style-guide gate
User selected **(e) keep default**. Shipped defaults used as-is — no custom brand tokens, no onboarding flow run. Verified against `style-guide.md` before drawing: paper `#f5f5f5`, ink `#2d3142`, muted `#4f5d75`, accent `#eb6c36`.

## Plan stated before drawing
- **Type:** Architecture (components + connections in one system snapshot — matches "single-user tech-demo pipeline" request exactly; no semantic pattern needed, this is a plain linear pipeline with one trust boundary).
- **Size / variant:** Minimal light (`assets/template.html` base), custom `viewBox="0 0 1164 340"` sized to fit 6 nodes in one row + a below-row accent return path + legend strip, all on the 4px grid. No dotted-paper texture (clean paper per default light variant).
- **Density target ~4/10:** 6 nodes, 6 arrows (2 straight pairs merged into the pipeline, 1 accent headline arrow, 1 dashed secondary arrow) — well under the 9-node / 12-arrow budget, with only 1 coral focal element (under the 2-max limit).
- **What was cut for density:**
  - Collapsed "owner sees tweet" + "owner bookmarks it" into one **Repo Owner** node (two events, one idea).
  - Collapsed "install tool" + "run it" into one **Real Tool** node (sequential sub-steps of the same action, not two ideas).
  - Dropped a literal `tracking/seen-bookmarks.json` node — folded into **Sticky Monorepo**'s sublabel instead of a 7th box.
  - No link-blue (HTTP/API) arrows used — every edge here is an internal process handoff, not a network call, so the `arrow-link` marker is defined (per template) but unused.
  - No second zone — only one trust boundary matters (work that happens inside the cloud-agent sandbox vs. the public X post and the external GitHub PR), so used the max-3-zones budget minimally (1 zone).

## Nodes (6, within the 9-node budget)
1. **Repo Owner** (input treatment) — public X bookmark
2. **Sticky Monorepo** (store treatment) — repo state + queue
3. **Cursor Cloud Agent** (**focal**, coral) — claude-sonnet-5
4. **Real Tool** (backend treatment) — npm/pip install + run
5. **HTML Artifact** (store treatment) — output/*.html
6. **Pull Request** (external treatment) — screenshot + video

Nodes 2–5 sit inside one dashed-zone-adjacent boundary rect labeled "AGENT WORKSPACE" (the sticky monorepo / cloud sandbox); Repo Owner and Pull Request sit outside it (one is the public source, the other is the external GitHub artifact).

## Output file
`/workspace/apps/diagram-design-playground/output/tech-demo-pipeline.html`

Verified with `python3 .agents/skills/diagram-design/scripts/self_check.py output/tech-demo-pipeline.html` → `OK`. Rendered headlessly with `google-chrome --headless` to confirm the file opens and lays out correctly as static HTML with no JavaScript.
