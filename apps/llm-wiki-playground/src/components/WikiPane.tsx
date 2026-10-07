import { getBacklinks, getPage, titleFor, wikiIndex } from "../lib/wiki";
import { renderWikiLinks } from "../lib/markdown";
import type { Route } from "../lib/route";
import { LinkGraph } from "./LinkGraph";
import { MarkdownView } from "./MarkdownView";

interface WikiPaneProps {
  route: Route;
  onNavigate: (route: Route) => void;
  onOpenSource: (path: string) => void;
}

export function WikiPane({ route, onNavigate, onOpenSource }: WikiPaneProps) {
  return (
    <section className="window window-wiki" aria-label="Compiled wiki">
      <header className="window-bar">
        <span className="window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <h2>~/wiki</h2>
        <nav className="window-nav" aria-label="Wiki views">
          <button type="button" className={route.type === "index" ? "active" : ""} onClick={() => onNavigate({ type: "index" })}>
            Index
          </button>
          <button type="button" className={route.type === "graph" ? "active" : ""} onClick={() => onNavigate({ type: "graph" })}>
            Graph
          </button>
        </nav>
      </header>
      <div className="window-body wiki-body">
        {route.type === "index" && <WikiIndex onNavigate={onNavigate} />}
        {route.type === "graph" && <LinkGraph onNavigate={onNavigate} />}
        {route.type === "wiki" && (
          <WikiPageView slug={route.slug} onNavigate={onNavigate} onOpenSource={onOpenSource} />
        )}
      </div>
    </section>
  );
}

function WikiIndex({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return (
    <div className="wiki-index">
      <h3 tabIndex={-1}>Compiled pages</h3>
      <p className="lede">
        The agent writes these. They are not copies of the files. Each page is a claim, with links, filed from the raw notes.
      </p>
      <ul className="page-list">
        {wikiIndex.order.map((slug) => {
          const page = wikiIndex.pages.get(slug)!;
          return (
            <li key={slug}>
              <button type="button" className="page-card" onClick={() => onNavigate({ type: "wiki", slug })}>
                <span className="page-card-title">{page.title}</span>
                <span className="page-card-summary">{page.summary}</span>
                <span className="page-card-meta">
                  concept {page.concepts.join(", ") || "—"} · {page.sourcePaths.length} files
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function WikiPageView({
  slug,
  onNavigate,
  onOpenSource,
}: {
  slug: string;
  onNavigate: (route: Route) => void;
  onOpenSource: (path: string) => void;
}) {
  const page = getPage(slug);
  if (!page) {
    return (
      <div className="wiki-page">
        <h3>Page not filed</h3>
        <p>Nothing in the wiki is named {slug}.</p>
      </div>
    );
  }
  const backlinks = getBacklinks(slug);
  return (
    <article className="wiki-page">
      <p className="path-label">wiki/{page.slug}.md</p>
      <h3 tabIndex={-1}>{page.title}</h3>
      <p className="lede">{page.summary}</p>
      <MarkdownView className="markdown-body" source={renderWikiLinks(page.body)} onNavigate={onNavigate} />
      <div className="link-panels">
        <div>
          <h4>Compiled from</h4>
          <ul>
            {page.sourcePaths.map((path) => (
              <li key={path}>
                <button type="button" className="inline-link" onClick={() => onOpenSource(path)}>
                  {path}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Linked from</h4>
          <ul>
            {backlinks.length === 0 ? (
              <li className="muted">No other page points here.</li>
            ) : (
              backlinks.map((source) => (
                <li key={source}>
                  <button type="button" className="inline-link" onClick={() => onNavigate({ type: "wiki", slug: source })}>
                    {titleFor(source)}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </article>
  );
}
