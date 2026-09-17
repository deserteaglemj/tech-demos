import { useState } from "react";
import { useSpringConfig } from "../../lib/SpringContext";
import { useSpring } from "../../lib/useSpring";
import { bezierCss, springToBezier, type SpringConfig } from "../../lib/springMath";
import { DemoCard } from "../DemoCard";

const PARTICLES = 8;
const START_COUNT = 128;

interface Particle {
  id: number;
  tx: number;
  ty: number;
}

function buildSnippet(config: SpringConfig) {
  const { bezier, durationMs } = springToBezier(config);
  const css = `.heart { transition: transform ${(durationMs / 1000).toFixed(2)}s ${bezierCss(bezier)}; }
.like-btn.pop .heart { transform: scale(1.35); }
.like-btn.liked .heart { fill: #FF8A00; stroke: #FF8A00; }

.particle { animation: fly 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fly { to { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; } }
/* JS spawns ${PARTICLES} particles on a circle each time it's liked. */`;

  const react = `const spring = { stiffness: ${config.stiffness}, damping: ${config.damping}, mass: ${config.mass} };

function LikeButton({ start = ${START_COUNT} }) {
  const [liked, setLiked] = useState(false);
  const [bumpTarget, setBumpTarget] = useState(0);
  const [bits, setBits] = useState([]);
  const bump = useSpring(bumpTarget, spring); // 0 -> 1 -> 0 "pluck"

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    setBumpTarget(1);
    requestAnimationFrame(() => setBumpTarget(0));
    if (next) {
      setBits(Array.from({ length: ${PARTICLES} }, (_, i) => {
        const a = (Math.PI * 2 * i) / ${PARTICLES}, d = 28;
        return { id: Date.now() + i, tx: Math.cos(a) * d, ty: Math.sin(a) * d };
      }));
      setTimeout(() => setBits([]), 600);
    }
  };

  return (
    <button className={liked ? "like-btn liked" : "like-btn"} onClick={toggle}>
      <Heart style={{ transform: \`scale(\${1 + bump * 0.35})\` }} />
      <span>{start + (liked ? 1 : 0)}</span>
      {bits.map((b) => (
        <span key={b.id} className="particle" style={{ "--tx": \`\${b.tx}px\`, "--ty": \`\${b.ty}px\` }} />
      ))}
    </button>
  );
}`;

  const prompt = `Build a like button that pops its heart and emits a particle burst when toggled on. Drive the pop with a real spring "pluck" (target flicks 0 -> 1 -> 0, stiffness ${config.stiffness}, damping ${config.damping}, mass ${config.mass}), fill the heart with the accent color, increment the count, and spawn ${PARTICLES} particles outward on an even circle that shrink to scale(0) and fade over ~0.6s.`;

  return { css, react, prompt };
}

function Heart({ filled, style }: { filled: boolean; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" style={style} className="heart-svg">
      <path
        d="M12 20.5c-.3 0-.6-.1-.8-.3C7 16.9 3.5 13.9 3.5 9.9 3.5 7.2 5.6 5 8.3 5c1.5 0 2.9.7 3.7 1.9C12.8 5.7 14.2 5 15.7 5c2.7 0 4.8 2.2 4.8 4.9 0 4-3.5 7-7.7 10.3-.2.2-.5.3-.8.3z"
        fill={filled ? "#FF8A00" : "none"}
        stroke={filled ? "#FF8A00" : "#8A8A93"}
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function LikeBurst() {
  const { config } = useSpringConfig();
  const [liked, setLiked] = useState(false);
  const [bumpTarget, setBumpTarget] = useState(0);
  const [bits, setBits] = useState<Particle[]>([]);
  const bump = useSpring(bumpTarget, config);

  function toggle() {
    const next = !liked;
    setLiked(next);
    setBumpTarget(1);
    requestAnimationFrame(() => setBumpTarget(0));
    if (next) {
      setBits(
        Array.from({ length: PARTICLES }, (_, i) => {
          const a = (Math.PI * 2 * i) / PARTICLES;
          const d = 30;
          return { id: Date.now() + i, tx: Math.cos(a) * d, ty: Math.sin(a) * d };
        }),
      );
      setTimeout(() => setBits([]), 620);
    }
  }

  return (
    <DemoCard
      title="Like Burst"
      description="Toggles, pops the heart, and emits a radial particle ring."
      snippet={buildSnippet(config)}
    >
      <button className={liked ? "like-btn liked" : "like-btn"} onClick={toggle}>
        <Heart filled={liked} style={{ transform: `scale(${1 + bump * 0.35})` }} />
        <span className="like-count">{START_COUNT + (liked ? 1 : 0)}</span>
        {bits.map((b) => (
          <span
            key={b.id}
            className="particle"
            style={{ "--tx": `${b.tx}px`, "--ty": `${b.ty}px` } as React.CSSProperties}
          />
        ))}
      </button>
    </DemoCard>
  );
}
