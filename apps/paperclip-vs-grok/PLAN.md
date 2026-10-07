# PLAN — paperclip-vs-grok (live products)

## Goal
Run **real Paperclip** and **real Grok Bot** on the cloud computer and compare them side-by-side on video — who is using each, how work is assigned — not a fake website demo.

## Source
- Paperclip: https://github.com/paperclipai/paperclip
- Grok Bot: https://cursor.com/docs/grok-bot

## MVP scope (in)
- Install + run Paperclip locally (`paperclipai`); seed company, goal, agents, issues
- Install + launch Grok Bot desktop app (Linux .deb)
- Live video: Paperclip org/agents/tasks vs Grok Bot sign-in / bots (auth may require human Cursor login)
- `bun run dev` = live lab runner (starts Paperclip, launches Grok Bot) — **not** a Vite comparison site
- WHO-USES notes for public adopters of each

## Out of scope
- Fake React comparison playground UI
- Completing Grok Bot OAuth without the owner Cursor credentials

## Stack
- Bun scripts + system Paperclip CLI + Grok Bot desktop
- Run: `cd apps/paperclip-vs-grok && bun install && bun run dev`

## Acceptance criteria
- [x] Paperclip running on `:3100` with company + agents + issues
- [x] Grok Bot installed and launched
- [x] Side-by-side live recording + screenshots of who is using Paperclip
- [ ] Grok Bot fully signed-in bots list (needs owner auth)

## Validation
Live screenshot + video of real Paperclip + real Grok Bot windows. Not optional.
