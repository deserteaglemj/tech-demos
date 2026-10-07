import { useEffect, useRef, type ReactNode } from "react";
import { wikiIndex } from "../lib/wiki";
import { routeToHash, type Route } from "../lib/route";
import { prefersReducedMotion, shortTitle } from "./helpers";
import { GraphIcon, IndexIcon } from "./Icons";

interface SidebarProps {
  route: Route;
  onNavigate: (route: Route) => void;
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon?: ReactNode;
  label: string;
  compactLabel?: string;
}

function NavButton({ active, onClick, icon, label, compactLabel }: NavButtonProps) {
  return (
    <button
      type="button"
      className={`sidebar-item ${active ? "active" : ""}`}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
    >
      {icon}
      {compactLabel && compactLabel !== label ? (
        <>
          <span className="sidebar-label label-full">{label}</span>
          <span className="sidebar-label label-compact">{compactLabel}</span>
        </>
      ) : (
        <span className="sidebar-label">{label}</span>
      )}
    </button>
  );
}

export function Sidebar({ route, onNavigate }: SidebarProps) {
  const navRef = useRef<HTMLElement>(null);
  const routeKey = routeToHash(route);
  const hasScrolled = useRef(false);

  // On narrow screens the sidebar is a horizontal strip; keep the active chip in view.
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !active || nav.scrollWidth <= nav.clientWidth) return;
    const navBox = nav.getBoundingClientRect();
    const itemBox = active.getBoundingClientRect();
    const offset = itemBox.left - navBox.left - (navBox.width - itemBox.width) / 2;
    const smooth = hasScrolled.current && !prefersReducedMotion();
    nav.scrollTo({ left: nav.scrollLeft + offset, behavior: smooth ? "smooth" : "auto" });
    hasScrolled.current = true;
  }, [routeKey]);

  return (
    <nav ref={navRef} className="sidebar" aria-label="Wiki navigation">
      <ul className="sidebar-list sidebar-primary">
        <li>
          <NavButton
            active={route.type === "index"}
            onClick={() => onNavigate({ type: "index" })}
            icon={<IndexIcon />}
            label="Index"
          />
        </li>
        <li>
          <NavButton
            active={route.type === "graph"}
            onClick={() => onNavigate({ type: "graph" })}
            icon={<GraphIcon />}
            label="Link graph"
          />
        </li>
      </ul>

      <div className="sidebar-heading" id="sidebar-topics-heading">
        Topics
      </div>
      <ul className="sidebar-list" aria-labelledby="sidebar-topics-heading">
        {wikiIndex.order.map((slug) => {
          const page = wikiIndex.pages.get(slug)!;
          return (
            <li key={slug}>
              <NavButton
                active={route.type === "wiki" && route.slug === slug}
                onClick={() => onNavigate({ type: "wiki", slug })}
                label={page.title}
                compactLabel={shortTitle(page.title)}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
