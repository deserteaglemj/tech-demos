export type CheckStatus = "pass" | "warn" | "fail" | "skip" | "info";

export type Finding = {
  id: string;
  system: "openrig" | "paperclip";
  label: string;
  status: CheckStatus;
  detail: string;
};

export const FINDINGS: Finding[] = [
  {
    id: "or-install",
    system: "openrig",
    label: "CLI install",
    status: "pass",
    detail: "@openrig/cli 0.6.6 installed to user prefix; `rig --version` → 0.6.6 (2620dea8).",
  },
  {
    id: "or-doctor",
    system: "openrig",
    label: "rig doctor",
    status: "pass",
    detail: "Node v22.14.0, tmux 3.5a, daemon/UI dist OK, port 7433 free. cmux optional WARN.",
  },
  {
    id: "or-daemon",
    system: "openrig",
    label: "Daemon",
    status: "pass",
    detail: "`rig daemon start --no-kernel` → /healthz ok on 127.0.0.1:7433.",
  },
  {
    id: "or-stub",
    system: "openrig",
    label: "Stub team",
    status: "pass",
    detail: "`rig up` stub-demo: seats `dev-impl@stub-demo` and `dev-qa@stub-demo` lifecycle=running.",
  },
  {
    id: "or-send",
    system: "openrig",
    label: "Message delivery",
    status: "pass",
    detail: "`rig send dev-impl@stub-demo` delivered; stub replied `acknowledged` in tmux capture.",
  },
  {
    id: "or-tests",
    system: "openrig",
    label: "Source tests",
    status: "pass",
    detail: "From checkout: `npm run test:workspaces` → 100 files / 867 tests passed.",
  },
  {
    id: "or-ui",
    system: "openrig",
    label: "Web UI",
    status: "info",
    detail: "Bundled UI present; daemon serves with `x-openrig-web-ui: off` by default. TUI is the supported surface.",
  },
  {
    id: "pc-engine",
    system: "paperclip",
    label: "Node engine",
    status: "warn",
    detail: "paperclipai@2026.1005.0 requires Node ≥ 24.11. Host default was 22.14; switched to 24.21 for CLI.",
  },
  {
    id: "pc-onboard",
    system: "paperclip",
    label: "Onboard",
    status: "pass",
    detail: "`npx paperclipai@latest onboard --yes` booted embedded Postgres + server on 127.0.0.1:3100.",
  },
  {
    id: "pc-health",
    system: "paperclip",
    label: "API health",
    status: "pass",
    detail: "/api/health → status ok, deploymentMode local_trusted, bootstrapStatus ready.",
  },
  {
    id: "pc-doctor",
    system: "paperclip",
    label: "paperclipai doctor",
    status: "pass",
    detail: "11 passed, 1 warning (port 3100 already in use by the onboarded instance).",
  },
  {
    id: "pc-llm",
    system: "paperclip",
    label: "LLM providers",
    status: "skip",
    detail: "No API keys in this sandbox. Doctor marks LLM as optional; no agent heartbeats exercised.",
  },
];

export const OPENRIG_COMMANDS = [
  "npm install -g @openrig/cli",
  "rig doctor",
  "rig daemon start --no-kernel",
  "rig up ./rig.yaml",
  "rig ps --nodes --rig stub-demo",
  "rig send dev-impl@stub-demo '…'",
];

export const PAPERCLIP_COMMANDS = [
  "# needs Node ≥ 24.11",
  "npx paperclipai@latest onboard --yes",
  "npx paperclipai@latest doctor",
  "# UI + API at http://127.0.0.1:3100",
];
