import React, {useLayoutEffect} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BURST, CLAMP, flight, V3} from '../lib/anim';
import {Gift} from './Gift';
import {Brick, BRICK_H} from './Brick';
import {Dumpling, Peach, SquishyBear, Strawberry, squish} from './Squishies';
import {DreamHouse, FashionDoll} from './Doll';
import {RaceTrack} from './RaceTrack';
import {Star3D} from './Star';
import {Present} from './Present';
import {BurstParticles} from './BurstParticles';
import {Glow} from './Glow';

const ORIGIN: V3 = [0, 0.4, 0];

const Environment: React.FC = () => {
	const {gl, scene} = useThree();
	useLayoutEffect(() => {
		const pm = new THREE.PMREMGenerator(gl);
		const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
		scene.environment = env;
		scene.environmentIntensity = 0.6;
		return () => {
			env.dispose();
			pm.dispose();
		};
	}, [gl, scene]);
	return null;
};

const CameraRig: React.FC = () => {
	const frame = useCurrentFrame();
	const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
	const z = frame < BURST
		? interpolate(frame, [0, BURST], [10.5, 9.4], {...CLAMP, easing: Easing.out(Easing.quad)})
		: interpolate(frame, [BURST, BURST + 50], [9.4, 14], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
	const kick = frame >= BURST ? Math.exp(-(frame - BURST) * 0.18) * 0.22 : 0;
	const drift = interpolate(frame, [BURST + 50, 300], [0, 1], CLAMP);
	camera.position.set(Math.sin(frame * 3.1) * kick + Math.sin(frame * 0.03) * 0.25 * drift, 0.55 + Math.cos(frame * 2.7) * kick, z);
	camera.lookAt(0, 0, 0);
	camera.updateProjectionMatrix();
	return null;
};

/** Generic flying toy wrapper: launched from the present, settles at `to` */
const Fly: React.FC<{
	start: number;
	to: V3;
	arc?: number;
	scale: number;
	rot?: V3;
	spin?: number;
	bob?: number;
	phase?: number;
	children: React.ReactNode;
}> = ({start, to, arc = 3, scale, rot = [0, 0, 0], spin = 6, bob = 0.08, phase = 0, children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const f = flight(frame, fps, start, ORIGIN, to, {arc});
	const settle = Math.min(1, Math.max(0, f.s));
	const pos: V3 = [f.pos[0], f.pos[1] + Math.sin(frame * 0.07 + phase) * bob * settle, f.pos[2]];
	const sc = interpolate(f.s, [0, 1], [0.12, 1]) * scale;
	const left = 1 - f.s;
	return (
		<group
			position={pos}
			scale={Math.max(0.001, sc)}
			rotation={[rot[0] + left * spin * 0.6, rot[1] + left * spin + Math.sin(frame * 0.05 + phase) * 0.12 * settle, rot[2] + left * spin * 0.3]}
			visible={f.visible}
		>
			{children}
		</group>
	);
};

const STARS: {orbit: number; to: V3; s: number}[] = [
	{orbit: 0, to: [-6.4, 3.4, -1], s: 0.42},
	{orbit: 0.9, to: [6.3, 3.5, -1], s: 0.5},
	{orbit: 1.8, to: [-3.6, 3.7, -2.5], s: 0.3},
	{orbit: 2.7, to: [3.4, 3.8, -2.5], s: 0.34},
	{orbit: 3.6, to: [-7.6, 0.6, -2], s: 0.36},
	{orbit: 4.5, to: [7.7, 1.1, -2], s: 0.36},
	{orbit: 5.4, to: [0, 4.1, -3], s: 0.28},
];

const Stars: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<>
			{STARS.map((st, i) => {
				const appear = spring({frame: frame - i * 2, fps, config: {damping: 12, stiffness: 120}});
				const ang = st.orbit + frame * 0.07;
				const orbitPos: V3 = [Math.cos(ang) * 2.7, -0.2 + Math.sin(ang * 2) * 0.5, Math.sin(ang) * 1.6];
				const atBurst: V3 = [Math.cos(st.orbit + BURST * 0.07) * 2.7, -0.2 + Math.sin((st.orbit + BURST * 0.07) * 2) * 0.5, Math.sin(st.orbit + BURST * 0.07) * 1.6];
				const f = flight(frame, fps, BURST + i, atBurst, st.to, {damping: 14, stiffness: 60});
				const pos = frame < BURST ? orbitPos : f.pos;
				const pulse = 1 + Math.sin(frame * 0.2 + i) * 0.08;
				return <Star3D key={i} position={pos} scale={appear * (frame < BURST ? 0.32 : interpolate(f.s, [0, 1], [0.32, st.s])) * pulse} spin={frame * 0.06 + i} glow={1} />;
			})}
		</>
	);
};

