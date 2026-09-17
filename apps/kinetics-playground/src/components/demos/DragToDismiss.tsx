import { useRef, useState } from "react";
import { useSpringConfig } from "../../lib/SpringContext";
import { useSpring } from "../../lib/useSpring";
import { clamp, type SpringConfig } from "../../lib/springMath";
import { DemoCard } from "../DemoCard";

const THRESHOLD = 100;
const FLY_DISTANCE = 480;

function buildSnippet(config: SpringConfig) {
  const css = `.drag-card {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s;
  touch-action: none;
}
.drag-card.snap-back {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
/* JS tracks pointerdown/move/up, applies translate proportional to
   drag distance, and checks the ${THRESHOLD}px threshold on release. */`;

  const react = `const spring = { stiffness: ${config.stiffness}, damping: ${config.damping}, mass: ${config.mass} };

function DraggableCard({ onDismiss }) {
  const [dragging, setDragging] = useState(false);
  const [x, setX] = useState(0);
  const [target, setTarget] = useState(0);
  const startX = useRef(0);
  const origin = useRef(0);

  const springX = useSpring(dragging ? x : target, spring, { instant: dragging });

  const onDown = (e) => {
    setDragging(true);
    startX.current = e.clientX;
    origin.current = springX;
  };
  const onMove = (e) => dragging && setX(origin.current + (e.clientX - startX.current));
  const onUp = () => {
    setDragging(false);
    if (Math.abs(x) > ${THRESHOLD}) {
      setTarget(x > 0 ? ${FLY_DISTANCE} : -${FLY_DISTANCE});
      onDismiss?.();
    } else {
      setTarget(0);
    }
  };

  return (
    <div
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
      style={{ transform: \`translateX(\${springX}px) rotate(\${springX * 0.05}deg)\` }}
    >
      Drag me away
    </div>
  );
}`;

  const prompt = `Build a card you can drag horizontally to dismiss. Track pointerdown/move/up and translate by the drag delta plus a subtle rotation. On release past a ${THRESHOLD}px threshold, fling it off-screen; otherwise spring it back to center with stiffness ${config.stiffness}, damping ${config.damping}, mass ${config.mass} — a real simulation, so a fast flick carries more overshoot than a slow release.`;

  return { css, react, prompt };
}

export function DragToDismiss() {
  const { config } = useSpringConfig();
  const [dragging, setDragging] = useState(false);
  const [x, setX] = useState(0);
  const [target, setTarget] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [resetting, setResetting] = useState(false);
  const startXRef = useRef(0);
  const originRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const springX = useSpring(dragging ? x : target, config, { instant: dragging || resetting });

  function onPointerDown(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setDismissed(false);
    setResetting(false);
    setDragging(true);
    startXRef.current = e.clientX;
    originRef.current = springX;
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    setX(originRef.current + (e.clientX - startXRef.current));
  }

  function onPointerUp() {
    if (!dragging) return;
    setDragging(false);
    if (Math.abs(x) > THRESHOLD) {
      const dir = x > 0 ? 1 : -1;
      setDismissed(true);
      setTarget(dir * FLY_DISTANCE);
      resetTimerRef.current = setTimeout(() => {
        setResetting(true);
        setTarget(0);
        setDismissed(false);
        requestAnimationFrame(() => setResetting(false));
      }, 650);
    } else {
      setTarget(0);
    }
  }

  const rotate = springX * 0.05;
  const opacity = dismissed ? clamp(1 - Math.abs(springX) / 300, 0, 1) : 1;

  return (
    <DemoCard
      title="Drag to Dismiss"
      description="Pointer-tracked drag, snaps back or flies off past threshold."
      snippet={buildSnippet(config)}
    >
      <div className="drag-stage">
        <div
          className="drag-card"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ transform: `translateX(${springX}px) rotate(${rotate}deg)`, opacity }}
        >
          <p>Drag me away</p>
          <span>release past {THRESHOLD}px</span>
        </div>
      </div>
    </DemoCard>
  );
}
