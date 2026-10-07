export interface WikiPage {
  slug: string;
  title: string;
  summary: string;
  body: string;
  /** Concept ids the agent filed onto this page. They are not copied from the raw files. */
  concepts: string[];
  /** Virtual paths in ~/sources that this page was compiled from. */
  sourcePaths: string[];
  /** Slugs this page links out to, in source order (deduped). */
  links: string[];
}

export interface SourceFile {
  slug: string;
  title: string;
  /** Path as it appears on the fake machine, e.g. calls/northwind-renewal.md */
  path: string;
  folder: string;
  body: string;
}

export interface Filing {
  sourcePath: string;
  sourceTitle: string;
  wikiSlug: string;
  wikiTitle: string;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface WikiIndex {
  pages: Map<string, WikiPage>;
  order: string[];
  edges: GraphEdge[];
  /** slug -> slugs of pages that link to it */
  backlinks: Map<string, string[]>;
}
