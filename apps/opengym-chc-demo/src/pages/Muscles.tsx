import { useState } from "react";
import type { AppState } from "../data/seed";
import { deriveMuscles } from "../lib/derive";
import type { Page } from "../lib/store";

type Props = {
  state: AppState;
  onGo: (page: Page) => void;
};

type Mode = "balance" | "fatigue" | "detrained";

export function Muscles({ state, onGo }: Props) {
  const [mode, setMode] = useState<Mode>("balance");
  const muscles = deriveMuscles(state.history, state.muscles);

  const value = (m: (typeof muscles)[number]) => {
    if (mode === "balance") return m.balance;
    if (mode === "fatigue") return m.fatigue;
    return Math.min(100, m.daysSince * 12);
  };

  const caption =
    mode === "balance"
      ? "Where volume went this block"
      : mode === "fatigue"
        ? "Still recovering from recent work"
        : "Days since last hard stimulus";

  return (
    <section className="section">
      <div className="row-between">
        <div>
          <h2>Muscle map</h2>
          <p className="lede">{caption}</p>
        </div>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => onGo("library")}
        >
          Exercises
        </button>
      </div>

      <div className="chip-row" role="tablist" aria-label="Map mode">
        {(
          [
            ["balance", "Balance"],
            ["fatigue", "Fatigue"],
            ["detrained", "Detrained"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            className={mode === id ? "chip on" : "chip"}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="muscle-grid">
        {muscles.map((m) => {
          const v = value(m);
          return (
            <article key={m.id} className="muscle-card">
              <div className="muscle-top">
                <h3>{m.label}</h3>
                <strong>
                  {mode === "detrained" ? `${m.daysSince}d` : `${v}%`}
                </strong>
              </div>
              <div className="progress-bar">
                <span
                  style={{
                    width: `${v}%`,
                    opacity: 0.45 + v / 200,
                  }}
                />
              </div>
              <p>
                {mode === "balance" && `Share of block volume`}
                {mode === "fatigue" && `Recovery load`}
                {mode === "detrained" &&
                  (m.daysSince >= 7
                    ? "Needs attention"
                    : "Recently trained")}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
