import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {LogoBackdrop} from './components/LogoMark';
import type {ProductTeaserProps} from './schema';
import {CallToAction} from './scenes/CallToAction';
import {FeatureBeat} from './scenes/FeatureBeat';
import {LogoSting} from './scenes/LogoSting';

/**
 * Timeline (30 fps, 18s = 540 frames):
 * 0–60     Logo sting
 * 60–165   Feature 1
 * 165–270  Feature 2
 * 270–375  Feature 3
 * 375–540  CTA
 */
export const ProductTeaser: React.FC<ProductTeaserProps> = (props) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const fadeOut = interpolate(
		frame,
		[durationInFrames - 18, durationInFrames - 1],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);

	const features = [
		{
			title: 'Props drive the brand',
			detail:
				'Swap product name and accent colors in Studio — the whole cut updates live.',
			accent: props.accentPrimary,
		},
		{
			title: 'Beats that sell the story',
			detail:
				'Three short feature moments keep the teaser tight and demable in one sitting.',
			accent: props.accentSecondary,
		},
		{
			title: 'Ready for a real cut',
			detail:
				'Built as a Remotion composition — preview now, render later when you need an MP4.',
			accent: props.accentPrimary,
		},
	] as const;

	return (
		<AbsoluteFill style={{opacity: fadeOut}}>
			<LogoBackdrop
				primary={props.accentPrimary}
				secondary={props.accentSecondary}
			/>

			<Sequence durationInFrames={60}>
				<LogoSting {...props} />
			</Sequence>

			{features.map((feature, i) => (
				<Sequence key={feature.title} from={60 + i * 105} durationInFrames={105}>
					<FeatureBeat
						index={i + 1}
						title={feature.title}
						detail={feature.detail}
						accent={feature.accent}
						secondary={props.accentSecondary}
					/>
				</Sequence>
			))}

			<Sequence from={375} durationInFrames={165}>
				<CallToAction {...props} />
			</Sequence>
		</AbsoluteFill>
	);
};
