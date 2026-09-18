import type {TeaserProps} from './schema';

export const defaultTeaserProps: TeaserProps = {
  productName: 'Nimbus',
  tagline: 'Ship faster, worry less.',
  accentColor: '#7C5CFC',
  secondaryColor: '#00D2C6',
  backgroundColor: '#0B0B12',
  features: [
    {
      emoji: '⚡',
      title: 'Instant Sync',
      description: 'Real-time updates across every device, automatically.',
    },
    {
      emoji: '🔒',
      title: 'Bank-grade Security',
      description: 'End-to-end encryption on every byte, always on.',
    },
    {
      emoji: '📈',
      title: 'Smart Insights',
      description: 'Analytics that surface what matters, not just charts.',
    },
  ],
};
