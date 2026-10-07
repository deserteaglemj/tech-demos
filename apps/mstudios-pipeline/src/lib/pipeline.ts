import type {
  CityGate,
  CityId,
  Deal,
  PipelineStage,
} from "@/types"

export const PIPELINE_STAGES: PipelineStage[] = [
  "finder",
  "brand",
  "stage4",
  "payment",
  "postcard",
  "mail",
  "won",
]

export const TERMINAL_STAGES: PipelineStage[] = ["held", "blocked", "won"]

export const STAGE_META: Record<
  PipelineStage,
  { label: string; short: string; description: string }
> = {
  finder: {
    label: "Finder",
    short: "1",
    description: "Scored prospect from Maps / public data",
  },
  brand: {
    label: "Brand kit",
    short: "3.5",
    description: "Lean kit from public sources (literal HEX)",
  },
  stage4: {
    label: "Stage 4",
    short: "4",
    description: "Fixed-template preview on Vercel",
  },
  payment: {
    label: "Payment",
    short: "5",
    description: "Unique Payment Link + morning watch",
  },
  postcard: {
    label: "Postcard",
    short: "6",
    description: "Phone screenshot + QR / pay copy",
  },
  mail: {
    label: "Print / mail",
    short: "7",
    description: "Vendor send with Marquis postage approval",
  },
  won: {
    label: "Won",
    short: "✓",
    description: "Paid — preview bar removed, owner notified",
  },
  held: {
    label: "Held",
    short: "⏸",
    description: "City gate or Marquis hold",
  },
  blocked: {
    label: "Blocked",
    short: "!",
    description: "Needs unblock before progress",
  },
}

export const CITY_LABELS: Record<CityId, string> = {
  austin: "Austin",
  new_braunfels: "New Braunfels",
  san_antonio: "San Antonio",
}

export function defaultGates(): CityGate[] {
  return [
    {
      city: "austin",
      label: "Austin",
      stage4Open: true,
      mailOpen: false,
      note: "Mail closed until Marquis reopens Stages 5–7.",
    },
    {
      city: "new_braunfels",
      label: "New Braunfels",
      stage4Open: false,
      mailOpen: false,
      note: "First-city gate — hold Stage 4+ until reopen.",
    },
    {
      city: "san_antonio",
      label: "San Antonio",
      stage4Open: false,
      mailOpen: false,
      note: "Not opened yet.",
    },
  ]
}

export function gateFor(gates: CityGate[], city: CityId): CityGate {
  return gates.find((g) => g.city === city) ?? defaultGates()[0]!
}

export function hasCompleteBrandKit(deal: Deal): boolean {
  const kit = deal.brandKit
  if (!kit) return false
  return Boolean(kit.primary && kit.secondary && kit.accent)
}

/** Happy-path next stage (ignores held/blocked). */
export function nextHappyStage(stage: PipelineStage): PipelineStage | null {
  const i = PIPELINE_STAGES.indexOf(stage)
  if (i < 0 || i >= PIPELINE_STAGES.length - 1) return null
  return PIPELINE_STAGES[i + 1]!
}

export function canAdvance(
  deal: Deal,
  target: PipelineStage,
  gates: CityGate[],
): { ok: true } | { ok: false; reason: string } {
  if (deal.stage === target) {
    return { ok: false, reason: "Already on that stage." }
  }

  if (target === "held" || target === "blocked") {
    return { ok: true }
  }

  if (deal.stage === "blocked") {
    return {
      ok: false,
      reason: "Unblock this deal before moving it forward.",
    }
  }

  // Resume from held into any working stage — still enforce requirements
  const fromHeld = deal.stage === "held"

  if (!fromHeld && target !== "won") {
    const currentIdx = PIPELINE_STAGES.indexOf(deal.stage)
    const targetIdx = PIPELINE_STAGES.indexOf(target)
    if (currentIdx >= 0 && targetIdx >= 0 && targetIdx > currentIdx + 1) {
      return {
        ok: false,
        reason: `Advance one stage at a time (next is ${STAGE_META[nextHappyStage(deal.stage)!].label}).`,
      }
    }
    if (currentIdx >= 0 && targetIdx >= 0 && targetIdx < currentIdx) {
      return { ok: true } // allow drag back for ops correction
    }
  }

  const gate = gateFor(gates, deal.city)

  if (target === "brand") {
    if (deal.fitScore < 70) {
      return { ok: false, reason: "Fit score must be ≥ 70 before Brand." }
    }
    return { ok: true }
  }

  if (target === "stage4") {
    if (!hasCompleteBrandKit(deal)) {
      return {
        ok: false,
        reason: "Brand kit needs primary / secondary / accent HEX.",
      }
    }
    if (!gate.stage4Open) {
      return {
        ok: false,
        reason: `${gate.label} Stage 4 is gated: ${gate.note}`,
      }
    }
    return { ok: true }
  }

  if (target === "payment") {
    if (!deal.previewUrl?.trim()) {
      return { ok: false, reason: "Stage 4 preview URL is required." }
    }
    if (!gate.mailOpen) {
      return {
        ok: false,
        reason: `${gate.label} payments/mail closed: ${gate.note}`,
      }
    }
    return { ok: true }
  }

  if (target === "postcard") {
    if (
      deal.paymentStatus !== "link_ready" &&
      deal.paymentStatus !== "watching" &&
      deal.paymentStatus !== "paid"
    ) {
      return {
        ok: false,
        reason: "Payment link must be ready or watching before Postcard.",
      }
    }
    if (!gate.mailOpen) {
      return {
        ok: false,
        reason: `${gate.label} mail closed: ${gate.note}`,
      }
    }
    return { ok: true }
  }

  if (target === "mail") {
    if (!deal.postcardReady) {
      return { ok: false, reason: "Mark postcard ready before Print/mail." }
    }
    if (!gate.mailOpen) {
      return {
        ok: false,
        reason: `${gate.label} mail closed: ${gate.note}`,
      }
    }
    return { ok: true }
  }

  if (target === "won") {
    if (deal.paymentStatus !== "paid") {
      return { ok: false, reason: "Mark payment as paid before Won." }
    }
    return { ok: true }
  }

  if (target === "finder") return { ok: true }

  return { ok: false, reason: "Unsupported stage move." }
}

export function suggestedNextAction(deal: Deal, gates: CityGate[]): string {
  const gate = gateFor(gates, deal.city)
  switch (deal.stage) {
    case "finder":
      return "Score confirmed — hand to Brand for lean kit."
    case "brand":
      return hasCompleteBrandKit(deal)
        ? gate.stage4Open
          ? "Kit complete — start Stage 4 fixed template."
          : `Kit complete — waiting on ${gate.label} Stage 4 gate.`
        : "Extract primary / secondary / accent from public sources only."
    case "stage4":
      return deal.previewUrl
        ? gate.mailOpen
          ? "Preview live — create unique Payment Link."
          : `Preview live — ${gate.label} payments held.`
        : "Deploy fixed-template preview; capture phone screenshot."
    case "payment":
      return deal.paymentStatus === "paid"
        ? "Payment matched — remove preview bar and email owner."
        : "Morning watch — match Stripe payment to deal."
    case "postcard":
      return deal.postcardReady
        ? "Postcard print-ready — queue vendor send."
        : "Compose postcard front/back with QR + pay URL."
    case "mail":
      return "Await postage approval; confirm drop."
    case "won":
      return "Live customer — track upsell / GBP."
    case "held":
      return deal.heldReason ?? "Held — waiting on city gate or Marquis."
    case "blocked":
      return deal.blockedReason ?? "Blocked — resolve and unblock."
  }
}
