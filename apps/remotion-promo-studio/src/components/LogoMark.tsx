import React from 'react';
import {AbsoluteFill} from 'remotion';

type LogoMarkProps = {
	color: string;
	size?: number;
};

export const LogoMark: React.FC<LogoMarkProps> = ({color, size = 160}) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 120 120"
			fill="none"
			aria-hidden
		>
			<rect x="8" y="8" width="104" height="104" rx="28" fill={color} />
			<path
				d="M34 78V42h14.5l17 24.5V42H80v36H65.5L48.5 53.5V78H34Z"
				fill="white"
			/>
			<circle cx="92" cy="28" r="8" fill="white" fillOpacity="0.35" />
		</svg>
	);
};

export const LogoBackdrop: React.FC<{
	primary: string;
	secondary: string;
}> = ({primary, secondary}) => {
	return (
		<AbsoluteFill
			style={{
				background: `
          radial-gradient(ellipse 80% 60% at 20% 30%, ${primary}22 0%, transparent 55%),
          radial-gradient(ellipse 70% 50% at 85% 70%, ${secondary}33 0%, transparent 50%),
          linear-gradient(165deg, #EEF3F1 0%, #E2EBE7 48%, #D3E0DB 100%)
        `,
			}}
		/>
	);
};
