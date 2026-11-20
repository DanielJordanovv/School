import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {BURST, CLAMP} from './lib/anim';
import {Background, Flash, LightRays, Sparkles, Vignette} from './overlay/Background';
import {World3D} from './three/World3D';
import {Headline} from './overlay/Headline';
import {Logo} from './overlay/Logo';
import {ProductPhotos} from './overlay/ProductPhotos';
import {Watermark} from './overlay/Watermark';

export type BebchoChristmasProps = {
	products: string[];
	watermark: boolean;
};

const Rays: React.FC = () => {
	const frame = useCurrentFrame();
	const burst = interpolate(frame, [BURST - 4, BURST + 4, BURST + 70], [0, 1, 0.25], CLAMP);
	const final = interpolate(frame, [232, 250], [0, 0.9], CLAMP);
	const intro = interpolate(frame, [0, 8, 40, BURST - 4], [0.6, 0.35, 0.25, 0], CLAMP);
	return (
		<>
			<LightRays opacity={Math.max(burst, intro)} scale={interpolate(frame, [0, BURST, BURST + 40], [0.55, 0.7, 1.1], CLAMP)} y={50} />
			<LightRays opacity={final} scale={0.85} y={55} />
		</>
	);
};

export const BebchoChristmas: React.FC<BebchoChristmasProps> = ({products, watermark}) => {
	return (
		<AbsoluteFill style={{backgroundColor: '#1A0446'}}>
			<Background />
			<Rays />
			<World3D />
			<ProductPhotos products={products} />
			<Sparkles />
			<Headline />
			<Logo />
			<Flash />
			<Vignette />
			{watermark ? <Watermark /> : null}
		</AbsoluteFill>
	);
};
