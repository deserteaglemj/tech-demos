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

import { getStatusConfig, STATUSES, type Ticket, type TicketStatus } from "@/data/tickets"
import {
  AssigneeAvatar,
  ChannelTag,
  PriorityBadge,
} from "@/components/ticket-chrome"

function ticketsToColumns(
  tickets: Ticket[]
): Record<TicketStatus, Ticket[]> {
  const columns: Record<TicketStatus, Ticket[]> = {
    new: [],
    open: [],
    waiting: [],
    resolved: [],
  }
  for (const ticket of tickets) columns[ticket.status].push(ticket)
  return columns
}

function columnsToTickets(
  columns: Record<string, Ticket[]>
): Ticket[] {
  return (Object.entries(columns) as [TicketStatus, Ticket[]][]).flatMap(
    ([status, list]) => list.map((ticket) => ({ ...ticket, status }))
  )
}

function TicketCard({
  ticket,
  asHandle,
  isOverlay,
}: {
  ticket: Ticket
  asHandle?: boolean
  isOverlay?: boolean
}) {
  const content = (
    <Card className="cursor-grab gap-0 py-3 shadow-sm active:cursor-grabbing">
      <CardContent className="space-y-2 px-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-muted-foreground font-mono text-[11px]">
            {ticket.id}
          </span>
          <PriorityBadge priority={ticket.priority} />
        </div>
        <p className="line-clamp-2 text-sm font-medium">{ticket.subject}</p>
        <div className="flex items-center justify-between gap-2 pt-1">
          <AssigneeAvatar assignee={ticket.assignee} />
          <ChannelTag channel={ticket.channel} />
        </div>
        {ticket.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {ticket.tags.slice(0, 3).map((tag) => (
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
    <KanbanItem value={ticket.id} disabled={isOverlay}>
      {asHandle && !isOverlay ? (
        <KanbanItemHandle>{content}</KanbanItemHandle>
      ) : (
        content
      )}
    </KanbanItem>
  )
}

function TicketColumn({
  status,
  tickets,
  isOverlay,
}: {
  status: TicketStatus
  tickets: Ticket[]
  isOverlay?: boolean
}) {
  const config = getStatusConfig(status)
  return (
    <KanbanColumn value={status} disabled={isOverlay} className="min-w-64">
      <Card className="mb-2.5 gap-0 py-3">
        <CardHeader className="flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <span className={`size-2 rounded-full ${config.dot}`} />
            <span className="text-sm font-semibold">{config.label}</span>
            <Badge variant="outline">{tickets.length}</Badge>
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
        value={status}
        className="flex min-h-24 flex-col gap-2.5"
      >
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            asHandle={!isOverlay}
            isOverlay={isOverlay}
          />
        ))}
      </KanbanColumnContent>
    </KanbanColumn>
  )
}

export function TicketsKanban({
  tickets,
  onTicketsChange,
}: {
  tickets: Ticket[]
  onTicketsChange: (tickets: Ticket[]) => void
}) {
  // Kanban owns its column grouping as local state, seeded once from the
  // lifted `tickets` prop. Feeding a freshly-flattened-and-respread array
  // back in as `value` on every drag tick (instead of letting the board
  // hold stable references for untouched columns) is what caused a render
  // loop mid-drag, so the parent is only notified on drop via
  // `onValueCommit`, never on the live `onValueChange` preview.
  const [columns, setColumns] = useState<Record<TicketStatus, Ticket[]>>(
    () => ticketsToColumns(tickets)
  )
  const ticketById = useMemo(() => {
    const map = new Map<string, Ticket>()
    for (const list of Object.values(columns)) {
      for (const ticket of list) map.set(ticket.id, ticket)
    }
    return map
  }, [columns])

  return (
    <Kanban
      value={columns}
      onValueChange={(next) =>
        setColumns(next as Record<TicketStatus, Ticket[]>)
      }
      onValueCommit={(next) => onTicketsChange(columnsToTickets(next))}
      getItemValue={(ticket) => ticket.id}
    >
      <KanbanBoard className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATUSES.map((status) => (
          <TicketColumn
            key={status.value}
            status={status.value}
            tickets={columns[status.value]}
          />
        ))}
      </KanbanBoard>
      <KanbanOverlay className="rounded-md">
        {({ value, variant }) => {
          if (variant === "column") {
            const status = value as TicketStatus
            return (
              <TicketColumn
                status={status}
                tickets={columns[status]}
                isOverlay
              />
            )
          }
          const ticket = ticketById.get(value as string)
          return ticket ? <TicketCard ticket={ticket} isOverlay /> : null
        }}
      </KanbanOverlay>
    </Kanban>
  )
}
