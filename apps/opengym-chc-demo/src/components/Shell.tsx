import type { ReactNode } from "react";
import type { Page } from "../lib/store";

type Props = {
  page: Page;
  workoutActive: boolean;
  onGo: (page: Page) => void;
  onStart: () => void;
  onReset: () => void;
  children: ReactNode;
  overlays?: ReactNode;
};

const tabs: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "plan", label: "Plan", icon: "▦" },
  { id: "stats", label: "Stats", icon: "◈" },
  { id: "library", label: "Exercises", icon: "◎" },
];

export function Shell({
  page,
  workoutActive,
  onGo,
  onStart,
  onReset,
  children,
  overlays,
}: Props) {
  const hideTabs = page === "workout" && workoutActive;

  return (
    <div className="desktop-frame">
      <aside className="desktop-aside">
        <img
          className="mark-xl"
          src="/brand/icon-mark.svg"
          alt="Chris Harris Coaching mark"
        />
        <h1>CHRIS HARRIS COACHING</h1>
        <p>
          Full openGym-style app demo — Home, Plan, Workout, Stats, Exercises,
          History, Muscles, and Settings — in the Structure identity.
        </p>
        <p className="credit">Demo · single-user · local only</p>
      </aside>

      <div className={`app-shell${hideTabs ? " no-tabbar" : ""}`}>
        <header className="brand-bar">
          <div className="brand-lockup">
            <img className="mark" src="/brand/icon-mark.svg" alt="" />
            <div className="word">
              <strong>Chris Harris Coaching</strong>
              <span>Breaking Limits · openGym demo</span>
            </div>
          </div>
          <div className="brand-actions">
            <button
              type="button"
              className="ghost-btn"
              onClick={() => onGo("settings")}
              aria-current={page === "settings" ? "page" : undefined}
            >
              Settings
            </button>
            <button type="button" className="ghost-btn" onClick={onReset}>
              Reset
            </button>
          </div>
        </header>

        <main className="page-main">{children}</main>
        {overlays}

        {!hideTabs && (
          <nav className="nav og-tabs" aria-label="Primary">
            <button
              type="button"
              aria-current={page === "home" || page === "settings" ? "page" : undefined}
              onClick={() => onGo("home")}
            >
              <span aria-hidden="true">{tabs[0].icon}</span>
              Home
            </button>
            <button
              type="button"
              aria-current={page === "plan" ? "page" : undefined}
              onClick={() => onGo("plan")}
            >
              <span aria-hidden="true">{tabs[1].icon}</span>
              Plan
            </button>
            <button
              type="button"
              className={`start-tab${workoutActive ? " live" : ""}${page === "workout" ? " on" : ""}`}
              onClick={onStart}
            >
              <span className="cir" aria-hidden="true">
                ▶
              </span>
              {workoutActive && page !== "workout" ? "Resume" : "Start"}
            </button>
            <button
              type="button"
              aria-current={
                page === "stats" || page === "history" ? "page" : undefined
              }
              onClick={() => onGo("stats")}
            >
              <span aria-hidden="true">{tabs[2].icon}</span>
              Stats
            </button>
            <button
              type="button"
              aria-current={
                page === "library" || page === "muscles" ? "page" : undefined
              }
              onClick={() => onGo("library")}
            >
              <span aria-hidden="true">{tabs[3].icon}</span>
              Exercises
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
