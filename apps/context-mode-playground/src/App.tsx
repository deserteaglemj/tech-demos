import { useEffect, useState } from "react";
import { AgentTranscript } from "./components/AgentTranscript";
import { ContextMeter } from "./components/ContextMeter";
import { api, formatTokens, type AgentRunResult, type FixtureInfo } from "./lib/api";

type Phase = "idle" | "running" | "done";

export default function App() {
  const [health, setHealth] = useState<{ ok: boolean; package: string } | null>(null);
  const [fixtures, setFixtures] = useState<FixtureInfo | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AgentRunResult | null>(null);
  const [revealWithout, setRevealWithout] = useState(0);
  const [revealWith, setRevealWith] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [h, f] = await Promise.all([api.health(), api.fixtures()]);
        if (!cancelled) {
          setHealth(h);
          setFixtures(f);
        }
      } catch (err) {
        if (!cancelled) setBootError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!result || phase !== "done") return;
    setRevealWithout(0);
    setRevealWith(0);
    const total = Math.max(result.without.transcript.length, result.with.transcript.length);
    let step = 0;
    const id = window.setInterval(() => {
      step += 1;
      setRevealWithout(Math.min(step, result.without.transcript.length));
      setRevealWith(Math.min(step, result.with.transcript.length));
      if (step >= total) window.clearInterval(id);
    }, 420);
    return () => window.clearInterval(id);
  }, [result, phase]);

  async function run() {
    setPhase("running");
    setError(null);
    setResult(null);
    try {
      const next = await api.agentRun();
      setResult(next);
      setPhase("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setPhase("idle");
    }
  }

  return (
    <div className="app">
      <header className="top">
        <div>
          <p className="eyebrow">Verified MCP · context-mode@1.0.169</p>
          <h1>Same agent task. Fewer context tokens.</h1>
          <p className="lede">
            Context Mode is an MCP for AI agents — not an app. Primary proof is{" "}
            <code>bun run verify</code> (see VERIFICATION.md). This viewer only visualizes the
            token difference for one realistic task.
          </p>
        </div>
        <div className="top-meta">
          <span className="pill" data-ok={health?.ok ?? false}>
            {health?.ok ? health.package : bootError ? "API offline" : "Connecting…"}
          </span>
          {fixtures ? (
            <span className="pill">
              {fixtures.log.path} · {fixtures.log.lineCount} lines
            </span>
          ) : null}
        </div>
      </header>

      <section className="task-bar">
        <div>
          <h2>Agent task</h2>
          <p>
            How many ERROR lines are in <code>fixtures/access.log</code>? List each ERROR and
            summarize failure modes.
          </p>
        </div>
        <button type="button" className="btn" onClick={run} disabled={phase === "running" || !!bootError}>
          {phase === "running" ? "Running both agent paths…" : "Run agent comparison"}
        </button>
      </section>

      {error ? <p className="error">{error}</p> : null}

      <div className="meters">
        <ContextMeter
          label="Without context-mode"
          tokens={result && revealWithout >= 3 ? result.without.contextTokens : 0}
          tone="hot"
          animate={phase === "done"}
        />
        <ContextMeter
          label="With context-mode"
          tokens={result && revealWith >= 3 ? result.with.contextTokens : 0}
          tone="cool"
          animate={phase === "done"}
        />
      </div>

      {result && phase === "done" && revealWithout >= 4 && revealWith >= 4 ? (
        <div className="savings" role="status">
          <strong>{formatTokens(result.savedTokens)} tokens kept out of context</strong>
          <span>{result.reductionPct.toFixed(1)}% less tool output entered the conversation</span>
        </div>
      ) : null}

      <div className="sessions">
        {result ? (
          <>
            <AgentTranscript path={result.without} reveal={revealWithout} />
            <AgentTranscript path={result.with} reveal={revealWith} />
          </>
        ) : (
          <p className="placeholder">
            Hit <b>Run agent comparison</b>. Left path dumps the log via Read. Right path calls real{" "}
            <code>ctx_execute</code> over MCP — only stdout enters context.
          </p>
        )}
      </div>

      {result?.stats ? (
        <details className="stats">
          <summary>Live ctx_stats from the MCP server</summary>
          <pre>{result.stats}</pre>
        </details>
      ) : null}

      <footer className="footer">
        <a href="https://github.com/mksglu/context-mode" target="_blank" rel="noreferrer">
          mksglu/context-mode
        </a>
        <span>MCP for agents · not a standalone app</span>
      </footer>
    </div>
  );
}
