# PLAN — mstudios-pipeline

## Goal
Run the Mstudios postcard funnel on the ReUI admin-slice template:
Data Grid + Filters + Kanban, with Mstudios prospects and branding.

## Source
- Template: `apps/reui-admin-slice` (ReUI Data Grid, Filters, Kanban)
- Registry: https://reui.io/components
- Domain: Mstudios Finder → Brand kit → Stage 4 → Won

## MVP scope (in)
- Vendored ReUI + shadcn primitives copied from the admin slice (not rewritten)
- Same interactions as that demo: sortable/paginated grid, column facet
  filters, `<Filters>` toolbar, column visibility, dark mode (`d`),
  drag-and-drop Kanban whose stage changes show up on the grid
- Dataset is the Notion Mstudios Leads book (website status, problem/SEO
  note, phone, address) plus published Stage 4 preview URLs. Payment,
  last payment, and contract stay empty when nothing is on file.
- Branding: Mstudios Pipeline wordmark; stages, fit, vertical, owner

## Out of scope
- Rebuilding a custom dashboard beside the ReUI components
- Stripe, Vercel, or mail-vendor APIs
- Auth / multi-user

## Known limitation
Same as the admin slice: a perfectly linear multi-column Kanban drag can
trip a dnd-kit + React 19 update-depth loop. The board is wrapped in
`ErrorBoundary`. One-column-at-a-time drags are the supported motion.

## Stack
- Bun, Vite 8, React 19, TypeScript
- Tailwind v4, shadcn base-nova, `@reui` data-grid / filters / kanban
- Run: `cd apps/mstudios-pipeline && bun install && bun run dev`

## File sketch
- `src/components/reui/**`, `src/components/ui/**` — vendored template
- `src/data/deals.ts` — Mstudios prospects
- `src/lib/filter-query.ts` — same evaluator as the admin slice
- `src/lib/deal-filter-fields.tsx` — Filters schema
- `src/components/deals-data-grid.tsx`, `deals-kanban.tsx`, `deal-chrome.tsx`
- `src/App.tsx` — branded shell, shared deal state

## Acceptance criteria
- [x] `bun install && bun run dev` starts
- [x] Data Grid sorts, paginates, column-filters, and `<Filters>` narrow rows
- [x] Kanban drag updates stage and the Data Grid shows the new stage
- [x] `bun run typecheck` and `bun run build` pass
- [x] PR has ≥1 screenshot and ≥1 video

## Validation
Screenshot of the grid and the board. Video of filter, pagination, column
toggle, dark mode, and a one-stage Kanban drag.
