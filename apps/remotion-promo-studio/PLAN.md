# PLAN — remotion-promo-studio

## Goal
Ship a Remotion Studio app with an M Studio brand teaser and a website-ready
walkthrough of the `/start` application process (how easy it is to get a site).

## Source
- Tech: Remotion (Agent Skills)
- Bookmark: https://x.com/chddaniel/status/2078869144171380763

## MVP scope (in)
- Remotion project under `apps/remotion-promo-studio/`
- `ProductTeaser`: logo sting → 3 short feature beats → CTA
- `ApplicationWalkthrough`: intro → open /start → 8-section form journey →
  submit → free-demo outcome → CTA (for embedding on mstudios.cc)
- Editable props for brand/copy/colors (and sample form values)
- Preview via Remotion Player / Studio (`bun run dev`)
- README with run instructions; optional Remotion Agent Skills note

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
- [x] ProductTeaser renders with prop-driven product name/colors
- [x] ApplicationWalkthrough mirrors the real `/start` 8-section flow
- [x] README documents how to run both compositions
- [x] PR includes ≥1 screenshot of the running Studio/Player
- [x] PR includes ≥1 video of a composition playing

## Shipped

- `ProductTeaser` composition (1920x1080, 30fps, 18s default) sequenced with
  `<Series>`: logo sting (3s) → N feature beats (4s each, default 3) → CTA (3s).
- Fully prop-driven via a `zod` schema (`src/Teaser/schema.ts`): `productName`,
  `tagline` (optional), `accentColor`/`secondaryColor`/`backgroundColor`
  (color pickers via `@remotion/zod-types` `zColor()`), and a `features` array
  (1–4 `{ mark, title, description }` items). `calculateMetadata` re-fits the
  total duration automatically if the number of features changes, so the
  timeline never clips or leaves dead air.
- Typography via `@remotion/google-fonts` (Syne, matching mstudios.cc).
- Default brand: **M Studio** — pink `#f06292` / purple `#9c27b0` / black
  `#080608` from the live Vercel site (`mstudios-new` → www.mstudios.cc), with
  feature beats for Design & Build / Get Found / Keep Growing and CTA
  “Get Your Free Demo”. All editable in Studio.
- Stack: Bun, Remotion 4.0.523, React 19.3, TypeScript, zod 4.5.4 (pinned to
  match Remotion's internal zod-types requirement).
- `ApplicationWalkthrough` (~22s): mirrors [mstudios.cc/start](https://www.mstudios.cc/start)
  — browser chrome, 8 intake sections with progress, submit, thank-you / free
  demo, CTA. Editable sample business/owner and brand colors.
- README documents `bun install && bun run dev`, both compositions, and the
  optional `npx skills add remotion-dev/skills` note.

## Validation
Capture screenshot + video from the running app and attach both to the PR. Not optional.
