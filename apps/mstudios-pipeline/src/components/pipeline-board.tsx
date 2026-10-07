import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react"
import { BrandSwatches } from "@/components/brand-swatches"
import { StageBadge } from "@/components/stage-badge"
import type { PipelineStore } from "@/hooks/use-pipeline-store"
import { CITY_LABELS, PIPELINE_STAGES, STAGE_META } from "@/lib/pipeline"
import { cn } from "@/lib/cn"
import type { Deal, PipelineStage } from "@/types"

const boardStages: PipelineStage[] = [...PIPELINE_STAGES, "held", "blocked"]

function DealCard({
  deal,
  dragging,
  onOpen,
}: {
  deal: Deal
  dragging?: boolean
  onOpen: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: deal.id, data: { stage: deal.stage } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border border-line/90 bg-white p-3 shadow-sm",
        (isDragging || dragging) && "opacity-40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          className="text-left font-semibold text-ink hover:text-moss"
          onClick={onOpen}
        >
          {deal.businessName}
        </button>
        <button
          type="button"
          className="cursor-grab rounded px-1.5 text-sm text-ink-soft/45 active:cursor-grabbing"
          aria-label="Drag deal"
          {...attributes}
          {...listeners}
        >
          ::
        </button>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-ink-soft/80">
        <span>{CITY_LABELS[deal.city]}</span>
        <span>·</span>
        <span className="capitalize">{deal.vertical}</span>
        <span>·</span>
        <span>Fit {deal.fitScore}</span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <BrandSwatches kit={deal.brandKit} />
        <span className="text-[11px] font-medium text-ink-soft/70">{deal.owner}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-snug text-ink-soft/80">
        {deal.nextAction}
      </p>
    </article>
  )
}

function StaticCard({ deal }: { deal: Deal }) {
  return (
    <article className="rounded-lg border border-line/90 bg-white p-3 shadow-lg">
      <div className="font-semibold text-ink">{deal.businessName}</div>
      <div className="mt-1 text-[11px] text-ink-soft/80">
        {CITY_LABELS[deal.city]} · Fit {deal.fitScore}
      </div>
    </article>
  )
}

function Column({
  stage,
  deals,
  onOpen,
}: {
  stage: PipelineStage
  deals: Deal[]
  onOpen: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `col-${stage}`, data: { stage } })
  const meta = STAGE_META[stage]

  return (
    <section
      ref={setNodeRef}
      className={cn(
        "flex w-[280px] shrink-0 flex-col rounded-xl border border-line/70 bg-white/45",
        isOver && "ring-2 ring-moss/40",
      )}
    >
      <header className="sticky top-0 z-10 border-b border-line/60 bg-paper/90 px-3 py-2.5 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <StageBadge stage={stage} />
          <span className="text-xs font-semibold text-ink-soft/60">{deals.length}</span>
        </div>
        <p className="mt-1 text-[11px] leading-snug text-ink-soft/65">{meta.description}</p>
      </header>
      <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} onOpen={() => onOpen(deal.id)} />
          ))}
          {deals.length === 0 && (
            <div className="rounded-lg border border-dashed border-line px-3 py-6 text-center text-xs text-ink-soft/50">
              Drop deals here
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  )
}

export function PipelineBoard({ store }: { store: PipelineStore }) {
  const { filteredDeals, moveDeal, selectDeal } = store
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const activeDeal = filteredDeals.find((d) => d.id === activeId) ?? null

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over) return
    const dealId = String(active.id)
    const overId = String(over.id)
    let target: PipelineStage | null = null
    if (overId.startsWith("col-")) {
      target = overId.replace("col-", "") as PipelineStage
    } else {
      const overDeal = filteredDeals.find((d) => d.id === overId)
      target = overDeal?.stage ?? (over.data.current?.stage as PipelineStage | undefined) ?? null
    }
    if (!target) return
    const deal = filteredDeals.find((d) => d.id === dealId)
    if (!deal || deal.stage === target) return
    moveDeal(dealId, target)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-2">
        {boardStages.map((stage) => (
          <Column
            key={stage}
            stage={stage}
            deals={filteredDeals.filter((d) => d.stage === stage)}
            onOpen={selectDeal}
          />
        ))}
      </div>
      <DragOverlay>
        {activeDeal ? (
          <div className="w-[260px] rotate-1">
            <StaticCard deal={activeDeal} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
