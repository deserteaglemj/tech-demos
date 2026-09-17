import { useEffect, useRef, useState } from "react";
import { useSpringConfig } from "../../lib/SpringContext";
import { useSpring } from "../../lib/useSpring";
import { bezierCss, springToBezier, type SpringConfig } from "../../lib/springMath";
import { DemoCard } from "../DemoCard";

function buildSnippet(config: SpringConfig) {
  const { bezier, durationMs } = springToBezier(config);
  const css = `.toast {
  transform: translate(-50%, 140%) scale(0.9);
  opacity: 0;
  transition: transform ${(durationMs / 1000).toFixed(2)}s ${bezierCss(bezier)}, opacity 0.3s;
}
.toast.show {
  transform: translate(-50%, 0) scale(1);
  opacity: 1;
}`;

  const react = `const spring = { stiffness: ${config.stiffness}, damping: ${config.damping}, mass: ${config.mass} };

function Toast({ show }) {
  const y = useSpring(show ? 0 : 140, spring);
  const scale = 0.9 + (1 - Math.min(y / 140, 1)) * 0.1;

  return (
    <div
      style={{
        transform: \`translate(-50%, \${y}%) scale(\${scale})\`,
        opacity: Math.max(1 - y / 140, 0),
      }}
    >
      Saved to your library
    </div>
  );
}`;

  const prompt = `Build a toast that slides up from the bottom, overshoots its rest position, then settles, using a real spring (stiffness ${config.stiffness}, damping ${config.damping}, mass ${config.mass}) on translateY instead of a fixed-duration ease. Auto-hide after ~2 seconds.`;

  return { css, react, prompt };
}

export function ToastOvershoot() {
  const { config } = useSpringConfig();
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const y = useSpring(show ? 0 : 140, config);
  const scale = 0.9 + (1 - Math.min(y / 140, 1)) * 0.1;

  function trigger() {
    setShow(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShow(false), 1900);
  }

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return (
    <DemoCard
      title="Toast Overshoot"
      description="Slides past rest position before settling."
      snippet={buildSnippet(config)}
    >
      <div className="toast-stage">
        <button className="ghost-btn" onClick={trigger}>
          Show toast
        </button>
        <div
          className="toast"
          style={{
            transform: `translate(-50%, ${y}%) scale(${scale})`,
            opacity: Math.max(1 - y / 140, 0),
          }}
        >
          Saved to your library ✓
        </div>
      </div>
    </DemoCard>
  );
}
