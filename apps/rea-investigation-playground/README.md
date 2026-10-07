# REA Investigation Playground

Interactive demo of [REA](https://github.com/morluto/rea) (Reverse Engineer Anything): walk Decompile → Understand → Recreate against a local JavaScript fixture using real `analyze_javascript_application` Evidence.

## Run

```bash
bun install && bun run dev
```

Open the printed local URL. Step through the investigation, inspect Evidence, and try the recreated offline search.

## What’s inside

- `fixture/` — Inkdesk mini-app under investigation
- `src/evidence.json` — compact Evidence summary from a real `rea-agents` analysis
- Guided UI for the agent-style investigation model (no Hopper/Ghidra required)

## Regenerate Evidence (optional)

```bash
npx -y rea-agents@latest analyze-javascript-application "$(pwd)/fixture" --format json
```
