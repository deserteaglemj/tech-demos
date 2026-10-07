import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {teaserFont} from '../../Teaser/fonts';

export const ApplyCta: React.FC<{
  brandName: string;
  startUrl: string;
  ctaLabel: string;
  accentColor: string;
  secondaryColor: string;
}> = ({brandName, startUrl, ctaLabel, accentColor, secondaryColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 12}, durationInFrames: 16});
  const fade = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  const pulse = 1 + Math.sin(frame / 8) * 0.025;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fade,
        fontFamily: teaserFont,
        color: '#fdf6ff',
      }}
    >
      <div
        style={{
          transform: `scale(${enter})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 5,
            textTransform: 'uppercase',
            color: accentColor,
            fontWeight: 700,
          }}
        >
          {brandName}
        </div>
        <div style={{fontSize: 56, fontWeight: 800, letterSpacing: -1}}>
          Ready in about 10 minutes
        </div>
        <div
          style={{
            padding: '22px 52px',
            borderRadius: 16,
            background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
            fontSize: 36,
            fontWeight: 800,
            transform: `scale(${pulse})`,
            boxShadow: `0 20px 60px -20px ${accentColor}`,
          }}
        >
          {ctaLabel}
        </div>
        <div style={{fontSize: 24, color: 'rgba(253,246,255,0.65)', fontWeight: 500}}>
          {startUrl}
        </div>
      </div>
    </AbsoluteFill>
  );
};