const PRESENTS: {pos: V3; color: string; ribbon: string; size: V3; d: number}[] = [
	{pos: [-5.2, 1.6, -7], color: '#7C3AED', ribbon: '#FFD400', size: [1.3, 1.1, 1.3], d: 0},
	{pos: [5.6, 1.9, -7.5], color: '#FFD400', ribbon: '#6D28D9', size: [1.2, 1.2, 1.2], d: 4},
	{pos: [-9.5, -2.0, -6], color: '#9BE22D', ribbon: '#FFFFFF', size: [1.4, 1.0, 1.4], d: 8},
	{pos: [9.4, -1.0, -6.5], color: '#FFFFFF', ribbon: '#9BE22D', size: [1.1, 1.3, 1.1], d: 2},
	{pos: [-10.5, 4.2, -9], color: '#FFFFFF', ribbon: '#FFD400', size: [1.2, 1.2, 1.2], d: 3},
	{pos: [10.8, 4.5, -9], color: '#7C3AED', ribbon: '#9BE22D', size: [1.3, 1.1, 1.3], d: 7},
	{pos: [8.6, -4.6, -3.5], color: '#FFD400', ribbon: '#FFFFFF', size: [1.1, 1.0, 1.1], d: 12},
	{pos: [-8.6, -4.7, -3.5], color: '#7C3AED', ribbon: '#FFD400', size: [1.2, 1.0, 1.2], d: 9},
];

const Presents: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<>
			{PRESENTS.map((p, i) => {
				const s = spring({frame: frame - (BURST + 40 + p.d), fps, config: {damping: 12, stiffness: 80}});
				return (
					<group key={i} position={[p.pos[0], p.pos[1] + Math.sin(frame * 0.05 + i) * 0.15, p.pos[2]]} rotation={[0.25, frame * 0.01 + i, Math.sin(frame * 0.04 + i) * 0.1]} scale={Math.max(0.001, s)}>
						<Present color={p.color} ribbon={p.ribbon} size={p.size} />
					</group>
				);
			})}
		</>
	);
};

const BRICK_STACK: {w: number; d: number; c: string; x: number; z: number; ry: number}[] = [
	{w: 4, d: 2, c: '#E3000B', x: 0, z: 0, ry: 0},
	{w: 4, d: 2, c: '#0057B8', x: 0.25, z: 0, ry: 0.1},
	{w: 2, d: 2, c: '#FFD500', x: -0.25, z: 0, ry: -0.05},
	{w: 4, d: 2, c: '#00A650', x: 0.1, z: 0.05, ry: 0.2},
];

const Bricks: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const base: V3 = [-4.15, -3.6, 0.8];
	return (
		<>
			{/* a mini build that assembles itself */}
			{BRICK_STACK.map((b, i) => {
				const start = BURST + 14 + i * 7;
				const to: V3 = [base[0] + b.x, base[1] + i * BRICK_H, base[2] + b.z];
				const f = flight(frame, fps, start, ORIGIN, to, {arc: 3.2, damping: 16, stiffness: 110});
				const left = 1 - f.s;
				return <Brick key={i} w={b.w} d={b.d} color={b.c} position={f.pos} rotation={[0.35 + left * 4, b.ry + 0.5 + left * 6, left * 2]} scale={interpolate(f.s, [0, 1], [0.2, 1])} visible={f.visible} />;
			})}
			{/* loose bricks */}
			<Fly start={BURST + 8} to={[3.9, -3.45, 1.0]} scale={1} rot={[0.4, -0.6, 0.15]} phase={1}>
				<Brick w={4} d={2} color="#FFD500" />
			</Fly>
			<Fly start={BURST + 12} to={[2.8, -3.0, 0.2]} scale={0.9} rot={[0.6, 0.4, -0.5]} phase={2}>
				<Brick w={2} d={2} color="#E3000B" />
			</Fly>
			<Fly start={BURST + 5} to={[-5.2, 2.2, -1.5]} scale={0.9} rot={[0.5, 0.3, 0.7]} phase={3} bob={0.2}>
				<Brick w={2} d={2} color="#0057B8" />
			</Fly>
			<Fly start={BURST + 10} to={[5.0, 2.4, -1.5]} scale={0.9} rot={[0.7, -0.4, -0.6]} phase={4} bob={0.2}>
				<Brick w={4} d={2} color="#00A650" />
			</Fly>
			<Fly start={BURST + 16} to={[4.9, -3.75, 0.6]} scale={0.85} rot={[0.3, 0.9, 0]} phase={5}>
				<Brick w={2} d={2} color="#0057B8" />
			</Fly>
		</>
	);
};

