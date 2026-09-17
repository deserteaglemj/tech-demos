/**
 * Minimal front-matter parser — just enough for `key: value` pairs between
 * `---` fences. Avoids pulling in a YAML dependency for a handful of flat
 * string fields.
 */
export interface ParsedDoc {
  meta: Record<string, string>;
  body: string;
}

export function parseFrontmatter(raw: string): ParsedDoc {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) {
    return { meta: {}, body: raw.trim() };
  }
  const [, frontmatter, body] = match;
  const meta: Record<string, string> = {};
  for (const line of frontmatter.split(/\r?\n/)) {
    const lineMatch = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!lineMatch) continue;
    const [, key, value] = lineMatch;
    meta[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body: body.trim() };
}
