import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {BURST} from '../lib/anim';

// Slot centres (px) + height for official product cut-outs (transparent PNG/WebP)
const SLOTS: {x: number; y: number; h: number; d: number}[] = [
	{x: 250, y: 560, h: 380, d: 4},
	{x: 1670, y: 560, h: 380, d: 8},
	{x: 560, y: 890, h: 300, d: 12},
	{x: 1360, y: 890, h: 300, d: 16},
	{x: 330, y: 230, h: 260, d: 20},
	{x: 1590, y: 230, h: 260, d: 24},
];

/**
 * Optional layer for OFFICIAL product photography supplied by the brand owners /
 * distributors (Mattel, LEGO, Hot Wheels, K-Pop Demon Hunters licensed toys,
 * squishies). Files go in public/products/ and are listed in the `products` prop.
 */
export const ProductPhotos: React.FC<{products: string[]}> = ({products}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (products.length === 0) return null;
	return (
		<AbsoluteFill>
			{products.slice(0, SLOTS.length).map((src, i) => {
				const slot = SLOTS[i];
				const s = spring({frame: frame - (BURST + slot.d), fps, config: {damping: 11, stiffness: 75}});
				const t = Math.min(1, Math.max(0, (frame - BURST - slot.d) / 26));
				const x = interpolate(s, [0, 1], [960, slot.x]);
				const y = interpolate(s, [0, 1], [560, slot.y]) - Math.sin(Math.PI * t) * 260 + Math.sin(frame * 0.07 + i) * 8;
				return (
					<Img
						key={src + i}
						src={staticFile(src)}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							height: slot.h,
							translate: '-50% -50%',
							scale: `${Math.max(0, interpolate(s, [0, 1], [0.1, 1]))}`,
							rotate: `${(1 - s) * (i % 2 ? 40 : -40)}deg`,
							opacity: frame >= BURST + slot.d ? 1 : 0,
							filter: 'drop-shadow(0 18px 30px rgba(10,0,35,0.6)) drop-shadow(0 0 22px rgba(255,220,90,0.35))',
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};
