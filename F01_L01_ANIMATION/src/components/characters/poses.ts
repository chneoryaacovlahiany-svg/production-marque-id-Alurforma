import { interpolate } from "remotion";
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

const mixArm = (a: Arm, b: Arm, k: number): Arm => [
  a[0] + (b[0] - a[0]) * k,
  a[1] + (b[1] - a[1]) * k,
  (a[2] ?? 1) + ((b[2] ?? 1) - (a[2] ?? 1)) * k,
];

/** Pose at lesson time t from a schedule; each change blends over `blend` seconds. */
export const poseAt = (keys: PoseKey[] | PoseName | undefined, t: number, blend = 0.45): Pose => {
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
  const m = interpolate(t, [at, at + blend], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.inOut });
  return { L: mixArm(prev.L, cur.L, m), R: mixArm(prev.R, cur.R, m) };
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
