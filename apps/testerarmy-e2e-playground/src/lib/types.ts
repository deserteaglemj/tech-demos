export type Plan = 'free' | 'pro'

export type AppSnapshot = {
  plan: Plan
  showUpgradeModal: boolean
  invoicePreview: string | null
  statusText: string | null
  scrambleLabels: boolean
}

export type LocatorAction =
  | { kind: 'click'; role: string; name: string }
  | { kind: 'wait'; ms: number }

export type TraceEvent = {
  id: string
  type:
    | 'open'
    | 'act'
    | 'assert'
    | 'expect'
    | 'replay'
    | 'handoff'
    | 'model'
    | 'info'
    | 'action'
  label: string
  detail?: string
  status: 'running' | 'ok' | 'fail' | 'skip'
  modelCalls?: number
}

export type CacheEntry = {
  goal: string
  actions: LocatorAction[]
  effectFingerprint: string
  recordedAt: number
}

export type RunSummary = {
  passed: boolean
  modelCalls: number
  replayedActs: number
  handedOffActs: number
  durationMs: number
}
