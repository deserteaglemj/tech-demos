# Remotion Promo Studio

A tiny [Remotion](https://www.remotion.dev/) project that renders a 15–20 second
branded product teaser: **logo sting → 3 feature beats → call-to-action**, all
driven by editable props (no hardcoded copy or colors in the animation code).

## Run it

```bash
cd apps/remotion-promo-studio
bun install
bun run dev
```

`bun run dev` runs `remotion studio`, which opens the Remotion Studio at
`http://localhost:3000`. Select the **ProductTeaser** composition to preview
and scrub the ~18s animation.

## Edit the branding

Open the **ProductTeaser** composition in Remotion Studio and use the props
panel on the right to edit, live, without touching code:

- `productName` — shown in the logo sting and the CTA button
- `tagline` — optional line shown above the CTA button (leave blank to hide it)
- `accentColor` / `secondaryColor` / `backgroundColor` — color pickers that
  drive every gradient, ring, and highlight in the video
- `features` — an array (1–4 items) of `{ emoji, title, description }`; the
  timeline automatically re-fits itself (via `calculateMetadata`) if you add
  or remove a feature, so the video never clips or leaves dead air

Prop shapes are defined with `zod` in [`src/Teaser/schema.ts`](./src/Teaser/schema.ts);
defaults live in [`src/Teaser/defaultProps.ts`](./src/Teaser/defaultProps.ts).

## Structure

```
src/
  index.ts             registerRoot entry point
  Root.tsx             <Composition> registration + calculateMetadata
  Teaser/
    Teaser.tsx          scene sequencing (<Series>)
    LogoSting.tsx        scene 1: animated product wordmark
    FeatureBeat.tsx       scene 2 (x N): one feature per beat
    CallToAction.tsx      scene 3: tagline + CTA button
    BackgroundGlow.tsx    ambient gradient background, shared across scenes
    schema.ts             zod prop schema (incl. zColor pickers)
    defaultProps.ts       default prop values
    constants.ts          fps / resolution / per-scene frame durations
```

## Other scripts

- `bun run build` — renders the composition to `out/product-teaser.mp4` via
  `remotion render` (not required for the demo, but handy to try)
- `bun run still` — renders a single still frame to `out/product-teaser.png`

## Regenerating scenes with Remotion Agent Skills

This project was built by hand, but you can optionally pull in the official
[Remotion Agent Skills](https://x.com/chddaniel/status/2078869144171380763)
to have an AI coding agent extend or restyle scenes going forward:

```bash
npx skills add remotion-dev/skills
```

## Notes

- Targets Remotion 4 + React 19 (see `package.json` for pinned versions).
- Out of scope for this MVP: CI render/export pipeline, multi-composition
  template picker, auth/persistence. See `PLAN.md` for the full scope.
