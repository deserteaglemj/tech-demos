import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getBacklinks, getPage, titleFor } from "../lib/wiki";
import { renderWikiLinks } from "../lib/markdown";
import type { Route } from "../lib/route";

interface TopicPageProps {
  slug: string;
  onNavigate: (route: Route) => void;
}

export function TopicPage({ slug, onNavigate }: TopicPageProps) {
  const page = getPage(slug);

  if (!page) {
    return (
      <div className="page">
        <h1>Page not found</h1>
        <p>There's no wiki page for "{slug}" yet.</p>
        <button className="link-graph-cta" onClick={() => onNavigate({ type: "index" })}>
          ← Back to index
        </button>
      </div>
    );
  }

  const backlinks = getBacklinks(slug);

  return (
    <div className="page">
      <div className="breadcrumb">
        <a href="#/">Index</a> / {page.title}
      </div>
      <h1>{page.title}</h1>
      <p className="lede">{page.summary}</p>

      <div className="markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {renderWikiLinks(page.body)}
        </ReactMarkdown>
      </div>

      <div className="link-panels">
        <div className="link-panel">
          <h3>Links to ({page.links.length})</h3>
          {page.links.length === 0 ? (
            <p className="muted">No outgoing links.</p>
          ) : (
            <ul>
              {page.links.map((target) => (
                <li key={target}>
                  <button className="inline-link" onClick={() => onNavigate({ type: "wiki", slug: target })}>
                    {titleFor(target)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="link-panel">
          <h3>Linked from ({backlinks.length})</h3>
          {backlinks.length === 0 ? (
            <p className="muted">No pages link here yet.</p>
          ) : (
            <ul>
              {backlinks.map((source) => (
                <li key={source}>
                  <button className="inline-link" onClick={() => onNavigate({ type: "wiki", slug: source })}>
                    {titleFor(source)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
