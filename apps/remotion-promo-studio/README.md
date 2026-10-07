# remotion-promo-studio

Branded product teaser composition for Remotion Studio — logo sting → three feature beats → CTA, with editable props for product name and accent colors.

Source bookmark: [Remotion Agent Skills](https://x.com/chddaniel/status/2078869144171380763)

## Run

```bash
cd apps/remotion-promo-studio
bun install
bun run dev
```

Opens Remotion Studio. Select **ProductTeaser**, scrub the timeline, and edit props (product name, tagline, accent colors) in the right panel.

## Optional render

```bash
bun run render
```

Writes `out/teaser.mp4` (local only; not required for the MVP).

## Remotion Agent Skills (optional)

To regenerate or extend scenes with Remotion’s agent skills later:

```bash
npx skills add remotion-dev/skills
```

## Composition

| Segment        | Frames (30 fps) | Seconds |
|----------------|-----------------|---------|
| Logo sting     | 0–60            | 0–2s    |
| Feature beats  | 60–375          | 2–12.5s |
| CTA            | 375–540         | 12.5–18s|

Total length: **18 seconds**.
