import { ArrowLabel, NodeBox, Paper, SvgShell, type DiagramProps } from "./primitives";

export function Architecture(props: DiagramProps) {
  const { tokens } = props;

  return (
    <SvgShell
      {...props}
      viewBox="0 0 1000 420"
      title="Content site in production"
      desc="Reader requests move through Cloudflare to an Astro origin, then to MDX and CMS."
    >
      <Paper tokens={tokens} width={1000} height={420} />

      <g className="reveal-item" style={{ animationDelay: "40ms" }}>
        <rect
          x={616}
          y={100}
          width={164}
          height={240}
          rx={8}
          fill={tokens.ink}
          fillOpacity={0.02}
          stroke={tokens.rule}
          strokeWidth={0.8}
        />
        <rect x={672} y={104} width={52} height={12} rx={2} fill={tokens.paper} />
        <text
          x={698}
          y={113}
          fill={tokens.soft}
          fontSize={7}
          fontFamily="Geist Mono, ui-monospace, monospace"
          textAnchor="middle"
          letterSpacing="0.14em"
        >
          CONTENT
        </text>
      </g>

      <g className="reveal-item" style={{ animationDelay: "80ms" }}>
        <line
          x1={168}
          y1={240}
          x2={220}
          y2={240}
          stroke={tokens.link}
          strokeWidth={1.2}
          markerEnd="url(#arrow-link)"
        />
        <line
          x1={364}
          y1={240}
          x2={416}
          y2={240}
          stroke={tokens.accent}
          strokeWidth={1.4}
          markerEnd="url(#arrow-accent)"
        />
        <path
          d="M 576,228 H 692 Q 700,228 700,220 V 196"
          fill="none"
          stroke={tokens.muted}
          strokeWidth={1.2}
          markerEnd="url(#arrow)"
        />
        <path
          d="M 576,252 H 692 Q 700,252 700,260 V 284"
          fill="none"
          stroke={tokens.muted}
          strokeWidth={1.2}
          markerEnd="url(#arrow)"
        />
        <path
          d="M 220,256 H 168"
          fill="none"
          stroke={tokens.muted}
          strokeWidth={1}
          strokeDasharray="4 3"
          markerEnd="url(#arrow)"
        />
      </g>

      <ArrowLabel tokens={tokens} x={172} y={220} w={48} label="HTTPS" color={tokens.link} delay={120} />
      <ArrowLabel tokens={tokens} x={172} y={262} w={32} label="RESP" delay={140} />
      <ArrowLabel tokens={tokens} x={368} y={220} w={40} label="SSR" color={tokens.accent} delay={160} />
      <ArrowLabel tokens={tokens} x={632} y={208} w={60} label="READ MDX" delay={180} />
      <ArrowLabel tokens={tokens} x={632} y={264} w={44} label="QUERY" delay={200} />

      <NodeBox tokens={tokens} x={40} y={208} w={128} h={64} name="Reader" sub="Browser" tag="EXT" delay={220} />
      <NodeBox tokens={tokens} x={220} y={208} w={144} h={64} name="Cloudflare" sub="Edge cache" tag="CDN" delay={260} />
      <NodeBox
        tokens={tokens}
        x={416}
        y={208}
        w={160}
        h={64}
        name="Astro"
        sub="SSR origin"
        tag="APP"
        focal
        delay={300}
      />
      <NodeBox tokens={tokens} x={632} y={132} w={132} h={64} name="MDX bundle" sub="Checked in" delay={340} />
      <NodeBox tokens={tokens} x={632} y={284} w={132} h={64} name="CMS" sub="Content API" delay={380} />
    </SvgShell>
  );
}
