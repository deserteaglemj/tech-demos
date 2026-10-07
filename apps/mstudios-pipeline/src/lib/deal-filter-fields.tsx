import type { FilterField } from "@/components/reui/filters/filters-types"
import {
  FITS,
  STAGES,
  TAG_LIBRARY,
  TEAM,
  VERTICALS,
  WEBSITE_STATUSES,
  type Deal,
} from "@/data/deals"

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

/** Field schema driving the toolbar `<Filters>` bar on the deals grid. */
export const dealFilterFields: FilterField[] = [
  {
    id: "businessName",
    label: "Business",
    type: "text",
    placeholder: "Search business...",
    keywords: ["name", "shop"],
  },
  {
    id: "stage",
    label: "Stage",
    type: "select",
    defaultOperator: "is_any_of",
    pinSelected: true,
    options: STAGES.map((s) => ({
      value: s.value,
      label: s.label,
      icon: dot(s.dot),
    })),
  },
  {
    id: "fit",
    label: "Fit",
    type: "select",
    defaultOperator: "is_any_of",
    pinSelected: true,
    options: FITS.map((p) => ({
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
    id: "websiteStatus",
    label: "Website",
    type: "select",
    defaultOperator: "is_any_of",
    pinSelected: true,
    options: WEBSITE_STATUSES.map((s) => ({
      value: s.value,
      label: s.label,
      icon: dot(s.dot),
    })),
  },
  {
    id: "vertical",
    label: "Vertical",
    type: "select",
    defaultOperator: "is_any_of",
    options: VERTICALS.map((c) => ({ value: c.value, label: c.label })),
  },
  {
    id: "owner",
    label: "Owner",
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

/**
 * Resolves a rule's field path. Owner "unassigned" matches a null owner,
 * same contract as the original ticket assignee filter.
 */
export function getDealFieldValue(deal: Deal, path: string[]): unknown {
  const key = path[0]
  if (key === "owner") return deal.owner ?? "unassigned"
  return (deal as unknown as Record<string, unknown>)[key]
}
