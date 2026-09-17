import { useLayoutEffect, useRef, useState } from "react";
import { useSpringConfig } from "../../lib/SpringContext";
import { useSpring } from "../../lib/useSpring";
import { bezierCss, springToBezier, type SpringConfig } from "../../lib/springMath";
import { DemoCard } from "../DemoCard";

const TABS = ["Plan", "Build", "Ship"];

function buildSnippet(config: SpringConfig) {
  const { bezier, durationMs } = springToBezier(config);
  const css = `.pill {
  position: absolute;
  transition: left ${(durationMs / 1000).toFixed(2)}s ${bezierCss(bezier)},
              width ${(durationMs / 1000).toFixed(2)}s ${bezierCss(bezier)};
}
/* JS sets pill.style.left/width to the active button's
   offsetLeft/offsetWidth whenever the active tab changes. */`;

  const react = `const spring = { stiffness: ${config.stiffness}, damping: ${config.damping}, mass: ${config.mass} };

function GlidingTabs({ tabs }) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);
  const [rect, setRect] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = refs.current[active];
    if (el) setRect({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);

  const left = useSpring(rect.left, spring);
  const width = useSpring(rect.width, spring);

  return (
    <div style={{ position: "relative" }}>
      <span className="pill" style={{ left, width }} />
      {tabs.map((t, i) => (
        <button key={t} ref={(el) => (refs.current[i] = el)} onClick={() => setActive(i)}>
          {t}
        </button>
      ))}
    </div>
  );
}`;

  const prompt = `Build a segmented tab control where a highlighted pill glides between tabs. On tab change, measure the target button's offsetLeft/offsetWidth and drive the pill's left and width with a real spring (stiffness ${config.stiffness}, damping ${config.damping}, mass ${config.mass}) instead of a fixed-duration transition, so quick repeated taps redirect the pill naturally mid-flight.`;

  return { css, react, prompt };
}

export function GlidingTabs() {
  const { config } = useSpringConfig();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [rect, setRect] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = refs.current[active];
    if (el) setRect({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);

  const left = useSpring(rect.left, config);
  const width = useSpring(rect.width, config);

  return (
    <DemoCard
      title="Gliding Tabs"
      description="Pill indicator measures target width before moving."
      snippet={buildSnippet(config)}
    >
      <div className="tabs-stage">
        <span className="tabs-pill" style={{ left, width }} />
        {TABS.map((t, i) => (
          <button
            key={t}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={active === i ? "tab-btn active" : "tab-btn"}
            onClick={() => setActive(i)}
          >
            {t}
          </button>
        ))}
      </div>
    </DemoCard>
  );
}
