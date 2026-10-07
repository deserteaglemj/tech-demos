import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { wikiIndex } from "../lib/wiki";
import { computeLayout, type LayoutNode } from "../lib/graph-layout";
import type { Route } from "../lib/route";
import { isPlainLeftClick, shortTitle } from "./helpers";

interface LinkGraphProps {
  onNavigate: (route: Route) => void;
}

const WIDE_BOX = { width: 640, height: 460 };
/** Portrait layout for narrow containers, so labels stay legible instead of shrinking to ~6px. */
const NARROW_BOX = { width: 360, height: 480 };
const NARROW_BREAKPOINT = 520;

const NODE_RADIUS = 20;
const LABEL_GAP = 8;
const LINE_HEIGHT = 14;
const ASCENT = 10;
const FRAME_PADDING = 16;
/** Rough advance width of the 12px semibold label font, used only to keep labels inside the viewBox. */
const LABEL_CHAR_WIDTH = 7.2;

type Placement = "above" | "below" | "left" | "right";

interface NodeLabel {
  lines: string[];
  placement: Placement;
}

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Breaks a multi-word label into the two most balanced lines. */
function splitLabel(label: string): string[] {
  const words = label.split(" ");
  let best = [label];
  let bestWidth = Infinity;
  for (let i = 1; i < words.length; i++) {
    const lines = [words.slice(0, i).join(" "), words.slice(i).join(" ")];
    const width = Math.max(...lines.map((line) => line.length));
    if (width < bestWidth) {
      best = lines;
      bestWidth = width;
    }
  }
  return best;
}

/**
 * Puts each label on the side of its node facing away from the graph's center,
 * where edges don't run. Compact mode stacks labels above/below to keep the width tight.
 */
function placeLabels(nodes: LayoutNode[], titles: Map<string, string>, compact: boolean): Map<string, NodeLabel> {
  const cx = nodes.reduce((sum, n) => sum + n.x, 0) / nodes.length;
  const cy = nodes.reduce((sum, n) => sum + n.y, 0) / nodes.length;
  const labels = new Map<string, NodeLabel>();
  for (const node of nodes) {
    const dx = node.x - cx;
    const dy = node.y - cy;
    const placement: Placement =
      !compact && Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : dy < 0 ? "above" : "below";
    const title = titles.get(node.slug) ?? node.slug;
    labels.set(node.slug, { lines: compact ? splitLabel(title) : [title], placement });
  }
  return labels;
}

/** Position of the first line's baseline, relative to the node center. */
function labelAnchor({ lines, placement }: NodeLabel) {
  const extraLines = lines.length - 1;
  switch (placement) {
    case "below":
      return { x: 0, y: NODE_RADIUS + LABEL_GAP + ASCENT, textAnchor: "middle" as const };
    case "above":
      return { x: 0, y: -(NODE_RADIUS + LABEL_GAP) - extraLines * LINE_HEIGHT, textAnchor: "middle" as const };
    case "right":
      return { x: NODE_RADIUS + LABEL_GAP, y: 4 - (extraLines * LINE_HEIGHT) / 2, textAnchor: "start" as const };
    case "left":
      return { x: -(NODE_RADIUS + LABEL_GAP), y: 4 - (extraLines * LINE_HEIGHT) / 2, textAnchor: "end" as const };
  }
}

function labelBounds(label: NodeLabel) {
  const width = Math.max(...label.lines.map((line) => line.length)) * LABEL_CHAR_WIDTH;
  const height = label.lines.length * LINE_HEIGHT;
  const circle = NODE_RADIUS + 6;
  const reach = NODE_RADIUS + LABEL_GAP;
  switch (label.placement) {
    case "below":
      return { left: -Math.max(circle, width / 2), right: Math.max(circle, width / 2), top: -circle, bottom: reach + height };
    case "above":
      return { left: -Math.max(circle, width / 2), right: Math.max(circle, width / 2), top: -reach - height, bottom: circle };
    case "right":
      return { left: -circle, right: reach + width, top: -Math.max(circle, height / 2), bottom: Math.max(circle, height / 2) };
    case "left":
      return { left: -reach - width, right: circle, top: -Math.max(circle, height / 2), bottom: Math.max(circle, height / 2) };
  }
}

function fitViewBox(nodes: LayoutNode[], labels: Map<string, NodeLabel>, minWidth: number): ViewBox {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const node of nodes) {
    const bounds = labelBounds(labels.get(node.slug)!);
    minX = Math.min(minX, node.x + bounds.left);
    maxX = Math.max(maxX, node.x + bounds.right);
    minY = Math.min(minY, node.y + bounds.top);
    maxY = Math.max(maxY, node.y + bounds.bottom);
  }
  minX -= FRAME_PADDING;
  maxX += FRAME_PADDING;
  minY -= FRAME_PADDING;
  maxY += FRAME_PADDING;
  let width = maxX - minX;
  if (width < minWidth) {
    minX -= (minWidth - width) / 2;
    width = minWidth;
  }
  return { x: minX, y: minY, width, height: maxY - minY };
}

