# Bake-Off — HyperFrames vs Remotion (IM STUDIOS)

Same conversion brief, two guides. Plus a paste-ready **`HANDOFF.md`** for your local AI agent to install both stacks, pull all skills, find work-fit uses, and ship the video.

## Run the demo

```bash
cd apps/hyperframes-vs-remotion
bun install
bun run dev
```

## Local agent handoff

Paste **`HANDOFF.md`** into Cursor / Claude Code / Codex. It covers:

1. Official Remotion + HyperFrames install commands  
2. Installing **all** related agent skills  
3. Finding where either fits *your* work (not generic examples)  
4. Acceptance test: IM STUDIOS 12s conversion video → `imstudios.ca` CTA  

## What’s on screen

1. Shared IM STUDIOS conversion prompt  
2. Output A — HyperFrames · Output B — Remotion  
3. Ratings + verdict  

## Render

```bash
bun run lint:hf
bun run render:hf   # out/imstudios-conversion.mp4 (12s)
```
