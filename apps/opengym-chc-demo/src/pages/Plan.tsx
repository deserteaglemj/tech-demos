import type { AppState } from "../data/seed";
import type { Page } from "../lib/store";

type Props = {
  state: AppState;
  onStart: () => void;
  onGo: (page: Page) => void;
};

export function Plan({ state, onStart, onGo }: Props) {
  const todayIdx = 0;

  return (
    <section className="section">
      <h2>Weekly plan</h2>
      <p className="lede">
        {state.program}. Move a day without rewriting the whole week — openGym
        style, CHC programming.
      </p>

      <div className="week-list">
        {state.week.map((day, i) => {
          const isToday = i === todayIdx;
          const isRest = day.load === "rest";
          return (
            <article
              key={day.day}
              className={`day-row${isToday ? " today" : ""}${isRest ? " rest" : ""}`}
            >
              <div className="day-label">
                <strong>{day.short}</strong>
                <span>{day.day}</span>
              </div>
              <div className="day-body">
                <h3>{day.title}</h3>
                <p>
                  {isRest
                    ? "Recovery · optional walk"
                    : `${day.load.toUpperCase()} · Chris-programmed`}
                </p>
              </div>
              {!isRest && (
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={isToday ? onStart : () => onGo("library")}
                >
                  {isToday ? "Start" : "View"}
                </button>
              )}
            </article>
          );
        })}
      </div>

      <div className="callout">
        <strong>Founding 8 note</strong>
        <p>
          This week is built around real equipment access and a trucking-style
          schedule. Rest days stay rest days unless Chris moves them.
        </p>
      </div>
    </section>
  );
}
