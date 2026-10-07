import type { HistoryItem, MuscleId, MuscleStatus } from "../data/seed";

export function weekdayIndex(date = new Date()) {
  const js = date.getDay();
  return js === 0 ? 6 : js - 1;
}

export function isoDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function deriveHeatmap(history: HistoryItem[], days = 56) {
  const counts = new Map<string, number>();
  for (const item of history) {
    counts.set(item.date, (counts.get(item.date) ?? 0) + item.sets);
  }
  const out: number[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const n = counts.get(isoDate(date)) ?? 0;
    out.push(n === 0 ? 0 : n < 6 ? 1 : n < 12 ? 2 : 3);
  }
  return out;
}

export function deriveStreak(history: HistoryItem[]) {
  const dates = new Set(history.map((item) => item.date));
  const cursor = new Date();
  if (!dates.has(isoDate(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  for (;;) {
    if (!dates.has(isoDate(cursor))) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function deriveMuscles(
  history: HistoryItem[],
  fallback: MuscleStatus[],
): MuscleStatus[] {
  const volume = new Map<MuscleId, number>();
  const last = new Map<MuscleId, string>();
  for (const session of history) {
    for (const exercise of session.exercises ?? []) {
      const vol = exercise.sets.reduce(
        (sum, set) => sum + set.weight * set.reps,
        0,
      );
      volume.set(exercise.muscle, (volume.get(exercise.muscle) ?? 0) + vol);
      const prev = last.get(exercise.muscle);
      if (!prev || session.date > prev) last.set(exercise.muscle, session.date);
    }
  }
  if (volume.size === 0) return fallback;
  const max = Math.max(...volume.values(), 1);
  const today = new Date();
  return fallback.map((muscle) => {
    const vol = volume.get(muscle.id) ?? 0;
    const lastDate = last.get(muscle.id);
    const daysSince = lastDate
      ? Math.max(
          0,
          Math.round(
            (today.getTime() - new Date(`${lastDate}T12:00:00`).getTime()) /
              86400000,
          ),
        )
      : 21;
    const balance = Math.round((vol / max) * 100);
    const fatigue = Math.max(
      0,
      Math.min(100, Math.round(balance * Math.max(0, 1 - daysSince / 6))),
    );
    return { ...muscle, balance, fatigue, daysSince };
  });
}

const LB_PER_KG = 2.20462;

export function convertWeight(value: number, to: "lb" | "kg") {
  if (to === "kg") return Math.round((value / LB_PER_KG) * 10) / 10;
  return Math.round(value * LB_PER_KG);
}
