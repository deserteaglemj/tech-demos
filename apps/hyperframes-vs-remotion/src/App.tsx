import { useRef, type MouseEvent, type RefObject } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import "@hyperframes/player";
import { TitleCard } from "./remotion/TitleCard";

const HF_SNIPPET = `<div id="stage" data-composition-id="title-card"
     data-width="1280" data-height="720"
     data-duration="3" data-fps="30">
  <div id="title" class="clip"
       data-start="0" data-duration="3"
       data-track-index="0">HELLO</div>
</div>

<script>
  const tl = gsap.timeline({ paused: true });
  tl.to("#title", { opacity: 1, duration: 0.5 }, 0);
  tl.to("#title", { opacity: 1, duration: 2.0 }, 0.5);
  tl.to("#title", { opacity: 0, duration: 0.5 }, 2.5);
  window.__timelines["title-card"] = tl;
</script>`;

const RM_SNIPPET = `import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const TitleCard = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 15, 75, 90],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a",
      justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontSize: 140, fontWeight: 800,
        color: "#fff", opacity, whiteSpace: "nowrap" }}>HELLO</div>
    </AbsoluteFill>
  );
};`;

const MATRIX: Array<[string, string, string]> = [
  ["What you write", "HTML + CSS + seekable GSAP/CSS/Lottie", "React + TypeScript components"],
  ["Timing model", "Renderer seeks a paused timeline to each frame", "Pure function of useCurrentFrame()"],
  ["Build step", "None — index.html plays as-is", "Bundler required (Webpack/Vite)"],
  ["Agent handoff", "Plain HTML files agents already write", "JSX project + Remotion APIs"],
  ["Existing web art", "GSAP/Lottie pages drop in close to as-is", "Rewrite as React compositions"],
  ["Ecosystem age", "Newer (HeyGen, 2026) — fast-moving", "Mature since 2021 — templates, Lambda, Player"],
  ["License", "Apache 2.0", "Remotion License (paid for larger teams)"],
];

export default function App() {
  const remotionRef = useRef<PlayerRef>(null);
  const codeRef = useRef<HTMLElement>(null);
  const hfHostRef = useRef<HTMLElement | null>(null);

  const playBoth = (event: MouseEvent<HTMLButtonElement>) => {
    const remotion = remotionRef.current;
    if (remotion) {
      remotion.pause();
      remotion.seekTo(0);
      // Remotion requires the user gesture event for play() under autoplay policy.
      remotion.play(event);
    }

    const hf = hfHostRef.current as
      | (HTMLElement & { play?: () => Promise<void> | void; currentTime?: number })
      | null;
    if (hf) {
      if (typeof hf.currentTime === "number") hf.currentTime = 0;
      void hf.play?.();
    }
  };

  const scrollCode = () => {
    codeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-copy">
          <p className="brand">Side by Frame</p>
          <p className="lede">
            Same three-second HELLO title card — HyperFrames HTML on the left, Remotion React on
            the right. Both seek a browser frame-by-frame into MP4.
          </p>
          <div className="cta-row">
            <button type="button" className="cta" onClick={playBoth}>
              Play both
            </button>
            <button type="button" className="cta ghost" onClick={scrollCode}>
              Compare source
            </button>
          </div>
        </div>

        <div className="stage" aria-label="Dual composition players">
          <div className="lane hf">
            <div className="lane-meta">
              <strong>HyperFrames</strong>
              <span className="badge">HTML · GSAP seek</span>
            </div>
            <div className="player-shell">
              <hyperframes-player
                ref={(el) => {
                  hfHostRef.current = el as HTMLElement | null;
                }}
                src="/hyperframes/index.html"
                controls
                muted
                loop
                width={1280}
                height={720}
              />
            </div>
          </div>

          <div className="lane rm">
            <div className="lane-meta">
              <strong>Remotion</strong>
              <span className="badge">React · frame fn</span>
            </div>
            <div className="player-shell">
              <Player
                ref={remotionRef}
                className="remotion-player"
                component={TitleCard}
                durationInFrames={90}
                compositionWidth={1280}
                compositionHeight={720}
                fps={30}
                controls
                loop
                autoPlay={false}
                initiallyShowClickToPlay={false}
                acknowledgeRemotionLicense
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
      </header>

      <section ref={codeRef as RefObject<HTMLElement>}>
        <div className="section-head">
          <h2>Authoring, not pixels</h2>
          <p>
            The frames match. The mental model does not. HyperFrames declares clips in markup and
            seeks a paused GSAP timeline. Remotion computes style from the current frame number.
          </p>
        </div>
        <div className="code-grid">
          <article className="code-panel">
            <header>
              <span>hyperframes/index.html</span>
              <span>seconds</span>
            </header>
            <pre>{HF_SNIPPET}</pre>
          </article>
          <article className="code-panel">
            <header>
              <span>TitleCard.tsx</span>
              <span>frames @ 30fps</span>
            </header>
            <pre>{RM_SNIPPET}</pre>
          </article>
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Where they actually differ</h2>
          <p>
            Both open headless Chrome and encode with FFmpeg. Pick the authoring surface that fits
            your team — not the newer logo.
          </p>
        </div>
        <div className="matrix" role="table" aria-label="HyperFrames versus Remotion">
          <div className="matrix-row" role="row">
            <div role="columnheader">Axis</div>
            <div role="columnheader">HyperFrames</div>
            <div role="columnheader">Remotion</div>
          </div>
          {MATRIX.map(([axis, hf, rm]) => (
            <div className="matrix-row" role="row" key={axis}>
              <div role="cell">{axis}</div>
              <div role="cell">{hf}</div>
              <div role="cell">{rm}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="section-head">
          <h2>Pick for the work, not the hype</h2>
        </div>
        <div className="verdict">
          <article>
            <h3>Choose HyperFrames when…</h3>
            <p>
              You want agent-authored HTML, no React build, Apache 2.0, or you already have GSAP /
              Lottie / web pages that should become video with minimal rewrite.
            </p>
          </article>
          <article>
            <h3>Choose Remotion when…</h3>
            <p>
              Your team lives in React/TypeScript, you need the mature Player + Lambda ecosystem,
              or you prefer a pure frame function with typed props over timeline contracts.
            </p>
          </article>
        </div>
      </section>

      <footer className="footer">
        Sources:{" "}
        <a href="https://github.com/heygen-com/hyperframes" target="_blank" rel="noreferrer">
          heygen-com/hyperframes
        </a>
        {" · "}
        <a
          href="https://hyperframes.heygen.com/guides/hyperframes-vs-remotion"
          target="_blank"
          rel="noreferrer"
        >
          official comparison
        </a>
        {" · "}
        <a href="https://www.remotion.dev" target="_blank" rel="noreferrer">
          remotion.dev
        </a>
        {" · "}
        local render: <code>bun run render:hf</code>
      </footer>
    </div>
  );
}
