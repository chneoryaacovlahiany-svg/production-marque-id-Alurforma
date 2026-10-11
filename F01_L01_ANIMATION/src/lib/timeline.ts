import React, { createContext, useContext } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import transcript from "../data/transcript.json";
import envelope from "../data/envelope.json";
import motion from "../data/motion.json";
import scenesData from "../data/scenes.json";
import { ease } from "../theme";

export const FPS = 30;

// ── Global edit structure (frames at 30 fps) ──────────────────────────────
export const GENERIQUE_FRAMES = Math.round(17.13 * FPS); // brand opener (25 fps source)
export const TITLE_FRAMES = 6 * FPS; // painted lesson title card
export const LESSON_START = GENERIQUE_FRAMES + TITLE_FRAMES;
export const LESSON_DURATION = transcript.duration; // 392.02 s of voice
export const AD_AT = scenesData.adBreak.at; // lesson seconds where the mid-roll ad is inserted
export const AD_FRAMES = Math.round(scenesData.adBreak.duration * FPS);
export const RECAP_FRAMES = 10 * FPS;
export const ENDCARD_FRAMES = 8 * FPS;
export const LESSON_FRAMES = Math.ceil(LESSON_DURATION * FPS) + AD_FRAMES;
export const TOTAL_FRAMES = LESSON_START + LESSON_FRAMES + RECAP_FRAMES + ENDCARD_FRAMES;

/** Lesson seconds → global frame (accounts for the inserted ad). */
export const lessonToFrame = (t: number) =>
  LESSON_START + Math.round(t * FPS) + (t >= AD_AT ? AD_FRAMES : 0);

/** Global frame → lesson seconds, or null when outside the voice (intro, ad, outro). */
export const frameToLesson = (f: number): number | null => {
  const local = f - LESSON_START;
  if (local < 0) return null;
  const adStart = Math.round(AD_AT * FPS);
  if (local < adStart) return local / FPS;
  if (local < adStart + AD_FRAMES) return null;
  const t = (local - AD_FRAMES) / FPS;
  return t <= LESSON_DURATION ? t : null;
};

// ── Transcript helpers ────────────────────────────────────────────────────
export type Speaker = "LEA" | "HUGO";
export type Segment = { speaker: Speaker; start: number; end: number; text: string };
export const segments = transcript.segments as Segment[];

export const speakerAt = (t: number): Speaker | null => {
  for (const s of segments) {
    if (t >= s.start - 0.05 && t <= s.end + 0.15) return s.speaker;
  }
  return null;
};

const mouthStr = envelope.mouth as string;
/** Mouth openness 0..1 from the real voice track, at lesson time t. */
export const voiceAt = (t: number) => {
  const i = Math.round(t * FPS);
  if (i < 0 || i >= mouthStr.length) return 0;
  return Number(mouthStr[i]) / 9;
};

/** Spring-smoothed body-language signal of a podcast voice (see scripts/prepare_transcript.py). */
type MotionKey = "gest" | "nod" | "active";
export const motionAt = (who: string, key: MotionKey, t: number) => {
  if (who !== "LEA" && who !== "HUGO") return 0;
  const str = motion[who][key];
  const i = Math.round(t * FPS);
  if (i < 0 || i * 2 >= str.length) return 0;
  const [lo, hi] = motion.ranges[key];
  return lo + (parseInt(str.slice(i * 2, i * 2 + 2), 16) / 255) * (hi - lo);
};

// ── Scene time context: every scene animates in lesson seconds ────────────
export const SceneTimeContext = createContext<{ start: number; lead: number }>({ start: 0, lead: 0 });

/** Current lesson time inside a scene (the scene's Sequence starts `lead` seconds early for its transition). */
export const useT = () => {
  const frame = useCurrentFrame();
  const { start, lead } = useContext(SceneTimeContext);
  return start - lead + frame / FPS;
};

/** 0→1 ramp between two lesson times with a soft ease (clamped). */
export const ramp = (t: number, a: number, b: number, easing = ease.out) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** In/out envelope: fades in over [a, a+fi], out over [b-fo, b]. */
export const span = (t: number, a: number, b: number, fi = 0.4, fo = 0.4) =>
  Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b, ease.inOut));

/** Spring-ish pop with overshoot, 0→1. */
export const pop = (t: number, a: number, d = 0.45) => ramp(t, a, a + d, ease.back);

export const SceneTime: React.FC<{ start: number; lead: number; children: React.ReactNode }> = ({ start, lead, children }) =>
  React.createElement(SceneTimeContext.Provider, { value: { start, lead } }, children);
