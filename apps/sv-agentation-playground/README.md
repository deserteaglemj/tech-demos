# sv-agentation-playground

A tiny SvelteKit landing page used to exercise the [`sv-agentation`](https://www.npmjs.com/package/sv-agentation) dev-mode annotation toolbar.

Source pick: [Svelte Agentation](https://sv-agentation.com) — bookmark [x.com/Sikandar_Bhide/status/2090106334201225285](https://x.com/Sikandar_Bhide/status/2090106334201225285).

## Run it

```sh
cd apps/sv-agentation-playground
bun install
bun run dev
```

Then open the printed local URL (default `http://localhost:5173`). The Agentation toolbar is mounted automatically in dev mode (`browser && dev`, see `src/routes/+layout.svelte`) — it never ships in a production build.

## Try the annotation flow

1. Press **`i`** to toggle inspect mode. Hovering any element now shows a highlight outline and its selector.
2. Click an element (or drag to select text, or `shift`/`cmd`-click multiple elements to group them) to open the note composer, type feedback, and submit.
3. A small marker/badge appears on annotated elements and the toolbar's note counter increments.
4. Press **`c`** to copy every note on the page as structured Markdown — paste the result straight into an AI coding agent.

Other shortcuts: **`o`** opens the hovered source location (requires `workspaceRoot`), **`r`** resets the floating toolbar position, **`esc`** cancels the current action.

To enable "open in editor" links, set the `workspaceRoot` constant in `src/routes/+layout.svelte` to the absolute path of this app on your machine, e.g.:

```ts
const workspaceRoot = '/absolute/path/to/tech-demos/apps/sv-agentation-playground';
```

## What's here

- `src/routes/+layout.svelte` — mounts `<Agentation />` behind `browser && dev`, wired up with `onAnnotationAdd` / `onCopy` callbacks that log to the console.
- `src/routes/+page.svelte` — the sample landing page (hero, feature grid, workflow steps, callout) composed from `src/lib/components/`.
- `src/app.css` — shared dark-theme styles for the landing page.

## Stack

Bun + SvelteKit (Svelte 5) + [`sv-agentation`](https://www.npmjs.com/package/sv-agentation).
