import {spring} from 'remotion';

export type V3 = [number, number, number];

export const CLAMP = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const lerp3 = (a: V3, b: V3, t: number): V3 => [
	lerp(a[0], b[0], t),
	lerp(a[1], b[1], t),
	lerp(a[2], b[2], t),
];

// Frame at which the present bursts open
export const BURST = 60;

type FlightOptions = {
	arc?: number;
	damping?: number;
	stiffness?: number;
	mass?: number;
	arcFrames?: number;
};

/**
 * A toy launched from `from` at frame `start` that flies (with an arc) and
 * settles with a springy overshoot at `to`.
 */
export const flight = (
	frame: number,
	fps: number,
	start: number,
	from: V3,
	to: V3,
	opts: FlightOptions = {},
) => {
	const s = spring({
		frame: frame - start,
		fps,
		config: {
			damping: opts.damping ?? 11,
			stiffness: opts.stiffness ?? 70,
			mass: opts.mass ?? 0.9,
		},
	});
	const arcFrames = opts.arcFrames ?? 26;
	const t = Math.min(1, Math.max(0, (frame - start) / arcFrames));
	const arc = (opts.arc ?? 0) * Math.sin(Math.PI * t);
	const pos = lerp3(from, to, s);
	pos[1] += arc;
	return {pos, s, visible: frame >= start, t};
};
