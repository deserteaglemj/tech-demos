# Side by Frame — HyperFrames vs Remotion

Interactive comparison of [HyperFrames](https://github.com/heygen-com/hyperframes) (HeyGen) and [Remotion](https://www.remotion.dev) using the same 3-second HELLO title card from HyperFrames’ own comparison guide.

## Run

```bash
cd apps/hyperframes-vs-remotion
bun install
bun run dev
```

Open the Vite URL (default `http://localhost:5173`).

## What you get

- **Left:** HyperFrames HTML composition via `@hyperframes/player`
- **Right:** Remotion React composition via `@remotion/player`
- Authoring snippets + decision matrix (build step, timing model, license, agents)

## HyperFrames CLI smoke

Requires Node 22+, FFmpeg, and Chrome (system Chrome or chrome-headless-shell).

```bash
bun run lint:hf
bun run render:hf   # writes out/hyperframes-title.mp4 (~3s)
```

## Stack

Bun · Vite · React · `hyperframes` / `@hyperframes/player` · `remotion` / `@remotion/player`
