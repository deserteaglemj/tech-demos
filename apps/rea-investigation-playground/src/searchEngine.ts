/** Recreated offline search — adapted from Inkdesk fixture findings. */

export type Note = { id: string; body: string };

export class OfflineSearchIndex {
  private tokens = new Map<string, Set<string>>();
  private docs = new Map<string, string>();

  hydrate(notes: Note[]) {
    this.tokens.clear();
    this.docs.clear();
    for (const note of notes) this.upsert(note.id, note.body);
  }

  upsert(id: string, body: string) {
    this.docs.set(id, body);
    for (const token of tokenize(body)) {
      let bucket = this.tokens.get(token);
      if (!bucket) {
        bucket = new Set();
        this.tokens.set(token, bucket);
      }
      bucket.add(id);
    }
  }

  query(q: string): Note[] {
    const parts = tokenize(q);
    if (!parts.length) return [];
    let hits: Set<string> | null = null;
    for (const part of parts) {
      const set = this.tokens.get(part) ?? new Set<string>();
      hits = hits ? intersect(hits, set) : new Set(set);
    }
    return [...(hits ?? [])].map((id) => ({
      id,
      body: this.docs.get(id) ?? "",
    }));
  }
}

function tokenize(text: string): string[] {
  return String(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function intersect(a: Set<string>, b: Set<string>): Set<string> {
  return new Set([...a].filter((x) => b.has(x)));
}

export const SAMPLE_NOTES: Note[] = [
  {
    id: "n1",
    body: "Offline search indexes tokens from local notes without calling the network.",
  },
  {
    id: "n2",
    body: "SyncQueue holds pending mutations until the window ready event fires.",
  },
  {
    id: "n3",
    body: "Inkdesk stores note bodies under localStorage key inkdesk.notes.v1.",
  },
  {
    id: "n4",
    body: "Token intersection ranks multi-word queries across the inverted index.",
  },
];
