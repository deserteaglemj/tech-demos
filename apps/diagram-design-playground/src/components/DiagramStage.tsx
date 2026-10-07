import { useEffect, useRef } from "react";
import type { BrandTokens, Variant } from "../lib/tokens";
import type { DiagramMeta } from "../lib/types";
import { DIAGRAM_COMPONENTS } from "../diagrams";

type Props = {
  meta: DiagramMeta;
  tokens: BrandTokens;
  variant: Variant;
  reveal: boolean;
  stageRef: React.RefObject<HTMLDivElement | null>;
};

export function DiagramStage({
  meta,
  tokens,
  variant,
  reveal,
  stageRef,
}: Props) {
  const Diagram = DIAGRAM_COMPONENTS[meta.id];
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reveal || !frameRef.current) return;
    const items = frameRef.current.querySelectorAll<HTMLElement>(".reveal-item");
    items.forEach((el) => {
      el.classList.remove("reveal-play");
      void el.offsetWidth;
      el.classList.add("reveal-play");
    });
  }, [reveal, meta.id, variant, tokens]);

  return (
    <section
      className={variant === "full" ? "diagram-stage is-full" : "diagram-stage"}
      style={
        {
          "--paper": tokens.paper,
          "--paper-2": tokens.paper2,
          "--ink": tokens.ink,
          "--muted": tokens.muted,
          "--soft": tokens.soft,
          "--accent": tokens.accent,
          "--rule": tokens.rule,
        } as React.CSSProperties
      }
    >
      <header className="stage-header">
        <p className="stage-eyebrow">{meta.eyebrow}</p>
        <h2>{meta.title}</h2>
        {variant === "full" ? <p className="stage-subtitle">{meta.subtitle}</p> : null}
      </header>
      <div className="stage-frame" ref={mergeRefs(stageRef, frameRef)}>
        <Diagram tokens={tokens} reveal={reveal} />
      </div>
      {variant === "full" ? (
        <footer className="stage-footer">
          <span>{meta.label} · Diagram Design</span>
          <span>Self-contained HTML + SVG</span>
        </footer>
      ) : null}
    </section>
  );
}

function mergeRefs(
  a: React.RefObject<HTMLDivElement | null>,
  b: React.RefObject<HTMLDivElement | null>,
) {
  return (node: HTMLDivElement | null) => {
    a.current = node;
    b.current = node;
  };
}
