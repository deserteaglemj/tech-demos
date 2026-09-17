/**
 * Mock support-ticket dataset for the ReUI admin slice demo.
 *
 * Everything here is deterministic (index-based cycling, no Math.random /
 * Date.now) so the grid, filters and kanban board render identically on
 * every load - handy for screenshots and for the fixed "now" the relative
 * timestamps are computed against.
 */

export type TicketStatus = "new" | "open" | "waiting" | "resolved"
export type TicketPriority = "low" | "medium" | "high" | "urgent"
export type TicketChannel = "email" | "chat" | "phone" | "social"

export interface Ticket {
  id: string
  subject: string
  requesterName: string
  requesterEmail: string
  company: string
  assignee: string | null
  status: TicketStatus
  priority: TicketPriority
  channel: TicketChannel
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface StatusConfig {
  value: TicketStatus
  label: string
  dot: string
  badge: "info-light" | "warning-light" | "outline" | "success-light"
}

export const STATUSES: StatusConfig[] = [
  { value: "new", label: "New", dot: "bg-sky-500", badge: "info-light" },
  {
    value: "open",
    label: "In Progress",
    dot: "bg-amber-500",
    badge: "warning-light",
  },
  {
    value: "waiting",
    label: "Waiting on Customer",
    dot: "bg-violet-500",
    badge: "outline",
  },
  {
    value: "resolved",
    label: "Resolved",
    dot: "bg-emerald-500",
    badge: "success-light",
  },
]

export interface PriorityConfig {
  value: TicketPriority
  label: string
  badge: "success-light" | "info-light" | "warning-light" | "destructive-light"
}

export const PRIORITIES: PriorityConfig[] = [
  { value: "low", label: "Low", badge: "success-light" },
  { value: "medium", label: "Medium", badge: "info-light" },
  { value: "high", label: "High", badge: "warning-light" },
  { value: "urgent", label: "Urgent", badge: "destructive-light" },
]

export interface ChannelConfig {
  value: TicketChannel
  label: string
}

export const CHANNELS: ChannelConfig[] = [
  { value: "email", label: "Email" },
  { value: "chat", label: "Live chat" },
  { value: "phone", label: "Phone" },
  { value: "social", label: "Social" },
]

export interface TeamMember {
  value: string
  label: string
  initials: string
  color: string
}

export const TEAM: TeamMember[] = [
  { value: "aisha", label: "Aisha Khan", initials: "AK", color: "bg-rose-500" },
  { value: "diego", label: "Diego Ramirez", initials: "DR", color: "bg-blue-500" },
  { value: "priya", label: "Priya Patel", initials: "PP", color: "bg-emerald-500" },
  { value: "noah", label: "Noah Becker", initials: "NB", color: "bg-amber-500" },
  { value: "sofia", label: "Sofia Rossi", initials: "SR", color: "bg-violet-500" },
  { value: "liam", label: "Liam O'Connor", initials: "LO", color: "bg-cyan-500" },
  { value: "mei", label: "Mei Tanaka", initials: "MT", color: "bg-pink-500" },
  { value: "omar", label: "Omar Haddad", initials: "OH", color: "bg-orange-500" },
]

export const TAG_LIBRARY = [
  "billing",
  "bug",
  "onboarding",
  "feature-request",
  "refund",
  "vip",
  "integration",
  "mobile",
  "performance",
  "security",
] as const

const SUBJECTS = [
  "Invoice shows duplicate line item",
  "Cannot reset password after SSO migration",
  "Feature request: bulk export to CSV",
  "App crashes on iOS 18 when uploading photos",
  "Webhook retries are not honoring backoff",
  "Need refund for accidental annual upgrade",
  "Dashboard widgets not loading past 10k rows",
  "API rate limit hit during nightly sync",
  "Onboarding checklist stuck at step 3",
  "Dark mode toggle resets on page refresh",
  "Team seats not syncing with billing portal",
  "Slack integration stopped posting alerts",
  "Requesting SOC2 report for security review",
  "Timezone shown incorrectly in weekly digest",
  "Cannot invite teammates with @company.eu domain",
  "Export button greyed out for viewer role",
  "Mobile app push notifications arrive twice",
  "Custom domain SSL certificate expired",
  "Search results missing recently added records",
  "Billing address update not reflected on invoice",
  "Zapier connector fails on large payloads",
  "Table filters reset when switching tabs",
  "Add support for SAML group mapping",
  "Latency spikes on the analytics endpoint",
  "Trial extension request for enterprise eval",
  "CSV import silently drops empty columns",
  "Two-factor auth codes arriving late",
  "Public API docs reference removed endpoint",
  "Kanban board drag handle unresponsive on trackpad",
  "Please merge duplicate customer records",
  "Report scheduler skipped this week's run",
  "Color contrast fails accessibility audit",
  "Need bulk role change for 40 seats",
  "Sandbox environment data not resetting nightly",
  "Currency symbol wrong for EU customers",
  "Session expires too quickly on shared devices",
]

const COMPANIES = [
  "Northwind Traders",
  "Globex",
  "Initech",
  "Umbrella Labs",
  "Stark Industries",
  "Wayne Enterprises",
  "Hooli",
  "Pied Piper",
  "Soylent Corp",
  "Aperture Science",
  "Wonka Industries",
  "Acme Co",
]

const FIRST_NAMES = [
  "Alex",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Riley",
  "Jamie",
  "Avery",
  "Quinn",
  "Rowan",
  "Elena",
  "Hassan",
]

const LAST_NAMES = [
  "Nguyen",
  "Garcia",
  "Smith",
  "Kowalski",
  "Ito",
  "Dubois",
  "Nilsson",
  "Okafor",
  "Silva",
  "Cohen",
  "Petrov",
  "Fischer",
]

function pad(n: number, width = 4): string {
  return String(n).padStart(width, "0")
}

/**
 * A small deterministic integer hash (no Math.random / Date.now, so the
 * dataset is identical on every load). `salt` decorrelates fields that would
 * otherwise share a linear relationship with `i` - e.g. status and priority
 * cycling with the same coefficient would make every "urgent" ticket land on
 * the same status.
 */
function hashIndex(i: number, salt: number, length: number): number {
  let x = (i * 2654435761 + salt * 40503) | 0
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b)
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b)
  x = (x ^ (x >>> 16)) >>> 0
  return x % length
}

