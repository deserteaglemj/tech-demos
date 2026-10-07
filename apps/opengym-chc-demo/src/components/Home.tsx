import type { AppState } from "../data/seed";
import type { Tab } from "./Shell";

type Props = {
  state: AppState;
  loggedSets: number;
  totalSets: number;
  onTab: (tab: Tab) => void;
};

export function Home({ state, loggedSets, totalSets, onTab }: Props) {
  const pct = totalSets ? Math.round((loggedSets / totalSets) * 100) : 0;

  return (
    <>
      <section className="hero" aria-label="CHC hero">
        <img
          src="/brand/hero.jpg"
          alt="Chris Harris coaching portrait"
        />
        <div className="hero-copy">
          <div className="kicker">Chris Harris Coaching</div>
          <h1>BUILD MUSCLE. AROUND REAL LIFE.</h1>
          <p>
            Today’s Upper A is queued — weights from last week, rest timed
            between sets, PRs called as they land.
          </p>
          <div className="cta-row">
            <button
              type="button"
              className="btn-primary"
              onClick={() => onTab("workout")}
            >
              Start today’s session
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onTab("progress")}
            >
              View progress
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Your week at a glance</h2>
        <p className="lede">
          Seeded Founding 8 athlete view — same openGym loop, CHC branding.
        </p>
        <div className="metric-strip">
          <div className="metric">
            <span className="label">Streak</span>
            <span className="value">
              <em>{state.streakDays}</em> days
            </span>
          </div>
          <div className="metric">
            <span className="label">Weight</span>
            <span className="value">{state.bodyWeight.toFixed(1)}</span>
          </div>
          <div className="metric">
            <span className="label">Goal</span>
            <span className="value">{state.bodyGoal}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="session-block">
          <div className="meta">
            <span>{state.session.dayLabel}</span>
            <span>~{state.session.estimatedMinutes} min</span>
          </div>
          <h3>{state.session.title}</h3>
          <p className="lede" style={{ marginTop: "0.45rem", marginBottom: 0 }}>
            {state.program} · Coach {state.coach}
          </p>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Session completion"
          >
            <span style={{ width: `${pct}%` }} />
          </div>
          <p className="lede" style={{ marginTop: "0.55rem", marginBottom: 0 }}>
            {loggedSets}/{totalSets} sets logged
          </p>
        </div>
      </section>
    </>
  );
}
