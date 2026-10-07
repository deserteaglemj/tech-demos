import type { AppState } from "../data/seed";
import { deriveHeatmap, deriveStreak } from "../lib/derive";
import type { Page } from "../lib/store";

type Props = {
  state: AppState;
  onGo: (page: Page) => void;
};

export function Stats({ state, onGo }: Props) {
  const history = state.bodyHistory;
  const heatmap = deriveHeatmap(state.history);
  const streak = deriveStreak(state.history);
  const hasWeight = history.length > 0;
  const min = hasWeight ? Math.min(...history.map((h) => h.weight)) - 1 : 0;
  const max = hasWeight ? Math.max(...history.map((h) => h.weight)) + 1 : 1;
  const w = 320;
  const h = 140;
  const pad = 12;

  const points = history.map((pt, i) => {
    const x = pad + (i / Math.max(1, history.length - 1)) * (w - pad * 2);
    const y =
      pad + ((max - pt.weight) / Math.max(0.001, max - min)) * (h - pad * 2);
    return `${x},${y}`;
  });

  const goalY =
    pad +
    ((max - state.bodyGoal) / Math.max(0.001, max - min)) * (h - pad * 2);

  return (
    <>
      <section className="section">
        <div className="row-between">
          <div>
            <h2>Stats</h2>
            <p className="lede">
              {state.history.length} sessions · streak {streak} days
            </p>
          </div>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => onGo("history")}
          >
            History
          </button>
        </div>

        <h3 className="subhead">Eight-week heatmap</h3>
        <div className="heatmap wide" aria-label="Training heatmap">
          {heatmap.map((level, i) => (
            <div
              key={i}
              className="heat-cell"
              data-level={level}
              title={`Day ${i + 1}: level ${level}`}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <h3 className="subhead">Body weight vs goal</h3>
        <p className="lede">
          Current {state.bodyWeight.toFixed(1)} {state.units} · goal{" "}
          {state.bodyGoal} {state.units}
        </p>
        {hasWeight ? (
        <div className="chart-wrap">
          <svg
            className="chart"
            viewBox={`0 0 ${w} ${h}`}
            role="img"
            aria-label="Body weight chart"
          >
            <line
              x1={pad}
              x2={w - pad}
              y1={goalY}
              y2={goalY}
              stroke="rgba(243,106,45,0.55)"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <polyline
              fill="none"
              stroke="#c3c8ce"
              strokeWidth="2.5"
              points={points.join(" ")}
            />
            {history.map((pt, i) => {
              const [x, y] = points[i].split(",").map(Number);
              return (
                <circle key={pt.date} cx={x} cy={y} r="3.5" fill="#f36a2d" />
              );
            })}
          </svg>
          <div className="chart-meta">
            <span>{history[0]?.date}</span>
            <span>goal {state.bodyGoal || "—"}</span>
            <span>{history.at(-1)?.date}</span>
          </div>
        </div>
        ) : (
          <p className="lede">Log a weigh-in on Home and it will stay on this device.</p>
        )}
      </section>

      <section className="section">
        <div className="row-between">
          <h3 className="subhead">Lift PRs this block</h3>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => onGo("muscles")}
          >
            Muscles
          </button>
        </div>
        <div className="metric-strip">
          {[...state.library]
            .sort((a, b) => b.prWeight - a.prWeight)
            .slice(0, 3)
            .map((ex) => (
            <div className="metric" key={ex.id}>
              <span className="label">
                {ex.name.split(" ").slice(0, 2).join(" ")}
              </span>
              <span className="value">
                <em>{ex.prWeight}</em>
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
