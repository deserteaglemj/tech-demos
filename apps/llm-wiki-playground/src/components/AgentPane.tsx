import { useEffect, useState } from "react";
import { askLlm, isLlmConfigured } from "../lib/llm";
import { formatMockAnswer, retrieve, type RetrievalResult } from "../lib/retrieval";
import { prefersReducedMotion } from "./helpers";
import { MarkdownView } from "./MarkdownView";
import type { Route } from "../lib/route";

const QUESTIONS = [
  "Who is about to churn?",
  "Are we undercharging?",
  "Who should we pass on?",
  "What happened Tuesday?",
];

type Phase = "idle" | "grep" | "wiki" | "answer";

interface AgentPaneProps {
  onNavigate: (route: Route) => void;
  onOpenSource: (path: string) => void;
}

export function AgentPane({ onNavigate, onOpenSource }: AgentPaneProps) {
  const [question, setQuestion] = useState("");
  const [asked, setAsked] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<RetrievalResult | null>(null);
  const [llmAnswer, setLlmAnswer] = useState<string | null>(null);
  const llm = isLlmConfigured();

  useEffect(() => {
    if (phase !== "grep" && phase !== "wiki") return;
    const delay = prefersReducedMotion() ? 0 : 650;
    const id = window.setTimeout(() => setPhase(phase === "grep" ? "wiki" : "answer"), delay);
    return () => window.clearTimeout(id);
  }, [phase]);

  async function handleAsk(next: string) {
    const trimmed = next.trim();
    if (!trimmed) return;
    const found = retrieve(trimmed);
    setAsked(trimmed);
    setQuestion("");
    setResult(found);
    setLlmAnswer(null);
    setPhase("grep");
    if (llm && found.matched) {
      try {
        const answer = await askLlm(trimmed, found);
        setLlmAnswer(answer);
      } catch (error) {
        setLlmAnswer(`LLM request failed. Showing the local wiki answer.\n\n${(error as Error).message}`);
      }
    }
  }

  const showGrep = phase === "grep" || phase === "wiki" || phase === "answer";
  const showWiki = phase === "wiki" || phase === "answer";
  const showAnswer = phase === "answer" && result;

  return (
    <section className="window window-agent" aria-label="Agent">
      <header className="window-bar">
        <span className="window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <h2>agent</h2>
        <span className={`mode-badge ${llm ? "mode-llm" : "mode-mock"}`}>
          {llm ? "LLM" : "local concept index"}
        </span>
      </header>
      <div className="window-body agent-body">
        <p className="lede">
          Ask in your own words. The agent searches the wiki’s concept index, not the raw folder. Grep is shown beside it so you can see what the files themselves miss.
        </p>
        <form
          className="ask-form"
          onSubmit={(event) => {
            event.preventDefault();
            void handleAsk(question);
          }}
        >
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Who is about to churn?"
            aria-label="Question for the agent"
          />
          <button type="submit" disabled={question.trim().length === 0}>
            Ask
          </button>
        </form>
        <div className="chip-row">
          {QUESTIONS.map((sample) => (
            <button key={sample} type="button" className="chip" onClick={() => void handleAsk(sample)}>
              {sample}
            </button>
          ))}
        </div>

        {asked && (
          <p className="asked-line">
            <span>You</span> {asked}
          </p>
        )}

        {showGrep && result && (
          <div className="trace">
            <h3>grep ~/sources</h3>
            <ul className="grep-list">
              {result.grep.map((entry) => (
                <li key={entry.token}>
                  <code>{entry.token}</code>
                  {entry.hits.length === 0 ? (
                    <span className="miss">no file contains this</span>
                  ) : (
                    <span className="hit">
                      {entry.hits.length} file{entry.hits.length === 1 ? "" : "s"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {showWiki && result && (
          <div className="trace">
            <h3>wiki concept index</h3>
            {!result.matched && <p className="muted">No compiled page claims this.</p>}
            <ul className="hit-list">
              {result.sources.map((source) => (
                <li key={source.slug}>
                  <button type="button" className="hit-title" onClick={() => onNavigate({ type: "wiki", slug: source.slug })}>
                    {source.title}
                    <span>{Math.round(source.score * 100)}</span>
                  </button>
                  <p>{source.evidence}</p>
                  <div className="chip-row">
                    {source.sourcePaths.map((path) => (
                      <button key={path} type="button" className="chip" onClick={() => onOpenSource(path)}>
                        {path}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showAnswer && result && (
          <div className="trace answer-trace">
            <h3>{llmAnswer ? "Model, using those pages" : "Answer from the wiki"}</h3>
            <MarkdownView
              source={llmAnswer ?? formatMockAnswer(asked, result)}
              onNavigate={onNavigate}
            />
          </div>
        )}
      </div>
    </section>
  );
}
