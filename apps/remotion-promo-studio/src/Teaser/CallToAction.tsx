import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const CallToAction: React.FC<{
  productName: string;
  tagline: string;
  accentColor: string;
  secondaryColor: string;
}> = ({productName, tagline, accentColor, secondaryColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 12}, durationInFrames: 20});
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
  const pulse = 1 + Math.sin(frame / 8) * 0.03;

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 30,
          opacity: fadeIn,
          transform: `scale(${enter})`,
        }}
      >
        {tagline ? (
          <div
            style={{
              fontSize: 46,
              color: 'rgba(255,255,255,0.82)',
              fontWeight: 500,
              fontFamily: 'Inter, Arial, sans-serif',
              textAlign: 'center',
              maxWidth: 1100,
            }}
          >
            {tagline}
          </div>
        ) : null}
        <div
          style={{
            padding: '22px 60px',
            borderRadius: 999,
            background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
            fontSize: 42,
            fontWeight: 800,
            color: 'white',
            fontFamily: 'Inter, Arial, sans-serif',
            transform: `scale(${pulse})`,
            boxShadow: `0 20px 60px -20px ${accentColor}`,
          }}
        >
          Try {productName} Free
        </div>
      </div>
    </AbsoluteFill>
  );
};