/** Deterministic pseudo-random-looking cycling without Math.random. */
export function generateTickets(count = 56): Ticket[] {
  const now = new Date("2026-09-17T09:00:00Z")
  const tickets: Ticket[] = []

  for (let i = 0; i < count; i++) {
    const subject = SUBJECTS[i % SUBJECTS.length]
    const first = FIRST_NAMES[i % FIRST_NAMES.length]
    const last = LAST_NAMES[hashIndex(i, 1, LAST_NAMES.length)]
    const company = COMPANIES[hashIndex(i, 2, COMPANIES.length)]
    // Salts below were picked (see scripts/balance check) for a roughly
    // even split across 56 rows - a mock board should not accidentally
    // dump most tickets into one column or one assignee.
    const status = STATUSES[hashIndex(i, 9, STATUSES.length)].value
    const priority = PRIORITIES[hashIndex(i, 29, PRIORITIES.length)].value
    const channel = CHANNELS[hashIndex(i, 80, CHANNELS.length)].value
    // ~12% unassigned, spread deterministically rather than randomly.
    const assignee =
      hashIndex(i, 138, 8) === 0 ? null : TEAM[hashIndex(i, 32, TEAM.length)].value

    const tagCount = 1 + (i % 3)
    const tags = Array.from(
      new Set(
        Array.from({ length: tagCount }, (_, t) =>
          TAG_LIBRARY[hashIndex(i, 8 + t, TAG_LIBRARY.length)]
        )
      )
    )

    const createdOffsetHours = 6 + i * 9
    const updatedOffsetHours = Math.max(1, createdOffsetHours - (2 + (i % 5) * 4))
    const createdAt = new Date(now.getTime() - createdOffsetHours * 3_600_000)
    const updatedAt = new Date(now.getTime() - updatedOffsetHours * 3_600_000)

    tickets.push({
      id: `TCK-${pad(1000 + i)}`,
      subject,
      requesterName: `${first} ${last}`,
      requesterEmail: `${first.toLowerCase()}.${last.toLowerCase()}@${company
        .toLowerCase()
        .replace(/\s+/g, "")}.com`,
      company,
      assignee,
      status,
      priority,
      channel,
      tags,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    })
  }

  return tickets
}

export function getStatusConfig(status: TicketStatus): StatusConfig {
  return STATUSES.find((s) => s.value === status) ?? STATUSES[0]
}

export function getPriorityConfig(priority: TicketPriority): PriorityConfig {
  return PRIORITIES.find((p) => p.value === priority) ?? PRIORITIES[0]
}

export function getChannelConfig(channel: TicketChannel): ChannelConfig {
  return CHANNELS.find((c) => c.value === channel) ?? CHANNELS[0]
}

export function getTeamMember(value: string | null): TeamMember | undefined {
  if (!value) return undefined
  return TEAM.find((member) => member.value === value)
}