export function LinkGraph({ onNavigate }: LinkGraphProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [narrow, setNarrow] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const markerId = `graph-arrow-${useId().replace(/:/g, "")}`;

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const update = () => setNarrow(frame.clientWidth < NARROW_BREAKPOINT);
    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const box = narrow ? NARROW_BOX : WIDE_BOX;
  const nodes = useMemo(
    () => computeLayout(wikiIndex.order, wikiIndex.edges, box.width, box.height),
    [box],
  );
  const titles = useMemo(
    () => new Map(wikiIndex.order.map((slug) => [slug, shortTitle(wikiIndex.pages.get(slug)!.title)])),
    [],
  );
  const labels = useMemo(() => placeLabels(nodes, titles, narrow), [nodes, titles, narrow]);
  const viewBox = useMemo(
    () => fitViewBox(nodes, labels, narrow ? 0 : box.width),
    [nodes, labels, narrow, box],
  );
  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    for (const n of nodes) map.set(n.slug, { x: n.x, y: n.y });
    return map;
  }, [nodes]);

  const neighbors = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const slug of wikiIndex.order) map.set(slug, new Set());
    for (const edge of wikiIndex.edges) {
      map.get(edge.source)?.add(edge.target);
      map.get(edge.target)?.add(edge.source);
    }
    return map;
  }, []);

  return (
    <div className="page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="#/">Index</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Link graph</span>
      </nav>
      <h1 tabIndex={-1}>Link graph</h1>
      <p className="lede">
        Every arrow is a <code>[[wiki-link]]</code> found in a topic's text.
        Hover or focus a node to highlight its neighbors; click or tap to open the page.
      </p>

      <div className="graph-frame" ref={frameRef}>
        <svg
          className="graph-svg"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          role="group"
          aria-label={`Topic link graph: ${wikiIndex.order.length} topics, ${wikiIndex.edges.length} links`}
        >
          <defs>
            {(["", "-active"] as const).map((variant) => (
              <marker
                key={variant}
                id={`${markerId}${variant}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path
                  d="M 0 0 L 10 5 L 0 10 z"
                  fill={variant ? "var(--accent)" : "var(--edge-color)"}
                />
              </marker>
            ))}
          </defs>

          <g aria-hidden="true">
            {wikiIndex.edges.map((edge) => {
              const a = positions.get(edge.source);
              const b = positions.get(edge.target);
              if (!a || !b) return null;
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const length = Math.hypot(dx, dy) || 1;
              const ux = dx / length;
              const uy = dy / length;
              const touchesHovered = hovered !== null && (edge.source === hovered || edge.target === hovered);
              const state = hovered === null ? "" : touchesHovered ? "active" : "dim";
              return (
                <line
                  key={`${edge.source}->${edge.target}`}
                  x1={a.x + ux * (NODE_RADIUS + 2)}
                  y1={a.y + uy * (NODE_RADIUS + 2)}
                  x2={b.x - ux * (NODE_RADIUS + 4)}
                  y2={b.y - uy * (NODE_RADIUS + 4)}
                  className={`graph-edge ${state}`}
                  markerEnd={`url(#${markerId}${touchesHovered ? "-active" : ""})`}
                />
              );
            })}
          </g>

          {nodes.map((node) => {
            const page = wikiIndex.pages.get(node.slug)!;
            const isHovered = hovered === node.slug;
            const isNeighbor = hovered ? neighbors.get(hovered)?.has(node.slug) : false;
            const dim = hovered && !isHovered && !isNeighbor;
            const incoming = wikiIndex.backlinks.get(node.slug)?.length ?? 0;
            const label = labels.get(node.slug)!;
            const anchor = labelAnchor(label);
            return (
              <a
                key={node.slug}
                href={`#/wiki/${node.slug}`}
                className={`graph-node ${dim ? "dim" : ""} ${isHovered ? "hovered" : ""}`}
                aria-label={`${page.title}: ${page.links.length} outgoing, ${incoming} incoming links`}
                onMouseEnter={() => setHovered(node.slug)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(node.slug)}
                onBlur={() => setHovered(null)}
                onClick={(event) => {
                  if (!isPlainLeftClick(event)) return;
                  event.preventDefault();
                  onNavigate({ type: "wiki", slug: node.slug });
                }}
              >
                <g transform={`translate(${node.x}, ${node.y})`}>
                  <circle className="graph-node-hit" r={NODE_RADIUS + 12} />
                  <circle className="graph-node-ring" r={NODE_RADIUS + 5} />
                  <circle className="graph-node-dot" r={NODE_RADIUS} />
                  <text className="graph-label" x={anchor.x} y={anchor.y} textAnchor={anchor.textAnchor}>
                    {label.lines.map((line, index) => (
                      <tspan key={index} x={anchor.x} dy={index === 0 ? 0 : LINE_HEIGHT}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              </a>
            );
          })}
        </svg>
      </div>

      <ul className="graph-legend" aria-label="All topics">
        {wikiIndex.order.map((slug) => (
          <li key={slug}>
            <button type="button" className="inline-link" onClick={() => onNavigate({ type: "wiki", slug })}>
              {wikiIndex.pages.get(slug)!.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
