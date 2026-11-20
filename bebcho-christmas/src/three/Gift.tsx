import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BURST, CLAMP} from '../lib/anim';
import {Glow} from './Glow';

const PURPLE = '#4A0FB5';
const RIBBON = '#FFCC12';

const useGiftAssets = () =>
	useMemo(() => {
		const box = new THREE.MeshPhysicalMaterial({
			color: PURPLE,
			roughness: 0.38,
			metalness: 0.0,
			clearcoat: 1,
			clearcoatRoughness: 0.1,
			envMapIntensity: 0.55,
		});
		const ribbon = new THREE.MeshPhysicalMaterial({
			color: RIBBON,
			roughness: 0.2,
			metalness: 0.55,
			clearcoat: 1,
			clearcoatRoughness: 0.05,
			emissive: '#ff9d00',
			emissiveIntensity: 0.12,
		});
		const light = new THREE.MeshBasicMaterial({color: '#FFF2B0', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending});
		return {
			box,
			ribbon,
			light,
			body: new RoundedBoxGeometry(2.4, 2.0, 2.4, 5, 0.1),
			lid: new RoundedBoxGeometry(2.62, 0.46, 2.62, 5, 0.1),
			bandBody: new RoundedBoxGeometry(0.44, 2.03, 2.43, 3, 0.04),
			bandLid: new RoundedBoxGeometry(0.44, 0.49, 2.65, 3, 0.04),
			loop: new THREE.TorusGeometry(0.4, 0.12, 24, 64),
			tail: new RoundedBoxGeometry(0.34, 0.06, 0.9, 2, 0.03),
			knot: new THREE.SphereGeometry(0.2, 32, 32),
			seam: new THREE.BoxGeometry(2.5, 0.06, 2.5),
		};
	}, []);

const Lid: React.FC<{a: ReturnType<typeof useGiftAssets>}> = ({a}) => (
	<group>
		<mesh geometry={a.lid} material={a.box} />
		<mesh geometry={a.bandLid} material={a.ribbon} />
		<mesh geometry={a.bandLid} material={a.ribbon} rotation={[0, Math.PI / 2, 0]} />
		<group position={[0, 0.42, 0]}>
			{/* four-loop bow: loops along both ribbon directions, flaring outward */}
			{[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((ry) => (
				<group key={ry} rotation={[0, ry, 0]}>
					<mesh geometry={a.loop} material={a.ribbon} position={[0.42, 0.1, 0]} rotation={[0, 0, -1.0]} scale={[1.1, 0.66, 0.75]} />
				</group>
			))}
			<mesh geometry={a.knot} material={a.ribbon} position={[0, 0.0, 0]} scale={[1.1, 0.8, 1.1]} />
		</group>
	</group>
);

export const Gift: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = useGiftAssets();

	const appear = spring({frame, fps, config: {damping: 10, stiffness: 140, mass: 0.7}});
	const shake = frame < BURST ? interpolate(frame, [14, BURST], [0.015, 0.2], {...CLAMP, easing: Easing.in(Easing.quad)}) : 0;
	const hop = Math.abs(Math.sin(frame * 0.85)) * shake * 1.6;

	// Body sinks away after the burst
	const sink = interpolate(frame, [BURST + 8, BURST + 45], [0, 7.5], {...CLAMP, easing: Easing.in(Easing.cubic)});

	// Lid flies off
	const t = Math.max(0, frame - BURST);
	const lidOpen = frame >= BURST;
	const lidPos: [number, number, number] = lidOpen
		? [-t * 0.09, 1.23 + t * 0.42 - 0.0045 * t * t, -t * 0.06]
		: [0, 1.23 + Math.max(0, Math.sin(frame * 1.3)) * shake * 0.6, 0];
	const lidRot: [number, number, number] = lidOpen ? [-t * 0.07, t * 0.03, t * 0.05] : [0, 0, Math.sin(frame * 1.9) * shake * 0.3];

	const seamGlow = frame < BURST ? interpolate(frame, [22, BURST], [0, 1], CLAMP) : interpolate(frame, [BURST, BURST + 25], [1, 0], CLAMP);
	a.light.opacity = seamGlow;

	return (
		<group
			position={[Math.sin(frame * 2.3) * shake * 0.35, -0.35 + hop - sink, 0]}
			rotation={[0.18, 0.62 + frame * 0.006 + Math.sin(frame * 1.7) * shake * 0.25, Math.sin(frame * 2.9 + 1) * shake * 0.35]}
			scale={interpolate(appear, [0, 1], [0.2, 1])}
		>
			<mesh geometry={a.body} material={a.box} />
			<mesh geometry={a.bandBody} material={a.ribbon} />
			<mesh geometry={a.bandBody} material={a.ribbon} rotation={[0, Math.PI / 2, 0]} />
			<mesh geometry={a.seam} material={a.light} position={[0, 1.02, 0]} scale={[1, 1 + seamGlow * 2, 1]} visible={seamGlow > 0.01} />
			<Glow position={[0, 1.1, 0]} scale={seamGlow * 7} opacity={seamGlow * 0.9} color="#FFE27A" />
			<group position={lidPos} rotation={lidRot}>
				<Lid a={a} />
			</group>
		</group>
	);
};
