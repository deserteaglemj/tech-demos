export const SHARED_PROMPT = `Create a 6-second product launch sting for Lumen Desk, a focus lamp for late-night makers.

Specs: 1280×720, 30fps, no audio for this bake-off.
Mood: late desk, warm amber accent #E8A04A on near-black #0B0C0A.
Beats:
1. Soft amber glow / lamp motif appears
2. Brand LUMEN DESK lands as the hero
3. Tagline: Light that stays with you
4. End card CTA: Shop the lamp

Keep it demable in one sitting. Prefer crisp type and simple motion over clutter.`;

export type ScoreAxis = {
  id: string;
  label: string;
  hyperframes: number;
  remotion: number;
  note: string;
};

/** Honest bake-off scores for this mini — same brief, different guides. */
export const SCORES: ScoreAxis[] = [
  {
    id: "brief",
    label: "Brief fidelity",
    hyperframes: 9,
    remotion: 9,
    note: "Both hit glow → brand → tagline → CTA in 6s.",
  },
  {
    id: "motion",
    label: "Motion quality",
    hyperframes: 8,
    remotion: 9,
    note: "Remotion spring on the lamp reads a hair snappier; HyperFrames GSAP ease is clean.",
  },
  {
    id: "agent",
    label: "Agent authorability",
    hyperframes: 9,
    remotion: 7,
    note: "Plain HTML + data-* is easier for agents to emit without a React project graph.",
  },
  {
    id: "inspect",
    label: "Human inspectability",
    hyperframes: 9,
    remotion: 7,
    note: "HyperFrames opens as a page in DevTools; Remotion needs the Player/Studio loop.",
  },
  {
    id: "ecosystem",
    label: "Ecosystem / Player maturity",
    hyperframes: 6,
    remotion: 9,
    note: "Remotion Player + Lambda history is deeper; HyperFrames is newer but moving fast.",
  },
  {
    id: "license",
    label: "License friction",
    hyperframes: 9,
    remotion: 6,
    note: "Apache 2.0 vs Remotion’s seat-based license for larger teams.",
  },
];

export function average(side: "hyperframes" | "remotion"): number {
  const sum = SCORES.reduce((acc, row) => acc + row[side], 0);
  return Math.round((sum / SCORES.length) * 10) / 10;
}

export const VERDICT = {
  winner: "hyperframes" as const,
  title: "HyperFrames mini — narrow win",
  summary:
    "For this agent-authored product sting, HyperFrames edges it: same visual brief, less framework scaffolding, Apache 2.0. Remotion still wins if your team already lives in React and wants the mature Player/Lambda path.",
  loserNote:
    "Remotion is not “worse video” — its spring timing is excellent. It loses the mini on agent handoff + license friction for this specific bake-off.",
};
