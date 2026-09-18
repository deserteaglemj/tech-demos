import { titleFor, wikiIndex } from "./wiki";

const WIKI_LINK = /\[\[([a-z0-9-]+)\]\]/gi;

/**
 * Rewrites `[[slug]]` wiki-links into standard markdown links pointing at
 * our in-app hash routes, using the target page's real title as the label.
 * Unknown slugs are left as plain text (no dangling links in the UI).
 */
export function renderWikiLinks(body: string): string {
  return body.replace(WIKI_LINK, (whole, rawSlug: string) => {
    const slug = rawSlug.toLowerCase();
    if (!wikiIndex.pages.has(slug)) return whole;
    return `[${titleFor(slug)}](#/wiki/${slug})`;
  });
}
