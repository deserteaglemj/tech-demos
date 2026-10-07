# Paperclip vs Grok Bot — **live** lab

No fake website. This app runs the **real products** on the cloud computer and documents who is using each.

## Run

```bash
cd apps/paperclip-vs-grok
bun install
bun run dev          # ensure Paperclip up + launch Grok Bot
bun run status       # health + who-uses pointers
```

- Paperclip UI: http://127.0.0.1:3100  
- Grok Bot: desktop window (sign in with your Cursor account)

## What we already did on this machine

1. Installed Paperclip CLI (`paperclipai` 2026.1005.0) and onboarded embedded Postgres  
2. Seeded **ClipNotes Demo Co** — goal, CEO/CTO/Engineer/Marketer, issues CLI-1…4  
3. Installed **Grok Bot 0.68.1** `.deb` and launched it  
4. Recorded live side-by-side video (Paperclip org/tasks + Grok Bot sign-in)

Grok Bot bot-list requires **your** OAuth. The agent cannot finish Cursor/Google sign-in without credentials.

## Who is using what

See [docs/WHO-USES.md](./docs/WHO-USES.md).

| Live Paperclip | Grok Bot (after you sign in) |
| --- | --- |
| BO Board + CEO, CTO, Engineer, Marketer | Account user + named Bots on one cloud PC |

## Install from scratch

```bash
# Paperclip (Node >= 24.11)
npx paperclipai install -y
paperclipai onboard --yes --no-install-service
paperclipai run   # :3100

# Grok Bot (Linux)
# Get current .deb from https://cursor.com/download/bot
sudo dpkg -i grok-bot_*_amd64.deb
grok-bot
```
