import { parseFrontmatter } from "./frontmatter";
import type { Filing, GraphEdge, SourceFile, WikiIndex, WikiPage } from "./types";

const rawWiki = import.meta.glob("../../content/wiki/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const rawSources = import.meta.glob("../../content/sources/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const WIKI_LINK = /\[\[([a-z0-9-]+)\]\]/gi;

function slugFromPath(path: string): string {
  const file = path.split("/").pop() ?? path;
  return file.replace(/\.md$/, "");
}

function listField(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
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

function buildSources(): SourceFile[] {
  return Object.keys(rawSources)
    .sort()
    .map((path) => {
      const slug = slugFromPath(path);
      const { meta, body } = parseFrontmatter(rawSources[path]);
      const virtualPath = meta.path ?? `${slug}.md`;
      const folder = virtualPath.includes("/") ? virtualPath.slice(0, virtualPath.lastIndexOf("/")) : "sources";
      return {
        slug,
        title: meta.title ?? slug,
        path: virtualPath,
        folder,
        body,
      };
    });
}

function buildIndex(sourcePaths: Set<string>): WikiIndex {
  const pages = new Map<string, WikiPage>();
  const order: string[] = [];

  for (const path of Object.keys(rawWiki).sort()) {
    const slug = slugFromPath(path);
    const { meta, body } = parseFrontmatter(rawWiki[path]);
    pages.set(slug, {
      slug,
      title: meta.title ?? slug,
      summary: meta.summary ?? "",
      body,
      concepts: listField(meta.concepts),
      sourcePaths: listField(meta.sources).filter((source) => sourcePaths.has(source)),
      links: extractLinks(body),
    });
    order.push(slug);
  }

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

export const sourceFiles: SourceFile[] = buildSources();

const sourcePathSet = new Set(sourceFiles.map((file) => file.path));

export const wikiIndex = buildIndex(sourcePathSet);

export function getPage(slug: string): WikiPage | undefined {
  return wikiIndex.pages.get(slug);
}

export function getSource(path: string): SourceFile | undefined {
  return sourceFiles.find((file) => file.path === path);
}

export function getBacklinks(slug: string): string[] {
  return wikiIndex.backlinks.get(slug) ?? [];
}

export function titleFor(slug: string): string {
  return wikiIndex.pages.get(slug)?.title ?? slug;
}

export function filingsFor(sourcePath: string): WikiPage[] {
  return wikiIndex.order
    .map((slug) => wikiIndex.pages.get(slug)!)
    .filter((page) => page.sourcePaths.includes(sourcePath));
}

export const filings: Filing[] = sourceFiles.flatMap((file) =>
  filingsFor(file.path).map((page) => ({
    sourcePath: file.path,
    sourceTitle: file.title,
    wikiSlug: page.slug,
    wikiTitle: page.title,
  })),
);
