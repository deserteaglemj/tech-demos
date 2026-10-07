# Mstudios Pipeline

End-to-end operator console for the Mstudios local-site postcard funnel.

## Run

```bash
cd apps/mstudios-pipeline
bun install
bun run dev
```

Open the printed local URL (default `http://localhost:5174`).

## What it is

A single-operator workspace the Mstudios team can use to run:

**Finder → Brand kit → Stage 4 preview → Payment → Postcard → Print/mail → Won**

with city gates (Austin mail hold, New Braunfels Stage 4 gate), deal editing, activity log, kanban board, and filterable table. State persists in `localStorage`.

## Demo path

1. Open **Command** — review KPIs and city gates.
2. Open Austin **Mail / payments**.
3. Open **Demo Cuts ATX** (Stage 4) → Advance through Payment → Postcard (mark print-ready) → Mail → set payment **paid** → Won.
4. Try advancing **Will's Lawn Care** while New Braunfels Stage 4 is gated — should block with a clear reason.
5. Reload the page — deals remain.

## Scripts

- `bun run dev` — Vite dev server
- `bun run build` — production build
- `bun run typecheck` — TypeScript
- `bun run preview` — preview production build
