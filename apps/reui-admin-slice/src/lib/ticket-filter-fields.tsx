import type { FilterField } from "@/components/reui/filters/filters-types"
import {
  CHANNELS,
  PRIORITIES,
  STATUSES,
  TAG_LIBRARY,
  TEAM,
  type Ticket,
} from "@/data/tickets"

function dot(className: string) {
  return <span className={`size-2 shrink-0 rounded-full ${className}`} />
}

function initialsSwatch(initials: string, color: string) {
  return (
    <span
      className={`flex size-4 shrink-0 items-center justify-center rounded-full ${color} text-[8px] font-semibold text-white`}
    >
      {initials}
    </span>
  )
}

/** Field schema driving the toolbar `<Filters>` bar on the tickets grid. */
export const ticketFilterFields: FilterField[] = [
  {
    id: "subject",
    label: "Subject",
    type: "text",
    placeholder: "Search subject...",
    keywords: ["title", "summary"],
  },
  {
    id: "status",
    label: "Status",
    type: "select",
    defaultOperator: "is_any_of",
    pinSelected: true,
    options: STATUSES.map((s) => ({
      value: s.value,
      label: s.label,
      icon: dot(s.dot),
    })),
  },
  {
    id: "priority",
    label: "Priority",
    type: "select",
    defaultOperator: "is_any_of",
    pinSelected: true,
    options: PRIORITIES.map((p) => ({
      value: p.value,
      label: p.label,
      icon: dot(
        p.value === "low"
          ? "bg-emerald-500"
          : p.value === "medium"
            ? "bg-sky-500"
            : p.value === "high"
              ? "bg-amber-500"
              : "bg-rose-500"
      ),
    })),
  },
  {
    id: "channel",
    label: "Channel",
    type: "select",
    defaultOperator: "is_any_of",
    options: CHANNELS.map((c) => ({ value: c.value, label: c.label })),
  },
  {
    id: "assignee",
    label: "Assignee",
    type: "select",
    defaultOperator: "is_any_of",
    pinSelected: true,
    sortSelected: "label",
    options: [
      ...TEAM.map((member) => ({
        value: member.value,
        label: member.label,
        icon: initialsSwatch(member.initials, member.color),
      })),
      { value: "unassigned", label: "Unassigned", exclusive: true },
    ],
  },
  {
    id: "tags",
    label: "Tags",
    type: "multiselect",
    defaultOperator: "has_any_of",
    pinSelected: true,
    sortSelected: "label",
    options: TAG_LIBRARY.map((tag) => ({ value: tag, label: tag })),
  },
]

/** Resolves a rule's field path to the raw value on a ticket record. */
export function getTicketFieldValue(ticket: Ticket, path: string[]): unknown {
  return (ticket as unknown as Record<string, unknown>)[path[0]]
}
