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
  targetSets: number;
  targetReps: string;
  lastWeight: number;
  lastReps: number;
  prWeight: number;
  sets: SetLog[];
};

export type Session = {
  id: string;
  title: string;
  dayLabel: string;
  estimatedMinutes: number;
  exercises: Exercise[];
};

export type BodyPoint = { date: string; weight: number };

export type AppState = {
  athlete: string;
  coach: string;
  program: string;
  streakDays: number;
  bodyWeight: number;
  bodyGoal: number;
  bodyHistory: BodyPoint[];
  heatmap: number[]; // 28 days intensity 0-3
  session: Session;
  completedSessions: number;
};

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2, 10)}`;

export function createSeed(): AppState {
  const exercises: Exercise[] = [
    {
      id: "ex-bench",
      name: "Incline Dumbbell Press",
      focus: "Chest · Upper",
      targetSets: 3,
      targetReps: "8–10",
      lastWeight: 70,
      lastReps: 9,
      prWeight: 75,
      sets: [
        { id: uid(), weight: 70, reps: 0 },
        { id: uid(), weight: 70, reps: 0 },
        { id: uid(), weight: 70, reps: 0 },
      ],
    },
    {
      id: "ex-row",
      name: "Chest-Supported Row",
      focus: "Back · Thickness",
      targetSets: 3,
      targetReps: "8–12",
      lastWeight: 135,
      lastReps: 10,
      prWeight: 145,
      sets: [
        { id: uid(), weight: 135, reps: 0 },
        { id: uid(), weight: 135, reps: 0 },
        { id: uid(), weight: 135, reps: 0 },
      ],
    },
    {
      id: "ex-ohp",
      name: "Seated Dumbbell Press",
      focus: "Shoulders",
      targetSets: 3,
      targetReps: "8–10",
      lastWeight: 50,
      lastReps: 8,
      prWeight: 55,
      sets: [
        { id: uid(), weight: 50, reps: 0 },
        { id: uid(), weight: 50, reps: 0 },
        { id: uid(), weight: 50, reps: 0 },
      ],
    },
    {
      id: "ex-curl",
      name: "Incline Dumbbell Curl",
      focus: "Arms",
      targetSets: 2,
      targetReps: "10–12",
      lastWeight: 30,
      lastReps: 11,
      prWeight: 35,
      sets: [
        { id: uid(), weight: 30, reps: 0 },
        { id: uid(), weight: 30, reps: 0 },
      ],
    },
  ];

  const heatmap = Array.from({ length: 28 }, (_, i) => {
    if (i % 7 === 6) return 0;
    if (i > 24) return 0;
    return [1, 2, 3, 2, 3, 1, 0][i % 7] ?? 1;
  });

  const today = new Date();
  const bodyHistory: BodyPoint[] = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (7 - i) * 7);
    return {
      date: d.toISOString().slice(0, 10),
      weight: 148 + i * 1.1 + (i % 2 === 0 ? 0.3 : -0.2),
    };
  });

  return {
    athlete: "Founding 8 athlete",
    coach: "Chris Harris",
    program: "Breaking Limits · Upper A",
    streakDays: 5,
    bodyWeight: 156.4,
    bodyGoal: 170,
    bodyHistory,
    heatmap,
    completedSessions: 18,
    session: {
      id: "session-upper-a",
      title: "Upper A — Press & Thickness",
      dayLabel: "Today",
      estimatedMinutes: 52,
      exercises,
    },
  };
}
