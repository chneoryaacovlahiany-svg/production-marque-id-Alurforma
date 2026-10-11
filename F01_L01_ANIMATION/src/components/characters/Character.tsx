import React from "react";
import { random } from "remotion";
import { motionAt, speakerAt, voiceAt } from "../../lib/timeline";
import { looks, Who, Look } from "./looks";
import { Mood, MoodKey, moodAt, NumKey, keyAt, PoseKey, PoseName, poseAt } from "./poses";

export type CharacterProps = {
  who: Who;
  t: number; // lesson seconds (drives idle, blink, lip-sync)
  x: number | NumKey[]; // screen x of the feet centre (px)
  y: number; // ground line (px)
  h: number; // height in px for heightScale = 1
  pose?: PoseKey[] | PoseName;
  mood?: MoodKey[] | Mood;
  look?: number | NumKey[]; // -1 (looks screen-left) … 1 (screen-right)
  walk?: boolean | [number, number][]; // walking windows [from, to] in lesson seconds
  talk?: number; // override mouth openness
  flip?: boolean;
  opacity?: number;
  rightItem?: React.ReactNode;
  leftItem?: React.ReactNode;
  seed?: number;
};

// Hand-painted anime look: thin warm line, two-tone cel shading, soft blush, painted hair highlights.
const LINE = "#4b3328";
const LW = 3.0; // body line weight (rig units)
const FW = 2.5; // face line weight
const HEAD_SCALE = 1.24;
const headTransform = (lookX: number, tilt: number, nod: number) =>
  `translate(${lookX * 5} ${nod}) rotate(${tilt} 0 236) translate(0 236) scale(${HEAD_SCALE}) translate(0 -86)`;

const isWalking = (walk: CharacterProps["walk"], t: number) => {
  if (!walk) return false;
  if (walk === true) return true;
  return walk.some(([a, b]) => t >= a && t <= b);
};

// Deterministic smooth noise (sum of incommensurate sines) for organic micro-motion.
const noise = (t: number, seed: number) => Math.sin(t * 1.13 + seed) * 0.5 + Math.sin(t * 2.37 + seed * 1.7) * 0.3 + Math.sin(t * 0.61 + seed * 2.3) * 0.2;

