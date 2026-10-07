import type { AppState } from "../data/seed";

type Props = {
  state: AppState;
  updateSet: (
    exerciseId: string,
    setId: string,
    patch: { weight?: number; reps?: number },
  ) => void;
  completeSet: (exerciseId: string, setId: string) => void;
};

export function Workout({ state, updateSet, completeSet }: Props) {
  return (
    <section className="section">
      <h2>Guided workout</h2>
      <p className="lede">
        Log each set. Rest starts after you confirm. Beat a PR and the ember
        toast fires.
      </p>

      <div className="exercise-list">
        {state.session.exercises.map((ex, i) => {
          const done = ex.sets.filter((s) => s.doneAt).length;
          return (
            <article
              key={ex.id}
              className="exercise"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <header>
                <div>
                  <h3>{ex.name}</h3>
                  <p>
                    {ex.focus} · target {ex.targetSets} × {ex.targetReps} · last{" "}
                    {ex.lastWeight} × {ex.lastReps}
                  </p>
                </div>
                <span className="badge">
                  {done}/{ex.sets.length} · PR {ex.prWeight}
                </span>
              </header>

              {ex.sets.map((set, idx) => {
                const isDone = Boolean(set.doneAt);
                return (
                  <div
                    key={set.id}
                    className={`set-row${isDone ? " done" : ""}`}
                  >
                    <span className="idx">{idx + 1}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      aria-label={`${ex.name} set ${idx + 1} weight`}
                      value={set.weight}
                      disabled={isDone}
                      onChange={(e) =>
                        updateSet(ex.id, set.id, {
                          weight: Number(e.target.value),
                        })
                      }
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      aria-label={`${ex.name} set ${idx + 1} reps`}
                      value={set.reps || ""}
                      placeholder="reps"
                      disabled={isDone}
                      onChange={(e) =>
                        updateSet(ex.id, set.id, {
                          reps: Number(e.target.value),
                        })
                      }
                    />
                    <button
                      type="button"
                      className={`log-btn${isDone ? " done" : ""}`}
                      disabled={isDone || set.reps <= 0}
                      onClick={() => completeSet(ex.id, set.id)}
                    >
                      {isDone ? "Logged" : "Log"}
                    </button>
                  </div>
                );
              })}
            </article>
          );
        })}
      </div>
    </section>
  );
}
