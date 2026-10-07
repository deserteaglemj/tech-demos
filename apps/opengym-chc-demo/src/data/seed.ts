export type SetLog = {
  id: string;
  weight: number;
  reps: number;
  doneAt?: string;
};

export type Exercise = {
  id: string;
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

export type HistoryItem = {
  id: string;
  date: string;
  title: string;
  durationMin: number;
  sets: number;
  volume: number;
};

export type LibraryExercise = {
  id: string;
  name: string;
  muscle: MuscleId;
  equipment: string;
  level: "beginner" | "intermediate" | "advanced";
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

export function createSeed(): AppState {
  const exercises: Exercise[] = [
    {
      id: "ex-bench",
      name: "Incline Dumbbell Press",
      focus: "Chest · Upper",
      muscle: "chest",
      equipment: "Dumbbells",
      targetSets: 3,
      targetReps: "8–10",
      lastWeight: 70,
      lastReps: 9,
      prWeight: 75,
      sets: sets(70, 3),
    },
    {
      id: "ex-row",
      name: "Chest-Supported Row",
      focus: "Back · Thickness",
      muscle: "back",
      equipment: "Dumbbells",
      targetSets: 3,
      targetReps: "8–12",
      lastWeight: 135,
      lastReps: 10,
      prWeight: 145,
      sets: sets(135, 3),
    },
    {
      id: "ex-ohp",
      name: "Seated Dumbbell Press",
      focus: "Shoulders",
      muscle: "shoulders",
      equipment: "Dumbbells",
      targetSets: 3,
      targetReps: "8–10",
      lastWeight: 50,
      lastReps: 8,
      prWeight: 55,
      sets: sets(50, 3),
    },
    {
      id: "ex-curl",
      name: "Incline Dumbbell Curl",
      focus: "Arms",
      muscle: "biceps",
      equipment: "Dumbbells",
      targetSets: 2,
      targetReps: "10–12",
      lastWeight: 30,
      lastReps: 11,
      prWeight: 35,
      sets: sets(30, 2),
    },
  ];

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
      sets: 14,
      volume: 18420,
    },
    {
      id: "h2",
      date: offsetDate(-2),
      title: "Upper B — Pull bias",
      durationMin: 51,
      sets: 15,
      volume: 16110,
    },
    {
      id: "h3",
      date: offsetDate(-4),
      title: "Upper A — Press & thickness",
      durationMin: 54,
      sets: 13,
      volume: 15240,
    },
    {
      id: "h4",
      date: offsetDate(-5),
      title: "Lower B — Hinge focus",
      durationMin: 46,
      sets: 12,
      volume: 17600,
    },
    {
      id: "h5",
      date: offsetDate(-7),
      title: "Upper A — Press & thickness",
      durationMin: 50,
      sets: 11,
      volume: 14880,
    },
  ];

  const library: LibraryExercise[] = [
    { id: "l1", name: "Incline Dumbbell Press", muscle: "chest", equipment: "Dumbbells", level: "intermediate" },
    { id: "l2", name: "Flat Bench Press", muscle: "chest", equipment: "Barbell", level: "intermediate" },
    { id: "l3", name: "Chest-Supported Row", muscle: "back", equipment: "Dumbbells", level: "intermediate" },
    { id: "l4", name: "Lat Pulldown", muscle: "back", equipment: "Cable", level: "beginner" },
    { id: "l5", name: "Seated Dumbbell Press", muscle: "shoulders", equipment: "Dumbbells", level: "beginner" },
    { id: "l6", name: "Lateral Raise", muscle: "shoulders", equipment: "Dumbbells", level: "beginner" },
    { id: "l7", name: "Incline Dumbbell Curl", muscle: "biceps", equipment: "Dumbbells", level: "beginner" },
    { id: "l8", name: "Rope Pushdown", muscle: "triceps", equipment: "Cable", level: "beginner" },
    { id: "l9", name: "Back Squat", muscle: "quads", equipment: "Barbell", level: "advanced" },
    { id: "l10", name: "Romanian Deadlift", muscle: "hamstrings", equipment: "Barbell", level: "intermediate" },
    { id: "l11", name: "Hip Thrust", muscle: "glutes", equipment: "Barbell", level: "intermediate" },
    { id: "l12", name: "Standing Calf Raise", muscle: "calves", equipment: "Machine", level: "beginner" },
    { id: "l13", name: "Hanging Knee Raise", muscle: "core", equipment: "Bodyweight", level: "beginner" },
    { id: "l14", name: "Cable Face Pull", muscle: "shoulders", equipment: "Cable", level: "beginner" },
    { id: "l15", name: "Goblet Squat", muscle: "quads", equipment: "Dumbbells", level: "beginner" },
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
