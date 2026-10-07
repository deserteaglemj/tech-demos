import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

export const productTeaserSchema = z.object({
	productName: z.string().describe('Brand / product name shown throughout the teaser'),
	tagline: z.string().describe('Optional supporting line under the product name'),
	accentPrimary: zColor().describe('Primary brand accent'),
	accentSecondary: zColor().describe('Secondary accent for highlights and CTA'),
});

export type ProductTeaserProps = z.infer<typeof productTeaserSchema>;

export const defaultTeaserProps: ProductTeaserProps = {
	productName: 'Northline',
	tagline: 'Clarity for product launches',
	accentPrimary: '#0B6E4F',
	accentSecondary: '#E8A838',
};
