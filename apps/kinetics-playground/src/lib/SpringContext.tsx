import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { SPRING_PRESETS, type SpringConfig } from "./springMath";

interface SpringContextValue {
  config: SpringConfig;
  setStiffness: (v: number) => void;
  setDamping: (v: number) => void;
  setMass: (v: number) => void;
  applyPreset: (label: string) => void;
  activePreset: string | null;
}

const SpringContext = createContext<SpringContextValue | null>(null);

const DEFAULT_CONFIG: SpringConfig = SPRING_PRESETS[1]; // "Snappy"

export function SpringProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SpringConfig>({ ...DEFAULT_CONFIG });

  const activePreset = useMemo(() => {
    const match = SPRING_PRESETS.find(
      (p) => p.stiffness === config.stiffness && p.damping === config.damping && p.mass === config.mass,
    );
    return match?.label ?? null;
  }, [config]);

  const value: SpringContextValue = {
    config,
    setStiffness: (v) => setConfig((c) => ({ ...c, stiffness: v })),
    setDamping: (v) => setConfig((c) => ({ ...c, damping: v })),
    setMass: (v) => setConfig((c) => ({ ...c, mass: v })),
    applyPreset: (label) => {
      const preset = SPRING_PRESETS.find((p) => p.label === label);
      if (preset) setConfig({ stiffness: preset.stiffness, damping: preset.damping, mass: preset.mass });
    },
    activePreset,
  };

  return <SpringContext.Provider value={value}>{children}</SpringContext.Provider>;
}

export function useSpringConfig(): SpringContextValue {
  const ctx = useContext(SpringContext);
  if (!ctx) throw new Error("useSpringConfig must be used within a SpringProvider");
  return ctx;
}
