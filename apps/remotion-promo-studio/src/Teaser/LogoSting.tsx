import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {LOGO_STING_DURATION} from './constants';

export const LogoSting: React.FC<{
  productName: string;
  accentColor: string;
  secondaryColor: string;
}> = ({productName, accentColor, secondaryColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({frame, fps, config: {damping: 12, mass: 0.6}});
  const ringRotation = interpolate(frame, [0, LOGO_STING_DURATION], [0, 70]);
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [LOGO_STING_DURATION - 20, LOGO_STING_DURATION], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const firstLetter = productName.slice(0, 1);
  const rest = productName.slice(1);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: fadeOut}}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 340,
            height: 340,
            borderRadius: '50%',
            border: `3px solid ${secondaryColor}`,
            opacity: 0.55,
            transform: `rotate(${ringRotation}deg) scale(${scale})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 260,
            height: 260,
            borderRadius: '50%',
            border: `2px dashed ${accentColor}`,
            opacity: 0.35,
            transform: `rotate(${-ringRotation * 0.6}deg) scale(${scale})`,
          }}
        />
        <div
          style={{
            fontSize: 104,
            fontWeight: 800,
            color: 'white',
            letterSpacing: -2,
            fontFamily: 'Inter, Arial, sans-serif',
            opacity: fadeIn,
            transform: `scale(${scale})`,
          }}
        >
          <span style={{color: accentColor}}>{firstLetter}</span>
          {rest}
        </div>
      </div>
    </AbsoluteFill>
  );
};
