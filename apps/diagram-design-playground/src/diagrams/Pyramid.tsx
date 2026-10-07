import { Paper, SvgShell, type DiagramProps } from "./primitives";

const LAYERS = [
  { label: "One sentence they retell", w: 220, focal: true },
  { label: "Two supporting moves", w: 340, focal: false },
  { label: "Proof, numbers, receipts", w: 460, focal: false },
  { label: "Context the curious can skip", w: 580, focal: false },
] as const;

export function Pyramid(props: DiagramProps) {
  const { tokens } = props;
  const cx = 450;
  const startY = 70;
  const rowH = 72;
  const gap = 12;

  return (
    <SvgShell
      {...props}
      viewBox="0 0 900 420"
      title="What the reader remembers"
      desc="Pyramid of message hierarchy from one sentence down to optional context."
    >
      <Paper tokens={tokens} width={900} height={420} />

      {LAYERS.map((layer, i) => {
        const y = startY + i * (rowH + gap);
        const x = cx - layer.w / 2;
        return (
          <g key={layer.label} className="reveal-item" style={{ animationDelay: `${60 + i * 80}ms` }}>
            <rect
              x={x}
              y={y}
              width={layer.w}
              height={rowH}
              rx={6}
              fill={layer.focal ? tokens.accentTint : tokens.paper}
              stroke={layer.focal ? tokens.accent : tokens.ink}
              strokeWidth={layer.focal ? 1.2 : 1}
            />
            <text
              x={cx}
              y={y + 32}
              fill={layer.focal ? tokens.accent : tokens.ink}
              fontSize={13}
              fontWeight={600}
              fontFamily="Geist, system-ui, sans-serif"
              textAnchor="middle"
            >
              {layer.label}
            </text>
            <text
              x={cx}
              y={y + 50}
              fill={tokens.soft}
              fontSize={8}
              fontFamily="Geist Mono, ui-monospace, monospace"
              textAnchor="middle"
              letterSpacing="0.08em"
            >
              {`TIER ${i + 1}`}
            </text>
          </g>
        );
      })}
    </SvgShell>
  );
}
