import React from 'react';
import {Composition} from 'remotion';
import {ProductTeaser} from './ProductTeaser';
import {defaultTeaserProps, productTeaserSchema} from './schema';

export const ProductTeaserComposition: React.FC = () => {
	return (
		<Composition
			id="ProductTeaser"
			component={ProductTeaser}
			durationInFrames={540}
			fps={30}
			width={1920}
			height={1080}
			schema={productTeaserSchema}
			defaultProps={defaultTeaserProps}
		/>
	);
};
