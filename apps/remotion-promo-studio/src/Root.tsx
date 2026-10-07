import React from 'react';
import {Composition} from 'remotion';
import {ProductTeaser} from './ProductTeaser';
import './fonts';
import {productTeaserSchema} from './schema';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="ProductTeaser"
				component={ProductTeaser}
				durationInFrames={540}
				fps={30}
				width={1920}
				height={1080}
				schema={productTeaserSchema}
				defaultProps={{
					productName: 'Northline',
					tagline: 'Clarity for product launches',
					accentPrimary: '#0B6E4F',
					accentSecondary: '#E8A838',
				}}
			/>
		</>
	);
};
