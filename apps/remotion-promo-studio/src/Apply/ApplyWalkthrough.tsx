import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {BackgroundGlow} from '../Teaser/BackgroundGlow';
import {
  CTA_DURATION,
  FORM_JOURNEY_DURATION,
  INTRO_DURATION,
  OPEN_START_DURATION,
  OUTCOME_DURATION,
  SUBMIT_DURATION,
} from './constants';
import type {ApplyProps} from './schema';
import {ApplyCta} from './scenes/ApplyCta';
import {FormJourney} from './scenes/FormJourney';
import {Intro} from './scenes/Intro';
import {OpenStart} from './scenes/OpenStart';
import {Outcome} from './scenes/Outcome';
import {Submit} from './scenes/Submit';

export const ApplyWalkthrough: React.FC<ApplyProps> = ({
  brandName,
  sampleBusiness,
  sampleOwner,
  accentColor,
  secondaryColor,
  backgroundColor,
  startUrl,
  ctaLabel,
}) => {
  return (
    <AbsoluteFill style={{backgroundColor}}>
      <BackgroundGlow accentColor={accentColor} secondaryColor={secondaryColor} />
      <Series>
        <Series.Sequence durationInFrames={INTRO_DURATION}>
          <Intro brandName={brandName} accentColor={accentColor} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={OPEN_START_DURATION}>
          <OpenStart
            brandName={brandName}
            startUrl={startUrl}
            accentColor={accentColor}
            secondaryColor={secondaryColor}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={FORM_JOURNEY_DURATION}>
          <FormJourney
            sampleBusiness={sampleBusiness}
            sampleOwner={sampleOwner}
            startUrl={startUrl}
            accentColor={accentColor}
            secondaryColor={secondaryColor}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SUBMIT_DURATION}>
          <Submit startUrl={startUrl} accentColor={accentColor} secondaryColor={secondaryColor} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={OUTCOME_DURATION}>
          <Outcome accentColor={accentColor} secondaryColor={secondaryColor} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CTA_DURATION}>
          <ApplyCta
            brandName={brandName}
            startUrl={startUrl}
            ctaLabel={ctaLabel}
            accentColor={accentColor}
            secondaryColor={secondaryColor}
          />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
