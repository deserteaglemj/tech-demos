# PLAN — diagram-design-playground

## Goal
Prove [Diagram Design](https://github.com/cathrynlavery/diagram-design) the way an owner would use it: install the skill, give an AI agent a real prompt, ship the real HTML/SVG it produced.

## Source
- https://github.com/cathrynlavery/diagram-design
- Site: https://diagramdesign.dev

## Demo kind
`tool-usage` — not an app playground / gallery clone.

## MVP scope (in)
- Install the skill via `npx skills add cathrynlavery/diagram-design` into this app
- Record the exact agent prompt in `PROMPT.md`
- Have a Cursor agent follow the skill and write `output/tech-demo-pipeline.html`
- Log the session (`SESSION.md`: refs loaded, style-guide choice, plan)
- Tiny static viewer: `bun install && bun run dev` serves the prompt + output
- PR validation: screenshot + video of the real diagram (and/or the usage path)

## Out of scope
- Rebuilding the upstream gallery
- React playground that fakes the skill’s types
- Full 44-type catalog

## Stack / install
```bash
cd apps/diagram-design-playground
npx skills add cathrynlavery/diagram-design --copy
# then ask a Cursor agent the prompt in PROMPT.md
bun install && bun run dev   # view output locally
```

## File sketch
- `PROMPT.md` — exact prompt
- `SESSION.md` — agent session log
- `output/tech-demo-pipeline.html` — real artifact
- `.agents/skills/diagram-design/` — installed skill (assets/ gitignored)
- `package.json` + `server.ts` — static viewer
- `README.md`, this `PLAN.md`

## Acceptance criteria
- [ ] Skill installed from upstream
- [ ] Real prompt → real diagram via the skill (not hand-faked)
- [ ] `self_check.py` passes on the HTML
- [ ] `bun run dev` shows the output
- [ ] PR has ≥1 screenshot and ≥1 video

## Validation
Screenshot + video of the real diagram / usage path. Not optional.
