import type { ReactNode } from "react"
import type { DealFilters, PipelineStore } from "@/hooks/use-pipeline-store"
import { PIPELINE_STAGES, STAGE_META } from "@/lib/pipeline"
import type { OwnerRole, PipelineStage, Vertical } from "@/types"

const verticals: Array<"all" | Vertical> = [
  "all",
  "barber",
  "lawn",
  "cleaning",
  "other",
]
const owners: Array<"all" | OwnerRole> = [
  "all",
  "Finder",
  "Brand",
  "Web Design",
  "Marquis",
  "Unassigned",
]

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="flex min-w-[140px] flex-1 flex-col gap-1 text-[11px] font-semibold tracking-wide text-ink-soft/70 uppercase">
      {label}
      {children}
    </label>
  )
}

const selectClass =
  "h-9 rounded-lg border border-line bg-white px-2.5 text-sm font-medium text-ink normal-case tracking-normal outline-none focus:border-moss"

export function FiltersBar({ store }: { store: PipelineStore }) {
  const { filters, setFilters, filteredDeals, workspace } = store

  function set<K extends keyof DealFilters>(key: K, value: DealFilters[K]) {
    setFilters({ ...filters, [key]: value })
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line/80 bg-white/75 p-3 backdrop-blur">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Search">
          <input
            value={filters.query}
            onChange={(e) => set("query", e.target.value)}
            placeholder="Business, batch, phone…"
            className="h-9 w-full min-w-[200px] rounded-lg border border-line bg-white px-3 text-sm font-medium normal-case tracking-normal outline-none focus:border-moss"
          />
        </Field>
        <Field label="City">
          <select
            className={selectClass}
            value={filters.city}
            onChange={(e) => set("city", e.target.value as DealFilters["city"])}
          >
            <option value="all">All cities</option>
            {workspace.gates.map((g) => (
              <option key={g.city} value={g.city}>
                {g.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Vertical">
          <select
            className={selectClass}
            value={filters.vertical}
            onChange={(e) => set("vertical", e.target.value as DealFilters["vertical"])}
          >
            {verticals.map((v) => (
              <option key={v} value={v}>
                {v === "all" ? "All verticals" : v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Owner">
          <select
            className={selectClass}
            value={filters.owner}
            onChange={(e) => set("owner", e.target.value as DealFilters["owner"])}
          >
            {owners.map((o) => (
              <option key={o} value={o}>
                {o === "all" ? "All owners" : o}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Stage">
          <select
            className={selectClass}
            value={filters.stage}
            onChange={(e) => set("stage", e.target.value as DealFilters["stage"])}
          >
            <option value="all">All stages</option>
            {([...PIPELINE_STAGES, "held", "blocked"] as PipelineStage[]).map((s) => (
              <option key={s} value={s}>
                {STAGE_META[s].label}
              </option>
            ))}
          </select>
        </Field>
        <button
          type="button"
          className="h-9 rounded-lg border border-line px-3 text-sm font-semibold text-ink-soft hover:bg-paper-2"
          onClick={() =>
            setFilters({
              query: "",
              city: "all",
              vertical: "all",
              owner: "all",
              stage: "all",
            })
          }
        >
          Clear
        </button>
      </div>
      <div className="text-xs text-ink-soft/70">
        Showing <strong className="text-ink">{filteredDeals.length}</strong> of{" "}
        {workspace.deals.length} deals
      </div>
    </div>
  )
}
