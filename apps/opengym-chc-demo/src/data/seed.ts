export type SetLog = {
  id: string;
  weight: number;
  reps: number;
  doneAt?: string;
};

export type Exercise = {
  id: string;
  libraryId: string;
  name: string;
  focus: string;
  muscle: MuscleId;
  equipment: string;
  targetSets: number;
  targetReps: string;
  lastWeight: number;
  lastReps: number;
  prWeight: number;
  sets: SetLog[];
};

export type MuscleId =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "core";

export type DayPlan = {
  day: string;
  short: string;
  routineId: string | null;
  title: string;
  load: "rest" | "push" | "pull" | "legs" | "upper" | "lower";
};

export type HistorySet = { weight: number; reps: number };

export type HistoryExercise = {
  name: string;
  muscle: MuscleId;
  sets: HistorySet[];
};

export type HistoryItem = {
  id: string;
  date: string;
  title: string;
  durationMin: number;
  sets: number;
  volume: number;
  exercises: HistoryExercise[];
};

export type LibraryExercise = {
  id: string;
  name: string;
  muscle: MuscleId;
  equipment: string;
  level: "beginner" | "intermediate" | "advanced";
  targetReps: string;
  defaultSets: number;
  lastWeight: number;
  lastReps: number;
  prWeight: number;
};

export type Routine = {
  id: string;
  title: string;
  minutes: number;
  slots: { libraryId: string; sets: number }[];
};

export type BodyPoint = { date: string; weight: number };

export type MuscleStatus = {
  id: MuscleId;
  label: string;
  balance: number; // 0-100 volume share
  fatigue: number; // 0-100
  daysSince: number;
};

export type AppState = {
  schema: 3;
  athlete: string;
  coach: string;
  program: string;
  units: "lb" | "kg";
  streakDays: number;
  bodyWeight: number;
  bodyGoal: number;
  bodyHistory: BodyPoint[];
  heatmap: number[];
  week: DayPlan[];
  routines: Routine[];
  library: LibraryExercise[];
  history: HistoryItem[];
  muscles: MuscleStatus[];
  session: {
    id: string;
    title: string;
    dayLabel: string;
    estimatedMinutes: number;
    started: boolean;
    finished: boolean;
    exercises: Exercise[];
  };
  completedSessions: number;
};

