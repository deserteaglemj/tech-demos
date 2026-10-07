import { startTransition, useRef, useState } from "react";
import { DiagramStage } from "./components/DiagramStage";
import { TokenPanel } from "./components/TokenPanel";
import { TypeNav } from "./components/TypeNav";
import { VariantTabs } from "./components/VariantTabs";
import { buildExportHtml } from "./lib/exportHtml";
import {
  VARIANT_PRESETS,
  type BrandTokens,
  type Variant,
} from "./lib/tokens";
import { DIAGRAMS, type DiagramId } from "./lib/types";

export default function App() {
  const [diagramId, setDiagramId] = useState<DiagramId>("architecture");
  const [variant, setVariant] = useState<Variant>("light");
  const [tokens, setTokens] = useState<BrandTokens>(VARIANT_PRESETS.light);
  const [reveal, setReveal] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const stageRef = useRef<HTMLDivElement>(null);

  const meta = DIAGRAMS.find((d) => d.id === diagramId) ?? DIAGRAMS[0];

  function handleVariant(next: Variant) {
    startTransition(() => {
      setVariant(next);
      setTokens(VARIANT_PRESETS[next]);
    });
  }

  function handleType(next: DiagramId) {
    startTransition(() => setDiagramId(next));
  }

  async function handleCopy() {
    const svg = stageRef.current?.querySelector("svg");
    if (!svg) {
      setCopyState("error");
      return;
    }
    const html = buildExportHtml({
      meta,
      variant,
      tokens,
      svgMarkup: svg.outerHTML,
    });
    try {
      await navigator.clipboard.writeText(html);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <p className="hero-brand">Diagram Design</p>
        <h1>Editorial diagrams your designer won&apos;t hate.</h1>
        <p className="hero-lede">
          Six typed SVG schematics — no Mermaid slop, no shadows. Switch
          light / dark / full-editorial, retint the brand tokens, copy a
          self-contained HTML file.
        </p>
        <div className="hero-actions">
          <a
            className="btn-primary"
            href="https://github.com/cathrynlavery/diagram-design"
            target="_blank"
            rel="noreferrer noopener"
          >
            Source skill
          </a>
          <a
            className="btn-secondary"
            href="https://diagramdesign.dev"
            target="_blank"
            rel="noreferrer noopener"
          >
            diagramdesign.dev
          </a>
        </div>
      </header>

      <div className="workspace">
        <TypeNav active={diagramId} onChange={handleType} />

        <div className="workspace-main">
          <div className="toolbar">
            <VariantTabs value={variant} onChange={handleVariant} />
          </div>
          <DiagramStage
            meta={meta}
            tokens={tokens}
            variant={variant}
            reveal={reveal}
            stageRef={stageRef}
          />
        </div>

        <TokenPanel
          tokens={tokens}
          onChange={setTokens}
          onReset={() => setTokens(VARIANT_PRESETS[variant])}
          reveal={reveal}
          onRevealChange={setReveal}
          onCopy={handleCopy}
          copyState={copyState}
        />
      </div>

      <footer className="page-footer">
        <p>
          Inspired by{" "}
          <a
            href="https://github.com/cathrynlavery/diagram-design"
            target="_blank"
            rel="noreferrer noopener"
          >
            cathrynlavery/diagram-design
          </a>
          . Philosophy: the highest-quality move is usually deletion. Target
          density 4/10.
        </p>
      </footer>
    </div>
  );
}
