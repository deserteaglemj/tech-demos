import { Paper, SvgShell, type DiagramProps } from "./primitives";

const POINTS = [
  { name: "Docs rewrite", x: 280, y: 280, focal: false },
  { name: "Billing v2", x: 620, y: 160, focal: true },
  { name: "Dark mode", x: 240, y: 160, focal: false },
  { name: "Legacy purge", x: 640, y: 300, focal: false },
  { name: "Onboarding", x: 480, y: 220, focal: false },
] as const;

export function Quadrant(props: DiagramProps) {
  const { tokens } = props;

  return (
    <SvgShell
      {...props}
      viewBox="0 0 900 480"
      title="Q2 bets by impact vs effort"
      desc="Quadrant chart placing product bets on impact versus effort axes."
    >
      <Paper tokens={tokens} width={900} height={480} />

      <g className="reveal-item" style={{ animationDelay: "40ms" }}>
        <line x1={160} y1={400} x2={780} y2={400} stroke={tokens.muted} strokeWidth={1.2} markerEnd="url(#arrow)" />
        <line x1={160} y1={400} x2={160} y2={80} stroke={tokens.muted} strokeWidth={1.2} markerEnd="url(#arrow)" />
        <line x1={470} y1={400} x2={470} y2={80} stroke={tokens.rule} strokeWidth={1} strokeDasharray="4 4" />
        <line x1={160} y1={240} x2={780} y2={240} stroke={tokens.rule} strokeWidth={1} strokeDasharray="4 4" />
      </g>

      <g className="reveal-item" style={{ animationDelay: "100ms" }}>
        <text x={470} y={432} fill={tokens.soft} fontSize={9} fontFamily="Geist Mono, ui-monospace, monospace" textAnchor="middle" letterSpacing="0.12em">
          EFFORT →
        </text>
        <text
          x={120}
          y={240}
          fill={tokens.soft}
          fontSize={9}
          fontFamily="Geist Mono, ui-monospace, monospace"
          textAnchor="middle"
          letterSpacing="0.12em"
          transform="rotate(-90 120 240)"
        >
          IMPACT →
        </text>
        <text x={300} y={108} fill={tokens.soft} fontSize={8} fontFamily="Geist Mono, ui-monospace, monospace" textAnchor="middle" letterSpacing="0.1em">
          QUICK WINS
        </text>
        <text x={640} y={108} fill={tokens.accent} fontSize={8} fontFamily="Geist Mono, ui-monospace, monospace" textAnchor="middle" letterSpacing="0.1em">
          BIG BETS
        </text>
        <text x={300} y={388} fill={tokens.soft} fontSize={8} fontFamily="Geist Mono, ui-monospace, monospace" textAnchor="middle" letterSpacing="0.1em">
          FILLERS
        </text>
        <text x={640} y={388} fill={tokens.soft} fontSize={8} fontFamily="Geist Mono, ui-monospace, monospace" textAnchor="middle" letterSpacing="0.1em">
          MONEY PITS
        </text>
      </g>

      {POINTS.map((point, i) => (
        <g key={point.name} className="reveal-item" style={{ animationDelay: `${180 + i * 50}ms` }}>
          <circle
            cx={point.x}
            cy={point.y}
            r={point.focal ? 8 : 6}
            fill={point.focal ? tokens.accent : tokens.paper}
            stroke={point.focal ? tokens.accent : tokens.ink}
            strokeWidth={1.2}
          />
          <text
            x={point.x + 14}
            y={point.y + 4}
            fill={point.focal ? tokens.accent : tokens.ink}
            fontSize={12}
            fontWeight={point.focal ? 600 : 500}
            fontFamily="Geist, system-ui, sans-serif"
          >
            {point.name}
          </text>
        </g>
      ))}
    </SvgShell>
  );
}
