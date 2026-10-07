import { format } from "date-fns"
import { X } from "lucide-react"
import { BrandSwatches } from "@/components/brand-swatches"
import { StageBadge } from "@/components/stage-badge"
import type { PipelineStore } from "@/hooks/use-pipeline-store"
import {
  CITY_LABELS,
  PIPELINE_STAGES,
  STAGE_META,
  canAdvance,
  nextHappyStage,
} from "@/lib/pipeline"
import type { OwnerRole, PaymentStatus, PipelineStage } from "@/types"

const fieldClass =
  "mt-1 w-full rounded-lg border border-line bg-white px-2.5 py-2 text-sm outline-none focus:border-moss"

export function DealDrawer({ store }: { store: PipelineStore }) {
  const {
    selectedDeal: deal,
    selectDeal,
    workspace,
    moveDeal,
    holdDeal,
    blockDeal,
    patchDeal,
    setBrandKit,
    setPaymentStatus,
  } = store

  if (!deal) return null

  const next = nextHappyStage(deal.stage)
  const nextCheck = next ? canAdvance(deal, next, workspace.gates) : null

  function advance() {
    if (!next) return
    moveDeal(deal!.id, next, "Marquis")
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/30 backdrop-blur-[2px]">
      <button
        type="button"
        className="flex-1 cursor-default"
        aria-label="Close drawer"
        onClick={() => selectDeal(null)}
      />
      <aside className="flex h-full w-full max-w-xl flex-col border-l border-line bg-paper shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <div className="font-display text-2xl font-bold tracking-tight text-ink">
              {deal.businessName}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-soft/80">
              <StageBadge stage={deal.stage} />
              <span>{CITY_LABELS[deal.city]}</span>
              <span>·</span>
              <span className="capitalize">{deal.vertical}</span>
              <span>·</span>
              <span>Fit {deal.fitScore}</span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close deal"
            className="rounded-lg border border-line p-2 text-ink-soft hover:bg-white"
            onClick={() => selectDeal(null)}
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          <section className="rounded-xl border border-line bg-white/80 p-3">
            <div className="text-[11px] font-semibold tracking-wide text-ink-soft/70 uppercase">
              Next action
            </div>
            <p className="mt-1 text-sm text-ink">{deal.nextAction}</p>
            {deal.heldReason && (
              <p className="mt-2 text-xs text-amber">Held: {deal.heldReason}</p>
            )}
            {deal.blockedReason && (
              <p className="mt-2 text-xs text-danger">Blocked: {deal.blockedReason}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {next && (
                <button
                  type="button"
                  disabled={!nextCheck?.ok}
                  title={nextCheck && !nextCheck.ok ? nextCheck.reason : undefined}
                  className="rounded-lg bg-moss px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
                  onClick={advance}
                >
                  Advance to {STAGE_META[next].label}
                </button>
              )}
              <button
                type="button"
                className="rounded-lg border border-line px-3 py-2 text-sm font-semibold"
                onClick={() => {
                  const reason = prompt(
                    "Hold reason?",
                    deal.heldReason || "City gate / Marquis hold",
                  )
                  if (reason == null) return
                  holdDeal(deal.id, reason.trim() || "Held")
                }}
              >
                Hold
              </button>
              <button
                type="button"
                className="rounded-lg border border-danger/40 px-3 py-2 text-sm font-semibold text-danger"
                onClick={() => {
                  const reason = prompt(
                    "Block reason?",
                    deal.blockedReason || "Needs unblock",
                  )
                  if (reason == null) return
                  blockDeal(deal.id, reason.trim() || "Blocked")
                }}
              >
                Block
              </button>
              <select
                className="rounded-lg border border-line bg-white px-2 text-sm"
                value={deal.stage}
                onChange={(e) => moveDeal(deal.id, e.target.value as PipelineStage)}
              >
                {([...PIPELINE_STAGES, "held", "blocked"] as PipelineStage[]).map((s) => (
                  <option key={s} value={s}>
                    Jump → {STAGE_META[s].label}
                  </option>
                ))}
              </select>
            </div>
            {nextCheck && !nextCheck.ok && (
              <p className="mt-2 text-xs text-amber">{nextCheck.reason}</p>
            )}
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-ink-soft/70">
              Owner
              <select
                className={fieldClass}
                value={deal.owner}
                onChange={(e) =>
                  patchDeal(deal.id, { owner: e.target.value as OwnerRole }, "Owner updated.")
                }
              >
                {(["Finder", "Brand", "Web Design", "Marquis", "Unassigned"] as OwnerRole[]).map(
                  (o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ),
                )}
              </select>
            </label>
            <label className="text-xs font-semibold text-ink-soft/70">
              Phone
              <input
                className={fieldClass}
                value={deal.phone}
                onChange={(e) =>
                  patchDeal(deal.id, { phone: e.target.value }, "Phone updated.")
                }
              />
            </label>
            <label className="sm:col-span-2 text-xs font-semibold text-ink-soft/70">
              Address
              <input
                className={fieldClass}
                value={deal.address}
                onChange={(e) =>
                  patchDeal(deal.id, { address: e.target.value }, "Address updated.")
                }
              />
            </label>
            <label className="sm:col-span-2 text-xs font-semibold text-ink-soft/70">
              Problem sentence
              <textarea
                className={fieldClass}
                rows={2}
                value={deal.problem}
                onChange={(e) =>
                  patchDeal(deal.id, { problem: e.target.value }, "Problem updated.")
                }
              />
            </label>
          </section>

          <section className="rounded-xl border border-line bg-white/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[11px] font-semibold tracking-wide text-ink-soft/70 uppercase">
                Brand kit
              </div>
              <BrandSwatches kit={deal.brandKit} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["primary", "secondary", "accent"] as const).map((key) => (
                <label key={key} className="text-xs font-semibold capitalize text-ink-soft/70">
                  {key}
                  <input
                    className={fieldClass}
                    value={deal.brandKit?.[key] ?? ""}
                    placeholder="#000000"
                    onChange={(e) =>
                      setBrandKit(deal.id, {
                        primary: deal.brandKit?.primary ?? "",
                        secondary: deal.brandKit?.secondary ?? "",
                        accent: deal.brandKit?.accent ?? "",
                        notes: deal.brandKit?.notes,
                        [key]: e.target.value,
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <label className="sm:col-span-2 text-xs font-semibold text-ink-soft/70">
              Stage 4 preview URL
              <input
                className={fieldClass}
                value={deal.previewUrl ?? ""}
                placeholder="https://mstudios-preview-…"
                onChange={(e) =>
                  patchDeal(
                    deal.id,
                    { previewUrl: e.target.value },
                    "Preview URL updated.",
                    "Web Design",
                  )
                }
              />
            </label>
            <label className="text-xs font-semibold text-ink-soft/70">
              Payment link
              <input
                className={fieldClass}
                value={deal.paymentLink ?? ""}
                onChange={(e) =>
                  patchDeal(deal.id, { paymentLink: e.target.value }, "Payment link updated.")
                }
              />
            </label>
            <label className="text-xs font-semibold text-ink-soft/70">
              Payment status
              <select
                className={fieldClass}
                value={deal.paymentStatus}
                onChange={(e) =>
                  setPaymentStatus(deal.id, e.target.value as PaymentStatus)
                }
              >
                {(["none", "link_ready", "watching", "paid", "unknown"] as PaymentStatus[]).map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ),
                )}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={deal.postcardReady}
                onChange={(e) =>
                  patchDeal(
                    deal.id,
                    { postcardReady: e.target.checked },
                    e.target.checked ? "Postcard marked ready." : "Postcard unmarked.",
                  )
                }
              />
              Postcard print-ready
            </label>
            <div className="text-sm text-ink-soft">
              Pricing:{" "}
              <strong className="text-ink">
                ${deal.monthlyPrice}/mo · ${deal.oneTimePrice} setup
              </strong>
            </div>
          </section>

          <label className="block text-xs font-semibold text-ink-soft/70">
            Notes
            <textarea
              className={fieldClass}
              rows={3}
              value={deal.notes}
              onChange={(e) => patchDeal(deal.id, { notes: e.target.value }, "Notes updated.")}
            />
          </label>

          <section>
            <div className="mb-2 text-[11px] font-semibold tracking-wide text-ink-soft/70 uppercase">
              Activity
            </div>
            <ul className="space-y-2">
              {deal.activity.map((a) => (
                <li
                  key={a.id}
                  className="rounded-lg border border-line/70 bg-white/70 px-3 py-2 text-xs"
                >
                  <div className="flex justify-between gap-2 text-ink-soft/65">
                    <span className="font-semibold text-ink-soft">{a.actor}</span>
                    <span>{format(new Date(a.at), "MMM d · HH:mm")}</span>
                  </div>
                  <p className="mt-0.5 text-ink">{a.message}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </div>
  )
}
