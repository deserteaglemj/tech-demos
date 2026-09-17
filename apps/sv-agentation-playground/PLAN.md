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
- Bun + Svelte (Vite or SvelteKit)
- `sv-agentation` (or documented equivalent install under Bun)
- Run: `cd apps/sv-agentation-playground && bun install && bun run dev`

## File sketch
- `package.json`, Vite/Svelte config, `src/` pages + components, `README.md`, this `PLAN.md`

## Acceptance criteria
- [ ] `bun install && bun run dev` works
- [ ] Toolbar mounts; annotate + copy agent payload works
- [ ] PR includes ≥1 screenshot and ≥1 video of annotation flow

## Validation
Screenshot + video of the running app in the PR. Not optional.