export const Character: React.FC<CharacterProps> = (p) => {
  const L = looks[p.who];
  const t = p.t;
  const seed = p.seed ?? p.who.length * 13;

  // lip-sync: Léa and Hugo are the two podcast voices
  const voice = (p.who === "LEA" || p.who === "HUGO") && speakerAt(t) === p.who ? voiceAt(t) : 0;
  const talk = p.talk ?? voice;
  const isHost = p.who === "LEA" || p.who === "HUGO";
  const other = p.who === "LEA" ? "HUGO" : "LEA";
  // spring-smoothed body language driven by the real voice (offline damped-spring simulation)
  const gestSig = p.talk === undefined ? motionAt(p.who, "gest", t) : talk * 0.6;
  const nodSig = p.talk === undefined ? motionAt(p.who, "nod", t) : 0;
  const active = p.talk === undefined ? motionAt(p.who, "active", t) : talk > 0.04 ? 1 : 0;
  const listening = isHost && p.talk === undefined ? motionAt(other, "active", t) * (1 - active) : 0;
  const pose = poseAt(p.pose, t);
  const mood = moodAt(p.mood, t);
  const lookX = keyAt(p.look, t, 0);
  const x = keyAt(p.x as NumKey[] | number, t, 0);
  const walking = isWalking(p.walk, t);

  // idle life: breathing, slow weight shift from one hip to the other, micro head motion
  const breath = Math.sin(t * 1.9 + seed) * 2.2;
  const weight = Math.sin(t * 0.42 + seed) * (walking ? 0 : 1); // −1 … 1
  const sway = weight * 0.9 + noise(t * 0.5, seed) * 0.3;
  const wind = noise(t * 1.4, seed + 3);
  const step = Math.sin(t * 8.4);
  const bob = walking ? -Math.abs(step) * 8 : 0;
  const tiltAt = (tt: number) => noise(tt * 0.8, seed + 7) * 2 + lookX * 2.5 - weight * 1.2;
  const headTilt = tiltAt(t);
  const hairLag = (headTilt - tiltAt(t - 0.12)) * 4; // hair follows the head a few frames late
  // talking: nods on stressed syllables; listening: slow, attentive back-channel nods
  const headNod = nodSig * 11 + active * noise(t * 3, seed) * 1.2 + listening * Math.max(0, Math.sin(t * 2.1 + seed)) * 3 + noise(t * 0.7, seed + 1) * 0.8;

  // eyes: small saccades every ~1.7 s + three-frame blinks
  const sacStep = Math.floor((t + seed) / 1.7);
  const sacLocal = (t + seed) / 1.7 - sacStep;
  const sac = (k: number) => (random(`sac-${seed}-${k}`) - 0.5) * 0.35;
  const gaze = lookX + (sacLocal < 0.05 ? sac(sacStep - 1) + (sac(sacStep) - sac(sacStep - 1)) * (sacLocal / 0.05) : sac(sacStep));
  const period = 3.4 + random(`blink-${seed}`) * 1.6;
  const ph = (t + random(`ph-${seed}`) * period) % period;
  const blink: 0 | 0.5 | 1 = ph < 0.04 ? 0.5 : ph < 0.1 ? 1 : ph < 0.15 ? 0.5 : 0;

  // talking hands: beat gestures on accents + slow organic drift
  const gest = gestSig * 30 + active * noise(t * 1.5, seed + 5) * 5 + noise(t * 0.5, seed + 5) * 2;
  const swing = walking ? step * 11 : 0; // arms swing against the legs
  const armR: [number, number, number] = [pose.R[0] + gest * 0.35 + swing + weight * 1.5, pose.R[1] + gest, pose.R[2] ?? 1];
  const armL: [number, number, number] = [pose.L[0] - gest * 0.2 - swing - weight * 1.5, pose.L[1] - gest * 0.4, pose.L[2] ?? 1];

  const H = p.h * L.heightScale;
  const W = H * 0.44;
  const gid = `${p.who}-${seed}`;

  return (
    <div style={{ position: "absolute", left: x - W / 2, top: p.y - H, width: W, height: H, opacity: p.opacity ?? 1, scale: p.flip ? "-1 1" : undefined }}>
      <svg viewBox="-220 0 440 1000" width={W} height={H} style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id={`blush-${gid}`}>
            <stop offset="0" stopColor={L.blush} stopOpacity={0.55} />
            <stop offset="1" stopColor={L.blush} stopOpacity={0} />
          </radialGradient>
          <radialGradient id={`ground-${gid}`}>
            <stop offset="0" stopColor="#3a2a1e" stopOpacity={0.28} />
            <stop offset="1" stopColor="#3a2a1e" stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={weight * 6} cy={996} rx={110} ry={18} fill={`url(#ground-${gid})`} />
        <g transform={`translate(0 ${bob}) rotate(${sway} 0 1000)`}>
          <Legs L={L} phase={walking ? step : 0} weight={weight} />
          <g transform={`translate(${weight * 4} ${breath * 0.4}) rotate(${-weight * 0.8} 0 540)`}>
            <BackHair L={L} lookX={lookX} tilt={headTilt} nod={headNod} wind={wind + hairLag} />
            <Neck L={L} />
            <Torso L={L} breath={breath} wind={wind} />
            <g transform={`translate(0 ${-breath * 0.6})`}>
              <ArmG L={L} side="L" arm={armL} item={p.leftItem} />
              <ArmG L={L} side="R" arm={armR} item={p.rightItem} />
            </g>
            <Head L={L} lookX={lookX} gaze={gaze} tilt={headTilt} nod={headNod} talk={talk} mood={mood} blink={blink} wind={wind + hairLag} gid={gid} />
          </g>
        </g>
      </svg>
    </div>
  );
};

const Neck: React.FC<{ L: Look }> = ({ L }) => (
  <g>
    <path d="M -15 196 L 15 196 L 17 266 L -17 266 Z" fill={L.skin} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M -15 200 C -6 222 8 222 16 202 L 16 214 C 8 232 -6 232 -15 214 Z" fill={L.skinShade} />
  </g>
);

