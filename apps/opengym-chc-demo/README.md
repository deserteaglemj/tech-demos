# opengym-chc-demo

Single-user [openGym](https://github.com/DuarteSantos8/openGym)-style workout tracker demo, branded for **Chris Harris Coaching** (silver mark + ember orange Structure identity).

## Run

```bash
cd apps/opengym-chc-demo
bun install
bun run dev
```

Open the Vite URL (default `http://localhost:5173`).

## Demo flow

1. **Home** — CHC hero, streak / weight, today’s Upper A session
2. **Train** — log weight × reps; rest timer starts; beat a PR for the ember toast
3. **Progress** — 28-day heatmap + body-weight chart vs goal

Data persists in `localStorage`. Use **Reset demo** to restore seed state.

## Stack

Bun · Vite · React · TypeScript
