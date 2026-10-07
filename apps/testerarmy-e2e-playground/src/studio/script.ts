export type StudioBeat =
  | { id: string; kind: 'brand'; ms: number }
  | { id: string; kind: 'chat-user'; ms: number; text: string }
  | { id: string; kind: 'chat-agent'; ms: number; text: string }
  | { id: string; kind: 'write-file'; ms: number }
  | { id: string; kind: 'run-start'; ms: number }
  | { id: string; kind: 'drive-app'; ms: number; step: 'open' | 'upgrade' | 'confirm' | 'done' }
  | { id: string; kind: 'output'; ms: number }

export const USER_PROMPT =
  'Add an e2e test for billing upgrade. Use the TesterArmy e2e package — natural language agent.act for the flow, then locator expects. Run it and show me the result.'

export const AGENT_REPLY =
  'On it. I’ll write tests/checkout.e2e.ts with agent.act + expect, point it at /settings/billing, then run e2e.'

export const TEST_FILE = `import { test, expect } from 'e2e';

test('a member upgrades to Pro', async ({ app, agent, screen }) => {
  await app.open('/settings/billing');

  await agent.act('upgrade the workspace to the Pro plan');
  await agent.assert('the invoice preview shows a prorated amount');

  await expect(screen.getByRole('status')).toContainText('Pro');
});`

export const STUDIO_BEATS: StudioBeat[] = [
  { id: 'brand', kind: 'brand', ms: 1800 },
  {
    id: 'user',
    kind: 'chat-user',
    ms: 4200,
    text: USER_PROMPT,
  },
  {
    id: 'agent',
    kind: 'chat-agent',
    ms: 2800,
    text: AGENT_REPLY,
  },
  { id: 'write', kind: 'write-file', ms: 3200 },
  { id: 'run', kind: 'run-start', ms: 1400 },
  { id: 'open', kind: 'drive-app', ms: 1100, step: 'open' },
  { id: 'upgrade', kind: 'drive-app', ms: 1400, step: 'upgrade' },
  { id: 'confirm', kind: 'drive-app', ms: 1500, step: 'confirm' },
  { id: 'done', kind: 'drive-app', ms: 1200, step: 'done' },
  { id: 'output', kind: 'output', ms: 4500 },
]

export function totalStudioMs() {
  return STUDIO_BEATS.reduce((sum, beat) => sum + beat.ms, 0)
}
