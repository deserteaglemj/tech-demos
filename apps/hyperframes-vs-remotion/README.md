# Bake-Off — HyperFrames vs Remotion

Same agent prompt, two guides. Compare the outputs, read the ratings, see the verdict.

## Run

```bash
cd apps/hyperframes-vs-remotion
bun install
bun run dev
```

## What’s in the demo

1. **Shared prompt** — Lumen Desk 6s product sting (exact text in `PROMPT.md`)
2. **Output A** — HyperFrames HTML + GSAP (`public/hyperframes/`)
3. **Output B** — Remotion React (`src/remotion/LumenDesk.tsx`)
4. **Ratings + verdict** — scored axes and a HyperFrames / Remotion mini call

## CLI smoke

```bash
bun run lint:hf
bun run render:hf   # out/hyperframes-title.mp4 (6s)
```
