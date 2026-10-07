import { useState } from "react";
import { api } from "../lib/api";

export function DoctorPanel() {
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await api.doctor();
      setText(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel" style={{ animationDelay: "0.12s" }}>
      <h2>ctx_doctor</h2>
      <p className="sub">Live diagnostics from the installed MCP server: runtimes, FTS5, version.</p>
      <div className="controls">
        <button type="button" className="btn amber" onClick={run} disabled={busy}>
          {busy ? "Checking…" : "Run doctor"}
        </button>
      </div>
      {error ? <p className="hint" style={{ color: "var(--danger)" }}>{error}</p> : null}
      {text ? <pre className="doctor-box">{text}</pre> : null}
    </section>
  );
}
