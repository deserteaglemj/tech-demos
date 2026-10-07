import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/** Same 3s HELLO card as the HyperFrames HTML — frames 0–15 fade in, hold to 75, fade out by 90 @ 30fps. */
export const TitleCard = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15, 75, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 160,
          fontWeight: 800,
          color: "#fff",
          opacity,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        HELLO
      </div>
    </AbsoluteFill>
  );
};
