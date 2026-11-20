import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {BURST, CLAMP} from '../lib/anim';

const BOKEH = Array.from({length: 26}, (_, i) => ({
	x: random(`bx${i}`) * 100,
	y: random(`by${i}`) * 100,
	r: 40 + random(`br${i}`) * 160,
	c: ['rgba(255,212,0,0.22)', 'rgba(190,255,60,0.16)', 'rgba(255,255,255,0.14)', 'rgba(200,120,255,0.25)'][i % 4],
	sp: 0.2 + random(`bs${i}`) * 0.5,
}));

export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const glow = interpolate(frame, [0, 20, BURST, BURST + 10, BURST + 60], [0.6, 0.85, 1, 1.25, 0.95], CLAMP);
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(ellipse 70% 70% at 50% 48%, #7B2FF0 0%, #5414C4 ${28 * glow}%, #33097E 62%, #17033F 100%)`,
				overflow: 'hidden',
			}}
		>
			{BOKEH.map((b, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: `${b.x}%`,
						top: `${(b.y - frame * b.sp * 0.08 + 200) % 110 - 5}%`,
						width: b.r,
						height: b.r,
						marginLeft: -b.r / 2,
						marginTop: -b.r / 2,
						borderRadius: '50%',
						background: `radial-gradient(circle, ${b.c} 0%, rgba(0,0,0,0) 70%)`,
						filter: 'blur(6px)',
					}}
				/>
			))}
		</AbsoluteFill>
	);
};

export const LightRays: React.FC<{opacity: number; scale: number; y?: number}> = ({opacity, scale, y = 52}) => {
	const frame = useCurrentFrame();
	if (opacity <= 0.001) return null;
	return (
		<AbsoluteFill style={{opacity, mixBlendMode: 'screen'}}>
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: `${y}%`,
					width: 3200,
					height: 3200,
					marginLeft: -1600,
					marginTop: -1600,
					scale: `${scale}`,
					rotate: `${frame * 0.6}deg`,
					background: 'repeating-conic-gradient(from 0deg, rgba(255,226,120,0.55) 0deg 5deg, rgba(255,226,120,0) 5deg 18deg)',
					WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0) 55%)',
					maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0) 55%)',
				}}
			/>
		</AbsoluteFill>
	);
};

const SPARKS = Array.from({length: 90}, (_, i) => ({
	x: random(`sx${i}`) * 100,
	y: random(`sy${i}`) * 100,
	s: 4 + random(`ss${i}`) * 10,
	ph: random(`sp${i}`) * 6.28,
	fall: 0.05 + random(`sf${i}`) * 0.15,
	c: i % 3 === 0 ? '#FFE15A' : i % 3 === 1 ? '#FFFFFF' : '#D6FF6B',
}));

/** Twinkling four-point sparkles and drifting glitter */
export const Sparkles: React.FC = () => {
	const frame = useCurrentFrame();
	const density = interpolate(frame, [0, 15, BURST, BURST + 30], [0.35, 0.6, 0.7, 1], CLAMP);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{SPARKS.map((p, i) => {
				if (i / SPARKS.length > density) return null;
				const tw = Math.max(0, Math.sin(frame * 0.16 + p.ph));
				return (
					<svg
						key={i}
						viewBox="-10 -10 20 20"
						style={{
							position: 'absolute',
							left: `${p.x}%`,
							top: `${(p.y + frame * p.fall) % 102}%`,
							width: p.s * 3,
							height: p.s * 3,
							opacity: tw,
							scale: `${0.6 + tw * 0.6}`,
							filter: `drop-shadow(0 0 6px ${p.c})`,
						}}
					>
						<path d="M0 -10 Q1.2 -1.2 10 0 Q1.2 1.2 0 10 Q-1.2 1.2 -10 0 Q-1.2 -1.2 0 -10Z" fill={p.c} />
					</svg>
				);
			})}
		</AbsoluteFill>
	);
};

export const Flash: React.FC = () => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [BURST - 3, BURST + 1, BURST + 5, BURST + 22], [0, 1, 0.85, 0], CLAMP);
	const intro = interpolate(frame, [0, 3, 9], [0.45, 0.3, 0], CLAMP);
	const v = Math.max(o, intro);
	if (v <= 0.001) return null;
	return (
		<AbsoluteFill
			style={{
				opacity: v,
				background: 'radial-gradient(circle at 50% 50%, #FFFFFF 0%, #FFF3B0 25%, rgba(255,200,40,0.85) 50%, rgba(255,170,0,0) 80%)',
				mixBlendMode: 'screen',
			}}
		/>
	);
};

export const Vignette: React.FC = () => (
	<AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 60%, rgba(10,0,30,0.55) 100%)', pointerEvents: 'none'}} />
);
