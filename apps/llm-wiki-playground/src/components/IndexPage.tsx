import { wikiIndex } from "../lib/wiki";
import type { Route } from "../lib/route";

interface IndexPageProps {
  onNavigate: (route: Route) => void;
}

export function IndexPage({ onNavigate }: IndexPageProps) {
  return (
    <div className="page">
      <h1 tabIndex={-1}>LLM Wiki</h1>
      <p className="lede">
        A tiny Karpathy-style wiki of interlinked notes on how large language
        models work. Browse a topic, follow the <code>[[links]]</code> between
        pages, see the whole thing as a graph, or ask the wiki a question in the
        Ask panel — no API key required.
      </p>

      <h2>Topics ({wikiIndex.order.length})</h2>
      <div className="card-grid">
        {wikiIndex.order.map((slug) => {
          const page = wikiIndex.pages.get(slug)!;
          const backlinkCount = wikiIndex.backlinks.get(slug)?.length ?? 0;
          return (
            <button
              key={slug}
              type="button"
              className="card"
              onClick={() => onNavigate({ type: "wiki", slug })}
            >
              <span className="card-title">{page.title}</span>
              <span className="card-summary">{page.summary}</span>
              <span className="card-meta">
                {page.links.length} outgoing · {backlinkCount} incoming
              </span>
            </button>
          );
        })}
      </div>

      <button type="button" className="link-graph-cta" onClick={() => onNavigate({ type: "graph" })}>
        View the full link graph <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
