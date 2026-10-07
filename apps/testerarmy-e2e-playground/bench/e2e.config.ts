import type { E2EConfig } from 'e2e'
import { web } from '@e2e-dev/web'
import { gateway } from 'ai'

const config = {
  targets: [
    {
      name: 'mstudios',
      engine: web(),
      app: {
        url: 'https://mstudios.digital',
      },
    },
  ],
} satisfies E2EConfig

if (process.env.AI_GATEWAY_API_KEY) {
  ;(config as E2EConfig).agents = {
    default: {
      model: gateway('openai/gpt-4.1-mini'),
      system:
        'You are a careful QA agent completing a public contact form. Prefer labels, roles, and placeholders. Do not invent extra fields.',
    },
  }
}

export default config
