export interface WikiPage {
  slug: string;
  title: string;
  summary: string;
  body: string;
  /** Slugs this page links out to, in source order (deduped). */
  links: string[];
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
