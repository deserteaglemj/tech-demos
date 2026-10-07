import type { MouseEvent } from "react";

/** True for an unmodified primary click; modified clicks keep native link behavior (new tab, etc.). */
export function isPlainLeftClick(event: MouseEvent): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/** "RLHF (Reinforcement Learning from Human Feedback)" -> "RLHF", for chips and graph labels. */
export function shortTitle(title: string): string {
  return title.replace(/\s*\([^)]*\)\s*$/, "") || title;
}
