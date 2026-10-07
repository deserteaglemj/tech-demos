import { STAGE_META } from "@/lib/pipeline"
import { cn } from "@/lib/cn"
import type { PipelineStage } from "@/types"

const tones: Record<PipelineStage, string> = {
  finder: "bg-[#dfe8f0] text-[#2b4452]",
  brand: "bg-[#e7e0f2] text-[#3d2f55]",
  stage4: "bg-[#dcead8] text-[#243822]",
  payment: "bg-[#f3e5c4] text-[#5c4010]",
  postcard: "bg-[#f0ddd6] text-[#5a2e22]",
  mail: "bg-[#d9e3ef] text-[#24384a]",
  won: "bg-[#c8d96f]/35 text-[#243822]",
  held: "bg-[#ece7d8] text-[#5a4a28]",
  blocked: "bg-[#f0d5d1] text-[#6b241a]",
}

export function StageBadge({
  stage,
  className,
}: {
  stage: PipelineStage
  className?: string
}) {
  const meta = STAGE_META[stage]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        tones[stage],
        className,
      )}
    >
      <span className="opacity-70">{meta.short}</span>
      {meta.label}
    </span>
  )
}
