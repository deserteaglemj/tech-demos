export type FixtureInfo = {
  log: {
    path: string;
    bytes: number;
    preview: string;
    lineCount: number;
  };
  docs: Array<{ name: string; bytes: number }>;
};

export type CompareResult = {
  scenario: string;
  rawPreview: string;
  rawBytes: number;
  sandboxed: string;
  keptBytes: number;
  savedBytes: number;
  reduction: number;
  stats: string;
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
  doctor: () => json<{ text: string }>("/api/doctor"),
  stats: () => json<{ text: string }>("/api/stats"),
  compare: (scenario: string) =>
    json<CompareResult>("/api/compare", {
      method: "POST",
      body: JSON.stringify({ scenario }),
    }),
  index: () => json<{ indexed: number; text: string }>("/api/index", { method: "POST", body: "{}" }),
  search: (query: string) =>
    json<{ text: string }>("/api/search", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),
};

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}
