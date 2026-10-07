import { useState } from "react";
import { api, formatBytes, type CompareResult } from "../lib/api";

type Scenario = "errors" | "status";

export function SandboxDemo() {
  const [scenario, setScenario] = useState<Scenario>("errors");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareResult | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const next = await api.compare(scenario);
      setResult(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  const reduction = result?.reduction ?? 0;

  return (
    <section className="panel" style={{ animationDelay: "0.05s" }}>
      <h2>Sandbox vs raw dump</h2>
      <p className="sub">
        Same access log. Left path dumps the whole file into context. Right path runs real{" "}
        <code>ctx_execute</code> — only stdout enters the window.
      </p>

      <div className="controls">
        <button
          type="button"
          className="btn ghost"
          data-active={scenario === "errors"}
          onClick={() => setScenario("errors")}
        >
          Find ERROR lines
        </button>
        <button
          type="button"
          className="btn ghost"
          data-active={scenario === "status"}
          onClick={() => setScenario("status")}
        >
          Status histogram
        </button>
        <button type="button" className="btn" onClick={run} disabled={busy}>
          {busy ? "Running MCP…" : "Run comparison"}
        </button>
      </div>

      {error ? <p className="hint" style={{ color: "var(--danger)" }}>{error}</p> : null}

      <div className="compare">
        <div className="stream raw">
          <header>
            <strong>Without context-mode</strong>
            <span>{result ? formatBytes(result.rawBytes) : "full file"}</span>
          </header>
          <pre>{result?.rawPreview ?? "Click Run comparison to load fixtures/access.log into the “context” column."}</pre>
        </div>
        <div className="stream kept">
          <header>
            <strong>With ctx_execute</strong>
            <span>{result ? formatBytes(result.keptBytes) : "stdout only"}</span>
          </header>
          <pre>{result?.sandboxed ?? "Sandboxed stdout will land here."}</pre>
        </div>
      </div>

      <div className="meter">
        <div className="meter-bar" aria-hidden>
          <div className="meter-fill" style={{ width: `${Math.min(100, reduction)}%` }} />
        </div>
        <div className="meter-legend">
          <span>
            Kept out <b>{result ? formatBytes(result.savedBytes) : "—"}</b>
          </span>
          <span>
            Reduction <b>{result ? `${reduction.toFixed(1)}%` : "—"}</b>
          </span>
          <span>
            Entered context <b>{result ? formatBytes(result.keptBytes) : "—"}</b>
          </span>
        </div>
      </div>

      {result?.stats ? <pre className="stats-box">{result.stats}</pre> : null}
    </section>
  );
}
