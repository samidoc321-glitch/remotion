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
				padding: '120px 80px',
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
			<div style={{margin: '60px 0'}}>
				<Thigh id="what" muscle={muscle} size={720} />
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
			<div style={{fontSize: 84, fontWeight: 900, marginBottom: 60}}>
				¿Cómo se produce?
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 34,
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
								padding: '34px 40px',
								boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
								textAlign: 'left',
								opacity: s,
								transform: `translateX(${(1 - s) * 300}px)`,
							}}
						>
							<div style={{fontSize: 90}}>{cause.emoji}</div>
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
