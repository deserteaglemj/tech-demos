import { useEffect, useState } from "react";
import { AppState, createSeed, SetLog } from "../data/seed";

const KEY = "chc-opengym-demo-v1";

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return createSeed();
    return JSON.parse(raw) as AppState;
  } catch {
    return createSeed();
  }
}

function save(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export type PrEvent = {
  exerciseName: string;
  weight: number;
  reps: number;
} | null;

export function useAppStore() {
  const [state, setState] = useState<AppState>(() => load());
  const [pr, setPr] = useState<PrEvent>(null);
  const [restSeconds, setRestSeconds] = useState(0);

  useEffect(() => {
    save(state);
  }, [state]);

  useEffect(() => {
    if (restSeconds <= 0) return;
    const t = window.setInterval(() => {
      setRestSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [restSeconds]);

  const updateSet = (
    exerciseId: string,
    setId: string,
    patch: Partial<SetLog>,
  ) => {
    setState((prev) => ({
      ...prev,
      session: {
        ...prev.session,
        exercises: prev.session.exercises.map((ex) =>
          ex.id !== exerciseId
            ? ex
            : {
                ...ex,
                sets: ex.sets.map((s) =>
                  s.id === setId ? { ...s, ...patch } : s,
                ),
              },
        ),
      },
    }));
  };

  const completeSet = (exerciseId: string, setId: string) => {
    setState((prev) => {
      const exercise = prev.session.exercises.find((e) => e.id === exerciseId);
      const set = exercise?.sets.find((s) => s.id === setId);
      if (!exercise || !set || set.reps <= 0) return prev;

      const isPr = set.weight > exercise.prWeight;
      if (isPr) {
        setPr({
          exerciseName: exercise.name,
          weight: set.weight,
          reps: set.reps,
        });
        window.setTimeout(() => setPr(null), 4200);
      }

      setRestSeconds(90);

      return {
        ...prev,
        session: {
          ...prev.session,
          exercises: prev.session.exercises.map((ex) => {
            if (ex.id !== exerciseId) return ex;
            return {
              ...ex,
              prWeight: isPr ? set.weight : ex.prWeight,
              lastWeight: set.weight,
              lastReps: set.reps,
              sets: ex.sets.map((s) =>
                s.id === setId
                  ? { ...s, doneAt: new Date().toISOString() }
                  : s,
              ),
            };
          }),
        },
      };
    });
  };

  const resetDemo = () => {
    const next = createSeed();
    setState(next);
    setPr(null);
    setRestSeconds(0);
  };

  const loggedSets = state.session.exercises.reduce(
    (n, ex) => n + ex.sets.filter((s) => s.doneAt).length,
    0,
  );
  const totalSets = state.session.exercises.reduce(
    (n, ex) => n + ex.sets.length,
    0,
  );

  return {
    state,
    pr,
    restSeconds,
    loggedSets,
    totalSets,
    updateSet,
    completeSet,
    resetDemo,
    dismissPr: () => setPr(null),
    skipRest: () => setRestSeconds(0),
  };
}
