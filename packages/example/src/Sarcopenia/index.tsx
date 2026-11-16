import {loadFont} from '@remotion/google-fonts/Montserrat';
import {Audio} from '@remotion/media';
import React from 'react';
import {
	AbsoluteFill,
	Easing,
	interpolate,
	Sequence,
	spring,
	staticFile,
	Track,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Thigh} from './Thigh';
import {TikTokCaptions} from './TikTokCaptions';

const {fontFamily} = loadFont('normal', {
	weights: ['600', '800', '900'],
	subsets: ['latin'],
});

const YELLOW = '#f7c51e';
const INK = '#141414';

const Pill: React.FC<{
	readonly children: React.ReactNode;
	readonly dark: boolean;
}> = ({children, dark}) => (
	<div
		style={{
			background: dark ? INK : YELLOW,
			color: dark ? 'white' : INK,
			borderRadius: 26,
			padding: '14px 36px',
			fontWeight: 800,
			fontSize: 48,
		}}
	>
		{children}
	</div>
);

// Fades a scene in and out over its own duration.
const SceneFade: React.FC<{readonly children: React.ReactNode}> = ({
	children,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const opacity = interpolate(
		frame,
		[0, 10, durationInFrames - 10, durationInFrames],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	return (
		<AbsoluteFill
			style={{
				opacity,
				alignItems: 'center',
				justifyContent: 'center',
				padding: '150px 80px 600px',
				textAlign: 'center',
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

const Intro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const pop = spring({frame, fps, config: {damping: 12}});
	const line = interpolate(frame, [10, 35], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const sub = spring({frame: frame - 25, fps, config: {damping: 200}});
	return (
		<SceneFade>
			<div style={{display: 'flex', alignItems: 'center', gap: 24}}>
				<div style={{width: 50 * line, height: 8, background: YELLOW}} />
				<div
					style={{fontSize: 116, fontWeight: 900, transform: `scale(${pop})`}}
				>
					SARCOPENIA
				</div>
				<div style={{width: 50 * line, height: 8, background: YELLOW}} />
			</div>
			<div
				style={{
					marginTop: 50,
					fontSize: 60,
					fontWeight: 600,
					opacity: sub,
					transform: `translateY(${(1 - sub) * 40}px)`,
				}}
			>
				¿Por qué perdemos músculo
				<br />
				al envejecer?
			</div>
		</SceneFade>
	);
};

const WhatIsIt: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const muscle = interpolate(frame, [40, 240], [1, 0.45], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.quad),
	});
	const percent = Math.round(interpolate(muscle, [0.45, 1], [40, 0]));
	const textIn = spring({frame: frame - 5, fps, config: {damping: 200}});
	return (
		<SceneFade>
			<div
				style={{
					opacity: textIn,
					fontSize: 64,
					fontWeight: 800,
					lineHeight: 1.2,
				}}
			>
				Es la pérdida progresiva de{' '}
				<span style={{background: YELLOW, padding: '0 12px'}}>
					masa y fuerza
				</span>{' '}
				muscular
			</div>
			<div style={{margin: '40px 0'}}>
				<Thigh id="what" muscle={muscle} size={600} />
			</div>
			<div style={{display: 'flex', gap: 30, alignItems: 'center'}}>
				<Pill dark>−{percent}% músculo</Pill>
			</div>
			<div style={{marginTop: 40, fontSize: 46, fontWeight: 600}}>
				Desde los 30 años: hasta un 3–8% menos por década
			</div>
		</SceneFade>
	);
};

const CAUSES = [
	{
		emoji: '🧠',
		title: 'Menos neuronas motoras',
		text: 'Las fibras rápidas (tipo II) se desconectan y se atrofian',
	},
	{
		emoji: '🧬',
		title: 'Menos hormonas anabólicas',
		text: 'Baja la testosterona, la GH y la síntesis de proteína',
	},
	{
		emoji: '🔥',
		title: 'Inflamación crónica',
		text: 'Favorece la degradación del tejido muscular',
	},
	{
		emoji: '🛋️',
		title: 'Sedentarismo',
		text: 'Sin estímulo, la grasa infiltra el músculo',
	},
];

const Causes: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<SceneFade>
			<div style={{fontSize: 84, fontWeight: 900, marginBottom: 40}}>
				¿Cómo se produce?
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 22,
					width: '100%',
				}}
			>
				{CAUSES.map((cause, i) => {
					const s = spring({
						frame: frame - [43, 123, 176, 249][i],
						fps,
						config: {damping: 14},
					});
					return (
						<div
							key={cause.title}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 34,
								background: 'white',
								borderLeft: `14px solid ${YELLOW}`,
								borderRadius: 24,
								padding: '22px 36px',
								boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
								textAlign: 'left',
								opacity: s,
								transform: `translateX(${(1 - s) * 300}px)`,
							}}
						>
							<div style={{fontSize: 76}}>{cause.emoji}</div>
							<div>
								<div style={{fontSize: 50, fontWeight: 800}}>{cause.title}</div>
								<div
									style={{
										fontSize: 40,
										fontWeight: 600,
										color: '#555',
										marginTop: 8,
									}}
								>
									{cause.text}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</SceneFade>
	);
};

const Comparison: React.FC = () => {
	const frame = useCurrentFrame();
	const progress = interpolate(frame, [40, 220], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.quad),
	});
	const age = Math.round(35 + progress * 50);
	return (
		<SceneFade>
			<div style={{fontSize: 76, fontWeight: 900, marginBottom: 70}}>
				El ejercicio lo cambia todo
			</div>
			<div style={{display: 'flex', gap: 40, justifyContent: 'center'}}>
				{[
					{label: 'SEDENTARIO', muscle: 1 - progress * 0.85, id: 'sed'},
					{label: 'ACTIVO', muscle: 1 - progress * 0.2, id: 'act'},
				].map((side) => (
					<div
						key={side.id}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 36,
						}}
					>
						<Pill dark={false}>{side.label}</Pill>
						<Thigh id={side.id} muscle={side.muscle} size={450} />
					</div>
				))}
			</div>
			<div
				style={{
					marginTop: 70,
					background: INK,
					color: 'white',
					border: `8px solid ${YELLOW}`,
					borderRadius: 30,
					padding: '20px 50px',
					fontSize: 96,
					fontWeight: 900,
					fontVariantNumeric: 'tabular-nums',
				}}
			>
				{age} AÑOS
			</div>
		</SceneFade>
	);
};

