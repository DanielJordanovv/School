import React from 'react';
import {AbsoluteFill, Img, Interactive, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CLAMP} from '../lib/anim';

const START = 236;

export const Logo: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - START, fps, config: {damping: 9, stiffness: 110, mass: 0.8}});
	if (frame < START) return null;
	const logo = staticFile('bebcho-logo.png');
	const shine = interpolate(frame, [START + 22, START + 44], [-60, 160], CLAMP);
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<div
				style={{
					position: 'absolute',
					top: 630 - 330,
					width: 1300,
					height: 660,
					borderRadius: '50%',
					background: 'radial-gradient(ellipse, rgba(255,240,170,0.75) 0%, rgba(255,210,60,0.35) 35%, rgba(255,200,0,0) 70%)',
					opacity: Math.min(1, s),
					scale: `${0.6 + 0.4 * Math.min(1.2, s)}`,
				}}
			/>
			<Interactive.Div
				name="BEBCHO logo"
				style={{
					position: 'absolute',
					top: 440,
					width: 1040,
					height: 380,
					scale: `${Math.max(0, s) * (1 + Math.sin((frame - START) * 0.09) * 0.012)}`,
					rotate: `${(1 - s) * -12}deg`,
				}}
			>
				<Img
					src={logo}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'contain',
						filter: 'drop-shadow(0 14px 0 rgba(30,0,70,0.9)) drop-shadow(0 26px 40px rgba(10,0,35,0.7)) drop-shadow(0 0 30px rgba(255,230,120,0.45))',
					}}
				/>
				{/* shine sweep, masked to the logo shape */}
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: `linear-gradient(105deg, rgba(255,255,255,0) ${shine - 12}%, rgba(255,255,255,0.85) ${shine}%, rgba(255,255,255,0) ${shine + 12}%)`,
						WebkitMaskImage: `url(${logo})`,
						maskImage: `url(${logo})`,
						WebkitMaskSize: 'contain',
						maskSize: 'contain',
						WebkitMaskRepeat: 'no-repeat',
						maskRepeat: 'no-repeat',
						WebkitMaskPosition: 'center',
						maskPosition: 'center',
						mixBlendMode: 'screen',
					}}
				/>
			</Interactive.Div>
		</AbsoluteFill>
	);
};
