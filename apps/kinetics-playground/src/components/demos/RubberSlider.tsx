import { useRef, useState } from "react";
import { useSpringConfig } from "../../lib/SpringContext";
import { useSpring } from "../../lib/useSpring";
import { bezierCss, clamp, springToBezier, type SpringConfig } from "../../lib/springMath";
import { DemoCard } from "../DemoCard";

const RUBBER = 0.32;

function buildSnippet(config: SpringConfig) {
  const { bezier, durationMs } = springToBezier(config);
  const css = `.thumb { transition: none; } /* follows the pointer 1:1 while dragging */
.thumb.snap {
  transition: left ${(durationMs / 1000).toFixed(2)}s ${bezierCss(bezier)};
}
/* Past the ends, JS adds only ${Math.round(RUBBER * 100)}% of the overshoot:
   pct = clamped + (raw - clamped) * ${RUBBER}. On release the overshoot
   is dropped and .snap springs the thumb home. */`;

  const react = `const spring = { stiffness: ${config.stiffness}, damping: ${config.damping}, mass: ${config.mass} };
const RUBBER = ${RUBBER};

function RubberSlider() {
  const track = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [rawPct, setRawPct] = useState(0.5); // may exceed [0,1] while dragging
  const [target, setTarget] = useState(0.5);

  // instant while dragging (1:1 tracking incl. rubber overshoot),
  // spring-animated once released
  const pct = useSpring(dragging ? rawPct : target, spring, { instant: dragging });

  const fractionAt = (clientX, rubber) => {
    const r = track.current.getBoundingClientRect();
    const raw = (clientX - r.left) / r.width;
    const clamped = Math.min(Math.max(raw, 0), 1);
    return rubber ? clamped + (raw - clamped) * RUBBER : clamped;
  };

  return (
    <div
      ref={track}
      onPointerDown={(e) => { setDragging(true); setRawPct(fractionAt(e.clientX, true)); }}
      onPointerMove={(e) => dragging && setRawPct(fractionAt(e.clientX, true))}
      onPointerUp={(e) => { setDragging(false); setTarget(fractionAt(e.clientX, false)); }}
    >
      <span className="thumb" style={{ left: \`\${pct * 100}%\` }} />
    </div>
  );
}`;

  const prompt = `Build a horizontal slider whose thumb resists past the ends like a rubber band. While dragging, map the pointer 1:1 (including ${Math.round(RUBBER * 100)}% rubber overshoot past the ends). On release, drop the overshoot and spring the thumb back into range with stiffness ${config.stiffness}, damping ${config.damping}, mass ${config.mass}.`;

  return { css, react, prompt };
}

export function RubberSlider() {
  const { config } = useSpringConfig();
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [rawPct, setRawPct] = useState(0.5);
  const [target, setTarget] = useState(0.5);

  const pct = useSpring(dragging ? rawPct : target, config, { instant: dragging });
  const displayPct = clamp(pct, 0, 1);

  function fractionAt(clientX: number, rubber: boolean) {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    const clamped = clamp(raw, 0, 1);
    return rubber ? clamped + (raw - clamped) * RUBBER : clamped;
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    setRawPct(fractionAt(e.clientX, true));
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    setRawPct(fractionAt(e.clientX, true));
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!dragging) return;
    setDragging(false);
    setTarget(fractionAt(e.clientX, false));
  }

  return (
    <DemoCard
      title="Rubber-band Slider"
      description="Drag past either end and it stretches, then springs back."
      snippet={buildSnippet(config)}
    >
      <div className="rubber-stage">
        <div
          ref={trackRef}
          className="rubber-track"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="rubber-fill" style={{ width: `${pct * 100}%` }} />
          <div className="rubber-thumb" style={{ left: `${pct * 100}%` }} />
        </div>
        <span className="rubber-value">{displayPct.toFixed(2)}</span>
      </div>
    </DemoCard>
  );
}
