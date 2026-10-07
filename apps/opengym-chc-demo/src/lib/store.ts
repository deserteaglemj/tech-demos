import { useEffect, useState } from "react";
import { AppState, createSeed, SetLog } from "../data/seed";

const KEY = "chc-opengym-demo-v2";

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return createSeed();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.week || !parsed.library || !parsed.history) return createSeed();
    return parsed;
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

export type Page =
  | "home"
  | "plan"
  | "workout"
  | "stats"
  | "library"
  | "history"
  | "muscles"
  | "settings";

export function useAppStore() {
  const [state, setState] = useState<AppState>(() => load());
  const [page, setPage] = useState<Page>("home");
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

  const go = (next: Page) => setPage(next);

  const startWorkout = () => {
    setState((prev) => ({
      ...prev,
      session: { ...prev.session, started: true, finished: false },
    }));
    setPage("workout");
  };

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
          started: true,
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

  const finishWorkout = () => {
    setState((prev) => {
      const logged = prev.session.exercises.reduce(
        (n, ex) => n + ex.sets.filter((s) => s.doneAt).length,
        0,
      );
      if (logged === 0) return prev;
      const volume = prev.session.exercises.reduce(
        (n, ex) =>
          n +
          ex.sets
            .filter((s) => s.doneAt)
            .reduce((m, s) => m + s.weight * s.reps, 0),
        0,
      );
      const today = new Date().toISOString().slice(0, 10);
      return {
        ...prev,
        completedSessions: prev.completedSessions + 1,
        streakDays: prev.streakDays + (logged > 0 ? 0 : 0),
        session: { ...prev.session, finished: true },
        history: [
          {
            id: `h-${Date.now()}`,
            date: today,
            title: prev.session.title,
            durationMin: Math.max(20, Math.round(logged * 3.5)),
            sets: logged,
            volume,
          },
          ...prev.history,
        ],
      };
    });
    setRestSeconds(0);
    setPage("stats");
  };

  const logBodyWeight = (weight: number) => {
    setState((prev) => ({
      ...prev,
      bodyWeight: weight,
      bodyHistory: [
        ...prev.bodyHistory.slice(0, -1),
        {
          date: new Date().toISOString().slice(0, 10),
          weight,
        },
      ],
    }));
  };

  const setUnits = (units: "lb" | "kg") => {
    setState((prev) => ({ ...prev, units }));
  };

  const resetDemo = () => {
    const next = createSeed();
    setState(next);
    setPr(null);
    setRestSeconds(0);
    setPage("home");
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
    page,
    pr,
    restSeconds,
    loggedSets,
    totalSets,
    go,
    startWorkout,
    updateSet,
    completeSet,
    finishWorkout,
    logBodyWeight,
    setUnits,
    resetDemo,
    dismissPr: () => setPr(null),
    skipRest: () => setRestSeconds(0),
  };
}
