import { ASSERT_GOAL, TEST_GOAL } from '../lib/runner'

const CODE = `import { test, expect } from 'e2e';

test('a member upgrades to Pro', async ({ app, agent, screen }) => {
  await app.open('/settings/billing');

  await agent.act('${TEST_GOAL}');
  await agent.assert('${ASSERT_GOAL}');

  await expect(screen.getByRole('status')).toContainText('Pro');
});`

type Props = {
  highlightLine: number | null
}

export function TestPanel({ highlightLine }: Props) {
  const lines = CODE.split('\n')

  return (
    <section className="panel panel--code" aria-label="Test source">
      <header className="panel__head">
        <h2 className="panel__title">tests/checkout.e2e.ts</h2>
        <p className="panel__meta">SDK-shaped demo · no real model</p>
      </header>
      <pre className="code">
        <code>
          {lines.map((line, index) => {
            const n = index + 1
            const active = highlightLine === n
            return (
              <span
                key={n}
                className={active ? 'code__line code__line--active' : 'code__line'}
              >
                <span className="code__n">{n}</span>
                <span className="code__t">{line || ' '}</span>
              </span>
            )
          })}
        </code>
      </pre>
    </section>
  )
}

export function lineForTrace(type: string): number | null {
  switch (type) {
    case 'open':
      return 5
    case 'act':
    case 'replay':
    case 'handoff':
    case 'action':
    case 'model':
      return 7
    case 'assert':
      return 8
    case 'expect':
      return 10
    default:
      return null
  }
}
