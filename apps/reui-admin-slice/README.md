# Helpdesk Ops Console — ReUI admin slice

A tiny support-ticket admin dashboard demoing three of [ReUI](https://reui.io)'s
in-house shadcn components: **Data Grid**, **Filters**, and **Kanban**. See
[`PLAN.md`](./PLAN.md) for scope and background.

## Run it

```bash
bun install
bun run dev
```

Then open the printed local URL (defaults to http://localhost:5173).

- **Data Grid tab** — sortable, paginated ticket table with per-column
  status/priority facet filters, a search box, a column-visibility toggle,
  and a ReUI `<Filters>` toolbar (attribute → operator → value chips) that
  drives real client-side filtering.
- **Kanban tab** — drag tickets between New / In Progress / Waiting on
  Customer / Resolved; status changes are reflected back on the Data Grid.
- Press `d` anywhere to toggle dark mode.

Everything runs client-side against a deterministic mock dataset (56
tickets) in `src/data/tickets.ts` — no backend, resets on reload.

## Other scripts

```bash
bun run build      # production build (tsc -b && vite build)
bun run typecheck   # tsc --noEmit
bun run lint         # eslint (excludes vendored src/components/reui|ui)
```

## Where things live

- `src/components/reui/**`, `src/components/ui/**` — copy-and-own registry
  code installed via `npx shadcn@latest add @reui/...`. Not hand-edited.
- `src/data/tickets.ts` — mock ticket domain + deterministic generator
- `src/lib/filter-query.ts` — evaluates a ReUI `FilterQuery` tree against
  plain records
- `src/lib/ticket-filter-fields.tsx` — the `FilterField[]` schema for tickets
- `src/components/tickets-data-grid.tsx`, `tickets-kanban.tsx` — the two tabs
- `src/components/error-boundary.tsx` — scoped fallback around the Kanban
  board (see the "Known limitation" note in `PLAN.md`)
