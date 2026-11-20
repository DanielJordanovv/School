import React, {useMemo} from 'react';
import * as THREE from 'three';
import {getGlowTexture} from './materials';

export const Glow: React.FC<{
	position?: [number, number, number];
	scale: number;
	opacity: number;
	color?: string;
}> = ({position = [0, 0, 0], scale, opacity, color = '#ffffff'}) => {
	const mat = useMemo(
		() =>
			new THREE.SpriteMaterial({
				map: getGlowTexture(),
				blending: THREE.AdditiveBlending,
				depthWrite: false,
				transparent: true,
				color,
			}),
		[color],
	);
	mat.opacity = Math.max(0, opacity);
	return <sprite material={mat} position={position} scale={[scale, scale, 1]} visible={opacity > 0.001 && scale > 0.001} />;
};
