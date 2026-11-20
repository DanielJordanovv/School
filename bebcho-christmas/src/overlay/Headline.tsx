import React from 'react';
import {AbsoluteFill, Easing, Interactive, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily} from '../lib/fonts';
import {CLAMP} from '../lib/anim';

// Soft rounded 3D: stacked extrusion + highlight + deep shadow
const extrude = (depth: number, color: string, glow: string) => {
	const s: string[] = [];
	for (let i = 1; i <= depth; i++) s.push(`0px ${i}px 0 ${color}`);
	s.push(`0 ${depth + 8}px 22px rgba(10,0,35,0.6)`);
	s.push(`0 0 36px ${glow}`);
	return s.join(', ');
};

const Letters: React.FC<{text: string; start: number; color: string; size: number; depth: number; shade: string; glow: string}> = ({text, start, color, size, depth, shade, glow}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<div style={{display: 'flex', justifyContent: 'center', whiteSpace: 'pre'}}>
			{Array.from(text).map((ch, i) => {
				const s = spring({frame: frame - start - i * 1.1, fps, config: {damping: 9, stiffness: 150, mass: 0.6}});
				const bounce = Math.sin(frame * 0.13 + i * 0.6) * 3 * Math.min(1, s);
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							fontSize: size,
							lineHeight: 1.02,
							color,
							textShadow: extrude(depth, shade, glow),
							WebkitTextStroke: `3px ${shade}`,
							paintOrder: 'stroke fill',
							opacity: Math.min(1, s * 2),
							scale: `${Math.max(0, s)}`,
							translate: `0px ${(1 - s) * 120 + bounce}px`,
							rotate: `${(1 - s) * (i % 2 ? 20 : -20)}deg`,
						}}
					>
						{ch === ' ' ? ' ' : ch}
					</span>
				);
			})}
		</div>
	);
};

export const Headline: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<Interactive.Div
				name="Headline"
				style={{
					fontFamily,
					fontWeight: 900,
					letterSpacing: 1,
					textAlign: 'center',
					translate: interpolate(frame, [228, 250], ['0px -20px', '0px -365px'], {...CLAMP, easing: Easing.bezier(0.65, 0, 0.35, 1)}),
					scale: interpolate(frame, [228, 250], [1, 0.5], {...CLAMP, easing: Easing.bezier(0.65, 0, 0.35, 1)}),
				}}
			>
				<Letters text={'„ПЕРНИК,'} start={150} color="#FFFFFF" size={150} depth={10} shade="#2A0868" glow="rgba(255,255,255,0.3)" />
				<Letters text={'ВРЕМЕ Е ЗА'} start={159} color="#FFFFFF" size={132} depth={9} shade="#2A0868" glow="rgba(255,255,255,0.3)" />
				<Letters text={'ПОДАРЪЦИ!“'} start={170} color="#FFD60A" size={196} depth={13} shade="#3A0A78" glow="rgba(255,214,10,0.55)" />
			</Interactive.Div>
		</AbsoluteFill>
	);
};
