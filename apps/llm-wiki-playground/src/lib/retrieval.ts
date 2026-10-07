import { titleFor, wikiIndex } from "./wiki";
import type { WikiPage } from "./types";

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "of", "in", "on", "at", "to", "for", "and", "or", "but", "with",
  "what", "why", "how", "when", "where", "who", "which", "does", "do",
  "did", "can", "could", "would", "should", "will", "it", "its", "this",
  "that", "these", "those", "as", "by", "from", "about", "into", "than",
  "i", "you", "me", "my", "your", "explain", "tell", "please",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .match(/[a-z0-9]+/g)
    ?.filter((t) => t.length > 1 && !STOPWORDS.has(t)) ?? [];
}

/** Swaps `[[slug]]` markup for the target page's real title (plain text, no link). */
function resolveWikiLinksToPlainText(body: string): string {
  return body.replace(/\[\[([a-z0-9-]+)\]\]/gi, (whole, slug: string) =>
    wikiIndex.pages.has(slug.toLowerCase()) ? titleFor(slug.toLowerCase()) : whole,
  );
}

function splitSentences(body: string): string[] {
  return resolveWikiLinksToPlainText(body)
    .replace(/[#*_`>]/g, "")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
}

interface ScoredPage {
  page: WikiPage;
  score: number;
}

function scorePages(queryTokens: string[]): ScoredPage[] {
  const scored: ScoredPage[] = [];
  for (const page of wikiIndex.pages.values()) {
    const titleTokens = new Set(tokenize(page.title));
    const bodyTokens = tokenize(page.body);
    const bodyCounts = new Map<string, number>();
    for (const t of bodyTokens) bodyCounts.set(t, (bodyCounts.get(t) ?? 0) + 1);

    let score = 0;
    for (const qt of queryTokens) {
      if (titleTokens.has(qt)) score += 5;
      score += (bodyCounts.get(qt) ?? 0) * 1;
    }
    if (score > 0) scored.push({ page, score });
  }
  return scored.sort((a, b) => b.score - a.score);
}

function bestSentences(page: WikiPage, queryTokens: string[], limit = 2): string[] {
  const sentences = splitSentences(page.body);
  const qSet = new Set(queryTokens);
  const scored = sentences.map((sentence) => {
    const tokens = tokenize(sentence);
    const hits = tokens.filter((t) => qSet.has(t)).length;
    return { sentence, hits };
  });
  return scored
    .filter((s) => s.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, limit)
    .map((s) => s.sentence);
}

export interface RetrievedSource {
  slug: string;
  title: string;
  sentences: string[];
}

export interface RetrievalResult {
  matched: boolean;
  sources: RetrievedSource[];
}

/** Pure, local, no-API-key retrieval over the seeded wiki content. */
export function retrieve(question: string, maxSources = 2): RetrievalResult {
  const queryTokens = tokenize(question);
  if (queryTokens.length === 0) {
    return { matched: false, sources: [] };
  }

  const ranked = scorePages(queryTokens).slice(0, maxSources);
  const sources: RetrievedSource[] = ranked.map(({ page }) => ({
    slug: page.slug,
    title: page.title,
    sentences: bestSentences(page, queryTokens),
  })).filter((s) => s.sentences.length > 0);

  return { matched: sources.length > 0, sources };
}

/** Formats a retrieval result as a canned, grounded markdown answer. */
export function formatMockAnswer(question: string, result: RetrievalResult): string {
  if (!result.matched) {
    const suggestions = Array.from(wikiIndex.pages.values())
      .slice(0, 4)
      .map((p) => `[${p.title}](#/wiki/${p.slug})`)
      .join(", ");
    return (
      `I couldn't find anything in this wiki about "${question.trim()}". ` +
      `Try asking about one of: ${suggestions}.`
    );
  }

  const parts: string[] = [];
  for (const source of result.sources) {
    const quote = source.sentences.join(" ");
    parts.push(`> ${quote}\n>\n> — from **[${source.title}](#/wiki/${source.slug})**`);
  }
  return parts.join("\n\n");
}
