import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {BackgroundGlow} from './BackgroundGlow';
import {CallToAction} from './CallToAction';
import {CTA_DURATION, FEATURE_BEAT_DURATION, LOGO_STING_DURATION} from './constants';
import {FeatureBeat} from './FeatureBeat';
import {LogoSting} from './LogoSting';
import type {TeaserProps} from './schema';

export const Teaser: React.FC<TeaserProps> = ({
  productName,
  tagline,
  accentColor,
  secondaryColor,
  backgroundColor,
  features,
}) => {
  return (
    <AbsoluteFill style={{backgroundColor}}>
      <BackgroundGlow accentColor={accentColor} secondaryColor={secondaryColor} />
      <Series>
        <Series.Sequence durationInFrames={LOGO_STING_DURATION}>
          <LogoSting productName={productName} accentColor={accentColor} secondaryColor={secondaryColor} />
        </Series.Sequence>
        {features.map((feature, index) => (
          <Series.Sequence key={`${feature.title}-${index}`} durationInFrames={FEATURE_BEAT_DURATION}>
            <FeatureBeat
              feature={feature}
              index={index}
              total={features.length}
              accentColor={accentColor}
              secondaryColor={secondaryColor}
            />
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={CTA_DURATION}>
          <CallToAction
            productName={productName}
            tagline={tagline}
            accentColor={accentColor}
            secondaryColor={secondaryColor}
          />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
