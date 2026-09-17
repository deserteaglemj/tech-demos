import { useEffect, useRef, useState } from "react";
import type { SpringConfig } from "./springMath";

export interface UseSpringOptions {
  /** Skip simulation and jump straight to `target` (e.g. while dragging 1:1 with the pointer). */
  instant?: boolean;
  /** How close value+velocity must be to target to be considered "at rest". */
  precision?: number;
}

/**
 * Real numeric spring integration (semi-implicit Euler, sub-stepped for
 * stability at high stiffness) driven by requestAnimationFrame. This is the
 * same family of model react-spring / Framer Motion springs use under the
 * hood: F = -stiffness * (x - target) - damping * v; a = F / mass.
 *
 * Restarts cleanly whenever `target` or the spring config changes, so
 * dragging the live Stiffness/Damping/Mass knobs mid-animation reshapes the
 * motion in real time instead of waiting for the next trigger.
 */
export function useSpring(target: number, config: SpringConfig, opts: UseSpringOptions = {}): number {
  const { stiffness, damping, mass } = config;
  const precision = opts.precision ?? 0.01;
  const instant = opts.instant ?? false;

  const [value, setValue] = useState(target);
  const valueRef = useRef(target);
  const velocityRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    function cancelRaf() {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    if (instant) {
      cancelRaf();
      valueRef.current = target;
      velocityRef.current = 0;
      setValue(target);
      return;
    }

    let last: number | null = null;
    const STEPS = 4;

    function tick(now: number) {
      if (last === null) last = now;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const subDt = dt / STEPS;

      for (let i = 0; i < STEPS; i++) {
        const t = targetRef.current;
        const springForce = -stiffness * (valueRef.current - t);
        const dampingForce = -damping * velocityRef.current;
        const acceleration = (springForce + dampingForce) / mass;
        velocityRef.current += acceleration * subDt;
        valueRef.current += velocityRef.current * subDt;
      }

      const atRest =
        Math.abs(valueRef.current - targetRef.current) < precision && Math.abs(velocityRef.current) < precision;

      if (atRest) {
        valueRef.current = targetRef.current;
        velocityRef.current = 0;
        setValue(valueRef.current);
        rafRef.current = null;
        return;
      }

      setValue(valueRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }

    cancelRaf();
    rafRef.current = requestAnimationFrame(tick);
    return cancelRaf;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, stiffness, damping, mass, instant, precision]);

  return value;
}

/** Convenience wrapper for a 2D point spring (e.g. magnetic pull offset). */
export function useSpring2D(
  target: { x: number; y: number },
  config: SpringConfig,
  opts: UseSpringOptions = {},
): { x: number; y: number } {
  const x = useSpring(target.x, config, opts);
  const y = useSpring(target.y, config, opts);
  return { x, y };
}
