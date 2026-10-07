import { Component, type ReactNode } from "react"
import { AlertTriangleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ErrorBoundaryProps {
  children: ReactNode
  /** Label shown in the fallback message, e.g. "Kanban board". */
  label: string
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Scoped safety net for the drag-and-drop board. A handful of dnd-kit +
 * React 19 interaction edge cases (rapid, multi-container drags) can throw
 * mid-render; this keeps that contained to the Kanban tab instead of taking
 * down the whole app, and offers a one-click recovery.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error(`[${this.props.label}] recovered from an error:`, error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <AlertTriangleIcon className="text-warning size-6" />
            <p className="text-sm">
              The {this.props.label} hit a snag. Your data is safe.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => this.setState({ hasError: false })}
            >
              Reload {this.props.label}
            </Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
