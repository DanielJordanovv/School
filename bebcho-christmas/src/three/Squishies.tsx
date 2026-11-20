import React, {useMemo} from 'react';
import * as THREE from 'three';
import {soft} from './materials';

const eyeGeo = new THREE.SphereGeometry(1, 24, 24);
const blackMat = new THREE.MeshPhysicalMaterial({color: '#1a1020', roughness: 0.1, clearcoat: 1});
const whiteMat = new THREE.MeshBasicMaterial({color: '#ffffff'});
const blushMat = new THREE.MeshBasicMaterial({color: '#FF7FAF', transparent: true, opacity: 0.75});

/** Kawaii face placed on the +z surface of a unit-ish sphere */
const Face: React.FC<{r: number; y?: number; blink?: number}> = ({r, y = 0, blink = 1}) => (
	<group position={[0, y, 0]}>
		{[-1, 1].map((s) => (
			<group key={s} position={[s * r * 0.32, r * 0.08, r * 0.93]}>
				<mesh geometry={eyeGeo} material={blackMat} scale={[r * 0.11, r * 0.14 * blink, r * 0.06]} />
				<mesh geometry={eyeGeo} material={whiteMat} position={[r * 0.035, r * 0.05, r * 0.05]} scale={r * 0.035} />
				<mesh geometry={eyeGeo} material={blushMat} position={[s * r * 0.14, -r * 0.17, -r * 0.03]} scale={[r * 0.12, r * 0.06, r * 0.02]} />
			</group>
		))}
		<mesh position={[0, -r * 0.06, r * 0.97]} rotation={[0, 0, Math.PI]}>
			<torusGeometry args={[r * 0.07, r * 0.022, 12, 24, Math.PI]} />
			<primitive object={blackMat} attach="material" />
		</mesh>
	</group>
);

/** Squash & stretch factor for a soft toy */
export const squish = (frame: number, phase: number, amount: number) => {
	const k = Math.sin(frame * 0.18 + phase) * amount;
	return [1 - k * 0.5, 1 + k, 1 - k * 0.5] as [number, number, number];
};

export const Dumpling: React.FC<{color?: string; squash: [number, number, number]}> = ({color = '#FFF4E3', squash}) => {
	const mat = useMemo(() => soft(color), [color]);
	const pleats = useMemo(() => Array.from({length: 9}, (_, i) => (i / 9) * Math.PI * 2), []);
	return (
		<group scale={squash}>
			<mesh material={mat} scale={[1, 0.72, 1]}>
				<sphereGeometry args={[1, 64, 48]} />
			</mesh>
			{pleats.map((a, i) => (
				<mesh key={i} material={mat} position={[Math.cos(a) * 0.32, 0.62, Math.sin(a) * 0.32]} rotation={[Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6]} scale={[0.16, 0.24, 0.16]}>
					<sphereGeometry args={[1, 24, 16]} />
				</mesh>
			))}
			<mesh material={mat} position={[0, 0.78, 0]} scale={0.17}>
				<sphereGeometry args={[1, 24, 16]} />
			</mesh>
			<Face r={0.98} y={-0.08} />
		</group>
	);
};

export const Peach: React.FC<{squash: [number, number, number]}> = ({squash}) => {
	const mat = useMemo(() => soft('#FFA98A', {sheenColor: new THREE.Color('#ffe0d0')}), []);
	const leaf = useMemo(() => soft('#7BD43B'), []);
	return (
		<group scale={squash}>
			<mesh material={mat} scale={[1.02, 0.95, 0.98]}>
				<sphereGeometry args={[1, 64, 48]} />
			</mesh>
			<mesh material={leaf} position={[0.28, 0.98, 0]} rotation={[0, 0, -0.9]} scale={[0.42, 0.16, 0.24]}>
				<sphereGeometry args={[1, 32, 16]} />
			</mesh>
			<Face r={0.98} y={-0.05} />
		</group>
	);
};

export const Strawberry: React.FC<{squash: [number, number, number]}> = ({squash}) => {
	const mat = useMemo(() => soft('#FF2D55', {roughness: 0.45}), []);
	const leaf = useMemo(() => soft('#5ED62A'), []);
	const seedMat = useMemo(() => new THREE.MeshStandardMaterial({color: '#FFE36B', roughness: 0.4}), []);
	const geo = useMemo(() => {
		const pts: THREE.Vector2[] = [];
		for (let i = 0; i <= 32; i++) {
			const t = i / 32;
			const y = -1.15 + t * 2.05;
			const r = Math.sin(Math.pow(t, 0.75) * Math.PI) * (0.55 + 0.5 * t);
			pts.push(new THREE.Vector2(Math.max(0.001, r), y));
		}
		return new THREE.LatheGeometry(pts, 64);
	}, []);
	const seeds = useMemo(() => {
		const s: [number, number, number][] = [];
		for (let i = 0; i < 26; i++) {
			const a = i * 2.399;
			const y = -0.8 + (i / 26) * 1.3;
			const r = 0.62 + y * 0.18;
			if (Math.abs(Math.sin(a)) < 0.35 && Math.cos(a) > 0 && y > -0.2) continue; // keep the face clear
			s.push([Math.sin(a) * r, y, Math.cos(a) * r]);
		}
		return s;
	}, []);
	return (
		<group scale={squash}>
			<mesh geometry={geo} material={mat} />
			{seeds.map((p, i) => (
				<mesh key={i} material={seedMat} position={p} scale={[0.035, 0.05, 0.035]}>
					<sphereGeometry args={[1, 8, 8]} />
				</mesh>
			))}
			{Array.from({length: 6}, (_, i) => (
				<mesh key={i} material={leaf} position={[Math.cos(i) * 0.3, 0.92, Math.sin(i) * 0.3]} rotation={[Math.sin(i) * 0.9, i, -Math.cos(i) * 0.9]} scale={[0.34, 0.07, 0.15]}>
					<sphereGeometry args={[1, 16, 8]} />
				</mesh>
			))}
			<Face r={0.9} y={0.05} />
		</group>
	);
};

/** Oversized round squishy character (bear) */
export const SquishyBear: React.FC<{squash: [number, number, number]}> = ({squash}) => {
	const mat = useMemo(() => soft('#C9A7FF'), []);
	const inner = useMemo(() => soft('#FFD1E8'), []);
	return (
		<group scale={squash}>
			<mesh material={mat} scale={[1.08, 0.94, 1]}>
				<sphereGeometry args={[1, 64, 48]} />
			</mesh>
			{[-1, 1].map((s) => (
				<group key={s} position={[s * 0.68, 0.72, 0]}>
					<mesh material={mat} scale={[0.3, 0.3, 0.22]}>
						<sphereGeometry args={[1, 32, 24]} />
					</mesh>
					<mesh material={inner} position={[0, 0, 0.12]} scale={[0.17, 0.17, 0.12]}>
						<sphereGeometry args={[1, 24, 16]} />
					</mesh>
				</group>
			))}
			<mesh material={inner} position={[0, -0.22, 0.86]} scale={[0.3, 0.22, 0.16]}>
				<sphereGeometry args={[1, 32, 24]} />
			</mesh>
			<mesh material={blackMat} position={[0, -0.14, 1.0]} scale={[0.07, 0.05, 0.04]}>
				<sphereGeometry args={[1, 16, 16]} />
			</mesh>
			<Face r={0.98} y={0.08} />
		</group>
	);
};
