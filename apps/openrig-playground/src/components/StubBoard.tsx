import { useEffect, useRef, useState } from "react";
import {
  DEMO_PROMPT,
  DEMO_REPLY,
  STUB_POD,
  type SeatState,
} from "../data/stubBoard";

type LogLine = { t: string; text: string };

function nowStamp() {
  return new Date().toISOString().slice(11, 19);
}

export function StubBoard() {
  const [states, setStates] = useState<Record<string, SeatState>>({
    impl: "idle",
    qa: "idle",
  });
  const [log, setLog] = useState<LogLine[]>([
    { t: nowStamp(), text: "Daemon healthy · stub-demo imported · 2 seats ready" },
  ]);
  const [busy, setBusy] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      for (const id of timers.current) window.clearTimeout(id);
    };
  }, []);

  function push(text: string) {
    setLog((prev) => [...prev.slice(-7), { t: nowStamp(), text }]);
  }

  function runDemo() {
    if (busy) return;
    setBusy(true);
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];

    setStates({ impl: "idle", qa: "idle" });
    push(`$ rig send ${STUB_POD.seats[0].session} '${DEMO_PROMPT.slice(0, 28)}…'`);

    timers.current.push(
      window.setTimeout(() => {
        setStates((s) => ({ ...s, impl: "working" }));
        push("delivery → stub-runner READY · awaiting prompt");
      }, 350),
    );

    timers.current.push(
      window.setTimeout(() => {
        setStates((s) => ({ ...s, impl: "acked" }));
        push(`[stub] scripted reply: ${DEMO_REPLY}`);
      }, 1100),
    );

    timers.current.push(
      window.setTimeout(() => {
        setStates((s) => ({ ...s, qa: "working" }));
        push("edge delegates_to · qa seat observes handoff");
      }, 1600),
    );

    timers.current.push(
      window.setTimeout(() => {
        setStates({ impl: "acked", qa: "acked" });
        push("rig ps --nodes · both seats lifecycle=running");
        setBusy(false);
      }, 2200),
    );
  }

  function reset() {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
    setBusy(false);
    setStates({ impl: "idle", qa: "idle" });
    setLog([{ t: nowStamp(), text: "Board reset · seats idle" }]);
  }

  return (
    <div className="stub">
      <div className="stub__head">
        <div>
          <p className="stub__kicker">Live-shaped fixture</p>
          <h2>Stub team board</h2>
          <p className="stub__sub">
            Mirrors the real `{STUB_POD.rig}` launch from this environment—no
            provider auth required.
          </p>
        </div>
        <div className="stub__actions">
          <button type="button" className="btn btn--primary" onClick={runDemo} disabled={busy}>
            {busy ? "Running…" : "Replay send"}
          </button>
          <button type="button" className="btn btn--ghost" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      <div className="stub__stage" aria-live="polite">
        <div className="pod">
          <header className="pod__label">
            <span>pod/{STUB_POD.pod}</span>
            <span>{STUB_POD.label}</span>
          </header>
          <div className="pod__seats">
            {STUB_POD.seats.map((seat) => (
              <article
                key={seat.id}
                className={`seat seat--${states[seat.id]}`}
                data-state={states[seat.id]}
              >
                <div className="seat__top">
                  <strong>{seat.session}</strong>
                  <span className="seat__pill">{states[seat.id]}</span>
                </div>
                <dl className="seat__meta">
                  <div>
                    <dt>role</dt>
                    <dd>{seat.role}</dd>
                  </div>
                  <div>
                    <dt>runtime</dt>
                    <dd>{seat.runtime}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
          <div className="pod__edge" aria-hidden="true">
            <span>impl</span>
            <span className="pod__arrow">delegates_to →</span>
            <span>qa</span>
          </div>
        </div>

        <aside className="transcript">
          <header>capture / events</header>
          <ul>
            {log.map((line, i) => (
              <li key={`${line.t}-${i}`}>
                <time>{line.t}</time>
                <span>{line.text}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
