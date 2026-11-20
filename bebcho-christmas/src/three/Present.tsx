import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {plastic} from './materials';

const body = new RoundedBoxGeometry(1, 1, 1, 3, 0.05);
const band = new RoundedBoxGeometry(0.2, 1.02, 1.02, 2, 0.02);
const loop = new THREE.TorusGeometry(0.17, 0.055, 12, 32);
const cache = new Map<string, THREE.Material>();
const mat = (c: string) => {
	if (!cache.has(c)) cache.set(c, plastic(c, {roughness: 0.3, clearcoatRoughness: 0.2}));
	return cache.get(c)!;
};

export const Present: React.FC<{color: string; ribbon: string; size: [number, number, number]}> = ({color, ribbon, size}) => {
	const r = useMemo(() => mat(ribbon), [ribbon]);
	const k = Math.min(...size);
	return (
		<group>
			<group scale={size}>
				<mesh geometry={body} material={mat(color)} />
				<mesh geometry={band} material={r} />
				<mesh geometry={band} material={r} rotation={[0, Math.PI / 2, 0]} />
			</group>
			<group position={[0, size[1] / 2 + 0.04 * k, 0]} scale={k}>
				<mesh geometry={loop} material={r} position={[-0.15, 0.05, 0]} rotation={[0, 0.4, 0.6]} />
				<mesh geometry={loop} material={r} position={[0.15, 0.05, 0]} rotation={[0, -0.4, -0.6]} />
			</group>
		</group>
	);
};
