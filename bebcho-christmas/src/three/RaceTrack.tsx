import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {CLAMP} from '../lib/anim';
import {metallicPaint, plastic} from './materials';

const HALF_W = 0.34;
const R = 1.35;

const buildCurve = () => {
	const pts: THREE.Vector3[] = [];
	// approach from bottom-left (off-screen)
	pts.push(new THREE.Vector3(-4.6, -5.2, -0.3));
	pts.push(new THREE.Vector3(-3.0, -3.4, -0.15));
	pts.push(new THREE.Vector3(-1.6, -R - 0.05, 0));
	// loop (counter-clockwise, drifting in z so entry/exit pass each other)
	const N = 28;
	for (let i = 0; i <= N; i++) {
		const a = -Math.PI / 2 + (i / N) * Math.PI * 2;
		pts.push(new THREE.Vector3(Math.cos(a) * R, Math.sin(a) * R, (i / N) * 0.78));
	}
	// exit to the right (off-screen)
	pts.push(new THREE.Vector3(1.6, -R - 0.05, 0.85));
	pts.push(new THREE.Vector3(3.6, -1.9, 0.95));
	pts.push(new THREE.Vector3(6.5, -2.6, 1.05));
	return new THREE.CatmullRomCurve3(pts, false, 'centripetal');
};

type Frame = {p: THREE.Vector3; t: THREE.Vector3; n: THREE.Vector3; l: THREE.Vector3};

const frameAt = (curve: THREE.CatmullRomCurve3, u: number): Frame => {
	const p = curve.getPointAt(u);
	const t = curve.getTangentAt(u).normalize();
	const n = new THREE.Vector3(0, 0, 1).cross(t).normalize(); // surface normal (toward loop centre inside loop)
	const l = t.clone().cross(n).normalize(); // lateral
	return {p, t, n, l};
};

const useTrack = () =>
	useMemo(() => {
		const curve = buildCurve();
		const S = 420;
		const pos: number[] = [];
		const nor: number[] = [];
		const idx: number[] = [];
		const railA: THREE.Vector3[] = [];
		const railB: THREE.Vector3[] = [];
		for (let i = 0; i <= S; i++) {
			const f = frameAt(curve, i / S);
			const a = f.p.clone().addScaledVector(f.l, HALF_W);
			const b = f.p.clone().addScaledVector(f.l, -HALF_W);
			pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
			nor.push(f.n.x, f.n.y, f.n.z, f.n.x, f.n.y, f.n.z);
			railA.push(a.clone().addScaledVector(f.n, 0.06));
			railB.push(b.clone().addScaledVector(f.n, 0.06));
			if (i < S) {
				const k = i * 2;
				idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
			}
		}
		const strip = new THREE.BufferGeometry();
		strip.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
		strip.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
		strip.setIndex(idx);
		const rail = (p: THREE.Vector3[]) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p), S, 0.045, 10, false);
		return {
			curve,
			strip,
			railA: rail(railA),
			railB: rail(railB),
			stripCount: idx.length,
			mat: plastic('#FF7A00', {roughness: 0.2, side: THREE.DoubleSide, emissive: '#ff4d00', emissiveIntensity: 0.08}),
		};
	}, []);

/** Die-cast style sports car (procedural), forward = +x */
const Car: React.FC<{color: string}> = ({color}) => {
	const m = useMemo(() => {
		const s = new THREE.Shape();
		s.moveTo(-0.5, 0.04);
		s.lineTo(0.52, 0.04);
		s.quadraticCurveTo(0.6, 0.06, 0.58, 0.13);
		s.lineTo(0.22, 0.18);
		s.quadraticCurveTo(0.05, 0.33, -0.18, 0.31);
		s.lineTo(-0.42, 0.2);
		s.lineTo(-0.52, 0.2);
		s.lineTo(-0.5, 0.04);
		const body = new THREE.ExtrudeGeometry(s, {depth: 0.36, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.04, bevelSegments: 4, curveSegments: 16});
		body.translate(0, 0, -0.18);
		const w = new THREE.Shape();
		w.moveTo(0.17, 0.2);
		w.quadraticCurveTo(0.04, 0.3, -0.16, 0.29);
		w.lineTo(-0.34, 0.21);
		w.lineTo(0.17, 0.2);
		const win = new THREE.ExtrudeGeometry(w, {depth: 0.44, bevelEnabled: false, curveSegments: 12});
		win.translate(0, 0.005, -0.22);
		return {
			body,
			win,
			paint: metallicPaint(color),
			glass: new THREE.MeshPhysicalMaterial({color: '#0b0f1e', roughness: 0.05, metalness: 0.4, clearcoat: 1}),
			tire: new THREE.MeshStandardMaterial({color: '#111', roughness: 0.6}),
			chrome: new THREE.MeshPhysicalMaterial({color: '#e8e8f0', roughness: 0.12, metalness: 1}),
			tireGeo: new THREE.CylinderGeometry(0.1, 0.1, 0.09, 24),
			rimGeo: new THREE.CylinderGeometry(0.062, 0.062, 0.1, 16),
		};
	}, [color]);
	return (
		<group>
			<mesh geometry={m.body} material={m.paint} position={[0, 0.03, 0]} />
			<mesh geometry={m.win} material={m.glass} position={[0, 0.03, 0]} />
			{[
				[0.33, 0.24],
				[-0.33, 0.24],
				[0.33, -0.24],
				[-0.33, -0.24],
			].map(([x, z], i) => (
				<group key={i} position={[x, 0.1, z]} rotation={[Math.PI / 2, 0, 0]}>
					<mesh geometry={m.tireGeo} material={m.tire} />
					<mesh geometry={m.rimGeo} material={m.chrome} />
				</group>
			))}
		</group>
	);
};

const CAR_COLORS = ['#1E5BFF', '#E10600', '#8BE000'];
const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();

export const RaceTrack: React.FC<{
	position: [number, number, number];
	rotation: [number, number, number];
	scale: number;
	buildStart: number;
}> = ({position, rotation, scale, buildStart}) => {
	const frame = useCurrentFrame();
	const tr = useTrack();
	const grow = interpolate(frame, [buildStart, buildStart + 30], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
	const tris = Math.floor((tr.stripCount / 3) * grow) * 3;
	tr.strip.setDrawRange(0, tris);
	const railCount = Math.floor(((tr.railA.index?.count ?? 0) / 6) * grow) * 6;
	tr.railA.setDrawRange(0, railCount);
	tr.railB.setDrawRange(0, railCount);

	const carsStart = buildStart + 18;
	return (
		<group position={position} rotation={rotation} scale={scale} visible={grow > 0}>
			<mesh geometry={tr.strip} material={tr.mat} />
			<mesh geometry={tr.railA} material={tr.mat} />
			<mesh geometry={tr.railB} material={tr.mat} />
			{CAR_COLORS.map((c, i) => {
				const raw = (frame - carsStart) / 46 + i * 0.29;
				const u = ((raw % 1) + 1) % 1;
				const f = frameAt(tr.curve, Math.min(0.999, u));
				tmpM.makeBasis(f.t, f.n, f.l);
				tmpQ.setFromRotationMatrix(tmpM);
				const p = f.p.clone().addScaledVector(f.n, 0.07);
				return (
					<group key={c} position={p} quaternion={tmpQ.clone()} visible={frame >= carsStart && raw >= 0}>
						<Car color={c} />
					</group>
				);
			})}
		</group>
	);
};
