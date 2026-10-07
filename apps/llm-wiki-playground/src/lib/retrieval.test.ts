// @ts-ignore -- Bun provides this module at runtime; the app omits Bun typings.
import { describe, expect, mock, test } from "bun:test";
// @ts-ignore -- Bun provides Node built-ins; the browser app omits Node typings.
import { readdirSync, readFileSync } from "node:fs";

import { parseFrontmatter } from "./frontmatter";
import type { SourceFile, WikiIndex, WikiPage } from "./types";

function loadDir(url: URL): { name: string; raw: string }[] {
  return readdirSync(url)
    .filter((name: string) => name.endsWith(".md"))
    .sort()
    .map((name: string) => ({
      name,
      raw: readFileSync(new URL(name, url), "utf8"),
    }));
}

const sourceFiles: SourceFile[] = loadDir(new URL("../../content/sources/", import.meta.url)).map(({ name, raw }) => {
  const { meta, body } = parseFrontmatter(raw);
  const path = meta.path ?? name;
  const folder = path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "sources";
  return { slug: name.replace(/\.md$/, ""), title: meta.title ?? name, path, folder, body };
});

const pages = new Map<string, WikiPage>();
const order: string[] = [];
for (const { name, raw } of loadDir(new URL("../../content/wiki/", import.meta.url))) {
  const slug = name.replace(/\.md$/, "");
  const { meta, body } = parseFrontmatter(raw);
  const list = (value: string | undefined) =>
    value?.split(",").map((part) => part.trim()).filter(Boolean) ?? [];
  pages.set(slug, {
    slug,
    title: meta.title ?? slug,
    summary: meta.summary ?? "",
    body,
    concepts: list(meta.concepts),
    sourcePaths: list(meta.sources),
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

function getSource(path: string) {
  return sourceFiles.find((file) => file.path === path);
}

mock.module("./wiki", () => ({
  wikiIndex,
  sourceFiles,
  getSource,
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

describe("wiki concept search", () => {
  test("finds churn risk even though no source file says churn", () => {
    const result = retrieve("Who is about to churn?");
    expect(result.sources[0]?.slug).toBe("northwind");
    expect(result.grep.find((entry) => entry.token === "churn")?.hits).toEqual([]);
    expect(result.sources[0]?.evidence.toLowerCase()).toContain("shopping");
    expectCitation("Who is about to churn?", "northwind");
  });

  test("finds the pricing page for undercharging", () => {
    const result = retrieve("Are we undercharging?");
    expect(result.sources[0]?.slug).toBe("pricing");
    expect(result.grep.find((entry) => entry.token === "undercharging")?.hits).toEqual([]);
    expectCitation("Are we undercharging?", "pricing");
  });

  test("finds the hiring page when the question says pass", () => {
    expectCitation("Who should we pass on?", "hiring");
  });

  test("finds the outage from a tuesday question", () => {
    expectCitation("What happened tuesday?", "outage");
  });

  test("honestly misses an unrelated question and names a real page", () => {
    const question = "quantum knitting";
    const result = retrieve(question);
    const answer = formatMockAnswer(question, result);
    expect(result.matched).toBe(false);
    expect(answer.toLowerCase()).toMatch(/couldn't find|could not find/);
    expect(answer).toMatch(/Northwind|Pricing|Hiring|Harbor/);
  });

  test.each(["", "   \t\n  "])("does not match an empty question %p", (question: string) => {
    expect(retrieve(question).matched).toBe(false);
    expect(retrieve(question).sources).toEqual([]);
  });
});
