import type { BrandKit } from "@/types"

export function BrandSwatches({ kit }: { kit?: BrandKit }) {
  if (!kit) {
    return <span className="text-xs text-ink-soft/60">No kit</span>
  }
  const colors = [
    { label: "P", value: kit.primary },
    { label: "S", value: kit.secondary },
    { label: "A", value: kit.accent },
  ]
  return (
    <div className="flex items-center gap-1.5">
      {colors.map((c) => (
        <span
          key={c.label}
          title={`${c.label}: ${c.value}`}
          className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-black/15 text-[9px] font-bold text-white shadow-sm"
          style={{ background: c.value }}
        >
          {c.label}
        </span>
      ))}
    </div>
  )
}
