import CursorOnlyPreview from "./compare/CursorOnlyPreview";
import ReaAccuratePreview from "./compare/ReaAccuratePreview";
import { CRITERIA, MAX, TIMING, total } from "./compare/scores";

const cursorScore = total("cursorOnly");
const reaScore = total("rea");
const cursorPct = Math.round((cursorScore / MAX) * 100);
const reaPct = Math.round((reaScore / MAX) * 100);
const lift = reaPct - cursorPct;

export default function Compare() {
  return (
    <div className="cmp">
      <header className="cmp-hero">
        <p className="cmp-kicker">Head-to-head</p>
        <h1>Cursor alone vs REA — copying Resend’s preview toggles</h1>
        <p>
          Same target feature on{" "}
          <a href={TIMING.source.url} target="_blank" rel="noreferrer">
            resend.com
          </a>
          : paired editor switches for view mode + appearance mode. Scored with
          a fixed 100-pt fidelity rubric against the live DOM/a11y Evidence.
        </p>
      </header>

      <section className="cmp-scoreboard" aria-label="Scoreboard">
        <article className="cmp-score">
          <h2>Cursor alone</h2>
          <p className="cmp-big">{cursorPct}%</p>
          <p>
            {cursorScore}/{MAX} pts · {TIMING.cursorOnly.minutes} min
          </p>
          <p className="cmp-note">{TIMING.cursorOnly.method}</p>
        </article>
        <article className="cmp-score cmp-score-win">
          <h2>With REA</h2>
          <p className="cmp-big">{reaPct}%</p>
          <p>
            {reaScore}/{MAX} pts · {TIMING.rea.minutes} min
            <span className="cmp-pill">
              inspect ~{TIMING.rea.inspectSeconds}s
            </span>
          </p>
          <p className="cmp-note">{TIMING.rea.method}</p>
        </article>
        <article className="cmp-score">
          <h2>Delta</h2>
          <p className="cmp-big">+{lift} pts</p>
          <p>
            REA was {Math.round((TIMING.cursorOnly.minutes / TIMING.rea.minutes) * 10) / 10}
            × faster and {lift} percentage points closer to Resend.
          </p>
        </article>
      </section>

      <section className="cmp-grid" aria-label="Side by side">
        <div>
          <h2>Source — Resend</h2>
          <p className="cmp-caption">
            Live editor chrome: segmented icon switches in the preview header
            (<code>aria-label=&quot;Email view mode&quot;</code> /{" "}
            <code>Email appearance mode</code>).
          </p>
          <img
            src="/compare/resend_toggles_source.png"
            alt="Resend email editor with view and appearance mode toggles"
            className="cmp-shot"
          />
        </div>
        <div>
          <h2>Cursor alone · {cursorPct}%</h2>
          <p className="cmp-caption">
            Guessed Device/Theme dropdowns outside the card — works, wrong
            control model.
          </p>
          <CursorOnlyPreview />
        </div>
        <div>
          <h2>With REA · {reaPct}%</h2>
          <p className="cmp-caption">
            Rebuilt from Evidence: role=switch, exact labels, segmented icons in
            header chrome.
          </p>
          <ReaAccuratePreview />
        </div>
      </section>

      <section className="cmp-rubric">
        <h2>Rubric (judgment → points)</h2>
        <table>
          <thead>
            <tr>
              <th>Criterion</th>
              <th>Max</th>
              <th>Cursor</th>
              <th>REA</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            {CRITERIA.map((c) => (
              <tr key={c.id}>
                <td>{c.label}</td>
                <td>{c.max}</td>
                <td>{c.cursorOnly}</td>
                <td>{c.rea}</td>
                <td>{c.note}</td>
              </tr>
            ))}
            <tr className="cmp-total">
              <td>Total</td>
              <td>{MAX}</td>
              <td>
                {cursorScore} ({cursorPct}%)
              </td>
              <td>
                {reaScore} ({reaPct}%)
              </td>
              <td>Lift +{lift} pts</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="cmp-takeaway">
        <h2>Why you need REA instead of “just Cursor”</h2>
        <ul>
          <li>
            Cursor alone copies what it <em>sees</em> and invents plausible UI
            (<code>&lt;select&gt;</code>s). Score: <strong>{cursorPct}%</strong>{" "}
            in {TIMING.cursorOnly.minutes} min.
          </li>
          <li>
            REA returns Evidence — exact aria names, role=switch, toolbar DOM —
            so the recreation matches the interaction contract, not a guess.
            Score: <strong>{reaPct}%</strong> in {TIMING.rea.minutes} min.
          </li>
          <li>
            Net: <strong>+{lift} percentage points</strong> fidelity and about{" "}
            <strong>
              {TIMING.cursorOnly.minutes - TIMING.rea.minutes} minutes faster
            </strong>{" "}
            for this feature.
          </li>
        </ul>
      </section>
    </div>
  );
}
