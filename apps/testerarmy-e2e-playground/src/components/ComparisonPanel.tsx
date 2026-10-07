const ROWS: { metric: string; cursor: string; e2eLoc: string; e2eAgent: string }[] = [
  {
    metric: 'Outcome',
    cursor: 'PASS',
    e2eLoc: 'PASS',
    e2eAgent: 'SKIPPED (no API key)',
  },
  {
    metric: 'Time',
    cursor: '220s',
    e2eLoc: '4.3s / 3.9s',
    e2eAgent: 'n/a',
  },
  {
    metric: 'Model tokens',
    cursor: 'opaque (Cursor)',
    e2eLoc: '0',
    e2eAgent: 'needs AI_GATEWAY_API_KEY',
  },
  {
    metric: 'Setup',
    cursor: 'none',
    e2eLoc: 'Node 24 + Playwright',
    e2eAgent: '+ model key',
  },
  {
    metric: 'CI-ready',
    cursor: 'no',
    e2eLoc: 'yes',
    e2eAgent: 'yes (once keyed)',
  },
]

export function ComparisonPanel() {
  return (
    <section className="compare" aria-label="M Studios efficacy comparison">
      <header className="compare__head">
        <p className="compare__kicker">Live efficacy run · mstudios.digital</p>
        <h2 className="compare__title">Cursor native vs TesterArmy e2e</h2>
        <p className="compare__lede">
          Same flow: Get Started → contact form → thank-you toast. Discardable
          evaluation payload only.
        </p>
      </header>

      <div className="compare__table-wrap">
        <table className="compare__table">
          <thead>
            <tr>
              <th scope="col">Metric</th>
              <th scope="col">Cursor native</th>
              <th scope="col">e2e locators</th>
              <th scope="col">e2e agent.act</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.metric}>
                <th scope="row">{row.metric}</th>
                <td>{row.cursor}</td>
                <td>{row.e2eLoc}</td>
                <td>{row.e2eAgent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="compare__verdict">
        <p>
          <strong>One-off:</strong> Cursor wins (zero setup, NL goal).
        </p>
        <p>
          <strong>Repeat / CI:</strong> e2e locators win (~36× faster, scripted).
        </p>
        <p>
          <strong>NL agent + cache story:</strong> inconclusive — no model key in
          this environment, so e2e could not prove it beats Cursor there.
        </p>
      </div>

      <figure className="compare__shot">
        <img
          src="/mstudios-cursor-native-result.png"
          alt="M Studios contact form after Cursor-native submit showing thank-you toast"
        />
        <figcaption>Cursor-native success toast on mstudios.digital/contact</figcaption>
      </figure>
    </section>
  )
}
