import type { CacheEntry, LocatorAction } from './types'

const STORAGE_KEY = 'testerarmy-e2e-playground-cache-v1'

export function loadCache(): Record<string, CacheEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, CacheEntry>
  } catch {
    return {}
  }
}

export function saveCache(cache: Record<string, CacheEntry>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
}

export function clearCache() {
  localStorage.removeItem(STORAGE_KEY)
}

export function cacheKey(goal: string) {
  return goal.trim().toLowerCase()
}

export function putRecording(
  cache: Record<string, CacheEntry>,
  goal: string,
  actions: LocatorAction[],
  effectFingerprint: string,
): Record<string, CacheEntry> {
  const next = {
    ...cache,
    [cacheKey(goal)]: {
      goal,
      actions,
      effectFingerprint,
      recordedAt: Date.now(),
    },
  }
  saveCache(next)
  return next
}

export function dropRecording(
  cache: Record<string, CacheEntry>,
  goal: string,
): Record<string, CacheEntry> {
  const next = { ...cache }
  delete next[cacheKey(goal)]
  saveCache(next)
  return next
}
