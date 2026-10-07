import type { PipelineStore } from "@/hooks/use-pipeline-store"

export function CityGatesPanel({ store }: { store: PipelineStore }) {
  const { workspace, setGates } = store

  function toggle(city: string, key: "stage4Open" | "mailOpen") {
    setGates(
      workspace.gates.map((g) =>
        g.city === city ? { ...g, [key]: !g[key] } : g,
      ),
    )
  }

  function setNote(city: string, note: string) {
    setGates(workspace.gates.map((g) => (g.city === city ? { ...g, note } : g)))
  }

  return (
    <section className="rounded-xl border border-line/80 bg-white/75 p-4">
      <h2 className="font-display text-lg font-bold text-ink">City gates</h2>
      <p className="mt-1 text-sm text-ink-soft/75">
        Controls when Stage 4 builds and payment/postcard/mail can advance. Matches the
        Mstudios first-city and Austin mail holds.
      </p>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {workspace.gates.map((g) => (
          <div key={g.city} className="rounded-lg border border-line bg-paper/80 p-3">
            <div className="font-semibold text-ink">{g.label}</div>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <label className="flex items-center justify-between gap-2">
                <span>Stage 4 open</span>
                <input
                  type="checkbox"
                  checked={g.stage4Open}
                  onChange={() => toggle(g.city, "stage4Open")}
                />
              </label>
              <label className="flex items-center justify-between gap-2">
                <span>Mail / payments open</span>
                <input
                  type="checkbox"
                  checked={g.mailOpen}
                  onChange={() => toggle(g.city, "mailOpen")}
                />
              </label>
              <label className="block text-xs font-semibold text-ink-soft/70">
                Gate note
                <textarea
                  className="mt-1 w-full rounded-lg border border-line bg-white px-2 py-1.5 text-sm font-normal text-ink outline-none focus:border-moss"
                  rows={2}
                  value={g.note}
                  onChange={(e) => setNote(g.city, e.target.value)}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
