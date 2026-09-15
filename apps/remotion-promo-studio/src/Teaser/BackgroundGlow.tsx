import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export const BackgroundGlow: React.FC<{
  accentColor: string;
  secondaryColor: string;
}> = ({accentColor, secondaryColor}) => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame / 60) * 40;
  const driftY = Math.cos(frame / 80) * 30;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          top: `calc(18% + ${driftY}px)`,
          left: `calc(12% + ${driftX}px)`,
          width: 760,
          height: 760,
          borderRadius: '50%',
          background: accentColor,
          opacity: 0.28,
          filter: 'blur(140px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: `calc(8% - ${driftY}px)`,
          right: `calc(8% - ${driftX}px)`,
          width: 620,
          height: 620,
          borderRadius: '50%',
          background: secondaryColor,
          opacity: 0.24,
          filter: 'blur(140px)',
        }}
      />
    </AbsoluteFill>
  );
};
