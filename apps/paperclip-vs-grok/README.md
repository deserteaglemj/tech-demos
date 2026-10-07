# Paperclip vs Grok Bot

Interactive comparison lab: **Paperclip** (self-hosted control plane for a company of AI agents) vs **Grok Bot** (managed always-on cloud worker).

Source: [paperclipai/paperclip](https://github.com/paperclipai/paperclip)

## Demo UI

```bash
cd apps/paperclip-vs-grok
bun install
bun run dev
```

Open the Vite URL (default `http://localhost:5173`). Pick a shared scenario, play the Paperclip lane (hire → budgets → goal → heartbeats) and the Grok Bot lane (name → job → tools → ask-first).

## Install real Paperclip

Requires **Node.js ≥ 24.11**.

```bash
# Managed CLI
curl -fsSL https://paperclip.ing/install.sh | bash -s -- --no-prompt --no-onboard
# or: npx paperclipai install -y

paperclipai onboard --yes --no-install-service
# UI + API at http://127.0.0.1:3100
```

Later starts:

```bash
paperclipai run
```

Verified in this environment (Node 24.21): `paperclipai install -y` → `paperclipai onboard --yes` → server healthy at `http://127.0.0.1:3100/api/health`, then seeded a company + goal + CEO agent via CLI.

## Mental model

| | Paperclip | Grok Bot |
| --- | --- | --- |
| Role | Company / control plane | Employee / harness |
| Unit | Tickets + org roles + goals | Chat jobs to a named Bot |
| Cost | Per-agent budgets / hard stops | Account or seat allowance |
| Host | You (local/VPS), BYO adapters | xAI cloud computer |

They can coexist: Paperclip orchestrates many adapters; a Grok-class agent can be one hire in the org chart.
