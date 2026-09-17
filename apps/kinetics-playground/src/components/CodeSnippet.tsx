import { useState } from "react";
import { copyToClipboard } from "../lib/clipboard";
import { highlight } from "../lib/highlight";

interface CodeSnippetProps {
  css: string;
  react: string;
  prompt?: string;
}

type Tab = "css" | "react" | "prompt";

export function CodeSnippet({ css, react, prompt }: CodeSnippetProps) {
  const [tab, setTab] = useState<Tab>("react");
  const [copied, setCopied] = useState(false);

  const code = tab === "css" ? css : tab === "react" ? react : prompt ?? "";

  async function handleCopy() {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  }

  return (
    <div className="snippet">
      <div className="snippet-tabs">
        <button className={tab === "react" ? "snippet-tab active" : "snippet-tab"} onClick={() => setTab("react")}>
          React
        </button>
        <button className={tab === "css" ? "snippet-tab active" : "snippet-tab"} onClick={() => setTab("css")}>
          CSS
        </button>
        {prompt && (
          <button className={tab === "prompt" ? "snippet-tab active" : "snippet-tab"} onClick={() => setTab("prompt")}>
            AI prompt
          </button>
        )}
        <button className="snippet-copy" onClick={handleCopy} aria-label="Copy snippet">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="snippet-code">
        <code>{highlight(code)}</code>
      </pre>
    </div>
  );
}
