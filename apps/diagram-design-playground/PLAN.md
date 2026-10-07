# PLAN — diagram-design-playground

## Goal
Ship a Bun playground that demos editorial Diagram Design: typed SVG schematics with light/dark/full-editorial skins, live brand tokens, and copy-ready HTML.

## Source
- Tech: Diagram Design (https://github.com/cathrynlavery/diagram-design)
- Site: https://diagramdesign.dev

## MVP scope (in)
- 6 hand-drawn editorial diagram types (React SVG): Architecture, Loop, Flowchart, Sequence, Quadrant, Pyramid
- Variant switcher: minimal light · minimal dark · full-editorial
- Live brand tokens (paper / ink / accent / muted) applied to the active diagram
- Optional staggered reveal motion (respects `prefers-reduced-motion`)
- Copy self-contained HTML for the current diagram + variant
- README: `bun install && bun run dev`

## Out of scope
- Full 44-type catalog, Mermaid/draw.io import, PNG export, agent skill packaging

## Stack
- Bun + Vite + React + TypeScript
- Run: `cd apps/diagram-design-playground && bun install && bun run dev`

## File sketch
- `package.json`, Vite/TS config, `index.html`
- `src/App.tsx`, `src/index.css`, `src/main.tsx`
- `src/lib/tokens.ts`, `src/lib/exportHtml.ts`
- `src/components/TokenPanel.tsx`, `VariantTabs.tsx`, `TypeNav.tsx`, `DiagramStage.tsx`
- `src/diagrams/*.tsx` — six typed schematics
- `README.md`, this `PLAN.md`

## Acceptance criteria
- [ ] `bun install && bun run dev` works
- [ ] All 6 types render; variant + token changes update the SVG live
- [ ] Copy HTML produces a self-contained file that opens offline
- [ ] Reveal motion works when enabled; static is default
- [ ] PR includes ≥1 screenshot and ≥1 video of the running app

## Validation
Screenshot + video of the running app in the PR. Not optional.
