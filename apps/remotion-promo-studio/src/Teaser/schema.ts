import {zColor} from '@remotion/zod-types';
import {z} from 'zod';

export const featureSchema = z.object({
  emoji: z.string().describe('A single emoji used as the feature icon.'),
  title: z.string().describe('Short feature name, e.g. "Instant Sync".'),
  description: z
    .string()
    .describe('One short sentence describing the feature benefit.'),
});

export const teaserSchema = z.object({
  productName: z.string().describe('The product/brand name shown in the logo sting and CTA.'),
  tagline: z.string().describe('Short tagline shown above the call-to-action button.'),
  accentColor: zColor().describe('Primary brand accent color.'),
  secondaryColor: zColor().describe('Secondary accent color used for gradients and rings.'),
  backgroundColor: zColor().describe('Base background color of the whole video.'),
  features: z
    .array(featureSchema)
    .min(1)
    .max(4)
    .describe('The feature beats shown between the logo sting and the CTA.'),
});

export type Feature = z.infer<typeof featureSchema>;
export type TeaserProps = z.infer<typeof teaserSchema>;
