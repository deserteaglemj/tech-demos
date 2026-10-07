import { useEffect, useState } from "react";
import {
  AppState,
  createSeed,
  exerciseFromLibrary,
  SetLog,
} from "../data/seed";
import { convertWeight, isoDate, weekdayIndex } from "./derive";

const KEY = "chc-opengym-demo-v3";

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return createSeed();
    const parsed = JSON.parse(raw) as AppState;
    if (parsed.schema !== 3 || !parsed.routines || !parsed.library) {
      return createSeed();
    }
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
  | "settings"
  | "whoop";

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

  const startDay = (index: number) => {
    setState((prev) => {
      const day = prev.week[index];
      if (!day?.routineId) return prev;
      const routine = prev.routines.find((item) => item.id === day.routineId);
      if (!routine) return prev;
      const byId = Object.fromEntries(prev.library.map((item) => [item.id, item]));
      return {
        ...prev,
        session: {
          id: `session-${Date.now()}`,
          title: routine.title,
          dayLabel: day.day,
          estimatedMinutes: routine.minutes,
          started: true,
          finished: false,
          exercises: routine.slots.flatMap((slot) => {
            const lib = byId[slot.libraryId];
            return lib ? [exerciseFromLibrary(lib, slot.sets)] : [];
          }),
        },
      };
    });
    setRestSeconds(0);
    setPage("workout");
  };

  const startWorkout = () => {
    const index = weekdayIndex();
    if (state.week[index]?.routineId) {
      startDay(index);
      return;
    }
    const next = state.week.findIndex((item) => item.routineId);
    if (next >= 0) startDay(next);
  };

  const addToWorkout = (libraryId: string) => {
    setState((prev) => {
      const lib = prev.library.find((item) => item.id === libraryId);
      if (!lib) return prev;
      const exercise = exerciseFromLibrary(lib);
      const base =
        prev.session.finished || prev.session.exercises.length === 0
          ? {
              ...prev.session,
              id: `session-${Date.now()}`,
              title: "Extra work",
              dayLabel: "Today",
              started: true,
              finished: false,
              exercises: [],
            }
          : { ...prev.session, started: true, finished: false };
      return {
        ...prev,
        session: { ...base, exercises: [...base.exercises, exercise] },
      };
    });
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
        library: prev.library.map((lib) =>
          lib.id !== exercise.libraryId
            ? lib
            : {
                ...lib,
                lastWeight: set.weight,
                lastReps: set.reps,
                prWeight: isPr ? set.weight : lib.prWeight,
              },
        ),
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
      const today = isoDate();
      const exercises = prev.session.exercises
        .map((exercise) => ({
          name: exercise.name,
          muscle: exercise.muscle,
          sets: exercise.sets
            .filter((set) => set.doneAt && set.reps > 0)
            .map((set) => ({ weight: set.weight, reps: set.reps })),
        }))
        .filter((exercise) => exercise.sets.length > 0);
      return {
        ...prev,
        completedSessions: prev.completedSessions + 1,
        session: { ...prev.session, finished: true },
        history: [
          {
            id: `h-${Date.now()}`,
            date: today,
            title: prev.session.title,
            durationMin: Math.max(20, Math.round(logged * 3.5)),
            sets: logged,
            volume,
            exercises,
          },
          ...prev.history,
        ],
      };
    });
    setRestSeconds(0);
    setPage("stats");
  };

  const logBodyWeight = (weight: number) => {
    const today = isoDate();
    setState((prev) => {
      const without = prev.bodyHistory.filter((point) => point.date !== today);
      return {
        ...prev,
        bodyWeight: weight,
        bodyHistory: [...without, { date: today, weight }].sort((a, b) =>
          a.date.localeCompare(b.date),
        ),
      };
    });
  };

  const setUnits = (units: "lb" | "kg") => {
    setState((prev) => {
      if (prev.units === units) return prev;
      const convert = (value: number) => convertWeight(value, units);
      return {
        ...prev,
        units,
        bodyWeight: convert(prev.bodyWeight),
        bodyGoal: Math.round(convert(prev.bodyGoal)),
        bodyHistory: prev.bodyHistory.map((point) => ({
          ...point,
          weight: convert(point.weight),
        })),
        library: prev.library.map((item) => ({
          ...item,
          lastWeight: convert(item.lastWeight),
          prWeight: convert(item.prWeight),
        })),
        history: prev.history.map((item) => ({
          ...item,
          volume: Math.round(convert(item.volume)),
          exercises: (item.exercises ?? []).map((exercise) => ({
            ...exercise,
            sets: exercise.sets.map((set) => ({
              ...set,
              weight: convert(set.weight),
            })),
          })),
        })),
        session: {
          ...prev.session,
          exercises: prev.session.exercises.map((exercise) => ({
            ...exercise,
            lastWeight: convert(exercise.lastWeight),
            prWeight: convert(exercise.prWeight),
            sets: exercise.sets.map((set) => ({
              ...set,
              weight: convert(set.weight),
            })),
          })),
        },
      };
    });
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
    startDay,
    addToWorkout,
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
