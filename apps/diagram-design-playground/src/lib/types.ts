export type DiagramId =
  | "architecture"
  | "loop"
  | "flowchart"
  | "sequence"
  | "quadrant"
  | "pyramid";

export type DiagramMeta = {
  id: DiagramId;
  label: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  blurb: string;
};

export const DIAGRAMS: DiagramMeta[] = [
  {
    id: "architecture",
    label: "Architecture",
    eyebrow: "Architecture · Diagram Design",
    title: "Content site in production",
    subtitle:
      "Reader requests hit the edge first; origin work stays rare and boring.",
    blurb: "Components + connections in one system snapshot.",
  },
  {
    id: "loop",
    label: "Loop",
    eyebrow: "Loop · Diagram Design",
    title: "The self-improving loop",
    subtitle:
      "Six stations feed a shared-memory hub. Dashed lines are the write-backs.",
    blurb: "Reinforcing cycle with a shared hub that accumulates state.",
  },
  {
    id: "flowchart",
    label: "Flowchart",
    eyebrow: "Flowchart · Diagram Design",
    title: "Publish or hold?",
    subtitle: "A short decision path with one focal gate and no spare boxes.",
    blurb: "Decision logic with branches — every diamond earns its keep.",
  },
  {
    id: "sequence",
    label: "Sequence",
    eyebrow: "Sequence · Diagram Design",
    title: "Session handshake",
    subtitle: "Time-ordered messages between three actors, one accent path.",
    blurb: "Messages over time — lifelines stay quiet, the call does the work.",
  },
  {
    id: "quadrant",
    label: "Quadrant",
    eyebrow: "Quadrant · Diagram Design",
    title: "Q2 bets by impact vs effort",
    subtitle: "Two axes, four rooms, one coral callout for the ship-now bet.",
    blurb: "Two-axis positioning without a matrix of noise.",
  },
  {
    id: "pyramid",
    label: "Pyramid",
    eyebrow: "Pyramid · Diagram Design",
    title: "What the reader remembers",
    subtitle: "Ranked hierarchy — the tip is the only accent.",
    blurb: "Funnel or ranked stack. Deletion is the design move.",
  },
];