export const MUSCLE_LABELS: Record<MuscleId, string> = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  biceps: "Biceps",
  triceps: "Triceps",
  quads: "Quads",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  calves: "Calves",
  core: "Core",
};

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2, 10)}`;

function sets(weight: number, count: number): SetLog[] {
  return Array.from({ length: count }, () => ({
    id: uid(),
    weight,
    reps: 0,
  }));
}

const library: LibraryExercise[] = [
  { id: "l1", name: "Incline Dumbbell Press", muscle: "chest", equipment: "Dumbbells", level: "intermediate", targetReps: "8–10", defaultSets: 3, lastWeight: 70, lastReps: 9, prWeight: 75 },
  { id: "l2", name: "Flat Bench Press", muscle: "chest", equipment: "Barbell", level: "intermediate", targetReps: "5–8", defaultSets: 3, lastWeight: 185, lastReps: 6, prWeight: 195 },
  { id: "l3", name: "Chest-Supported Row", muscle: "back", equipment: "Dumbbells", level: "intermediate", targetReps: "8–12", defaultSets: 3, lastWeight: 70, lastReps: 10, prWeight: 75 },
  { id: "l4", name: "Lat Pulldown", muscle: "back", equipment: "Cable", level: "beginner", targetReps: "8–12", defaultSets: 3, lastWeight: 120, lastReps: 10, prWeight: 130 },
  { id: "l5", name: "Seated Dumbbell Press", muscle: "shoulders", equipment: "Dumbbells", level: "beginner", targetReps: "8–10", defaultSets: 3, lastWeight: 50, lastReps: 8, prWeight: 55 },
  { id: "l6", name: "Lateral Raise", muscle: "shoulders", equipment: "Dumbbells", level: "beginner", targetReps: "12–15", defaultSets: 3, lastWeight: 20, lastReps: 12, prWeight: 25 },
  { id: "l7", name: "Incline Dumbbell Curl", muscle: "biceps", equipment: "Dumbbells", level: "beginner", targetReps: "10–12", defaultSets: 2, lastWeight: 30, lastReps: 11, prWeight: 35 },
  { id: "l8", name: "Rope Pushdown", muscle: "triceps", equipment: "Cable", level: "beginner", targetReps: "10–15", defaultSets: 3, lastWeight: 50, lastReps: 12, prWeight: 60 },
  { id: "l9", name: "Back Squat", muscle: "quads", equipment: "Barbell", level: "advanced", targetReps: "5–8", defaultSets: 4, lastWeight: 225, lastReps: 5, prWeight: 245 },
  { id: "l10", name: "Romanian Deadlift", muscle: "hamstrings", equipment: "Barbell", level: "intermediate", targetReps: "6–10", defaultSets: 3, lastWeight: 185, lastReps: 8, prWeight: 205 },
  { id: "l11", name: "Hip Thrust", muscle: "glutes", equipment: "Barbell", level: "intermediate", targetReps: "8–12", defaultSets: 3, lastWeight: 225, lastReps: 10, prWeight: 245 },
  { id: "l12", name: "Standing Calf Raise", muscle: "calves", equipment: "Machine", level: "beginner", targetReps: "10–15", defaultSets: 3, lastWeight: 140, lastReps: 12, prWeight: 160 },
  { id: "l13", name: "Hanging Knee Raise", muscle: "core", equipment: "Bodyweight", level: "beginner", targetReps: "8–15", defaultSets: 3, lastWeight: 0, lastReps: 12, prWeight: 0 },
  { id: "l14", name: "Cable Face Pull", muscle: "shoulders", equipment: "Cable", level: "beginner", targetReps: "12–15", defaultSets: 3, lastWeight: 40, lastReps: 15, prWeight: 50 },
  { id: "l15", name: "Goblet Squat", muscle: "quads", equipment: "Dumbbells", level: "beginner", targetReps: "8–12", defaultSets: 3, lastWeight: 70, lastReps: 10, prWeight: 80 },
];

export const ROUTINES: Routine[] = [
  {
    id: "upper-a",
    title: "Upper A — Press & thickness",
    minutes: 52,
    slots: [
      { libraryId: "l1", sets: 3 },
      { libraryId: "l3", sets: 3 },
      { libraryId: "l5", sets: 3 },
      { libraryId: "l7", sets: 2 },
    ],
  },
  {
    id: "lower-a",
    title: "Lower A — Squat focus",
    minutes: 48,
    slots: [
      { libraryId: "l9", sets: 4 },
      { libraryId: "l15", sets: 3 },
      { libraryId: "l11", sets: 3 },
      { libraryId: "l12", sets: 3 },
    ],
  },
  {
    id: "upper-b",
    title: "Upper B — Pull bias",
    minutes: 50,
    slots: [
      { libraryId: "l4", sets: 3 },
      { libraryId: "l3", sets: 3 },
      { libraryId: "l14", sets: 3 },
      { libraryId: "l8", sets: 3 },
      { libraryId: "l6", sets: 3 },
    ],
  },
  {
    id: "lower-b",
    title: "Lower B — Hinge focus",
    minutes: 46,
    slots: [
      { libraryId: "l10", sets: 3 },
      { libraryId: "l11", sets: 3 },
      { libraryId: "l9", sets: 3 },
      { libraryId: "l13", sets: 3 },
    ],
  },
];

export function exerciseFromLibrary(
  lib: LibraryExercise,
  setCount = lib.defaultSets,
): Exercise {
  return {
    id: uid(),
    libraryId: lib.id,
    name: lib.name,
    focus: `${MUSCLE_LABELS[lib.muscle]} · ${lib.equipment}`,
    muscle: lib.muscle,
    equipment: lib.equipment,
    targetSets: setCount,
    targetReps: lib.targetReps,
    lastWeight: lib.lastWeight,
    lastReps: lib.lastReps,
    prWeight: lib.prWeight,
    sets: sets(lib.lastWeight, setCount),
  };
}

export function createSeed(): AppState {
  const byId = Object.fromEntries(library.map((item) => [item.id, item]));
  const upper = ROUTINES[0];
  const exercises = upper.slots.map((slot) =>
    exerciseFromLibrary(byId[slot.libraryId], slot.sets),
  );

  const heatmap = Array.from({ length: 56 }, (_, i) => {
    if (i % 7 === 6) return 0;
    return [1, 2, 3, 2, 3, 1, 0][i % 7] ?? 1;
  });

  const today = new Date();
  const bodyHistory: BodyPoint[] = Array.from({ length: 10 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (9 - i) * 7);
    return {
      date: d.toISOString().slice(0, 10),
      weight: 146 + i * 1.05 + (i % 2 === 0 ? 0.2 : -0.15),
    };
  });

  const history: HistoryItem[] = [
    {
      id: "h1",
      date: offsetDate(-1),
      title: "Lower A — Squat focus",
      durationMin: 48,
      sets: 4,
      volume: 1410,
      exercises: [
        { name: "Back Squat", muscle: "quads", sets: [{ weight: 225, reps: 5 }, { weight: 225, reps: 5 }] },
        { name: "Hip Thrust", muscle: "glutes", sets: [{ weight: 225, reps: 10 }, { weight: 225, reps: 10 }] },
      ],
    },
    {
      id: "h2",
      date: offsetDate(-2),
      title: "Upper B — Pull bias",
      durationMin: 51,
      sets: 3,
      volume: 510,
      exercises: [
        { name: "Lat Pulldown", muscle: "back", sets: [{ weight: 120, reps: 10 }, { weight: 120, reps: 10 }] },
        { name: "Rope Pushdown", muscle: "triceps", sets: [{ weight: 50, reps: 12 }] },
      ],
    },
    {
      id: "h3",
      date: offsetDate(-4),
      title: "Upper A — Press & thickness",
      durationMin: 54,
      sets: 3,
      volume: 830,
      exercises: [
        { name: "Incline Dumbbell Press", muscle: "chest", sets: [{ weight: 70, reps: 9 }, { weight: 70, reps: 8 }] },
        { name: "Chest-Supported Row", muscle: "back", sets: [{ weight: 70, reps: 10 }] },
      ],
    },
  ];

  const muscles: MuscleStatus[] = [
    { id: "chest", label: "Chest", balance: 78, fatigue: 62, daysSince: 0 },
    { id: "back", label: "Back", balance: 84, fatigue: 55, daysSince: 0 },
    { id: "shoulders", label: "Shoulders", balance: 71, fatigue: 48, daysSince: 0 },
    { id: "biceps", label: "Biceps", balance: 60, fatigue: 35, daysSince: 0 },
    { id: "triceps", label: "Triceps", balance: 58, fatigue: 30, daysSince: 2 },
    { id: "quads", label: "Quads", balance: 90, fatigue: 70, daysSince: 1 },
    { id: "hamstrings", label: "Hamstrings", balance: 72, fatigue: 40, daysSince: 1 },
    { id: "glutes", label: "Glutes", balance: 68, fatigue: 45, daysSince: 1 },
    { id: "calves", label: "Calves", balance: 35, fatigue: 10, daysSince: 8 },
    { id: "core", label: "Core", balance: 42, fatigue: 18, daysSince: 5 },
  ];

  return {
    schema: 3,
    athlete: "Founding 8 athlete",
    coach: "Chris Harris",
    program: "Breaking Limits · Upper/Lower",
    units: "lb",
    streakDays: 5,
    bodyWeight: 156.4,
    bodyGoal: 170,
    bodyHistory,
    heatmap,
    completedSessions: 18,
    week: [
      { day: "Monday", short: "Mon", routineId: "upper-a", title: "Upper A — Press & thickness", load: "upper" },
      { day: "Tuesday", short: "Tue", routineId: "lower-a", title: "Lower A — Squat focus", load: "lower" },
      { day: "Wednesday", short: "Wed", routineId: null, title: "Rest / walk", load: "rest" },
      { day: "Thursday", short: "Thu", routineId: "upper-b", title: "Upper B — Pull bias", load: "upper" },
      { day: "Friday", short: "Fri", routineId: "lower-b", title: "Lower B — Hinge focus", load: "lower" },
      { day: "Saturday", short: "Sat", routineId: null, title: "Optional pump", load: "rest" },
      { day: "Sunday", short: "Sun", routineId: null, title: "Rest", load: "rest" },
    ],
    routines: ROUTINES,
    library,
    history,
    muscles,
    session: {
      id: "session-upper-a",
      title: "Upper A — Press & Thickness",
      dayLabel: "Today · Monday",
      estimatedMinutes: 52,
      started: false,
      finished: false,
      exercises,
    },
  };
}

function offsetDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
