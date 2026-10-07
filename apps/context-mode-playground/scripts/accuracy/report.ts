import fs from "node:fs";

export type CaseResult = {
  id: string;
  title: string;
  category: string;
  intensity: "medium" | "high" | "critical";
  withoutTokens: number;
  withTokens: number;
  groundTruth: unknown;
  contextModeOutput: string;
  mismatches: string[];
  missingFacts: string[];
  extraFacts: string[];
  notes: string;
  passed: boolean;
};

export type AccuracyReport = {
  generatedAt: string;
  package: string;
  fixtureDir: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    passRate: number;
    tokenWithout: number;
    tokenWith: number;
    tokenReductionPct: number;
    downsideFound: boolean;
    verdict: string;
  };
  cases: CaseResult[];
};

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function writeHtmlReport(report: AccuracyReport, outPath: string) {
  const { summary, cases } = report;
  const cards = cases
    .map((c, i) => {
      const status = c.passed ? "pass" : "fail";
      const issues = [...c.mismatches, ...c.missingFacts, ...c.extraFacts];
      const saved = Math.max(0, c.withoutTokens - c.withTokens);
      const red = c.withoutTokens === 0 ? 0 : (saved / c.withoutTokens) * 100;
      return `
      <article class="case ${status}" id="${esc(c.id)}">
        <header>
          <div class="left">
            <span class="badge ${status}">${c.passed ? "PASS" : "FAIL"}</span>
            <span class="intensity">${esc(c.intensity)}</span>
            <span class="cat">${esc(c.category)}</span>
          </div>
          <div class="tok">
            <span class="hot">${c.withoutTokens.toLocaleString()} tok without</span>
            <span class="arrow">→</span>
            <span class="cool">${c.withTokens.toLocaleString()} tok with</span>
            <span class="saved">${red.toFixed(1)}% less</span>
          </div>
        </header>
        <h2>${i + 1}. ${esc(c.title)}</h2>
        <p class="notes">${esc(c.notes)}</p>
        ${
          issues.length
            ? `<ul class="issues">${issues.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`
            : `<p class="okline">All key facts matched ground truth.</p>`
        }
        <details>
          <summary>Ground truth</summary>
          <pre>${esc(JSON.stringify(c.groundTruth, null, 2))}</pre>
        </details>
        <details>
          <summary>Context-mode returned context (truncated)</summary>
          <pre>${esc(c.contextModeOutput)}</pre>
        </details>
      </article>`;
    })
    .join("\n");

  const toc = cases
    .map(
      (c) =>
        `<li class="${c.passed ? "pass" : "fail"}"><a href="#${esc(c.id)}">${esc(c.title)}</a></li>`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Context Mode accuracy report</title>
  <style>
    :root {
      --bg: #f4f0e6;
      --ink: #1c1914;
      --muted: #5c564a;
      --line: #d2cbb8;
      --pass: #0f6a5b;
      --pass-bg: #d8f3ec;
      --fail: #b42318;
      --fail-bg: #fde8e6;
      --panel: #fffdf8;
      --hot: #b42318;
      --cool: #0f6a5b;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "IBM Plex Sans", "Segoe UI", sans-serif;
      color: var(--ink);
      background:
        radial-gradient(900px 400px at 0% 0%, rgba(15,106,91,.08), transparent 55%),
        radial-gradient(800px 360px at 100% 0%, rgba(180,35,24,.06), transparent 50%),
        var(--bg);
      line-height: 1.5;
    }
    .wrap { width: min(1080px, calc(100% - 2rem)); margin: 0 auto; padding: 2rem 0 4rem; }
    h1 { font-size: clamp(1.8rem, 4vw, 2.6rem); letter-spacing: -0.03em; margin: 0 0 .4rem; }
    .sub { color: var(--muted); max-width: 48rem; }
    .hero-meta { display:flex; flex-wrap:wrap; gap:.5rem; margin: 1rem 0 1.25rem; }
    .pill { font: 12px/1 ui-monospace, monospace; border:1px solid var(--line); border-radius:999px; padding:.35rem .7rem; background: var(--panel); }
    .verdict {
      padding: 1rem 1.1rem; border-radius: 14px; border: 1px solid var(--line);
      background: ${summary.downsideFound ? "var(--fail-bg)" : "var(--pass-bg)"};
      color: ${summary.downsideFound ? "var(--fail)" : "var(--pass)"};
      font-weight: 650; margin-bottom: 1.25rem;
    }
    .stats {
      display:grid; gap:.75rem; grid-template-columns: repeat(auto-fit,minmax(160px,1fr));
      margin-bottom: 1.5rem;
    }
    .stat { background: var(--panel); border:1px solid var(--line); border-radius: 12px; padding: .85rem .95rem; }
    .stat b { display:block; font-size: 1.35rem; letter-spacing:-0.02em; }
    .stat span { color: var(--muted); font-size: .82rem; }
    nav {
      background: var(--panel); border:1px solid var(--line); border-radius: 14px;
      padding: 1rem 1.1rem; margin-bottom: 1.25rem;
    }
    nav h2 { margin: 0 0 .5rem; font-size: 0.95rem; }
    nav ol { margin: 0; padding-left: 1.2rem; }
    nav li { margin: .25rem 0; }
    nav li.pass a { color: var(--pass); }
    nav li.fail a { color: var(--fail); }
    .case {
      background: var(--panel); border:1px solid var(--line); border-radius: 16px;
      padding: 1rem 1.1rem 1.15rem; margin-bottom: .9rem;
      box-shadow: 0 10px 30px rgba(28,25,20,.04);
    }
    .case.fail { border-color: rgba(180,35,24,.35); }
    .case header { display:flex; flex-wrap:wrap; justify-content:space-between; gap:.6rem; margin-bottom:.45rem; }
    .badge { font: 700 11px/1 ui-monospace, monospace; padding:.3rem .5rem; border-radius: 999px; }
    .badge.pass { background: var(--pass-bg); color: var(--pass); }
    .badge.fail { background: var(--fail-bg); color: var(--fail); }
    .intensity, .cat { font: 11px/1 ui-monospace, monospace; color: var(--muted); margin-left: .4rem; text-transform: uppercase; }
    .tok { font: 12px/1.3 ui-monospace, monospace; color: var(--muted); display:flex; flex-wrap:wrap; gap:.35rem; align-items:center; }
    .tok .hot { color: var(--hot); }
    .tok .cool { color: var(--cool); }
    .tok .saved { background:#eef7f4; color: var(--cool); padding:.15rem .4rem; border-radius: 6px; }
    h2 { margin: .2rem 0 .35rem; font-size: 1.05rem; }
    .notes { margin: 0 0 .55rem; color: var(--muted); font-size: .92rem; }
    .okline { color: var(--pass); font-size: .9rem; }
    .issues { margin: .3rem 0 .7rem; color: var(--fail); }
    details { margin-top: .45rem; }
    summary { cursor: pointer; color: var(--muted); font-size: .85rem; }
    pre {
      white-space: pre-wrap; word-break: break-word;
      background: #1d1a16; color: #e8e2d5; border-radius: 10px;
      padding: .75rem .85rem; font: 12px/1.4 ui-monospace, monospace;
      max-height: 280px; overflow: auto;
    }
    footer { margin-top: 1.5rem; color: var(--muted); font-size: .82rem; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Context Mode accuracy report</h1>
    <p class="sub">
      Intense with/without tests against known ground truth. Question:
      when context-mode keeps raw data out of the agent context, do we still get
      <strong>accurate key facts</strong>?
    </p>
    <div class="hero-meta">
      <span class="pill">${esc(report.package)}</span>
      <span class="pill">${esc(report.generatedAt)}</span>
      <span class="pill">${summary.passed}/${summary.total} cases</span>
    </div>
    <div class="verdict">${esc(summary.verdict)}</div>
    <div class="stats">
      <div class="stat"><b>${summary.passRate.toFixed(1)}%</b><span>pass rate</span></div>
      <div class="stat"><b>${summary.failed}</b><span>accuracy failures</span></div>
      <div class="stat"><b>${summary.tokenReductionPct.toFixed(1)}%</b><span>fewer tokens into context (summed)</span></div>
      <div class="stat"><b>${summary.tokenWith.toLocaleString()}</b><span>tokens with context-mode (sum)</span></div>
    </div>
    <nav>
      <h2>Walkthrough</h2>
      <ol>${toc}</ol>
    </nav>
    ${cards}
    <footer>
      Fixtures: ${esc(report.fixtureDir)}. Re-run: <code>bun run test:accuracy</code>.
      Source: <a href="https://github.com/mksglu/context-mode">mksglu/context-mode</a>.
    </footer>
  </div>
</body>
</html>`;

  fs.writeFileSync(outPath, html);
}
