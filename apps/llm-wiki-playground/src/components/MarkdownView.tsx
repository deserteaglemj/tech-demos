import { createElement, useMemo, type ReactNode } from "react";
import { parseRoute, type Route } from "../lib/route";
import { isPlainLeftClick } from "./helpers";

/**
 * Tiny markdown renderer for the seeded wiki pages and Ask answers. It covers
 * paragraphs, ATX headings, ordered/unordered lists, blockquotes, fenced code,
 * rules, and inline **bold**, *italic*, `code`, and [links](url). Output is
 * built as React elements (never raw HTML), so markdown that echoes user input
 * cannot inject markup.
 */

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; start: number; items: string[] }
  | { kind: "quote"; children: Block[] }
  | { kind: "code"; text: string }
  | { kind: "rule" };

const FENCE = /^\s*(```|~~~)/;
const HEADING = /^\s{0,3}(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/;
const RULE = /^\s{0,3}([-*_])(?:\s*\1){2,}\s*$/;
const QUOTE = /^\s{0,3}>\s?(.*)$/;
const LIST_ITEM = /^\s{0,3}(?:(\d{1,9})[.)]|[-*+])\s+(.*)$/;

function startsBlock(line: string): boolean {
  return [FENCE, HEADING, RULE, QUOTE, LIST_ITEM].some((pattern) => pattern.test(line));
}

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }

    const fence = FENCE.exec(line);
    if (fence) {
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trimStart().startsWith(fence[1])) code.push(lines[i++]);
      i += 1;
      blocks.push({ kind: "code", text: code.join("\n") });
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      blocks.push({ kind: "heading", level: heading[1].length, text: heading[2] });
      i += 1;
      continue;
    }

    if (RULE.test(line)) {
      blocks.push({ kind: "rule" });
      i += 1;
      continue;
    }

    if (QUOTE.test(line)) {
      const inner: string[] = [];
      while (i < lines.length && QUOTE.test(lines[i])) inner.push(QUOTE.exec(lines[i++])![1]);
      blocks.push({ kind: "quote", children: parseBlocks(inner.join("\n")) });
      continue;
    }

    const first = LIST_ITEM.exec(line);
    if (first) {
      const ordered = first[1] !== undefined;
      const items: string[] = [];
      while (i < lines.length) {
        const current = lines[i];
        const item = RULE.test(current) ? null : LIST_ITEM.exec(current);
        if (item && (item[1] !== undefined) === ordered) {
          items.push(item[2].trim());
          i += 1;
        } else if (!current.trim()) {
          let next = i + 1;
          while (next < lines.length && !lines[next].trim()) next += 1;
          const following = next < lines.length ? LIST_ITEM.exec(lines[next]) : null;
          if (!following || (following[1] !== undefined) !== ordered) break;
          i = next;
        } else if (!startsBlock(current)) {
          items[items.length - 1] += ` ${current.trim()}`;
          i += 1;
        } else {
          break;
        }
      }
      blocks.push({ kind: "list", ordered, start: ordered ? Number(first[1]) : 1, items });
      continue;
    }

    const paragraph = [line.trim()];
    i += 1;
    while (i < lines.length && lines[i].trim() && !startsBlock(lines[i])) paragraph.push(lines[i++].trim());
    blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

const INLINE = new RegExp(
  [
    /\\([\\`*_{}[\]()#+\-.!>~|])/.source,
    /`([^`]+)`/.source,
    /\[((?:[^[\]]|\[[^[\]]*\])+)\]\(\s*((?:[^()\s]|\([^()\s]*\))+)(?:\s+"[^"]*")?\s*\)/.source,
    /\*\*(?=\S)([\s\S]*?\S)\*\*/.source,
    /(?<![A-Za-z0-9_])__(?=\S)([\s\S]*?\S)__(?![A-Za-z0-9_])/.source,
    /\*(?=[^\s*])([\s\S]*?[^\s*])\*/.source,
    /(?<![A-Za-z0-9_])_(?=[^\s_])([\s\S]*?[^\s_])_(?![A-Za-z0-9_])/.source,
  ].join("|"),
  "g",
);

const EXTERNAL_URL = /^(?:https?:|mailto:|\/\/)/i;
const ANY_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

interface RenderContext {
  onNavigate: (route: Route) => void;
  headingOffset: number;
}

function renderLink(rawHref: string, children: ReactNode[], key: string, ctx: RenderContext): ReactNode {
  const href = rawHref.trim();

  if (href.startsWith("#/")) {
    const route = parseRoute(href.toLowerCase());
    return (
      <a
        key={key}
        href={href}
        onClick={(event) => {
          if (!isPlainLeftClick(event)) return;
          event.preventDefault();
          ctx.onNavigate(route);
        }}
      >
        {children}
      </a>
    );
  }

  if (EXTERNAL_URL.test(href)) {
    return (
      <a key={key} href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  // javascript:, data:, and other schemes render as plain text.
  if (ANY_SCHEME.test(href)) return <span key={key}>{children}</span>;

  return (
    <a key={key} href={href}>
      {children}
    </a>
  );
}

function renderInline(text: string, ctx: RenderContext, keyPrefix: string): ReactNode[] {
  const pattern = new RegExp(INLINE.source, "g");
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let count = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    const key = `${keyPrefix}.${count++}`;
    const [, escaped, code, label, href, strongStars, strongUnderscores, emStar, emUnderscore] = match;

    if (escaped !== undefined) nodes.push(escaped);
    else if (code !== undefined) nodes.push(<code key={key}>{code}</code>);
    else if (label !== undefined) nodes.push(renderLink(href, renderInline(label, ctx, key), key, ctx));
    else if (strongStars !== undefined || strongUnderscores !== undefined) {
      nodes.push(<strong key={key}>{renderInline(strongStars ?? strongUnderscores, ctx, key)}</strong>);
    } else {
      nodes.push(<em key={key}>{renderInline(emStar ?? emUnderscore, ctx, key)}</em>);
    }
    cursor = pattern.lastIndex;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function renderBlocks(blocks: Block[], ctx: RenderContext, keyPrefix: string): ReactNode[] {
  return blocks.map((block, index) => {
    const key = `${keyPrefix}${index}`;
    switch (block.kind) {
      case "heading": {
        const level = Math.min(6, block.level + ctx.headingOffset);
        return createElement(`h${level}`, { key }, renderInline(block.text, ctx, key));
      }
      case "paragraph":
        return <p key={key}>{renderInline(block.text, ctx, key)}</p>;
      case "list": {
        const items = block.items.map((item, itemIndex) => (
          <li key={itemIndex}>{renderInline(item, ctx, `${key}.${itemIndex}`)}</li>
        ));
        return block.ordered ? (
          <ol key={key} start={block.start === 1 ? undefined : block.start}>
            {items}
          </ol>
        ) : (
          <ul key={key}>{items}</ul>
        );
      }
      case "quote":
        return <blockquote key={key}>{renderBlocks(block.children, ctx, `${key}.`)}</blockquote>;
      case "code":
        return (
          <pre key={key}>
            <code>{block.text}</code>
          </pre>
        );
      case "rule":
        return <hr key={key} />;
    }
  });
}

interface MarkdownViewProps {
  source: string;
  onNavigate: (route: Route) => void;
  className?: string;
  /** Shifts heading levels so embedded markdown fits the surrounding outline. */
  headingOffset?: number;
}

export function MarkdownView({ source, onNavigate, className, headingOffset = 0 }: MarkdownViewProps) {
  const blocks = useMemo(() => parseBlocks(source), [source]);
  return (
    <div className={className ? `prose ${className}` : "prose"}>
      {renderBlocks(blocks, { onNavigate, headingOffset }, "")}
    </div>
  );
}
