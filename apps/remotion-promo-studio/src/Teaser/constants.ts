export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Scene timings (in frames @ FPS). Logo sting -> feature beats -> CTA.
export const LOGO_STING_DURATION = 90; // 3s
export const FEATURE_BEAT_DURATION = 120; // 4s per feature
export const CTA_DURATION = 90; // 3s

export const DEFAULT_FEATURE_COUNT = 3;

// 90 + 120*3 + 90 = 540 frames = 18s at 30fps (within the 15-20s target).
export const DEFAULT_DURATION_IN_FRAMES =
  LOGO_STING_DURATION + FEATURE_BEAT_DURATION * DEFAULT_FEATURE_COUNT + CTA_DURATION;
