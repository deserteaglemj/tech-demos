import { test } from '@e2e-dev/web'
import { expect } from 'e2e'

/**
 * Deterministic (no model) path for the M Studios Get Started → contact intake.
 * Same form data as the Cursor-native efficacy run.
 *
 * Inputs are not wired with label[for]/id, so placeholders are the stable locators.
 */
test('locator path: Get Started → fill contact → submit', async ({ app, screen }) => {
  const started = Date.now()

  await app.open('/')
  await screen.getByRole('link', 'Get Started').click()

  await expect(screen.getByRole('heading', "Let's Create Together")).toBeVisible()

  await screen.getByPlaceholder('Your name').fill('E2E Eval Bot')
  await screen.getByPlaceholder('your@email.com').fill('e2e-eval+discard@example.com')
  await screen
    .getByPlaceholder('Your company')
    .fill('Cursor Efficacy Test — PLEASE IGNORE/DISCARD')
  await screen
    .getByPlaceholder('Tell us about your project...')
    .fill(
      'AUTOMATED TOOL EVALUATION ONLY. This is not a real inquiry. Please discard. Comparing Cursor agent vs TesterArmy e2e on your public contact form. No follow-up needed.',
    )

  await screen.getByRole('button', 'Send Message').click()

  await expect(
    screen.getByText("Thank you for reaching out! We'll get back to you soon."),
  ).toBeVisible()

  // Printed for the efficacy report collector
  console.log(
    JSON.stringify({
      runner: 'testerarmy-e2e-locators',
      durationMs: Date.now() - started,
      success: true,
    }),
  )
})
