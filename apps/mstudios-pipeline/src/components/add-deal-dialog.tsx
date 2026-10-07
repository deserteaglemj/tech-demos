import { useState, type FormEvent } from "react"
import type { PipelineStore } from "@/hooks/use-pipeline-store"
import type { CityId, SiteStatus, Vertical } from "@/types"

const fieldClass =
  "mt-1 w-full rounded-lg border border-line bg-white px-2.5 py-2 text-sm outline-none focus:border-moss"

export function AddDealDialog({
  open,
  onClose,
  store,
}: {
  open: boolean
  onClose: () => void
  store: PipelineStore
}) {
  const [businessName, setBusinessName] = useState("")
  const [vertical, setVertical] = useState<Vertical>("barber")
  const [city, setCity] = useState<CityId>("austin")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [listedSite, setListedSite] = useState("")
  const [siteStatus, setSiteStatus] = useState<SiteStatus>("missing")
  const [fitScore, setFitScore] = useState(80)
  const [findBatch, setFindBatch] = useState("Manual find")
  const [problem, setProblem] = useState("")

  if (!open) return null

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!businessName.trim()) return
    store.addDeal({
      businessName: businessName.trim(),
      vertical,
      city,
      phone: phone.trim() || "(000) 000-0000",
      address: address.trim() || city,
      listedSite: listedSite.trim(),
      siteStatus,
      fitScore,
      findBatch: findBatch.trim() || "Manual find",
      problem: problem.trim() || "No website — needs Mstudios preview.",
    })
    onClose()
    setBusinessName("")
    setProblem("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/35 p-4 backdrop-blur-[2px]">
      <form
        onSubmit={submit}
        className="w-full max-w-lg rounded-2xl border border-line bg-paper p-5 shadow-2xl"
      >
        <h2 className="font-display text-xl font-bold text-ink">Add prospect</h2>
        <p className="mt-1 text-sm text-ink-soft/75">
          Creates a Finder-stage deal in the Mstudios pipeline.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="sm:col-span-2 text-xs font-semibold text-ink-soft/70">
            Business name
            <input
              required
              className={fieldClass}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </label>
          <label className="text-xs font-semibold text-ink-soft/70">
            Vertical
            <select
              className={fieldClass}
              value={vertical}
              onChange={(e) => setVertical(e.target.value as Vertical)}
            >
              <option value="barber">barber</option>
              <option value="lawn">lawn</option>
              <option value="cleaning">cleaning</option>
              <option value="other">other</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-ink-soft/70">
            City
            <select
              className={fieldClass}
              value={city}
              onChange={(e) => setCity(e.target.value as CityId)}
            >
              {store.workspace.gates.map((g) => (
                <option key={g.city} value={g.city}>
                  {g.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold text-ink-soft/70">
            Phone
            <input className={fieldClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label className="text-xs font-semibold text-ink-soft/70">
            Fit score
            <input
              type="number"
              min={0}
              max={100}
              className={fieldClass}
              value={fitScore}
              onChange={(e) => setFitScore(Number(e.target.value))}
            />
          </label>
          <label className="sm:col-span-2 text-xs font-semibold text-ink-soft/70">
            Address
            <input
              className={fieldClass}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <label className="text-xs font-semibold text-ink-soft/70">
            Listed site
            <input
              className={fieldClass}
              value={listedSite}
              onChange={(e) => setListedSite(e.target.value)}
            />
          </label>
          <label className="text-xs font-semibold text-ink-soft/70">
            Site status
            <select
              className={fieldClass}
              value={siteStatus}
              onChange={(e) => setSiteStatus(e.target.value as SiteStatus)}
            >
              <option value="missing">missing</option>
              <option value="dead">dead</option>
              <option value="parked">parked</option>
              <option value="live_weak">live_weak</option>
              <option value="none">none</option>
            </select>
          </label>
          <label className="sm:col-span-2 text-xs font-semibold text-ink-soft/70">
            Find batch
            <input
              className={fieldClass}
              value={findBatch}
              onChange={(e) => setFindBatch(e.target.value)}
            />
          </label>
          <label className="sm:col-span-2 text-xs font-semibold text-ink-soft/70">
            Problem sentence
            <textarea
              className={fieldClass}
              rows={2}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-line px-3 py-2 text-sm font-semibold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-moss px-3 py-2 text-sm font-semibold text-white"
          >
            Add to Finder
          </button>
        </div>
      </form>
    </div>
  )
}
