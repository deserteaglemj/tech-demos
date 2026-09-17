import { useState } from "react";
import { useSpringConfig } from "../../lib/SpringContext";
import { useSpring } from "../../lib/useSpring";
import { bezierCss, springToBezier, type SpringConfig } from "../../lib/springMath";
import { DemoCard } from "../DemoCard";

function buildSnippet(config: SpringConfig) {
  const { bezier, durationMs } = springToBezier(config);
  const css = `.digit {
  display: inline-block;
  transition: transform ${(durationMs / 1000).toFixed(2)}s ${bezierCss(bezier)};
}
.digit.bump { transform: scale(1.25) translateY(-7px); }`;

  const react = `const spring = { stiffness: ${config.stiffness}, damping: ${config.damping}, mass: ${config.mass} };

function ElasticCounter() {
  const [val, setVal] = useState(12);
  const [bumpTarget, setBumpTarget] = useState(0);
  const bump = useSpring(bumpTarget, spring); // 0 -> 1 -> 0 "pluck", not a fixed keyframe

  const increment = () => {
    setVal((v) => v + 1);
    setBumpTarget(1);
    requestAnimationFrame(() => setBumpTarget(0));
  };

  return (
    <span
      onClick={increment}
      style={{ transform: \`translateY(\${-bump * 7}px) scale(\${1 + bump * 0.25})\` }}
    >
      {val}
    </span>
  );
}`;

  const prompt = `Build a number that increments on click and bumps elastically each time. Instead of a fixed-duration keyframe, flick a real spring's target 0 -> 1 -> 0 on every click (stiffness ${config.stiffness}, damping ${config.damping}, mass ${config.mass}) and map it to scale + translateY, so rapid repeated clicks compound naturally instead of restarting a canned animation.`;

  return { css, react, prompt };
}

export function ElasticCounter() {
  const { config } = useSpringConfig();
  const [val, setVal] = useState(12);
  const [bumpTarget, setBumpTarget] = useState(0);
  const bump = useSpring(bumpTarget, config);

  function increment() {
    setVal((v) => v + 1);
    setBumpTarget(1);
    requestAnimationFrame(() => setBumpTarget(0));
  }

  return (
    <DemoCard
      title="Elastic Counter"
      description="Digit bumps and overshoots on every increment."
      snippet={buildSnippet(config)}
    >
      <button className="counter-btn" onClick={increment}>
        <span
          className="counter-digit"
          style={{ transform: `translateY(${-bump * 7}px) scale(${1 + bump * 0.25})` }}
        >
          {val}
        </span>
        <span className="counter-hint">tap to bump</span>
      </button>
    </DemoCard>
  );
}
