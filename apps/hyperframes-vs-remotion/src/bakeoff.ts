export const SHARED_PROMPT = `Make a 12-second website conversion video for IM STUDIOS (https://imstudios.ca/).

Goal: get a visitor to book / inquire.

Specs: 1280×720, 30fps. Silent OK for v1.
Brand: IM STUDIOS must be the hero-level signal—not a nav eyebrow.
Offer: creative photo + video · wedding cinema · commercial · Stoney Creek, ON · 20+ years.
Tone: cinematic, warm, modern-timeless. Sentiment + personality. Avoid generic AI purple gradients.

Beat sheet:
1. Atmosphere / light open
2. Brand lockup IM STUDIOS
3. One-line promise (photo + video that balances sentiment and humour)
4. Service chips: Wedding · Commercial · Events
5. CTA: Book a shoot + imstudios.ca

Prefer crisp type and intentional motion over clutter. One composition. Demable in one sitting.`;

export type ScoreAxis = {
  id: string;
  label: string;
  hyperframes: number;
  remotion: number;
  note: string;
};

/** Scores for the IM STUDIOS conversion bake-off mini. */
export const SCORES: ScoreAxis[] = [
  {
    id: "brief",
    label: "Brief fidelity",
    hyperframes: 9,
    remotion: 9,
    note: "Both hit brand → promise → services → CTA in 12s.",
  },
  {
    id: "conversion",
    label: "Conversion clarity",
    hyperframes: 9,
    remotion: 9,
    note: "CTA + imstudios.ca hold ≥2s; offer readable without audio.",
  },
  {
    id: "brand",
    label: "Brand presence",
    hyperframes: 9,
    remotion: 9,
    note: "IM STUDIOS is hero type, not a corner mark.",
  },
  {
    id: "agent",
    label: "Agent authorability",
    hyperframes: 9,
    remotion: 7,
    note: "HyperFrames HTML+data-* is faster for agents; Remotion needs the React graph.",
  },
  {
    id: "motion",
    label: "Motion quality",
    hyperframes: 8,
    remotion: 9,
    note: "Remotion spring on the brand lockup feels slightly tighter.",
  },
  {
    id: "ecosystem",
    label: "Ecosystem / Player maturity",
    hyperframes: 6,
    remotion: 9,
    note: "Remotion Player/Lambda history is deeper for product embeds.",
  },
];

export function average(side: "hyperframes" | "remotion"): number {
  const sum = SCORES.reduce((acc, row) => acc + row[side], 0);
  return Math.round((sum / SCORES.length) * 10) / 10;
}

export const VERDICT = {
  winner: "hyperframes" as const,
  title: "HyperFrames mini — conversion handoff win",
  summary:
    "For an agent-installed, skills-driven IM STUDIOS website sting, HyperFrames wins the mini: same conversion beats, less scaffolding, Apache 2.0. Use Remotion when the Player must live inside a React site or you need mature Lambda.",
  loserNote:
    "Remotion’s spring on the brand lockup is excellent. It loses this handoff on agent install friction, not on picture quality.",
};

export const GUIDE_A =
  "Author HyperFrames HTML: class=\"clip\", data timing attrs, paused GSAP on window.__timelines. Load /product-launch-video + /hyperframes-core first.";

export const GUIDE_B =
  "Author Remotion React with useCurrentFrame, interpolate/spring, AbsoluteFill. Load /remotion-best-practices + /remotion-markup first.";
