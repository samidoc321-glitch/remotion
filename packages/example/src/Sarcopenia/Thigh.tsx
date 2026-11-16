import React from 'react';

const BUNDLE_VARIATION = [1, 0.92, 1.06, 0.95, 1.03, 0.9, 1.04];

// Cross-section of a thigh. `muscle` goes from 1 (healthy) to 0 (no muscle):
// muscle bundles shrink and separate while fat fills the gaps.
export const Thigh: React.FC<{
	readonly muscle: number;
	readonly size: number;
	readonly id: string;
}> = ({muscle, size, id}) => {
	return (
		<svg width={size} height={size * 0.9} viewBox="0 0 400 360">
			<defs>
				<pattern
					id={`${id}-fat`}
					width="16"
					height="14"
					patternUnits="userSpaceOnUse"
				>
					<rect width="16" height="14" fill="#f6d27a" />
					<ellipse
						cx="8"
						cy="7"
						rx="6"
						ry="5"
						fill="#fbe39f"
						stroke="#e2b54f"
					/>
				</pattern>
				<radialGradient id={`${id}-muscle`} cx="50%" cy="40%" r="70%">
					<stop offset="0%" stopColor="#e2382b" />
					<stop offset="100%" stopColor="#a8171a" />
				</radialGradient>
			</defs>
			<ellipse cx="200" cy="180" rx="178" ry="168" fill="#7a3f27" />
			<ellipse cx="200" cy="176" rx="166" ry="156" fill={`url(#${id}-fat)`} />
			<circle
				cx="200"
				cy="176"
				r={38 + 112 * muscle}
				fill={`url(#${id}-muscle)`}
				stroke="#f3dcc0"
				strokeWidth={3}
			/>
			{BUNDLE_VARIATION.map((v, i) => {
				const angle = (i / BUNDLE_VARIATION.length) * 360 - 90;
				const distance = 40 + 52 * muscle;
				const rad = (angle * Math.PI) / 180;
				return (
					<ellipse
						key={i}
						cx={200 + Math.cos(rad) * distance}
						cy={176 + Math.sin(rad) * distance}
						rx={(20 + 40 * muscle) * v}
						ry={(15 + 36 * muscle) * v}
						transform={`rotate(${angle} ${200 + Math.cos(rad) * distance} ${
							176 + Math.sin(rad) * distance
						})`}
						fill={`url(#${id}-muscle)`}
						stroke="#f3dcc0"
						strokeWidth={3}
					/>
				);
			})}
			<circle
				cx="200"
				cy="176"
				r="30"
				fill="#f4ead8"
				stroke="#d9c7a6"
				strokeWidth={3}
			/>
			<circle cx="200" cy="176" r="13" fill="#b58b5a" />
		</svg>
	);
};
