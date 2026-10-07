# AgentComposerUI Playground

Self-contained Bun demo of [`agentcomposerui`](https://www.npmjs.com/package/agentcomposerui) — human-in-the-loop composer cards for LinkedIn, X threads, email outreach, and GitHub PRs.

Public source (X bookmarks API was spend-capped at scout time):
https://dev.to/theajmalrazaq/i-built-agentcomposerui-ui-components-for-ai-agents-that-actually-need-human-approval-4g7a

## Run

```bash
cd apps/agentcomposerui-playground
bun install
bun run dev
```

Open the printed local URL (default `http://localhost:5173`).

## Demo flow

1. Pick a channel (LinkedIn / X Thread / Email / GitHub PR)
2. Click **Run mock agent** (no API key)
3. Edit the draft, then **Approve** or **Request changes**
4. Reject triggers a mock revision with updated copy

## Notes

- Mock-only HITL loop — no real LLM or publish APIs
- Optional real-LLM path: use schemas from `agentcomposerui/schemas` with your own tool-calling backend
