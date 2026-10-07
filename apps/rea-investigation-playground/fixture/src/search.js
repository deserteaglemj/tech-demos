/** Offline full-text search over local notes — no network. */
export class SearchIndex {
  constructor() {
    this.tokens = new Map();
    this.docs = new Map();
  }
  hydrateFromLocalStorage(key) {
    const raw = globalThis.localStorage?.getItem(key);
    if (!raw) return;
    const notes = JSON.parse(raw);
    for (const note of notes) this.upsert(note.id, note.body);
  }
  upsert(id, body) {
    this.docs.set(id, body);
    for (const token of tokenize(body)) {
      if (!this.tokens.has(token)) this.tokens.set(token, new Set());
      this.tokens.get(token).add(id);
    }
  }
  query(q) {
    const parts = tokenize(q);
    if (!parts.length) return [];
    let hits = null;
    for (const part of parts) {
      const set = this.tokens.get(part) || new Set();
      hits = hits ? intersect(hits, set) : new Set(set);
    }
    return [...(hits || [])].map((id) => ({ id, body: this.docs.get(id) }));
  }
}
function tokenize(text) {
  return String(text).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}
function intersect(a, b) {
  return new Set([...a].filter((x) => b.has(x)));
}
