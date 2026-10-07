import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Remotion-guided agent output for the shared Lumen Desk prompt (6s @ 30fps). */
export const LumenDesk = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glow = interpolate(frame, [0, 24, 160, 180], [0, 1, 1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lampIn = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const lampOut = interpolate(frame, [50, 66], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lampOpacity = Math.min(lampIn, lampOut) * interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const brandOpacity = interpolate(frame, [36, 52, 124, 136], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandY = interpolate(frame, [36, 52], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tagOpacity = interpolate(frame, [72, 88, 124, 136], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagY = interpolate(frame, [72, 88], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaOpacity = interpolate(frame, [134, 148, 170, 180], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [134, 148], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b0c0a",
        backgroundImage:
          "radial-gradient(ellipse 70% 55% at 50% 38%, #1a140c 0%, #0b0c0a 68%)",
        overflow: "hidden",
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
        color: "#f6f1e8",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(232, 160, 74, 0.45), transparent 42%)",
          opacity: glow,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: lampOpacity,
          transform: `scale(${0.7 + lampIn * 0.3})`,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #ffe2b0, #e8a04a 55%, #8a5318 100%)",
            boxShadow: "0 0 60px rgba(232, 160, 74, 0.55)",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: brandOpacity,
          transform: `translateY(${brandY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          LUMEN DESK
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          top: 70,
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "rgba(246, 241, 232, 0.82)",
            whiteSpace: "nowrap",
          }}
        >
          Light that stays with you
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: ctaOpacity,
          transform: `translateY(${ctaY}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "0.7rem 1.4rem",
            background: "#e8a04a",
            borderRadius: 999,
            color: "#0b0c0a",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Shop the lamp
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LUMEN_DURATION_FRAMES = 180;
export const LUMEN_FPS = 30;
export const LUMEN_WIDTH = 1280;
export const LUMEN_HEIGHT = 720;
