export type WhoopCycle = {
  date: string;
  recovery: number | null;
  rhr: number | null;
  hrv: number | null;
  strain: number | null;
  calories: number | null;
  maxHr: number | null;
  avgHr: number | null;
  sleepPerformance: number | null;
  sleepMin: number | null;
  lightMin: number | null;
  deepMin: number | null;
  remMin: number | null;
  awakeMin: number | null;
  debtMin: number | null;
  efficiency: number | null;
  consistency: number | null;
  resp: number | null;
  spo2: number | null;
  skin: number | null;
};

export type WhoopWorkout = {
  date: string;
  start: string;
  end: string;
  duration: number;
  activity: string;
  strain: number | null;
  calories: number | null;
  maxHr: number | null;
  avgHr: number | null;
  zones: number[];
};

export type WhoopJournal = {
  date: string;
  question: string;
  yes: boolean;
  notes: string;
};

export type WhoopBundle = {
  cycles: WhoopCycle[];
  workouts: WhoopWorkout[];
  journal: WhoopJournal[];
  loadedAt: string;
};

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let cell = "";
  let row: string[] = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else quoted = false;
      } else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") cell += char;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [header, ...body] = rows.filter((line) => line.some((value) => value));
  if (!header) return [];
  return body.map((values) =>
    Object.fromEntries(header.map((key, index) => [key, values[index] ?? ""])),
  );
}

function num(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function day(value: string | undefined) {
  return (value ?? "").slice(0, 10);
}

export function parseWhoop(files: {
  cycles: string;
  workouts: string;
  journal: string;
}): WhoopBundle {
  const cycles = parseCsv(files.cycles)
    .map((row) => ({
      date: day(row["Cycle start time"]),
      recovery: num(row["Recovery score %"]),
      rhr: num(row["Resting heart rate (bpm)"]),
      hrv: num(row["Heart rate variability (ms)"]),
      strain: num(row["Day Strain"]),
      calories: num(row["Energy burned (cal)"]),
      maxHr: num(row["Max HR (bpm)"]),
      avgHr: num(row["Average HR (bpm)"]),
      sleepPerformance: num(row["Sleep performance %"]),
      sleepMin: num(row["Asleep duration (min)"]),
      lightMin: num(row["Light sleep duration (min)"]),
      deepMin: num(row["Deep (SWS) duration (min)"]),
      remMin: num(row["REM duration (min)"]),
      awakeMin: num(row["Awake duration (min)"]),
      debtMin: num(row["Sleep debt (min)"]),
      efficiency: num(row["Sleep efficiency %"]),
      consistency: num(row["Sleep consistency %"]),
      resp: num(row["Respiratory rate (rpm)"]),
      spo2: num(row["Blood oxygen %"]),
      skin: num(row["Skin temp (celsius)"]),
    }))
    .filter((row) => row.date)
    .sort((a, b) => a.date.localeCompare(b.date));

  const workouts = parseCsv(files.workouts)
    .map((row) => ({
      date: day(row["Workout start time"] || row["Cycle start time"]),
      start: row["Workout start time"] ?? "",
      end: row["Workout end time"] ?? "",
      duration: num(row["Duration (min)"]) ?? 0,
      activity: row["Activity name"] || "Activity",
      strain: num(row["Activity Strain"]),
      calories: num(row["Energy burned (cal)"]),
      maxHr: num(row["Max HR (bpm)"]),
      avgHr: num(row["Average HR (bpm)"]),
      zones: [1, 2, 3, 4, 5].map((zone) => num(row[`HR Zone ${zone} %`]) ?? 0),
    }))
    .filter((row) => row.date)
    .sort((a, b) => a.start.localeCompare(b.start));

  const journal = parseCsv(files.journal)
    .map((row) => ({
      date: day(row["Cycle start time"]),
      question: row["Question text"] ?? "",
      yes: String(row["Answered yes"]).toLowerCase() === "true",
      notes: row["Notes"] ?? "",
    }))
    .filter((row) => row.date && row.question);

  return { cycles, workouts, journal, loadedAt: new Date().toISOString() };
}
