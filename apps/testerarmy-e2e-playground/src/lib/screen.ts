import type { LocatorAction } from './types'

function normalize(text: string) {
  return text.replace(/\s+/g, ' ').trim()
}

export function findByRole(
  root: HTMLElement,
  role: string,
  name: string,
): HTMLElement | null {
  const wanted = normalize(name).toLowerCase()
  const candidates = root.querySelectorAll<HTMLElement>(
    role === 'button' ? 'button, [role="button"]' : `[role="${role}"]`,
  )

  for (const el of candidates) {
    const accessible =
      el.getAttribute('aria-label') ||
      el.getAttribute('data-name') ||
      el.textContent ||
      ''
    if (normalize(accessible).toLowerCase() === wanted) {
      if (el instanceof HTMLButtonElement && el.disabled) continue
      return el
    }
  }

  // Buttons without explicit role
  if (role === 'button') {
    for (const el of root.querySelectorAll<HTMLButtonElement>('button')) {
      const accessible =
        el.getAttribute('aria-label') ||
        el.getAttribute('data-name') ||
        el.textContent ||
        ''
      if (normalize(accessible).toLowerCase() === wanted && !el.disabled) {
        return el
      }
    }
  }

  if (role === 'status' || role === 'alert') {
    for (const el of root.querySelectorAll<HTMLElement>(`[role="${role}"]`)) {
      const accessible = el.textContent || ''
      if (!wanted || normalize(accessible).toLowerCase().includes(wanted)) {
        return el
      }
    }
  }

  return null
}

export async function performAction(
  root: HTMLElement,
  action: LocatorAction,
): Promise<{ ok: boolean; detail: string }> {
  if (action.kind === 'wait') {
    await sleep(action.ms)
    return { ok: true, detail: `wait ${action.ms}ms` }
  }

  const el = findByRole(root, action.role, action.name)
  if (!el) {
    return {
      ok: false,
      detail: `missing ${action.role} "${action.name}"`,
    }
  }
  el.click()
  await sleep(180)
  return { ok: true, detail: `${action.kind} ${action.role} "${action.name}"` }
}

export function readStatus(root: HTMLElement): string | null {
  const el = root.querySelector<HTMLElement>('[role="status"]')
  return el?.textContent ? normalize(el.textContent) : null
}

export function effectFingerprint(root: HTMLElement): string {
  const plan = root.getAttribute('data-plan') || 'unknown'
  const status = readStatus(root) || ''
  const invoice = root.querySelector('[data-invoice]')?.textContent || ''
  return `${plan}|${status}|${normalize(invoice)}`
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
