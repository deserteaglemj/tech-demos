# Diagram Design — tool-usage demo

This is **not** a gallery clone. It shows how you’d actually use [Diagram Design](https://github.com/cathrynlavery/diagram-design) with a Cursor agent.

## What happened

1. Installed the skill: `npx skills add cathrynlavery/diagram-design --copy`
2. Gave a Cursor agent the prompt in [`PROMPT.md`](./PROMPT.md)
3. The agent followed `.agents/skills/diagram-design/SKILL.md` and wrote [`output/tech-demo-pipeline.html`](./output/tech-demo-pipeline.html)
4. Session notes: [`SESSION.md`](./SESSION.md)

## View the artifact

```bash
bun install
bun run dev
```

Open the printed URL — you’ll see the prompt and the generated diagram.

Or open the HTML directly:

```bash
open output/tech-demo-pipeline.html
```

## Re-run

```bash
npx skills add cathrynlavery/diagram-design --copy
# Ask Cursor (or another Agent Skills host) the contents of PROMPT.md
```

## Source

- https://github.com/cathrynlavery/diagram-design
- https://diagramdesign.dev
