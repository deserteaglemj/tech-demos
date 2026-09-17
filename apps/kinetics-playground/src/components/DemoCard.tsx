import { useState, type ReactNode } from "react";
import { useSpringConfig } from "../lib/SpringContext";
import { CodeSnippet } from "./CodeSnippet";

interface DemoCardProps {
  title: string;
  description: string;
  children: ReactNode;
  snippet: { css: string; react: string; prompt?: string };
}

export function DemoCard({ title, description, children, snippet }: DemoCardProps) {
  const { config } = useSpringConfig();
  const [showCode, setShowCode] = useState(false);

  return (
    <article className="demo-card">
      <header className="demo-card-header">
        <span className="demo-card-spring">
          spring({config.stiffness}, {config.damping})
        </span>
        <h3>{title}</h3>
        <p>{description}</p>
      </header>

      <div className="demo-card-stage">{children}</div>

      <button className="demo-card-toggle" onClick={() => setShowCode((s) => !s)} aria-expanded={showCode}>
        <span>{"</>"}</span> {showCode ? "Hide code" : "View code"}
      </button>

      {showCode && <CodeSnippet {...snippet} />}
    </article>
  );
}
