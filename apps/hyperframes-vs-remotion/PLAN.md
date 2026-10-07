# PLAN — hyperframes-vs-remotion

## Goal
Same-prompt agent bake-off: one brief guided by HyperFrames patterns vs the same brief guided by Remotion patterns, then rate both outputs and declare a verdict.

## Source
- Tech: HyperFrames (HeyGen) — https://github.com/heygen-com/hyperframes
- Foil: Remotion — https://www.remotion.dev
- Method: identical user prompt; different framework “guides”

## MVP scope (in)
- One shared prompt (product launch sting for “Lumen Desk”)
- Output A: HyperFrames HTML + GSAP composition (agent-style HyperFrames guide)
- Output B: Remotion React composition (agent-style Remotion guide)
- Demo UI: show the prompt → play both outputs → scorecards → verdict
- CLI smoke: `bun run lint:hf` + `bun run render:hf`
- README with run instructions

## Out of scope
- Live multi-agent orchestration / skills install in the browser
- Cloud/Lambda render, audio beds, multi-minute explainers

## Stack
- Bun + Vite + React + TypeScript
- `hyperframes` + `@hyperframes/player`
- `remotion` + `@remotion/player`
- Run: `cd apps/hyperframes-vs-remotion && bun install && bun run dev`

## File sketch
- `PROMPT.md` — exact shared prompt + guide notes
- `public/hyperframes/index.html` — HyperFrames output
- `src/remotion/LumenDesk.tsx` — Remotion output
- `src/bakeoff.ts` — ratings + verdict data
- `src/App.tsx` — prompt / outputs / scores / verdict studio

## Acceptance criteria
- [ ] Demo shows the exact shared prompt
- [ ] Both framework outputs play the Lumen Desk sting
- [ ] Scorecards + verdict are visible
- [ ] `bun install && bun run dev` works; `bun run render:hf` produces MP4
- [ ] PR includes ≥1 screenshot and ≥1 video

## Validation
Screenshot + video of prompt → dual outputs → ratings/verdict. Not optional.
