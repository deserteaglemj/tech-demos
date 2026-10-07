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

export const CallToAction: React.FC<ProductTeaserProps> = ({
	productName,
	accentPrimary,
	accentSecondary,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const enter = spring({
		frame,
		fps,
		config: {damping: 14, stiffness: 120, mass: 0.7},
	});

	const pulse = interpolate(
		Math.sin((frame / fps) * Math.PI * 2),
		[-1, 1],
		[0.97, 1.03],
	);

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					opacity: enter,
					transform: `scale(${interpolate(enter, [0, 1], [0.88, 1]) * pulse})`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 32,
					textAlign: 'center',
				}}
			>
				<LogoMark color={accentPrimary} size={96} />
				<div
					style={{
						fontFamily: fontDisplay,
						fontWeight: 800,
						fontSize: 72,
						letterSpacing: '-0.03em',
						color: '#14201C',
						lineHeight: 1.05,
					}}
				>
					Start with {productName}
				</div>
				<div
					style={{
						fontFamily: fontBody,
						fontWeight: 500,
						fontSize: 28,
						color: '#3D524A',
					}}
				>
					Edit props in Studio · Preview instantly · Ship the cut
				</div>
				<div
					style={{
						marginTop: 8,
						padding: '18px 40px',
						borderRadius: 999,
						background: `linear-gradient(120deg, ${accentPrimary}, ${accentSecondary})`,
						color: 'white',
						fontFamily: fontBody,
						fontWeight: 700,
						fontSize: 26,
						letterSpacing: '0.02em',
						boxShadow: `0 18px 40px ${accentPrimary}44`,
					}}
				>
					Open in Remotion Studio
				</div>
			</div>
		</AbsoluteFill>
	);
};
