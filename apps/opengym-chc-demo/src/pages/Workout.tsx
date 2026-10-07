import type { AppState } from "../data/seed";

type Props = {
  state: AppState;
  loggedSets: number;
  totalSets: number;
  updateSet: (
    exerciseId: string,
    setId: string,
    patch: { weight?: number; reps?: number },
  ) => void;
  completeSet: (exerciseId: string, setId: string) => void;
  finishWorkout: () => void;
};

export function Workout({
  state,
  loggedSets,
  totalSets,
  updateSet,
  completeSet,
  finishWorkout,
}: Props) {
  return (
    <section className="section workout-page">
      <div className="workout-head">
        <div>
          <p className="kicker-inline">{state.session.dayLabel}</p>
          <h2>{state.session.title}</h2>
          <p className="lede">
            Guided session · {loggedSets}/{totalSets} sets · last loads
            pre-filled
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          disabled={loggedSets === 0}
          onClick={finishWorkout}
        >
          Finish
        </button>
      </div>

      <div className="exercise-list">
        {state.session.exercises.map((ex, i) => {
          const done = ex.sets.filter((s) => s.doneAt).length;
          return (
            <article
              key={ex.id}
              className="exercise"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <header>
                <div>
                  <h3>{ex.name}</h3>
                  <p>
                    {ex.focus} · {ex.targetSets} × {ex.targetReps} · last{" "}
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
