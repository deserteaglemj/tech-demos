import { BrandSwatches } from "@/components/brand-swatches"
import { StageBadge } from "@/components/stage-badge"
import type { PipelineStore } from "@/hooks/use-pipeline-store"
import { CITY_LABELS } from "@/lib/pipeline"
import { cn } from "@/lib/cn"
import { formatDistanceToNow } from "date-fns"

export function DealsTable({ store }: { store: PipelineStore }) {
  const { filteredDeals, selectDeal, selectedDeal } = store

  return (
    <div className="overflow-hidden rounded-xl border border-line/80 bg-white/80">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-paper-2/80 text-[11px] tracking-[0.06em] text-ink-soft/70 uppercase">
            <tr>
              <th className="px-3 py-2.5 font-semibold">Business</th>
              <th className="px-3 py-2.5 font-semibold">Stage</th>
              <th className="px-3 py-2.5 font-semibold">City</th>
              <th className="px-3 py-2.5 font-semibold">Fit</th>
              <th className="px-3 py-2.5 font-semibold">Owner</th>
              <th className="px-3 py-2.5 font-semibold">Kit</th>
              <th className="px-3 py-2.5 font-semibold">Next action</th>
              <th className="px-3 py-2.5 font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map((deal) => {
              const selected = selectedDeal?.id === deal.id
              return (
                <tr
                  key={deal.id}
                  className={cn(
                    "cursor-pointer border-t border-line/60 transition-colors hover:bg-lime/15",
                    selected && "bg-lime/20",
                  )}
                  onClick={() => selectDeal(deal.id)}
                >
                  <td className="px-3 py-2.5">
                    <div className="font-semibold text-ink">{deal.businessName}</div>
                    <div className="text-xs text-ink-soft/65 capitalize">
                      {deal.vertical} · {deal.findBatch}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <StageBadge stage={deal.stage} />
                  </td>
                  <td className="px-3 py-2.5 text-ink-soft">{CITY_LABELS[deal.city]}</td>
                  <td className="px-3 py-2.5 font-semibold tabular-nums">{deal.fitScore}</td>
                  <td className="px-3 py-2.5 text-ink-soft">{deal.owner}</td>
                  <td className="px-3 py-2.5">
                    <BrandSwatches kit={deal.brandKit} />
                  </td>
                  <td className="max-w-[280px] px-3 py-2.5 text-xs text-ink-soft/85">
                    <span className="line-clamp-2">{deal.nextAction}</span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-ink-soft/65 whitespace-nowrap">
                    {formatDistanceToNow(new Date(deal.updatedAt), { addSuffix: true })}
                  </td>
                </tr>
              )
            })}
            {filteredDeals.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-sm text-ink-soft/60">
                  No deals match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
