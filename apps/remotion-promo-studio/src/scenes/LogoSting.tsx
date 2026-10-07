import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {LogoMark} from '../components/LogoMark';
import {fontBody, fontDisplay} from '../fonts';
import type {ProductTeaserProps} from '../schema';

export const LogoSting: React.FC<ProductTeaserProps> = ({
	productName,
	tagline,
	accentPrimary,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const enter = spring({
		frame,
		fps,
		config: {damping: 14, stiffness: 120, mass: 0.7},
	});

	const scale = interpolate(enter, [0, 1], [0.6, 1]);
	const opacity = interpolate(enter, [0, 1], [0, 1]);
	const nameY = interpolate(enter, [0, 1], [28, 0]);

	const tagEnter = spring({
		frame: frame - 12,
		fps,
		config: {damping: 18, stiffness: 100},
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				gap: 28,
			}}
		>
			<div
				style={{
					transform: `scale(${scale})`,
					opacity,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 28,
				}}
			>
				<LogoMark color={accentPrimary} size={148} />
				<div
					style={{
						transform: `translateY(${nameY}px)`,
						textAlign: 'center',
					}}
				>
					<div
						style={{
							fontFamily: fontDisplay,
							fontWeight: 800,
							fontSize: 92,
							letterSpacing: '-0.03em',
							color: '#14201C',
							lineHeight: 1,
						}}
					>
						{productName}
					</div>
					{tagline ? (
						<div
							style={{
								fontFamily: fontBody,
								fontWeight: 500,
								fontSize: 28,
								color: '#3D524A',
								marginTop: 16,
								opacity: tagEnter,
								transform: `translateY(${interpolate(tagEnter, [0, 1], [12, 0])}px)`,
							}}
						>
							{tagline}
						</div>
					) : null}
				</div>
			</div>
		</AbsoluteFill>
	);
};
