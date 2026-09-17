import { useEffect, useRef, useState } from "react";
import { useSpringConfig } from "../../lib/SpringContext";
import { useSpring } from "../../lib/useSpring";
import type { SpringConfig } from "../../lib/springMath";
import { DemoCard } from "../DemoCard";

const HOLD_MS = 800;
const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function buildSnippet(config: SpringConfig) {
  const css = `.hold-btn .prog {
  stroke-dasharray: ${Math.round(CIRCUMFERENCE)};
  stroke-dashoffset: ${Math.round(CIRCUMFERENCE)}; /* empty ring */
  transition: stroke-dashoffset 0.2s ease-out;
}
.hold-btn.holding .prog {
  stroke-dashoffset: 0;             /* fills linearly over the hold */
  transition: stroke-dashoffset ${HOLD_MS}ms linear;
}
/* On early release, JS switches the ring's driving value to a real
   spring (stiffness ${config.stiffness}, damping ${config.damping}) so it
   snaps back with some give instead of a flat ease-out. */`;

  const react = `const spring = { stiffness: ${config.stiffness}, damping: ${config.damping}, mass: ${config.mass} };
const HOLD_MS = ${HOLD_MS};

function HoldToConfirm({ onConfirm }) {
  const [holding, setHolding] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [raw, setRaw] = useState(0); // 0..1, driven by a linear hold timer
  const rafRef = useRef(null);
  const startRef = useRef(0);

  // linear while holding (accurate countdown), spring once released
  const progress = useSpring(holding ? raw : (confirmed ? 1 : 0), spring, { instant: holding });

  const start = () => {
    if (confirmed) return;
    setHolding(true);
    startRef.current = performance.now();
    const tick = (now) => {
      const t = Math.min((now - startRef.current) / HOLD_MS, 1);
      setRaw(t);
      if (t >= 1) { setHolding(false); setConfirmed(true); onConfirm?.(); return; }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };
  const cancel = () => { cancelAnimationFrame(rafRef.current); setHolding(false); setRaw(0); };

  return (
    <button
      className={confirmed ? "hold-btn confirmed" : holding ? "hold-btn holding" : "hold-btn"}
      onPointerDown={start} onPointerUp={cancel} onPointerLeave={cancel}
    >
      <svg viewBox="0 0 72 72">
        <circle className="track" cx="36" cy="36" r="${RADIUS}" />
        <circle className="prog" cx="36" cy="36" r="${RADIUS}"
          strokeDasharray={${Math.round(CIRCUMFERENCE)}}
          strokeDashoffset={${Math.round(CIRCUMFERENCE)} * (1 - progress)} />
      </svg>
      <span>{confirmed ? "Confirmed" : "Hold"}</span>
    </button>
  );
}`;

  const prompt = `Build a circular "hold to confirm" button with an SVG progress ring that fills linearly over ${HOLD_MS}ms while held. If released early, don't ease-out the ring back to empty — drive it with a real spring (stiffness ${config.stiffness}, damping ${config.damping}, mass ${config.mass}) so the cancel has some give. On a full hold, fire confirm and flash a success state.`;

  return { css, react, prompt };
}

export function HoldToConfirm() {
  const { config } = useSpringConfig();
  const [holding, setHolding] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [raw, setRaw] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const progress = useSpring(holding ? raw : confirmed ? 1 : 0, config, { instant: holding });

  function start() {
    if (confirmed) return;
    setHolding(true);
    startRef.current = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startRef.current) / HOLD_MS, 1);
      setRaw(t);
      if (t >= 1) {
        setHolding(false);
        setConfirmed(true);
        resetTimerRef.current = setTimeout(() => setConfirmed(false), 1500);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  function cancel() {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    setHolding(false);
    setRaw(0);
  }

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  return (
    <DemoCard
      title="Hold to Confirm"
      description="Press and hold; a ring fills, release early to cancel."
      snippet={buildSnippet(config)}
    >
      <button
        className={confirmed ? "hold-btn confirmed" : holding ? "hold-btn holding" : "hold-btn"}
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
      >
        <svg viewBox="0 0 72 72" className="hold-ring">
          <circle className="hold-track" cx="36" cy="36" r={RADIUS} />
          <circle
            className="hold-prog"
            cx="36"
            cy="36"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          />
        </svg>
        <span>{confirmed ? "Confirmed" : "Hold"}</span>
      </button>
    </DemoCard>
  );
}
