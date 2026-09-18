import { parseFrontmatter } from "./frontmatter";
import type { GraphEdge, WikiIndex, WikiPage } from "./types";

// Vite feature: eagerly import every markdown file in content/ as raw text.
const rawDocs = import.meta.glob("../../content/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const WIKI_LINK = /\[\[([a-z0-9-]+)\]\]/gi;

function slugFromPath(path: string): string {
  const file = path.split("/").pop() ?? path;
  return file.replace(/\.md$/, "");
}

function extractLinks(body: string): string[] {
  const seen = new Set<string>();
  const links: string[] = [];
  for (const match of body.matchAll(WIKI_LINK)) {
    const slug = match[1].toLowerCase();
    if (!seen.has(slug)) {
      seen.add(slug);
      links.push(slug);
    }
  }
  return links;
}

function buildIndex(): WikiIndex {
  const pages = new Map<string, WikiPage>();
  const order: string[] = [];

  const sortedPaths = Object.keys(rawDocs).sort();
  for (const path of sortedPaths) {
    const slug = slugFromPath(path);
    const { meta, body } = parseFrontmatter(rawDocs[path]);
    pages.set(slug, {
      slug,
      title: meta.title ?? slug,
      summary: meta.summary ?? "",
      body,
      links: extractLinks(body),
    });
    order.push(slug);
  }

  // Drop links that point at pages which don't exist, so the UI/graph never
  // dangles on a broken reference.
  for (const page of pages.values()) {
    page.links = page.links.filter((slug) => pages.has(slug));
  }

  const edges: GraphEdge[] = [];
  const backlinks = new Map<string, string[]>();
  for (const slug of order) backlinks.set(slug, []);

  for (const page of pages.values()) {
    for (const target of page.links) {
      edges.push({ source: page.slug, target });
      backlinks.get(target)?.push(page.slug);
    }
  }

  return { pages, order, edges, backlinks };
}

export const wikiIndex = buildIndex();

export function getPage(slug: string): WikiPage | undefined {
  return wikiIndex.pages.get(slug);
}

export function getBacklinks(slug: string): string[] {
  return wikiIndex.backlinks.get(slug) ?? [];
}

export function titleFor(slug: string): string {
  return wikiIndex.pages.get(slug)?.title ?? slug;
}
