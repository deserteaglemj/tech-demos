export type TranscriptTurn =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string }
  | { role: "tool"; name: string; detail: string; result: string; tokens: number; bytes: number };

export type AgentPathResult = {
  label: string;
  mode: "without" | "with";
  transcript: TranscriptTurn[];
  contextTokens: number;
  contextBytes: number;
  answer: string;
};

export type AgentRunResult = {
  task: string;
  without: AgentPathResult;
  with: AgentPathResult;
  savedTokens: number;
  reductionPct: number;
  stats: string;
};

export type FixtureInfo = {
  log: { path: string; bytes: number; lineCount: number };
};

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const body = (await res.json()) as T & { error?: string };
  if (!res.ok) throw new Error(body.error || res.statusText);
  return body;
}

export const api = {
  health: () => json<{ ok: boolean; package: string }>("/api/health"),
  fixtures: () => json<FixtureInfo>("/api/fixtures"),
  agentRun: () =>
    json<AgentRunResult>("/api/agent-run", {
      method: "POST",
      body: "{}",
    }),
};

export function formatTokens(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
