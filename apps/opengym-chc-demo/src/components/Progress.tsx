import type { AppState } from "../data/seed";

type Props = {
  state: AppState;
};

export function Progress({ state }: Props) {
  const history = state.bodyHistory;
  const min = Math.min(...history.map((h) => h.weight)) - 1;
  const max = Math.max(...history.map((h) => h.weight)) + 1;
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
    pad + ((max - state.bodyGoal) / Math.max(0.001, max - min)) * (h - pad * 2);

  return (
    <>
      <section className="section">
        <h2>Four-week heatmap</h2>
        <p className="lede">
          Session intensity across the last 28 days — quiet Sundays stay dark.
        </p>
        <div className="heatmap" aria-label="Training heatmap">
          {state.heatmap.map((level, i) => (
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
        <h2>Body weight vs goal</h2>
        <p className="lede">
          Goal line at {state.bodyGoal} lb. Current{" "}
          {state.bodyWeight.toFixed(1)} lb — {state.completedSessions} sessions
          logged in the program.
        </p>
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
                <circle
                  key={pt.date}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#f36a2d"
                />
              );
            })}
          </svg>
          <div className="chart-meta">
            <span>{history[0]?.date}</span>
            <span>goal {state.bodyGoal} lb</span>
            <span>{history.at(-1)?.date}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Lift PRs this block</h2>
        <p className="lede">Best logged loads from today’s Upper A template.</p>
        <div className="metric-strip">
          {state.session.exercises.slice(0, 3).map((ex) => (
            <div className="metric" key={ex.id}>
              <span className="label">{ex.name.split(" ").slice(0, 2).join(" ")}</span>
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
