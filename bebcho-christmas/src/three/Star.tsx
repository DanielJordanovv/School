import React, {useMemo} from 'react';
import * as THREE from 'three';
import {gold} from './materials';
import {Glow} from './Glow';

let starGeo: THREE.ExtrudeGeometry | null = null;
const getStarGeo = () => {
	if (starGeo) return starGeo;
	const s = new THREE.Shape();
	for (let i = 0; i < 10; i++) {
		const r = i % 2 === 0 ? 1 : 0.46;
		const a = Math.PI / 2 + (i / 10) * Math.PI * 2;
		const x = Math.cos(a) * r;
		const y = Math.sin(a) * r;
		if (i === 0) s.moveTo(x, y);
		else s.lineTo(x, y);
	}
	s.closePath();
	starGeo = new THREE.ExtrudeGeometry(s, {depth: 0.18, bevelEnabled: true, bevelThickness: 0.16, bevelSize: 0.12, bevelSegments: 5});
	starGeo.center();
	return starGeo;
};

export const Star3D: React.FC<{
	position: [number, number, number];
	scale: number;
	spin: number;
	glow?: number;
}> = ({position, scale, spin, glow = 1}) => {
	const mat = useMemo(() => gold(), []);
	return (
		<group position={position} visible={scale > 0.001}>
			<Glow scale={scale * 4.2} opacity={0.55 * glow} color="#FFD34D" />
			<mesh geometry={getStarGeo()} material={mat} scale={scale} rotation={[0.15, spin, Math.sin(spin) * 0.15]} />
		</group>
	);
};
