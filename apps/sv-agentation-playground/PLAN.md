# PLAN — sv-agentation-playground

## Goal
Ship a tiny Svelte + Bun landing page with the Agentation toolbar so you can annotate UI and copy an agent-ready markdown payload.

## Source
- Tech: Svelte Agentation (`sv-agentation`)
- Bookmark: https://x.com/Sikandar_Bhide/status/2090106334201225285

## MVP scope (in)
- SvelteKit or Vite+Svelte sample landing with a few annotated-worthy components
- Agentation toolbar mounted; press `i` (or documented hotkey), leave notes, copy structured markdown
- README: `bun install && bun run dev`

## Out of scope
- Multi-user sync, auth, or remote agent backends

## Stack
- Bun + SvelteKit (Svelte 5), scaffolded with `bunx sv create` (minimal template)
- `sv-agentation` (requires `$app/environment`, hence SvelteKit over plain Vite+Svelte)
- Run: `cd apps/sv-agentation-playground && bun install && bun run dev`

## File sketch
- `package.json`, `vite.config.ts`, `tsconfig.json`, `src/routes/+layout.svelte` (mounts `<Agentation />`), `src/routes/+page.svelte`, `src/lib/components/` (Hero, Features, Workflow, Callout, SiteFooter), `src/app.css`, `README.md`, this `PLAN.md`

## Acceptance criteria
- [x] `bun install && bun run dev` works
- [x] Toolbar mounts; annotate + copy agent payload works
- [x] PR includes ≥1 screenshot and ≥1 video of annotation flow

## Validation
Screenshot + video of the running app in the PR. Not optional.

## Implementation notes
Landing page (hero, feature grid, workflow steps, dev-only callout) gives plenty of distinct elements to annotate. Toolbar is mounted only behind `browser && dev` per the library's docs, with `onAnnotationAdd`/`onCopy` callbacks logging to the console for visibility during manual testing. Verified locally via `bun run check` (0 errors) and a manual pass: inspect mode (`i`) → hover highlights → click-to-annotate → note composer → `c` to copy Markdown (confirmed via console log `[agentation] copied N note(s) as markdown`).
