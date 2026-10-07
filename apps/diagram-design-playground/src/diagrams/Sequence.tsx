import { Paper, SvgShell, type DiagramProps } from "./primitives";

const ACTORS = [
  { name: "Client", x: 160 },
  { name: "API", x: 450 },
  { name: "Auth", x: 740 },
] as const;

const MSGS = [
  { from: 160, to: 450, y: 140, label: "POST /session", accent: false },
  { from: 450, to: 740, y: 200, label: "verify credentials", accent: true },
  { from: 740, to: 450, y: 260, label: "token + claims", accent: false, dashed: true },
  { from: 450, to: 160, y: 320, label: "201 session", accent: false, dashed: true },
] as const;

export function Sequence(props: DiagramProps) {
  const { tokens } = props;

  return (
    <SvgShell
      {...props}
      viewBox="0 0 900 420"
      title="Session handshake"
      desc="Sequence diagram of client, API, and auth exchanging a session."
    >
      <Paper tokens={tokens} width={900} height={420} />

      {ACTORS.map((actor, i) => (
        <g key={actor.name} className="reveal-item" style={{ animationDelay: `${40 + i * 40}ms` }}>
          <line
            x1={actor.x}
            y1={88}
            x2={actor.x}
            y2={380}
            stroke={tokens.rule}
            strokeWidth={1}
            strokeDasharray="3 4"
          />
          <rect
            x={actor.x - 56}
            y={36}
            width={112}
            height={44}
            rx={6}
            fill={tokens.paper}
            stroke={tokens.ink}
            strokeWidth={1}
          />
          <text
            x={actor.x}
            y={63}
            fill={tokens.ink}
            fontSize={12}
            fontWeight={600}
            fontFamily="Geist, system-ui, sans-serif"
            textAnchor="middle"
          >
            {actor.name}
          </text>
        </g>
      ))}

      {MSGS.map((msg, i) => {
        const left = Math.min(msg.from, msg.to);
        const right = Math.max(msg.from, msg.to);
        const mid = (msg.from + msg.to) / 2;
        const marker = msg.accent ? "url(#arrow-accent)" : "url(#arrow)";
        return (
          <g key={msg.label} className="reveal-item" style={{ animationDelay: `${180 + i * 70}ms` }}>
            <line
              x1={msg.from}
              y1={msg.y}
              x2={msg.to + (msg.from < msg.to ? -8 : 8)}
              y2={msg.y}
              stroke={msg.accent ? tokens.accent : tokens.muted}
              strokeWidth={msg.accent ? 1.4 : 1.2}
              strokeDasharray={"dashed" in msg && msg.dashed ? "4 3" : undefined}
              markerEnd={marker}
            />
            <rect x={mid - 70} y={msg.y - 18} width={140} height={14} rx={2} fill={tokens.paper} />
            <text
              x={mid}
              y={msg.y - 7}
              fill={msg.accent ? tokens.accent : tokens.soft}
              fontSize={8}
              fontFamily="Geist Mono, ui-monospace, monospace"
              textAnchor="middle"
              letterSpacing="0.04em"
            >
              {msg.label}
            </text>
            <rect x={left} y={msg.y} width={0} height={0} />
            <rect x={right} y={msg.y} width={0} height={0} />
          </g>
        );
      })}
    </SvgShell>
  );
}
