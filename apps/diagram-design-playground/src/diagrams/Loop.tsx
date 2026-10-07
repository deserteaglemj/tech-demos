import { Paper, SvgShell, type DiagramProps } from "./primitives";

const STATIONS = [
  { name: "Capture", sub: "signals in / intake", x: 440, y: 48 },
  { name: "Research", sub: "evidence pulled", x: 648, y: 168 },
  { name: "Decide", sub: "human approval", x: 648, y: 348, focal: true },
  { name: "Ship", sub: "change goes live", x: 440, y: 468 },
  { name: "Measure", sub: "outcomes logged", x: 232, y: 348 },
  { name: "Learn", sub: "patterns stored", x: 232, y: 168 },
] as const;

export function Loop(props: DiagramProps) {
  const { tokens } = props;

  return (
    <SvgShell
      {...props}
      viewBox="0 0 1040 600"
      title="The self-improving loop"
      desc="Six stations flow clockwise into a shared memory hub, with Decide highlighted."
    >
      <Paper tokens={tokens} width={1040} height={600} />

      <g className="reveal-item" style={{ animationDelay: "40ms" }}>
        <path d="M600 93.7 A240 240 0 0 1 705 167" fill="none" stroke={tokens.muted} strokeWidth={1.2} markerEnd="url(#arrow)" />
        <path d="M743 232 A240 240 0 0 1 744 407" fill="none" stroke={tokens.muted} strokeWidth={1.2} markerEnd="url(#arrow)" />
        <path d="M706 472 A240 240 0 0 1 601 546" fill="none" stroke={tokens.muted} strokeWidth={1.2} markerEnd="url(#arrow)" />
        <path d="M440 546 A240 240 0 0 1 335 473" fill="none" stroke={tokens.muted} strokeWidth={1.2} markerEnd="url(#arrow)" />
        <path d="M297 408 A240 240 0 0 1 296 233" fill="none" stroke={tokens.muted} strokeWidth={1.2} markerEnd="url(#arrow)" />
        <path d="M334 168 A240 240 0 0 1 439 94" fill="none" stroke={tokens.muted} strokeWidth={1.2} markerEnd="url(#arrow)" />
      </g>

      <g className="reveal-item" style={{ animationDelay: "120ms" }}>
        <path d="M520 112 V260" fill="none" stroke={tokens.soft} strokeWidth={1} strokeDasharray="5 4" markerEnd="url(#arrow-soft)" />
        <path d="M672 232 L616 264" fill="none" stroke={tokens.soft} strokeWidth={1} strokeDasharray="5 4" markerEnd="url(#arrow-soft)" />
        <path d="M672 408 L616 376" fill="none" stroke={tokens.soft} strokeWidth={1} strokeDasharray="5 4" markerEnd="url(#arrow-soft)" />
        <path d="M520 528 V380" fill="none" stroke={tokens.soft} strokeWidth={1} strokeDasharray="5 4" markerEnd="url(#arrow-soft)" />
        <path d="M368 408 L424 376" fill="none" stroke={tokens.soft} strokeWidth={1} strokeDasharray="5 4" markerEnd="url(#arrow-soft)" />
        <path d="M368 232 L424 264" fill="none" stroke={tokens.soft} strokeWidth={1} strokeDasharray="5 4" markerEnd="url(#arrow-soft)" />
      </g>

      <g className="reveal-item" style={{ animationDelay: "180ms" }}>
        <rect x={532} y={180} width={48} height={16} rx={4} fill={tokens.paper} />
        <text x={556} y={192} fill={tokens.soft} fontSize={8} fontFamily="Geist Mono, ui-monospace, monospace" textAnchor="middle" letterSpacing="0.06em">
          SIGNALS
        </text>
        <rect x={460} y={444} width={52} height={16} rx={4} fill={tokens.paper} />
        <text x={486} y={456} fill={tokens.soft} fontSize={8} fontFamily="Geist Mono, ui-monospace, monospace" textAnchor="middle" letterSpacing="0.06em">
          OUTCOMES
        </text>
      </g>

      {STATIONS.map((station, i) => {
        const focal = "focal" in station && station.focal;
        return (
          <g
            key={station.name}
            className="reveal-item"
            style={{ animationDelay: `${220 + i * 50}ms` }}
          >
            <rect
              x={station.x}
              y={station.y}
              width={160}
              height={64}
              rx={6}
              fill={focal ? tokens.accentTint : tokens.paper}
              stroke={focal ? tokens.accent : tokens.ink}
              strokeWidth={focal ? 1.2 : 1}
            />
            <text
              x={station.x + 80}
              y={station.y + 28}
              fill={focal ? tokens.accent : tokens.ink}
              fontSize={12}
              fontWeight={600}
              fontFamily="Geist, system-ui, sans-serif"
              textAnchor="middle"
            >
              {station.name}
            </text>
            <text
              x={station.x + 80}
              y={station.y + 46}
              fill={tokens.soft}
              fontSize={8}
              fontFamily="Geist Mono, ui-monospace, monospace"
              textAnchor="middle"
            >
              {station.sub}
            </text>
          </g>
        );
      })}

      <g className="reveal-item" style={{ animationDelay: "520ms" }}>
        <circle cx={520} cy={300} r={56} fill={tokens.ink} />
        <text
          x={520}
          y={296}
          fill={tokens.paper}
          fontSize={16}
          fontWeight={600}
          fontFamily="Geist, system-ui, sans-serif"
          textAnchor="middle"
        >
          Memory
        </text>
        <text
          x={520}
          y={316}
          fill={tokens.paper}
          fillOpacity={0.72}
          fontSize={8}
          fontFamily="Geist Mono, ui-monospace, monospace"
          textAnchor="middle"
        >
          shared state
        </text>
      </g>
    </SvgShell>
  );
}
