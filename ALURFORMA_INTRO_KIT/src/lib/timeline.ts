import { interpolate } from "remotion";
import { ease } from "../theme";

// Animation helpers shared by the intro and the character rig.
export const FPS = 30;

/** 0→1 ramp between two times (seconds) with a soft ease (clamped). */
export const ramp = (t: number, a: number, b: number, easing = ease.out) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** In/out envelope: fades in over [a, a+fi], out over [b-fo, b]. */
export const span = (t: number, a: number, b: number, fi = 0.4, fo = 0.4) =>
  Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, ease.inOut));

/** Spring-ish pop with overshoot, 0→1. */
export const pop = (t: number, a: number, d = 0.45) => ramp(t, a, a + d, ease.back);

// The rig can lip-sync to a podcast voice (see the full F01 L01 project). The intro is silent speech-wise.
export const speakerAt = (_t: number): "LEA" | "HUGO" | null => null;
export const voiceAt = (_t: number) => 0;
export const motionAt = (_who: string, _key: "gest" | "nod" | "active", _t: number) => 0;
