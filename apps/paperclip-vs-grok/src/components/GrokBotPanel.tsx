import { useEffect, useMemo, useState } from 'react'
import { GROK_TOOLS, type Scenario } from '../data/compare'

type Step = 'name' | 'job' | 'tools' | 'approve' | 'done'

const STEPS: { id: Step; label: string }[] = [
  { id: 'name', label: 'Name bot' },
  { id: 'job', label: 'Assign job' },
  { id: 'tools', label: 'Cloud tools' },
  { id: 'approve', label: 'Ask-first' },
  { id: 'done', label: 'Running' },
]

interface Message {
  who: 'user' | 'bot' | 'system'
  text: string
}

interface Props {
  scenario: Scenario
}

export function GrokBotPanel({ scenario }: Props) {
  const [step, setStep] = useState<Step>('name')
  const [botName, setBotName] = useState('Nightshift')
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [toolsOn, setToolsOn] = useState<string[]>([])
  const [pending, setPending] = useState<string | null>(null)
  const [approvals, setApprovals] = useState(0)
  const [minutes, setMinutes] = useState(0)

  useEffect(() => {
    setStep('name')
    setBotName('Nightshift')
    setMessages([])
    setDraft('')
    setToolsOn([])
    setPending(null)
    setApprovals(0)
    setMinutes(0)
  }, [scenario.id])

  const stepState = (id: Step) => {
    const order = STEPS.map((s) => s.id)
    const cur = order.indexOf(step)
    const i = order.indexOf(id)
    if (i < cur) return 'done'
    if (i === cur) return 'active'
    return 'todo'
  }

  const defaultJob = useMemo(
    () => `Work on this goal while I'm offline: ${scenario.goal}`,
    [scenario.goal],
  )

  function createBot() {
    const name = botName.trim() || 'Nightshift'
    setBotName(name)
    setMessages([
      {
        who: 'system',
        text: `${name} provisioned on the account cloud computer (shared with other Bots).`,
      },
    ])
    setStep('job')
    setDraft(defaultJob)
  }

  function sendJob() {
    const text = draft.trim() || defaultJob
    setMessages((m) => [
      ...m,
      { who: 'user', text },
      {
        who: 'bot',
        text: `On it. I'll keep a durable session and report progress. Enabling browser, files, and terminal…`,
      },
    ])
    setDraft('')
    setStep('tools')
    window.setTimeout(() => {
      setToolsOn([...GROK_TOOLS])
      setStep('approve')
      setPending('Publish a public landing page and email the waitlist')
      setMessages((m) => [
        ...m,
        {
          who: 'system',
          text: 'Ask-first: publish + outbound email need your approval before execution.',
        },
      ])
    }, 650)
  }

  function decide(ok: boolean) {
    if (!pending) return
    setApprovals((n) => n + 1)
    setMessages((m) => [
      ...m,
      {
        who: ok ? 'bot' : 'system',
        text: ok
          ? `Approved “${pending}”. Continuing on the cloud computer while your laptop sleeps.`
          : `Blocked “${pending}”. Staying inside safer local edits + research.`,
      },
    ])
    setPending(null)
    setStep('done')
    setMinutes(12)
  }

  function reset() {
    setStep('name')
    setMessages([])
    setDraft('')
    setToolsOn([])
    setPending(null)
    setApprovals(0)
    setMinutes(0)
  }

  return (
    <section className="lane lane-grok" aria-labelledby="grok-title">
      <header className="lane-head">
        <div>
          <h2 id="grok-title">Grok Bot</h2>
          <p>{scenario.grokBrief}</p>
        </div>
        <span className="lane-tag">Managed harness</span>
      </header>

      <div className="lane-body">
        <div className="stepper" aria-label="Grok Bot flow">
          {STEPS.map((s) => (
            <span key={s.id} className="step-pill" data-state={stepState(s.id)}>
              {s.label}
            </span>
          ))}
        </div>

        {step === 'name' && (
          <>
            <label className="sr-only" htmlFor="bot-name">
              Bot name
            </label>
            <div className="compose">
              <input
                id="bot-name"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="Name your Bot"
              />
              <button type="button" className="btn btn-teal" onClick={createBot}>
                Create
              </button>
            </div>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.88rem' }}>
              Persistent named agent. xAI owns the loop, tools, and cloud machine.
            </p>
          </>
        )}

        {step !== 'name' && (
          <>
            <div className="metrics">
              <div className="metric">
                <strong>1</strong>
                <span>Bot · {botName}</span>
              </div>
              <div className="metric">
                <strong>{approvals}</strong>
                <span>Approvals</span>
              </div>
              <div className="metric">
                <strong>{minutes}m</strong>
                <span>Unattended</span>
              </div>
            </div>

            <div className="tool-row" aria-label="Cloud tools">
              {GROK_TOOLS.map((tool) => (
                <div
                  key={tool}
                  className="tool-chip"
                  data-on={toolsOn.includes(tool) ? 'true' : 'false'}
                >
                  {tool}
                </div>
              ))}
            </div>

            <div className="chat-log" aria-live="polite">
              {messages.map((m, i) => (
                <div key={`${m.who}-${i}`} className="chat-bubble" data-who={m.who}>
                  <small>{m.who}</small>
                  {m.text}
                </div>
              ))}
            </div>

            {step === 'job' && (
              <div className="compose">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Give the Bot a job…"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') sendJob()
                  }}
                />
                <button type="button" className="btn btn-teal" onClick={sendJob}>
                  Send
                </button>
              </div>
            )}

            {step === 'approve' && pending && (
              <div className="ticket">
                <div className="ticket-meta">
                  <span>Ask-first</span>
                  <span>Waiting</span>
                </div>
                <strong>{pending}</strong>
                <div className="cta-row" style={{ marginTop: '0.55rem' }}>
                  <button type="button" className="btn btn-teal" onClick={() => decide(true)}>
                    Approve
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => decide(false)}>
                    Deny
                  </button>
                </div>
              </div>
            )}

            {step === 'done' && (
              <p style={{ margin: 0, opacity: 0.75, fontSize: '0.9rem' }}>
                Fast path for one durable worker. Not a company org chart — and Bots on
                the same account share one computer/credentials boundary.
              </p>
            )}

            {step !== 'job' && (
              <div className="cta-row">
                <button type="button" className="btn btn-ghost" onClick={reset}>
                  Reset lane
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
