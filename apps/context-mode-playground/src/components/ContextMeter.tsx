import { formatTokens } from "../lib/api";

const WINDOW = 200_000; // illustrative context window

type Props = {
  label: string;
  tokens: number;
  tone: "hot" | "cool";
  animate?: boolean;
};

export function ContextMeter({ label, tokens, tone, animate }: Props) {
  const pct = Math.min(100, (tokens / WINDOW) * 100);
  const displayPct = Math.max(pct, tokens > 0 ? 0.8 : 0);

  return (
    <div className={`meter-card tone-${tone}`} data-animate={animate ? "true" : "false"}>
      <div className="meter-card-top">
        <span>{label}</span>
        <strong>{formatTokens(tokens)} tokens in context</strong>
      </div>
      <div className="window-track" aria-label={`${label} context fill`}>
        <div
          className="window-fill"
          style={{ width: `${displayPct}%` }}
        />
      </div>
      <div className="meter-card-foot">
        of ~{formatTokens(WINDOW)} window · {pct < 0.1 && tokens > 0 ? "<0.1" : pct.toFixed(2)}% filled
      </div>
    </div>
  );
}
