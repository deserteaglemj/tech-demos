import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {fontBody, fontDisplay} from '../fonts';

export type FeatureBeatProps = {
	index: number;
	title: string;
	detail: string;
	accent: string;
	secondary: string;
};

export const FeatureBeat: React.FC<FeatureBeatProps> = ({
	index,
	title,
	detail,
	accent,
	secondary,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const enter = spring({
		frame,
		fps,
		config: {damping: 16, stiffness: 110, mass: 0.75},
	});

	const barWidth = interpolate(enter, [0, 1], [0, 100]);
	const slideX = interpolate(enter, [0, 1], [80, 0]);
	const detailEnter = spring({
		frame: frame - 8,
		fps,
		config: {damping: 20, stiffness: 100},
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				padding: '0 120px',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 22,
					transform: `translateX(${slideX}px)`,
					opacity: enter,
					maxWidth: 980,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 18,
					}}
				>
					<div
						style={{
							width: 54,
							height: 54,
							borderRadius: 16,
							background: `linear-gradient(135deg, ${accent}, ${secondary})`,
							color: 'white',
							fontFamily: fontDisplay,
							fontWeight: 800,
							fontSize: 26,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						{index}
					</div>
					<div
						style={{
							height: 4,
							width: `${barWidth}%`,
							maxWidth: 280,
							borderRadius: 999,
							background: accent,
							opacity: 0.85,
						}}
					/>
				</div>
				<div
					style={{
						fontFamily: fontDisplay,
						fontWeight: 800,
						fontSize: 78,
						letterSpacing: '-0.03em',
						color: '#14201C',
						lineHeight: 1.05,
					}}
				>
					{title}
				</div>
				<div
					style={{
						fontFamily: fontBody,
						fontWeight: 500,
						fontSize: 32,
						color: '#3D524A',
						maxWidth: 720,
						lineHeight: 1.35,
						opacity: detailEnter,
						transform: `translateY(${interpolate(detailEnter, [0, 1], [16, 0])}px)`,
					}}
				>
					{detail}
				</div>
			</div>
		</AbsoluteFill>
	);
};
