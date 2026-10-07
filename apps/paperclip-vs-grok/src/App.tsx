import { useState } from 'react'
import { CompareMatrix } from './components/CompareMatrix'
import { GrokBotPanel } from './components/GrokBotPanel'
import { InstallPanel } from './components/InstallPanel'
import { PaperclipPanel } from './components/PaperclipPanel'
import { SCENARIOS, type ScenarioId } from './data/compare'

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="8" fill="#1c2a38" />
      <path
        d="M12 10c0-2.8 2.2-5 5-5s5 2.2 5 5v15c0 1.4-1.1 2.5-2.5 2.5S17 21.4 17 20V12.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V24h2.5V12.5c0-2.2-1.8-4-4-4s-4 1.8-4 4V26c0 3.6 2.9 6.5 6.5 6.5S27 29.6 27 26V11h2.5v15c0 5-4 9-9 9s-9-4-9-9V10z"
        fill="#d4b483"
      />
      <circle cx="29.5" cy="28" r="4.2" stroke="#5ec8b0" strokeWidth="1.8" fill="none" />
      <path
        d="M27.8 28h3.4M29.5 26.3v3.4"
        stroke="#5ec8b0"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function App() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('notes-mrr')
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0]

  function scrollToLab() {
    document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function scrollToInstall() {
    document.getElementById('install')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="brand-row">
          <a className="brand" href="#lab" aria-label="Paperclip vs Grok">
            <BrandMark />
            <span className="brand-name">
              Paperclip <em>vs</em> Grok
            </span>
          </a>
          <span className="brand-vs">agent company · cloud bot</span>
        </div>
        <h1>Install the company control plane. Compare it to an always-on Bot.</h1>
        <p className="hero-lead">
          Paperclip orchestrates many BYO agents with org charts, goals, budgets, and
          heartbeats. Grok Bot is a managed worker on a shared cloud computer. Play both
          lanes on one scenario — then install the real Paperclip CLI.
        </p>
        <div className="cta-row">
          <button type="button" className="btn btn-primary" onClick={scrollToLab}>
            Run comparison lab
          </button>
          <button type="button" className="btn btn-ghost" onClick={scrollToInstall}>
            Install Paperclip
          </button>
          <a
            className="btn btn-ghost"
            href="https://github.com/paperclipai/paperclip"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </header>

      <div className="scenario-bar" id="lab">
        <div className="scenario-label">Shared scenario</div>
        <div className="scenario-tabs" role="tablist" aria-label="Scenarios">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              className="scenario-tab"
              aria-selected={s.id === scenarioId}
              onClick={() => setScenarioId(s.id)}
            >
              {s.title}
            </button>
          ))}
        </div>
        <div className="goal-banner">
          <strong>Goal both lanes share</strong>
          <p>{scenario.goal}</p>
        </div>
      </div>

      <div className="dual">
        <PaperclipPanel scenario={scenario} />
        <GrokBotPanel scenario={scenario} />
      </div>

      <section className="section" aria-labelledby="matrix-title">
        <h2 id="matrix-title">Where they diverge</h2>
        <p>
          Same mission, different machines. Paperclip is the company; Grok Bot is an
          employee you rent — and Paperclip can even hire Grok-class adapters into its org.
        </p>
        <CompareMatrix />
      </section>

      <section className="section" id="install" aria-labelledby="install-title">
        <h2 id="install-title">Install Paperclip locally</h2>
        <p>
          Official path from{' '}
          <a href="https://github.com/paperclipai/paperclip" target="_blank" rel="noreferrer">
            paperclipai/paperclip
          </a>
          . Self-hosted, no Paperclip account required.
        </p>
        <InstallPanel />
      </section>

      <aside className="verdict" style={{ marginTop: '2rem' }}>
        <h3>Verdict in one sitting</h3>
        <p>
          Reach for <strong>Grok Bot</strong> when you want one durable cloud worker with
          browser/files/terminal tonight. Reach for <strong>Paperclip</strong> when you are
          coordinating many agents toward a company goal and need budgets, tickets, org
          roles, and an audit trail — the control plane, not the chatbot.
        </p>
      </aside>

      <p className="footer-note">
        Demo UI only — no live agent spend. Real install:{' '}
        <span className="mono">paperclipai onboard --yes</span> →{' '}
        <span className="mono">localhost:3100</span>. Sources:{' '}
        <a href="https://docs.paperclip.ing" target="_blank" rel="noreferrer">
          docs.paperclip.ing
        </a>
        .
      </p>
    </div>
  )
}
