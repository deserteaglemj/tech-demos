import { useEffect, useState } from "react";
import { useSpringConfig } from "../lib/SpringContext";
import { useSpring } from "../lib/useSpring";
import { overshootFraction, settleTimeSeconds, SPRING_LIMITS, SPRING_PRESETS } from "../lib/springMath";

function SpringPreview() {
  const { config } = useSpringConfig();
  const [target, setTarget] = useState(0);

  // Re-ping automatically whenever the live config changes, so dragging a
  // knob shows the new feel immediately without an extra click.
  useEffect(() => {
    setTarget((t) => (t === 0 ? 1 : 0));
  }, [config.stiffness, config.damping, config.mass]);

  const pos = useSpring(target, config);

  return (
    <button className="spring-preview" onClick={() => setTarget((t) => (t === 0 ? 1 : 0))} aria-label="Ping the spring">
      <span className="spring-preview-track">
        <span className="spring-preview-dot" style={{ left: `${pos * 100}%` }} />
      </span>
      <span className="spring-preview-hint">tap to ping</span>
    </button>
  );
}

function Knob({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <label className="knob">
      <span className="knob-label">
        {label} <strong>{value}{suffix}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function ControlPanel() {
  const { config, setStiffness, setDamping, setMass, applyPreset, activePreset } = useSpringConfig();
  const overshoot = overshootFraction(config);
  const settleMs = Math.round(settleTimeSeconds(config) * 1000);

  return (
    <section className="control-panel" aria-label="Global spring controls">
      <div className="control-panel-top">
        <div className="control-panel-title">
          <span className="control-panel-eyebrow">Live spring config</span>
          <h2>
            spring({config.stiffness}, {config.damping}) <span className="control-panel-mass">mass {config.mass.toFixed(1)}</span>
          </h2>
          <p>
            Drag the knobs — every demo below re-simulates in real time. {overshoot > 0.01
              ? `~${Math.round(overshoot * 100)}% overshoot, settles in ~${settleMs}ms.`
              : `Critically/over-damped — no overshoot, settles in ~${settleMs}ms.`}
          </p>
        </div>
        <SpringPreview />
      </div>

      <div className="control-panel-knobs">
        <Knob
          label="Stiffness"
          value={config.stiffness}
          min={SPRING_LIMITS.stiffness.min}
          max={SPRING_LIMITS.stiffness.max}
          step={SPRING_LIMITS.stiffness.step}
          onChange={setStiffness}
        />
        <Knob
          label="Damping"
          value={config.damping}
          min={SPRING_LIMITS.damping.min}
          max={SPRING_LIMITS.damping.max}
          step={SPRING_LIMITS.damping.step}
          onChange={setDamping}
        />
        <Knob
          label="Mass"
          value={config.mass}
          min={SPRING_LIMITS.mass.min}
          max={SPRING_LIMITS.mass.max}
          step={SPRING_LIMITS.mass.step}
          onChange={setMass}
        />
      </div>

      <div className="control-panel-presets">
        {SPRING_PRESETS.map((preset) => (
          <button
            key={preset.label}
            className={activePreset === preset.label ? "preset-btn active" : "preset-btn"}
            onClick={() => applyPreset(preset.label)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </section>
  );
}
