import { useEffect, useMemo, useState } from "react"
import { createSeedWorkspace } from "@/data/seed"
import {
  canAdvance,
  suggestedNextAction,
} from "@/lib/pipeline"
import { clearWorkspace, loadWorkspace, saveWorkspace } from "@/lib/storage"
import type {
  BrandKit,
  CityGate,
  Deal,
  OwnerRole,
  PaymentStatus,
  PipelineStage,
  Vertical,
  WorkspaceState,
} from "@/types"

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

function touch(deal: Deal, patch: Partial<Deal>, actor: OwnerRole | "System", message: string): Deal {
  const at = new Date().toISOString()
  return {
    ...deal,
    ...patch,
    updatedAt: at,
    activity: [
      {
        id: uid("act"),
        at,
        actor,
        message,
      },
      ...deal.activity,
    ].slice(0, 40),
  }
}

export interface DealFilters {
  query: string
  city: "all" | Deal["city"]
  vertical: "all" | Vertical
  owner: "all" | OwnerRole
  stage: "all" | PipelineStage
}

const defaultFilters: DealFilters = {
  query: "",
  city: "all",
  vertical: "all",
  owner: "all",
  stage: "all",
}

export function usePipelineStore() {
  const [workspace, setWorkspace] = useState<WorkspaceState>(() => loadWorkspace())
  const [filters, setFilters] = useState<DealFilters>(defaultFilters)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    saveWorkspace(workspace)
  }, [workspace])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(t)
  }, [toast])

  const filteredDeals = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    return workspace.deals.filter((d) => {
      if (filters.city !== "all" && d.city !== filters.city) return false
      if (filters.vertical !== "all" && d.vertical !== filters.vertical) return false
      if (filters.owner !== "all" && d.owner !== filters.owner) return false
      if (filters.stage !== "all" && d.stage !== filters.stage) return false
      if (!q) return true
      const hay = [
        d.businessName,
        d.findBatch,
        d.problem,
        d.phone,
        d.address,
        d.notes,
        d.nextAction,
      ]
        .join(" ")
        .toLowerCase()
      return hay.includes(q)
    })
  }, [workspace.deals, filters])

  const selectedDeal =
    workspace.deals.find((d) => d.id === workspace.selectedDealId) ?? null

  function updateDeals(updater: (deals: Deal[]) => Deal[]) {
    setWorkspace((w) => ({ ...w, deals: updater(w.deals) }))
  }

  function selectDeal(id: string | null) {
    setWorkspace((w) => ({ ...w, selectedDealId: id }))
  }

  function moveDeal(dealId: string, target: PipelineStage, actor: OwnerRole | "System" = "System") {
    const deal = workspace.deals.find((d) => d.id === dealId)
    if (!deal) return
    const check = canAdvance(deal, target, workspace.gates)
    if (!check.ok) {
      setToast(check.reason)
      return
    }

    updateDeals((deals) =>
      deals.map((d) => {
        if (d.id !== dealId) return d
        const next: Partial<Deal> = {
          stage: target,
          blockedReason: target === "blocked" ? d.blockedReason || "Needs unblock." : undefined,
          heldReason:
            target === "held"
              ? d.heldReason || "Held pending city gate / Marquis."
              : undefined,
        }
        const provisional = { ...d, ...next }
        next.nextAction = suggestedNextAction(provisional, workspace.gates)
        return touch(d, next, actor, `Moved to ${target}.`)
      }),
    )
    setToast(`Moved to ${target}.`)
  }

  function holdDeal(dealId: string, reason: string) {
    updateDeals((deals) =>
      deals.map((d) => {
        if (d.id !== dealId) return d
        const next = touch(
          d,
          {
            stage: "held",
            heldReason: reason,
            nextAction: reason,
          },
          "Marquis",
          `Held: ${reason}`,
        )
        return next
      }),
    )
    setToast("Deal held.")
  }

  function blockDeal(dealId: string, reason: string) {
    updateDeals((deals) =>
      deals.map((d) => {
        if (d.id !== dealId) return d
        return touch(
          d,
          {
            stage: "blocked",
            blockedReason: reason,
            nextAction: reason,
          },
          "Marquis",
          `Blocked: ${reason}`,
        )
      }),
    )
    setToast("Deal blocked.")
  }

  function unblockDeal(dealId: string, resumeStage: PipelineStage) {
    const deal = workspace.deals.find((d) => d.id === dealId)
    if (!deal) return
    const target = resumeStage === "blocked" || resumeStage === "held" ? "finder" : resumeStage
    const check = canAdvance({ ...deal, stage: "held" }, target, workspace.gates)
    // For unblock, temporarily treat as held resume
    if (deal.stage === "blocked") {
      updateDeals((deals) =>
        deals.map((d) => {
          if (d.id !== dealId) return d
          const cleared = {
            ...d,
            stage: "held" as const,
            blockedReason: undefined,
          }
          const gateCheck = canAdvance(cleared, target, workspace.gates)
          if (!gateCheck.ok) {
            setToast(gateCheck.reason)
            return d
          }
          const provisional = {
            ...cleared,
            stage: target,
            heldReason: undefined,
          }
          return touch(
            d,
            {
              stage: target,
              blockedReason: undefined,
              heldReason: undefined,
              nextAction: suggestedNextAction(provisional, workspace.gates),
            },
            "Marquis",
            `Unblocked → ${target}.`,
          )
        }),
      )
      return
    }
    if (!check.ok) {
      setToast(check.reason)
      return
    }
    moveDeal(dealId, target, "Marquis")
  }

  function patchDeal(
    dealId: string,
    patch: Partial<Deal>,
    message: string,
    actor: OwnerRole | "System" = "System",
  ) {
    updateDeals((deals) =>
      deals.map((d) => {
        if (d.id !== dealId) return d
        const merged = { ...d, ...patch }
        return touch(
          d,
          {
            ...patch,
            nextAction: suggestedNextAction(merged, workspace.gates),
          },
          actor,
          message,
        )
      }),
    )
  }

  function setBrandKit(dealId: string, brandKit: BrandKit) {
    patchDeal(dealId, { brandKit }, "Updated brand kit.", "Brand")
  }

  function setPaymentStatus(dealId: string, paymentStatus: PaymentStatus) {
    patchDeal(dealId, { paymentStatus }, `Payment status → ${paymentStatus}.`, "Marquis")
  }

  function setGates(gates: CityGate[]) {
    setWorkspace((w) => {
      const deals = w.deals.map((d) => ({
        ...d,
        nextAction: suggestedNextAction(d, gates),
      }))
      return { ...w, gates, deals }
    })
    setToast("City gates updated.")
  }

  function addDeal(input: {
    businessName: string
    vertical: Vertical
    city: Deal["city"]
    phone: string
    address: string
    listedSite: string
    siteStatus: Deal["siteStatus"]
    fitScore: number
    findBatch: string
    problem: string
  }) {
    const at = new Date().toISOString()
    const fresh: Deal = {
      id: uid("deal"),
      ...input,
      stage: "finder",
      owner: "Finder",
      brandKit: undefined,
      previewUrl: "",
      paymentLink: "",
      paymentStatus: "none",
      postcardReady: false,
      monthlyPrice: 79,
      oneTimePrice: 299,
      nextAction: "Score confirmed — hand to Brand for lean kit.",
      notes: "",
      activity: [
        {
          id: uid("act"),
          at,
          actor: "Finder",
          message: `Added to pipeline (fit ${input.fitScore}).`,
        },
      ],
      updatedAt: at,
      createdAt: at,
    }
    setWorkspace((w) => ({
      ...w,
      deals: [fresh, ...w.deals],
      selectedDealId: fresh.id,
    }))
    setToast(`Added ${fresh.businessName}.`)
  }

  function resetSeed() {
    clearWorkspace()
    const seed = createSeedWorkspace()
    setWorkspace(seed)
    setFilters(defaultFilters)
    setToast("Workspace reset to seed.")
  }

  const metrics = useMemo(() => {
    const deals = workspace.deals
    const byStage = (s: PipelineStage) => deals.filter((d) => d.stage === s).length
    const active = deals.filter((d) => !["won", "blocked"].includes(d.stage)).length
    const previews = deals.filter((d) => Boolean(d.previewUrl)).length
    const held = byStage("held")
    const pipelineValue = deals
      .filter((d) => !["won", "blocked"].includes(d.stage))
      .reduce((sum, d) => sum + d.monthlyPrice + d.oneTimePrice, 0)
    const won = byStage("won")
    return { active, previews, held, pipelineValue, won, total: deals.length }
  }, [workspace.deals])

  return {
    workspace,
    filters,
    setFilters,
    filteredDeals,
    selectedDeal,
    selectDeal,
    moveDeal,
    holdDeal,
    blockDeal,
    unblockDeal,
    patchDeal,
    setBrandKit,
    setPaymentStatus,
    setGates,
    addDeal,
    resetSeed,
    metrics,
    toast,
    setToast,
  }
}

export type PipelineStore = ReturnType<typeof usePipelineStore>
