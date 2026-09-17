/**
 * Shared spring-physics config + derived values used across the playground.
 *
 * The live demos run a real numeric spring integrator (see `useSpring.ts`),
 * not a fake CSS easing curve. These helpers exist to (a) derive a
 * representative cubic-bezier for the CSS-only snippet variant, and
 * (b) surface friendly readouts (overshoot %, settle time) for the UI.
 */

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export interface SpringPreset extends SpringConfig {
  label: string;
}

export const SPRING_PRESETS: SpringPreset[] = [
  { label: "Gentle", stiffness: 120, damping: 22, mass: 1 },
  { label: "Snappy", stiffness: 320, damping: 24, mass: 1 },
  { label: "Bouncy", stiffness: 260, damping: 10, mass: 1 },
  { label: "Stiff", stiffness: 420, damping: 40, mass: 1 },
];

export const SPRING_LIMITS = {
  stiffness: { min: 20, max: 500, step: 1 },
  damping: { min: 1, max: 60, step: 1 },
  mass: { min: 0.1, max: 5, step: 0.1 },
};

/** Damping ratio ζ. ζ < 1 underdamped (oscillates/overshoots), ζ >= 1 no overshoot. */
export function dampingRatio({ stiffness, damping, mass }: SpringConfig): number {
  return damping / (2 * Math.sqrt(stiffness * mass));
}

/** Undamped natural frequency ωn (rad/s). */
export function naturalFrequency({ stiffness, mass }: SpringConfig): number {
  return Math.sqrt(stiffness / mass);
}

/** Classic 2nd-order step-response overshoot fraction (0 when critically/over-damped). */
export function overshootFraction(cfg: SpringConfig): number {
  const zeta = dampingRatio(cfg);
  if (zeta >= 1) return 0;
  return Math.exp((-zeta * Math.PI) / Math.sqrt(1 - zeta * zeta));
}

/** Approximate 2% settling time in seconds. */
export function settleTimeSeconds(cfg: SpringConfig): number {
  const zeta = Math.max(dampingRatio(cfg), 0.05);
  const omega = naturalFrequency(cfg);
  return Math.min(4 / (zeta * omega), 4);
}

/**
 * Map the live spring config to an approximate cubic-bezier + duration so the
 * CSS-only snippet visually tracks the knobs (control points, not a physical
 * simulation — the real motion in this app comes from useSpring/RAF).
 */
export function springToBezier(cfg: SpringConfig): { bezier: [number, number, number, number]; durationMs: number } {
  const overshoot = overshootFraction(cfg);
  const y1 = 1 + Math.min(overshoot * 2.4, 1.1); // 1.0 (no overshoot) .. ~2.1 (very bouncy)
  const durationMs = Math.round(clamp(settleTimeSeconds(cfg) * 1000, 180, 1400));
  return { bezier: [0.34, round2(y1), 0.64, 1], durationMs };
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

export function round2(v: number): number {
  return Math.round(v * 100) / 100;
}

export function bezierCss([x1, y1, x2, y2]: [number, number, number, number]): string {
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}
