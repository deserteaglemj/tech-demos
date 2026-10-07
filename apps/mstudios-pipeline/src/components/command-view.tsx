import { CityGatesPanel } from "@/components/city-gates-panel"
import { MetricsBar } from "@/components/metrics-bar"
import { StageBadge } from "@/components/stage-badge"
import type { PipelineStore } from "@/hooks/use-pipeline-store"
import { CITY_LABELS, PIPELINE_STAGES, STAGE_META } from "@/lib/pipeline"

export function CommandView({ store }: { store: PipelineStore }) {
  const { workspace, selectDeal } = store

  const throughput = PIPELINE_STAGES.map((stage) => ({
    stage,
    count: workspace.deals.filter((d) => d.stage === stage).length,
  }))

  const attention = workspace.deals
    .filter((d) => d.stage === "held" || d.stage === "blocked" || d.stage === "brand")
    .slice(0, 8)

  return (
    <div className="space-y-4">
      <MetricsBar store={store} />

      <section className="rounded-xl border border-line/80 bg-white/75 p-4">
        <h2 className="font-display text-lg font-bold text-ink">Pipeline throughput</h2>
        <p className="mt-1 text-sm text-ink-soft/75">
          Finder → Brand → Stage 4 → Payment → Postcard → Mail → Won
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {throughput.map(({ stage, count }) => (
            <div
              key={stage}
              className="rounded-lg border border-line bg-paper/70 px-3 py-3 text-center"
            >
              <StageBadge stage={stage} className="justify-center" />
              <div className="mt-2 font-display text-3xl font-bold text-ink">{count}</div>
              <div className="mt-1 text-[11px] text-ink-soft/65">
                {STAGE_META[stage].description}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-line/80 bg-white/75 p-4">
          <h2 className="font-display text-lg font-bold text-ink">Needs attention</h2>
          <ul className="mt-3 space-y-2">
            {attention.map((deal) => (
              <li key={deal.id}>
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 rounded-lg border border-line bg-paper/60 px-3 py-2 text-left hover:bg-lime/20"
                  onClick={() => selectDeal(deal.id)}
                >
                  <div>
                    <div className="font-semibold text-ink">{deal.businessName}</div>
                    <div className="text-xs text-ink-soft/75">
                      {CITY_LABELS[deal.city]} · {deal.nextAction}
                    </div>
                  </div>
                  <StageBadge stage={deal.stage} />
                </button>
              </li>
            ))}
            {attention.length === 0 && (
              <li className="text-sm text-ink-soft/60">No held, blocked, or brand-queue deals.</li>
            )}
          </ul>
        </section>

        <CityGatesPanel store={store} />
      </div>

      <section className="rounded-xl border border-line/80 bg-ink px-5 py-4 text-paper">
        <h2 className="font-display text-lg font-bold text-lime">How the team runs this</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-paper/85">
          <li>Finder scores a no-site / dead-site lead and adds it here.</li>
          <li>Brand delivers literal primary / secondary / accent HEX.</li>
          <li>Web Design ships Stage 4 fixed-template preview (city gate permitting).</li>
          <li>Open mail gate → Payment Link → postcard → print with Marquis approval.</li>
          <li>Mark paid → Won. Data persists in this browser via localStorage.</li>
        </ol>
      </section>
    </div>
  )
}
