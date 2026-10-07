import type {TeaserProps} from './schema';

export const defaultTeaserProps: TeaserProps = {
  productName: 'Nimbus',
  tagline: 'Ship faster, worry less.',
  accentColor: '#2DD4BF',
  secondaryColor: '#F97316',
  backgroundColor: '#07131A',
  features: [
    {
      mark: '01',
      title: 'Instant Sync',
      description: 'Real-time updates across every device, automatically.',
    },
    {
      mark: '02',
      title: 'Bank-grade Security',
      description: 'End-to-end encryption on every byte, always on.',
    },
    {
      mark: '03',
      title: 'Smart Insights',
      description: 'Analytics that surface what matters, not just charts.',
    },
  ],
};
