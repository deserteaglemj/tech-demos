import { useState } from "react";
import type { AgentPathResult } from "../lib/api";
import { formatBytes, formatTokens } from "../lib/api";

type Props = {
  path: AgentPathResult;
  reveal: number;
};

export function AgentTranscript({ path, reveal }: Props) {
  const [expanded, setExpanded] = useState(false);
  const turns = path.transcript.slice(0, reveal);

  return (
    <article className={`session session-${path.mode}`}>
      <header className="session-head">
        <h2>{path.label}</h2>
        <span className="session-tokens">
          {formatTokens(path.contextTokens)} tok · {formatBytes(path.contextBytes)}
        </span>
      </header>
      <div className="transcript">
        {turns.map((turn, i) => {
          if (turn.role === "user") {
            return (
              <div key={i} className="bubble user">
                <span className="who">You</span>
                <p>{turn.text}</p>
              </div>
            );
          }
          if (turn.role === "assistant") {
            return (
              <div key={i} className="bubble assistant">
                <span className="who">Agent</span>
                <p>{turn.text}</p>
              </div>
            );
          }
          const preview =
            expanded || turn.result.length < 900
              ? turn.result
              : `${turn.result.slice(0, 900)}\n\n… ${turn.result.length - 900} more chars dumped into context`;
          return (
            <div key={i} className="bubble tool">
              <span className="who">
                Tool · {turn.name}
                <em>
                  +{formatTokens(turn.tokens)} tokens into context
                </em>
              </span>
              <p className="tool-detail">{turn.detail}</p>
              <pre>{preview}</pre>
              {turn.result.length >= 900 ? (
                <button type="button" className="linkish" onClick={() => setExpanded((v) => !v)}>
                  {expanded ? "Collapse tool result" : "Expand full tool result"}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </article>
  );
}
