import { CITY_LABELS } from "@/lib/pipeline"
import type { PipelineStore } from "@/hooks/use-pipeline-store"

export function MetricsBar({ store }: { store: PipelineStore }) {
  const { metrics, workspace } = store
  const cards = [
    { label: "Active deals", value: String(metrics.active) },
    { label: "Previews live", value: String(metrics.previews) },
    { label: "Held / gated", value: String(metrics.held) },
    {
      label: "Pipeline $",
      value: `$${metrics.pipelineValue.toLocaleString()}`,
    },
    { label: "Won", value: String(metrics.won) },
  ]

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-line/80 bg-white/70 px-4 py-3 shadow-[0_1px_0_rgba(18,24,22,0.04)] backdrop-blur"
        >
          <div className="text-[11px] font-semibold tracking-[0.08em] text-ink-soft/70 uppercase">
            {c.label}
          </div>
          <div className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
            {c.value}
          </div>
        </div>
      ))}
      <div className="sm:col-span-2 xl:col-span-5 flex flex-wrap gap-2">
        {workspace.gates.map((g) => (
          <span
            key={g.city}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-paper-2/80 px-3 py-1.5 text-xs text-ink-soft"
          >
            <strong className="text-ink">{CITY_LABELS[g.city]}</strong>
            <span
              className={
                g.stage4Open ? "text-moss-bright font-semibold" : "text-amber font-semibold"
              }
            >
              S4 {g.stage4Open ? "open" : "gated"}
            </span>
            <span className="text-line">·</span>
            <span
              className={g.mailOpen ? "text-moss-bright font-semibold" : "text-amber font-semibold"}
            >
              Mail {g.mailOpen ? "open" : "closed"}
            </span>
          </span>
        ))}
      </div>
    </section>
  )
}