const Legs: React.FC<{ L: Look; phase: number; weight: number }> = ({ L, phase, weight }) => {
  const leg = (side: -1 | 1) => {
    const rot = phase * 9 * side + weight * 1.2;
    const lift = Math.max(0, phase * side) * 12; // the swinging foot leaves the ground
    const cx = side * 30;
    return (
      <g transform={`translate(0 ${-lift}) rotate(${rot} ${cx} 540)`} key={side}>
        {/* trouser leg: thigh, knee, tapering calf */}
        <path
          d={`M ${cx - 40} 532 L ${cx + 38} 532 C ${cx + 36} 640 ${cx + 31} 716 ${cx + 29} 760 C ${cx + 28} 840 ${cx + 28} 900 ${cx + 31} 948 L ${cx - 29} 948 C ${cx - 31} 900 ${cx - 31} 840 ${cx - 31} 760 C ${cx - 33} 716 ${cx - 38} 640 ${cx - 40} 532 Z`}
          fill={L.bottom}
          stroke={LINE}
          strokeWidth={LW}
          strokeLinejoin="round"
        />
        <path d={`M ${cx + 14} 545 C ${cx + 20} 680 ${cx + 17} 820 ${cx + 20} 944 L ${cx + 29} 944 C ${cx + 26} 840 ${cx + 28} 716 ${cx + 34} 545 Z`} fill={L.bottomShade} />
        <path d={`M ${cx - 16} 748 C ${cx - 6} 756 ${cx + 6} 756 ${cx + 16} 746`} fill="none" stroke={L.bottomShade} strokeWidth={2.4} strokeLinecap="round" />
        <path d={`M ${cx - 22} 906 C ${cx - 8} 914 ${cx + 8} 914 ${cx + 24} 905`} fill="none" stroke={L.bottomShade} strokeWidth={2.2} strokeLinecap="round" />
        {/* rounded leather shoe */}
        <path
          d={`M ${cx - 28} 944 C ${cx - 34} 966 ${cx - 32} 990 ${cx - 14 + side * 6} 994 L ${cx + 28 + side * 18} 994 C ${cx + 48 + side * 16} 992 ${cx + 46 + side * 10} 972 ${cx + 30} 944 Z`}
          fill={L.shoes}
          stroke={LINE}
          strokeWidth={LW}
          strokeLinejoin="round"
        />
        <path d={`M ${cx - 16} 958 C ${cx - 4} 954 ${cx + 10} 954 ${cx + 22} 958`} fill="none" stroke="#ffffff" strokeOpacity={0.25} strokeWidth={4} strokeLinecap="round" />
      </g>
    );
  };
  return (
    <g>
      {leg(-1)}
      {leg(1)}
    </g>
  );
};

