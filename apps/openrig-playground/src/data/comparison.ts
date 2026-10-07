export type Axis = {
  id: string;
  label: string;
  openrig: string;
  paperclip: string;
};

export const METAPHOR = {
  openrig: {
    title: "OpenRig",
    tag: "A rig wraps your harnesses",
    line: "YAML team topology → local daemon → tmux seats for Claude Code, Codex, Pi, stubs.",
  },
  paperclip: {
    title: "Paperclip",
    tag: "If OpenClaw is an employee, Paperclip is the company",
    line: "Org charts, goals, budgets, heartbeats, and a React control plane over many adapters.",
  },
};

export const AXES: Axis[] = [
  {
    id: "job",
    label: "Job to be done",
    openrig: "Turn coding agents into a persistent, addressable team on your machine.",
    paperclip: "Run a company made of agents: goals, org, governance, cost, routines.",
  },
  {
    id: "runtime",
    label: "Runtime model",
    openrig: "Local daemon (SQLite) + tmux sessions; agents stay unmodified harness CLIs.",
    paperclip: "Node server + embedded Postgres; heartbeat queue invokes adapters.",
  },
  {
    id: "surface",
    label: "Primary surface",
    openrig: "`rig` CLI + TUI (web UI maintenance-mode / off by default).",
    paperclip: "React dashboard UI + rich `paperclipai` CLI / API.",
  },
  {
    id: "adapters",
    label: "Agent adapters",
    openrig: "Claude Code, Codex, Pi/OMP, terminal, stub (focused coding harnesses).",
    paperclip: "Claude, Codex, Cursor(+Cloud), Gemini, OpenCode, OpenClaw, Hermes, Grok, Kimi, HTTP…",
  },
  {
    id: "coord",
    label: "Coordination",
    openrig: "Pods, seats, edges, durable queue, message send, scopes, skills, restore.",
    paperclip: "Issues with atomic checkout, org reporting lines, approvals, budgets, routines.",
  },
  {
    id: "install",
    label: "Install bar",
    openrig: "Node 22/24 + tmux; `npm i -g @openrig/cli` then `rig setup` / `rig up`.",
    paperclip: "Node ≥ 24.11; `npx paperclipai@latest onboard --yes` (embedded Postgres).",
  },
  {
    id: "when",
    label: "Pick when…",
    openrig: "You already live in Claude/Codex terminals and want one addressable team per repo.",
    paperclip: "You want a company OS: goals, cost, governance, and a dashboard for mixed agents.",
  },
];

export type Verdict = {
  pick: "openrig" | "paperclip" | "either";
  title: string;
  body: string;
};

export const VERDICTS: Verdict[] = [
  {
    pick: "openrig",
    title: "Stay in the terminal",
    body: "You want Claude Code and Codex as seats in one YAML rig, with tmux restore and a TUI.",
  },
  {
    pick: "paperclip",
    title: "Run the company",
    body: "You need org charts, budgets, approval gates, and a shared issue board across many harnesses.",
  },
  {
    pick: "either",
    title: "Both can coexist",
    body: "OpenRig coordinates coding seats locally; Paperclip can still be the company layer that assigns goals.",
  },
];
