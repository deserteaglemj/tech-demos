import { aliasesFor, conceptForAlias } from "./lexicon";
import { getSource, sourceFiles, titleFor, wikiIndex } from "./wiki";
import type { WikiPage } from "./types";

const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "of", "in", "on", "at", "to", "for", "and", "or", "but", "with",
  "what", "why", "how", "when", "where", "who", "which", "does", "do",
  "did", "can", "could", "would", "should", "will", "it", "its", "this",
  "that", "these", "those", "as", "by", "from", "about", "into", "than",
  "i", "you", "me", "my", "your", "we", "our", "they", "their",
  "explain", "tell", "please",
]);

function normalizeToken(token: string): string {
  if (token.length > 4 && token.endsWith("s")) {
    const stem = token.slice(0, -1);
    if (conceptForAlias(stem)) return stem;
  }
  return token;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .match(/[a-z0-9]+/g)
    ?.filter((token) => token.length > 1 && !STOPWORDS.has(token))
    .map(normalizeToken) ?? [];
}

function resolveWikiLinksToPlainText(body: string): string {
  return body.replace(/\[\[([a-z0-9-]+)\]\]/gi, (whole, slug: string) =>
    wikiIndex.pages.has(slug.toLowerCase()) ? titleFor(slug.toLowerCase()) : whole,
  );
}

function splitSentences(body: string): string[] {
  return resolveWikiLinksToPlainText(body)
    .replace(/^#{1,6}\s+.*$/gm, "")
    .replace(/[*_`>]/g, "")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.replace(/\s+/g, " ").trim())
    .filter((sentence) => sentence.length > 20);
}

function sourceText(page: WikiPage): string {
  return page.sourcePaths
    .map((path) => getSource(path)?.body ?? "")
    .join("\n");
}

interface ScoredPage {
  page: WikiPage;
  score: number;
  concepts: string[];
  evidence: string;
}

function evidenceFor(page: WikiPage, concept: string, queryTokens: string[]): string {
  const haystack = sourceText(page).toLowerCase();
  const alias = aliasesFor(concept).find(
    (candidate) =>
      candidate !== concept &&
      candidate.length > 3 &&
      !queryTokens.includes(candidate) &&
      haystack.includes(candidate),
  );
  if (!alias) {
    return `The agent filed “${concept}” on this page.`;
  }
  const quoted = haystack.includes(alias) ? alias : concept;
  return `No source file says “${queryTokens[0] ?? concept}”. A source says “${quoted}”, and the wiki files that under ${concept}.`;
}

function scorePages(queryTokens: string[]): ScoredPage[] {
  const queryConcepts = new Set(
    queryTokens.map((token) => conceptForAlias(token)).filter((concept): concept is string => Boolean(concept)),
  );
  const expanded = new Set(queryTokens);
  for (const concept of queryConcepts) {
    for (const alias of aliasesFor(concept)) expanded.add(alias);
  }

  const scored: ScoredPage[] = [];
  for (const page of wikiIndex.pages.values()) {
    const matchedConcepts = page.concepts.filter((concept) => queryConcepts.has(concept));
    const bodyTokens = tokenize(`${page.title} ${page.body}`);
    const overlap = bodyTokens.filter((token) => expanded.has(token)).length;
    const uniqueBody = new Set(bodyTokens).size || 1;
    const textScore = Math.min(1, overlap / Math.sqrt(uniqueBody));
    const conceptScore = matchedConcepts.length > 0 ? 1 : 0;
    const score = conceptScore * 0.72 + textScore * 0.28;
    if (score <= 0.08) continue;
    scored.push({
      page,
      score,
      concepts: matchedConcepts,
      evidence: matchedConcepts[0]
        ? evidenceFor(page, matchedConcepts[0], queryTokens)
        : "Matched on the words of the compiled page.",
    });
  }

  return scored.sort((a, b) => b.score - a.score || a.page.slug.localeCompare(b.page.slug));
}

function bestSentences(page: WikiPage, queryTokens: string[], limit = 2): string[] {
  const expanded = new Set(queryTokens);
  for (const token of queryTokens) {
    const concept = conceptForAlias(token);
    if (concept) for (const alias of aliasesFor(concept)) expanded.add(alias);
  }
  const sentences = splitSentences(page.body);
  const ranked = sentences
    .map((sentence) => {
      const tokens = tokenize(sentence);
      const hits = tokens.filter((token) => expanded.has(token)).length;
      return { sentence, hits };
    })
    .filter((item) => item.hits > 0)
    .sort((a, b) => b.hits - a.hits);
  if (ranked.length > 0) return ranked.slice(0, limit).map((item) => item.sentence);
  return sentences.slice(0, 1);
}

export interface GrepReport {
  token: string;
  hits: { path: string; line: string }[];
}

export interface RetrievedSource {
  slug: string;
  title: string;
  sentences: string[];
  score: number;
  concepts: string[];
  evidence: string;
  sourcePaths: string[];
}

export interface RetrievalResult {
  matched: boolean;
  sources: RetrievedSource[];
  grep: GrepReport[];
}

/** Literal scan of ~/sources. Does not use the concept index. */
export function grepSources(question: string): GrepReport[] {
  const tokens = [...new Set(tokenize(question))];
  return tokens.map((token) => {
    const hits: { path: string; line: string }[] = [];
    for (const file of sourceFiles) {
      const line = file.body
        .split(/\n/)
        .map((entry) => entry.trim())
        .find((entry) => entry.toLowerCase().includes(token));
      if (line) hits.push({ path: file.path, line });
    }
    return { token, hits };
  });
}

/** Search the compiled wiki, not the raw directory. */
export function retrieve(question: string, maxSources = 2): RetrievalResult {
  const queryTokens = [...new Set(tokenize(question))];
  const grep = grepSources(question);
  if (queryTokens.length === 0) {
    return { matched: false, sources: [], grep };
  }

  const sources = scorePages(queryTokens)
    .slice(0, maxSources)
    .map(({ page, score, concepts, evidence }) => ({
      slug: page.slug,
      title: page.title,
      sentences: bestSentences(page, queryTokens),
      score,
      concepts,
      evidence,
      sourcePaths: page.sourcePaths,
    }))
    .filter((source) => source.sentences.length > 0 && source.score >= 0.2);

  return { matched: sources.length > 0, sources, grep };
}

export function formatMockAnswer(question: string, result: RetrievalResult): string {
  if (!result.matched) {
    const suggestions = Array.from(wikiIndex.pages.values())
      .slice(0, 4)
      .map((page) => `[${page.title}](#/wiki/${page.slug})`)
      .join(", ");
    return (
      `I couldn't find a wiki page for "${question.trim()}". ` +
      `The concept index covers: ${suggestions}.`
    );
  }

  return result.sources
    .map((source) => {
      const files = source.sourcePaths.map((path) => `\`${path}\``).join(", ");
      return `> ${source.sentences.join(" ")}\n>\n> — from **[${source.title}](#/wiki/${source.slug})**, compiled from ${files}`;
    })
    .join("\n\n");
}
