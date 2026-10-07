import {zColor} from '@remotion/zod-types';
import {z} from 'zod';

export const applySchema = z.object({
  brandName: z.string().describe('Studio brand shown in the walkthrough (e.g. M Studio).'),
  sampleBusiness: z
    .string()
    .describe('Example business name typed into the form demo.'),
  sampleOwner: z.string().describe('Example owner name typed into the form demo.'),
  accentColor: zColor().describe('Primary brand accent.'),
  secondaryColor: zColor().describe('Secondary accent for gradients.'),
  backgroundColor: zColor().describe('Base background color.'),
  startUrl: z.string().describe('URL shown in the browser chrome (e.g. mstudios.cc/start).'),
  ctaLabel: z.string().describe('Final CTA button label.'),
});

export type ApplyProps = z.infer<typeof applySchema>;
