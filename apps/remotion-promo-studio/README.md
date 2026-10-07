# Remotion Promo Studio

A tiny [Remotion](https://www.remotion.dev/) project with two M Studio compositions:

1. **ProductTeaser** — 15–20s brand teaser (logo sting → 3 feature beats → CTA)
2. **ApplicationWalkthrough** — ~22s website-ready demo of how easy it is to
   apply at [mstudios.cc/start](https://www.mstudios.cc/start): open the form →
   walk the 8 sections → send → free demo promise → CTA

Default branding matches the live site at [mstudios.cc](https://www.mstudios.cc)
/ Vercel project `mstudios-new` (Syne, pink `#f06292` + purple `#9c27b0` on
`#080608`).

## Run it

```bash
cd apps/remotion-promo-studio
bun install
bun run dev
```

`bun run dev` runs `remotion studio` at `http://localhost:3000`. Pick
**ProductTeaser** or **ApplicationWalkthrough** in the left sidebar.

## Edit the branding

Open the **ProductTeaser** composition in Remotion Studio and use the props
panel on the right to edit, live, without touching code:

- `productName` — shown in the logo sting
- `tagline` — optional line shown above the CTA button (leave blank to hide it)
- `ctaLabel` — CTA button text (blank → `Try {productName} Free`)
- `accentColor` / `secondaryColor` / `backgroundColor` — color pickers that
  drive every gradient, ring, and highlight in the video
- `features` — an array (1–4 items) of `{ mark, title, description }`
  (`mark` is a short 1–2 character icon label); the timeline automatically
  re-fits itself (via `calculateMetadata`) if you add or remove a feature, so
  the video never clips or leaves dead air

Prop shapes are defined with `zod` in [`src/Teaser/schema.ts`](./src/Teaser/schema.ts);
defaults live in [`src/Teaser/defaultProps.ts`](./src/Teaser/defaultProps.ts).

## ApplicationWalkthrough (for the website)

Customer-facing walkthrough of the real `/start` intake:

1. Intro — “Getting your website is easy”
2. Open `mstudios.cc/start` — “Let’s build your free demo”
3. Form journey — all 8 sections light up (Basics → … → Logistics) with a
   sample business typed into the first fields
4. Submit — “Send it over →”
5. Outcome — free working demo, pay only if you love it
6. CTA — Start Your Free Demo

Edit sample business/owner names and colors via the Studio props panel
(`src/Apply/schema.ts`).

## Structure

```
src/
  index.ts             registerRoot entry point
  Root.tsx             <Composition> registration
  Teaser/              ProductTeaser composition
  Apply/               ApplicationWalkthrough composition
    ApplyWalkthrough.tsx
    BrowserChrome.tsx
    scenes/            Intro, OpenStart, FormJourney, Submit, Outcome, CTA
```

## Other scripts

- `bun run build` — renders ProductTeaser to `out/product-teaser.mp4`
- `bunx remotion render ApplicationWalkthrough out/apply-walkthrough.mp4`
- `bun run still` — still frame of ProductTeaser

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
