import React from 'react';
import {CalculateMetadataFunction, Composition} from 'remotion';
import {
  ApplyWalkthrough,
  DEFAULT_DURATION_IN_FRAMES as APPLY_DURATION,
  FPS as APPLY_FPS,
  HEIGHT as APPLY_HEIGHT,
  WIDTH as APPLY_WIDTH,
  defaultApplyProps,
  applySchema,
} from './Apply';
import {
  CTA_DURATION,
  DEFAULT_DURATION_IN_FRAMES,
  FEATURE_BEAT_DURATION,
  FPS,
  HEIGHT,
  LOGO_STING_DURATION,
  Teaser,
  TeaserProps,
  WIDTH,
  defaultTeaserProps,
  teaserSchema,
} from './Teaser';

const calculateMetadata: CalculateMetadataFunction<TeaserProps> = ({props}) => {
  const featureCount = Math.max(1, props.features.length);
  return {
    durationInFrames: LOGO_STING_DURATION + FEATURE_BEAT_DURATION * featureCount + CTA_DURATION,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ProductTeaser"
        component={Teaser}
        durationInFrames={DEFAULT_DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        schema={teaserSchema}
        defaultProps={defaultTeaserProps}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="ApplicationWalkthrough"
        component={ApplyWalkthrough}
        durationInFrames={APPLY_DURATION}
        fps={APPLY_FPS}
        width={APPLY_WIDTH}
        height={APPLY_HEIGHT}
        schema={applySchema}
        defaultProps={defaultApplyProps}
      />
    </>
  );
};
