import type { BrandTokens } from "../lib/tokens";

type Props = {
  tokens: BrandTokens;
  onChange: (next: BrandTokens) => void;
  onReset: () => void;
  reveal: boolean;
  onRevealChange: (value: boolean) => void;
  onCopy: () => void;
  copyState: "idle" | "copied" | "error";
};

const FIELDS: { key: keyof BrandTokens; label: string; color?: boolean }[] = [
  { key: "paper", label: "Paper", color: true },
  { key: "ink", label: "Ink", color: true },
  { key: "accent", label: "Accent", color: true },
  { key: "muted", label: "Muted", color: true },
];

export function TokenPanel({
  tokens,
  onChange,
  onReset,
  reveal,
  onRevealChange,
  onCopy,
  copyState,
}: Props) {
  return (
    <aside className="token-panel" aria-label="Brand tokens">
      <div className="panel-head">
        <p className="panel-eyebrow">Brand tokens</p>
        <h2>Skin the schematic</h2>
        <p className="panel-copy">
          Coral is editorial, not a flag — keep the accent on one or two focals.
        </p>
      </div>

      <div className="token-fields">
        {FIELDS.map((field) => (
          <label key={field.key} className="token-field">
            <span>{field.label}</span>
            <div className="token-input-row">
              <input
                type="color"
                value={toColorInput(tokens[field.key])}
                onChange={(event) =>
                  onChange({ ...tokens, [field.key]: event.target.value })
                }
                aria-label={`${field.label} color`}
              />
              <input
                type="text"
                value={tokens[field.key]}
                onChange={(event) =>
                  onChange({ ...tokens, [field.key]: event.target.value })
                }
                spellCheck={false}
              />
            </div>
          </label>
        ))}
      </div>

      <label className="reveal-toggle">
        <input
          type="checkbox"
          checked={reveal}
          onChange={(event) => onRevealChange(event.target.checked)}
        />
        <span>Staggered reveal motion</span>
      </label>

      <div className="panel-actions">
        <button type="button" className="btn-secondary" onClick={onReset}>
          Reset variant
        </button>
        <button type="button" className="btn-primary" onClick={onCopy}>
          {copyState === "copied"
            ? "Copied HTML"
            : copyState === "error"
              ? "Copy failed"
              : "Copy HTML"}
        </button>
      </div>
    </aside>
  );
}

function toColorInput(value: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  return "#eb6c36";
}
