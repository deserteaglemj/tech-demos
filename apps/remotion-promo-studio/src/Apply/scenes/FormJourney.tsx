import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {teaserFont} from '../../Teaser/fonts';
import {APPLY_SECTIONS, FORM_JOURNEY_DURATION} from '../constants';
import {BrowserChrome} from '../BrowserChrome';

export const FormJourney: React.FC<{
  sampleBusiness: string;
  sampleOwner: string;
  startUrl: string;
  accentColor: string;
  secondaryColor: string;
}> = ({sampleBusiness, sampleOwner, startUrl, accentColor, secondaryColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const perSection = FORM_JOURNEY_DURATION / APPLY_SECTIONS.length;
  const activeIndex = Math.min(
    APPLY_SECTIONS.length - 1,
    Math.floor(frame / perSection),
  );
  const active = APPLY_SECTIONS[activeIndex];
  const local = frame - activeIndex * perSection;
  const sectionEnter = spring({
    frame: local,
    fps,
    config: {damping: 14},
    durationInFrames: 16,
  });

  const typedBiz = sampleBusiness.slice(
    0,
    Math.floor(
      interpolate(frame, [8, 55], [0, sampleBusiness.length], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    ),
  );
  const typedOwner = sampleOwner.slice(
    0,
    Math.floor(
      interpolate(frame, [40, 85], [0, sampleOwner.length], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    ),
  );

  const progress = interpolate(frame, [0, FORM_JOURNEY_DURATION], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <BrowserChrome url={startUrl} accentColor={accentColor}>
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(160deg, #1a0a1f 0%, #0d0510 100%)',
            padding: '36px 56px',
            fontFamily: teaserFont,
            color: '#fdf6ff',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <div style={{fontSize: 34, fontWeight: 800}}>
              {active.n}. {active.title}
            </div>
            <div style={{fontSize: 18, color: 'rgba(253,246,255,0.55)', fontWeight: 600}}>
              Step {active.n} of {APPLY_SECTIONS.length}
            </div>
          </div>

          <div
            style={{
              height: 10,
              borderRadius: 5,
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress * 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${accentColor}, ${secondaryColor})`,
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
            }}
          >
            {APPLY_SECTIONS.map((section, i) => {
              const done = i < activeIndex;
              const current = i === activeIndex;
              return (
                <div
                  key={section.n}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: `1px solid ${
                      current ? accentColor : done ? `${secondaryColor}88` : 'rgba(255,255,255,0.08)'
                    }`,
                    background: current ? `${accentColor}22` : done ? `${secondaryColor}18` : 'rgba(255,255,255,0.03)',
                    fontSize: 15,
                    fontWeight: 700,
                    color: current || done ? '#fdf6ff' : 'rgba(253,246,255,0.45)',
                  }}
                >
                  {done ? '✓ ' : `${section.n} `}
                  {section.title}
                </div>
              );
            })}
          </div>

          <div
            style={{
              flex: 1,
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              padding: 36,
              transform: `translateY(${(1 - sectionEnter) * 24}px)`,
              opacity: sectionEnter,
              display: 'flex',
              flexDirection: 'column',
              gap: 22,
            }}
          >
            <div style={{fontSize: 22, color: 'rgba(253,246,255,0.65)', fontWeight: 500}}>
              {active.blurb}
            </div>

            {activeIndex === 0 ? (
              <>
                <Field label="Business name" value={typedBiz} accentColor={accentColor} />
                <Field label="Your name & role" value={typedOwner} accentColor={accentColor} />
              </>
            ) : (
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  lineHeight: 1.25,
                  maxWidth: 900,
                }}
              >
                {activeIndex === 1 && 'Get phone calls · Show up on Google · Look credible'}
                {activeIndex === 2 && 'We design for the people you want to attract.'}
                {activeIndex === 3 && 'Clean & minimal · Modern & sleek · Trustworthy'}
                {activeIndex === 4 && 'Logo, brand colors, and photos — bring what you have.'}
                {activeIndex === 5 && 'Home · Services · Gallery · Contact / Booking'}
                {activeIndex === 6 && 'SEO is included. Tell us what customers search.'}
                {activeIndex === 7 && 'Domain, deadline, and anything else we should know.'}
              </div>
            )}
          </div>
        </div>
      </BrowserChrome>
    </AbsoluteFill>
  );
};

const Field: React.FC<{label: string; value: string; accentColor: string}> = ({
  label,
  value,
  accentColor,
}) => (
  <div>
    <div style={{fontSize: 16, marginBottom: 8, color: 'rgba(253,246,255,0.7)', fontWeight: 600}}>
      {label} <span style={{color: accentColor}}>*</span>
    </div>
    <div
      style={{
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.12)',
        background: '#0d0810',
        padding: '16px 18px',
        fontSize: 26,
        fontWeight: 600,
        minHeight: 58,
      }}
    >
      {value}
      <span style={{opacity: 0.45}}>|</span>
    </div>
  </div>
);
