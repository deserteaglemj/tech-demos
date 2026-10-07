import evidence from "./evidence.json";

export type PhaseId = "decompile" | "understand" | "recreate";

export type ToolCall = {
  tool: string;
  args: Record<string, string>;
  note: string;
};

export type Phase = {
  id: PhaseId;
  title: string;
  blurb: string;
  tools: ToolCall[];
};

export const PROMPT =
  "Understand how offline search works in Inkdesk, show the evidence, and build a version for my project.";

export const PHASES: Phase[] = [
  {
    id: "decompile",
    title: "Decompile",
    blurb:
      "Open the shipped JavaScript tree. REA inventories files, recovers ESM modules, and returns an Evidence envelope — without executing the app.",
    tools: [
      {
        tool: "analyze_javascript_application",
        args: { input_path: "fixture/", format: "directory" },
        note: "Static AST reconstruction → JavaScript Application Graph + Evidence v2.",
      },
    ],
  },
  {
    id: "understand",
    title: "Understand",
    blurb:
      "Follow imports from the package entrypoint into SearchIndex. Bind storage key inkdesk.notes.v1 to hydrateFromLocalStorage, then read tokenize + query.",
    tools: [
      {
        tool: "trace_application_feature",
        args: { seed_kind: "string", seed_value: "inkdesk.notes.v1" },
        note: "Seeded feature trace through authenticated Evidence — storage → SearchIndex.",
      },
      {
        tool: "read_source",
        args: { path: "src/search.js", focus: "SearchIndex.query" },
        note: "Tokenize → intersect posting lists → return matching note bodies.",
      },
    ],
  },
  {
    id: "recreate",
    title: "Recreate",
    blurb:
      "Port the recovered offline index into TypeScript for this playground. Evidence limitations stay visible: static analysis does not prove runtime execution.",
    tools: [
      {
        tool: "agent_edit",
        args: { target: "OfflineSearchIndex", stack: "TypeScript" },
        note: "Agent writes adapted code from Evidence — REA does not clone the app.",
      },
    ],
  },
];

export const SOURCE_SNIPPETS: Record<string, string> = {
  "src/main.js": `import { createWindow } from './window.js';
import { SearchIndex } from './search.js';
import { SyncQueue } from './sync.js';

const index = new SearchIndex();
const queue = new SyncQueue();

export async function boot() {
  const win = createWindow({ title: 'Inkdesk' });
  win.on('ready', () => {
    index.hydrateFromLocalStorage('inkdesk.notes.v1');
    queue.flushPending();
  });
  return { index, queue, win };
}`,
  "src/search.js": `export class SearchIndex {
  hydrateFromLocalStorage(key) {
    const raw = globalThis.localStorage?.getItem(key);
    if (!raw) return;
    const notes = JSON.parse(raw);
    for (const note of notes) this.upsert(note.id, note.body);
  }
  query(q) {
    const parts = tokenize(q);
    let hits = null;
    for (const part of parts) {
      const set = this.tokens.get(part) || new Set();
      hits = hits ? intersect(hits, set) : new Set(set);
    }
    return [...(hits || [])].map((id) => ({ id, body: this.docs.get(id) }));
  }
}`,
};

export { evidence };
