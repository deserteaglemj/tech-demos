export type ScenarioId = 'notes-mrr' | 'support-desk' | 'ship-feature'

export interface Scenario {
  id: ScenarioId
  title: string
  goal: string
  paperclipBrief: string
  grokBrief: string
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'notes-mrr',
    title: 'Note app → $1M MRR',
    goal: 'Build the #1 AI note-taking app to $1M MRR.',
    paperclipBrief:
      'Hire a CEO, CTO, engineer, and marketer. Paperclip tickets, budgets, and heartbeats keep the company moving without twenty open terminals.',
    grokBrief:
      'Spin up one always-on Grok Bot on a shared cloud computer. Chat it a job; it browses, edits files, and asks before risky actions.',
  },
  {
    id: 'support-desk',
    title: '24/7 support desk',
    goal: 'Answer product tickets within 15 minutes, escalate billing, never invent refunds.',
    paperclipBrief:
      'Org roles + routines: a support agent on a heartbeat, a finance agent with a hard budget, board approval for refunds.',
    grokBrief:
      'One Bot with connectors and Ask-first rules. Fast to start; all Bots on the account share the same cloud computer.',
  },
  {
    id: 'ship-feature',
    title: 'Ship a feature tonight',
    goal: 'Implement dark mode, open a PR, write release notes.',
    paperclipBrief:
      'Assign an engineer adapter (Claude Code / Codex / Cursor). Goal ancestry rides with the ticket; you review the product of work.',
    grokBrief:
      'Message the Bot: “ship dark mode.” It uses its cloud shell and browser while your laptop sleeps — vendor owns the loop.',
  },
]

export interface CompareRow {
  dimension: string
  paperclip: string
  grok: string
}

export const COMPARE_ROWS: CompareRow[] = [
  {
    dimension: 'What it is',
    paperclip: 'Self-hosted control plane for a company of agents',
    grok: 'Managed always-on worker with a cloud computer',
  },
  {
    dimension: 'Unit of work',
    paperclip: 'Jobs / tickets tied to goals & org roles',
    grok: 'Chat jobs to a named Bot',
  },
  {
    dimension: 'Scale model',
    paperclip: 'Many agents, adapters, heartbeats, org chart',
    grok: '1–6 Bots; shared machine & credentials',
  },
  {
    dimension: 'Cost control',
    paperclip: 'Per-agent budgets with hard stops',
    grok: 'Account / seat allowance (+ overage)',
  },
  {
    dimension: 'Governance',
    paperclip: 'Board approvals, pause/terminate, audit log',
    grok: 'Ask-first rules; Enterprise Auto Review',
  },
  {
    dimension: 'Host model',
    paperclip: 'You run it (local or VPS); BYO agent runtimes',
    grok: 'xAI hosts the computer, tools, and loop',
  },
  {
    dimension: 'Best when',
    paperclip: 'You coordinate many agents toward a company goal',
    grok: 'You need one durable cloud worker tonight',
  },
]

export const INSTALL_STEPS = [
  {
    title: 'Install CLI',
    command:
      'curl -fsSL https://paperclip.ing/install.sh | bash -s -- --no-prompt --no-onboard',
  },
  {
    title: 'Onboard (embedded Postgres + UI)',
    command: 'paperclipai onboard --yes',
  },
  {
    title: 'Open dashboard',
    command: 'open http://localhost:3100  # or: paperclipai run',
  },
]

export interface PaperclipRole {
  id: string
  title: string
  adapter: string
  budget: number
}

export const PAPERCLIP_ROSTER: PaperclipRole[] = [
  { id: 'ceo', title: 'CEO', adapter: 'claude_local', budget: 80 },
  { id: 'cto', title: 'CTO', adapter: 'codex_local', budget: 120 },
  { id: 'eng', title: 'Engineer', adapter: 'cursor', budget: 200 },
  { id: 'mkt', title: 'Marketer', adapter: 'http/openclaw', budget: 60 },
]

export const GROK_TOOLS = [
  'Browser',
  'Files',
  'Terminal',
  'Connectors',
  'Ask-first gate',
] as const
