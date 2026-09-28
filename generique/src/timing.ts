import {Easing} from 'remotion';

export const FPS = 25; // norme télé française
export const W = 1920;
export const H = 1080;
export const TOTAL = 18.72;
export const TOTAL_FRAMES = Math.round(TOTAL * FPS);

/**
 * Pulsations (s) de la bande-son, mesurées sur l'audio (103,4 BPM).
 * Le morceau Suno joue en continu jusqu'à 13,96 s, puis enchaîne sur son accord final.
 */
export const BEATS = [
  0.09, 0.65, 1.23, 1.81, 2.51, 3.09, 3.65, 4.23, 4.81, 5.39, 5.94, 6.52, 7.11, 7.66, 8.24, 8.82, 9.4,
  9.96, 10.54, 11.12, 11.68, 12.26, 12.84, 13.42,
];

/** Découpage : chaque coupe tombe sur un temps de la musique. */
export const CUT = {
  installation: 2.51,
  hero: 5.94,
  tunnel: 9.4,
  convergence: 12.84, // plongée dans la porte, sur la dernière mesure
  whiteout: 13.88,
  logoHit: 13.96, // accord final du morceau
  taglineHit: 15.21,
  tagline2: 15.91,
  signature: 16.66, // mention et reflet, pendant que l'accord résonne
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
