import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {plastic} from './materials';

/** Fashion doll in a signature pink outfit (procedural) */
export const FashionDoll: React.FC<{wave: number}> = ({wave}) => {
	const m = useMemo(() => {
		const skin = new THREE.MeshPhysicalMaterial({color: '#F7CFB4', roughness: 0.42, clearcoat: 0.3});
		const hair = new THREE.MeshPhysicalMaterial({color: '#F8D86A', roughness: 0.35, metalness: 0.1, sheen: 1, sheenColor: new THREE.Color('#fff3b0'), clearcoat: 0.5});
		const pink = plastic('#FF2E93', {roughness: 0.25});
		const light = plastic('#FF8CC6', {roughness: 0.3});
		const eye = new THREE.MeshBasicMaterial({color: '#2A6BFF'});
		const lips = new THREE.MeshBasicMaterial({color: '#FF2E7A'});
		const skirt = new THREE.LatheGeometry(
			[0.13, 0.16, 0.24, 0.34, 0.44, 0.5].map((r, i) => new THREE.Vector2(r, -i * 0.11)),
			64,
		);
		return {skin, hair, pink, light, eye, lips, skirt};
	}, []);
	return (
		<group>
			{/* legs */}
			{[-1, 1].map((s) => (
				<group key={s}>
					<mesh material={m.skin} position={[s * 0.08, 0.5, 0]}>
						<capsuleGeometry args={[0.055, 0.62, 8, 16]} />
					</mesh>
					<mesh material={m.pink} position={[s * 0.08, 0.13, 0.04]} scale={[0.07, 0.06, 0.12]}>
						<sphereGeometry args={[1, 16, 12]} />
					</mesh>
				</group>
			))}
			{/* skirt */}
			<mesh geometry={m.skirt} material={m.pink} position={[0, 1.32, 0]} />
			{/* torso */}
			<mesh material={m.pink} position={[0, 1.48, 0]} scale={[1, 1, 0.75]}>
				<capsuleGeometry args={[0.13, 0.22, 8, 24]} />
			</mesh>
			<mesh material={m.light} position={[0, 1.33, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.75, 1]}>
				<torusGeometry args={[0.14, 0.025, 12, 32]} />
			</mesh>
			{/* arms */}
			<mesh material={m.skin} position={[-0.21, 1.4, 0]} rotation={[0, 0, -0.25]}>
				<capsuleGeometry args={[0.04, 0.42, 8, 16]} />
			</mesh>
			<group position={[0.18, 1.6, 0]} rotation={[0, 0, 2.5 + Math.sin(wave) * 0.25]}>
				<mesh material={m.skin} position={[0, -0.24, 0]}>
					<capsuleGeometry args={[0.04, 0.42, 8, 16]} />
				</mesh>
			</group>
			{/* neck + head */}
			<mesh material={m.skin} position={[0, 1.74, 0]}>
				<cylinderGeometry args={[0.045, 0.05, 0.12, 16]} />
			</mesh>
			<group position={[0, 1.94, 0]}>
				<mesh material={m.skin} scale={[0.17, 0.2, 0.17]}>
					<sphereGeometry args={[1, 48, 32]} />
				</mesh>
				<mesh material={m.hair} position={[0, 0.04, -0.03]} scale={[0.19, 0.21, 0.19]}>
					<sphereGeometry args={[1, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
				</mesh>
				<mesh material={m.hair} position={[0, -0.25, -0.1]} scale={[1.15, 1, 0.7]}>
					<capsuleGeometry args={[0.16, 0.42, 8, 24]} />
				</mesh>
				{[-1, 1].map((s) => (
					<mesh key={s} material={m.eye} position={[s * 0.06, 0.01, 0.155]} scale={[0.025, 0.03, 0.01]}>
						<sphereGeometry args={[1, 12, 12]} />
					</mesh>
				))}
				<mesh material={m.lips} position={[0, -0.09, 0.155]} scale={[0.035, 0.015, 0.01]}>
					<sphereGeometry args={[1, 12, 12]} />
				</mesh>
				<mesh material={m.light} position={[0, 0.17, 0.02]} rotation={[Math.PI / 2 - 0.4, 0, 0]}>
					<torusGeometry args={[0.15, 0.02, 12, 32, Math.PI]} />
				</mesh>
			</group>
		</group>
	);
};

/** Pink dream-house style playset (procedural) */
export const DreamHouse: React.FC = () => {
	const m = useMemo(() => {
		const roofShape = new THREE.Shape();
		roofShape.moveTo(-1.15, 0);
		roofShape.lineTo(0, 0.85);
		roofShape.lineTo(1.15, 0);
		roofShape.lineTo(-1.15, 0);
		return {
			wall: plastic('#FF7EC2', {roughness: 0.28}),
			roof: plastic('#E0127A', {roughness: 0.22}),
			white: plastic('#FFFFFF'),
			glass: new THREE.MeshPhysicalMaterial({color: '#9EE7FF', roughness: 0.05, transmission: 0, metalness: 0.2, clearcoat: 1}),
			body: new RoundedBoxGeometry(1.9, 1.5, 1.2, 4, 0.06),
			roofGeo: new THREE.ExtrudeGeometry(roofShape, {depth: 1.35, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3}),
			frame: new RoundedBoxGeometry(0.46, 0.46, 0.08, 2, 0.03),
			pane: new THREE.BoxGeometry(0.36, 0.36, 0.06),
			door: new RoundedBoxGeometry(0.42, 0.7, 0.08, 2, 0.04),
		};
	}, []);
	return (
		<group>
			<mesh geometry={m.body} material={m.wall} position={[0, 0.75, 0]} />
			<mesh geometry={m.roofGeo} material={m.roof} position={[0, 1.5, -0.675]} />
			{[
				[-0.55, 1.05],
				[0.55, 1.05],
				[-0.55, 0.42],
			].map(([x, y], i) => (
				<group key={i} position={[x, y, 0.6]}>
					<mesh geometry={m.frame} material={m.white} />
					<mesh geometry={m.pane} material={m.glass} position={[0, 0, 0.02]} />
				</group>
			))}
			<mesh geometry={m.door} material={m.white} position={[0.5, 0.36, 0.6]} />
			<mesh position={[0, 1.92, 0.55]} material={m.white}>
				<torusGeometry args={[0.16, 0.05, 12, 32]} />
			</mesh>
		</group>
	);
};
