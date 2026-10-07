import { useMemo, useState } from "react";
import type { WhoopBundle, WhoopCycle } from "../whoop/parse";
import { useWhoop } from "../whoop/useWhoop";

type View = "overview" | "recovery" | "sleep" | "strain" | "workouts" | "journal";

const TRAINING_QUESTIONS = [
  "Consumed caffeine?",
  "Hydrated sufficiently?",
  "Tracked your calories?",
  "Experienced muscle or body aches?",
  "Have any alcoholic drinks?",
  "Saw direct sunlight upon waking up?",
  "Spend time outdoors?",
  "Ate food close to bedtime?",
  "Used a sauna?",
  "Did compression therapy?",
  "Took creatine?",
  "Slept in the same bed as usual?",
];

function avg(values: Array<number | null>) {
  const nums = values.filter((value): value is number => value != null);
  if (!nums.length) return null;
  return nums.reduce((sum, value) => sum + value, 0) / nums.length;
}

function fmt(value: number | null, digits = 0) {
  if (value == null || Number.isNaN(value)) return "—";
  return digits ? value.toFixed(digits) : String(Math.round(value));
}

function hours(mins: number | null) {
  if (mins == null) return "—";
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return `${h}h ${m}m`;
}

function Chart({
  rows,
  getY,
  color,
  selected,
  onSelect,
}: {
  rows: WhoopCycle[];
  getY: (row: WhoopCycle) => number | null;
  color: string;
  selected: string | null;
  onSelect: (date: string) => void;
}) {
  const w = 320;
  const h = 120;
  const pad = 8;
  const ys = rows.map(getY).filter((value): value is number => value != null);
  const min = ys.length ? Math.min(...ys) : 0;
  const max = ys.length ? Math.max(...ys) : 1;
  const span = Math.max(0.001, max - min);
  const coords = rows.map((row, index) => {
    const value = getY(row);
    const x = pad + (index / Math.max(1, rows.length - 1)) * (w - pad * 2);
    const y =
      value == null
        ? null
        : pad + ((max - value) / span) * (h - pad * 2);
    return { row, x, y };
  });
  const line = coords
    .filter((point) => point.y != null)
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`} role="img">
      <polyline fill="none" stroke={color} strokeWidth="2.2" points={line} />
      {coords.map((point) =>
        point.y == null ? null : (
          <circle
            key={point.row.date}
            cx={point.x}
            cy={point.y}
            r={selected === point.row.date ? 5 : 2.6}
            fill={selected === point.row.date ? "#fff" : color}
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(point.row.date)}
          >
            <title>
              {point.row.date}: {fmt(getY(point.row), 1)}
            </title>
          </circle>
        ),
      )}
    </svg>
  );
}

export function Whoop() {
  const { bundle, status, error, importFiles } = useWhoop();
  const [view, setView] = useState<View>("overview");
  const [span, setSpan] = useState(30);
  const [end, setEnd] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [activity, setActivity] = useState("All");
  const [journalScope, setJournalScope] = useState<"training" | "all">("training");
  const [journalQuery, setJournalQuery] = useState("");

  const cycles = bundle?.cycles ?? [];
  const endIndex = Math.min(cycles.length - 1, end ?? cycles.length - 1);
  const windowRows = useMemo(() => {
    if (!cycles.length) return [];
    const start = span >= cycles.length ? 0 : Math.max(0, endIndex - span + 1);
    return cycles.slice(start, endIndex + 1);
  }, [cycles, endIndex, span]);

  const selectedRow =
    windowRows.find((row) => row.date === selected) ??
    windowRows[windowRows.length - 1] ??
    null;

  if (status === "loading") {
    return (
      <section className="section">
        <h2>Whoop</h2>
        <p className="lede">Loading the local export…</p>
      </section>
    );
  }

  if (status === "missing" || !bundle) {
    return (
      <section className="section">
        <h2>Whoop</h2>
        <p className="lede">
          Drop the Whoop CSV export here. It stays in this browser and is not
          committed to the public GitHub repo.
        </p>
        <label className="search-field">
          <span className="sr-only">Import Whoop CSVs</span>
          <input
            type="file"
            accept=".csv,text/csv"
            multiple
            onChange={(event) => {
              if (event.target.files) void importFiles(event.target.files);
            }}
          />
        </label>
        {error && <p className="lede">{error}</p>}
      </section>
    );
  }

  return (
    <WhoopReady
      bundle={bundle}
      view={setView}
      current={view}
      span={span}
      setSpan={setSpan}
      endIndex={endIndex}
      setEnd={setEnd}
      windowRows={windowRows}
      selectedRow={selectedRow}
      setSelected={setSelected}
      activity={activity}
      setActivity={setActivity}
      journalScope={journalScope}
      setJournalScope={setJournalScope}
      journalQuery={journalQuery}
      setJournalQuery={setJournalQuery}
      importFiles={importFiles}
      error={error}
    />
  );
}

function WhoopReady({
  bundle,
  view,
  current,
  span,
  setSpan,
  endIndex,
  setEnd,
  windowRows,
  selectedRow,
  setSelected,
  activity,
  setActivity,
  journalScope,
  setJournalScope,
  journalQuery,
  setJournalQuery,
  importFiles,
  error,
}: {
  bundle: WhoopBundle;
  view: (view: View) => void;
  current: View;
  span: number;
  setSpan: (span: number) => void;
  endIndex: number;
  setEnd: (end: number) => void;
  windowRows: WhoopCycle[];
  selectedRow: WhoopCycle | null;
  setSelected: (date: string) => void;
  activity: string;
  setActivity: (activity: string) => void;
  journalScope: "training" | "all";
  setJournalScope: (scope: "training" | "all") => void;
  journalQuery: string;
  setJournalQuery: (query: string) => void;
  importFiles: (files: FileList | File[]) => Promise<void>;
  error: string;
}) {
  const dates = new Set(windowRows.map((row) => row.date));
  const workouts = bundle.workouts.filter((item) => dates.has(item.date));
  const activities = ["All", ...new Set(bundle.workouts.map((item) => item.activity))];
  const visibleWorkouts =
    activity === "All"
      ? workouts
      : workouts.filter((item) => item.activity === activity);

  const recovery = avg(windowRows.map((row) => row.recovery));
  const hrv = avg(windowRows.map((row) => row.hrv));
  const rhr = avg(windowRows.map((row) => row.rhr));
  const strain = avg(windowRows.map((row) => row.strain));
  const sleep = avg(windowRows.map((row) => row.sleepPerformance));

  const highSleep = windowRows.filter((row) => (row.sleepPerformance ?? 0) >= 80);
  const lowSleep = windowRows.filter((row) => (row.sleepPerformance ?? 100) < 70);
  const recoveryWhenRested = avg(highSleep.map((row) => row.recovery));
  const recoveryWhenShort = avg(lowSleep.map((row) => row.recovery));

  const dayWorkouts = selectedRow
    ? bundle.workouts.filter((item) => item.date === selectedRow.date)
    : [];
  const dayJournal = selectedRow
    ? bundle.journal.filter(
        (item) =>
          item.date === selectedRow.date &&
          item.yes &&
          TRAINING_QUESTIONS.includes(item.question),
      )
    : [];

  const journalRows = useMemo(() => {
    const scoped = bundle.journal.filter((item) => dates.has(item.date));
    const counts = new Map<string, { yes: number; total: number }>();
    for (const item of scoped) {
      const bucket = counts.get(item.question) ?? { yes: 0, total: 0 };
      bucket.total += 1;
      if (item.yes) bucket.yes += 1;
      counts.set(item.question, bucket);
    }
    const query = journalQuery.trim().toLowerCase();
    return [...counts.entries()]
      .filter(([question]) => {
        if (journalScope === "training" && !TRAINING_QUESTIONS.includes(question)) {
          return false;
        }
        return !query || question.toLowerCase().includes(query);
      })
      .map(([question, bucket]) => ({
        question,
        ...bucket,
        rate: bucket.total ? bucket.yes / bucket.total : 0,
      }))
      .sort((a, b) => b.rate - a.rate);
  }, [bundle.journal, dates, journalQuery, journalScope]);

  return (
    <section className="section">
      <h2>Whoop</h2>
      <p className="lede">
        {bundle.cycles.length} days · {bundle.workouts.length} activities · local
        export, not in git.
      </p>

      <div className="chip-row" role="tablist" aria-label="Whoop views">
        {(
          [
            ["overview", "Overview"],
            ["recovery", "Recovery"],
            ["sleep", "Sleep"],
            ["strain", "Strain"],
            ["workouts", "Workouts"],
            ["journal", "Journal"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={current === id ? "chip on" : "chip"}
            onClick={() => view(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="chip-row" aria-label="Window length">
        {[14, 30, 90, bundle.cycles.length].map((size) => (
          <button
            key={size}
            type="button"
            className={span === size ? "chip on" : "chip"}
            onClick={() => setSpan(size)}
          >
            {size >= bundle.cycles.length ? "All" : `${size}d`}
          </button>
        ))}
      </div>

      <label className="range-field">
        <span>
          Window ends {windowRows.at(-1)?.date ?? "—"} · {windowRows[0]?.date} →{" "}
          {windowRows.at(-1)?.date}
        </span>
        <input
          type="range"
          min={0}
          max={Math.max(0, bundle.cycles.length - 1)}
          value={Math.max(0, endIndex)}
          onChange={(event) => setEnd(Number(event.target.value))}
        />
      </label>

      {(current === "overview" || current === "recovery") && (
        <>
          <div className="metric-strip">
            <div className="metric">
              <span className="label">Recovery</span>
              <span className="value">
                <em>{fmt(recovery)}</em>%
              </span>
            </div>
            <div className="metric">
              <span className="label">HRV</span>
              <span className="value">{fmt(hrv)}</span>
            </div>
            <div className="metric">
              <span className="label">RHR</span>
              <span className="value">{fmt(rhr)}</span>
            </div>
          </div>
          <h3 className="subhead">Recovery score — tap a point</h3>
          <Chart
            rows={windowRows}
            getY={(row) => row.recovery}
            color="#f36a2d"
            selected={selectedRow?.date ?? null}
            onSelect={setSelected}
          />
          {current === "recovery" && (
            <>
              <h3 className="subhead">Heart rate variability</h3>
              <Chart
                rows={windowRows}
                getY={(row) => row.hrv}
                color="#c3c8ce"
                selected={selectedRow?.date ?? null}
                onSelect={setSelected}
              />
              <h3 className="subhead">Resting heart rate</h3>
              <Chart
                rows={windowRows}
                getY={(row) => row.rhr}
                color="#ffa36e"
                selected={selectedRow?.date ?? null}
                onSelect={setSelected}
              />
            </>
          )}
        </>
      )}

      {(current === "overview" || current === "sleep") && (
        <>
          <h3 className="subhead">Sleep performance</h3>
          <p className="lede">
            Avg {fmt(sleep)}%. Recovery averages {fmt(recoveryWhenRested)}% after
            80%+ sleep nights, and {fmt(recoveryWhenShort)}% when sleep is under
            70%.
          </p>
          <Chart
            rows={windowRows}
            getY={(row) => row.sleepPerformance}
            color="#c3c8ce"
            selected={selectedRow?.date ?? null}
            onSelect={setSelected}
          />
        </>
      )}

      {(current === "overview" || current === "strain") && (
        <>
          <h3 className="subhead">Day strain</h3>
          <p className="lede">Average strain {fmt(strain, 1)} in this window.</p>
          <Chart
            rows={windowRows}
            getY={(row) => row.strain}
            color="#f36a2d"
            selected={selectedRow?.date ?? null}
            onSelect={setSelected}
          />
        </>
      )}

      {selectedRow && current !== "workouts" && current !== "journal" && (
        <article className="day-detail">
          <h3>{selectedRow.date}</h3>
          <p>
            Recovery {fmt(selectedRow.recovery)}% · HRV {fmt(selectedRow.hrv)} ms ·
            RHR {fmt(selectedRow.rhr)} · strain {fmt(selectedRow.strain, 1)}
          </p>
          <p>
            Sleep {hours(selectedRow.sleepMin)} · performance{" "}
            {fmt(selectedRow.sleepPerformance)}% · deep {hours(selectedRow.deepMin)} ·
            REM {hours(selectedRow.remMin)} · debt {fmt(selectedRow.debtMin)} min
          </p>
          <p>
            SpO2 {fmt(selectedRow.spo2, 1)}% · resp {fmt(selectedRow.resp, 1)} · skin{" "}
            {fmt(selectedRow.skin, 1)}°C
          </p>
          {dayWorkouts.length > 0 && (
            <ul className="plain-list">
              {dayWorkouts.map((item) => (
                <li key={`${item.start}-${item.activity}`}>
                  {item.activity} · {item.duration} min · strain {fmt(item.strain, 1)} ·
                  avg HR {fmt(item.avgHr)}
                </li>
              ))}
            </ul>
          )}
          {dayJournal.length > 0 && (
            <p className="lede">
              Logged yes: {dayJournal.slice(0, 6).map((item) => item.question.replace(/\?$/, "")).join(" · ")}
            </p>
          )}
        </article>
      )}

      {current === "workouts" && (
        <>
          <div className="chip-row">
            {activities.slice(0, 12).map((name) => (
              <button
                key={name}
                type="button"
                className={activity === name ? "chip on" : "chip"}
                onClick={() => setActivity(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <p className="lede">{visibleWorkouts.length} sessions in this window.</p>
          <div className="history-list">
            {visibleWorkouts
              .slice()
              .reverse()
              .slice(0, 40)
              .map((item) => (
                <article key={`${item.start}-${item.activity}`} className="history-row">
                  <div className="history-date">
                    <strong>{item.date.slice(5)}</strong>
                    <span>{item.duration}m</span>
                  </div>
                  <div>
                    <h3>{item.activity}</h3>
                    <p>
                      Strain {fmt(item.strain, 1)} · {fmt(item.calories)} cal · HR{" "}
                      {fmt(item.avgHr)}–{fmt(item.maxHr)}
                    </p>
                  </div>
                </article>
              ))}
          </div>
        </>
      )}

      {current === "journal" && (
        <>
          <div className="chip-row">
            <button
              type="button"
              className={journalScope === "training" ? "chip on" : "chip"}
              onClick={() => setJournalScope("training")}
            >
              Training habits
            </button>
            <button
              type="button"
              className={journalScope === "all" ? "chip on" : "chip"}
              onClick={() => setJournalScope("all")}
            >
              All questions
            </button>
          </div>
          <label className="search-field">
            <span className="sr-only">Search journal</span>
            <input
              value={journalQuery}
              placeholder="Search questions"
              onChange={(event) => setJournalQuery(event.target.value)}
            />
          </label>
          <div className="journal-list">
            {journalRows.map((row) => (
              <article key={row.question} className="muscle-card">
                <div className="muscle-top">
                  <h3>{row.question}</h3>
                  <strong>{Math.round(row.rate * 100)}%</strong>
                </div>
                <div className="progress-bar">
                  <span style={{ width: `${row.rate * 100}%` }} />
                </div>
                <p>
                  Yes {row.yes} / {row.total} in this window
                </p>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="callout">
        <strong>Replace export</strong>
        <p>Import a newer Whoop CSV set. It overwrites only this browser cache.</p>
        <label className="search-field">
          <span className="sr-only">Replace Whoop CSVs</span>
          <input
            type="file"
            accept=".csv,text/csv"
            multiple
            onChange={(event) => {
              if (event.target.files) void importFiles(event.target.files);
            }}
          />
        </label>
        {error && <p>{error}</p>}
      </div>
    </section>
  );
}
