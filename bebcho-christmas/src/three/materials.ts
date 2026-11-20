import * as THREE from 'three';

export const plastic = (color: string, extra: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
	new THREE.MeshPhysicalMaterial({
		color,
		roughness: 0.18,
		metalness: 0,
		clearcoat: 1,
		clearcoatRoughness: 0.08,
		...extra,
	});

export const soft = (color: string, extra: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
	new THREE.MeshPhysicalMaterial({
		color,
		roughness: 0.6,
		metalness: 0,
		sheen: 1,
		sheenRoughness: 0.5,
		sheenColor: new THREE.Color('#ffffff'),
		clearcoat: 0.25,
		clearcoatRoughness: 0.6,
		...extra,
	});

export const metallicPaint = (color: string) =>
	new THREE.MeshPhysicalMaterial({
		color,
		roughness: 0.28,
		metalness: 0.75,
		clearcoat: 1,
		clearcoatRoughness: 0.05,
	});

export const gold = () =>
	new THREE.MeshPhysicalMaterial({
		color: '#FFC21A',
		roughness: 0.22,
		metalness: 0.65,
		emissive: '#FF9F00',
		emissiveIntensity: 0.25,
		clearcoat: 1,
		clearcoatRoughness: 0.1,
	});

let glowTex: THREE.CanvasTexture | null = null;
/** Soft radial glow texture used for additive light sprites */
export const getGlowTexture = () => {
	if (glowTex) return glowTex;
	const size = 256;
	const c = document.createElement('canvas');
	c.width = size;
	c.height = size;
	const ctx = c.getContext('2d')!;
	const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
	g.addColorStop(0, 'rgba(255,255,255,1)');
	g.addColorStop(0.15, 'rgba(255,245,200,0.85)');
	g.addColorStop(0.4, 'rgba(255,200,60,0.35)');
	g.addColorStop(1, 'rgba(255,170,0,0)');
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, size, size);
	glowTex = new THREE.CanvasTexture(c);
	glowTex.colorSpace = THREE.SRGBColorSpace;
	return glowTex;
};