const Torso: React.FC<{ L: Look; breath: number; wind: number }> = ({ L, breath, wind }) => {
  const s = L.shoulder;
  const b = L.belly;
  const sh = s - 4; // shoulder point, slightly sloped down from the neck
  const body = `M -26 256 C ${-sh + 22} 258 ${-sh} 268 ${-sh} 304 C ${-sh + 2} 370 ${-s + 14} 420 ${-s + 18 - b * 0.2} 462 C ${-s + 12 - b} 500 ${-s + 16} 536 -52 550 C -18 556 18 556 52 550 C ${s - 16 + wind * 3} 536 ${s - 12 + b} 500 ${s - 18 + b * 0.2} 462 C ${s - 14} 420 ${sh - 2} 370 ${sh} 304 C ${sh} 268 ${sh - 22} 258 26 256 Z`;
  return (
    <g transform={`translate(0 ${-breath * 0.3}) scale(1 ${1 + breath * 0.002})`}>
      <path d={body} fill={L.top} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
      {/* cel shadow: light comes from the top-left */}
      <path d={`M ${s - 26} 284 C ${s - 8} 320 ${s - 8 + b * 0.6} 470 ${s - 20} 540 L ${s - 46} 548 C ${s - 36 + b * 0.5} 470 ${s - 36} 330 ${s - 26} 284 Z`} fill={L.topShade} />
      <path d={`M ${-s + 18} 300 C ${-s + 26} 296 ${-s + 40} 296 ${-s + 52} 302`} fill="none" stroke={L.topShade} strokeWidth={2.4} strokeLinecap="round" />
      {/* cloth folds */}
      <path d={`M -34 482 C -24 492 -10 494 2 490`} fill="none" stroke={L.topShade} strokeWidth={2.4} strokeLinecap="round" />
      <path d={`M 10 512 C 22 518 34 516 44 508`} fill="none" stroke={L.topShade} strokeWidth={2.4} strokeLinecap="round" />
      {L.topStyle === "cardigan" && (
        <>
          <path d="M -28 258 L -12 552 L 12 552 L 28 258 C 12 278 -12 278 -28 258 Z" fill={L.inner} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
          <path d="M 4 300 L 10 552 L 12 552 L 14 300 Z" fill={L.innerShade} />
          <path d="M -28 258 C -16 290 16 290 28 258" fill="none" stroke={LINE} strokeWidth={LW} />
          <path d="M -20 266 C -10 282 10 282 20 266" fill="none" stroke={L.innerShade} strokeWidth={4} />
          {[335, 405, 475].map((yy) => (
            <circle key={yy} cx={-18} cy={yy} r={4.2} fill="#d6b56a" stroke={LINE} strokeWidth={1.6} />
          ))}
          {/* knit ribbing at the hem */}
          {[-60, -48, 36, 48].map((xx) => (
            <path key={xx} d={`M ${xx} 528 L ${xx + 1} 548`} stroke={L.topShade} strokeWidth={2.2} />
          ))}
        </>
      )}
      {L.topStyle === "vest" && (
        <>
          <path d="M -32 258 L 0 350 L 32 258 Z" fill={L.inner} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
          <path d="M -10 258 L 0 274 L 10 258" fill="none" stroke={LINE} strokeWidth={2.2} />
          <path d="M 0 274 L 0 320" stroke={L.innerShade} strokeWidth={2} />
          {/* knit cables */}
          {[-36, 36].map((xx) => (
            <path key={xx} d={`M ${xx} 360 C ${xx + 6} 380 ${xx - 6} 400 ${xx} 420 C ${xx + 6} 440 ${xx - 6} 460 ${xx} 480`} fill="none" stroke={L.topShade} strokeWidth={2.4} />
          ))}
          {[-50, -38, -26, 26, 38, 50].map((xx) => (
            <path key={xx} d={`M ${xx} 526 L ${xx} 548`} stroke={L.topShade} strokeWidth={2.2} />
          ))}
        </>
      )}
      {L.topStyle === "jacket" && (
        <>
          <path d="M -28 258 L -4 430 L 4 430 L 28 258 Z" fill={L.inner} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
          <path d="M -28 258 L -46 306 L -16 336 L -4 430" fill={L.top} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
          <path d="M 28 258 L 46 306 L 16 336 L 4 430" fill={L.topShade} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
          <circle cx={-10} cy={460} r={4.5} fill="#5a3b24" stroke={LINE} strokeWidth={1.4} />
          <circle cx={-10} cy={500} r={4.5} fill="#5a3b24" stroke={LINE} strokeWidth={1.4} />
          <path d="M -58 470 L -26 470" stroke={LINE} strokeWidth={2.2} />
          {/* corduroy wales */}
          {[-56, -44, 34, 46].map((xx) => (
            <path key={xx} d={`M ${xx} 352 L ${xx + (xx > 0 ? 2 : -2)} 534`} stroke={L.topShade} strokeWidth={1.8} opacity={0.8} />
          ))}
        </>
      )}
      {L.topStyle === "blazer" && (
        <>
          <path d="M -26 258 L 0 392 L 26 258 Z" fill={L.inner} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
          <path d="M -26 258 L -42 302 L -16 324 L 0 392" fill={L.top} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
          <path d="M 26 258 L 42 302 L 16 324 L 0 392" fill={L.topShade} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
          <circle cx={0} cy={438} r={4.5} fill="#d6b56a" stroke={LINE} strokeWidth={1.6} />
        </>
      )}
      {L.badge && (
        <g>
          <path d="M -20 262 L -7 366 M 20 262 L 7 366" stroke="#2e8f62" strokeWidth={4.5} fill="none" />
          <rect x={-22} y={364} width={44} height={56} rx={6} fill="#fffdf6" stroke={LINE} strokeWidth={2.4} />
          <rect x={-22} y={364} width={44} height={13} rx={4} fill="#2e8f62" />
          <circle cx={0} cy={393} r={8} fill="#ead9bd" stroke={LINE} strokeWidth={1.4} />
          <path d="M -12 410 L 12 410" stroke="#9c8a78" strokeWidth={2.6} />
        </g>
      )}
      <path d="M -52 550 C -18 556 18 556 52 550" fill="none" stroke={LINE} strokeWidth={LW} />
    </g>
  );
};

/** Simple painted hand: palm + fingers block, finger lines, thumb on the inner side. */
const Hand: React.FC<{ L: Look; s: number }> = ({ L, s }) => (
  <g>
    <path d={`M ${-s * 11} -4 C ${-s * 21} 4 ${-s * 21} 16 ${-s * 13} 21`} fill={L.skin} stroke={LINE} strokeWidth={LW} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M -14 -8 C -16 6 -15 20 -10 29 C -6 35 6 35 10 29 C 15 20 16 6 14 -8 Z" fill={L.skin} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
    <path d="M -5 18 L -5.5 30 M 2 18 L 2 31 M 8 17 L 8.5 27" stroke={L.skinShade} strokeWidth={1.6} strokeLinecap="round" />
    <path d={`M ${s * 6} -6 C ${s * 12} 4 ${s * 12} 16 ${s * 8} 26`} fill="none" stroke={L.skinShade} strokeWidth={3} strokeLinecap="round" />
  </g>
);

