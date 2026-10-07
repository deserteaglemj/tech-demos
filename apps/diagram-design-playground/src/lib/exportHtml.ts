import type { BrandTokens, Variant } from "./tokens";
import type { DiagramMeta } from "./types";

type ExportArgs = {
  meta: DiagramMeta;
  variant: Variant;
  tokens: BrandTokens;
  svgMarkup: string;
};

export function buildExportHtml({
  meta,
  variant,
  tokens,
  svgMarkup,
}: ExportArgs): string {
  const isFull = variant === "full";
  const subtitle = isFull
    ? `<p class="subtitle">${escapeHtml(meta.subtitle)}</p>`
    : "";
  const footer = isFull
    ? `<footer class="footer"><span>${escapeHtml(meta.label)} · Diagram Design</span><span>Self-contained HTML + SVG</span></footer>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(meta.title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --paper: ${tokens.paper};
      --paper-2: ${tokens.paper2};
      --ink: ${tokens.ink};
      --muted: ${tokens.muted};
      --soft: ${tokens.soft};
      --accent: ${tokens.accent};
      --link: ${tokens.link};
      --rule: ${tokens.rule};
      --sans: 'Geist', system-ui, sans-serif;
      --serif: 'Instrument Serif', serif;
      --mono: 'Geist Mono', ui-monospace, monospace;
    }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
      background: var(--paper);
      color: var(--ink);
      font-family: var(--sans);
    }
    .frame { width: 100%; max-width: 1200px; }
    .eyebrow {
      margin-bottom: 0.5rem;
      color: var(--muted);
      font: 500 0.66rem/1 var(--mono);
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    h1 {
      margin-bottom: ${isFull ? "0.5rem" : "1.5rem"};
      color: var(--ink);
      font: 400 clamp(1.5rem, 2.4vw + 0.75rem, 2rem)/1.15 var(--serif);
      letter-spacing: -0.02em;
    }
    .subtitle {
      max-width: 58ch;
      margin-bottom: 1.5rem;
      color: var(--muted);
      font: 400 1rem/1.55 var(--sans);
    }
    .diagram {
      ${
        isFull
          ? "background: var(--paper-2); border: 1px solid var(--rule); border-radius: 8px; padding: 1.5rem; overflow-x: auto;"
          : ""
      }
    }
    svg { display: block; width: 100%; min-width: 720px; }
    .footer {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--rule);
      color: var(--soft);
      font: 400 0.72rem/1 var(--mono);
      letter-spacing: 0.06em;
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
  </style>
</head>
<body>
  <main class="frame">
    <p class="eyebrow">${escapeHtml(meta.eyebrow)}</p>
    <h1>${escapeHtml(meta.title)}</h1>
    ${subtitle}
    <div class="diagram">${svgMarkup}</div>
    ${footer}
  </main>
</body>
</html>
`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
