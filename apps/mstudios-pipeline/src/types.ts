export type PipelineStage =
  | "finder"
  | "brand"
  | "stage4"
  | "payment"
  | "postcard"
  | "mail"
  | "won"
  | "held"
  | "blocked"

export type Vertical = "barber" | "lawn" | "cleaning" | "other"

export type OwnerRole = "Finder" | "Brand" | "Web Design" | "Marquis" | "Unassigned"

export type PaymentStatus = "none" | "link_ready" | "watching" | "paid" | "unknown"

export type SiteStatus = "none" | "dead" | "parked" | "live_weak" | "missing"

export type CityId = "austin" | "new_braunfels" | "san_antonio"

export interface BrandKit {
  primary: string
  secondary: string
  accent: string
  logoUrl?: string
  notes?: string
}

export interface ActivityEntry {
  id: string
  at: string
  actor: OwnerRole | "System"
  message: string
}

export interface Deal {
  id: string
  businessName: string
  vertical: Vertical
  city: CityId
  phone: string
  address: string
  listedSite: string
  siteStatus: SiteStatus
  fitScore: number
  findBatch: string
  stage: PipelineStage
  owner: OwnerRole
  problem: string
  brandKit?: BrandKit
  previewUrl?: string
  paymentLink?: string
  paymentStatus: PaymentStatus
  postcardReady: boolean
  monthlyPrice: number
  oneTimePrice: number
  blockedReason?: string
  heldReason?: string
  nextAction: string
  notes: string
  activity: ActivityEntry[]
  updatedAt: string
  createdAt: string
}

export interface CityGate {
  city: CityId
  label: string
  /** Allow Stage 4 site builds */
  stage4Open: boolean
  /** Allow payment / postcard / mail */
  mailOpen: boolean
  note: string
}

export interface WorkspaceState {
  version: 1
  deals: Deal[]
  gates: CityGate[]
  selectedDealId: string | null
}

export type AppView = "command" | "board" | "table"
