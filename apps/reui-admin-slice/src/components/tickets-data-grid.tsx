import { useMemo, useState } from "react"
import {
  filterFn_arrHas,
  useTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { SearchIcon, Settings2Icon } from "lucide-react"

import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  type DataGridFeatures,
} from "@/components/reui/data-grid/data-grid"
import { DataGridColumnFilter } from "@/components/reui/data-grid/data-grid-column-filter"
import { DataGridColumnHeader } from "@/components/reui/data-grid/data-grid-column-header"
import { DataGridColumnVisibility } from "@/components/reui/data-grid/data-grid-column-visibility"
import { DataGridPagination } from "@/components/reui/data-grid/data-grid-pagination"
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area"
import { DataGridTable } from "@/components/reui/data-grid/data-grid-table"
import { Filters } from "@/components/reui/filters/filters"
import { createFilterQuery } from "@/components/reui/filters/filters-query"
import type { FilterQuery } from "@/components/reui/filters/filters-types"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import {
  PRIORITIES,
  STATUSES,
  type Ticket,
} from "@/data/tickets"
import { filterRecordsByQuery } from "@/lib/filter-query"
import {
  getTicketFieldValue,
  ticketFilterFields,
} from "@/lib/ticket-filter-fields"
import {
  AssigneeAvatar,
  ChannelTag,
  PriorityBadge,
  StatusBadge,
} from "@/components/ticket-chrome"

function formatRelativeTime(iso: string): string {
  const now = new Date("2026-09-17T09:00:00Z").getTime()
  const then = new Date(iso).getTime()
  const diffHours = Math.round((now - then) / 3_600_000)
  if (diffHours < 1) return "just now"
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 30) return `${diffDays}d ago`
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

export function TicketsDataGrid({ tickets }: { tickets: Ticket[] }) {
  const [globalSearch, setGlobalSearch] = useState("")
  const [query, setQuery] = useState<FilterQuery>(() => createFilterQuery())
  const [sorting, setSorting] = useState<SortingState>([
    { id: "updatedAt", desc: true },
  ])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const filteredByBuilder = useMemo(
    () => filterRecordsByQuery(tickets, query, getTicketFieldValue),
    [tickets, query]
  )

  const searched = useMemo(() => {
    const needle = globalSearch.trim().toLowerCase()
    if (!needle) return filteredByBuilder
    return filteredByBuilder.filter(
      (ticket) =>
        ticket.subject.toLowerCase().includes(needle) ||
        ticket.requesterName.toLowerCase().includes(needle) ||
        ticket.id.toLowerCase().includes(needle) ||
        ticket.company.toLowerCase().includes(needle)
    )
  }, [filteredByBuilder, globalSearch])

  const columns = useMemo<ColumnDef<DataGridFeatures, Ticket>[]>(
    () => [
      {
        accessorKey: "id",
        id: "id",
        header: "Ticket",
        size: 280,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="min-w-0 space-y-0.5">
            <div className="text-muted-foreground font-mono text-xs">
              {row.original.id}
            </div>
            <div className="text-foreground line-clamp-1 font-medium">
              {row.original.subject}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "requesterName",
        id: "requester",
        header: "Requester",
        size: 200,
        cell: ({ row }) => (
          <div className="min-w-0 space-y-0.5">
            <div className="line-clamp-1">{row.original.requesterName}</div>
            <div className="text-muted-foreground line-clamp-1 text-xs">
              {row.original.company}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        id: "status",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title="Status"
            filter={
              <DataGridColumnFilter
                column={column}
                title="Status"
                options={STATUSES.map((s) => ({
                  label: s.label,
                  value: s.value,
                }))}
              />
            }
          />
        ),
        size: 160,
        filterFn: filterFn_arrHas,
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "priority",
        id: "priority",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title="Priority"
            filter={
              <DataGridColumnFilter
                column={column}
                title="Priority"
                options={PRIORITIES.map((p) => ({
                  label: p.label,
                  value: p.value,
                }))}
              />
            }
          />
        ),
        size: 120,
        filterFn: filterFn_arrHas,
        cell: ({ row }) => <PriorityBadge priority={row.original.priority} />,
      },
      {
        accessorKey: "assignee",
        id: "assignee",
        header: "Assignee",
        size: 170,
        cell: ({ row }) => (
          <AssigneeAvatar assignee={row.original.assignee} showName />
        ),
      },
      {
        accessorKey: "channel",
        id: "channel",
        header: "Channel",
        size: 120,
        cell: ({ row }) => <ChannelTag channel={row.original.channel} />,
      },
      {
        accessorKey: "updatedAt",
        id: "updatedAt",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title="Updated" />
        ),
        size: 110,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm tabular-nums">
            {formatRelativeTime(row.original.updatedAt)}
          </span>
        ),
      },
    ],
    []
  )

  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: searched,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id,
  })

  return (
    <DataGrid
      table={table}
      recordCount={searched.length}
      tableLayout={{ rowBorder: true, headerBackground: true }}
      emptyMessage="No tickets match these filters."
    >
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full max-w-xs">
              <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search tickets, requesters, companies..."
                className="pl-8"
              />
            </div>
            <DataGridColumnVisibility
              table={table}
              trigger={
                <Button variant="outline" size="sm">
                  <Settings2Icon className="size-4" />
                  Columns
                </Button>
              }
            />
            <div className="text-muted-foreground ms-auto text-sm">
              {searched.length} of {tickets.length} tickets
            </div>
          </div>
          <Filters
            fields={ticketFilterFields}
            query={query}
            onQueryChange={setQuery}
            showClear
          />
        </div>

        <Card className="p-0">
          <DataGridContainer>
            <DataGridScrollArea>
              <DataGridTable />
            </DataGridScrollArea>
          </DataGridContainer>
        </Card>
        <DataGridPagination />
      </div>
    </DataGrid>
  )
}
