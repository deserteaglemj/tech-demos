import { useEffect, useRef, useState } from "react";
import { formatMockAnswer, retrieve } from "../lib/retrieval";
import { askLlm, isLlmConfigured } from "../lib/llm";
import type { Route } from "../lib/route";
import { MarkdownView } from "./MarkdownView";
import { SearchIcon } from "./Icons";
import { prefersReducedMotion } from "./helpers";

export const ASK_PANEL_ID = "ask-panel";
export const ASK_HEADING_ID = "ask-panel-title";

interface AskEntry {
  id: number;
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
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const nextId = useRef(0);
  const listRef = useRef<HTMLOListElement>(null);
  const loading = pendingQuestion !== null;
  const llmConfigured = isLlmConfigured();

  // Newest entries render first; bring each one into view (the answer list on desktop,
  // the page on mobile, where the panel sits at the bottom of the document).
  useEffect(() => {
    listRef.current?.firstElementChild?.scrollIntoView({
      block: "nearest",
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [history.length, pendingQuestion]);

  function addEntry(entry: Omit<AskEntry, "id">) {
    const id = nextId.current++;
    setHistory((h) => [{ ...entry, id }, ...h]);
  }

  async function handleAsk(q: string) {
    const trimmed = q.trim();
    if (!trimmed || loading) return;
    setPendingQuestion(trimmed);
    setQuestion("");

    const result = retrieve(trimmed);

    if (llmConfigured) {
      try {
        const answer = await askLlm(trimmed, result);
        addEntry({ question: trimmed, answer, mode: "llm" });
      } catch (err) {
        const answer =
          `LLM request failed, falling back to mock mode.\n\n` +
          formatMockAnswer(trimmed, result) +
          `\n\n_(${(err as Error).message})_`;
        addEntry({ question: trimmed, answer, mode: "error" });
      }
    } else {
      const answer = formatMockAnswer(trimmed, result);
      addEntry({ question: trimmed, answer, mode: "mock" });
    }
    setPendingQuestion(null);
  }

  return (
    <aside id={ASK_PANEL_ID} className="ask-panel" aria-labelledby={ASK_HEADING_ID}>
      <div className="ask-panel-header">
        <h2 id={ASK_HEADING_ID} tabIndex={-1}>
          <SearchIcon />
          Ask the wiki
        </h2>
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
          autoComplete="off"
          enterKeyHint="send"
        />
        <button className="ask-submit" type="submit" disabled={loading || question.trim().length === 0}>
          {loading ? "Thinking…" : "Ask"}
        </button>
      </form>

      <div className="sample-questions" role="group" aria-label="Sample questions">
        {SAMPLE_QUESTIONS.map((sq) => (
          <button key={sq} type="button" className="chip" onClick={() => handleAsk(sq)} disabled={loading}>
            {sq}
          </button>
        ))}
      </div>

      <div className="ask-history">
        {history.length === 0 && !loading && (
          <p className="ask-empty">Ask a question above to see a grounded answer.</p>
        )}
        <ol className="ask-list" ref={listRef} aria-label="Answers" aria-live="polite">
          {pendingQuestion !== null && (
            <li className="ask-entry is-pending" aria-busy="true">
              <p className="ask-question">Q: {pendingQuestion}</p>
              <p className="ask-pending">Searching the wiki…</p>
            </li>
          )}
          {history.map((entry) => (
            <li key={entry.id} className="ask-entry">
              <p className="ask-question">Q: {entry.question}</p>
              <MarkdownView
                className={`ask-answer ask-answer-${entry.mode}`}
                source={entry.answer}
                onNavigate={onNavigate}
                headingOffset={2}
              />
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
