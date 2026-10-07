import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {teaserFont} from '../../Teaser/fonts';
import {BrowserChrome} from '../BrowserChrome';

export const Submit: React.FC<{
  startUrl: string;
  accentColor: string;
  secondaryColor: string;
}> = ({startUrl, accentColor, secondaryColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const press = spring({frame: Math.max(0, frame - 20), fps, config: {damping: 12}, durationInFrames: 12});
  const scale = interpolate(press, [0, 0.5, 1], [1, 0.94, 1]);
  const glow = interpolate(frame, [20, 45], [0.35, 0.85], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <BrowserChrome url={startUrl} accentColor={accentColor}>
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(160deg, #1a0a1f 0%, #0d0510 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            fontFamily: teaserFont,
            color: '#fdf6ff',
          }}
        >
          <div style={{fontSize: 28, color: 'rgba(253,246,255,0.65)', fontWeight: 600}}>
            No commitment. We review your answers and start the free demo.
          </div>
          <div
            style={{
              padding: '22px 48px',
              borderRadius: 16,
              background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
              fontSize: 36,
              fontWeight: 800,
              transform: `scale(${scale})`,
              boxShadow: `0 24px 70px -10px rgba(240,98,146,${glow})`,
            }}
          >
            Send it over →
          </div>
        </div>
      </BrowserChrome>
    </AbsoluteFill>
  );
};
