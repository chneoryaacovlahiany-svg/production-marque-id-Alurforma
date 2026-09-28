import {Easing} from 'remotion';

export const FPS = 25; // norme télé française
export const W = 1920;
export const H = 1080;
export const TOTAL = 20;
export const TOTAL_FRAMES = TOTAL * FPS;

/**
 * Pulsations (s) de la bande-son, mesurées sur l'audio (103,4 BPM).
 * 0 → 9,40 s : début du morceau Suno ; ensuite : sa vraie fin, raccordée sur un premier temps.
 */
export const BEATS = [
  0.09, 0.65, 1.23, 1.81, 2.51, 3.09, 3.65, 4.23, 4.81, 5.39, 5.94, 6.52, 7.11, 7.66, 8.24, 8.82, 9.4,
  9.94, 10.52, 11.1, 11.68, 12.26, 12.84, 13.42, 14.0, 14.58, 15.16, 15.77, 16.35,
];

/** Découpage : chaque coupe tombe sur un temps ou un coup de la musique. */
export const CUT = {
  installation: 2.51,
  hero: 5.94,
  tunnel: 9.4, // raccord musical : entrée dans le break (la basse s'arrête)
  convergence: 11.72, // premier temps : plongée dans la porte
  whiteout: 12.55,
  logoHit: 12.63, // le coup de la fin du morceau
  taglineHit: 14.04, // premier temps du second break
  tagline2: 15.2,
  finalChord: 16.36, // accord final, qui résonne jusqu'au fondu
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