const Squishies: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<>
			<Fly start={BURST + 4} to={[0, -3.2, 1.2]} scale={0.95} arc={4.5} rot={[0.1, 0, 0]} spin={7} bob={0.05}>
				<SquishyBear squash={squish(frame, 0, 0.06)} />
			</Fly>
			<Fly start={BURST + 2} to={[2.1, -3.45, 1.6]} scale={0.6} arc={5} rot={[0.15, -0.3, 0]} phase={1.3}>
				<Dumpling squash={squish(frame, 1, 0.08)} />
			</Fly>
			<Fly start={BURST + 6} to={[-2.0, -3.45, 1.6]} scale={0.56} arc={5.5} rot={[0.1, 0.3, 0]} phase={2.1}>
				<Peach squash={squish(frame, 2, 0.08)} />
			</Fly>
			<Fly start={BURST + 1} to={[-6.6, 2.5, 0.2]} scale={0.62} arc={2.5} rot={[0.1, 0.4, 0.2]} phase={0.5} bob={0.18}>
				<Strawberry squash={squish(frame, 3, 0.07)} />
			</Fly>
			<Fly start={BURST + 3} to={[6.7, 2.55, 0.2]} scale={0.6} arc={2.5} rot={[0.15, -0.4, -0.15]} phase={2.5} bob={0.18}>
				<Dumpling color="#FFC2DD" squash={squish(frame, 4, 0.08)} />
			</Fly>
		</>
	);
};

export const World3D: React.FC = () => {
	const {width, height} = useVideoConfig();
	const frame = useCurrentFrame();
	const burstLight = interpolate(frame, [BURST - 10, BURST + 2, BURST + 30], [0, 1, 0], CLAMP);
	return (
		<ThreeCanvas width={width} height={height} camera={{fov: 35, position: [0, 0.5, 10.5], near: 0.1, far: 100}} gl={{antialias: true, alpha: true, preserveDrawingBuffer: true}}>
			<Environment />
			<CameraRig />
			<ambientLight intensity={0.35} color="#E9D8FF" />
			<directionalLight position={[5, 8, 7]} intensity={2.2} color="#FFF6E8" />
			<directionalLight position={[-7, 3, -4]} intensity={1.6} color="#C084FC" />
			<directionalLight position={[0, -4, 6]} intensity={0.6} color="#FFE08A" />
			<pointLight position={[0, 1.2, 1]} intensity={burstLight * 60} distance={14} color="#FFD25C" />

			<Gift />
			<Glow position={[0, 1, 0.5]} scale={burstLight * 16} opacity={burstLight} color="#FFE9A0" />
			<BurstParticles origin={[0, 1.0, 0]} />
			<Stars />
			<Presents />
			<Squishies />
			<Bricks />

			{/* fashion doll + dream house playset */}
			<Fly start={BURST + 9} to={[-7.0, -2.75, -1.4]} scale={1.15} arc={2} rot={[0.12, 0.55, 0]} spin={3} bob={0}>
				<DreamHouse />
			</Fly>
			<Fly start={BURST + 6} to={[-5.55, -3.25, 0.9]} scale={1.3} arc={3.5} rot={[0.05, 0.25, 0]} spin={5} bob={0.03} phase={0.7}>
				<FashionDoll wave={frame * 0.15} />
			</Fly>

			<RaceTrack position={[6.45, -0.5, -0.4]} rotation={[0.12, -0.68, 0]} scale={1.12} buildStart={BURST + 12} />
		</ThreeCanvas>
	);
};
