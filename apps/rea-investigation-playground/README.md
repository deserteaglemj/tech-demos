# REA Investigation Playground

Interactive demo of [REA](https://github.com/morluto/rea) (Reverse Engineer Anything): walk Decompile → Understand → Recreate against a local JavaScript fixture using real `analyze_javascript_application` Evidence.

## Run

```bash
bun install && bun run dev
```

Open the printed local URL. Step through the investigation, inspect Evidence, and try the recreated offline search.

## What’s inside

- `#m-studios` (default) — M Studios page with brand-board preview toggles adapted from Resend’s view/appearance switches (recovered with REA CDP tools)
- `#lab` — Inkdesk JS fixture investigation (Decompile → Understand → Recreate)
- `fixture/` — Inkdesk mini-app under investigation
- `src/evidence.json` / `src/resendEvidence.json` — Evidence summaries from real `rea-agents` runs

## Regenerate Evidence (optional)

```bash
npx -y rea-agents@latest analyze-javascript-application "$(pwd)/fixture" --format json
```
