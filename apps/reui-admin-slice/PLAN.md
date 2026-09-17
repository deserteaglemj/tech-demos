# PLAN — reui-admin-slice

## Goal
Ship a tiny Bun + Vite admin slice using ReUI / shadcn-style composed pieces: Data Grid + Filters + one Kanban or Event Calendar, mock data only.

## Source
- Tech: ReUI (https://reui.io/components)
- Bookmark: https://x.com/eptwts/status/2092298910190448727

## MVP scope (in)
- Vite + React + TypeScript admin page
- Data Grid + Filters + one of Kanban or Event Calendar (mock data)
- README: `bun install && bun run dev`

## Out of scope
- Real backend, auth, full ReUI catalog import

## Stack
- Bun + Vite + React + Tailwind/shadcn-compatible setup as ReUI expects
- Run: `cd apps/reui-admin-slice && bun install && bun run dev`

## File sketch
- `package.json`, Vite/Tailwind config, `src/` admin UI, mock data, `README.md`, this `PLAN.md`

## Acceptance criteria
- [ ] `bun install && bun run dev` works
- [ ] Grid + filters + Kanban/Calendar interactive with mock data
- [ ] PR includes ≥1 screenshot and ≥1 video

## Validation
Screenshot + video of the running app in the PR. Not optional.
