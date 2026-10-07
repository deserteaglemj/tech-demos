import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {teaserFont} from '../../Teaser/fonts';

export const Intro: React.FC<{
  brandName: string;
  accentColor: string;
}> = ({brandName, accentColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 14}, durationInFrames: 18});
  const fade = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: fade}}>
      <div
        style={{
          textAlign: 'center',
          transform: `scale(${enter})`,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontFamily: teaserFont,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: accentColor,
            fontWeight: 700,
          }}
        >
          {brandName}
        </div>
        <div
          style={{
            fontFamily: teaserFont,
            fontSize: 78,
            fontWeight: 800,
            color: '#fdf6ff',
            letterSpacing: -2,
            maxWidth: 1200,
            lineHeight: 1.05,
          }}
        >
          Getting your website is easy
        </div>
        <div
          style={{
            fontFamily: teaserFont,
            fontSize: 32,
            fontWeight: 500,
            color: 'rgba(253,246,255,0.72)',
          }}
        >
          One short form. A free working demo. No commitment.
        </div>
      </div>
    </AbsoluteFill>
  );
};
