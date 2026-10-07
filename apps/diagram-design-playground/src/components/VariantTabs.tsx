import { VARIANT_LABELS, type Variant } from "../lib/tokens";

const ORDER: Variant[] = ["light", "dark", "full"];

type Props = {
  value: Variant;
  onChange: (variant: Variant) => void;
};

export function VariantTabs({ value, onChange }: Props) {
  return (
    <div className="variant-tabs" role="tablist" aria-label="Diagram variant">
      {ORDER.map((variant) => (
        <button
          key={variant}
          type="button"
          role="tab"
          aria-selected={variant === value}
          className={variant === value ? "variant-tab is-active" : "variant-tab"}
          onClick={() => onChange(variant)}
        >
          {VARIANT_LABELS[variant]}
        </button>
      ))}
    </div>
  );
}
