# PLAN — agentcomposerui-playground

## Goal
Ship a Bun playground that demos AgentComposerUI’s human-in-the-loop composers: mock-agent drafts stream into LinkedIn, X Thread, Email, and GitHub PR review cards for approve / reject / revise.

## Source
- Tech: AgentComposerUI (`agentcomposerui` on npm)
- Public source (X bookmarks API spend-capped at scout time): https://dev.to/theajmalrazaq/i-built-agentcomposerui-ui-components-for-ai-agents-that-actually-need-human-approval-4g7a
- Repo: https://github.com/theajmalrazaq/agentcomposerui

## MVP scope (in)
- Bun + Vite + React + Tailwind playground at `apps/agentcomposerui-playground/`
- Channel switcher: LinkedIn, X/Twitter Thread, Email Outreach, GitHub PR
- Mock agent “stream” that fills each composer (no API key)
- Approve / reject with feedback → mock revision loop
- Activity log of HITL events
- README: `bun install && bun run dev`

## Out of scope
- Real LLM / publishing APIs
- Auth, multi-user sync, production HITL backends

## Stack
- Bun + Vite + React + TypeScript + Tailwind v4
- `agentcomposerui` drop-in composers
- Run: `cd apps/agentcomposerui-playground && bun install && bun run dev`

## File sketch
- `package.json`, Vite/Tailwind config, `index.html`
- `src/App.tsx`, `src/main.tsx`, `src/index.css`
- `src/data/drafts.ts` — seed + revised mock payloads
- `src/components/` — channel chrome, mock agent controls, activity log
- `README.md`, this `PLAN.md`

## Acceptance criteria
- [ ] `bun install && bun run dev` starts without errors
- [ ] All four composers render with mock drafts
- [ ] Mock stream + approve/reject/revise works without an API key
- [ ] README documents run instructions
- [ ] PR includes ≥1 screenshot of the running UI
- [ ] PR includes ≥1 video of stream → review → approve/reject

## Constraints
- Model: Claude Sonnet 5 only (no Fable 5)
- Do not set up Cloudflare unless the owner asks
- Validation artifacts must be from the actual running app

## Validation
Capture screenshot + video from the running app and attach both to the PR. Not optional.
