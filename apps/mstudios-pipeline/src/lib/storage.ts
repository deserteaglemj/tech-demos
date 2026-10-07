import type { WorkspaceState } from "@/types"
import { createSeedWorkspace } from "@/data/seed"

const KEY = "mstudios-pipeline-v1"

export function loadWorkspace(): WorkspaceState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return createSeedWorkspace()
    const parsed = JSON.parse(raw) as WorkspaceState
    if (parsed?.version !== 1 || !Array.isArray(parsed.deals)) {
      return createSeedWorkspace()
    }
    return parsed
  } catch {
    return createSeedWorkspace()
  }
}

export function saveWorkspace(state: WorkspaceState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function clearWorkspace(): void {
  localStorage.removeItem(KEY)
}
