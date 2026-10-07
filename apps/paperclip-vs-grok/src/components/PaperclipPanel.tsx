import { useEffect, useRef, useState } from 'react'
import { PAPERCLIP_ROSTER, type Scenario } from '../data/compare'

type Step = 'hire' | 'budget' | 'goal' | 'run' | 'review'

const STEPS: { id: Step; label: string }[] = [
  { id: 'hire', label: 'Hire' },
  { id: 'budget', label: 'Budgets' },
  { id: 'goal', label: 'Goal' },
  { id: 'run', label: 'Heartbeats' },
  { id: 'review', label: 'Review' },
]

interface Ticket {
  id: string
  title: string
  owner: string
  status: 'queued' | 'running' | 'done' | 'blocked'
}

interface Props {
  scenario: Scenario
}

export function PaperclipPanel({ scenario }: Props) {
  const [step, setStep] = useState<Step>('hire')
  const [hired, setHired] = useState<string[]>([])
  const [spent, setSpent] = useState<Record<string, number>>({})
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [beats, setBeats] = useState(0)
  const [running, setRunning] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    setStep('hire')
    setHired([])
    setSpent({})
    setTickets([])
    setBeats(0)
    setRunning(false)
    if (timer.current) window.clearInterval(timer.current)
  }, [scenario.id])

  useEffect(() => {
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [])

  function toggleHire(id: string) {
    setHired((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function assignBudgets() {
    const next: Record<string, number> = {}
    for (const role of PAPERCLIP_ROSTER) {
      if (hired.includes(role.id)) next[role.id] = 0
    }
    setSpent(next)
    setStep('goal')
  }

  function lockGoal() {
    const owners = PAPERCLIP_ROSTER.filter((r) => hired.includes(r.id))
    const seeded: Ticket[] = [
      {
        id: 'T-101',
        title: 'Break goal into weekly milestones',
        owner: owners.find((o) => o.id === 'ceo')?.title ?? owners[0]?.title ?? 'CEO',
        status: 'queued',
      },
      {
        id: 'T-102',
        title: 'Scaffold product + CI',
        owner: owners.find((o) => o.id === 'eng')?.title ?? owners.at(-1)?.title ?? 'Engineer',
        status: 'queued',
      },
      {
        id: 'T-103',
        title: 'Draft GTM loop for first 100 users',
        owner: owners.find((o) => o.id === 'mkt')?.title ?? owners[0]?.title ?? 'Marketer',
        status: 'queued',
      },
    ]
    setTickets(seeded)
    setStep('run')
  }

  function startHeartbeats() {
    if (running || hired.length === 0) return
    setRunning(true)
    let tick = 0
    timer.current = window.setInterval(() => {
      tick += 1
      setBeats(tick)
      setTickets((prev) => {
        const next = prev.map((t) => ({ ...t }))
        const active = next.find((t) => t.status === 'running')
        if (active) {
          if (tick % 3 === 0) active.status = 'done'
        } else {
          const queued = next.find((t) => t.status === 'queued')
          if (queued) queued.status = 'running'
          else if (timer.current) {
            window.clearInterval(timer.current)
            setRunning(false)
            setStep('review')
          }
        }
        return next
      })
      setSpent((prev) => {
        const next = { ...prev }
        for (const id of Object.keys(next)) {
          const cap = PAPERCLIP_ROSTER.find((r) => r.id === id)?.budget ?? 100
          next[id] = Math.min(cap, next[id] + 4 + Math.floor(Math.random() * 6))
        }
        return next
      })
    }, 700)
  }

  function reset() {
    if (timer.current) window.clearInterval(timer.current)
    setStep('hire')
    setHired([])
    setSpent({})
    setTickets([])
    setBeats(0)
    setRunning(false)
  }

  const stepState = (id: Step) => {
    const order = STEPS.map((s) => s.id)
    const cur = order.indexOf(step)
    const i = order.indexOf(id)
    if (i < cur) return 'done'
    if (i === cur) return 'active'
    return 'todo'
  }

  const totalBudget = PAPERCLIP_ROSTER.filter((r) => hired.includes(r.id)).reduce(
    (sum, r) => sum + r.budget,
    0,
  )
  const totalSpent = Object.values(spent).reduce((a, b) => a + b, 0)
  const doneCount = tickets.filter((t) => t.status === 'done').length

  return (
    <section className="lane lane-paperclip" aria-labelledby="paperclip-title">
      <header className="lane-head">
        <div>
          <h2 id="paperclip-title">Paperclip</h2>
          <p>{scenario.paperclipBrief}</p>
        </div>
        <span className="lane-tag">Control plane</span>
      </header>

      <div className="lane-body">
        <div className="stepper" aria-label="Paperclip flow">
          {STEPS.map((s) => (
            <span key={s.id} className="step-pill" data-state={stepState(s.id)}>
              {s.label}
            </span>
          ))}
        </div>

        {step === 'hire' && (
          <>
            <p className="sr-only">Select agents to hire into the org chart.</p>
            <div className="org-list">
              {PAPERCLIP_ROSTER.map((role) => {
                const on = hired.includes(role.id)
                return (
                  <button
                    key={role.id}
                    type="button"
                    className="org-item"
                    onClick={() => toggleHire(role.id)}
                    aria-pressed={on}
                    style={{
                      outline: on ? '2px solid var(--teal)' : undefined,
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <strong>
                      {on ? '✓ ' : ''}
                      {role.title}
                    </strong>
                    <span>{role.adapter}</span>
                    <span style={{ gridColumn: '1 / -1' }}>
                      budget cap ${role.budget}/mo
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="cta-row">
              <button
                type="button"
                className="btn btn-primary"
                disabled={hired.length === 0}
                onClick={() => setStep('budget')}
              >
                Hire {hired.length || ''} → set budgets
              </button>
            </div>
          </>
        )}

        {step === 'budget' && (
          <>
            <div className="org-list">
              {PAPERCLIP_ROSTER.filter((r) => hired.includes(r.id)).map((role) => (
                <div key={role.id} className="org-item">
                  <strong>{role.title}</strong>
                  <span>${role.budget}</span>
                  <div className="budget-bar" aria-hidden>
                    <div className="budget-fill" style={{ ['--pct' as string]: '0%' }} />
                  </div>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
              When an agent hits its cap, Paperclip pauses that agent — no runaway loops.
            </p>
            <div className="cta-row">
              <button type="button" className="btn btn-primary" onClick={assignBudgets}>
                Lock budgets → attach goal
              </button>
            </div>
          </>
        )}

        {step === 'goal' && (
          <>
            <div className="goal-banner" style={{ margin: 0 }}>
              <strong>Company goal</strong>
              <p>{scenario.goal}</p>
            </div>
            <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
              Every ticket inherits goal ancestry. Agents know the why, not just a chat title.
            </p>
            <div className="cta-row">
              <button type="button" className="btn btn-primary" onClick={lockGoal}>
                Create tickets → start heartbeats
              </button>
            </div>
          </>
        )}

        {(step === 'run' || step === 'review') && (
          <>
            <div className="metrics">
              <div className="metric">
                <strong>{hired.length}</strong>
                <span>Agents</span>
              </div>
              <div className="metric">
                <strong>{beats}</strong>
                <span>Heartbeats</span>
              </div>
              <div className="metric">
                <strong>
                  ${totalSpent}/{totalBudget}
                </strong>
                <span>Spend</span>
              </div>
            </div>

            {running && (
              <div className="heartbeat" role="status">
                <span className="heartbeat-dot" aria-hidden />
                Agents waking on schedule · atomic checkout
              </div>
            )}

            <div className="org-list">
              {PAPERCLIP_ROSTER.filter((r) => hired.includes(r.id)).map((role) => {
                const used = spent[role.id] ?? 0
                const pct = Math.round((used / role.budget) * 100)
                return (
                  <div key={role.id} className="org-item">
                    <strong>{role.title}</strong>
                    <span>
                      ${used} / ${role.budget}
                    </span>
                    <div className="budget-bar" aria-hidden>
                      <div
                        className="budget-fill"
                        style={{ ['--pct' as string]: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="ticket-list">
              {tickets.map((t) => (
                <div key={t.id} className="ticket">
                  <div className="ticket-meta">
                    <span>{t.id}</span>
                    <span>{t.status}</span>
                  </div>
                  <strong>{t.title}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                    Owner · {t.owner}
                  </span>
                </div>
              ))}
            </div>

            <div className="cta-row">
              {step === 'run' && !running && doneCount < tickets.length && (
                <button type="button" className="btn btn-teal" onClick={startHeartbeats}>
                  Hit go — run company
                </button>
              )}
              {step === 'review' && (
                <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: '0.9rem' }}>
                  Board reviews diffs, spend, and outputs — not twenty terminal tabs.
                </p>
              )}
              <button type="button" className="btn btn-ghost" onClick={reset}>
                Reset lane
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
