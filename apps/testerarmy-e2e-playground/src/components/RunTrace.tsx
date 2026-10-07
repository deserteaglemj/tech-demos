import type { RunSummary, TraceEvent } from '../lib/types'

type Props = {
  events: TraceEvent[]
  summary: RunSummary | null
  running: boolean
}

function badge(status: TraceEvent['status']) {
  if (status === 'ok') return 'pass'
  if (status === 'fail') return 'fail'
  if (status === 'running') return 'run'
  return 'skip'
}

export function RunTrace({ events, summary, running }: Props) {
  return (
    <section className="panel panel--trace" aria-label="Run trace">
      <header className="panel__head">
        <h2 className="panel__title">Run trace</h2>
        <p className="panel__meta">
          {running
            ? 'Running…'
            : summary
              ? summary.passed
                ? 'Passed'
                : 'Failed'
              : 'Idle'}
        </p>
      </header>

      <ol className="trace">
        {events.length === 0 ? (
          <li className="trace__empty">
            Press Run. First pass calls the simulated model and writes cache;
            second pass should replay with 0 model calls.
          </li>
        ) : (
          events.map((event) => (
            <li
              key={event.id}
              className={`trace__row trace__row--${event.type} is-${badge(event.status)}`}
            >
              <span className="trace__kind">{event.type}</span>
              <div className="trace__body">
                <p className="trace__label">{event.label}</p>
                {event.detail ? <p className="trace__detail">{event.detail}</p> : null}
              </div>
              {'modelCalls' in event && event.modelCalls != null ? (
                <span className="trace__calls">{event.modelCalls} model</span>
              ) : (
                <span className="trace__calls trace__calls--muted">—</span>
              )}
            </li>
          ))
        )}
      </ol>

      {summary ? (
        <dl className="summary">
          <div>
            <dt>Model calls</dt>
            <dd>{summary.modelCalls}</dd>
          </div>
          <div>
            <dt>Replayed acts</dt>
            <dd>{summary.replayedActs}</dd>
          </div>
          <div>
            <dt>Handoffs</dt>
            <dd>{summary.handedOffActs}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>{Math.round(summary.durationMs)}ms</dd>
          </div>
        </dl>
      ) : null}
    </section>
  )
}
