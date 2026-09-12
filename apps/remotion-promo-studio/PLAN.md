# PLAN — remotion-promo-studio

## Goal
Ship a tiny Remotion Studio app that previews a 15–20s branded product teaser composition with editable props.

## Source
- Tech: Remotion (Agent Skills)
- Bookmark: https://x.com/chddaniel/status/2078869144171380763

## MVP scope (in)
- Remotion project under `apps/remotion-promo-studio/`
- One composition: logo sting → 3 short feature beats → CTA
- Editable props: product name, accent colors (and maybe tagline)
- Preview via Remotion Player / Studio (`bun run dev`)
- README with run instructions; optional note that Remotion Agent Skills (`npx skills add remotion-dev/skills`) can regenerate scenes later

## Out of scope
- Rendering/export pipeline to MP4 in CI
- Multi-composition template marketplace
- Auth, persistence, or multi-user

## Stack
- Bun
- Remotion (latest stable)
- TypeScript + React as Remotion expects
- Run: `cd apps/remotion-promo-studio && bun install && bun run dev`

## File sketch
- `package.json`, `tsconfig.json`, `remotion.config.ts` (or equivalent)
- `src/Root.tsx`, `src/Composition.tsx` (or similar)
- `public/` assets if needed (simple SVG/logo placeholder OK)
- `README.md`

## Acceptance criteria
- [x] `bun install && bun run dev` starts Studio/Player without errors
- [x] Composition renders the teaser with prop-driven product name/colors
- [x] README documents how to run
- [x] PR includes ≥1 screenshot of the running Studio/Player
- [x] PR includes ≥1 video of the composition playing

## Shipped

- `ProductTeaser` composition (1920x1080, 30fps, 18s default) sequenced with
  `<Series>`: logo sting (3s) → N feature beats (4s each, default 3) → CTA (3s).
- Fully prop-driven via a `zod` schema (`src/Teaser/schema.ts`): `productName`,
  `tagline` (optional), `accentColor`/`secondaryColor`/`backgroundColor`
  (color pickers via `@remotion/zod-types` `zColor()`), and a `features` array
  (1–4 items). `calculateMetadata` re-fits the total duration automatically if
  the number of features changes, so the timeline never clips or leaves dead air.
- Stack: Bun, Remotion 4.0.523, React 19.3, TypeScript, zod 4.5.4 (pinned to
  match Remotion's internal zod-types requirement).
- README documents `bun install && bun run dev`, the props panel, file layout,
  and the optional `npx skills add remotion-dev/skills` note.

## Validation
Capture screenshot + video from the running app and attach both to the PR. Not optional.
