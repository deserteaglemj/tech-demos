import { useMemo, useState } from "react";
import { wikiIndex } from "../lib/wiki";
import { computeLayout } from "../lib/graph-layout";
import type { Route } from "../lib/route";

interface LinkGraphProps {
  onNavigate: (route: Route) => void;
}

const WIDTH = 640;
const HEIGHT = 460;

export function LinkGraph({ onNavigate }: LinkGraphProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const nodes = useMemo(
    () => computeLayout(wikiIndex.order, wikiIndex.edges, WIDTH, HEIGHT),
    [],
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
      <div className="breadcrumb">
        <a href="#/">Index</a> / Link graph
      </div>
      <h1>Link graph</h1>
      <p className="lede">
        Every arrow is a <code>[[wiki-link]]</code> found in a topic's text.
        Hover a node to highlight its neighbors, click to open the page.
      </p>

      <svg
        className="graph-svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Wiki topic link graph"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--edge-color)" />
          </marker>
        </defs>

        {wikiIndex.edges.map((edge) => {
          const a = positions.get(edge.source);
          const b = positions.get(edge.target);
          if (!a || !b) return null;
          const dim = hovered && edge.source !== hovered && edge.target !== hovered;
          return (
            <line
              key={`${edge.source}->${edge.target}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className={`graph-edge ${dim ? "dim" : ""}`}
              markerEnd="url(#arrow)"
            />
          );
        })}

        {nodes.map((node) => {
          const page = wikiIndex.pages.get(node.slug)!;
          const isHovered = hovered === node.slug;
          const isNeighbor = hovered ? neighbors.get(hovered)?.has(node.slug) : false;
          const dim = hovered && !isHovered && !isNeighbor;
          return (
            <g
              key={node.slug}
              transform={`translate(${node.x}, ${node.y})`}
              className={`graph-node ${dim ? "dim" : ""} ${isHovered ? "hovered" : ""}`}
              onMouseEnter={() => setHovered(node.slug)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onNavigate({ type: "wiki", slug: node.slug })}
            >
              <circle r={26} />
              <text textAnchor="middle" dy="4">
                {page.title.split(" ")[0]}
              </text>
            </g>
          );
        })}
      </svg>

      <ul className="graph-legend">
        {wikiIndex.order.map((slug) => (
          <li key={slug}>
            <button className="inline-link" onClick={() => onNavigate({ type: "wiki", slug })}>
              {wikiIndex.pages.get(slug)!.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
