import React from 'react';
import {CalculateMetadataFunction, Composition} from 'remotion';
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
        // Re-fit the timeline if a user edits the number of feature beats
        // in the Studio props panel, so the composition never clips or
        // leaves dead air.
        calculateMetadata={calculateMetadata}
      />
    </>
  );
};
