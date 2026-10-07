import type { AppState } from "../data/seed";
import type { Page } from "../lib/store";

type Props = {
  state: AppState;
  loggedSets: number;
  totalSets: number;
  onGo: (page: Page) => void;
  onStart: () => void;
  onLogWeight: (weight: number) => void;
};

export function Home({
  state,
  loggedSets,
  totalSets,
  onGo,
  onStart,
  onLogWeight,
}: Props) {
  const pct = totalSets ? Math.round((loggedSets / totalSets) * 100) : 0;
  const today = state.week[0];

  return (
    <>
      <section className="hero" aria-label="CHC hero">
        <img src="/brand/hero.jpg" alt="Chris Harris coaching portrait" />
        <div className="hero-copy">
          <div className="kicker">Chris Harris Coaching</div>
          <h1>BUILD MUSCLE. AROUND REAL LIFE.</h1>
          <p>
            {today.title}. Weights from last time, rest between sets, PRs as
            they land.
          </p>
          <div className="cta-row">
            <button type="button" className="btn-primary" onClick={onStart}>
              Start today’s session
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onGo("plan")}
            >
              Open week plan
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Today</h2>
        <p className="lede">{state.program} · Coach {state.coach}</p>
        <div className="session-block">
          <div className="meta">
            <span>{state.session.dayLabel}</span>
            <span>~{state.session.estimatedMinutes} min</span>
          </div>
          <h3>{state.session.title}</h3>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${pct}%` }} />
          </div>
          <p className="lede" style={{ marginTop: "0.55rem", marginBottom: 0 }}>
            {loggedSets}/{totalSets} sets logged
          </p>
        </div>
      </section>

      <section className="section">
        <h2>Body weight</h2>
        <p className="lede">
          Goal line at {state.bodyGoal} {state.units}. Tap to log today’s weigh-in.
        </p>
        <div className="metric-strip">
          <div className="metric">
            <span className="label">Now</span>
            <span className="value">
              <em>{state.bodyWeight.toFixed(1)}</em>
            </span>
          </div>
          <div className="metric">
            <span className="label">Goal</span>
            <span className="value">{state.bodyGoal}</span>
          </div>
          <div className="metric">
            <span className="label">Streak</span>
            <span className="value">
              <em>{state.streakDays}</em>d
            </span>
          </div>
        </div>
        <div className="inline-actions">
          <button
            type="button"
            className="ghost-btn"
            onClick={() => onLogWeight(Number((state.bodyWeight + 0.2).toFixed(1)))}
          >
            +0.2 {state.units}
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => onLogWeight(Number((state.bodyWeight - 0.2).toFixed(1)))}
          >
            −0.2 {state.units}
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => onGo("stats")}
          >
            Charts
          </button>
        </div>
      </section>

      <section className="section">
        <h2>Quick links</h2>
        <div className="link-grid">
          <button type="button" onClick={() => onGo("muscles")}>
            Muscle map
          </button>
          <button type="button" onClick={() => onGo("history")}>
            History
          </button>
          <button type="button" onClick={() => onGo("library")}>
            Exercise library
          </button>
          <button type="button" onClick={() => onGo("settings")}>
            Settings
          </button>
        </div>
      </section>
    </>
  );
}
