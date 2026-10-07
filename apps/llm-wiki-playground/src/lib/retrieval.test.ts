// @ts-ignore -- Bun provides this module at runtime; the app omits Bun typings.
import { describe, expect, mock, test } from "bun:test";
// @ts-ignore -- Bun provides Node built-ins; the browser app omits Node typings.
import { readdirSync, readFileSync } from "node:fs";

import { parseFrontmatter } from "./frontmatter";
import type { WikiIndex, WikiPage } from "./types";

// wiki.ts uses Vite's import.meta.glob, which is unavailable in Bun's test
// runner. Build the same index from the real seeded files for these unit tests.
const contentDirectory = new URL("../../content/", import.meta.url);
const pages = new Map<string, WikiPage>();
const order: string[] = [];

const markdownFiles = readdirSync(contentDirectory)
  .filter((name: string) => name.endsWith(".md"))
  .sort();

for (const filename of markdownFiles) {
  const slug = filename.replace(/\.md$/, "");
  const { meta, body } = parseFrontmatter(
    readFileSync(new URL(filename, contentDirectory), "utf8"),
  );
  pages.set(slug, {
    slug,
    title: meta.title ?? slug,
    summary: meta.summary ?? "",
    body,
    links: [],
  });
  order.push(slug);
}

const wikiIndex: WikiIndex = {
  pages,
  order,
  edges: [],
  backlinks: new Map(order.map((slug) => [slug, []])),
};

mock.module("./wiki", () => ({
  wikiIndex,
  titleFor: (slug: string) => pages.get(slug)?.title ?? slug,
}));

const { formatMockAnswer, retrieve } = await import("./retrieval");

function expectCitation(question: string, slug: string): void {
  const result = retrieve(question);
  const answer = formatMockAnswer(question, result);

  expect(result.matched).toBe(true);
  expect(result.sources.some((source) => source.slug === slug)).toBe(true);
  expect(answer).toContain(`](#/wiki/${slug})`);
  expect(answer).toStartWith("> ");
  expect(answer).toContain("\n>\n> — from **[");
}

describe("local wiki retrieval", () => {
  test("answers an attention question with a cited attention excerpt", () => {
    expectCitation("What is attention?", "attention");
  });

  test("answers a tokenization question with a cited tokenization excerpt", () => {
    expectCitation("How does tokenization work?", "tokenization");
  });

  test("answers an RLHF question with a cited RLHF excerpt", () => {
    expectCitation("Why is RLHF needed?", "rlhf");
  });

  test.each(["context window", "what is the context window"])(
    "answers %p with a cited context-window excerpt",
    (question: string) => {
      const result = retrieve(question);

      expect(result.sources[0]?.slug).toBe("context-window");
      expectCitation(question, "context-window");
    },
  );

  test("normalizes simple trailing plurals", () => {
    expectCitation("What are attentions?", "attention");
  });

  test("honestly misses an unrelated question and suggests a real topic", () => {
    const question = "quantum knitting";
    const result = retrieve(question);
    const answer = formatMockAnswer(question, result);

    expect(result).toEqual({ matched: false, sources: [] });
    expect(answer.toLowerCase()).toMatch(/couldn't find|could not find|no match/);
    expect(answer).toMatch(
      /Attention Mechanism|Context Window|RLHF \(Reinforcement Learning from Human Feedback\)|Tokenization|Transformer Architecture/,
    );
  });

  test.each(["", "   \t\n  "])(
    "does not match an empty question %p",
    (question: string) => {
      expect(retrieve(question)).toEqual({ matched: false, sources: [] });
    },
  );
});
