import type { ReactNode } from "react";
import type { BrandTokens } from "../lib/tokens";
import { withAlpha } from "../lib/tokens";

export type DiagramProps = {
  tokens: BrandTokens;
  reveal: boolean;
};

type SvgShellProps = DiagramProps & {
  viewBox: string;
  title: string;
  desc: string;
  children: ReactNode;
};

export function SvgShell({
  tokens,
  reveal,
  viewBox,
  title,
  desc,
  children,
}: SvgShellProps) {
  const titleId = `${slug(title)}-title`;
  const descId = `${slug(title)}-desc`;

  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
      className={reveal ? "diagram-svg is-reveal" : "diagram-svg"}
    >
      <title id={titleId}>{title}</title>
      <desc id={descId}>{desc}</desc>
      <defs>
        <pattern
          id="dd-dots"
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="0.9" fill={withAlpha(tokens.ink, 0.1)} />
        </pattern>
        <marker
          id="arrow"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill={tokens.muted} />
        </marker>
        <marker
          id="arrow-accent"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill={tokens.accent} />
        </marker>
        <marker
          id="arrow-link"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill={tokens.link} />
        </marker>
        <marker
          id="arrow-soft"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill={tokens.soft} />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

export function Paper({
  tokens,
  width,
  height,
}: {
  tokens: BrandTokens;
  width: number;
  height: number;
}) {
  return (
    <>
      <rect width={width} height={height} fill={tokens.paper} />
      <rect
        width={width}
        height={height}
        fill="url(#dd-dots)"
        opacity={0.55}
      />
    </>
  );
}

export function NodeBox({
  tokens,
  x,
  y,
  w,
  h,
  name,
  sub,
  tag,
  focal = false,
  delay = 0,
}: {
  tokens: BrandTokens;
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  sub?: string;
  tag?: string;
  focal?: boolean;
  delay?: number;
}) {
  const stroke = focal ? tokens.accent : tokens.soft;
  const fill = focal ? tokens.accentTint : tokens.paper;
  const nameFill = focal ? tokens.accent : tokens.ink;
  const cx = x + w / 2;
  const nameY = sub ? y + h / 2 - 2 : y + h / 2 + 4;

  return (
    <g className="reveal-item" style={{ animationDelay: `${delay}ms` }}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        fill={fill}
        stroke={stroke}
        strokeWidth={focal ? 1.2 : 1}
      />
      {tag ? (
        <>
          <rect
            x={x + 8}
            y={y + 8}
            width={28}
            height={12}
            rx={2}
            fill="transparent"
            stroke={withAlpha(tokens.soft, 0.45)}
            strokeWidth={0.8}
          />
          <text
            x={x + 22}
            y={y + 17}
            fill={tokens.soft}
            fontSize={7}
            fontFamily="Geist Mono, ui-monospace, monospace"
            textAnchor="middle"
            letterSpacing="0.08em"
          >
            {tag}
          </text>
        </>
      ) : null}
      <text
        x={cx}
        y={nameY}
        fill={nameFill}
        fontSize={12}
        fontWeight={600}
        fontFamily="Geist, system-ui, sans-serif"
        textAnchor="middle"
      >
        {name}
      </text>
      {sub ? (
        <text
          x={cx}
          y={y + h / 2 + 14}
          fill={tokens.soft}
          fontSize={9}
          fontFamily="Geist Mono, ui-monospace, monospace"
          textAnchor="middle"
        >
          {sub}
        </text>
      ) : null}
    </g>
  );
}

export function ArrowLabel({
  tokens,
  x,
  y,
  w,
  label,
  color,
  delay = 0,
}: {
  tokens: BrandTokens;
  x: number;
  y: number;
  w: number;
  label: string;
  color?: string;
  delay?: number;
}) {
  return (
    <g className="reveal-item" style={{ animationDelay: `${delay}ms` }}>
      <rect x={x} y={y} width={w} height={12} rx={2} fill={tokens.paper} />
      <text
        x={x + w / 2}
        y={y + 9}
        fill={color ?? tokens.muted}
        fontSize={8}
        fontFamily="Geist Mono, ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.08em"
      >
        {label}
      </text>
    </g>
  );
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
