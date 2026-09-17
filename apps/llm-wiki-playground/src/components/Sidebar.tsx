import { wikiIndex } from "../lib/wiki";
import type { Route } from "../lib/route";

interface SidebarProps {
  route: Route;
  onNavigate: (route: Route) => void;
}

export function Sidebar({ route, onNavigate }: SidebarProps) {
  return (
    <nav className="sidebar" aria-label="Wiki navigation">
      <button
        className={`sidebar-item sidebar-index ${route.type === "index" ? "active" : ""}`}
        onClick={() => onNavigate({ type: "index" })}
      >
        📚 Index
      </button>
      <button
        className={`sidebar-item sidebar-graph ${route.type === "graph" ? "active" : ""}`}
        onClick={() => onNavigate({ type: "graph" })}
      >
        🕸️ Link graph
      </button>

      <div className="sidebar-heading">Topics</div>
      <ul className="sidebar-list">
        {wikiIndex.order.map((slug) => {
          const page = wikiIndex.pages.get(slug)!;
          const active = route.type === "wiki" && route.slug === slug;
          return (
            <li key={slug}>
              <button
                className={`sidebar-item ${active ? "active" : ""}`}
                onClick={() => onNavigate({ type: "wiki", slug })}
              >
                {page.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
