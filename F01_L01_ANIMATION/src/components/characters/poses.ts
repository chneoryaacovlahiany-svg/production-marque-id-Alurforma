import { Easing, interpolate } from "remotion";
import { ease } from "../../theme";

// Arm = [shoulder angle (outward from hanging), elbow bend (forearm toward body/up)] in degrees,
// plus an optional upper-arm length factor (<1 fakes an arm raised toward the camera).
export type Arm = [number, number] | [number, number, number];
export type Pose = { L: Arm; R: Arm };

export const POSES = {
  rest: { L: [7, 6], R: [7, 6] },
  explain: { L: [7, 8], R: [22, -100] },
  explainL: { L: [22, -100], R: [7, 8] },
  open: { L: [34, -48], R: [34, -48] },
  shrug: { L: [18, -118], R: [18, -118] },
  hold: { L: [8, 92], R: [8, 92] },
  holdR: { L: [7, 6], R: [8, 96] },
  pointR: { L: [7, 8], R: [92, 4] },
  pointL: { L: [92, 4], R: [7, 8] },
  pointUpR: { L: [7, 8], R: [150, 10] },
  pointUpL: { L: [150, 10], R: [7, 8] },
  phone: { L: [7, 8], R: [60, 223, 0.35] },
  think: { L: [6, 88], R: [20, 165, 0.4] },
  wave: { L: [7, 8], R: [140, -30] },
  offerR: { L: [7, 8], R: [60, 20] },
  offerL: { L: [60, 20], R: [7, 8] },
  cheer: { L: [150, 20], R: [150, 20] },
  handsHips: { L: [40, -70], R: [40, -70] },
  fingerUp: { L: [7, 8], R: [16, -150] },
} satisfies Record<string, Pose>;

export type PoseName = keyof typeof POSES;
export type PoseKey = { at: number; pose: PoseName };

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const mixArm = (a: Arm, b: Arm, kShoulder: number, kElbow: number): Arm => [
  lerp(a[0], b[0], kShoulder),
  lerp(a[1], b[1], kElbow),
  lerp(a[2] ?? 1, b[2] ?? 1, kShoulder),
];

const SHOULDER_EASE = Easing.bezier(0.45, 0, 0.2, 1);
const ELBOW_EASE = Easing.bezier(0.3, 1.35, 0.55, 1); // follow-through with a little overshoot

/**
 * Pose at lesson time t from a schedule. Like a real arm, the shoulder leads and the elbow
 * follows a few frames later with a soft overshoot (overlapping action).
 */
export const poseAt = (keys: PoseKey[] | PoseName | undefined, t: number, blend = 0.55): Pose => {
  if (!keys) return POSES.rest;
  if (typeof keys === "string") return POSES[keys];
  let prev: Pose = POSES.rest;
  let cur: Pose = POSES.rest;
  let at = -1e9;
  for (const k of keys) {
    if (t >= k.at) {
      prev = cur;
      cur = POSES[k.pose];
      at = k.at;
    }
  }
  const o = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const k1 = interpolate(t, [at, at + blend], [0, 1], { ...o, easing: SHOULDER_EASE });
  const k2 = interpolate(t, [at + 0.07, at + 0.07 + blend], [0, 1], { ...o, easing: ELBOW_EASE });
  return { L: mixArm(prev.L, cur.L, k1, k2), R: mixArm(prev.R, cur.R, k1, k2) };
};

export type Mood = "neutral" | "smile" | "happy" | "surprised" | "worried" | "focused";
export type MoodKey = { at: number; mood: Mood };
export const moodAt = (keys: MoodKey[] | Mood | undefined, t: number): Mood => {
  if (!keys) return "smile";
  if (typeof keys === "string") return keys;
  let m: Mood = "smile";
  for (const k of keys) if (t >= k.at) m = k.mood;
  return m;
};

/** Generic numeric keyframes (lesson time → value) with soft easing. */
export type NumKey = [number, number];
export const keyAt = (keys: NumKey[] | number | undefined, t: number, fallback = 0) => {
  if (keys === undefined) return fallback;
  if (typeof keys === "number") return keys;
  if (keys.length === 1) return keys[0][1];
  return interpolate(t, keys.map((k) => k[0]), keys.map((k) => k[1]), {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.inOut,
  });
};
