import type {TeaserProps} from './schema';

// Defaults mirror the live M Studio brand on https://www.mstudios.cc
// (Vercel project: mstudios-new) — pink/purple on near-black, Syne display.
export const defaultTeaserProps: TeaserProps = {
  productName: 'M Studio',
  tagline: 'See a working demo before you pay a cent.',
  ctaLabel: 'Get Your Free Demo',
  accentColor: '#f06292',
  secondaryColor: '#9c27b0',
  backgroundColor: '#080608',
  features: [
    {
      mark: '01',
      title: 'Design & Build',
      description: 'Custom websites from scratch for local businesses and national brands.',
    },
    {
      mark: '02',
      title: 'Get Found',
      description: 'SEO, Google Business Profile, and AI search built into every launch.',
    },
    {
      mark: '03',
      title: 'Keep Growing',
      description: 'Monthly care for updates, speed, and rankings long after launch.',
    },
  ],
};
