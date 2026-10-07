import type { AppState } from "../data/seed";
import type { Page } from "../lib/store";

type Props = {
  state: AppState;
  onGo: (page: Page) => void;
  onUnits: (units: "lb" | "kg") => void;
  onReset: () => void;
};

export function Settings({ state, onGo, onUnits, onReset }: Props) {
  return (
    <section className="section">
      <div className="row-between">
        <div>
          <h2>Settings</h2>
          <p className="lede">Profile, units, and demo controls.</p>
        </div>
        <button type="button" className="ghost-btn" onClick={() => onGo("home")}>
          Home
        </button>
      </div>

      <div className="settings-card">
        <h3>Athlete</h3>
        <dl className="kv">
          <div>
            <dt>Name</dt>
            <dd>{state.athlete}</dd>
          </div>
          <div>
            <dt>Coach</dt>
            <dd>{state.coach}</dd>
          </div>
          <div>
            <dt>Program</dt>
            <dd>{state.program}</dd>
          </div>
        </dl>
      </div>

      <div className="settings-card">
        <h3>Units</h3>
        <div className="chip-row">
          <button
            type="button"
            className={state.units === "lb" ? "chip on" : "chip"}
            onClick={() => onUnits("lb")}
          >
            Pounds (lb)
          </button>
          <button
            type="button"
            className={state.units === "kg" ? "chip on" : "chip"}
            onClick={() => onUnits("kg")}
          >
            Kilograms (kg)
          </button>
        </div>
      </div>

      <div className="settings-card">
        <h3>Brand accent</h3>
        <p className="lede">
          Structure identity — ember orange on silver titanium.
        </p>
        <div className="swatch-row">
          <span style={{ background: "#f36a2d" }} />
          <span style={{ background: "#ffa36e" }} />
          <span style={{ background: "#c3c8ce" }} />
          <span style={{ background: "#0e1012" }} />
        </div>
      </div>

      <div className="settings-card">
        <h3>Demo</h3>
        <p className="lede">
          Clears localStorage and restores the Founding 8 seed week.
        </p>
        <button type="button" className="btn-primary" onClick={onReset}>
          Reset demo data
        </button>
      </div>
    </section>
  );
}
