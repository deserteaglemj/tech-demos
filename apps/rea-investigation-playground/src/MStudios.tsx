import { useState } from "react";
import resendEvidence from "./resendEvidence.json";

type ViewMode = "desktop" | "mobile";
type Appearance = "light" | "dark";

/**
 * Recreated from Resend's paired preview switches
 * ("Email view mode" + "Email appearance mode"), adapted for M Studios
 * brand-board previews. Pattern recovered via REA inspect_web_page Evidence.
 */
export default function MStudios() {
  const [view, setView] = useState<ViewMode>("desktop");
  const [appearance, setAppearance] = useState<Appearance>("light");
  const [sent, setSent] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);

  return (
    <div className={`ms-root ms-${appearance}`}>
      <header className="ms-nav">
        <div className="ms-brand">M Studios</div>
        <nav>
          <a href="#work">Work</a>
          <a href="#preview">Preview</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="ms-hero">
        <p className="ms-brand-hero">M Studios</p>
        <h1>Custom branding for agencies, live events, and television.</h1>
        <p className="ms-lead">
          Creative services with the polish of a product preview — including the
          dual-mode board viewer we adapted from a public marketing site using
          REA.
        </p>
        <div className="ms-cta-row">
          <a className="ms-btn ms-btn-primary" href="#preview">
            Open brand preview
          </a>
          <button
            type="button"
            className="ms-btn ms-btn-ghost"
            onClick={() => setShowEvidence((v) => !v)}
          >
            {showEvidence ? "Hide REA evidence" : "Show REA evidence"}
          </button>
        </div>
      </section>

      {showEvidence && (
        <aside className="ms-evidence" aria-label="REA evidence">
          <h2>Stolen with REA · then adapted</h2>
          <p>
            Source:{" "}
            <a href={resendEvidence.source.url} target="_blank" rel="noreferrer">
              {resendEvidence.source.title}
            </a>
          </p>
          <p>{resendEvidence.stolen_feature.description}</p>
          <ul>
            {resendEvidence.stolen_feature.a11y_switches.map((s) => (
              <li key={s.name}>
                <code>
                  role={s.role} · {s.name}
                </code>
              </li>
            ))}
          </ul>
          <dl>
            <div>
              <dt>inspect_web_page</dt>
              <dd>{resendEvidence.evidence.inspect_web_page.slice(0, 22)}…</dd>
            </div>
            <div>
              <dt>analyze_web_bundle</dt>
              <dd>{resendEvidence.evidence.analyze_web_bundle.slice(0, 22)}…</dd>
            </div>
            <div>
              <dt>Applied to</dt>
              <dd>{resendEvidence.applied_to.adaptation}</dd>
            </div>
          </dl>
        </aside>
      )}

      <section id="preview" className="ms-preview-section">
        <div className="ms-preview-head">
          <h2>Brand board preview</h2>
          <p>
            Paired switches control the live mock — same interaction model REA
            observed on Resend&apos;s email preview.
          </p>
          <div className="ms-switches" role="group" aria-label="Preview modes">
            <label className="ms-switch">
              <span>Board view mode</span>
              <button
                type="button"
                role="switch"
                aria-checked={view === "mobile"}
                aria-label="Board view mode"
                className={view === "mobile" ? "on" : ""}
                onClick={() =>
                  setView((v) => (v === "desktop" ? "mobile" : "desktop"))
                }
              >
                <i />
              </button>
              <em>{view === "desktop" ? "Desktop" : "Mobile"}</em>
            </label>
            <label className="ms-switch">
              <span>Board appearance mode</span>
              <button
                type="button"
                role="switch"
                aria-checked={appearance === "dark"}
                aria-label="Board appearance mode"
                className={appearance === "dark" ? "on" : ""}
                onClick={() =>
                  setAppearance((a) => (a === "light" ? "dark" : "light"))
                }
              >
                <i />
              </button>
              <em>{appearance === "light" ? "Light" : "Dark"}</em>
            </label>
          </div>
        </div>

        <div
          className={`ms-board ms-board-${view} ms-board-${appearance}`}
          data-view={view}
          data-appearance={appearance}
        >
          <div className="ms-board-chrome">
            <span />
            <span />
            <span />
            <strong>mstudios — identity board</strong>
          </div>
          <div className="ms-board-body">
            <div className="ms-mark">M</div>
            <div className="ms-board-copy">
              <h3>M Studios</h3>
              <p>Broadcast · Event · Agency branding</p>
              <div className="ms-swatches" aria-hidden="true">
                <i style={{ background: "#0f6e56" }} />
                <i style={{ background: "#15202b" }} />
                <i style={{ background: "#eef2f6" }} />
                <i style={{ background: "#2f6fed" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="ms-contact">
        <h2>Start a project</h2>
        <p>Tell us about the show, event, or campaign.</p>
        {sent ? (
          <p className="ms-thanks" role="status">
            Thanks! Message sent.
          </p>
        ) : (
          <form
            className="ms-form"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label>
              Name
              <input name="name" required autoComplete="name" />
            </label>
            <label>
              Email
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label>
              Project
              <textarea name="project" rows={3} required />
            </label>
            <button type="submit" className="ms-btn ms-btn-primary">
              Send message
            </button>
          </form>
        )}
      </section>

      <footer className="ms-foot">
        <span>M Studios</span>
        <a href="https://www.mstudios.tv/" target="_blank" rel="noreferrer">
          mstudios.tv
        </a>
      </footer>
    </div>
  );
}
