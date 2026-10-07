import {
  cacheKey,
  dropRecording,
  loadCache,
  putRecording,
} from './cache'
import {
  effectFingerprint,
  findByRole,
  performAction,
  readStatus,
  sleep,
} from './screen'
import type {
  CacheEntry,
  LocatorAction,
  RunSummary,
  TraceEvent,
} from './types'

export const TEST_GOAL = 'upgrade the workspace to the Pro plan'
export const ASSERT_GOAL = 'the invoice preview shows a prorated amount'

const LIVE_ACTIONS: LocatorAction[] = [
  { kind: 'click', role: 'button', name: 'Upgrade to Pro' },
  { kind: 'wait', ms: 220 },
  { kind: 'click', role: 'button', name: 'Confirm upgrade' },
]

const HANDOFF_ACTIONS_SCRAMBLED: LocatorAction[] = [
  { kind: 'click', role: 'button', name: 'Go Pro now' },
  { kind: 'wait', ms: 220 },
  { kind: 'click', role: 'button', name: 'Lock it in' },
]

export type RunnerHooks = {
  root: HTMLElement
  forceLive: boolean
  onTrace: (event: TraceEvent) => void
  onCache: (cache: Record<string, CacheEntry>) => void
  resetApp: () => void | Promise<void>
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

async function emit(
  hooks: RunnerHooks,
  event: Omit<TraceEvent, 'id'> & { id?: string },
) {
  const full = { ...event, id: event.id ?? uid('ev') } as TraceEvent
  hooks.onTrace(full)
  await sleep(event.type === 'model' ? 520 : 160)
  return full.id
}

async function runActions(
  hooks: RunnerHooks,
  actions: LocatorAction[],
  mode: 'live' | 'replay',
): Promise<{ ok: boolean; failedAt?: string }> {
  for (const action of actions) {
    const label =
      action.kind === 'wait'
        ? `wait ${action.ms}ms`
        : `${action.kind} ${action.role} "${action.name}"`
    const id = await emit(hooks, {
      type: 'action',
      label,
      status: 'running',
      detail: mode === 'replay' ? 'from .e2e/cache' : 'model tool call',
    })
    const result = await performAction(hooks.root, action)
    hooks.onTrace({
      id,
      type: 'action',
      label,
      detail: result.detail,
      status: result.ok ? 'ok' : 'fail',
    })
    if (!result.ok) {
      return { ok: false, failedAt: result.detail }
    }
  }
  return { ok: true }
}

function discoverLiveActions(root: HTMLElement): LocatorAction[] {
  if (findByRole(root, 'button', 'Go Pro now')) {
    return HANDOFF_ACTIONS_SCRAMBLED
  }
  return LIVE_ACTIONS
}

export async function runDemoTest(hooks: RunnerHooks): Promise<RunSummary> {
  const started = performance.now()
  let modelCalls = 0
  let replayedActs = 0
  let handedOffActs = 0
  let pendingRecording: { goal: string; actions: LocatorAction[] } | null = null
  let cache = loadCache()
  hooks.onCache(cache)

  await hooks.resetApp()
  await sleep(120)

  await emit(hooks, {
    type: 'open',
    label: "app.open('/settings/billing')",
    status: 'ok',
  })

  const entry = hooks.forceLive ? undefined : cache[cacheKey(TEST_GOAL)]
  let actOk = false

  if (entry) {
    const replayId = await emit(hooks, {
      type: 'replay',
      label: `agent.act('${TEST_GOAL}')`,
      detail: 'cache HIT — replaying recorded actions (0 model calls)',
      status: 'running',
      modelCalls: 0,
    })
    const replay = await runActions(hooks, entry.actions, 'replay')
    if (replay.ok) {
      replayedActs += 1
      hooks.onTrace({
        id: replayId,
        type: 'replay',
        label: `agent.act('${TEST_GOAL}')`,
        detail: 'replayed; effect matches recording',
        status: 'ok',
        modelCalls: 0,
      })
      actOk = true
    } else {
      handedOffActs += 1
      cache = dropRecording(cache, TEST_GOAL)
      hooks.onCache(cache)
      hooks.onTrace({
        id: replayId,
        type: 'handoff',
        label: `agent.act('${TEST_GOAL}')`,
        detail: `cache MISS — ${replay.failedAt}; handing off to live agent`,
        status: 'ok',
        modelCalls: 0,
      })
    }
  }

  if (!actOk) {
    const actId = await emit(hooks, {
      type: 'act',
      label: `agent.act('${TEST_GOAL}')`,
      detail: 'live agent path',
      status: 'running',
      modelCalls: 0,
    })

    modelCalls += 1
    await emit(hooks, {
      type: 'model',
      label: 'model.observe(screen)',
      detail: 'reads roles, names, and visible copy',
      status: 'ok',
      modelCalls: 1,
    })

    modelCalls += 1
    await emit(hooks, {
      type: 'model',
      label: 'model.plan(actions)',
      detail: 'chooses upgrade → confirm',
      status: 'ok',
      modelCalls: 1,
    })

    const liveActions = discoverLiveActions(hooks.root)
    const live = await runActions(hooks, liveActions, 'live')

    if (!live.ok) {
      hooks.onTrace({
        id: actId,
        type: 'act',
        label: `agent.act('${TEST_GOAL}')`,
        detail: live.failedAt,
        status: 'fail',
        modelCalls: 2,
      })
      return {
        passed: false,
        modelCalls,
        replayedActs,
        handedOffActs,
        durationMs: performance.now() - started,
      }
    }

    pendingRecording = { goal: TEST_GOAL, actions: liveActions }

    hooks.onTrace({
      id: actId,
      type: 'act',
      label: `agent.act('${TEST_GOAL}')`,
      detail: 'completed; awaiting verification to cache',
      status: 'ok',
      modelCalls: 2,
    })
    actOk = true
  }

  // Deterministic expect — no model
  const expectId = await emit(hooks, {
    type: 'expect',
    label: "expect(screen.getByRole('status')).toContainText('Pro')",
    status: 'running',
  })
  const status = readStatus(hooks.root) || ''
  const expectOk = /pro/i.test(status)
  hooks.onTrace({
    id: expectId,
    type: 'expect',
    label: "expect(screen.getByRole('status')).toContainText('Pro')",
    detail: expectOk ? `got "${status}"` : `expected Pro, got "${status}"`,
    status: expectOk ? 'ok' : 'fail',
  })

  // Semantic assert — always live (model)
  modelCalls += 1
  const assertId = await emit(hooks, {
    type: 'assert',
    label: `agent.assert('${ASSERT_GOAL}')`,
    detail: 'always live — never cached',
    status: 'running',
    modelCalls: 1,
  })
  const invoice = hooks.root.querySelector('[data-invoice]')?.textContent || ''
  const assertOk = /prorat/i.test(invoice)
  hooks.onTrace({
    id: assertId,
    type: 'assert',
    label: `agent.assert('${ASSERT_GOAL}')`,
    detail: assertOk
      ? `model verdict: pass — "${invoice.trim()}"`
      : 'model verdict: fail — no prorated invoice',
    status: assertOk ? 'ok' : 'fail',
    modelCalls: 1,
  })

  const passed = actOk && expectOk && assertOk

  if (passed && pendingRecording) {
    cache = putRecording(
      cache,
      pendingRecording.goal,
      pendingRecording.actions,
      effectFingerprint(hooks.root),
    )
    hooks.onCache(cache)
    await emit(hooks, {
      type: 'info',
      label: 'cache.write',
      detail: `verified act recorded under .e2e/cache/ (${pendingRecording.actions.length} actions)`,
      status: 'ok',
    })
  }

  return {
    passed,
    modelCalls,
    replayedActs,
    handedOffActs,
    durationMs: performance.now() - started,
  }
}

export function getCacheSnapshot(): Record<string, CacheEntry> {
  return loadCache()
}
