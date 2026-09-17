import { SpringProvider } from "./lib/SpringContext";
import { ControlPanel } from "./components/ControlPanel";
import { MagneticButton } from "./components/demos/MagneticButton";
import { ToastOvershoot } from "./components/demos/ToastOvershoot";
import { GlidingTabs } from "./components/demos/GlidingTabs";
import { RubberSlider } from "./components/demos/RubberSlider";
import { LikeBurst } from "./components/demos/LikeBurst";
import { HoldToConfirm } from "./components/demos/HoldToConfirm";
import { ElasticCounter } from "./components/demos/ElasticCounter";
import { DragToDismiss } from "./components/demos/DragToDismiss";

function App() {
  return (
    <SpringProvider>
      <div className="page">
        <header className="hero">
          <span className="hero-eyebrow">Kinetics Playground</span>
          <h1>Motion that has weight.</h1>
          <p>
            8 interface micro-interactions built on real spring physics instead of fixed-duration
            easing. Tune stiffness, damping, and mass live, then copy the React or CSS.
          </p>
          <a
            className="hero-source"
            href="https://kinetics.colorion.co"
            target="_blank"
            rel="noreferrer noopener"
          >
            Inspired by kinetics.colorion.co ↗
          </a>
        </header>

        <ControlPanel />

        <main className="demo-grid">
          <MagneticButton />
          <ToastOvershoot />
          <GlidingTabs />
          <RubberSlider />
          <LikeBurst />
          <HoldToConfirm />
          <ElasticCounter />
          <DragToDismiss />
        </main>

        <footer className="page-footer">
          <p>
            Built with Bun + Vite + React. Spring math lives in <code>src/lib/useSpring.ts</code> —
            no animation library required.
          </p>
        </footer>
      </div>
    </SpringProvider>
  );
}

export default App;