const ArmG: React.FC<{ L: Look; side: "L" | "R"; arm: [number, number, number]; item?: React.ReactNode }> = ({ L, side, arm, item }) => {
  const s = side === "R" ? 1 : -1;
  const sx = s * (L.shoulder - 16);
  const sy = 292;
  const shoulderRot = -s * arm[0];
  const elbowRot = s * arm[1];
  const vest = L.topStyle === "vest";
  const sleeve = vest ? L.inner : L.top;
  const sleeveShade = vest ? L.innerShade : L.topShade;
  const fore = L.sleeveSkin ? L.skin : sleeve;
  const foreShade = L.sleeveSkin ? L.skinShade : sleeveShade;
  return (
    <g transform={`translate(${sx} ${sy}) rotate(${shoulderRot})`}>
      <g transform={`scale(1 ${arm[2]})`}>
        <path d="M -20 -8 C -22 60 -18 122 -15 174 L 15 174 C 18 122 22 60 20 -8 C 13 -26 -13 -26 -20 -8 Z" fill={sleeve} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
        <path d={`M ${s * 7} -2 C ${s * 14} 60 ${s * 12} 122 ${s * 10} 170 L ${s * 15} 170 C ${s * 18} 122 ${s * 20} 60 ${s * 18} -6 Z`} fill={sleeveShade} />
        <path d="M -12 96 C -4 102 6 102 14 94" fill="none" stroke={sleeveShade} strokeWidth={2.2} strokeLinecap="round" />
      </g>
      <g transform={`translate(0 ${172 * arm[2]}) rotate(${elbowRot})`}>
        <circle cx={0} cy={0} r={15} fill={sleeve} stroke={LINE} strokeWidth={LW} />
        <path d="M -14 0 C -15 50 -13 110 -12 150 L 12 150 C 13 110 15 50 14 0 Z" fill={fore} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />
        <path d={`M ${s * 6} 4 L ${s * 5} 146 L ${s * 11} 146 L ${s * 13} 4 Z`} fill={foreShade} />
        {L.sleeveSkin && <path d="M -18 -6 C -6 0 6 0 18 -6 L 17 24 C 6 30 -6 30 -17 24 Z" fill={sleeve} stroke={LINE} strokeWidth={LW} strokeLinejoin="round" />}
        {!L.sleeveSkin && <path d="M -14 132 C -4 138 6 138 14 132 L 13 150 L -13 150 Z" fill={L.inner} stroke={LINE} strokeWidth={2.2} strokeLinejoin="round" />}
        <g transform="translate(0 160)">
          <Hand L={L} s={s} />
          {item && <g transform={`rotate(${-(shoulderRot + elbowRot)})`}>{item}</g>}
        </g>
      </g>
    </g>
  );
};

const BackHair: React.FC<{ L: Look; lookX: number; tilt: number; nod: number; wind: number }> = ({ L, lookX, tilt, nod, wind }) => {
  const tr = headTransform(lookX, tilt, nod);
  const st = { stroke: LINE, strokeWidth: FW, strokeLinejoin: "round" as const };
  if (L.hairStyle === "bob") {
    const w = wind * 3;
    return (
      <g transform={tr}>
        <path d={`M -60 -30 C -72 -104 72 -108 62 -28 C 66 10 70 40 ${64 + w} 64 C 56 72 44 70 36 62 L -36 62 C -46 70 -60 70 ${-66 + w} 62 C -70 36 -64 6 -60 -30 Z`} fill={L.hair} {...st} />
        <path d={`M 40 0 C 52 20 58 42 ${60 + w} 60 C 50 62 44 58 40 50 Z`} fill={L.hairShade} />
      </g>
    );
  }
  if (L.hairStyle === "ponytail") {
    const w = wind * 8;
    return (
      <g transform={tr}>
        <path d={`M 34 -64 C 88 -74 ${110 + w} -10 ${94 + w} 80 C ${90 + w} 104 ${82 + w} 118 ${74 + w} 126 C ${76 + w} 90 70 30 38 -24 Z`} fill={L.hair} {...st} />
        <path d={`M 54 -40 C 80 -30 ${92 + w} 10 ${86 + w} 70`} fill="none" stroke={L.hairHi} strokeWidth={4} strokeLinecap="round" opacity={0.8} />
        <ellipse cx={44} cy={-56} rx={8} ry={10} fill="#2e8f62" stroke={LINE} strokeWidth={2} />
      </g>
    );
  }
  if (L.hairStyle === "messy" || L.hairStyle === "short") {
    return (
      <g transform={tr}>
        <path d="M -56 -14 C -64 -104 62 -108 56 -14 C 58 6 54 24 48 34 L -48 34 C -54 24 -58 6 -56 -14 Z" fill={L.hair} {...st} />
      </g>
    );
  }
  return null;
};

