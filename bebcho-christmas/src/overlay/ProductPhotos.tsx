import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BURST} from '../lib/anim';

export type Product = {
	src: string;
	/** final centre in px */
	x: number;
	y: number;
	/** rendered height in px */
	h: number;
	/** launch delay after the burst, in frames */
	delay: number;
	/** halo colour behind the product */
	halo: 'yellow' | 'lime';
};

const HALO = {
	yellow: 'radial-gradient(ellipse, rgba(255,226,90,0.55) 0%, rgba(255,214,10,0.18) 40%, rgba(255,214,10,0) 70%)',
	lime: 'radial-gradient(ellipse, rgba(190,255,70,0.5) 0%, rgba(160,240,40,0.16) 40%, rgba(160,240,40,0) 70%)',
};

// Opening of the present at the moment of the burst
const ORIGIN = {x: 960, y: 450};

/** Real BEBCHO product photos (background removed) bursting out of the present */
export const ProductPhotos: React.FC<{products: Product[]}> = ({products}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill>
			{products.map((p, i) => {
				const start = BURST + p.delay;
				if (frame < start) return null;
				const s = spring({frame: frame - start, fps, config: {damping: 11, stiffness: 72, mass: 0.9}});
				const t = Math.min(1, (frame - start) / 24);
				const x = interpolate(s, [0, 1], [ORIGIN.x, p.x]);
				const y = interpolate(s, [0, 1], [ORIGIN.y, p.y]) - Math.sin(Math.PI * t) * 300 + Math.sin(frame * 0.06 + i * 1.7) * 9 * Math.min(1, s);
				const sc = Math.max(0, interpolate(s, [0, 1], [0.06, 1]));
				const settle = Math.min(1, s);
				return (
					<div key={p.src} style={{position: 'absolute', left: x, top: y, translate: '-50% -50%', scale: `${sc}`, rotate: `${(1 - s) * (i % 2 ? 50 : -50) + Math.sin(frame * 0.05 + i) * 2.5 * settle}deg`}}>
						<div style={{position: 'absolute', left: '50%', top: '55%', width: p.h * 1.5, height: p.h * 1.2, translate: '-50% -50%', background: HALO[p.halo], opacity: settle}} />
						<Img
							src={staticFile(p.src)}
							style={{
								position: 'relative',
								height: p.h,
								display: 'block',
								filter: 'drop-shadow(0 16px 22px rgba(12,0,40,0.65)) drop-shadow(0 0 2px rgba(255,255,255,0.6))',
							}}
						/>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
