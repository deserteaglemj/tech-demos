/**
 * Mstudios prospect dataset for the ReUI admin slice.
 *
 * Same shape the Helpdesk Ops Console uses (status / priority / channel /
 * assignee / tags) so Data Grid, Filters, and Kanban behave identically.
 * Values are the postcard funnel: stage, fit, vertical, owner.
 *
 * Deterministic (index hash, no Math.random / Date.now).
 */

export type DealStage = "finder" | "brand" | "stage4" | "won"
export type DealFit = "low" | "medium" | "high" | "urgent"
export type DealVertical = "barber" | "lawn" | "cleaning" | "other"

export interface Deal {
  id: string
  businessName: string
  city: string
  phone: string
  problem: string
  owner: string | null
  stage: DealStage
  fit: DealFit
  vertical: DealVertical
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface StageConfig {
  value: DealStage
  label: string
  dot: string
  badge: "info-light" | "warning-light" | "outline" | "success-light"
}

/** Four columns, same board geometry as the ReUI ticket statuses. */
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
  { value: "low", label: "Fit 70s", badge: "success-light" },
  { value: "medium", label: "Fit 80s", badge: "info-light" },
  { value: "high", label: "Fit 90s", badge: "warning-light" },
  { value: "urgent", label: "Prime", badge: "destructive-light" },
]

export interface VerticalConfig {
  value: DealVertical
  label: string
}

export const VERTICALS: VerticalConfig[] = [
  { value: "barber", label: "Barber" },
  { value: "lawn", label: "Lawn" },
  { value: "cleaning", label: "Cleaning" },
  { value: "other", label: "Other" },
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
  "no-site",
  "dead-site",
  "parked",
  "preview-live",
  "kit-ready",
  "gated",
  "austin",
  "new-braunfels",
  "postcard",
  "phone-booking",
] as const

const BUSINESSES = [
  "Henrythebarber",
  "ATX Yardworks",
  "Farru Barber Studio",
  "Jesus Barber",
  "NBA Chris barber",
  "Mr. King Barbershop",
  "Rubi Cleaning",
  "Woo.blends",
  "Yasser Barber",
  "Hermanos Reyna Lawn Care",
  "Will's Lawn Care",
  "Barber Menor",
  "Rico's Cleaning",
  "Julio barber",
  "Demo Cuts ATX",
  "Rodriguez Barber",
  "Barber & Beauty Mobile",
  "Oak Hill Cuts",
  "Cedar Park Fade Co",
  "South Lamar Blends",
  "Round Rock Lawn Co",
  "Pflugerville Yards",
  "East Side Clean Co",
  "Mueller Maid Service",
  "Domain Barber Room",
  "Sunset Valley Greens",
  "Hyde Park Clippers",
  "Travis Heights Turf",
  "Barton Creek Clean",
  "North Loop Barbers",
  "Manor Lawn Crew",
  "Buda Blends",
  "Kyle Yard Service",
  "San Marcos Fades",
  "New Braunfels Clip Joint",
  "Gruene Lawn Care",
  "Canyon Lake Cleaners",
  "Comal Cuts",
  "Spring Branch Yards",
  "Alamo Heights Barber",
  "Stone Oak Clean Co",
  "Boerne Lawn & Edge",
  "Dripping Springs Fades",
  "Lakeway Turf Co",
  "Bee Cave Barbers",
  "Westlake Maid Co",
  "Georgetown Greens",
  "Hutto Fade Room",
  "Lockhart Yardworks",
  "Taylor Clean Team",
  "Elgin Barber Shop",
  "Bastrop Lawn Care",
  "Smithville Clippers",
  "Wimberley Yards",
  "Blanco Barber Co",
  "Fredericksburg Fades",
]

const CITIES = [
  "Austin, TX",
  "New Braunfels, TX",
  "San Antonio, TX",
  "Round Rock, TX",
  "Cedar Park, TX",
  "Pflugerville, TX",
  "Georgetown, TX",
  "Kyle, TX",
]

