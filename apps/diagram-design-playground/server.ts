const port = Number(process.env.PORT ?? 5173);

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Diagram Design · tool-usage demo</title>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --paper: #f5f5f5;
      --ink: #2d3142;
      --muted: #4f5d75;
      --accent: #eb6c36;
      --rule: rgba(45,49,66,0.12);
      --serif: "Instrument Serif", Georgia, serif;
      --sans: "Geist", system-ui, sans-serif;
      --mono: "Geist Mono", ui-monospace, monospace;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(900px 420px at 10% -5%, rgba(235,108,54,0.12), transparent 55%),
        linear-gradient(180deg, #f7f5ef, #ebe8df);
      color: var(--ink);
      font-family: var(--sans);
    }
    main { width: min(1100px, calc(100% - 2rem)); margin: 0 auto; padding: 2.5rem 0 4rem; }
    .brand {
      margin: 0 0 0.5rem;
      font-family: var(--serif);
      font-size: clamp(2.5rem, 7vw, 4.5rem);
      letter-spacing: -0.03em;
      line-height: 0.95;
    }
    h1 {
      margin: 0 0 0.75rem;
      font-family: var(--serif);
      font-weight: 400;
      font-size: clamp(1.35rem, 2vw + 0.8rem, 1.85rem);
      letter-spacing: -0.02em;
    }
    .lede { max-width: 58ch; color: var(--muted); line-height: 1.55; margin: 0 0 1.5rem; }
    .actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 2rem; }
    a.btn {
      display: inline-flex; align-items: center; justify-content: center;
      min-height: 2.5rem; padding: 0.55rem 1rem; border-radius: 4px;
      text-decoration: none; color: inherit; border: 1px solid var(--rule);
    }
    a.btn-primary { background: var(--ink); color: #f5f5f5; border-color: transparent; }
    section {
      margin-top: 1.5rem; padding: 1.25rem 1.35rem;
      background: rgba(255,255,255,0.55); border: 1px solid var(--rule); border-radius: 6px;
    }
    section h2 {
      margin: 0 0 0.75rem;
      font-family: var(--serif);
      font-weight: 400;
      font-size: 1.35rem;
    }
    pre {
      margin: 0; white-space: pre-wrap;
      font: 400 0.9rem/1.5 var(--mono);
      color: var(--ink);
    }
    .eyebrow {
      margin: 0 0 0.4rem;
      font: 500 0.66rem/1 var(--mono);
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--muted);
    }
    iframe {
      width: 100%;
      min-height: 520px;
      border: 1px solid var(--rule);
      border-radius: 6px;
      background: #f5f5f5;
    }
  </style>
</head>
<body>
  <main>
    <p class="brand">Diagram Design</p>
    <h1>Tool-usage demo — real skill, real prompt, real output.</h1>
    <p class="lede">
      Installed via <code>npx skills add cathrynlavery/diagram-design</code>.
      The validation video shows this prompt being given to a Cursor agent,
      then the HTML below that the agent wrote. Not a gallery clone.
    </p>
    <div class="actions">
      <a class="btn btn-primary" href="/PROMPT.md">1. The prompt we gave</a>
      <a class="btn" href="/SESSION.md">2. Agent session log</a>
      <a class="btn" href="/output/tech-demo-pipeline.html">3. Open diagram HTML</a>
    </div>

    <section>
      <p class="eyebrow">Step 1 · Prompt given to the agent</p>
      <h2>Exact text submitted to Cursor</h2>
      <pre id="prompt">Loading…</pre>
    </section>

    <section>
      <p class="eyebrow">Step 2 · Output the agent produced</p>
      <h2>Self-contained architecture HTML</h2>
      <iframe title="Generated architecture diagram" src="/output/tech-demo-pipeline.html"></iframe>
    </section>
  </main>
  <script type="module">
    const res = await fetch("/PROMPT.md");
    document.getElementById("prompt").textContent = await res.text();
  </script>
</body>
</html>
`;

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(indexHtml, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    const filePath = `.${url.pathname}`;
    const file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(file);
    }
    return new Response("Not found", { status: 404 });
  },
});

console.log(`Diagram Design usage demo → http://127.0.0.1:${server.port}/`);
