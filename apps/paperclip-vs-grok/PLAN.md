# PLAN — paperclip-vs-grok

## Goal
Install Paperclip and ship an interactive side-by-side demo that compares running a multi-agent **company** (Paperclip) vs a single managed **always-on bot** (Grok Bot).

## Source
- Tech: Paperclip — https://github.com/paperclipai/paperclip
- Docs: https://docs.paperclip.ing
- Compare-to: Grok Bot (xAI managed always-on agent)

## MVP scope (in)
- Local install attempt via official `paperclipai` / install script (document result in README)
- Bun + Vite + React comparison lab:
  - Shared scenario (one company goal)
  - **Paperclip lane**: org chart hire → goal → budgets → heartbeats → tickets
  - **Grok Bot lane**: named bot chat → cloud tools → ask-first approvals → shared computer note
  - Dimension matrix (control plane vs harness, multi-agent vs single, budgets, host model)
- README with install + `bun install && bun run dev`

## Out of scope
- Full Paperclip server embedded in this app
- Real Grok Bot / xAI API calls
- Multi-user auth, production deploy of Paperclip itself

## Stack
- Bun + Vite + React (demo UI)
- Optional: `npx paperclipai onboard --yes` for real control-plane install
- Run: `cd apps/paperclip-vs-grok && bun install && bun run dev`

## File sketch
- `PLAN.md`, `README.md`, `package.json`, Vite/TS configs
- `src/App.tsx` — composition + scenario switch
- `src/components/PaperclipPanel.tsx` — company sim
- `src/components/GrokBotPanel.tsx` — bot sim
- `src/components/CompareMatrix.tsx` — dimensions
- `src/data/compare.ts` — facts / copy
- `src/index.css` — visual system

## Acceptance criteria
- [ ] `bun install && bun run dev` works
- [ ] Both lanes play through one shared scenario interactively
- [ ] Matrix makes Paperclip vs Grok Bot difference clear in one sitting
- [ ] README documents Paperclip install commands + demo run
- [ ] PR includes ≥1 screenshot and ≥1 video of the running app

## Validation
Screenshot + video of the running comparison lab in the PR. Not optional.