const Head: React.FC<{ L: Look; lookX: number; gaze: number; tilt: number; nod: number; talk: number; mood: Mood; blink: 0 | 0.5 | 1; wind: number; gid: string }> = ({
  L,
  lookX,
  gaze,
  tilt,
  nod,
  talk,
  mood,
  blink,
  wind,
  gid,
}) => {
  const fx = lookX * 6; // facial features shift → fake 3/4 turn
  const browLift = mood === "surprised" ? -6 : mood === "worried" ? -2 : mood === "focused" ? 2.5 : talk > 0.5 ? -2.5 : 0;
  const browInner = mood === "worried" ? -6 : mood === "focused" ? 4 : 0;
  return (
    <g transform={headTransform(lookX, tilt, nod)}>
      {/* ears */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={s * 48 + fx * 0.3} cy={6} rx={7.5} ry={11.5} fill={L.skin} stroke={LINE} strokeWidth={FW} />
          <path d={`M ${s * 47 + fx * 0.3} 0 C ${s * 50 + fx * 0.3} 4 ${s * 50 + fx * 0.3} 10 ${s * 46 + fx * 0.3} 13`} fill="none" stroke={L.skinShade} strokeWidth={2} />
        </g>
      ))}
      {L.earrings && [-1, 1].map((s) => <circle key={`e${s}`} cx={s * 49} cy={22} r={3.6} fill="#d6b56a" stroke={LINE} strokeWidth={1.2} />)}
      {/* face: soft adult oval */}
      <path d="M -49 -38 C -51 -86 51 -86 49 -38 L 49 -6 C 49 30 32 58 0 66 C -32 58 -49 30 -49 -6 Z" fill={L.skin} stroke={LINE} strokeWidth={FW} strokeLinejoin="round" />
      {/* cel shading: jaw on the shadow side + hair shadow on the forehead */}
      <path d="M 34 -28 C 48 -6 46 30 16 60 C 30 32 38 4 34 -28 Z" fill={L.skinShade} opacity={0.75} />
      <path d={`M -44 -40 C -26 -30 -6 -34 8 -42 C 22 -32 36 -30 46 -38 L 46 -30 C 32 -22 18 -24 8 -32 C -6 -24 -26 -20 -44 -30 Z`} fill={L.skinShade} opacity={0.6} />
      {/* blush */}
      <ellipse cx={-26 + fx} cy={24} rx={13} ry={7} fill={`url(#blush-${gid})`} />
      <ellipse cx={26 + fx} cy={24} rx={13} ry={7} fill={`url(#blush-${gid})`} />
      {/* eyes: almond, dark iris, single highlight, strong upper lid with outer flick */}
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${s * 20 + fx} 4) scale(${s} 1)`}>
          {blink === 1 ? (
            <path d="M -11 1 C -5 6 5 6 12 1" fill="none" stroke={LINE} strokeWidth={3.2} strokeLinecap="round" />
          ) : (
            <g transform={blink === 0.5 ? "translate(0 2) scale(1 0.5)" : undefined}>
              <path d="M -10 0 C -8 -9 8 -9 11 -1 C 8 6 -6 7 -10 0 Z" fill="#fdf8ef" />
              <ellipse cx={gaze * 2.6 * s} cy={0} rx={5.8} ry={7.8} fill={L.iris} />
              <ellipse cx={gaze * 2.6 * s} cy={0.6} rx={3.2} ry={4.6} fill="#140c0a" />
              <circle cx={gaze * 2.6 * s - 1.8 * s} cy={-3} r={2} fill="#fff" />
              <path d="M -12 -1 C -8 -11 8 -11 13 -3 L 16 -6" fill="none" stroke={LINE} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
              <path d="M -6 7 C -2 8.6 3 8.6 7 6.4" fill="none" stroke={L.skinShade} strokeWidth={1.6} strokeLinecap="round" />
            </g>
          )}
        </g>
      ))}
      {L.glasses && (
        <g fill="none" stroke="#5a4136" strokeWidth={2.2}>
          <circle cx={-20 + fx} cy={4} r={15} />
          <circle cx={20 + fx} cy={4} r={15} />
          <path d={`M ${-5 + fx} 2 Q ${fx} -2 ${5 + fx} 2`} />
          <path d={`M ${-35 + fx} 0 L -47 -3 M ${35 + fx} 0 L 47 -3`} />
          <path d={`M ${-27 + fx} -4 L ${-20 + fx} -9`} stroke="#ffffff" strokeOpacity={0.7} strokeWidth={2.4} strokeLinecap="round" />
        </g>
      )}
      {/* brows */}
      {[-1, 1].map((s) => (
        <path
          key={s}
          d={`M ${s * 30 + fx} ${-17 + browLift} C ${s * 24 + fx} ${-22 + browLift} ${s * 15 + fx} ${-22 + browLift} ${s * 9 + fx} ${-18 + browLift + browInner}`}
          fill="none"
          stroke={L.brows}
          strokeWidth={L.mustache ? 6 : 3.2}
          strokeLinecap="round"
        />
      ))}
      {/* nose: a painted side shadow and a tiny tip */}
      <path d={`M ${4 + fx * 1.2} 10 C ${8 + fx * 1.2} 18 ${8 + fx * 1.2} 23 ${2 + fx * 1.2} 25`} fill="none" stroke={L.skinShade} strokeWidth={2.6} strokeLinecap="round" />
      <path d={`M ${-2 + fx * 1.2} 26 L ${3 + fx * 1.2} 26`} stroke={LINE} strokeWidth={1.6} strokeLinecap="round" opacity={0.6} />
      <Mouth L={L} fx={fx} talk={talk} mood={mood} />
      <FrontHair L={L} fx={fx} wind={wind} />
    </g>
  );
};

const Mouth: React.FC<{ L: Look; fx: number; talk: number; mood: Mood }> = ({ L, fx, talk, mood }) => {
  const cx = fx * 1.1;
  const cy = 41;
  let m: React.ReactNode;
  if (talk > 0.04) {
    const o = Math.min(1, talk * 1.15);
    m = (
      <g>
        <path
          d={`M ${cx - 8 - 2 * o} ${cy - 1} C ${cx - 4} ${cy - 3} ${cx + 4} ${cy - 3} ${cx + 8 + 2 * o} ${cy - 1} C ${cx + 6} ${cy + 4 + 9 * o} ${cx - 6} ${cy + 4 + 9 * o} ${cx - 8 - 2 * o} ${cy - 1} Z`}
          fill="#6e2f2a"
          stroke={LINE}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <ellipse cx={cx} cy={cy + 2 + 5 * o} rx={4 + 2 * o} ry={1 + 2 * o} fill="#d97f73" />
      </g>
    );
  } else if (mood === "happy") {
    m = (
      <g>
        <path d={`M ${cx - 11} ${cy - 2} C ${cx - 6} ${cy - 1} ${cx + 6} ${cy - 1} ${cx + 11} ${cy - 2} C ${cx + 8} ${cy + 11} ${cx - 8} ${cy + 11} ${cx - 11} ${cy - 2} Z`} fill="#6e2f2a" stroke={LINE} strokeWidth={2} strokeLinejoin="round" />
        <path d={`M ${cx - 5} ${cy + 5} Q ${cx} ${cy + 9} ${cx + 5} ${cy + 5}`} fill="#d97f73" />
      </g>
    );
  } else if (mood === "surprised") {
    m = <ellipse cx={cx} cy={cy + 2} rx={4.5} ry={6} fill="#6e2f2a" stroke={LINE} strokeWidth={2} />;
  } else if (mood === "worried") {
    m = <path d={`M ${cx - 7} ${cy + 2} Q ${cx} ${cy - 3} ${cx + 7} ${cy + 2}`} fill="none" stroke={LINE} strokeWidth={2.4} strokeLinecap="round" />;
  } else if (mood === "neutral" || mood === "focused") {
    m = <path d={`M ${cx - 6} ${cy} Q ${cx} ${cy + 1.5} ${cx + 6} ${cy}`} fill="none" stroke={LINE} strokeWidth={2.4} strokeLinecap="round" />;
  } else {
    m = <path d={`M ${cx - 8} ${cy - 1} Q ${cx} ${cy + 6} ${cx + 8} ${cy - 1}`} fill="none" stroke={LINE} strokeWidth={2.4} strokeLinecap="round" />;
  }
  return (
    <g>
      {m}
      {L.mustache && (
        <path
          d={`M ${cx - 24} ${cy - 3} C ${cx - 16} ${cy - 14} ${cx - 4} ${cy - 12} ${cx} ${cy - 9} C ${cx + 4} ${cy - 12} ${cx + 16} ${cy - 14} ${cx + 24} ${cy - 3} C ${cx + 14} ${cy + 1} ${cx + 5} ${cy - 2} ${cx} ${cy - 4} C ${cx - 5} ${cy - 2} ${cx - 14} ${cy + 1} ${cx - 24} ${cy - 3} Z`}
          fill={L.hair}
          stroke={LINE}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      )}
    </g>
  );
};

const FrontHair: React.FC<{ L: Look; fx: number; wind: number }> = ({ L, fx, wind }) => {
  const st = { stroke: LINE, strokeWidth: FW, strokeLinejoin: "round" as const };
  const f = fx * 0.4;
  const w = wind * 2.5;
  if (L.hairStyle === "bob")
    return (
      <g transform={`translate(${f} 0)`}>
        {/* side-swept fringe */}
        <path d={`M -54 -16 C -62 -84 32 -108 62 -38 C 63 -26 61 -16 ${57 + w} -6 C 48 -34 30 -48 6 -50 C -8 -38 -26 -28 ${-44 + w} -20 C -48 -18 -51 -16 -54 -16 Z`} fill={L.hair} {...st} />
        <path d={`M -54 -16 C -64 14 -64 42 ${-56 + w} 66 C -48 52 -46 28 -45 0 Z`} fill={L.hair} {...st} />
        <path d={`M 58 -16 C 66 14 66 42 ${58 + w} 66 C 50 52 48 28 47 0 Z`} fill={L.hair} {...st} />
        {/* painted highlight + strands */}
        <path d="M -34 -70 C -12 -82 18 -80 40 -64" fill="none" stroke={L.hairHi} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
        <path d="M -20 -58 C -10 -48 0 -44 10 -44 M 20 -64 C 34 -54 44 -40 50 -26" fill="none" stroke={L.hairShade} strokeWidth={1.8} strokeLinecap="round" />
        <path d="M -52 10 C -54 30 -52 46 -50 56" fill="none" stroke={L.hairShade} strokeWidth={1.8} strokeLinecap="round" />
      </g>
    );
  if (L.hairStyle === "messy")
    return (
      <g transform={`translate(${f} 0)`}>
        {/* soft tousled clumps */}
        <path
          d={`M -54 -4 C -64 -62 -40 -102 0 -100 C 44 -102 68 -64 56 -4 C 52 -20 48 -28 40 -32 C 42 -20 38 -12 32 -8 C 30 -24 24 -34 14 -38 C 14 -26 8 -20 0 -16 C -2 -30 -8 -38 -18 -40 C -16 -28 -22 -20 -30 -16 C -32 -28 -38 -34 -46 -36 C -44 -24 -48 -12 -54 -4 Z`}
          fill={L.hair}
          {...st}
        />
        <path d={`M 4 -98 C 10 -112 ${22 + w * 2} -116 ${28 + w * 2} -108`} fill="none" stroke={L.hair} strokeWidth={4} strokeLinecap="round" />
        <path d="M -26 -82 C -6 -92 20 -90 38 -78" fill="none" stroke={L.hairHi} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
        <path d="M -36 -60 C -30 -50 -26 -44 -24 -36 M 22 -64 C 28 -56 30 -48 30 -40" fill="none" stroke={L.hairShade} strokeWidth={1.8} strokeLinecap="round" />
      </g>
    );
  if (L.hairStyle === "short")
    return (
      <g transform={`translate(${f} 0)`}>
        <path d="M -54 -6 C -64 -104 62 -110 56 -6 C 50 -40 26 -54 -2 -52 C -26 -50 -46 -36 -54 -6 Z" fill={L.hair} {...st} />
        <path d="M -26 -72 C -6 -82 18 -80 34 -68" fill="none" stroke={L.hairHi} strokeWidth={4.5} strokeLinecap="round" opacity={0.85} />
      </g>
    );
  if (L.hairStyle === "ponytail")
    return (
      <g transform={`translate(${f} 0)`}>
        <path d="M -54 -8 C -62 -106 60 -110 54 -8 C 46 -46 22 -60 -2 -58 C -26 -56 -46 -42 -54 -8 Z" fill={L.hair} {...st} />
        <path d={`M -40 -40 C -46 -20 -46 0 ${-42 + w * 2} 16`} fill="none" stroke={L.hair} strokeWidth={3} strokeLinecap="round" />
        <path d="M -24 -70 C -4 -80 20 -78 36 -66" fill="none" stroke={L.hairHi} strokeWidth={4.5} strokeLinecap="round" opacity={0.85} />
      </g>
    );
  // flat cap + white tufts
  return (
    <g transform={`translate(${f} 0)`}>
      <path d="M -50 -14 C -60 -2 -58 18 -50 28 C -46 14 -44 2 -44 -8 Z" fill={L.hair} {...st} />
      <path d="M 50 -14 C 60 -2 58 18 50 28 C 46 14 44 2 44 -8 Z" fill={L.hair} {...st} />
      <path d="M -60 -30 C -60 -90 60 -96 62 -32 C 36 -40 -36 -40 -60 -30 Z" fill="#71765d" {...st} />
      <path d="M 0 -88 C 30 -86 54 -66 62 -32 C 50 -36 40 -38 30 -38 C 28 -60 18 -78 0 -88 Z" fill="#5e624c" />
      <path d="M -60 -30 C -36 -26 30 -24 82 -32 C 70 -18 -44 -18 -60 -24 Z" fill="#5e624c" {...st} />
      <path d="M -36 -72 C -10 -82 18 -82 42 -70" fill="none" stroke="#8f9476" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};
