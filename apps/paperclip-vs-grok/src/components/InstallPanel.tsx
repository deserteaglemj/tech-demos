import { INSTALL_STEPS } from '../data/compare'

export function InstallPanel() {
  return (
    <div className="install-grid">
      {INSTALL_STEPS.map((step, i) => (
        <div key={step.title} className="install-card">
          <strong>
            {i + 1}. {step.title}
          </strong>
          <code>{step.command}</code>
        </div>
      ))}
      <div className="install-card">
        <strong>Requires</strong>
        <p style={{ margin: 0, color: 'var(--ink-soft)', lineHeight: 1.45 }}>
          Node.js <span className="mono">≥ 24.11</span>. Open{' '}
          <span className="mono">http://localhost:3100</span> for the real Paperclip
          dashboard — hire agents, set goals, and govern spend. This playground
          simulates the mental model without needing API keys.
        </p>
      </div>
    </div>
  )
}
