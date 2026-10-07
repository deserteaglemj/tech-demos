/** Fidelity rubric vs Resend editor preview toggles (100 pts). */

export type Criterion = {
  id: string;
  label: string;
  max: number;
  cursorOnly: number;
  rea: number;
  note: string;
};

export const CRITERIA: Criterion[] = [
  {
    id: "paired",
    label: "Paired controls (view + appearance)",
    max: 15,
    cursorOnly: 15,
    rea: 15,
    note: "Both attempts expose two independent controls.",
  },
  {
    id: "control_type",
    label: "Segmented 2-icon switch groups (not <select>/pill)",
    max: 20,
    cursorOnly: 0,
    rea: 20,
    note: "Resend uses bordered icon pairs. Cursor-only used <select> dropdowns.",
  },
  {
    id: "aria_labels",
    label: 'Exact aria-labels ("Email view/appearance mode")',
    max: 10,
    cursorOnly: 0,
    rea: 10,
    note: "REA inspect_web_page returned these labels; Cursor-only never saw them.",
  },
  {
    id: "a11y_role",
    label: "role=switch + aria-checked state",
    max: 10,
    cursorOnly: 0,
    rea: 10,
    note: "Present in Resend DOM/a11y tree; missing from Cursor-only selects.",
  },
  {
    id: "chrome",
    label: "Controls live in preview card header chrome",
    max: 15,
    cursorOnly: 5,
    rea: 15,
    note: "REA placed switches in traffic-light header. Cursor-only used an external toolbar.",
  },
  {
    id: "view_behavior",
    label: "View mode changes preview width (desktop/mobile)",
    max: 15,
    cursorOnly: 15,
    rea: 15,
    note: "Both implementations change frame width.",
  },
  {
    id: "appearance_behavior",
    label: "Appearance mode toggles light/dark preview",
    max: 15,
    cursorOnly: 15,
    rea: 15,
    note: "Both flip light/dark styling.",
  },
];

export function total(scores: "cursorOnly" | "rea") {
  return CRITERIA.reduce((sum, c) => sum + c[scores], 0);
}

export const MAX = CRITERIA.reduce((sum, c) => sum + c.max, 0);

/** Timed wall-clock for this agent run (minutes, rounded). */
export const TIMING = {
  cursorOnly: {
    minutes: 6,
    method:
      "Visual glance at Resend marketing page only — no REA, no DOM/a11y Evidence. Built generic Device/Theme <select> preview.",
  },
  rea: {
    minutes: 3,
    method:
      "rea list_browser_targets + inspect_web_page (~25s) recovered switch labels + DOM toolbar HTML; recreation matched segmented icon switches.",
    inspectSeconds: 25,
  },
  source: {
    url: "https://resend.com/",
    feature: "Email editor preview toggles (view mode + appearance mode)",
  },
};
