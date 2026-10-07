import type { ReactNode } from "react";

export type Tab = "home" | "workout" | "progress";

const labels: Record<Tab, { icon: string; label: string }> = {
  home: { icon: "⌂", label: "Home" },
  workout: { icon: "◎", label: "Train" },
  progress: { icon: "▦", label: "Progress" },
};

type Props = {
  tab: Tab;
  onTab: (tab: Tab) => void;
  onReset: () => void;
  children: ReactNode;
};

export function Shell({ tab, onTab, onReset, children }: Props) {
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
          openGym-style training log, dressed in the Structure identity —
          silver mark, ember accent, built around a real training week.
        </p>
        <p className="credit">Demo · single-user · local only</p>
      </aside>

      <div className="app-shell">
        <header className="brand-bar">
          <div className="brand-lockup">
            <img className="mark" src="/brand/icon-mark.svg" alt="" />
            <div className="word">
              <strong>Chris Harris Coaching</strong>
              <span>Breaking Limits · Train</span>
            </div>
          </div>
          <button type="button" className="ghost-btn" onClick={onReset}>
            Reset demo
          </button>
        </header>

        {children}

        <nav className="nav" aria-label="Primary">
          {(Object.keys(labels) as Tab[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-current={tab === key ? "page" : undefined}
              onClick={() => onTab(key)}
            >
              <span aria-hidden="true">{labels[key].icon}</span>
              {labels[key].label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
