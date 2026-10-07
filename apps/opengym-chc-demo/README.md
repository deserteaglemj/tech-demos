# opengym-chc-demo

Full [openGym](https://github.com/DuarteSantos8/openGym)-style training app demo, branded for **Chris Harris Coaching**.

## Run

```bash
cd apps/opengym-chc-demo
bun install
bun run dev
```

Open the Vite URL (default `http://localhost:5173`).

## Pages (openGym chrome)

| Tab / route | What you get |
| --- | --- |
| **Home** | Today’s session, body weight, streak, quick links |
| **Plan** | Mon–Sun CHC Upper/Lower week |
| **Start** | Guided workout — log sets, rest timer, PR toast, finish |
| **Stats** | Heatmap, body-weight chart, lift PRs → History |
| **Exercises** | Searchable library + muscle filters → Muscle map |
| **History** | Past sessions (from Stats) |
| **Muscles** | Balance / Fatigue / Detrained modes |
| **Settings** | Athlete profile, units, accent, reset demo |

Data persists in `localStorage`. Use **Reset** to restore seed state.

## Download walkthrough video

Full-app walkthrough MP4 (every page, ~85s):

- In the running app: **Settings → Download MP4**
- File in repo: [`public/demo/full-app-walkthrough.mp4`](./public/demo/full-app-walkthrough.mp4)
- Direct download (this branch):
  https://github.com/deserteaglemj/tech-demos/raw/cursor/opengym-chc-demo-56d1/apps/opengym-chc-demo/public/demo/full-app-walkthrough.mp4

## Stack

Bun · Vite · React · TypeScript
