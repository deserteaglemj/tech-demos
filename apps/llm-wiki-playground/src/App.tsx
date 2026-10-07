import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useHashRoute } from "./lib/useHashRoute";
import { routeToHash, type Route } from "./lib/route";
import { getPage } from "./lib/wiki";
import { isLlmConfigured } from "./lib/llm";
import { Sidebar } from "./components/Sidebar";
import { IndexPage } from "./components/IndexPage";
import { TopicPage } from "./components/TopicPage";
import { LinkGraph } from "./components/LinkGraph";
import { AskPanel, ASK_HEADING_ID, ASK_PANEL_ID } from "./components/AskPanel";
import { InstallButton } from "./components/InstallButton";
import { GraphIcon, SearchIcon } from "./components/Icons";
import { prefersReducedMotion } from "./components/helpers";

const APP_NAME = "LLM Wiki Playground";

function routeTitle(route: Route): string {
  if (route.type === "graph") return "Link graph";
  if (route.type === "wiki") return getPage(route.slug)?.title ?? "Page not found";
  return "Index";
}

export default function App() {
  const [route, navigate] = useHashRoute();
  const [announcement, setAnnouncement] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const routeKey = routeToHash(route);
  const lastRouteKey = useRef(routeKey);

  useEffect(() => {
    const title = routeTitle(route);
    document.title = route.type === "index" ? APP_NAME : `${title} · ${APP_NAME}`;
    if (lastRouteKey.current === routeKey) return;
    lastRouteKey.current = routeKey;

    const main = mainRef.current;
    if (!main) return;
    main.scrollTop = 0;
    // Stacked layout: a link clicked further down the page (e.g. in an answer) must bring the new page into view.
    const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
    if (main.getBoundingClientRect().top < headerBottom - 1) main.scrollIntoView({ block: "start" });

    // Navigating from inside the page (or losing focus) starts the reader at the new heading;
    // from the sidebar or Ask panel focus stays put and the change is announced instead.
    const active = document.activeElement;
    if (!active || active === document.body || main.contains(active)) {
      main.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
    } else {
      setAnnouncement(title);
    }
  }, [routeKey]);

  const skipToMain = (event: MouseEvent) => {
    event.preventDefault();
    mainRef.current?.focus();
  };

  const jumpToAsk = () => {
    const panel = document.getElementById(ASK_PANEL_ID);
    if (!panel) return;
    panel.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    document.getElementById(ASK_HEADING_ID)?.focus({ preventScroll: true });
  };

  return (
    <div className="app-shell">
      {/* Hash links are routes here, so the skip link moves focus itself instead of changing the hash. */}
      <a className="skip-link" href="#main-content" onClick={skipToMain}>
        Skip to main content
      </a>

      <header className="app-header" ref={headerRef}>
        <div className="app-brand">
          <button type="button" className="app-title" onClick={() => navigate({ type: "index" })}>
            <span className="app-mark" aria-hidden="true">
              <GraphIcon />
            </span>
            <span className="app-title-text">
              LLM Wiki<span className="app-title-tail"> Playground</span>
            </span>
          </button>
          <p className="app-subtitle">
            Karpathy-style agent wiki · {isLlmConfigured() ? "LLM ask mode" : "mock ask mode"}
          </p>
        </div>
        <div className="app-header-actions">
          <InstallButton />
          <button type="button" className="header-button ask-jump" onClick={jumpToAsk}>
            <SearchIcon />
            <span className="header-button-label">Ask</span>
          </button>
        </div>
      </header>

      <div className="app-body">
        <Sidebar route={route} onNavigate={navigate} />

        <main id="main-content" className="app-main" ref={mainRef} tabIndex={-1}>
          {route.type === "index" && <IndexPage onNavigate={navigate} />}
          {route.type === "wiki" && <TopicPage key={route.slug} slug={route.slug} onNavigate={navigate} />}
          {route.type === "graph" && <LinkGraph onNavigate={navigate} />}
        </main>

        <AskPanel onNavigate={navigate} />
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
