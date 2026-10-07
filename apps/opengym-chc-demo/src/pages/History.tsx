import { useState } from "react";
import type { AppState } from "../data/seed";
import type { Page } from "../lib/store";

type Props = {
  state: AppState;
  onGo: (page: Page) => void;
};

export function History({ state, onGo }: Props) {
  const [open, setOpen] = useState<string | null>(state.history[0]?.id ?? null);
  return (
    <section className="section">
      <div className="row-between">
        <div>
          <h2>History</h2>
          <p className="lede">Past sessions — edit after the fact in full openGym.</p>
        </div>
        <button type="button" className="ghost-btn" onClick={() => onGo("stats")}>
          Back to Stats
        </button>
      </div>

      <div className="history-list">
        {state.history.map((item) => (
          <article key={item.id} className="history-block">
            <button
              type="button"
              className="history-row history-toggle"
              onClick={() => setOpen(open === item.id ? null : item.id)}
            >
              <div className="history-date">
                <strong>{item.date.slice(5)}</strong>
                <span>{item.date.slice(0, 4)}</span>
              </div>
              <div className="history-body">
                <h3>{item.title}</h3>
                <p>
                  {item.durationMin} min · {item.sets} sets ·{" "}
                  {item.volume.toLocaleString()} {state.units} volume
                </p>
              </div>
            </button>
            {open === item.id && (
              <ul className="plain-list">
                {(item.exercises ?? []).map((exercise) => (
                  <li key={exercise.name}>
                    {exercise.name}:{" "}
                    {exercise.sets
                      .map((set) => `${set.weight}×${set.reps}`)
                      .join(", ")}
                  </li>
                ))}
                {(item.exercises ?? []).length === 0 && (
                  <li>Set detail was not stored for this session.</li>
                )}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
