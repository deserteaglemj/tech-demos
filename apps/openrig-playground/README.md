# openrig-playground — live OpenRig vs Paperclip

This folder documents a **live** comparison of the upstream products. There is no custom web app here.

## OpenRig (real)

```bash
npm install -g @openrig/cli   # Node 22/24 + tmux
rig config set ui.enabled true
rig daemon start --no-kernel
# optional stub team without Claude/Codex:
#   rig up /path/to/stub-rig.yaml
# UI: http://127.0.0.1:7433/
```

## Paperclip (real)

```bash
# Node ≥ 24.11 required
npx paperclipai@latest onboard --yes
# UI: http://127.0.0.1:3100/
```

## What we compared by using both

| | OpenRig | Paperclip |
|---|---|---|
| Feel | Local operator station: topology, seats, library of rig specs | Company OS: agents, tasks, projects, connectors, skills |
| Runtime | Daemon + tmux seats (stub / Claude / Codex) | Node server + embedded Postgres + heartbeats |
| Surface | CLI/TUI primary; web UI optional (`ui.enabled`) | React dashboard primary |
