import { useEffect, useRef, useState } from 'react'
import {
  AGENT_REPLY,
  STUDIO_BEATS,
  TEST_FILE,
  USER_PROMPT,
  type StudioBeat,
} from './script'

type Phase =
  | 'idle'
  | 'brand'
  | 'chat'
  | 'write'
  | 'run'
  | 'output'

type AppStep = 'idle' | 'open' | 'upgrade' | 'confirm' | 'done'

type Props = {
  onOpenLab: () => void
  onOpenResults?: () => void
  autoPlay?: boolean
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms))
}

function useTypedText(full: string, active: boolean, cps = 42) {
  const [text, setText] = useState('')
  useEffect(() => {
    if (!active) {
      setText('')
      return
    }
    setText('')
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setText(full.slice(0, i))
      if (i >= full.length) window.clearInterval(id)
    }, Math.max(12, 1000 / cps))
    return () => window.clearInterval(id)
  }, [full, active, cps])
  return text
}

export function StudioDemo({ onOpenLab, onOpenResults, autoPlay = false }: Props) {
  const [playing, setPlaying] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [beatId, setBeatId] = useState<string | null>(null)
  const [showUser, setShowUser] = useState(false)
  const [showAgent, setShowAgent] = useState(false)
  const [fileReveal, setFileReveal] = useState(0)
  const [appStep, setAppStep] = useState<AppStep>('idle')
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [passed, setPassed] = useState(false)
  const cancelRef = useRef(false)
  const autoStartedRef = useRef(false)

  const userTyped = useTypedText(USER_PROMPT, showUser, 56)
  const agentTyped = useTypedText(AGENT_REPLY, showAgent, 48)

  async function start() {
    cancelRef.current = false
    setPlaying(true)
    setPhase('brand')
    setBeatId(null)
    setShowUser(false)
    setShowAgent(false)
    setFileReveal(0)
    setAppStep('idle')
    setTerminalLines([])
    setPassed(false)

    for (const beat of STUDIO_BEATS) {
      if (cancelRef.current) break
      await playBeat(beat)
    }

    if (!cancelRef.current) {
      setPlaying(false)
      setPhase('output')
    }
  }

  async function playBeat(beat: StudioBeat) {
    setBeatId(beat.id)

    switch (beat.kind) {
      case 'brand':
        setPhase('brand')
        await sleep(beat.ms)
        break
      case 'chat-user':
        setPhase('chat')
        setShowUser(true)
        await sleep(beat.ms)
        break
      case 'chat-agent':
        setPhase('chat')
        setShowAgent(true)
        await sleep(beat.ms)
        break
      case 'write-file':
        setPhase('write')
        setFileReveal(0)
        {
          const lines = TEST_FILE.split('\n')
          const step = beat.ms / Math.max(lines.length, 1)
          for (let i = 1; i <= lines.length; i++) {
            if (cancelRef.current) return
            setFileReveal(i)
            await sleep(step)
          }
        }
        break
      case 'run-start':
        setPhase('run')
        setTerminalLines([
          '$ bunx e2e run tests/checkout.e2e.ts',
          'engine  web · chromium',
          'agent   live (no cache yet)',
        ])
        await sleep(beat.ms)
        break
      case 'drive-app':
        setPhase('run')
        setAppStep(beat.step)
        if (beat.step === 'open') {
          setTerminalLines((t) => [...t, '→ app.open(/settings/billing)'])
        } else if (beat.step === 'upgrade') {
          setTerminalLines((t) => [
            ...t,
            '→ agent.act("upgrade the workspace to the Pro plan")',
            '   model.observe · model.plan · click "Upgrade to Pro"',
          ])
        } else if (beat.step === 'confirm') {
          setTerminalLines((t) => [
            ...t,
            '   click "Confirm upgrade"',
            '→ expect(status).toContainText("Pro")',
          ])
        } else if (beat.step === 'done') {
          setTerminalLines((t) => [
            ...t,
            '→ agent.assert("invoice preview shows a prorated amount")',
            '✓ cache.write  (.e2e/cache · 1 recording)',
          ])
          setPassed(true)
        }
        await sleep(beat.ms)
        break
      case 'output':
        setPhase('output')
        setPassed(true)
        await sleep(beat.ms)
        break
    }
  }

  function stop() {
    cancelRef.current = true
    setPlaying(false)
  }

  useEffect(() => {
    if (!autoPlay || autoStartedRef.current) return
    autoStartedRef.current = true
    const id = window.setTimeout(() => {
      void start()
    }, 400)
    return () => window.clearTimeout(id)
  }, [autoPlay])

  const plan = appStep === 'done' || passed ? 'pro' : 'free'
  const showModal = appStep === 'upgrade' || appStep === 'confirm'
  const fileLines = TEST_FILE.split('\n').slice(0, fileReveal)

  return (
    <div className="studio" data-phase={phase} data-playing={playing ? '1' : '0'}>
      <div className="studio__glow" aria-hidden="true" />

      <header className="studio__top">
        <div className="studio__brand">
          <span className="studio__mark">e2e</span>
          <span className="studio__by">Studio · TesterArmy</span>
        </div>
        <div className="studio__top-actions">
          {!playing ? (
            <button type="button" className="btn btn--primary" onClick={() => void start()}>
              {phase === 'idle' ? 'Play demo' : 'Replay'}
            </button>
          ) : (
            <button type="button" className="btn btn--ghost" onClick={stop}>
              Stop
            </button>
          )}
          <button type="button" className="btn btn--ghost" onClick={onOpenLab}>
            Open lab
          </button>
          {onOpenResults ? (
            <button type="button" className="btn btn--ghost" onClick={onOpenResults}>
              Efficacy results
            </button>
          ) : null}
        </div>
      </header>

      {phase === 'idle' || phase === 'brand' ? (
        <section className={`studio__brand-stage ${phase === 'brand' ? 'is-live' : ''}`}>
          <p className="studio__brand-mark">e2e</p>
          <p className="studio__brand-line">
            Ask your coding agent. It writes the test. e2e runs it.
          </p>
          {phase === 'idle' ? (
            <p className="studio__brand-hint">Website-ready walkthrough · ~25s</p>
          ) : null}
        </section>
      ) : null}

      {phase !== 'idle' && phase !== 'brand' ? (
        <div className="studio__frame">
          <section className="studio__chat" aria-label="AI agent chat">
            <header className="studio__pane-head">
              <span>Agent</span>
              <em>Cursor-style coding chat</em>
            </header>
            <div className="studio__messages">
              {showUser ? (
                <article className="msg msg--user">
                  <p className="msg__who">You</p>
                  <p className="msg__body">
                    {userTyped}
                    {userTyped.length < USER_PROMPT.length ? <span className="caret" /> : null}
                  </p>
                </article>
              ) : null}
              {showAgent ? (
                <article className="msg msg--agent">
                  <p className="msg__who">Agent</p>
                  <p className="msg__body">
                    {agentTyped}
                    {agentTyped.length < AGENT_REPLY.length ? <span className="caret" /> : null}
                  </p>
                </article>
              ) : null}
            </div>
          </section>

          <section className="studio__work" aria-label="Agent workbench">
            <div className="studio__file">
              <header className="studio__pane-head">
                <span>tests/checkout.e2e.ts</span>
                <em>{phase === 'write' || fileReveal > 0 ? 'writing…' : 'waiting'}</em>
              </header>
              <pre className="studio__code">
                <code>
                  {fileLines.length === 0 ? (
                    <span className="studio__code-empty">// agent will write the e2e test here</span>
                  ) : (
                    fileLines.map((line, i) => (
                      <span key={i} className="studio__code-line">
                        <span className="studio__code-n">{i + 1}</span>
                        {line || ' '}
                      </span>
                    ))
                  )}
                </code>
              </pre>
            </div>

            <div className="studio__run-col">
              <div className="studio__app-wrap">
                <header className="studio__pane-head">
                  <span>App under test</span>
                  <em>/settings/billing</em>
                </header>
                <div className="studio-billing" data-plan={plan}>
                  <div className="studio-billing__row">
                    <div>
                      <p className="studio-billing__label">Current plan</p>
                      <p className="studio-billing__plan">{plan === 'pro' ? 'Pro' : 'Free'}</p>
                    </div>
                    {plan === 'free' ? (
                      <button
                        type="button"
                        className={`studio-billing__cta ${appStep === 'upgrade' || appStep === 'confirm' ? 'is-hot' : ''}`}
                      >
                        Upgrade to Pro
                      </button>
                    ) : (
                      <span className="studio-billing__badge">Active</span>
                    )}
                  </div>
                  {showModal ? (
                    <div className="studio-billing__modal">
                      <p>Upgrade to Pro</p>
                      <button
                        type="button"
                        className={`studio-billing__cta ${appStep === 'confirm' ? 'is-hot' : ''}`}
                      >
                        Confirm upgrade
                      </button>
                    </div>
                  ) : null}
                  {plan === 'pro' ? (
                    <p className="studio-billing__invoice">
                      Invoice preview · $12.40 prorated for 18 days remaining
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="studio__terminal">
                <header className="studio__pane-head">
                  <span>e2e run</span>
                  <em>{passed ? 'passed' : playing ? 'running' : 'idle'}</em>
                </header>
                <pre className="studio__term">
                  {terminalLines.map((line, i) => (
                    <span key={`${i}-${line}`} className="studio__term-line">
                      {line}
                    </span>
                  ))}
                </pre>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {phase === 'output' ? (
        <section className="studio__output" aria-live="polite">
          <p className="studio__output-kicker">Output</p>
          <h2 className="studio__output-title">1 passed · cache ready for CI</h2>
          <dl className="studio__metrics">
            <div>
              <dt>Result</dt>
              <dd>PASS</dd>
            </div>
            <div>
              <dt>Model calls</dt>
              <dd>3</dd>
            </div>
            <div>
              <dt>Next run</dt>
              <dd>replay act · 0 model</dd>
            </div>
            <div>
              <dt>Artifact</dt>
              <dd>.e2e/cache</dd>
            </div>
          </dl>
          <p className="studio__output-copy">
            Your agent wrote the goal. e2e drove the app, verified with locators, and recorded
            the act so tomorrow’s PR replays without another model call.
          </p>
        </section>
      ) : null}

      <p className="studio__beat" aria-hidden="true">
        {beatId ? `beat · ${beatId}` : 'ready'}
      </p>
    </div>
  )
}
