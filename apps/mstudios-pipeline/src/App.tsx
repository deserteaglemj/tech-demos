import { useState } from "react"
import { AddDealDialog } from "@/components/add-deal-dialog"
import { CommandView } from "@/components/command-view"
import { DealDrawer } from "@/components/deal-drawer"
import { DealsTable } from "@/components/deals-table"
import { FiltersBar } from "@/components/filters-bar"
import { PipelineBoard } from "@/components/pipeline-board"
import { usePipelineStore } from "@/hooks/use-pipeline-store"
import { cn } from "@/lib/cn"
import type { AppView } from "@/types"

const views: { id: AppView; label: string }[] = [
  { id: "command", label: "Command" },
  { id: "board", label: "Board" },
  { id: "table", label: "Table" },
]

export default function App() {
  const store = usePipelineStore()
  const [view, setView] = useState<AppView>("command")
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <header className="border-b border-line/80 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink font-display text-lg font-extrabold text-lime">
              M
            </div>
            <div>
              <div className="font-display text-xl font-extrabold tracking-tight text-ink">
                Mstudios Pipeline
              </div>
              <div className="text-xs text-ink-soft/70">
                Operator console · Finder → Brand → Stage 4 → Mail
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex rounded-lg border border-line bg-paper p-0.5">
              {views.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
                    view === v.id
                      ? "bg-ink text-lime"
                      : "text-ink-soft hover:text-ink",
                  )}
                  onClick={() => setView(v.id)}
                >
                  {v.label}
                </button>
              ))}
            </nav>
            <button
              type="button"
              className="rounded-lg bg-moss px-3 py-2 text-sm font-semibold text-white"
              onClick={() => setAddOpen(true)}
            >
              Add prospect
            </button>
            <button
              type="button"
              className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-paper-2"
              onClick={() => {
                if (confirm("Reset workspace to seed data? Local changes will be lost.")) {
                  store.resetSeed()
                }
              }}
            >
              Reset seed
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-4 px-4 py-5 sm:px-6">
        {(view === "board" || view === "table") && <FiltersBar store={store} />}
        {view === "command" && <CommandView store={store} />}
        {view === "board" && <PipelineBoard store={store} />}
        {view === "table" && <DealsTable store={store} />}
      </main>

      <DealDrawer store={store} />
      <AddDealDialog open={addOpen} onClose={() => setAddOpen(false)} store={store} />

      {store.toast && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-line bg-ink px-4 py-2 text-sm font-medium text-lime shadow-lg">
          {store.toast}
        </div>
      )}
    </div>
  )
}
