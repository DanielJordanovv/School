import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {plastic} from './materials';

// Classic stud-brick proportions: pitch 0.5, height 0.6
const P = 0.5;
const H = 0.6;
const studGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.11, 32);
const bodyCache = new Map<string, THREE.BufferGeometry>();
const matCache = new Map<string, THREE.Material>();

const getBody = (w: number, d: number) => {
	const k = `${w}x${d}`;
	if (!bodyCache.has(k)) bodyCache.set(k, new RoundedBoxGeometry(w * P - 0.012, H, d * P - 0.012, 3, 0.025));
	return bodyCache.get(k)!;
};
const getMat = (c: string) => {
	if (!matCache.has(c)) matCache.set(c, plastic(c));
	return matCache.get(c)!;
};

export const Brick: React.FC<{
	w?: number;
	d?: number;
	color: string;
	position?: [number, number, number];
	rotation?: [number, number, number];
	scale?: number;
	visible?: boolean;
}> = ({w = 4, d = 2, color, position, rotation, scale = 1, visible = true}) => {
	const studs = useMemo(() => {
		const s: [number, number][] = [];
		for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) s.push([(i - (w - 1) / 2) * P, (j - (d - 1) / 2) * P]);
		return s;
	}, [w, d]);
	const mat = getMat(color);
	return (
		<group position={position} rotation={rotation} scale={scale} visible={visible}>
			<mesh geometry={getBody(w, d)} material={mat} />
			{studs.map(([x, z], i) => (
				<mesh key={i} geometry={studGeo} material={mat} position={[x, H / 2 + 0.05, z]} />
			))}
		</group>
	);
};

export const BRICK_H = H;
