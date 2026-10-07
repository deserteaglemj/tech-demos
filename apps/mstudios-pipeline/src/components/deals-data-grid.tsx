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

import { FITS, STAGES, type Deal } from "@/data/deals"
import { filterRecordsByQuery } from "@/lib/filter-query"
import { dealFilterFields, getDealFieldValue } from "@/lib/deal-filter-fields"
import {
  FitBadge,
  OwnerAvatar,
  StageBadge,
  VerticalTag,
} from "@/components/deal-chrome"

function formatRelativeTime(iso: string): string {
  const now = new Date("2026-10-07T16:00:00Z").getTime()
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

export function DealsDataGrid({ deals }: { deals: Deal[] }) {
  const [globalSearch, setGlobalSearch] = useState("")
  const [query, setQuery] = useState<FilterQuery>(() => createFilterQuery())
  const [sorting, setSorting] = useState<SortingState>([
    { id: "updatedAt", desc: true },
  ])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const filteredByBuilder = useMemo(
    () => filterRecordsByQuery(deals, query, getDealFieldValue),
    [deals, query]
  )

  const searched = useMemo(() => {
    const needle = globalSearch.trim().toLowerCase()
    if (!needle) return filteredByBuilder
    return filteredByBuilder.filter(
      (deal) =>
        deal.businessName.toLowerCase().includes(needle) ||
        deal.city.toLowerCase().includes(needle) ||
        deal.id.toLowerCase().includes(needle) ||
        deal.problem.toLowerCase().includes(needle)
    )
  }, [filteredByBuilder, globalSearch])

  const columns = useMemo<ColumnDef<DataGridFeatures, Deal>[]>(
    () => [
      {
        accessorKey: "businessName",
        id: "business",
        header: "Business",
        size: 280,
        enableHiding: false,
        cell: ({ row }) => (
          <div className="min-w-0 space-y-0.5">
            <div className="text-muted-foreground font-mono text-xs">
              {row.original.id}
            </div>
            <div className="text-foreground line-clamp-1 font-medium">
              {row.original.businessName}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "city",
        id: "city",
        header: "City",
        size: 200,
        cell: ({ row }) => (
          <div className="min-w-0 space-y-0.5">
            <div className="line-clamp-1">{row.original.city}</div>
            <div className="text-muted-foreground line-clamp-1 text-xs">
              {row.original.phone}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "stage",
        id: "stage",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title="Stage"
            filter={
              <DataGridColumnFilter
                column={column}
                title="Stage"
                options={STAGES.map((s) => ({
                  label: s.label,
                  value: s.value,
                }))}
              />
            }
          />
        ),
        size: 150,
        filterFn: filterFn_arrHas,
        cell: ({ row }) => <StageBadge stage={row.original.stage} />,
      },
      {
        accessorKey: "fit",
        id: "fit",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title="Fit"
            filter={
              <DataGridColumnFilter
                column={column}
                title="Fit"
                options={FITS.map((p) => ({
                  label: p.label,
                  value: p.value,
                }))}
              />
            }
          />
        ),
        size: 130,
        filterFn: filterFn_arrHas,
        cell: ({ row }) => <FitBadge fit={row.original.fit} />,
      },
      {
        accessorKey: "owner",
        id: "owner",
        header: "Owner",
        size: 160,
        cell: ({ row }) => <OwnerAvatar owner={row.original.owner} showName />,
      },
      {
        accessorKey: "vertical",
        id: "vertical",
        header: "Vertical",
        size: 130,
        cell: ({ row }) => <VerticalTag vertical={row.original.vertical} />,
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
      emptyMessage="No prospects match these filters."
    >
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full max-w-xs">
              <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search businesses, cities, problems..."
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
              {searched.length} of {deals.length} prospects
            </div>
          </div>
          <Filters
            fields={dealFilterFields}
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