const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = spring({frame, fps, config: {damping: 12}});
	const b = spring({frame: frame - 20, fps, config: {damping: 200}});
	return (
		<SceneFade>
			<div
				style={{
					fontSize: 90,
					fontWeight: 900,
					transform: `scale(${a})`,
					lineHeight: 1.15,
				}}
			>
				💪 Nunca es tarde
				<br />
				para ganar músculo
			</div>
			<div
				style={{
					marginTop: 70,
					opacity: b,
					display: 'flex',
					flexDirection: 'column',
					gap: 30,
					alignItems: 'center',
				}}
			>
				<Pill dark={false}>Fuerza 2–3 veces por semana</Pill>
				<Pill dark>Proteína en cada comida</Pill>
			</div>
		</SceneFade>
	);
};

// Closing card with the author's signature.
const Signature: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const draw = interpolate(frame, [0, 30], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const name = spring({frame: frame - 12, fps, config: {damping: 200}});
	const role = spring({frame: frame - 22, fps, config: {damping: 200}});
	return (
		<AbsoluteFill
			style={{
				background: 'radial-gradient(circle at 50% 45%, #1b2a55, #070b18 70%)',
				color: 'white',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'row',
				gap: 36,
				opacity: interpolate(frame, [0, 8], [0, 1], {
					extrapolateRight: 'clamp',
				}),
			}}
		>
			<svg width={150} height={260} viewBox="0 0 60 104">
				<path
					d="M30 4 V100"
					stroke="white"
					strokeWidth={5}
					strokeLinecap="round"
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={draw}
				/>
				<path
					d="M30 22 C10 26 10 38 30 42 C50 46 50 58 30 62 C10 66 10 78 30 82"
					stroke="#f7c51e"
					strokeWidth={5}
					fill="none"
					strokeLinecap="round"
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={draw}
				/>
				<circle cx="30" cy="16" r="6" fill="#f7c51e" opacity={1 - draw} />
			</svg>
			<div style={{textAlign: 'left'}}>
				<div
					style={{
						fontSize: 92,
						fontWeight: 900,
						lineHeight: 1,
						opacity: name,
						transform: `translateX(${(1 - name) * 60}px)`,
					}}
				>
					Samuel
					<br />
					Mendoza
				</div>
				<div
					style={{
						marginTop: 18,
						fontSize: 44,
						fontWeight: 600,
						color: '#f7c51e',
						opacity: role,
						transform: `translateX(${(1 - role) * 60}px)`,
					}}
				>
					Estudiante de Medicina
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const Sarcopenia: React.FC = () => {
	return (
		<AbsoluteFill style={{background: '#faf7f0', color: INK, fontFamily}}>
			<Track name="Escenas">
				<Sequence name="Intro" durationInFrames={127}>
					<Intro />
				</Sequence>
				<Sequence name="Qué es" from={127} durationInFrames={283}>
					<WhatIsIt />
				</Sequence>
				<Sequence name="Causas" from={410} durationInFrames={336}>
					<Causes />
				</Sequence>
				<Sequence name="Comparación" from={746} durationInFrames={264}>
					<Comparison />
				</Sequence>
				<Sequence name="Cierre" from={1010} durationInFrames={185}>
					<Outro />
				</Sequence>
				<Sequence name="Firma" from={1195} durationInFrames={80}>
					<Signature />
				</Sequence>
			</Track>
			<Track name="Subtítulos">
				<Sequence name="Subtítulos intro" from={8} durationInFrames={112}>
					<TikTokCaptions
						captions={[
							{
								text: ' ¿Por',
								startMs: 90,
								endMs: 329,
								timestampMs: 209,
								confidence: null,
							},
							{
								text: ' qué',
								startMs: 329,
								endMs: 568,
								timestampMs: 448,
								confidence: null,
							},
							{
								text: ' perdemos',
								startMs: 568,
								endMs: 1045,
								timestampMs: 806,
								confidence: null,
							},
							{
								text: ' músculo',
								startMs: 1045,
								endMs: 1475,
								timestampMs: 1260,
								confidence: null,
							},
							{
								text: ' al',
								startMs: 1475,
								endMs: 1666,
								timestampMs: 1571,
								confidence: null,
							},
							{
								text: ' envejecer?',
								startMs: 1666,
								endMs: 2191,
								timestampMs: 1929,
								confidence: null,
							},
							{
								text: ' Se',
								startMs: 2441,
								endMs: 2633,
								timestampMs: 2537,
								confidence: null,
							},
							{
								text: ' llama',
								startMs: 2633,
								endMs: 2967,
								timestampMs: 2800,
								confidence: null,
							},
							{
								text: ' sarcopenia.',
								startMs: 2967,
								endMs: 3540,
								timestampMs: 3253,
								confidence: null,
							},
						]}
					/>
				</Sequence>
				<Sequence name="Subtítulos qué es" from={135} durationInFrames={269}>
					<TikTokCaptions
						captions={[
							{
								text: ' Es',
								startMs: 60,
								endMs: 244,
								timestampMs: 152,
								confidence: null,
							},
							{
								text: ' la',
								startMs: 244,
								endMs: 427,
								timestampMs: 335,
								confidence: null,
							},
							{
								text: ' pérdida',
								startMs: 427,
								endMs: 840,
								timestampMs: 633,
								confidence: null,
							},
							{
								text: ' progresiva',
								startMs: 840,
								endMs: 1390,
								timestampMs: 1115,
								confidence: null,
							},
							{
								text: ' de',
								startMs: 1390,
								endMs: 1574,
								timestampMs: 1482,
								confidence: null,
							},
							{
								text: ' masa',
								startMs: 1574,
								endMs: 1849,
								timestampMs: 1712,
								confidence: null,
							},
							{
								text: ' y',
								startMs: 1849,
								endMs: 1987,
								timestampMs: 1918,
								confidence: null,
							},
							{
								text: ' fuerza',
								startMs: 1987,
								endMs: 2354,
								timestampMs: 2170,
								confidence: null,
							},
							{
								text: ' muscular.',
								startMs: 2354,
								endMs: 2813,
								timestampMs: 2583,
								confidence: null,
							},
							{
								text: ' A',
								startMs: 3063,
								endMs: 3200,
								timestampMs: 3132,
								confidence: null,
							},
							{
								text: ' partir',
								startMs: 3200,
								endMs: 3567,
								timestampMs: 3384,
								confidence: null,
							},
							{
								text: ' de',
								startMs: 3567,
								endMs: 3751,
								timestampMs: 3659,
								confidence: null,
							},
							{
								text: ' los',
								startMs: 3751,
								endMs: 3980,
								timestampMs: 3866,
								confidence: null,
							},
							{
								text: ' treinta',
								startMs: 3980,
								endMs: 4393,
								timestampMs: 4187,
								confidence: null,
							},
							{
								text: ' años,',
								startMs: 4393,
								endMs: 4669,
								timestampMs: 4531,
								confidence: null,
							},
							{
								text: ' podemos',
								startMs: 4789,
								endMs: 5201,
								timestampMs: 4995,
								confidence: null,
							},
							{
								text: ' perder',
								startMs: 5201,
								endMs: 5568,
								timestampMs: 5385,
								confidence: null,
							},
							{
								text: ' entre',
								startMs: 5568,
								endMs: 5890,
								timestampMs: 5729,
								confidence: null,
							},
							{
								text: ' un',
								startMs: 5890,
								endMs: 6073,
								timestampMs: 5981,
								confidence: null,
							},
							{
								text: ' tres',
								startMs: 6073,
								endMs: 6348,
								timestampMs: 6211,
								confidence: null,
							},
							{
								text: ' y',
								startMs: 6348,
								endMs: 6486,
								timestampMs: 6417,
								confidence: null,
							},
							{
								text: ' un',
								startMs: 6486,
								endMs: 6670,
								timestampMs: 6578,
								confidence: null,
							},
							{
								text: ' ocho',
								startMs: 6670,
								endMs: 6945,
								timestampMs: 6807,
								confidence: null,
							},
							{
								text: ' por',
								startMs: 6945,
								endMs: 7174,
								timestampMs: 7060,
								confidence: null,
							},
							{
								text: ' ciento',
								startMs: 7174,
								endMs: 7541,
								timestampMs: 7358,
								confidence: null,
							},
							{
								text: ' de',
								startMs: 7541,
								endMs: 7725,
								timestampMs: 7633,
								confidence: null,
							},
							{
								text: ' músculo',
								startMs: 7725,
								endMs: 8138,
								timestampMs: 7931,
								confidence: null,
							},
							{
								text: ' cada',
								startMs: 8138,
								endMs: 8413,
								timestampMs: 8275,
								confidence: null,
							},
							{
								text: ' década.',
								startMs: 8413,
								endMs: 8780,
								timestampMs: 8596,
								confidence: null,
							},
						]}
					/>
				</Sequence>
				<Sequence name="Subtítulos causas" from={418} durationInFrames={323}>
					<TikTokCaptions
						captions={[
							{
								text: ' ¿Cómo',
								startMs: 90,
								endMs: 367,
								timestampMs: 229,
								confidence: null,
							},
							{
								text: ' se',
								startMs: 367,
								endMs: 552,
								timestampMs: 460,
								confidence: null,
							},
							{
								text: ' produce?',
								startMs: 552,
								endMs: 968,
								timestampMs: 760,
								confidence: null,
							},
							{
								text: ' Perdemos',
								startMs: 1218,
								endMs: 1680,
								timestampMs: 1449,
								confidence: null,
							},
							{
								text: ' neuronas',
								startMs: 1680,
								endMs: 2142,
								timestampMs: 1911,
								confidence: null,
							},
							{
								text: ' motoras',
								startMs: 2142,
								endMs: 2557,
								timestampMs: 2349,
								confidence: null,
							},
							{
								text: ' y',
								startMs: 2557,
								endMs: 2696,
								timestampMs: 2627,
								confidence: null,
							},
							{
								text: ' fibras',
								startMs: 2696,
								endMs: 3066,
								timestampMs: 2881,
								confidence: null,
							},
							{
								text: ' rápidas.',
								startMs: 3066,
								endMs: 3481,
								timestampMs: 3273,
								confidence: null,
							},
							{
								text: ' Bajan',
								startMs: 3731,
								endMs: 4055,
								timestampMs: 3893,
								confidence: null,
							},
							{
								text: ' las',
								startMs: 4055,
								endMs: 4286,
								timestampMs: 4170,
								confidence: null,
							},
							{
								text: ' hormonas',
								startMs: 4286,
								endMs: 4748,
								timestampMs: 4517,
								confidence: null,
							},
							{
								text: ' anabólicas.',
								startMs: 4748,
								endMs: 5302,
								timestampMs: 5025,
								confidence: null,
							},
							{
								text: ' La',
								startMs: 5552,
								endMs: 5737,
								timestampMs: 5644,
								confidence: null,
							},
							{
								text: ' inflamación',
								startMs: 5737,
								endMs: 6337,
								timestampMs: 6037,
								confidence: null,
							},
							{
								text: ' crónica',
								startMs: 6337,
								endMs: 6753,
								timestampMs: 6545,
								confidence: null,
							},
							{
								text: ' degrada',
								startMs: 6753,
								endMs: 7169,
								timestampMs: 6961,
								confidence: null,
							},
							{
								text: ' el',
								startMs: 7169,
								endMs: 7354,
								timestampMs: 7261,
								confidence: null,
							},
							{
								text: ' músculo.',
								startMs: 7354,
								endMs: 7769,
								timestampMs: 7561,
								confidence: null,
							},
							{
								text: ' Y',
								startMs: 8019,
								endMs: 8158,
								timestampMs: 8089,
								confidence: null,
							},
							{
								text: ' el',
								startMs: 8158,
								endMs: 8343,
								timestampMs: 8250,
								confidence: null,
							},
							{
								text: ' sedentarismo',
								startMs: 8343,
								endMs: 8989,
								timestampMs: 8666,
								confidence: null,
							},
							{
								text: ' deja',
								startMs: 8989,
								endMs: 9267,
								timestampMs: 9128,
								confidence: null,
							},
							{
								text: ' que',
								startMs: 9267,
								endMs: 9498,
								timestampMs: 9382,
								confidence: null,
							},
							{
								text: ' la',
								startMs: 9498,
								endMs: 9682,
								timestampMs: 9590,
								confidence: null,
							},
							{
								text: ' grasa',
								startMs: 9682,
								endMs: 10006,
								timestampMs: 9844,
								confidence: null,
							},
							{
								text: ' lo',
								startMs: 10006,
								endMs: 10190,
								timestampMs: 10098,
								confidence: null,
							},
							{
								text: ' invada.',
								startMs: 10190,
								endMs: 10560,
								timestampMs: 10375,
								confidence: null,
							},
						]}
					/>
				</Sequence>
				<Sequence
					name="Subtítulos comparación"
					from={754}
					durationInFrames={250}
				>
					<TikTokCaptions
						captions={[
							{
								text: ' Mira',
								startMs: 70,
								endMs: 345,
								timestampMs: 208,
								confidence: null,
							},
							{
								text: ' la',
								startMs: 345,
								endMs: 529,
								timestampMs: 437,
								confidence: null,
							},
							{
								text: ' diferencia.',
								startMs: 529,
								endMs: 1079,
								timestampMs: 804,
								confidence: null,
							},
							{
								text: ' A',
								startMs: 1329,
								endMs: 1467,
								timestampMs: 1398,
								confidence: null,
							},
							{
								text: ' los',
								startMs: 1467,
								endMs: 1696,
								timestampMs: 1582,
								confidence: null,
							},
							{
								text: ' ochenta',
								startMs: 1696,
								endMs: 2109,
								timestampMs: 1903,
								confidence: null,
							},
							{
								text: ' y',
								startMs: 2109,
								endMs: 2247,
								timestampMs: 2178,
								confidence: null,
							},
							{
								text: ' cinco',
								startMs: 2247,
								endMs: 2568,
								timestampMs: 2407,
								confidence: null,
							},
							{
								text: ' años,',
								startMs: 2568,
								endMs: 2843,
								timestampMs: 2706,
								confidence: null,
							},
							{
								text: ' una',
								startMs: 2963,
								endMs: 3192,
								timestampMs: 3078,
								confidence: null,
							},
							{
								text: ' persona',
								startMs: 3192,
								endMs: 3605,
								timestampMs: 3399,
								confidence: null,
							},
							{
								text: ' sedentaria',
								startMs: 3605,
								endMs: 4156,
								timestampMs: 3881,
								confidence: null,
							},
							{
								text: ' ha',
								startMs: 4156,
								endMs: 4339,
								timestampMs: 4248,
								confidence: null,
							},
							{
								text: ' perdido',
								startMs: 4339,
								endMs: 4752,
								timestampMs: 4546,
								confidence: null,
							},
							{
								text: ' gran',
								startMs: 4752,
								endMs: 5028,
								timestampMs: 4890,
								confidence: null,
							},
							{
								text: ' parte',
								startMs: 5028,
								endMs: 5349,
								timestampMs: 5188,
								confidence: null,
							},
							{
								text: ' de',
								startMs: 5349,
								endMs: 5532,
								timestampMs: 5440,
								confidence: null,
							},
							{
								text: ' su',
								startMs: 5532,
								endMs: 5716,
								timestampMs: 5624,
								confidence: null,
							},
							{
								text: ' músculo.',
								startMs: 5716,
								endMs: 6129,
								timestampMs: 5922,
								confidence: null,
							},
							{
								text: ' Una',
								startMs: 6379,
								endMs: 6608,
								timestampMs: 6493,
								confidence: null,
							},
							{
								text: ' persona',
								startMs: 6608,
								endMs: 7021,
								timestampMs: 6814,
								confidence: null,
							},
							{
								text: ' activa,',
								startMs: 7021,
								endMs: 7388,
								timestampMs: 7204,
								confidence: null,
							},
							{
								text: ' lo',
								startMs: 7508,
								endMs: 7691,
								timestampMs: 7600,
								confidence: null,
							},
							{
								text: ' conserva.',
								startMs: 7691,
								endMs: 8150,
								timestampMs: 7921,
								confidence: null,
							},
						]}
					/>
				</Sequence>
				<Sequence name="Subtítulos cierre" from={1018} durationInFrames={166}>
					<TikTokCaptions
						captions={[
							{
								text: ' Nunca',
								startMs: 40,
								endMs: 366,
								timestampMs: 203,
								confidence: null,
							},
							{
								text: ' es',
								startMs: 366,
								endMs: 552,
								timestampMs: 459,
								confidence: null,
							},
							{
								text: ' tarde.',
								startMs: 552,
								endMs: 877,
								timestampMs: 714,
								confidence: null,
							},
							{
								text: ' Entrena',
								startMs: 1127,
								endMs: 1546,
								timestampMs: 1336,
								confidence: null,
							},
							{
								text: ' fuerza',
								startMs: 1546,
								endMs: 1918,
								timestampMs: 1732,
								confidence: null,
							},
							{
								text: ' dos',
								startMs: 1918,
								endMs: 2150,
								timestampMs: 2034,
								confidence: null,
							},
							{
								text: ' o',
								startMs: 2150,
								endMs: 2290,
								timestampMs: 2220,
								confidence: null,
							},
							{
								text: ' tres',
								startMs: 2290,
								endMs: 2569,
								timestampMs: 2429,
								confidence: null,
							},
							{
								text: ' veces',
								startMs: 2569,
								endMs: 2895,
								timestampMs: 2732,
								confidence: null,
							},
							{
								text: ' por',
								startMs: 2895,
								endMs: 3127,
								timestampMs: 3011,
								confidence: null,
							},
							{
								text: ' semana,',
								startMs: 3127,
								endMs: 3499,
								timestampMs: 3313,
								confidence: null,
							},
							{
								text: ' y',
								startMs: 3619,
								endMs: 3759,
								timestampMs: 3689,
								confidence: null,
							},
							{
								text: ' come',
								startMs: 3759,
								endMs: 4038,
								timestampMs: 3898,
								confidence: null,
							},
							{
								text: ' proteína',
								startMs: 4038,
								endMs: 4503,
								timestampMs: 4270,
								confidence: null,
							},
							{
								text: ' en',
								startMs: 4503,
								endMs: 4689,
								timestampMs: 4596,
								confidence: null,
							},
							{
								text: ' cada',
								startMs: 4689,
								endMs: 4968,
								timestampMs: 4828,
								confidence: null,
							},
							{
								text: ' comida.',
								startMs: 4968,
								endMs: 5340,
								timestampMs: 5154,
								confidence: null,
							},
						]}
					/>
				</Sequence>
			</Track>
			<Track name="Voz">
				<Audio
					name="Voz intro"
					src={staticFile('sarcopenia/voz-1-intro.mp3')}
					from={8}
				/>
				<Audio
					name="Voz qué es"
					src={staticFile('sarcopenia/voz-2-que-es.mp3')}
					from={135}
				/>
				<Audio
					name="Voz causas"
					src={staticFile('sarcopenia/voz-3-causas.mp3')}
					from={418}
				/>
				<Audio
					name="Voz comparación"
					src={staticFile('sarcopenia/voz-4-comparacion.mp3')}
					from={754}
				/>
				<Audio
					name="Voz cierre"
					src={staticFile('sarcopenia/voz-5-cierre.mp3')}
					from={1018}
				/>
			</Track>
			<Audio
				name="Música"
				src={staticFile('sarcopenia/musica.mp3')}
				volume={0.14}
			/>
		</AbsoluteFill>
	);
};
