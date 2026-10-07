import { useEffect, useRef, useState, useTransition } from 'react'
import { BillingApp } from './components/BillingApp'
import { lineForTrace, TestPanel } from './components/TestPanel'
import { RunTrace } from './components/RunTrace'
import { clearCache } from './lib/cache'
import { getCacheSnapshot, runDemoTest } from './lib/runner'
import type { CacheEntry, RunSummary, TraceEvent } from './lib/types'
import { StudioDemo } from './studio/StudioDemo'

type Mode = 'studio' | 'lab'

function readMode(): Mode {
  const q = new URLSearchParams(window.location.search).get('mode')
  if (q === 'lab') return 'lab'
  return 'studio'
}

function PlaygroundLab({ onOpenStudio }: { onOpenStudio: () => void }) {
  const appRootRef = useRef<HTMLDivElement>(null)
  const [scrambleLabels, setScrambleLabels] = useState(false)
  const [forceLive, setForceLive] = useState(false)
  const [resetToken, setResetToken] = useState(0)
  const [events, setEvents] = useState<TraceEvent[]>([])
  const [summary, setSummary] = useState<RunSummary | null>(null)
  const [running, setRunning] = useState(false)
  const [highlightLine, setHighlightLine] = useState<number | null>(null)
  const [cache, setCache] = useState<Record<string, CacheEntry>>({})
  const [, startTransition] = useTransition()

  useEffect(() => {
    setCache(getCacheSnapshot())
  }, [])

  async function handleRun() {
    if (running || !appRootRef.current) return
    setRunning(true)
    setEvents([])
    setSummary(null)
    setHighlightLine(null)

    const result = await runDemoTest({
      getRoot: () => {
        const el = appRootRef.current
        if (!el) throw new Error('App under test is not mounted')
        return el
      },
      forceLive,
      resetApp: () =>
        new Promise<void>((resolve) => {
          setResetToken((n) => n + 1)
          window.setTimeout(resolve, 80)
        }),
      onCache: (next) => startTransition(() => setCache(next)),
      onTrace: (event) => {
        setEvents((prev) => {
          const idx = prev.findIndex((e) => e.id === event.id)
          if (idx === -1) return [...prev, event]
          const copy = prev.slice()
          copy[idx] = event
          return copy
        })
        const line = lineForTrace(event.type)
        if (line) setHighlightLine(line)
      },
    })

    setSummary(result)
    setRunning(false)
  }

  function handleClearCache() {
    clearCache()
    setCache({})
    setSummary(null)
    setEvents([])
    setHighlightLine(null)
  }

  const cacheCount = Object.keys(cache).length

  return (
    <div className="shell">
      <div className="atmosphere" aria-hidden="true" />

      <header className="hero">
        <div className="hero__brand">
          <p className="hero__mark">e2e</p>
          <p className="hero__by">by TesterArmy · Lab</p>
        </div>
        <h1 className="hero__headline">
          Natural-language goals. Locator checks. Cached replay.
        </h1>
        <p className="hero__lede">
          Interactive lab: run a simulated{' '}
          <code>agent.act</code>, watch cache replay, scramble labels to force
          handoff.
        </p>
        <div className="hero__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleRun}
            disabled={running}
          >
            {running ? 'Running…' : 'Run test'}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={handleClearCache}
            disabled={running}
          >
            Clear cache
          </button>
          <button type="button" className="btn btn--ghost" onClick={onOpenStudio}>
            Studio demo
          </button>
        </div>
      </header>

      <section className="controls" aria-label="Demo controls">
        <label className="toggle">
          <input
            type="checkbox"
            checked={scrambleLabels}
            disabled={running}
            onChange={(e) => setScrambleLabels(e.target.checked)}
          />
          <span>Scramble UI labels</span>
          <em>forces cache miss → agent handoff</em>
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={forceLive}
            disabled={running}
            onChange={(e) => setForceLive(e.target.checked)}
          />
          <span>Force live agent</span>
          <em>like --no-cache</em>
        </label>
        <p className="cache-pill" data-count={cacheCount}>
          .e2e/cache · {cacheCount} recording{cacheCount === 1 ? '' : 's'}
        </p>
      </section>

      <div className="stage">
        <TestPanel highlightLine={highlightLine} />
        <section className="panel panel--app" aria-label="App under test">
          <header className="panel__head">
            <h2 className="panel__title">App under test</h2>
            <p className="panel__meta">Embedded billing slice</p>
          </header>
          <BillingApp
            key={resetToken}
            scrambleLabels={scrambleLabels}
            rootRef={appRootRef}
          />
        </section>
        <RunTrace events={events} summary={summary} running={running} />
      </div>

      <footer className="foot">
        <a href="https://github.com/tester-army/e2e" target="_blank" rel="noreferrer">
          github.com/tester-army/e2e
        </a>
        <span>Lab mode · simulated runner</span>
      </footer>
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState<Mode>(() => readMode())
  const autoPlay =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('play') === '1'

  function goStudio() {
    const url = new URL(window.location.href)
    url.searchParams.delete('mode')
    window.history.replaceState({}, '', url)
    setMode('studio')
  }

  function goLab() {
    const url = new URL(window.location.href)
    url.searchParams.set('mode', 'lab')
    window.history.replaceState({}, '', url)
    setMode('lab')
  }

  if (mode === 'lab') {
    return <PlaygroundLab onOpenStudio={goStudio} />
  }

  return <StudioDemo onOpenLab={goLab} autoPlay={autoPlay} />
}
