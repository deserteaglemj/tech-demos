import { useEffect, useState } from "react";
import { DoctorPanel } from "./components/DoctorPanel";
import { IndexSearch } from "./components/IndexSearch";
import { SandboxDemo } from "./components/SandboxDemo";
import { api, formatBytes, type FixtureInfo } from "./lib/api";

export default function App() {
  const [health, setHealth] = useState<{ ok: boolean; package: string } | null>(null);
  const [fixtures, setFixtures] = useState<FixtureInfo | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [h, f] = await Promise.all([api.health(), api.fixtures()]);
        if (cancelled) return;
        setHealth(h);
        setFixtures(f);
      } catch (err) {
        if (!cancelled) setBootError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="app">
      <header className="hero">
        <h1 className="brand">
          Context
          <span>Mode</span>
        </h1>
        <p className="lede">
          Install-and-demo playground for the MCP that sandboxes tool output, indexes knowledge
          into FTS5, and keeps ~98% of noisy bytes out of the agent context window.
        </p>
        <div className="meta-row">
          <span className="pill" data-ok={health?.ok ?? false}>
            {health?.ok ? `MCP bridge · ${health.package}` : bootError ? "API offline" : "Connecting…"}
          </span>
          {fixtures ? (
            <span className="pill">
              fixture log · {fixtures.log.lineCount} lines · {formatBytes(fixtures.log.bytes)}
            </span>
          ) : null}
          <span className="pill">bun install && bun run dev</span>
        </div>
      </header>

      {bootError ? (
        <section className="panel">
          <h2>Could not reach the API</h2>
          <p className="sub">{bootError}</p>
        </section>
      ) : null}

      <div className="grid" style={{ gap: "1rem" }}>
        <SandboxDemo />
        <div className="grid two">
          <DoctorPanel />
          <IndexSearch />
        </div>
      </div>

      <footer className="footer">
        Source:{" "}
        <a href="https://github.com/mksglu/context-mode" target="_blank" rel="noreferrer">
          mksglu/context-mode
        </a>
      </footer>
    </div>
  );
}
