import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FEATURE_BEAT_DURATION} from './constants';
import type {Feature} from './schema';

export const FeatureBeat: React.FC<{
  feature: Feature;
  index: number;
  total: number;
  accentColor: string;
  secondaryColor: string;
}> = ({feature, index, total, accentColor, secondaryColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 14}, durationInFrames: 20});
  const slideY = interpolate(enter, [0, 1], [50, 0]);
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(
    frame,
    [FEATURE_BEAT_DURATION - 20, FEATURE_BEAT_DURATION],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const emojiBounce = spring({frame, fps, config: {damping: 8, mass: 0.4}, durationInFrames: 25});

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: fadeOut}}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 22,
          transform: `translateY(${slideY}px)`,
          opacity: fadeIn,
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 5,
            color: secondaryColor,
            textTransform: 'uppercase',
            fontWeight: 700,
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          Feature {index + 1} / {total}
        </div>
        <div style={{fontSize: 108, transform: `scale(${emojiBounce})`}}>{feature.emoji}</div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: 'white',
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          {feature.title}
        </div>
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.75)',
            maxWidth: 920,
            textAlign: 'center',
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          {feature.description}
        </div>
        <div
          style={{
            width: 120,
            height: 6,
            borderRadius: 3,
            backgroundColor: accentColor,
            marginTop: 10,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
