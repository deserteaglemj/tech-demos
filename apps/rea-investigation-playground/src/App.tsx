import { useDeferredValue, useMemo, useState } from "react";
import {
  PHASES,
  PROMPT,
  SOURCE_SNIPPETS,
  evidence,
  type PhaseId,
} from "./investigation";
import {
  OfflineSearchIndex,
  SAMPLE_NOTES,
} from "./searchEngine";

const PHASE_ORDER: PhaseId[] = ["decompile", "understand", "recreate"];

function shortHash(value: string, len = 12) {
  return value.length > len ? `${value.slice(0, len)}…` : value;
}

export default function App() {
  const [phase, setPhase] = useState<PhaseId>("decompile");
  const [selectedPath, setSelectedPath] = useState("src/search.js");
  const [query, setQuery] = useState("offline search");
  const deferredQuery = useDeferredValue(query);

  const current = PHASES.find((p) => p.id === phase)!;
  const phaseIndex = PHASE_ORDER.indexOf(phase);

  const modules = useMemo(
    () =>
      evidence.modules.filter(
        (m) =>
          m.path &&
          !m.path.includes(":return-shapes") &&
          !m.path.includes(":boot"),
      ),
    [],
  );

  const importEdges = useMemo(
    () =>
      evidence.edges.filter(
        (e) => e.relation === "imports" || e.relation === "maps_to",
      ),
    [],
  );

  const hits = useMemo(() => {
    const index = new OfflineSearchIndex();
    index.hydrate(SAMPLE_NOTES);
    return index.query(deferredQuery);
  }, [deferredQuery]);

  const source =
    SOURCE_SNIPPETS[selectedPath] ??
    SOURCE_SNIPPETS["src/search.js"] ??
    "// no snippet";

  function goWorkspace() {
    document.getElementById("workspace")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-visual" aria-hidden="true" />
        <div className="hero-content">
          <p className="brand">
            REA
            <span>Reverse Engineer Anything</span>
          </p>
          <h1>See a feature. Recover the evidence. Rebuild it.</h1>
          <p>
            A single-sitting playground of REA’s investigation model on a local
            JavaScript app — static analysis only, no Hopper required.
          </p>
          <div className="cta-row">
            <button type="button" className="btn btn-primary" onClick={goWorkspace}>
              Start investigation
            </button>
            <a
              className="btn btn-ghost"
              href="https://github.com/morluto/rea"
              target="_blank"
              rel="noreferrer"
            >
              morluto/rea
            </a>
          </div>
        </div>
      </header>

      <main id="workspace" className="workspace">
        <section className="prompt" aria-label="Agent prompt">
          <div className="prompt-label">agent prompt</div>
          <blockquote>{PROMPT}</blockquote>
        </section>

        <div className="phase-rail" role="tablist" aria-label="Investigation phases">
          {PHASES.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={phase === p.id}
              className="phase-tab"
              data-active={phase === p.id}
              onClick={() => setPhase(p.id)}
            >
              <strong>
                {i + 1}. {p.title}
              </strong>
              <span>{p.id}</span>
            </button>
          ))}
        </div>

        <div className="panel">
          <section className="block">
            <h2>{current.title}</h2>
            <p>{current.blurb}</p>
            <div className="tool-stack">
              {current.tools.map((tool) => (
                <article key={tool.tool} className="tool-call">
                  <code>{tool.tool}</code>
                  <pre>{JSON.stringify(tool.args, null, 2)}</pre>
                  <p>{tool.note}</p>
                </article>
              ))}
            </div>

            {phase === "decompile" && (
              <>
                <h2 style={{ marginTop: "1.25rem" }}>Evidence envelope</h2>
                <dl className="meta-grid">
                  <div className="meta">
                    <dt>evidence_id</dt>
                    <dd>{shortHash(evidence.evidence_id, 22)}</dd>
                  </div>
                  <div className="meta">
                    <dt>provider</dt>
                    <dd>{evidence.provider.id}</dd>
                  </div>
                  <div className="meta">
                    <dt>operation</dt>
                    <dd>{evidence.operation}</dd>
                  </div>
                  <div className="meta">
                    <dt>artifact sha256</dt>
                    <dd>{shortHash(evidence.root_artifact_sha256, 18)}</dd>
                  </div>
                  <div className="meta">
                    <dt>parsed JS files</dt>
                    <dd>{evidence.statistics.parsed_javascript_files}</dd>
                  </div>
                  <div className="meta">
                    <dt>AST nodes visited</dt>
                    <dd>{evidence.statistics.visited_ast_nodes}</dd>
                  </div>
                </dl>
                <ul className="module-list">
                  {modules.map((m) => (
                    <li
                      key={m.node_id}
                      data-active={selectedPath === m.path}
                      onClick={() => setSelectedPath(m.path)}
                    >
                      <span className="path">{m.path}</span>
                      <span>
                        {m.exports.map((ex) => (
                          <span className="pill" key={ex}>
                            {ex}
                          </span>
                        ))}
                        <span className="pill">{m.confidence}</span>
                        <span className="pill">{m.module_format ?? "module"}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {phase === "understand" && (
              <>
                <h2 style={{ marginTop: "1.25rem" }}>Recovered relationships</h2>
                <ul className="edge-list">
                  {importEdges.slice(0, 10).map((e, i) => (
                    <li key={`${e.from}-${e.to}-${i}`}>
                      <span className="path">
                        {e.from} → {e.to}
                      </span>
                      <span>
                        <span className="pill">{e.relation}</span>
                        {e.confidence && (
                          <span className="pill">{e.confidence}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <h2 style={{ marginTop: "1.25rem" }}>Source focus</h2>
                <ul className="module-list" style={{ marginBottom: "0.75rem" }}>
                  {Object.keys(SOURCE_SNIPPETS).map((path) => (
                    <li
                      key={path}
                      data-active={selectedPath === path}
                      onClick={() => setSelectedPath(path)}
                    >
                      <span className="path">{path}</span>
                    </li>
                  ))}
                </ul>
                <pre className="source">{source}</pre>
              </>
            )}

            {phase === "recreate" && (
              <div className="search-demo">
                <h2 style={{ marginTop: "0.4rem" }}>Live offline search</h2>
                <p>
                  Ported from Inkdesk’s <code>SearchIndex</code>: inverted
                  tokens, intersect on multi-word queries, local notes only.
                </p>
                <label htmlFor="q">query</label>
                <input
                  id="q"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="try: sync queue"
                  autoComplete="off"
                />
                {hits.length === 0 ? (
                  <p className="empty">No hits for that query.</p>
                ) : (
                  <ul className="hits">
                    {hits.map((hit) => (
                      <li key={hit.id}>
                        <strong>{hit.id}</strong>
                        {hit.body}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="nav-row">
              <button
                type="button"
                className="btn btn-ghost"
                style={{ color: "var(--ink)", borderColor: "var(--line)" }}
                disabled={phaseIndex === 0}
                onClick={() => setPhase(PHASE_ORDER[phaseIndex - 1]!)}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn btn-teal"
                disabled={phaseIndex === PHASE_ORDER.length - 1}
                onClick={() => setPhase(PHASE_ORDER[phaseIndex + 1]!)}
              >
                Next phase
              </button>
            </div>
          </section>

          <aside className="block">
            <h2>Limitations</h2>
            <p>
              REA keeps conclusions tied to Evidence. These came from the real
              analyzer run on <code>fixture/</code>.
            </p>
            <ul className="limit-list">
              {evidence.limitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h2 style={{ marginTop: "1.25rem" }}>Target</h2>
            <dl className="meta-grid">
              <div className="meta">
                <dt>subject</dt>
                <dd>{evidence.subject.name}</dd>
              </div>
              <div className="meta">
                <dt>format</dt>
                <dd>{evidence.subject.format}</dd>
              </div>
              <div className="meta">
                <dt>node kinds</dt>
                <dd>{evidence.node_kinds.join(", ")}</dd>
              </div>
              <div className="meta">
                <dt>edges</dt>
                <dd>{evidence.edges.length}</dd>
              </div>
            </dl>
          </aside>
        </div>

        <p className="footnote">
          Evidence produced with <code>rea-agents@4.1.0</code>{" "}
          <code>analyze-javascript-application</code>. Source:{" "}
          <a href="https://github.com/morluto/rea">github.com/morluto/rea</a>.
        </p>
      </main>
    </div>
  );
}
