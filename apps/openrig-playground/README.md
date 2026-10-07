# openrig-playground

Install / test / demo notes for [OpenRig](https://github.com/mvschwarz/openrig), compared with [Paperclip](https://github.com/paperclipai/paperclip).

## Run

```bash
cd apps/openrig-playground
bun install
bun run dev
```

## What this shows

- Metaphor and axis comparison (rig vs company control plane)
- Interactive stub-team board shaped like a real `rig up` of stub seats
- Evidence from this sandbox: `rig doctor`, daemon health, stub send/capture, OpenRig unit tests, Paperclip onboard + doctor

## Upstream quick refs

OpenRig:

```bash
npm install -g @openrig/cli
rig doctor
rig daemon start --no-kernel
```

Paperclip (Node ≥ 24.11):

```bash
npx paperclipai@latest onboard --yes
npx paperclipai@latest doctor
```
