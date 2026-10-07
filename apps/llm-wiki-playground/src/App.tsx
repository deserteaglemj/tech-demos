import { useEffect, useState } from "react";
import { filings } from "./lib/wiki";
import { useHashRoute } from "./lib/useHashRoute";
import { AgentPane } from "./components/AgentPane";
import { InstallButton } from "./components/InstallButton";
import { SourcesPane } from "./components/SourcesPane";
import { WikiPane } from "./components/WikiPane";

export default function App() {
  const [route, navigate] = useHashRoute();
  const [sourcePath, setSourcePath] = useState<string | null>("calls/northwind-renewal.md");
  const [replayAt, setReplayAt] = useState<number | null>(null);
  const [clock, setClock] = useState(() => formatClock(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setClock(formatClock(new Date())), 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (replayAt === null) return;
    if (replayAt >= filings.length) {
      setReplayAt(null);
      return;
    }
    const filing = filings[replayAt];
    setSourcePath(filing.sourcePath);
    navigate({ type: "wiki", slug: filing.wikiSlug });
    const id = window.setTimeout(() => setReplayAt(replayAt + 1), 800);
    return () => window.clearTimeout(id);
  }, [replayAt]);

  useEffect(() => {
    const page = route.type === "wiki" ? route.slug : route.type === "graph" ? "graph" : "index";
    document.title = `folio — ${page}`;
  }, [route]);

  const activePath = replayAt !== null && replayAt < filings.length ? filings[replayAt].sourcePath : null;

  return (
    <div className="os">
      <a className="skip-link" href="#wiki-window">
        Skip to wiki
      </a>
      <header className="menu-bar">
        <div className="menu-brand">
          <span className="menu-mark" aria-hidden="true" />
          folio
        </div>
        <p className="menu-caption">LLM wiki · raw files in, compiled pages out</p>
        <div className="menu-actions">
          <InstallButton />
          <time dateTime={new Date().toISOString()}>{clock}</time>
        </div>
      </header>

      <main className="desk">
        <SourcesPane
          selectedPath={sourcePath}
          activePath={activePath}
          replaying={replayAt !== null}
          onSelect={setSourcePath}
          onReplay={() => setReplayAt(0)}
          onOpenWiki={(slug) => navigate({ type: "wiki", slug })}
        />
        <div id="wiki-window">
          <WikiPane
            route={route}
            onNavigate={navigate}
            onOpenSource={setSourcePath}
          />
        </div>
        <AgentPane onNavigate={navigate} onOpenSource={setSourcePath} />
      </main>

      <footer className="status-bar">
        <span>~/sources → ~/wiki</span>
        <span>concept index is local · no API key</span>
      </footer>
    </div>
  );
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
