# PLAN — reui-admin-slice

## Goal
Ship a "Helpdesk Ops Console" admin vertical slice showing off ReUI's
in-house Data Grid, Filters and Kanban primitives on top of shadcn/ui.

## Source
- Tech: ReUI (shadcn component catalog) — https://reui.io/components
- Bookmark: https://x.com/eptwts/status/2092298910190448727

## MVP scope (in)
- One Vite + React + TypeScript app under `apps/reui-admin-slice/`
- shadcn/ui (Base UI primitives, `base-nova` style) scaffolded via
  `shadcn init -t vite --base base --preset nova`
- Real ReUI registry components installed via the shadcn CLI from the
  `@reui` registry (not hand-rolled lookalikes):
  `@reui/data-grid`, `@reui/filters`, `@reui/kanban`
- A single mock dataset (56 deterministically-generated support tickets,
  no network calls) shared across two tabs:
  - **Data Grid** tab: sortable/paginated grid, per-column status/priority
    facet filters, a global search box, column visibility toggle, and a
    ReUI `<Filters>` toolbar (attribute picker → operator → value, chips,
    clear) that drives real client-side filtering
  - **Kanban** tab: 4 status columns (New / In Progress / Waiting on
    Customer / Resolved), drag-and-drop cards and columns, ticket cards
    with priority badge, assignee avatar, channel, tags
- Dragging a card on the Kanban board updates ticket status and is
  reflected back on the Data Grid tab (shared app-level state)
- Dark mode (already wired by the shadcn Vite template, press `d`)

## Out of scope
- Backend/persistence — everything is in-memory, resets on reload
- Multi-user / auth / real-time collab
- Event Calendar (chose Kanban instead, per the "one Kanban or Event
  Calendar" instruction)
- Editing ticket details beyond drag-to-change-status

## Known limitation
Dragging a Kanban card in one continuous motion across 2+ intermediate
columns (e.g. straight from "New" to "Resolved") can occasionally trip a
"Maximum update depth exceeded" render loop inside the vendored
`@dnd-kit/sortable` + React 19 combination — reproducible via scripted,
perfectly-linear drag paths; a normal one-stage-at-a-time drag (the
realistic triage motion) does not trigger it. The Kanban tab is wrapped
in a scoped `ErrorBoundary` (`src/components/error-boundary.tsx`) so this
degrades to a "reload this board" message instead of a blank page if it
ever fires, and never affects the Data Grid tab.

## Stack
- Bun
- Vite 8 + React 19 + TypeScript
- Tailwind CSS v4, shadcn/ui (Base UI primitives) + ReUI registry
  components (`@tanstack/react-table` v9, `@tanstack/react-virtual`,
  `@dnd-kit/*`, `date-fns`)
- Run: `cd apps/reui-admin-slice && bun install && bun run dev`

## File sketch
- `components.json` — shadcn config, `@reui` registry namespace added
- `src/components/reui/**` — vendored ReUI registry code (data-grid,
  filters, kanban, badge) — copy-and-own, not hand-edited
- `src/components/ui/**` — vendored shadcn/ui primitives
- `src/data/tickets.ts` — mock ticket domain + deterministic generator
- `src/lib/filter-query.ts` — evaluates a ReUI `FilterQuery` tree against
  plain records (the piece `<Filters>` intentionally leaves to consumers)
- `src/lib/ticket-filter-fields.tsx` — `FilterField[]` schema for tickets
- `src/components/ticket-chrome.tsx` — status/priority badges, avatars
- `src/components/tickets-data-grid.tsx` — Data Grid tab
- `src/components/tickets-kanban.tsx` — Kanban tab
- `src/App.tsx` — tab shell, lifts the shared `tickets` state

## Acceptance criteria
- [x] `bun install && bun run dev` starts the Vite dev server without errors
- [x] Data Grid renders, sorts, paginates, and both its column facet
      filters and the `<Filters>` toolbar narrow the rows shown
- [x] Kanban board renders 4 columns and supports drag-and-drop of cards
      (and columns), with status changes reflected on the Data Grid tab
- [x] `bun run typecheck`, `bun run lint`, and `bun run build` all pass
      (lint and the two `noUnused*` TS flags exclude/relax for the
      vendored `components/reui` / `components/ui` registry code, same
      as any copy-and-own shadcn install would need to)
- [x] PR includes ≥1 screenshot of the running app
- [x] PR includes ≥1 video of the grid, filters and kanban interactions

## Validation
Captured screenshots of the Data Grid (default + filtered) and Kanban
board, plus a screen recording of: switching tabs, building a filter,
paginating, toggling columns/dark mode, and dragging a Kanban card
across columns. Attached to the PR — not optional.
