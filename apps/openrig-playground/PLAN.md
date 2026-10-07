# PLAN — openrig-playground (live upstream demos)

## Goal
Run the real OpenRig and Paperclip products on this machine and compare them by using their UIs — not by building a comparison website.

## Source
- OpenRig: https://github.com/mvschwarz/openrig (`@openrig/cli` 0.6.6)
- Paperclip: https://github.com/paperclipai/paperclip (`paperclipai` 2026.1005.0)

## MVP scope (in)
- Install and start OpenRig daemon + enable web UI (`rig config set ui.enabled true`)
- Launch stub-demo seats (no provider auth)
- Install/onboard Paperclip (`npx paperclipai@latest onboard --yes`, Node ≥ 24.11)
- Navigate both real UIs; capture screenshots + videos of actual product use

## Out of scope
- Custom comparison website / playground app
- Authenticated Claude Code / Codex / LLM agent heartbeats (no API keys in sandbox)

## Stack
Upstream CLIs only. No Bun app in this folder.

## Acceptance criteria
- [x] OpenRig UI reachable at http://127.0.0.1:7433/
- [x] Paperclip UI reachable at http://127.0.0.1:3100/
- [x] Manual navigation of both UIs recorded
- [x] PR includes ≥1 screenshot and ≥1 video of each real product

## Validation
See PR artifacts: openrig-real-ui-demo, paperclip-real-ui-demo, openrig-and-paperclip-switch.
