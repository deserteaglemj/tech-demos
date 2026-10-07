import { AXES, METAPHOR, VERDICTS } from "../data/comparison";

export function Comparison() {
  return (
    <section className="compare" id="compare">
      <div className="section-head">
        <p className="eyebrow">Side by side</p>
        <h2>OpenRig vs Paperclip</h2>
        <p>Same problem space—agent teams—different operating layer.</p>
      </div>

      <div className="metaphor">
        <article className="metaphor__panel metaphor__panel--openrig">
          <p className="metaphor__tag">{METAPHOR.openrig.tag}</p>
          <h3>{METAPHOR.openrig.title}</h3>
          <p>{METAPHOR.openrig.line}</p>
        </article>
        <article className="metaphor__panel metaphor__panel--paperclip">
          <p className="metaphor__tag">{METAPHOR.paperclip.tag}</p>
          <h3>{METAPHOR.paperclip.title}</h3>
          <p>{METAPHOR.paperclip.line}</p>
        </article>
      </div>

      <div className="axis-table" role="table" aria-label="Comparison axes">
        <div className="axis-table__head" role="row">
          <span role="columnheader">Axis</span>
          <span role="columnheader">OpenRig</span>
          <span role="columnheader">Paperclip</span>
        </div>
        {AXES.map((axis) => (
          <div className="axis-table__row" role="row" key={axis.id}>
            <span role="cell" className="axis-table__label">
              {axis.label}
            </span>
            <span role="cell">{axis.openrig}</span>
            <span role="cell">{axis.paperclip}</span>
          </div>
        ))}
      </div>

      <div className="verdicts">
        {VERDICTS.map((v) => (
          <article key={v.title} className={`verdict verdict--${v.pick}`}>
            <p className="verdict__pick">
              {v.pick === "openrig"
                ? "→ OpenRig"
                : v.pick === "paperclip"
                  ? "→ Paperclip"
                  : "→ Both"}
            </p>
            <h3>{v.title}</h3>
            <p>{v.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
