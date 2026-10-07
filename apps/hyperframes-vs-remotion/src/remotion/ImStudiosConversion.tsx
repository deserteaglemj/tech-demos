import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Remotion twin of the IM STUDIOS 12s conversion sting (handoff acceptance test). */
export const ImStudiosConversion = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const veil = interpolate(frame, [0, 32, 340, 360], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const brandIn = spring({
    frame: frame - 12,
    fps,
    config: { damping: 18, stiffness: 110 },
  });
  const brandOpacity = interpolate(frame, [12, 30, 120, 135], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brandY = interpolate(brandIn, [0, 1], [36, 0]);
  const brandScale = interpolate(brandIn, [0, 1], [0.96, 1]);

  const promiseOpacity = interpolate(frame, [96, 112, 185, 200], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const promiseY = interpolate(frame, [96, 112], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const servicesOpacity = interpolate(frame, [174, 190, 250, 265], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const servicesY = interpolate(frame, [174, 190], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaOpacity = interpolate(frame, [258, 274, 340, 355], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaY = interpolate(frame, [258, 274], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const urlOpacity = interpolate(frame, [272, 288, 340, 355], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#100e0c",
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 50% 40%, #2a2118 0%, #100e0c 70%)",
        overflow: "hidden",
        color: "#f4ebe0",
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(212, 160, 98, 0.28), transparent 48%)",
          opacity: veil,
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: brandOpacity,
          transform: `translateY(${brandY}px) scale(${brandScale})`,
        }}
      >
        <div
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontSize: 118,
            fontWeight: 700,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          IM STUDIOS
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: promiseOpacity,
          transform: `translateY(${promiseY}px)`,
          padding: "0 2rem",
        }}
      >
        <div
          style={{
            fontFamily: "Inter, Arial, Helvetica, sans-serif",
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: "rgba(244, 235, 224, 0.86)",
            maxWidth: 840,
            textAlign: "center",
            lineHeight: 1.35,
          }}
        >
          Photo + video that balances sentiment and humour — for weddings, commercial, and events.
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: servicesOpacity,
          transform: `translateY(${servicesY}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, Arial, Helvetica, sans-serif",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#d4a062",
            whiteSpace: "nowrap",
          }}
        >
          Wedding · Commercial · Events
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
            fontFamily: "Inter, Arial, Helvetica, sans-serif",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#100e0c",
            background: "#d4a062",
            padding: "0.85rem 1.6rem",
            borderRadius: 999,
            whiteSpace: "nowrap",
          }}
        >
          Book a shoot
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          top: 70,
          opacity: urlOpacity,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, Arial, Helvetica, sans-serif",
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: "0.08em",
            color: "rgba(244, 235, 224, 0.75)",
          }}
        >
          imstudios.ca
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const IM_DURATION_FRAMES = 360;
export const IM_FPS = 30;
export const IM_WIDTH = 1280;
export const IM_HEIGHT = 720;
