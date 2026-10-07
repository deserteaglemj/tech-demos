import type { GraphEdge } from "./types";

export interface LayoutNode {
  slug: string;
  x: number;
  y: number;
}

/**
 * Tiny hand-rolled force-directed layout (no d3 dependency): mutual
 * repulsion between all nodes, spring attraction along edges, and a light
 * pull toward the center. Fine for the handful of nodes a demo wiki has.
 */
export function computeLayout(
  slugs: string[],
  edges: GraphEdge[],
  width: number,
  height: number,
): LayoutNode[] {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2.6;

  const nodes = new Map<string, LayoutNode>();
  slugs.forEach((slug, i) => {
    const angle = (i / Math.max(slugs.length, 1)) * Math.PI * 2;
    nodes.set(slug, {
      slug,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    });
  });

  const REPULSION = 3800;
  const SPRING = 0.02;
  const SPRING_LENGTH = Math.min(width, height) / 2.4;
  const CENTER_PULL = 0.01;
  const ITERATIONS = 220;

  const list = Array.from(nodes.values());

  for (let iter = 0; iter < ITERATIONS; iter++) {
    const forces = new Map<string, { fx: number; fy: number }>();
    for (const n of list) forces.set(n.slug, { fx: 0, fy: 0 });

    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let distSq = dx * dx + dy * dy;
        if (distSq < 1) distSq = 1;
        const dist = Math.sqrt(distSq);
        const force = REPULSION / distSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        forces.get(a.slug)!.fx += fx;
        forces.get(a.slug)!.fy += fy;
        forces.get(b.slug)!.fx -= fx;
        forces.get(b.slug)!.fy -= fy;
      }
    }

    for (const edge of edges) {
      const a = nodes.get(edge.source);
      const b = nodes.get(edge.target);
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const stretch = dist - SPRING_LENGTH;
      const force = stretch * SPRING;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      forces.get(a.slug)!.fx += fx;
      forces.get(a.slug)!.fy += fy;
      forces.get(b.slug)!.fx -= fx;
      forces.get(b.slug)!.fy -= fy;
    }

    for (const n of list) {
      const f = forces.get(n.slug)!;
      f.fx += (cx - n.x) * CENTER_PULL;
      f.fy += (cy - n.y) * CENTER_PULL;
      n.x += f.fx;
      n.y += f.fy;

      const margin = 40;
      n.x = Math.min(Math.max(n.x, margin), width - margin);
      n.y = Math.min(Math.max(n.y, margin), height - margin);
    }
  }

  return list;
}
