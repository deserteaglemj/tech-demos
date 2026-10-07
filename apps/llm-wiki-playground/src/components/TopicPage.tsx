import { getBacklinks, getPage, titleFor } from "../lib/wiki";
import { renderWikiLinks } from "../lib/markdown";
import type { Route } from "../lib/route";
import { MarkdownView } from "./MarkdownView";

interface TopicPageProps {
  slug: string;
  onNavigate: (route: Route) => void;
}

interface LinkPanelProps {
  title: string;
  slugs: string[];
  emptyText: string;
  onNavigate: (route: Route) => void;
}

function LinkPanel({ title, slugs, emptyText, onNavigate }: LinkPanelProps) {
  return (
    <section className="link-panel">
      <h2 className="link-panel-title">
        {title} ({slugs.length})
      </h2>
      {slugs.length === 0 ? (
        <p className="muted">{emptyText}</p>
      ) : (
        <ul>
          {slugs.map((target) => (
            <li key={target}>
              <button
                type="button"
                className="inline-link"
                onClick={() => onNavigate({ type: "wiki", slug: target })}
              >
                {titleFor(target)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function TopicPage({ slug, onNavigate }: TopicPageProps) {
  const page = getPage(slug);

  if (!page) {
    return (
      <div className="page">
        <h1 tabIndex={-1}>Page not found</h1>
        <p className="lede">There's no wiki page for "{slug}" yet.</p>
        <button type="button" className="link-graph-cta" onClick={() => onNavigate({ type: "index" })}>
          <span aria-hidden="true">←</span> Back to index
        </button>
      </div>
    );
  }

  return (
    <article className="page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="#/">Index</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{page.title}</span>
      </nav>
      <h1 tabIndex={-1}>{page.title}</h1>
      <p className="lede">{page.summary}</p>

      <MarkdownView className="markdown-body" source={renderWikiLinks(page.body)} onNavigate={onNavigate} />

      <div className="link-panels">
        <LinkPanel title="Links to" slugs={page.links} emptyText="No outgoing links." onNavigate={onNavigate} />
        <LinkPanel
          title="Linked from"
          slugs={getBacklinks(slug)}
          emptyText="No pages link here yet."
          onNavigate={onNavigate}
        />
      </div>
    </article>
  );
}
