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
						frame: frame - [49, 180, 237, 312][i],
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
				<Sequence name="Intro" durationInFrames={143}>
					<Intro />
				</Sequence>
				<Sequence name="Qué es" from={143} durationInFrames={276}>
					<WhatIsIt />
				</Sequence>
				<Sequence name="Causas" from={419} durationInFrames={390}>
					<Causes />
				</Sequence>
				<Sequence name="Comparación" from={809} durationInFrames={276}>
					<Comparison />
				</Sequence>
				<Sequence name="Cierre" from={1085} durationInFrames={180}>
					<Outro />
				</Sequence>
				<Sequence name="Firma" from={1265} durationInFrames={142}>
					<Signature />
				</Sequence>
			</Track>
			<Track name="Subtítulos">
				<Sequence name="Subtítulos intro" from={0} durationInFrames={143}>
					<TikTokCaptions
						captions={[
							{
								text: ' ¿Por',
								startMs: 647,
								endMs: 835,
								timestampMs: 741,
								confidence: null,
							},
							{
								text: ' qué',
								startMs: 835,
								endMs: 1024,
								timestampMs: 930,
								confidence: null,
							},
							{
								text: ' perdemos',
								startMs: 1024,
								endMs: 1401,
								timestampMs: 1213,
								confidence: null,
							},
							{
								text: ' músculo',
								startMs: 1401,
								endMs: 1741,
								timestampMs: 1571,
								confidence: null,
							},
							{
								text: ' al',
								startMs: 1741,
								endMs: 1892,
								timestampMs: 1816,
								confidence: null,
							},
							{
								text: ' envejecer?',
								startMs: 1892,
								endMs: 2307,
								timestampMs: 2099,
								confidence: null,
							},
							{
								text: ' Este',
								startMs: 2787,
								endMs: 3065,
								timestampMs: 2926,
								confidence: null,
							},
							{
								text: ' proceso',
								startMs: 3065,
								endMs: 3481,
								timestampMs: 3273,
								confidence: null,
							},
							{
								text: ' se',
								startMs: 3481,
								endMs: 3667,
								timestampMs: 3574,
								confidence: null,
							},
							{
								text: ' llama',
								startMs: 3667,
								endMs: 3991,
								timestampMs: 3829,
								confidence: null,
							},
							{
								text: ' sarcopenia.',
								startMs: 3991,
								endMs: 4547,
								timestampMs: 4269,
								confidence: null,
							},
						]}
					/>
				</Sequence>
				<Sequence name="Subtítulos qué es" from={143} durationInFrames={276}>
					<TikTokCaptions
						captions={[
							{
								text: ' Es',
								startMs: 220,
								endMs: 388,
								timestampMs: 304,
								confidence: null,
							},
							{
								text: ' la',
								startMs: 388,
								endMs: 556,
								timestampMs: 472,
								confidence: null,
							},
							{
								text: ' pérdida',
								startMs: 556,
								endMs: 934,
								timestampMs: 745,
								confidence: null,
							},
							{
								text: ' progresiva',
								startMs: 934,
								endMs: 1438,
								timestampMs: 1186,
								confidence: null,
							},
							{
								text: ' de',
								startMs: 1438,
								endMs: 1606,
								timestampMs: 1522,
								confidence: null,
							},
							{
								text: ' masa',
								startMs: 1606,
								endMs: 1858,
								timestampMs: 1732,
								confidence: null,
							},
							{
								text: ' y',
								startMs: 1858,
								endMs: 1984,
								timestampMs: 1921,
								confidence: null,
							},
							{
								text: ' fuerza',
								startMs: 1984,
								endMs: 2320,
								timestampMs: 2152,
								confidence: null,
							},
							{
								text: ' muscular.',
								startMs: 2320,
								endMs: 2740,
								timestampMs: 2530,
								confidence: null,
							},
							{
								text: ' A',
								startMs: 3320,
								endMs: 3483,
								timestampMs: 3402,
								confidence: null,
							},
							{
								text: ' partir',
								startMs: 3483,
								endMs: 3919,
								timestampMs: 3701,
								confidence: null,
							},
							{
								text: ' de',
								startMs: 3919,
								endMs: 4137,
								timestampMs: 4028,
								confidence: null,
							},
							{
								text: ' los',
								startMs: 4137,
								endMs: 4410,
								timestampMs: 4274,
								confidence: null,
							},
							{
								text: ' 30',
								startMs: 4410,
								endMs: 4628,
								timestampMs: 4519,
								confidence: null,
							},
							{
								text: ' años',
								startMs: 4628,
								endMs: 4955,
								timestampMs: 4791,
								confidence: null,
							},
							{
								text: ' podemos',
								startMs: 4955,
								endMs: 5445,
								timestampMs: 5200,
								confidence: null,
							},
							{
								text: ' perder',
								startMs: 5445,
								endMs: 5881,
								timestampMs: 5663,
								confidence: null,
							},
							{
								text: ' entre',
								startMs: 5881,
								endMs: 6262,
								timestampMs: 6072,
								confidence: null,
							},
							{
								text: ' un',
								startMs: 6262,
								endMs: 6480,
								timestampMs: 6371,
								confidence: null,
							},
							{
								text: ' 3',
								startMs: 6480,
								endMs: 6644,
								timestampMs: 6562,
								confidence: null,
							},
							{
								text: ' y',
								startMs: 6644,
								endMs: 6807,
								timestampMs: 6726,
								confidence: null,
							},
							{
								text: ' un',
								startMs: 6807,
								endMs: 7025,
								timestampMs: 6916,
								confidence: null,
							},
							{
								text: ' 8%',
								startMs: 7025,
								endMs: 7189,
								timestampMs: 7107,
								confidence: null,
							},
							{
								text: ' de',
								startMs: 7189,
								endMs: 7407,
								timestampMs: 7298,
								confidence: null,
							},
							{
								text: ' músculo',
								startMs: 7407,
								endMs: 7897,
								timestampMs: 7652,
								confidence: null,
							},
							{
								text: ' cada',
								startMs: 7897,
								endMs: 8224,
								timestampMs: 8061,
								confidence: null,
							},
							{
								text: ' década.',
								startMs: 8224,
								endMs: 8660,
								timestampMs: 8442,
								confidence: null,
							},
						]}
					/>
				</Sequence>
				<Sequence name="Subtítulos causas" from={419} durationInFrames={390}>
					<TikTokCaptions
						captions={[
							{
								text: ' ¿Cómo',
								startMs: 300,
								endMs: 540,
								timestampMs: 420,
								confidence: null,
							},
							{
								text: ' se',
								startMs: 540,
								endMs: 700,
								timestampMs: 620,
								confidence: null,
							},
							{
								text: ' produce?',
								startMs: 700,
								endMs: 1060,
								timestampMs: 880,
								confidence: null,
							},
							{
								text: ' Esto',
								startMs: 1620,
								endMs: 1866,
								timestampMs: 1743,
								confidence: null,
							},
							{
								text: ' se',
								startMs: 1866,
								endMs: 2030,
								timestampMs: 1948,
								confidence: null,
							},
							{
								text: ' produce',
								startMs: 2030,
								endMs: 2399,
								timestampMs: 2214,
								confidence: null,
							},
							{
								text: ' puesto',
								startMs: 2399,
								endMs: 2727,
								timestampMs: 2563,
								confidence: null,
							},
							{
								text: ' que',
								startMs: 2727,
								endMs: 2931,
								timestampMs: 2829,
								confidence: null,
							},
							{
								text: ' perdemos',
								startMs: 2931,
								endMs: 3341,
								timestampMs: 3136,
								confidence: null,
							},
							{
								text: ' neuronas',
								startMs: 3341,
								endMs: 3751,
								timestampMs: 3546,
								confidence: null,
							},
							{
								text: ' motoras',
								startMs: 3751,
								endMs: 4120,
								timestampMs: 3936,
								confidence: null,
							},
							{
								text: ' y',
								startMs: 4520,
								endMs: 4670,
								timestampMs: 4595,
								confidence: null,
							},
							{
								text: ' fibras',
								startMs: 4670,
								endMs: 5070,
								timestampMs: 4870,
								confidence: null,
							},
							{
								text: ' rápidas.',
								startMs: 5070,
								endMs: 5520,
								timestampMs: 5295,
								confidence: null,
							},
							{
								text: ' Bajan',
								startMs: 6000,
								endMs: 6313,
								timestampMs: 6156,
								confidence: null,
							},
							{
								text: ' las',
								startMs: 6313,
								endMs: 6536,
								timestampMs: 6425,
								confidence: null,
							},
							{
								text: ' hormonas',
								startMs: 6536,
								endMs: 6984,
								timestampMs: 6760,
								confidence: null,
							},
							{
								text: ' anabólicas,',
								startMs: 6984,
								endMs: 7520,
								timestampMs: 7252,
								confidence: null,
							},
							{
								text: ' la',
								startMs: 7880,
								endMs: 8047,
								timestampMs: 7963,
								confidence: null,
							},
							{
								text: ' inflamación',
								startMs: 8047,
								endMs: 8588,
								timestampMs: 8318,
								confidence: null,
							},
							{
								text: ' crónica',
								startMs: 8588,
								endMs: 8963,
								timestampMs: 8776,
								confidence: null,
							},
							{
								text: ' degrada',
								startMs: 8963,
								endMs: 9338,
								timestampMs: 9151,
								confidence: null,
							},
							{
								text: ' el',
								startMs: 9338,
								endMs: 9505,
								timestampMs: 9422,
								confidence: null,
							},
							{
								text: ' músculo',
								startMs: 9505,
								endMs: 9880,
								timestampMs: 9693,
								confidence: null,
							},
							{
								text: ' y',
								startMs: 10380,
								endMs: 10492,
								timestampMs: 10436,
								confidence: null,
							},
							{
								text: ' el',
								startMs: 10492,
								endMs: 10642,
								timestampMs: 10567,
								confidence: null,
							},
							{
								text: ' sedentarismo',
								startMs: 10642,
								endMs: 11167,
								timestampMs: 10904,
								confidence: null,
							},
							{
								text: ' deja',
								startMs: 11167,
								endMs: 11391,
								timestampMs: 11279,
								confidence: null,
							},
							{
								text: ' que',
								startMs: 11391,
								endMs: 11579,
								timestampMs: 11485,
								confidence: null,
							},
							{
								text: ' la',
								startMs: 11579,
								endMs: 11728,
								timestampMs: 11653,
								confidence: null,
							},
							{
								text: ' grasa',
								startMs: 11728,
								endMs: 11991,
								timestampMs: 11859,
								confidence: null,
							},
							{
								text: ' lo',
								startMs: 11991,
								endMs: 12140,
								timestampMs: 12065,
								confidence: null,
							},
							{
								text: ' invada.',
								startMs: 12140,
								endMs: 12440,
								timestampMs: 12290,
								confidence: null,
							},
						]}
					/>
				</Sequence>
				<Sequence
					name="Subtítulos comparación"
					from={809}
					durationInFrames={276}
				>
					<TikTokCaptions
						captions={[
							{
								text: ' Mira',
								startMs: 320,
								endMs: 538,
								timestampMs: 429,
								confidence: null,
							},
							{
								text: ' la',
								startMs: 538,
								endMs: 684,
								timestampMs: 611,
								confidence: null,
							},
							{
								text: ' diferencia.',
								startMs: 684,
								endMs: 1120,
								timestampMs: 902,
								confidence: null,
							},
							{
								text: ' A',
								startMs: 1700,
								endMs: 1857,
								timestampMs: 1779,
								confidence: null,
							},
							{
								text: ' los',
								startMs: 1857,
								endMs: 2120,
								timestampMs: 1988,
								confidence: null,
							},
							{
								text: ' 85',
								startMs: 2120,
								endMs: 2329,
								timestampMs: 2224,
								confidence: null,
							},
							{
								text: ' años,',
								startMs: 2329,
								endMs: 2644,
								timestampMs: 2487,
								confidence: null,
							},
							{
								text: ' una',
								startMs: 2644,
								endMs: 2906,
								timestampMs: 2775,
								confidence: null,
							},
							{
								text: ' persona',
								startMs: 2906,
								endMs: 3378,
								timestampMs: 3142,
								confidence: null,
							},
							{
								text: ' sedentaria',
								startMs: 3378,
								endMs: 4007,
								timestampMs: 3693,
								confidence: null,
							},
							{
								text: ' perdió',
								startMs: 4007,
								endMs: 4427,
								timestampMs: 4217,
								confidence: null,
							},
							{
								text: ' gran',
								startMs: 4427,
								endMs: 4741,
								timestampMs: 4584,
								confidence: null,
							},
							{
								text: ' parte',
								startMs: 4741,
								endMs: 5109,
								timestampMs: 4925,
								confidence: null,
							},
							{
								text: ' de',
								startMs: 5109,
								endMs: 5318,
								timestampMs: 5213,
								confidence: null,
							},
							{
								text: ' su',
								startMs: 5318,
								endMs: 5528,
								timestampMs: 5423,
								confidence: null,
							},
							{
								text: ' músculo.',
								startMs: 5528,
								endMs: 6000,
								timestampMs: 5764,
								confidence: null,
							},
							{
								text: ' Una',
								startMs: 6600,
								endMs: 6817,
								timestampMs: 6708,
								confidence: null,
							},
							{
								text: ' persona',
								startMs: 6817,
								endMs: 7207,
								timestampMs: 7012,
								confidence: null,
							},
							{
								text: ' activa',
								startMs: 7207,
								endMs: 7553,
								timestampMs: 7380,
								confidence: null,
							},
							{
								text: ' lo',
								startMs: 7553,
								endMs: 7727,
								timestampMs: 7640,
								confidence: null,
							},
							{
								text: ' conserva.',
								startMs: 7727,
								endMs: 8160,
								timestampMs: 7943,
								confidence: null,
							},
						]}
					/>
				</Sequence>
				<Sequence name="Subtítulos cierre" from={1085} durationInFrames={180}>
					<TikTokCaptions
						captions={[
							{
								text: ' Nunca',
								startMs: 360,
								endMs: 669,
								timestampMs: 514,
								confidence: null,
							},
							{
								text: ' es',
								startMs: 669,
								endMs: 845,
								timestampMs: 757,
								confidence: null,
							},
							{
								text: ' tarde.',
								startMs: 845,
								endMs: 1154,
								timestampMs: 1000,
								confidence: null,
							},
							{
								text: ' Entrena',
								startMs: 1154,
								endMs: 1551,
								timestampMs: 1352,
								confidence: null,
							},
							{
								text: ' la',
								startMs: 1551,
								endMs: 1727,
								timestampMs: 1639,
								confidence: null,
							},
							{
								text: ' fuerza',
								startMs: 1727,
								endMs: 2080,
								timestampMs: 1904,
								confidence: null,
							},
							{
								text: ' dos',
								startMs: 2080,
								endMs: 2301,
								timestampMs: 2191,
								confidence: null,
							},
							{
								text: ' o',
								startMs: 2301,
								endMs: 2433,
								timestampMs: 2367,
								confidence: null,
							},
							{
								text: ' tres',
								startMs: 2433,
								endMs: 2698,
								timestampMs: 2565,
								confidence: null,
							},
							{
								text: ' veces',
								startMs: 2698,
								endMs: 3007,
								timestampMs: 2852,
								confidence: null,
							},
							{
								text: ' por',
								startMs: 3007,
								endMs: 3227,
								timestampMs: 3117,
								confidence: null,
							},
							{
								text: ' semana',
								startMs: 3227,
								endMs: 3580,
								timestampMs: 3404,
								confidence: null,
							},
							{
								text: ' y',
								startMs: 3940,
								endMs: 4066,
								timestampMs: 4003,
								confidence: null,
							},
							{
								text: ' come',
								startMs: 4066,
								endMs: 4319,
								timestampMs: 4193,
								confidence: null,
							},
							{
								text: ' proteína',
								startMs: 4319,
								endMs: 4741,
								timestampMs: 4530,
								confidence: null,
							},
							{
								text: ' en',
								startMs: 4741,
								endMs: 4910,
								timestampMs: 4825,
								confidence: null,
							},
							{
								text: ' cada',
								startMs: 4910,
								endMs: 5163,
								timestampMs: 5036,
								confidence: null,
							},
							{
								text: ' comida.',
								startMs: 5163,
								endMs: 5500,
								timestampMs: 5331,
								confidence: null,
							},
						]}
					/>
				</Sequence>
				<Sequence name="Subtítulos firma" from={1265} durationInFrames={142}>
					<TikTokCaptions
						captions={[
							{
								text: ' Soy',
								startMs: 340,
								endMs: 575,
								timestampMs: 458,
								confidence: null,
							},
							{
								text: ' Samuel',
								startMs: 575,
								endMs: 952,
								timestampMs: 763,
								confidence: null,
							},
							{
								text: ' Mendoza,',
								startMs: 952,
								endMs: 1375,
								timestampMs: 1163,
								confidence: null,
							},
							{
								text: ' estudiante',
								startMs: 1375,
								endMs: 1939,
								timestampMs: 1657,
								confidence: null,
							},
							{
								text: ' de',
								startMs: 1939,
								endMs: 2128,
								timestampMs: 2034,
								confidence: null,
							},
							{
								text: ' medicina,',
								startMs: 2128,
								endMs: 2598,
								timestampMs: 2363,
								confidence: null,
							},
							{
								text: ' y',
								startMs: 2598,
								endMs: 2739,
								timestampMs: 2669,
								confidence: null,
							},
							{
								text: ' sígueme',
								startMs: 2739,
								endMs: 3163,
								timestampMs: 2951,
								confidence: null,
							},
							{
								text: ' para',
								startMs: 3163,
								endMs: 3445,
								timestampMs: 3304,
								confidence: null,
							},
							{
								text: ' más.',
								startMs: 3445,
								endMs: 3680,
								timestampMs: 3562,
								confidence: null,
							},
						]}
					/>
				</Sequence>
			</Track>
			<Audio
				name="Voz de Samuel"
				src={staticFile('sarcopenia/voz-samuel.mp3')}
				from={8}
			/>
			<Audio
				name="Música"
				src={staticFile('sarcopenia/musica.mp3')}
				volume={0.14}
			/>
		</AbsoluteFill>
	);
};
