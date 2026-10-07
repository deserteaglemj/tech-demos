import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {teaserFont} from '../../Teaser/fonts';

export const Outcome: React.FC<{
  accentColor: string;
  secondaryColor: string;
}> = ({accentColor, secondaryColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 14}, durationInFrames: 18});
  const fade = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});

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
          gap: 22,
          textAlign: 'center',
          maxWidth: 1100,
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            fontWeight: 800,
            boxShadow: `0 20px 60px -16px ${accentColor}`,
          }}
        >
          ✓
        </div>
        <div style={{fontSize: 64, fontWeight: 800, letterSpacing: -1}}>Thank you!</div>
        <div style={{fontSize: 32, fontWeight: 500, color: 'rgba(253,246,255,0.78)', lineHeight: 1.35}}>
          We&apos;ll build your free working demo.
          <br />
          You only pay if you love it.
        </div>
      </div>
    </AbsoluteFill>
  );
};
