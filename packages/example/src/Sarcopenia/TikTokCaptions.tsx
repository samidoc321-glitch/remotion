import type {Caption} from '@remotion/captions';
import {createTikTokStyleCaptions} from '@remotion/captions';
import React, {useMemo} from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

// TikTok-style captions: short pages, the word being spoken is highlighted.
export const TikTokCaptions: React.FC<{
	readonly captions: Caption[];
}> = ({captions}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {pages} = useMemo(
		() =>
			createTikTokStyleCaptions({
				captions,
				combineTokensWithinMilliseconds: 900,
			}),
		[captions],
	);
	const timeMs = (frame / fps) * 1000;
	const page = pages.find(
		(p) => timeMs >= p.startMs && timeMs < p.startMs + p.durationMs,
	);
	if (!page) {
		return null;
	}

	const enter = spring({
		frame: frame - Math.round((page.startMs / 1000) * fps),
		fps,
		config: {damping: 14, stiffness: 220},
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: 80,
				right: 80,
				bottom: 380,
				display: 'flex',
				justifyContent: 'center',
				flexWrap: 'wrap',
				columnGap: 6,
				rowGap: 6,
				textAlign: 'center',
				fontSize: 64,
				fontWeight: 900,
				lineHeight: 1.15,
				textTransform: 'uppercase',
				transform: `scale(${0.85 + 0.15 * enter})`,
			}}
		>
			{page.tokens.map((token) => {
				const active = timeMs >= token.fromMs && timeMs < token.toMs;
				return (
					<span
						key={token.fromMs}
						style={{
							color: active ? '#141414' : 'white',
							background: active ? '#f7c51e' : '#141414',
							borderRadius: 14,
							padding: '6px 16px',
						}}
					>
						{token.text.trim()}
					</span>
				);
			})}
		</div>
	);
};
