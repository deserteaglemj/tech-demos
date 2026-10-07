import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {teaserFont} from '../../Teaser/fonts';
import {BrowserChrome} from '../BrowserChrome';

export const OpenStart: React.FC<{
  brandName: string;
  startUrl: string;
  accentColor: string;
  secondaryColor: string;
}> = ({brandName, startUrl, accentColor, secondaryColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 16}, durationInFrames: 18});
  const fade = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fade,
        transform: `translateY(${(1 - enter) * 40}px)`,
      }}
    >
      <BrowserChrome url={startUrl} accentColor={accentColor}>
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(160deg, #1a0a1f 0%, #0d0510 100%)',
            padding: '56px 72px',
            fontFamily: teaserFont,
            color: '#fdf6ff',
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: 'rgba(253,246,255,0.5)',
              marginBottom: 16,
              fontWeight: 700,
            }}
          >
            {brandName} · Start your project
          </div>
          <div style={{fontSize: 56, fontWeight: 800, lineHeight: 1.1, marginBottom: 18}}>
            Let&apos;s build your <span style={{color: accentColor}}>free demo</span>
          </div>
          <div style={{fontSize: 24, color: 'rgba(253,246,255,0.7)', maxWidth: 820, marginBottom: 28}}>
            Tell us about your business. Takes about 10 minutes.
          </div>
          <div
            style={{
              display: 'inline-flex',
              padding: '12px 20px',
              borderRadius: 999,
              border: `1px solid ${accentColor}88`,
              background: `${accentColor}22`,
              color: accentColor,
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            Free working demo. You only pay if you love it
          </div>
          <div
            style={{
              marginTop: 40,
              height: 8,
              borderRadius: 4,
              background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
              width: '42%',
            }}
          />
        </div>
      </BrowserChrome>
    </AbsoluteFill>
  );
};