const PROBLEMS = [
  "No website — booking only through Instagram DMs.",
  "Listed site is dead (NXDOMAIN) — prime postcard candidate.",
  "Strong GBP photos, zero owned web presence.",
  "Walk-ins only; no booking page.",
  "Parked domain — confirm before brand kit.",
  "High review volume, no conversion site.",
  "Social-only presence; no owned domain.",
  "Service area unclear online.",
  "Hours missing from every public listing.",
  "Phone-only booking; preview ready for Stage 4.",
]

function pad(n: number, width = 4): string {
  return String(n).padStart(width, "0")
}

function hashIndex(i: number, salt: number, length: number): number {
  let x = (i * 2654435761 + salt * 40503) | 0
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b)
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b)
  x = (x ^ (x >>> 16)) >>> 0
  return x % length
}

/** Real shortlist rows, pinned so the board opens on recognizable accounts. */
const PINNED: Array<Omit<Deal, "createdAt" | "updatedAt">> = [
  {
    id: "MS-1000",
    businessName: "Henrythebarber",
    city: "Austin, TX",
    phone: "(512) 555-0142",
    problem: "No website — booking only through Instagram DMs.",
    owner: "web",
    stage: "stage4",
    fit: "high",
    vertical: "barber",
    tags: ["no-site", "preview-live", "austin"],
  },
  {
    id: "MS-1001",
    businessName: "ATX Yardworks",
    city: "Austin, TX",
    phone: "(512) 555-0198",
    problem: "Strong GBP photos, zero owned web presence.",
    owner: "web",
    stage: "stage4",
    fit: "high",
    vertical: "lawn",
    tags: ["no-site", "preview-live", "austin"],
  },
  {
    id: "MS-1002",
    businessName: "Farru Barber Studio",
    city: "Austin, TX",
    phone: "(512) 555-0110",
    problem: "Walk-ins only; no booking page.",
    owner: "web",
    stage: "stage4",
    fit: "high",
    vertical: "barber",
    tags: ["no-site", "preview-live", "austin"],
  },
  {
    id: "MS-1003",
    businessName: "Woo.blends",
    city: "Austin, TX",
    phone: "(512) 555-0121",
    problem: "Trendy brand, kit ready for the fixed template.",
    owner: "brand",
    stage: "brand",
    fit: "high",
    vertical: "barber",
    tags: ["kit-ready", "no-site", "austin"],
  },
  {
    id: "MS-1004",
    businessName: "Yasser Barber",
    city: "Austin, TX",
    phone: "(512) 555-0144",
    problem: "Gold accent brand; needs owned site.",
    owner: "brand",
    stage: "brand",
    fit: "medium",
    vertical: "barber",
    tags: ["kit-ready", "austin"],
  },
  {
    id: "MS-1005",
    businessName: "Will's Lawn Care",
    city: "New Braunfels, TX",
    phone: "(210) 630-0063",
    problem: "Listed site is dead (NXDOMAIN) — prime postcard candidate.",
    owner: "brand",
    stage: "brand",
    fit: "urgent",
    vertical: "lawn",
    tags: ["dead-site", "gated", "new-braunfels", "phone-booking"],
  },
  {
    id: "MS-1006",
    businessName: "Barber Menor",
    city: "Austin, TX",
    phone: "(512) 555-0155",
    problem: "Solid reviews; no site.",
    owner: "finder",
    stage: "finder",
    fit: "medium",
    vertical: "barber",
    tags: ["no-site", "austin"],
  },
  {
    id: "MS-1007",
    businessName: "Rico's Cleaning",
    city: "Austin, TX",
    phone: "(512) 555-0102",
    problem: "Service area unclear online.",
    owner: "finder",
    stage: "finder",
    fit: "medium",
    vertical: "cleaning",
    tags: ["no-site", "austin"],
  },
  {
    id: "MS-1008",
    businessName: "Julio barber",
    city: "Austin, TX",
    phone: "(512) 555-0199",
    problem: "Parked domain — confirm before brand kit.",
    owner: "marquis",
    stage: "finder",
    fit: "low",
    vertical: "barber",
    tags: ["parked", "austin"],
  },
  {
    id: "MS-1009",
    businessName: "Demo Cuts ATX",
    city: "Austin, TX",
    phone: "(512) 555-0001",
    problem: "Paid — preview bar removed, owner notified.",
    owner: "marquis",
    stage: "won",
    fit: "urgent",
    vertical: "barber",
    tags: ["postcard", "preview-live", "austin"],
  },
  {
    id: "MS-1010",
    businessName: "Mr. King Barbershop",
    city: "Austin, TX",
    phone: "(512) 555-0166",
    problem: "High review volume, no conversion site.",
    owner: "web",
    stage: "stage4",
    fit: "high",
    vertical: "barber",
    tags: ["preview-live", "no-site", "austin"],
  },
  {
    id: "MS-1011",
    businessName: "Hermanos Reyna Lawn Care",
    city: "Austin, TX",
    phone: "(512) 555-0190",
    problem: "Crew-ready business with a dead online footprint.",
    owner: "web",
    stage: "stage4",
    fit: "high",
    vertical: "lawn",
    tags: ["preview-live", "dead-site", "austin"],
  },
]

