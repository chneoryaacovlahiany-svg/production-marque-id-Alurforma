import {Easing} from 'remotion';

export const FPS = 25; // norme télé française
export const W = 1920;
export const H = 1080;
export const TOTAL = 14;
export const TOTAL_FRAMES = TOTAL * FPS;

/** Temps (s) des pulsations du jingle à 104 BPM, mesurés sur l'audio. */
export const BEATS = [
  0.07, 0.64, 1.33, 1.92, 2.49, 3.06, 3.63, 4.2, 4.78, 5.35, 5.92, 6.5, 7.07, 7.65, 8.22, 8.8, 9.37, 9.94,
  10.52, 11.08, 11.54,
];

/** Découpage du générique : chaque coupe tombe sur une pulsation ou un impact. */
export const CUT = {
  installation: 2.49,
  hero: 4.78,
  tunnel: 7.07,
  convergence: 9.37,
  whiteout: 10.6,
  logoHit: 11.0, // premier impact grave
  taglineHit: 11.6, // second impact grave
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
