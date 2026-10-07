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
- Records: the real Mstudios Austin lead book (plus Will's Lawn Care), including live, parked, dead, and missing sites
- Columns: site status, their website, Stage 4 preview, SEO note, payment, last payment, contract
- Click a row for relationship history. Payments and contracts are blank where none exist on file.

Dragging a card one stage at a time updates that prospect on the Data Grid tab.
