import { useState } from "react"
import { LayoutGridIcon, TableIcon } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/reui/badge"

import { generateTickets, type Ticket } from "@/data/tickets"
import { TicketsDataGrid } from "@/components/tickets-data-grid"
import { TicketsKanban } from "@/components/tickets-kanban"
import { ErrorBoundary } from "@/components/error-boundary"

function App() {
  const [tickets, setTickets] = useState<Ticket[]>(() => generateTickets())

  return (
    <div className="min-h-svh bg-muted/30">
      <header className="bg-background sticky top-0 z-30 border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg font-semibold">
              R
            </div>
            <div>
              <h1 className="text-sm font-semibold leading-none">
                Helpdesk Ops Console
              </h1>
              <p className="text-muted-foreground text-xs">
                Support ticket triage &middot; built with ReUI
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {tickets.length} tickets
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Tabs defaultValue="grid">
          <TabsList>
            <TabsTrigger value="grid" className="gap-1.5">
              <TableIcon className="size-4" />
              Data Grid
            </TabsTrigger>
            <TabsTrigger value="kanban" className="gap-1.5">
              <LayoutGridIcon className="size-4" />
              Kanban
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-4">
            <TicketsDataGrid tickets={tickets} />
          </TabsContent>
          <TabsContent value="kanban" className="mt-4">
            <ErrorBoundary label="Kanban board">
              <TicketsKanban tickets={tickets} onTicketsChange={setTickets} />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App
