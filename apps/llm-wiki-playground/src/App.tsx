import { useHashRoute } from "./lib/useHashRoute";
import { Sidebar } from "./components/Sidebar";
import { IndexPage } from "./components/IndexPage";
import { TopicPage } from "./components/TopicPage";
import { LinkGraph } from "./components/LinkGraph";
import { AskPanel } from "./components/AskPanel";

export default function App() {
  const [route, navigate] = useHashRoute();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title" onClick={() => navigate({ type: "index" })}>
          🧠 LLM Wiki Playground
        </div>
        <div className="app-subtitle">Karpathy-style agent wiki · mock ask mode</div>
      </header>

      <div className="app-body">
        <Sidebar route={route} onNavigate={navigate} />

        <main className="app-main">
          {route.type === "index" && <IndexPage onNavigate={navigate} />}
          {route.type === "wiki" && <TopicPage slug={route.slug} onNavigate={navigate} />}
          {route.type === "graph" && <LinkGraph onNavigate={navigate} />}
        </main>

        <AskPanel onNavigate={navigate} />
      </div>
    </div>
  );
}
