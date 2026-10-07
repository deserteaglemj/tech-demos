import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { formatMockAnswer, retrieve } from "../lib/retrieval";
import { askLlm, isLlmConfigured } from "../lib/llm";
import type { Route } from "../lib/route";

interface AskEntry {
  question: string;
  answer: string;
  mode: "mock" | "llm" | "error";
}

const SAMPLE_QUESTIONS = [
  "What is attention?",
  "How does tokenization work?",
  "Why is RLHF needed?",
];

interface AskPanelProps {
  onNavigate: (route: Route) => void;
}

export function AskPanel({ onNavigate }: AskPanelProps) {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<AskEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const llmConfigured = isLlmConfigured();

  async function handleAsk(q: string) {
    const trimmed = q.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setQuestion("");

    const result = retrieve(trimmed);

    if (llmConfigured) {
      try {
        const answer = await askLlm(trimmed, result);
        setHistory((h) => [{ question: trimmed, answer, mode: "llm" }, ...h]);
      } catch (err) {
        const answer =
          `LLM request failed, falling back to mock mode.\n\n` +
          formatMockAnswer(trimmed, result) +
          `\n\n_(${(err as Error).message})_`;
        setHistory((h) => [{ question: trimmed, answer, mode: "error" }, ...h]);
      }
    } else {
      const answer = formatMockAnswer(trimmed, result);
      setHistory((h) => [{ question: trimmed, answer, mode: "mock" }, ...h]);
    }
    setLoading(false);
  }

  return (
    <aside className="ask-panel" aria-label="Ask the wiki">
      <div className="ask-panel-header">
        <h2>🔎 Ask the wiki</h2>
        <span className={`mode-badge ${llmConfigured ? "mode-llm" : "mode-mock"}`}>
          {llmConfigured ? "LLM mode" : "Mock mode · no API key"}
        </span>
      </div>
      <p className="ask-panel-hint">
        Answers are grounded in the seeded wiki pages — no external calls
        unless you set <code>VITE_OPENAI_API_KEY</code>.
      </p>

      <form
        className="ask-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(question);
        }}
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about attention, tokenization, RLHF…"
          aria-label="Question for the wiki"
        />
        <button type="submit" disabled={loading || question.trim().length === 0}>
          {loading ? "Thinking…" : "Ask"}
        </button>
      </form>

      <div className="sample-questions">
        {SAMPLE_QUESTIONS.map((sq) => (
          <button key={sq} className="chip" onClick={() => handleAsk(sq)} disabled={loading}>
            {sq}
          </button>
        ))}
      </div>

      <div className="ask-history">
        {history.length === 0 && (
          <p className="muted">Ask a question above to see a grounded answer.</p>
        )}
        {history.map((entry, i) => (
          <div key={i} className="ask-entry">
            <div className="ask-question">Q: {entry.question}</div>
            <div className={`ask-answer ask-answer-${entry.mode}`}>
              <ReactMarkdown
                components={{
                  a: (props) => (
                    <a
                      {...props}
                      onClick={(e) => {
                        const href = props.href ?? "";
                        if (href.startsWith("#/wiki/")) {
                          e.preventDefault();
                          onNavigate({ type: "wiki", slug: href.replace("#/wiki/", "") });
                        }
                      }}
                    />
                  ),
                }}
              >
                {entry.answer}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
