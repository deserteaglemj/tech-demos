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
- [ ] PR includes ≥1 screenshot of the running Studio/Player
- [ ] PR includes ≥1 video of the composition playing

## Shipped file sketch
- `package.json`, `tsconfig.json`, `remotion.config.ts`, `eslint.config.mjs`
- `src/index.ts`, `src/Root.tsx`, `src/Composition.tsx`, `src/ProductTeaser.tsx`
- `src/schema.ts` (Zod props: productName, tagline, accentPrimary, accentSecondary)
- `src/scenes/` LogoSting · FeatureBeat · CallToAction
- `src/components/LogoMark.tsx`, `src/fonts.ts`, `public/logo.svg`
- `README.md`

## Validation
Capture screenshot + video from the running app and attach both to the PR. Not optional.
