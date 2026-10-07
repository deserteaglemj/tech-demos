import { useMemo, useState } from "react"
import { GripVerticalIcon } from "lucide-react"

import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "@/components/reui/kanban"
import { Badge } from "@/components/reui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  getStageConfig,
  STAGES,
  type Deal,
  type DealStage,
} from "@/data/deals"
import {
  FitBadge,
  OwnerAvatar,
  VerticalTag,
  WebsiteStatusBadge,
} from "@/components/deal-chrome"

function dealsToColumns(deals: Deal[]): Record<DealStage, Deal[]> {
  const columns: Record<DealStage, Deal[]> = {
    finder: [],
    brand: [],
    stage4: [],
    won: [],
  }
  for (const deal of deals) columns[deal.stage].push(deal)
  return columns
}

function columnsToDeals(columns: Record<string, Deal[]>): Deal[] {
  return (Object.entries(columns) as [DealStage, Deal[]][]).flatMap(
    ([stage, list]) => list.map((deal) => ({ ...deal, stage }))
  )
}

function DealCard({
  deal,
  asHandle,
  isOverlay,
  onSelect,
}: {
  deal: Deal
  asHandle?: boolean
  isOverlay?: boolean
  onSelect?: (deal: Deal) => void
}) {
  const content = (
    <Card className="cursor-grab gap-0 py-3 shadow-sm active:cursor-grabbing">
      <CardContent className="space-y-2 px-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-muted-foreground font-mono text-[11px]">
            {deal.id}
          </span>
          <FitBadge fit={deal.fit} score={deal.fitScore} />
        </div>
        <p className="line-clamp-2 text-sm font-medium">{deal.businessName}</p>
        <WebsiteStatusBadge status={deal.websiteStatus} />
        <p className="text-muted-foreground line-clamp-2 text-xs">
          {deal.city}
        </p>
        <div className="flex items-center justify-between gap-2 pt-1">
          <OwnerAvatar owner={deal.owner} />
          <VerticalTag vertical={deal.vertical} />
        </div>
        {deal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {deal.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <KanbanItem value={deal.id} disabled={isOverlay}>
      {asHandle && !isOverlay ? (
        <KanbanItemHandle>
          <button
            type="button"
            className="w-full text-left"
            onClick={() => onSelect?.(deal)}
          >
            {content}
          </button>
        </KanbanItemHandle>
      ) : (
        content
      )}
    </KanbanItem>
  )
}

function DealColumn({
  stage,
  deals,
  isOverlay,
  onSelect,
}: {
  stage: DealStage
  deals: Deal[]
  isOverlay?: boolean
  onSelect?: (deal: Deal) => void
}) {
  const config = getStageConfig(stage)
  return (
    <KanbanColumn value={stage} disabled={isOverlay} className="min-w-64">
      <Card className="mb-2.5 gap-0 py-3">
        <CardHeader className="flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <span className={`size-2 rounded-full ${config.dot}`} />
            <span className="text-sm font-semibold">{config.label}</span>
            <Badge variant="outline">{deals.length}</Badge>
          </div>
          <KanbanColumnHandle
            render={(props) => (
              <Button {...props} size="icon-xs" variant="ghost">
                <GripVerticalIcon />
              </Button>
            )}
          />
        </CardHeader>
      </Card>
      <KanbanColumnContent
        value={stage}
        className="flex min-h-24 flex-col gap-2.5"
      >
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            asHandle={!isOverlay}
            isOverlay={isOverlay}
            onSelect={onSelect}
          />
        ))}
      </KanbanColumnContent>
    </KanbanColumn>
  )
}

export function DealsKanban({
  deals,
  onDealsChange,
  onSelect,
}: {
  deals: Deal[]
  onDealsChange: (deals: Deal[]) => void
  onSelect: (deal: Deal) => void
}) {
  // Same ownership model as the ReUI ticket board: local columns, parent
  // notified only on drop (`onValueCommit`), never on the live drag preview.
  const [columns, setColumns] = useState<Record<DealStage, Deal[]>>(() =>
    dealsToColumns(deals)
  )
  const dealById = useMemo(() => {
    const map = new Map<string, Deal>()
    for (const list of Object.values(columns)) {
      for (const deal of list) map.set(deal.id, deal)
    }
    return map
  }, [columns])

  return (
    <Kanban
      value={columns}
      onValueChange={(next) => setColumns(next as Record<DealStage, Deal[]>)}
      onValueCommit={(next) => onDealsChange(columnsToDeals(next))}
      getItemValue={(deal) => deal.id}
    >
      <KanbanBoard className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((stage) => (
          <DealColumn
            key={stage.value}
            stage={stage.value}
            deals={columns[stage.value]}
            onSelect={onSelect}
          />
        ))}
      </KanbanBoard>
      <KanbanOverlay className="rounded-md">
        {({ value, variant }) => {
          if (variant === "column") {
            const stage = value as DealStage
            return (
              <DealColumn stage={stage} deals={columns[stage]} isOverlay />
            )
          }
          const deal = dealById.get(value as string)
          return deal ? <DealCard deal={deal} isOverlay /> : null
        }}
      </KanbanOverlay>
    </Kanban>
  )
}
