import { useRef, useState } from "react";
import { useSpringConfig } from "../../lib/SpringContext";
import { useSpring2D } from "../../lib/useSpring";
import { bezierCss, springToBezier, type SpringConfig } from "../../lib/springMath";
import { DemoCard } from "../DemoCard";

const PULL = 0.35;
const DEAD_ZONE = 90;

function buildSnippet(config: SpringConfig) {
  const { bezier, durationMs } = springToBezier(config);
  const css = `.magnet-btn {
  transition: transform ${(durationMs / 1000).toFixed(2)}s ${bezierCss(bezier)};
}
/* JS computes the pointer offset from the button's center,
   scales it by a pull factor, and applies translate(). */`;

  const react = `// real spring physics, not a fixed-duration transition
const spring = { stiffness: ${config.stiffness}, damping: ${config.damping}, mass: ${config.mass} };

function MagneticButton() {
  const ref = useRef(null);
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const { x, y } = useSpring2D(target, spring);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    setTarget({ x: dx * ${PULL}, y: dy * ${PULL} });
  };

  return (
    <div onPointerMove={onMove} onPointerLeave={() => setTarget({ x: 0, y: 0 })}>
      <button ref={ref} style={{ transform: \`translate(\${x}px, \${y}px)\` }}>
        Hover near me
      </button>
    </div>
  );
}`;

  const prompt = `Build a button that is magnetically pulled toward the cursor while the pointer is inside its surrounding zone. Drive the pull with a real spring simulation (stiffness ${config.stiffness}, damping ${config.damping}, mass ${config.mass}) targeting ~${PULL * 100}% of the pointer offset from center; spring back to (0,0) on pointer leave so the release feels weighted, not linear.`;

  return { css, react, prompt };
}

export function MagneticButton() {
  const { config } = useSpringConfig();
  const ref = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const { x, y } = useSpring2D(target, config);

  function onMove(e: React.PointerEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist > DEAD_ZONE) {
      setTarget({ x: 0, y: 0 });
      return;
    }
    setTarget({ x: dx * PULL, y: dy * PULL });
  }

  return (
    <DemoCard
      title="Magnetic Button"
      description="Cursor pulls the button toward it inside a dead zone."
      snippet={buildSnippet(config)}
    >
      <div ref={ref} className="magnet-zone" onPointerMove={onMove} onPointerLeave={() => setTarget({ x: 0, y: 0 })}>
        <button className="magnet-btn" style={{ transform: `translate(${x}px, ${y}px)` }}>
          Hover near me
        </button>
      </div>
    </DemoCard>
  );
}
