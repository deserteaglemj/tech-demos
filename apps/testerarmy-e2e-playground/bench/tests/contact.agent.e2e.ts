import { test } from '@e2e-dev/web'
import { expect } from 'e2e'

const skip = process.env.AI_GATEWAY_API_KEY
  ? false
  : 'set AI_GATEWAY_API_KEY to run agent.act path'

test('agent path: natural-language contact intake', { skip }, async ({ app, agent, screen }) => {
  await app.open('/')

  await agent.act('open Get Started and reach the contact form')

  await agent.act(
    'fill the contact form with name {name}, email {email}, company {company}, and message {message}, then submit it',
    {
      params: {
        name: 'E2E Eval Bot',
        email: 'e2e-eval+discard@example.com',
        company: 'Cursor Efficacy Test — PLEASE IGNORE/DISCARD',
        message:
          'AUTOMATED TOOL EVALUATION ONLY. This is not a real inquiry. Please discard. Comparing Cursor agent vs TesterArmy e2e on your public contact form. No follow-up needed.',
      },
    },
  )

  await expect(
    screen.getByText("Thank you for reaching out! We'll get back to you soon."),
  ).toBeVisible()
  await agent.assert('the site thanked the visitor for reaching out')
})
