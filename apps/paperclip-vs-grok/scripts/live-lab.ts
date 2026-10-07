#!/usr/bin/env bun
/** Live lab — run real Paperclip + real Grok Bot. Not a fake website. */

const PAPERCLIP_URL = 'http://127.0.0.1:3100'
const args = new Set(process.argv.slice(2))

async function paperclipHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${PAPERCLIP_URL}/api/health`)
    return res.ok
  } catch {
    return false
  }
}

async function ensurePaperclip() {
  if (await paperclipHealth()) {
    console.log(`Paperclip already up at ${PAPERCLIP_URL}`)
    return
  }
  console.log('Starting Paperclip (paperclipai run)...')
  const proc = Bun.spawn(['paperclipai', 'run'], {
    stdout: 'inherit',
    stderr: 'inherit',
    env: { ...process.env, PATH: `/usr/bin:${process.env.HOME}/.local/bin:${process.env.PATH}` },
  })
  for (let i = 0; i < 40; i++) {
    await Bun.sleep(1000)
    if (await paperclipHealth()) {
      console.log(`Paperclip healthy at ${PAPERCLIP_URL}`)
      return
    }
  }
  console.error('Paperclip did not become healthy. Check: paperclipai doctor')
  process.exitCode = 1
  void proc
}

function launchGrokBot() {
  const bin = Bun.which('grok-bot')
  if (!bin) {
    console.log('grok-bot not on PATH. Install from https://cursor.com/download/bot')
    return
  }
  console.log(`Launching Grok Bot (${bin})`)
  console.log('Sign in with your Cursor / Google / X / GitHub account in the app window.')
  Bun.spawn([bin, '--no-sandbox'], {
    stdout: 'ignore',
    stderr: 'ignore',
    env: { ...process.env, DISPLAY: process.env.DISPLAY || ':1' },
  })
}

async function status() {
  const ok = await paperclipHealth()
  console.log(`Paperclip: ${ok ? 'UP ' + PAPERCLIP_URL : 'DOWN'}`)
  console.log(`Grok Bot binary: ${Bun.which('grok-bot') ?? 'NOT INSTALLED'}`)
  console.log('Who uses Paperclip: open Agents + Org in the UI')
  console.log('Who uses Grok Bot: sign in then sidebar Bots')
  console.log('See docs/WHO-USES.md for public adopters')
}

async function main() {
  if (args.has('--status')) {
    await status()
    return
  }
  console.log('=== LIVE LAB: Paperclip vs Grok Bot ===')
  if (!args.has('--grok-only')) await ensurePaperclip()
  if (!args.has('--paperclip-only')) launchGrokBot()
  await status()
  if (!args.has('--grok-only')) console.log(`Open Paperclip UI: ${PAPERCLIP_URL}`)
}

await main()
