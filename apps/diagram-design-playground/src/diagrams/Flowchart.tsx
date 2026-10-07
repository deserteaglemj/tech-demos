import { ArrowLabel, Paper, SvgShell, type DiagramProps } from "./primitives";

export function Flowchart(props: DiagramProps) {
  const { tokens } = props;

  return (
    <SvgShell
      {...props}
      viewBox="0 0 900 480"
      title="Publish or hold?"
      desc="Flowchart from draft ready through quality gate to publish or revise."
    >
      <Paper tokens={tokens} width={900} height={480} />

      <g className="reveal-item" style={{ animationDelay: "40ms" }}>
        <line x1={450} y1={88} x2={450} y2={120} stroke={tokens.muted} strokeWidth={1.2} markerEnd="url(#arrow)" />
        <line x1={450} y1={232} x2={450} y2={268} stroke={tokens.muted} strokeWidth={1.2} markerEnd="url(#arrow)" />
        <path d="M338 196 H 180 V 300" fill="none" stroke={tokens.muted} strokeWidth={1.2} markerEnd="url(#arrow)" />
        <path d="M562 196 H 720 V 300" fill="none" stroke={tokens.accent} strokeWidth={1.4} markerEnd="url(#arrow-accent)" />
        <path d="M180 364 H 180 V 400 H 450" fill="none" stroke={tokens.soft} strokeWidth={1} strokeDasharray="4 3" markerEnd="url(#arrow-soft)" />
      </g>

      <ArrowLabel tokens={tokens} x={250} y={176} w={40} label="NO" delay={100} />
      <ArrowLabel tokens={tokens} x={610} y={176} w={40} label="YES" color={tokens.accent} delay={120} />

      <g className="reveal-item" style={{ animationDelay: "160ms" }}>
        <rect x={370} y={40} width={160} height={48} rx={6} fill={tokens.paper} stroke={tokens.ink} strokeWidth={1} />
        <text x={450} y={68} fill={tokens.ink} fontSize={12} fontWeight={600} fontFamily="Geist, system-ui, sans-serif" textAnchor="middle">
          Draft ready
        </text>
      </g>

      <g className="reveal-item" style={{ animationDelay: "220ms" }}>
        <polygon
          points="450,120 562,196 450,272 338,196"
          fill={tokens.accentTint}
          stroke={tokens.accent}
          strokeWidth={1.2}
        />
        <text x={450} y={192} fill={tokens.accent} fontSize={12} fontWeight={600} fontFamily="Geist, system-ui, sans-serif" textAnchor="middle">
          Quality gate?
        </text>
        <text x={450} y={210} fill={tokens.soft} fontSize={8} fontFamily="Geist Mono, ui-monospace, monospace" textAnchor="middle">
          one owner
        </text>
      </g>

      <g className="reveal-item" style={{ animationDelay: "280ms" }}>
        <rect x={100} y={300} width={160} height={64} rx={6} fill={tokens.paper} stroke={tokens.soft} strokeWidth={1} />
        <text x={180} y={328} fill={tokens.ink} fontSize={12} fontWeight={600} fontFamily="Geist, system-ui, sans-serif" textAnchor="middle">
          Revise
        </text>
        <text x={180} y={346} fill={tokens.soft} fontSize={9} fontFamily="Geist Mono, ui-monospace, monospace" textAnchor="middle">
          notes → author
        </text>
      </g>

      <g className="reveal-item" style={{ animationDelay: "340ms" }}>
        <rect
          x={640}
          y={300}
          width={160}
          height={64}
          rx={6}
          fill={tokens.accentTint}
          stroke={tokens.accent}
          strokeWidth={1.2}
        />
        <text x={720} y={328} fill={tokens.accent} fontSize={12} fontWeight={600} fontFamily="Geist, system-ui, sans-serif" textAnchor="middle">
          Publish
        </text>
        <text x={720} y={346} fill={tokens.soft} fontSize={9} fontFamily="Geist Mono, ui-monospace, monospace" textAnchor="middle">
          ship + announce
        </text>
      </g>

      <g className="reveal-item" style={{ animationDelay: "400ms" }}>
        <rect x={370} y={400} width={160} height={40} rx={6} fill={tokens.paper} stroke={tokens.soft} strokeWidth={1} />
        <text x={450} y={424} fill={tokens.soft} fontSize={11} fontWeight={500} fontFamily="Geist, system-ui, sans-serif" textAnchor="middle">
          Loop until ready
        </text>
      </g>
    </SvgShell>
  );
}
