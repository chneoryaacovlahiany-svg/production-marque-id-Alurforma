import {Easing} from 'remotion';

export const FPS = 25; // norme télé française
export const W = 1920;
export const H = 1080;
export const TOTAL = 17.08; // durée exacte du morceau « Warm Resolved Chord »
export const TOTAL_FRAMES = Math.round(TOTAL * FPS);

/**
 * Pulsations (s) du morceau « Warm Resolved Chord » (92,3 BPM), mesurées sur l'audio.
 * Groove jusqu'à 8,2 s, passage en tension, puis l'accord résolu se pose à 9,87 s
 * et s'éteint jusqu'au silence.
 */
export const BEATS = [
  0.16, 0.81, 1.46, 2.11, 2.76, 3.41, 4.06, 4.71, 5.36, 6.01, 6.66, 7.31, 7.96, 8.61, 9.26,
];

/** Découpage : chaque coupe tombe sur un temps ou un accent de la musique. */
export const CUT = {
  installation: 1.46,
  hero: 4.71,
  tunnel: 7.31,
  convergence: 8.61, // plongée dans la porte pendant le passage en tension
  whiteout: 9.8,
  logoHit: 9.87, // l'accord résolu se pose
  taglineHit: 10.56,
  tagline2: 11.21,
  signature: 11.86, // mention et reflet, pendant que l'accord s'éteint
};

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  soft: Easing.bezier(0.33, 0, 0.2, 1),
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Progression 0→1 entre deux instants (s), avec easing. */
export const prog = (t: number, from: number, to: number, e: (x: number) => number = (x) => x) =>
  e(clamp((t - from) / (to - from)));

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
