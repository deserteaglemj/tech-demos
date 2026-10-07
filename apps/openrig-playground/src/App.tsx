import { Comparison } from "./components/Comparison";
import { Findings } from "./components/Findings";
import { StubBoard } from "./components/StubBoard";
import "./App.css";

export default function App() {
  return (
    <div className="page">
      <div className="atmosphere" aria-hidden="true" />
      <header className="hero">
        <nav className="nav">
          <a href="#compare">Compare</a>
          <a href="#demo">Stub demo</a>
          <a href="#findings">Findings</a>
          <a
            href="https://github.com/mvschwarz/openrig"
            target="_blank"
            rel="noreferrer"
          >
            Upstream
          </a>
        </nav>

        <div className="hero__compose">
          <p className="brand">OpenRig</p>
          <h1>
            Install, test, and weigh it
            <span className="hero__vs"> against Paperclip</span>
          </h1>
          <p className="hero__lede">
            A harness wraps a model. A rig wraps your harnesses. This playground
            records a real sandbox run and draws the line between a local coding
            team and a company control plane.
          </p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="#demo">
              Replay stub team
            </a>
            <a className="btn btn--ghost" href="#compare">
              See the axes
            </a>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="rig-graphic">
            <div className="rig-graphic__mast" />
            <div className="rig-graphic__deck">
              <span>dev-impl</span>
              <span>dev-qa</span>
            </div>
            <div className="rig-graphic__wake" />
          </div>
        </div>
      </header>

      <main>
        <Comparison />
        <section className="demo-section" id="demo">
          <StubBoard />
        </section>
        <Findings />
      </main>

      <footer className="footer">
        <p>
          Sources:{" "}
          <a href="https://github.com/mvschwarz/openrig" target="_blank" rel="noreferrer">
            mvschwarz/openrig
          </a>{" "}
          ·{" "}
          <a href="https://github.com/paperclipai/paperclip" target="_blank" rel="noreferrer">
            paperclipai/paperclip
          </a>
        </p>
        <p className="footer__meta">apps/openrig-playground · bun install && bun run dev</p>
      </footer>
    </div>
  );
}
