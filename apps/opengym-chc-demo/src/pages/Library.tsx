import { useMemo, useState } from "react";
import { MUSCLE_LABELS, type AppState, type MuscleId } from "../data/seed";
import type { Page } from "../lib/store";

type Props = {
  state: AppState;
  onGo: (page: Page) => void;
};

const FILTERS: Array<MuscleId | "all"> = [
  "all",
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "quads",
  "hamstrings",
  "glutes",
  "calves",
  "core",
];

export function Library({ state, onGo }: Props) {
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState<MuscleId | "all">("all");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.library.filter((ex) => {
      if (muscle !== "all" && ex.muscle !== muscle) return false;
      if (!q) return true;
      return (
        ex.name.toLowerCase().includes(q) ||
        ex.equipment.toLowerCase().includes(q) ||
        MUSCLE_LABELS[ex.muscle].toLowerCase().includes(q)
      );
    });
  }, [state.library, query, muscle]);

  return (
    <section className="section">
      <div className="row-between">
        <div>
          <h2>Exercises</h2>
          <p className="lede">
            CHC library slice — search, filter by muscle, open the map.
          </p>
        </div>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => onGo("muscles")}
        >
          Muscle map
        </button>
      </div>

      <label className="search-field">
        <span className="sr-only">Search exercises</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, equipment, muscle…"
        />
      </label>

      <div className="chip-row" role="tablist" aria-label="Muscle filter">
        {FILTERS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={muscle === id}
            className={muscle === id ? "chip on" : "chip"}
            onClick={() => setMuscle(id)}
          >
            {id === "all" ? "All" : MUSCLE_LABELS[id]}
          </button>
        ))}
      </div>

      <div className="lib-list">
        {items.map((ex) => (
          <article key={ex.id} className="lib-row">
            <div>
              <h3>{ex.name}</h3>
              <p>
                {MUSCLE_LABELS[ex.muscle]} · {ex.equipment} · {ex.level}
              </p>
            </div>
            <span className="badge soft">{ex.muscle}</span>
          </article>
        ))}
        {items.length === 0 && (
          <p className="lede">No exercises match that filter.</p>
        )}
      </div>
    </section>
  );
}
