import React, {useLayoutEffect} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {useThree} from '@react-three/fiber';
import {ThreeCanvas} from '@remotion/three';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BURST, CLAMP, flight, V3} from '../lib/anim';
import {Gift} from './Gift';
import {Star3D} from './Star';
import {Present} from './Present';
import {BurstParticles} from './BurstParticles';
import {Glow} from './Glow';


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

		</ThreeCanvas>
	);
};
