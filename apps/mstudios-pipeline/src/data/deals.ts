/**
 * Mstudios account book.
 *
 * Rows come from the Notion Mstudios Leads table (Austin finds) plus the
 * documented New Braunfels brand-kit lead. Preview URLs are the Stage 4
 * Vercel pages that were actually published. Payment and contract fields
 * stay empty: no payment or signed contract is on file.
 */

import { MSTUDIO_BOOK } from "@/data/mstudios-book"

export type DealStage = "finder" | "brand" | "stage4" | "won"
export type DealFit = "low" | "medium" | "high" | "urgent"
export type DealVertical = "barber" | "lawn" | "cleaning" | "other"
export type WebsiteStatus = "none" | "dead" | "parked" | "live" | "unknown"
export type PaymentStatus = "none" | "link_ready" | "watching" | "paid" | "held"

export interface HistoryEvent {
  at: string
  kind: string
  detail: string
}

export interface Deal {
  id: string
  businessName: string
  city: string
  phone: string
  address: string
  problem: string
  seo: string
  owner: string | null
  stage: DealStage
  fit: DealFit
  fitScore: number
  vertical: DealVertical
  niche: string
  tags: string[]
  websiteStatus: WebsiteStatus
  listedWebsite: string | null
  previewUrl: string | null
  paymentStatus: PaymentStatus
  lastPayment: string | null
  contractUrl: string | null
  recordUrl: string | null
  sourceUrl: string | null
  rating: number | null
  reviews: number | null
  hours: string | null
  findBatch: string
  history: HistoryEvent[]
  createdAt: string
  updatedAt: string
}

export interface StageConfig {
  value: DealStage
  label: string
  dot: string
  badge: "info-light" | "warning-light" | "outline" | "success-light"
}

export const STAGES: StageConfig[] = [
  { value: "finder", label: "Finder", dot: "bg-sky-500", badge: "info-light" },
  {
    value: "brand",
    label: "Brand kit",
    dot: "bg-amber-500",
    badge: "warning-light",
  },
  {
    value: "stage4",
    label: "Stage 4",
    dot: "bg-violet-500",
    badge: "outline",
  },
  { value: "won", label: "Won", dot: "bg-emerald-500", badge: "success-light" },
]

export interface FitConfig {
  value: DealFit
  label: string
  badge: "success-light" | "info-light" | "warning-light" | "destructive-light"
}

export const FITS: FitConfig[] = [
  { value: "low", label: "Lower fit", badge: "success-light" },
  { value: "medium", label: "Mid fit", badge: "info-light" },
  { value: "high", label: "High fit", badge: "warning-light" },
  { value: "urgent", label: "Prime", badge: "destructive-light" },
]

export const WEBSITE_STATUSES: {
  value: WebsiteStatus
  label: string
  dot: string
  badge: "success-light" | "warning-light" | "destructive-light" | "outline" | "info-light"
}[] = [
  { value: "live", label: "Live", dot: "bg-emerald-500", badge: "success-light" },
  { value: "parked", label: "Parked", dot: "bg-amber-500", badge: "warning-light" },
  { value: "dead", label: "Dead", dot: "bg-rose-500", badge: "destructive-light" },
  { value: "none", label: "No site", dot: "bg-zinc-400", badge: "outline" },
  { value: "unknown", label: "Unknown", dot: "bg-sky-500", badge: "info-light" },
]

export interface VerticalConfig {
  value: DealVertical
  label: string
}

export const VERTICALS: VerticalConfig[] = [
  { value: "barber", label: "Barber" },
  { value: "lawn", label: "Lawn" },
  { value: "cleaning", label: "Cleaning" },
  { value: "other", label: "Other trade" },
]

export interface TeamMember {
  value: string
  label: string
  initials: string
  color: string
}

export const TEAM: TeamMember[] = [
  { value: "finder", label: "Finder", initials: "FN", color: "bg-sky-600" },
  { value: "brand", label: "Brand", initials: "BR", color: "bg-violet-600" },
  { value: "web", label: "Web Design", initials: "WD", color: "bg-emerald-600" },
  { value: "marquis", label: "Marquis", initials: "MJ", color: "bg-amber-600" },
]

export const TAG_LIBRARY = [
  "live",
  "parked",
  "dead",
  "none",
  "barber",
  "landscaping",
  "cleaning",
] as const

export function generateDeals(): Deal[] {
  return MSTUDIO_BOOK
}

export function getStageConfig(stage: DealStage): StageConfig {
  return STAGES.find((s) => s.value === stage) ?? STAGES[0]
}

export function getFitConfig(fit: DealFit): FitConfig {
  return FITS.find((p) => p.value === fit) ?? FITS[0]
}

export function getWebsiteStatusConfig(status: WebsiteStatus) {
  return WEBSITE_STATUSES.find((s) => s.value === status) ?? WEBSITE_STATUSES[4]
}

export function getVerticalConfig(vertical: DealVertical): VerticalConfig {
  return VERTICALS.find((c) => c.value === vertical) ?? VERTICALS[3]
}

export function getTeamMember(value: string | null): TeamMember | undefined {
  if (!value) return undefined
  return TEAM.find((member) => member.value === value)
}