export function generateDeals(count = 56): Deal[] {
  const now = new Date("2026-10-07T16:00:00Z")
  const deals: Deal[] = []

  const stamp = (i: number) => {
    const createdOffsetHours = 6 + i * 9
    const updatedOffsetHours = Math.max(1, createdOffsetHours - (2 + (i % 5) * 4))
    return {
      createdAt: new Date(now.getTime() - createdOffsetHours * 3_600_000).toISOString(),
      updatedAt: new Date(now.getTime() - updatedOffsetHours * 3_600_000).toISOString(),
    }
  }

  const usedNames = new Set<string>()
  PINNED.forEach((row, i) => {
    usedNames.add(row.businessName)
    deals.push({ ...row, ...stamp(i) })
  })

  for (let n = deals.length; n < count; n++) {
    const i = n
    let businessName = BUSINESSES[hashIndex(i, 4, BUSINESSES.length)]
    let salt = 5
    while (usedNames.has(businessName) && salt < 48) {
      businessName = BUSINESSES[hashIndex(i, salt, BUSINESSES.length)]
      salt += 1
    }
    if (usedNames.has(businessName)) {
      businessName = `${businessName} ${CITIES[hashIndex(i, salt, CITIES.length)].split(",")[0]}`
    }
    usedNames.add(businessName)
    const city = CITIES[hashIndex(i, 7, CITIES.length)]
    const stage = STAGES[hashIndex(i, 9, STAGES.length)].value
    const fit = FITS[hashIndex(i, 29, FITS.length)].value
    const vertical = VERTICALS[hashIndex(i, 80, VERTICALS.length)].value
    const owner =
      hashIndex(i, 138, 8) === 0 ? null : TEAM[hashIndex(i, 32, TEAM.length)].value
    const problem = PROBLEMS[hashIndex(i, 11, PROBLEMS.length)]
    const tagCount = 1 + (i % 3)
    const tags = Array.from(
      new Set(
        Array.from({ length: tagCount }, (_, t) =>
          TAG_LIBRARY[hashIndex(i, 8 + t, TAG_LIBRARY.length)]
        )
      )
    )
    deals.push({
      id: `MS-${pad(1000 + i)}`,
      businessName,
      city,
      phone: `(512) 555-${String(1000 + (i % 9000)).slice(-4)}`,
      problem,
      owner,
      stage,
      fit,
      vertical,
      tags,
      ...stamp(i),
    })
  }

  return deals
}

export function getStageConfig(stage: DealStage): StageConfig {
  return STAGES.find((s) => s.value === stage) ?? STAGES[0]
}

export function getFitConfig(fit: DealFit): FitConfig {
  return FITS.find((p) => p.value === fit) ?? FITS[0]
}

export function getVerticalConfig(vertical: DealVertical): VerticalConfig {
  return VERTICALS.find((c) => c.value === vertical) ?? VERTICALS[0]
}

export function getTeamMember(value: string | null): TeamMember | undefined {
  if (!value) return undefined
  return TEAM.find((member) => member.value === value)
}
