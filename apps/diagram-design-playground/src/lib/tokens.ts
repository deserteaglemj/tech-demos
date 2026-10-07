export type Variant = "light" | "dark" | "full";

export type BrandTokens = {
  paper: string;
  paper2: string;
  ink: string;
  muted: string;
  soft: string;
  accent: string;
  accentTint: string;
  link: string;
  rule: string;
};

export const VARIANT_PRESETS: Record<Variant, BrandTokens> = {
  light: {
    paper: "#f5f5f5",
    paper2: "#ececec",
    ink: "#2d3142",
    muted: "#4f5d75",
    soft: "#7a8399",
    accent: "#eb6c36",
    accentTint: "rgba(235,108,54,0.08)",
    link: "#2e5aa8",
    rule: "rgba(45,49,66,0.12)",
  },
  dark: {
    paper: "#2d3142",
    paper2: "#393e53",
    ink: "#f5f5f5",
    muted: "#bfc0c0",
    soft: "#8e98ac",
    accent: "#f08a59",
    accentTint: "rgba(240,138,89,0.10)",
    link: "#6a95d8",
    rule: "rgba(245,245,245,0.12)",
  },
  full: {
    paper: "#f5f5f5",
    paper2: "#ececec",
    ink: "#2d3142",
    muted: "#4f5d75",
    soft: "#7a8399",
    accent: "#eb6c36",
    accentTint: "rgba(235,108,54,0.08)",
    link: "#2e5aa8",
    rule: "rgba(45,49,66,0.12)",
  },
};

export const VARIANT_LABELS: Record<Variant, string> = {
  light: "Minimal light",
  dark: "Minimal dark",
  full: "Full editorial",
};

export function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return hex;
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
