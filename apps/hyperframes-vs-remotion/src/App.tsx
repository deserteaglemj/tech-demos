import { useRef, type MouseEvent, type RefObject } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import "@hyperframes/player";
import {
  LumenDesk,
  LUMEN_DURATION_FRAMES,
  LUMEN_FPS,
  LUMEN_HEIGHT,
  LUMEN_WIDTH,
} from "./remotion/LumenDesk";
import { SHARED_PROMPT, SCORES, VERDICT, average } from "./bakeoff";

const HF_AVG = average("hyperframes");
const RM_AVG = average("remotion");

export default function App() {
  const remotionRef = useRef<PlayerRef>(null);
  const scoresRef = useRef<HTMLElement>(null);
  const hfHostRef = useRef<HTMLElement | null>(null);

  const playBoth = (event: MouseEvent<HTMLButtonElement>) => {
    const remotion = remotionRef.current;
    if (remotion) {
      remotion.pause();
      remotion.seekTo(0);
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

  const scrollScores = () => {
    scoresRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-copy">
          <p className="brand">Bake-Off</p>
          <p className="lede">
            Same prompt. Two guided chats — HyperFrames vs Remotion. Watch both outputs, then read
            the scorecards and verdict.
          </p>
          <div className="cta-row">
            <button type="button" className="cta" onClick={playBoth}>
              Play both outputs
            </button>
            <button type="button" className="cta ghost" onClick={scrollScores}>
              Jump to ratings
            </button>
          </div>
        </div>

        <section className="prompt-card" aria-label="Shared agent prompt">
          <div className="prompt-meta">
            <span>Shared prompt</span>
            <span>Both chats got this verbatim</span>
          </div>
          <pre className="prompt-body">{SHARED_PROMPT}</pre>
          <div className="guide-row">
            <article>
              <h3>Guide A — HyperFrames</h3>
              <p>
                Author a single HTML composition: <code>class=&quot;clip&quot;</code>, data timing
                attrs, paused GSAP on <code>window.__timelines</code>. No React.
              </p>
            </article>
            <article>
              <h3>Guide B — Remotion</h3>
              <p>
                Author a React composition with <code>useCurrentFrame</code>,{" "}
                <code>interpolate</code>, and <code>AbsoluteFill</code> at 30fps.
              </p>
            </article>
          </div>
        </section>
      </header>

      <section className="outputs" aria-label="Agent outputs">
        <div className="section-head">
          <h2>Outputs</h2>
          <p>Left is HyperFrames HTML. Right is Remotion React. Same brief, different guides.</p>
        </div>

        <div className="stage">
          <div className="lane hf">
            <div className="lane-meta">
              <strong>Output A · HyperFrames</strong>
              <span className="badge">HTML · GSAP</span>
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
            <p className="lane-score">
              Score <em>{HF_AVG}</em> / 10
            </p>
          </div>

          <div className="lane rm">
            <div className="lane-meta">
              <strong>Output B · Remotion</strong>
              <span className="badge">React · frames</span>
            </div>
            <div className="player-shell">
              <Player
                ref={remotionRef}
                className="remotion-player"
                component={LumenDesk}
                durationInFrames={LUMEN_DURATION_FRAMES}
                compositionWidth={LUMEN_WIDTH}
                compositionHeight={LUMEN_HEIGHT}
                fps={LUMEN_FPS}
                controls
                loop
                autoPlay={false}
                overflowVisible={false}
                acknowledgeRemotionLicense
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <p className="lane-score">
              Score <em>{RM_AVG}</em> / 10
            </p>
          </div>
        </div>
      </section>

      <section ref={scoresRef as RefObject<HTMLElement>} className="scores">
        <div className="section-head">
          <h2>Ratings</h2>
          <p>
            Six axes, scored 1–10 for this mini only — not a universal ranking of either framework.
          </p>
        </div>

        <div className="score-table" role="table" aria-label="Bake-off scorecards">
          <div className="score-row head" role="row">
            <div role="columnheader">Axis</div>
            <div role="columnheader">HyperFrames</div>
            <div role="columnheader">Remotion</div>
            <div role="columnheader">Why</div>
          </div>
          {SCORES.map((row) => (
            <div className="score-row" role="row" key={row.id}>
              <div role="cell">{row.label}</div>
              <div role="cell" className="num hf-num">
                {row.hyperframes}
              </div>
              <div role="cell" className="num rm-num">
                {row.remotion}
              </div>
              <div role="cell" className="why">
                {row.note}
              </div>
            </div>
          ))}
          <div className="score-row totals" role="row">
            <div role="cell">Average</div>
            <div role="cell" className="num hf-num">
              {HF_AVG}
            </div>
            <div role="cell" className="num rm-num">
              {RM_AVG}
            </div>
            <div role="cell" className="why">
              Out of 10 across {SCORES.length} axes
            </div>
          </div>
        </div>
      </section>

      <section className="verdict-section">
        <div className="section-head">
          <h2>Verdict</h2>
        </div>
        <article className={`verdict-card winner-${VERDICT.winner}`}>
          <p className="verdict-kicker">
            {VERDICT.winner === "hyperframes" ? "HyperFrames mini" : "Remotion mini"}
          </p>
          <h3>{VERDICT.title}</h3>
          <p>{VERDICT.summary}</p>
          <p className="verdict-aside">{VERDICT.loserNote}</p>
        </article>
      </section>

      <footer className="footer">
        Exact prompt + guide notes: <code>PROMPT.md</code>
        {" · "}
        Sources:{" "}
        <a href="https://github.com/heygen-com/hyperframes" target="_blank" rel="noreferrer">
          HyperFrames
        </a>
        {" · "}
        <a href="https://www.remotion.dev" target="_blank" rel="noreferrer">
          Remotion
        </a>
        {" · "}
        <code>bun run render:hf</code>
      </footer>
    </div>
  );
}
