# Diagram Design Playground

Bun + Vite + React demo of [Diagram Design](https://github.com/cathrynlavery/diagram-design) — editorial HTML/SVG schematics without Mermaid slop.

## Run

```bash
bun install
bun run dev
```

Open the printed local URL. Switch diagram types, flip light / dark / full-editorial, retint brand tokens, enable staggered reveal, and copy a self-contained HTML file.

## What’s in the MVP

- Six typed SVG diagrams: Architecture, Loop, Flowchart, Sequence, Quadrant, Pyramid
- Variant skins matching the skill’s minimal light, minimal dark, and full-editorial modes
- Live paper / ink / accent / muted tokens
- Optional staggered reveal (honors `prefers-reduced-motion`)
- Copy-ready offline HTML export

## Source

- Skill repo: https://github.com/cathrynlavery/diagram-design
- Site: https://diagramdesign.dev
