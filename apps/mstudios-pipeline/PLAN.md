# PLAN — mstudios-pipeline

## Goal
Ship an end-to-end Mstudios operator console the team can run the
Finder → Brand → Stage 4 → Payment → Postcard → Mail pipeline from.

## Source
- Internal ops: Mstudios postcard / local-site funnel (Notion project)
- Patterns: admin pipeline board + deal table (ReUI-style ops UX)

## MVP scope (in)
- One Vite + React + TypeScript app under `apps/mstudios-pipeline/`
- Real Mstudios stage model with entry/exit rules and city gates
- Seeded deals from Austin / New Braunfels finds (barber, lawn, cleaning)
- Shared state across:
  - **Command** — KPI strip, city gates, stage throughput
  - **Board** — kanban by pipeline stage with drag-to-advance (gated)
  - **Table** — searchable/filterable deal list
  - **Deal drawer** — edit fields, brand kit HEX, preview URL, payment
    status, activity log, advance / hold / block actions
- Add-prospect flow for new finds
- Persist workspace to `localStorage` (survives reload); reset-to-seed
- Single-operator demo (no auth) — ready for team walkthrough

## Out of scope
- Real Stripe / Vercel / print-vendor APIs (status fields are operable mocks)
- Multi-user sync / auth
- Postcard PDF generation and mail vendor adapters

## Stack
- Bun
- Vite 8 + React 19 + TypeScript
- Tailwind CSS v4
- `@dnd-kit` for board drag-and-drop
- Run: `cd apps/mstudios-pipeline && bun install && bun run dev`

## File sketch
- `src/types.ts` — deal, stage, city-gate domain
- `src/data/seed.ts` — realistic seeded pipeline
- `src/lib/pipeline.ts` — stage rules + gate checks
- `src/lib/storage.ts` — localStorage load/save
- `src/hooks/use-pipeline-store.ts` — app state
- `src/components/*` — shell, metrics, board, table, drawer, filters
- `src/App.tsx` — view router + store wiring

## Acceptance criteria
- [x] `bun install && bun run dev` starts cleanly
- [x] Board + table share state; advancing a deal updates both
- [x] Stage rules + city gates block illegal advances with clear reasons
- [x] Deal drawer edits persist (brand kit, preview, payment, notes)
- [x] Add prospect creates a Finder-stage deal
- [x] Reload keeps data; Reset restores seed
- [x] `bun run typecheck` and `bun run build` pass
- [ ] PR includes ≥1 screenshot and ≥1 video of the running console

## Validation
Screenshot of Command + Board; video of filter → open deal → advance
stage → board update → reload persistence.
