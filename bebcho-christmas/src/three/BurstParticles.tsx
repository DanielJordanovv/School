import React, {useLayoutEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {random, useCurrentFrame} from 'remotion';
import {BURST} from '../lib/anim';

const N = 320;
const COLORS = ['#FFD400', '#FFF3A6', '#FFFFFF', '#B6FF3B', '#FFB800', '#E9D5FF'];

export const BurstParticles: React.FC<{origin: [number, number, number]}> = ({origin}) => {
	const frame = useCurrentFrame();
	const ref = useRef<THREE.InstancedMesh>(null);
	const data = useMemo(
		() =>
			Array.from({length: N}, (_, i) => {
				const th = random(`th${i}`) * Math.PI * 2;
				const ph = Math.acos(2 * random(`ph${i}`) - 1);
				const sp = 0.25 + random(`sp${i}`) * 0.55;
				return {
					v: new THREE.Vector3(Math.sin(ph) * Math.cos(th), Math.abs(Math.cos(ph)) * 1.3 + 0.2, Math.sin(ph) * Math.sin(th) * 0.8).multiplyScalar(sp),
					size: 0.03 + random(`s${i}`) * 0.07,
					life: 35 + random(`l${i}`) * 50,
					color: new THREE.Color(COLORS[Math.floor(random(`c${i}`) * COLORS.length)]),
				};
			}),
		[],
	);
	const mat = useMemo(() => new THREE.MeshBasicMaterial({toneMapped: false}), []);
	const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
	const tmp = useMemo(() => new THREE.Object3D(), []);

	useLayoutEffect(() => {
		const m = ref.current;
		if (!m) return;
		const t = frame - BURST;
		data.forEach((d, i) => {
			if (t < 0 || t > d.life) {
				tmp.scale.setScalar(0);
			} else {
				const k = 0.06;
				const travel = (1 - Math.exp(-k * t)) / k;
				tmp.position.set(origin[0] + d.v.x * travel, origin[1] + d.v.y * travel - 0.0025 * t * t, origin[2] + d.v.z * travel);
				tmp.scale.setScalar(d.size * (1 - t / d.life) * (0.7 + 0.3 * Math.sin(t * 0.8 + i)));
			}
			tmp.updateMatrix();
			m.setMatrixAt(i, tmp.matrix);
			m.setColorAt(i, d.color);
		});
		m.instanceMatrix.needsUpdate = true;
		if (m.instanceColor) m.instanceColor.needsUpdate = true;
	}, [frame, data, origin, tmp]);

	return <instancedMesh ref={ref} args={[geo, mat, N]} frustumCulled={false} />;
};
