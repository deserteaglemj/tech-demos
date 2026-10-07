# Mstudios Pipeline

Mstudios postcard-funnel console built **on the ReUI admin slice**
(Data Grid, Filters, Kanban). Same components and interactions as that
template; prospects, stages, and the wordmark are Mstudios.

## Run

```bash
cd apps/mstudios-pipeline
bun install
bun run dev
```

Press `d` to toggle dark mode.

## What changed from the template

- Header: **Mstudios Pipeline**
- Records: local businesses (Henrythebarber, ATX Yardworks, Will's Lawn Care, …)
- Columns: stage, fit, owner, vertical — still the ReUI grid, filters, and board

Dragging a card one stage at a time updates that prospect on the Data Grid tab.
