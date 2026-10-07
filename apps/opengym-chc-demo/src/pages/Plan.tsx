import type { AppState } from "../data/seed";
import { weekdayIndex } from "../lib/derive";

type Props = {
  state: AppState;
  onStartDay: (index: number) => void;
};

export function Plan({ state, onStartDay }: Props) {
  const todayIdx = weekdayIndex();

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
                  onClick={() => onStartDay(i)}
                >
                  Start
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
