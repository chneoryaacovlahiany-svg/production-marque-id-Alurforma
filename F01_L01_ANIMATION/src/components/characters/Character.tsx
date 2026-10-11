import React from "react";
import { random } from "remotion";
import { C } from "../../theme";
import { speakerAt, voiceAt } from "../../lib/timeline";
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

const INK = C.ink;
const SW = 3.6;

const isWalking = (walk: CharacterProps["walk"], t: number) => {
  if (!walk) return false;
  if (walk === true) return true;
  return walk.some(([a, b]) => t >= a && t <= b);
};

export const Character: React.FC<CharacterProps> = (p) => {
  const L = looks[p.who];
  const t = p.t;
  const seed = p.seed ?? p.who.length * 13;

  // lip-sync: Léa and Hugo are the two podcast voices
  const voice = (p.who === "LEA" || p.who === "HUGO") && speakerAt(t) === p.who ? voiceAt(t) : 0;
  const talk = p.talk ?? voice;
  const talking = talk > 0.04;

  const pose = poseAt(p.pose, t);
  const mood = moodAt(p.mood, t);
  const lookX = keyAt(p.look, t, 0);
  const x = keyAt(p.x as NumKey[] | number, t, 0);
  const walking = isWalking(p.walk, t);

  // idle life
  const breath = Math.sin(t * 2.1 + seed) * 2.2;
  const sway = Math.sin(t * 0.9 + seed) * 0.8;
  const walkPhase = walking ? Math.sin(t * 9) : 0;
  const bob = walking ? -Math.abs(Math.sin(t * 9)) * 10 : 0;
  const headNod = talking ? Math.sin(t * 7.3 + seed) * 2.2 * Math.min(1, talk * 1.8) : 0;
  const headTilt = Math.sin(t * 0.7 + seed) * 1.6 + lookX * 2.5;

  // blink every ~3–5 s, deterministic
  const period = 3.4 + random(`blink-${seed}`) * 1.6;
  const ph = (t + random(`ph-${seed}`) * period) % period;
  const blink = ph < 0.13 ? 0.08 : 1;

  // gesture wobble while speaking (hands "talk" too)
  const gest = talking ? Math.sin(t * 4.1 + seed) * 7 : 0;
  const armR: [number, number, number] = [pose.R[0] + gest * 0.4, pose.R[1] + gest, pose.R[2] ?? 1];
  const armL: [number, number, number] = [pose.L[0] - gest * 0.25, pose.L[1] - gest * 0.5, pose.L[2] ?? 1];

  const scale = L.heightScale;
  const H = p.h * scale;
  const W = H * 0.44;

  return (
    <div
      style={{
        position: "absolute",
        left: x - W / 2,
        top: p.y - H,
        width: W,
        height: H,
        opacity: p.opacity ?? 1,
        scale: p.flip ? "-1 1" : undefined,
      }}
    >
      <svg viewBox="-220 0 440 1000" width={W} height={H} style={{ overflow: "visible" }}>
        <ellipse cx={0} cy={1000} rx={92} ry={14} fill="rgba(45,35,25,0.2)" />
        <g transform={`translate(0 ${bob}) rotate(${sway} 0 1000)`}>
          <Legs L={L} phase={walkPhase} />
          <g transform={`translate(0 ${breath * 0.4})`}>
            <BackHair L={L} lookX={lookX} tilt={headTilt} nod={headNod} />
            <rect x={-15} y={210} width={30} height={60} rx={10} fill={L.skinShade} stroke={INK} strokeWidth={SW} />
            <Torso L={L} breath={breath} />
            <ArmG L={L} side="L" arm={armL} item={p.leftItem} />
            <ArmG L={L} side="R" arm={armR} item={p.rightItem} />
            <Head L={L} lookX={lookX} tilt={headTilt} nod={headNod} talk={talk} mood={mood} blink={blink} />
          </g>
        </g>
      </svg>
    </div>
  );
};

const Legs: React.FC<{ L: Look; phase: number }> = ({ L, phase }) => {
  const leg = (side: -1 | 1) => {
    const rot = phase * 14 * side;
    return (
      <g transform={`rotate(${rot} ${side * 32} 540)`} key={side}>
        <path
          d={`M ${side * 32 - 38} 535 L ${side * 32 + 36} 535 L ${side * 32 + 28} 945 L ${side * 32 - 28} 945 Z`}
          fill={L.bottom}
          stroke={INK}
          strokeWidth={SW}
          strokeLinejoin="round"
        />
        <path d={`M ${side * 32 + 12} 545 L ${side * 32 + 32} 545 L ${side * 32 + 25} 940 L ${side * 32 + 10} 940 Z`} fill={L.bottomShade} opacity={0.6} />
        <path
          d={`M ${side * 32 - 30} 938 C ${side * 32 - 36} 966 ${side * 32 - 34 + side * 6} 992 ${side * 32 - 12 + side * 8} 994 L ${side * 32 + 30 + side * 18} 994 C ${side * 32 + 46 + side * 18} 988 ${side * 32 + 38} 962 ${side * 32 + 30} 938 Z`}
          fill={L.shoes}
          stroke={INK}
          strokeWidth={SW}
          strokeLinejoin="round"
        />
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

const Torso: React.FC<{ L: Look; breath: number }> = ({ L, breath }) => {
  const s = L.shoulder;
  const b = L.belly;
  const body = `M ${-s} 290 C ${-s} 266 ${-s + 16} 254 -30 250 L 30 250 C ${s - 16} 254 ${s} 266 ${s} 290 L ${s - 10 + b * 0.4} 450 C ${s - 6 + b} 500 ${s - 12} 538 58 548 L -58 548 C ${-(s - 12)} 538 ${-(s - 6 + b)} 500 ${-(s - 10 + b * 0.4)} 450 Z`;
  return (
    <g transform={`translate(0 ${-breath * 0.3}) scale(1 ${1 + breath * 0.002})`}>
      <path d={body} fill={L.top} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      {/* cel shade on the right side (light from top-left) */}
      <path d={`M ${s - 22} 280 C ${s - 6} 300 ${s - 4 + b * 0.6} 470 ${s - 16} 540 L ${s - 40} 546 C ${s - 30 + b * 0.5} 470 ${s - 30} 320 ${s - 22} 280 Z`} fill={L.topShade} opacity={0.8} />
      {L.topStyle === "cardigan" && (
        <>
          <path d="M -26 252 L -12 548 L 12 548 L 26 252 C 10 270 -10 270 -26 252 Z" fill={L.inner} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M -26 252 C -14 282 14 282 26 252" fill="none" stroke={INK} strokeWidth={SW} />
          {[330, 400, 470].map((yy) => (
            <circle key={yy} cx={-17} cy={yy} r={4.5} fill={C.gold} stroke={INK} strokeWidth={2} />
          ))}
        </>
      )}
      {L.topStyle === "vest" && (
        <>
          <path d="M -30 250 L 0 340 L 30 250 Z" fill={L.inner} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M -8 250 L 0 262 L 8 250" fill="none" stroke={INK} strokeWidth={2.5} />
          {/* knit ribs */}
          {[-40, -20, 20, 40].map((xx) => (
            <path key={xx} d={`M ${xx} 520 L ${xx} 545`} stroke={L.topShade} strokeWidth={3} />
          ))}
        </>
      )}
      {L.topStyle === "jacket" && (
        <>
          <path d="M -26 252 L -4 420 L 4 420 L 26 252 Z" fill={L.inner} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M -26 252 L -42 300 L -14 330 L -4 420" fill="none" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M 26 252 L 42 300 L 14 330 L 4 420" fill="none" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M -40 470 L -16 470" stroke={INK} strokeWidth={3} />
          {/* corduroy lines */}
          {[-50, -36, 36, 50].map((xx) => (
            <path key={xx} d={`M ${xx} 340 L ${xx + (xx > 0 ? 2 : -2)} 530`} stroke={L.topShade} strokeWidth={2.2} opacity={0.7} />
          ))}
        </>
      )}
      {L.topStyle === "blazer" && (
        <>
          <path d="M -24 252 L 0 380 L 24 252 Z" fill={L.inner} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M -24 252 L -40 296 L -16 316 L 0 380" fill="none" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <path d="M 24 252 L 40 296 L 16 316 L 0 380" fill="none" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
          <circle cx={0} cy={430} r={5} fill={C.gold} stroke={INK} strokeWidth={2} />
        </>
      )}
      {L.badge && (
        <g>
          <path d="M -18 258 L -6 360 M 18 258 L 6 360" stroke={C.emerald} strokeWidth={5} fill="none" />
          <rect x={-22} y={358} width={44} height={56} rx={6} fill="#fff" stroke={INK} strokeWidth={3} />
          <rect x={-22} y={358} width={44} height={14} rx={4} fill={C.emerald} />
          <circle cx={0} cy={388} r={8} fill={C.stone} stroke={INK} strokeWidth={1.5} />
          <path d="M -12 404 L 12 404" stroke={C.inkSoft} strokeWidth={3} />
        </g>
      )}
      {/* belt / hem line */}
      <path d={`M -58 548 C -20 556 20 556 58 548`} fill="none" stroke={INK} strokeWidth={SW} />
    </g>
  );
};

const ArmG: React.FC<{ L: Look; side: "L" | "R"; arm: [number, number, number]; item?: React.ReactNode }> = ({ L, side, arm, item }) => {
  const s = side === "R" ? 1 : -1;
  const sx = s * (L.shoulder - 10);
  const sy = 282;
  const shoulderRot = -s * arm[0];
  const elbowRot = s * arm[1];
  const sleeve = L.topStyle === "vest" ? L.inner : L.top;
  const sleeveShade = L.topStyle === "vest" ? "#87abcd" : L.topShade;
  const fore = L.sleeveSkin ? L.skin : sleeve;
  return (
    <g transform={`translate(${sx} ${sy}) rotate(${shoulderRot})`}>
      <g transform={`scale(1 ${arm[2]})`}>
      <path d="M -23 -6 C -25 60 -21 120 -19 172 L 19 172 C 21 120 25 60 23 -6 C 14 -24 -14 -24 -23 -6 Z" fill={sleeve} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <path d={`M ${s * 6} 0 C ${s * 14} 60 ${s * 12} 120 ${s * 10} 168`} stroke={sleeveShade} strokeWidth={8} fill="none" opacity={0.7} />
      </g>
      <g transform={`translate(0 ${170 * arm[2]}) rotate(${elbowRot})`}>
        <circle cx={0} cy={0} r={19} fill={sleeve} stroke={INK} strokeWidth={SW} />
        <path d="M -18 0 L -15 150 L 15 150 L 18 0 Z" fill={fore} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        {L.sleeveSkin && <path d="M -17 -4 L 17 -4 L 16 22 L -16 22 Z" fill={sleeve} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />}
        {!L.sleeveSkin && <path d="M -15 132 L 15 132 L 14 148 L -14 148 Z" fill={L.inner} stroke={INK} strokeWidth={2.5} />}
        <g transform="translate(0 168)">
          <circle cx={0} cy={0} r={21} fill={L.skin} stroke={INK} strokeWidth={SW} />
          <ellipse cx={-s * 18} cy={-6} rx={8} ry={12} fill={L.skin} stroke={INK} strokeWidth={2.8} transform={`rotate(${-s * 25} ${-s * 18} -6)`} />
          {item && <g transform={`rotate(${-(shoulderRot + elbowRot)})`}>{item}</g>}
        </g>
      </g>
    </g>
  );
};

const BackHair: React.FC<{ L: Look; lookX: number; tilt: number; nod: number }> = ({ L, lookX, tilt, nod }) => {
  const tr = `translate(${lookX * 5} ${nod}) rotate(${tilt} 0 236) translate(0 236) scale(1.3) translate(0 -86)`;
  if (L.hairStyle === "bob")
    return (
      <g transform={tr}>
        <path d="M -72 -30 C -84 -116 84 -116 72 -30 L 76 56 C 62 70 40 66 30 58 L -30 58 C -40 66 -62 70 -76 56 Z" fill={L.hair} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      </g>
    );
  if (L.hairStyle === "ponytail")
    return (
      <g transform={tr}>
        <path d="M 30 -70 C 96 -76 112 6 86 96 C 78 60 66 10 34 -30 Z" fill={L.hair} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <circle cx={44} cy={-56} r={9} fill={C.emerald} stroke={INK} strokeWidth={2.5} />
      </g>
    );
  return null;
};

const Head: React.FC<{ L: Look; lookX: number; tilt: number; nod: number; talk: number; mood: Mood; blink: number }> = ({ L, lookX, tilt, nod, talk, mood, blink }) => {
  const fx = lookX * 7; // facial features shift → fake 3/4 turn
  const browLift = mood === "surprised" ? -7 : mood === "worried" ? -3 : mood === "focused" ? 3 : talk > 0.5 ? -3 : 0;
  const browTiltInner = mood === "worried" ? -9 : mood === "focused" ? 8 : 0;
  return (
    <g transform={`translate(${lookX * 5} ${nod}) rotate(${tilt} 0 236) translate(0 236) scale(1.3) translate(0 -86)`}>
      {/* ears */}
      <ellipse cx={-56 + fx * 0.3} cy={4} rx={9} ry={14} fill={L.skin} stroke={INK} strokeWidth={SW} />
      <ellipse cx={56 + fx * 0.3} cy={4} rx={9} ry={14} fill={L.skin} stroke={INK} strokeWidth={SW} />
      {L.earrings && (
        <>
          <circle cx={-57} cy={22} r={4.5} fill={C.gold} stroke={INK} strokeWidth={1.5} />
          <circle cx={57} cy={22} r={4.5} fill={C.gold} stroke={INK} strokeWidth={1.5} />
        </>
      )}
      {/* face */}
      <path d="M -56 -20 C -58 -74 58 -74 56 -20 C 56 24 36 62 0 68 C -36 62 -56 24 -56 -20 Z" fill={L.skin} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 40 -30 C 54 0 50 36 22 58 C 40 30 44 4 40 -30 Z" fill={L.skinShade} opacity={0.55} />
      {/* blush */}
      <ellipse cx={-32 + fx} cy={26} rx={11} ry={5.5} fill={L.blush} opacity={0.38} />
      <ellipse cx={32 + fx} cy={26} rx={11} ry={5.5} fill={L.blush} opacity={0.38} />
      {/* eyes */}
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${s * 22 + fx} 4) scale(1 ${blink})`}>
          <ellipse cx={0} cy={0} rx={10.5} ry={12.5} fill="#fff" />
          <ellipse cx={lookX * 3} cy={1} rx={7.6} ry={10} fill={L.iris} />
          <ellipse cx={lookX * 3} cy={2} rx={3.8} ry={5.4} fill="#1c1210" />
          <circle cx={lookX * 3 - 2.6} cy={-3.5} r={2.7} fill="#fff" />
          <path d="M -13 -7 Q 0 -17 13 -7" fill="none" stroke={INK} strokeWidth={4.2} strokeLinecap="round" />
        </g>
      ))}
      {L.glasses && (
        <g fill="none" stroke={INK} strokeWidth={3}>
          <circle cx={-22 + fx} cy={4} r={18} />
          <circle cx={22 + fx} cy={4} r={18} />
          <path d={`M ${-4 + fx} 2 Q ${fx} -2 ${4 + fx} 2`} />
          <path d={`M ${-40 + fx} 0 L -54 -4 M ${40 + fx} 0 L 54 -4`} />
        </g>
      )}
      {/* brows */}
      {[-1, 1].map((s) => (
        <path
          key={s}
          d={`M ${s * 34 + fx} ${-21 + browLift} Q ${s * 23 + fx} ${-28 + browLift} ${s * 11 + fx} ${-22 + browLift + browTiltInner * 0.5}`}
          fill="none"
          stroke={L.brows}
          strokeWidth={L.mustache ? 7 : 4.5}
          strokeLinecap="round"
        />
      ))}
      {/* nose */}
      <path d={`M ${2 + fx * 1.2} 14 Q ${7 + fx * 1.2} 25 ${-1 + fx * 1.2} 27`} fill="none" stroke={L.skinShade} strokeWidth={3} strokeLinecap="round" />
      <Mouth L={L} fx={fx} talk={talk} mood={mood} />
      <FrontHair L={L} fx={fx} />
    </g>
  );
};

const Mouth: React.FC<{ L: Look; fx: number; talk: number; mood: Mood }> = ({ L, fx, talk, mood }) => {
  const cx = fx * 1.1;
  const cy = 42;
  let m: React.ReactNode;
  if (talk > 0.04) {
    const o = Math.min(1, talk * 1.15);
    m = (
      <g>
        <path d={`M ${cx - 11 - 3 * o} ${cy - 1} Q ${cx} ${cy - 3 - o} ${cx + 11 + 3 * o} ${cy - 1} Q ${cx} ${cy + 3 + 13 * o} ${cx - 11 - 3 * o} ${cy - 1} Z`} fill="#7b2e2e" stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
        <ellipse cx={cx} cy={cy + 2 + 6 * o} rx={5 + 2 * o} ry={1 + 2.5 * o} fill="#e57a74" />
      </g>
    );
  } else if (mood === "happy") {
    m = (
      <g>
        <path d={`M ${cx - 14} ${cy - 3} Q ${cx} ${cy + 16} ${cx + 14} ${cy - 3} Z`} fill="#7b2e2e" stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
        <path d={`M ${cx - 7} ${cy + 6} Q ${cx} ${cy + 11} ${cx + 7} ${cy + 6}`} fill="#e57a74" />
      </g>
    );
  } else if (mood === "surprised") {
    m = <ellipse cx={cx} cy={cy + 2} rx={6} ry={8} fill="#7b2e2e" stroke={INK} strokeWidth={2.6} />;
  } else if (mood === "worried") {
    m = <path d={`M ${cx - 9} ${cy + 3} Q ${cx} ${cy - 4} ${cx + 9} ${cy + 3}`} fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />;
  } else if (mood === "neutral" || mood === "focused") {
    m = <path d={`M ${cx - 9} ${cy} Q ${cx} ${cy + 2} ${cx + 9} ${cy}`} fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />;
  } else {
    m = <path d={`M ${cx - 12} ${cy - 2} Q ${cx} ${cy + 9} ${cx + 12} ${cy - 2}`} fill="none" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />;
  }
  return (
    <g>
      {m}
      {L.mustache && (
        <path
          d={`M ${cx - 26} ${cy - 4} C ${cx - 16} ${cy - 16} ${cx - 4} ${cy - 12} ${cx} ${cy - 9} C ${cx + 4} ${cy - 12} ${cx + 16} ${cy - 16} ${cx + 26} ${cy - 4} C ${cx + 16} ${cy + 1} ${cx + 5} ${cy - 2} ${cx} ${cy - 4} C ${cx - 5} ${cy - 2} ${cx - 16} ${cy + 1} ${cx - 26} ${cy - 4} Z`}
          fill={L.hair}
          stroke={INK}
          strokeWidth={2.6}
          strokeLinejoin="round"
        />
      )}
    </g>
  );
};

const FrontHair: React.FC<{ L: Look; fx: number }> = ({ L, fx }) => {
  const st = { stroke: INK, strokeWidth: SW, strokeLinejoin: "round" as const };
  const f = fx * 0.4;
  if (L.hairStyle === "bob")
    return (
      <g transform={`translate(${f} 0)`}>
        <path d="M -62 -14 C -66 -92 64 -100 64 -16 C 52 -40 30 -52 6 -46 C -10 -40 -28 -50 -42 -38 C -50 -32 -56 -24 -62 -14 Z" fill={L.hair} {...st} />
        <path d="M -62 -14 C -70 16 -68 44 -58 60 C -50 42 -50 12 -48 -10 Z" fill={L.hair} {...st} />
        <path d="M 64 -16 C 70 16 68 44 58 60 C 50 42 50 12 48 -10 Z" fill={L.hair} {...st} />
        <path d="M -30 -74 C -10 -84 20 -84 40 -70" fill="none" stroke="#7a4a38" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      </g>
    );
  if (L.hairStyle === "messy")
    return (
      <g transform={`translate(${f} 0)`}>
        <path
          d="M -60 -6 C -72 -62 -42 -104 0 -100 C 44 -104 74 -66 60 -6 L 54 -30 L 44 -16 L 40 -42 L 26 -30 L 18 -50 L 4 -34 L -8 -52 L -20 -34 L -32 -48 L -40 -28 L -52 -38 Z"
          fill={L.hair}
          {...st}
        />
        <path d="M -20 -84 C 0 -94 26 -90 40 -78" fill="none" stroke="#a46a40" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
        <path d="M -60 -6 C -62 6 -60 14 -56 20 L -54 -10 Z" fill={L.hair} {...st} />
        <path d="M 60 -6 C 62 6 60 14 56 20 L 54 -10 Z" fill={L.hair} {...st} />
      </g>
    );
  if (L.hairStyle === "ponytail")
    return (
      <g transform={`translate(${f} 0)`}>
        <path d="M -58 -12 C -64 -92 62 -98 58 -12 C 50 -50 24 -64 -4 -60 C -30 -56 -48 -40 -58 -12 Z" fill={L.hair} {...st} />
        <path d="M -20 -78 C 0 -86 22 -84 36 -74" fill="none" stroke="#4a3434" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
      </g>
    );
  // cap + white tufts
  return (
    <g transform={`translate(${f} 0)`}>
      <path d="M -58 -16 C -68 -4 -66 18 -56 26 L -50 -8 Z" fill={L.hair} {...st} />
      <path d="M 58 -16 C 68 -4 66 18 56 26 L 50 -8 Z" fill={L.hair} {...st} />
      <path d="M -66 -30 C -66 -88 66 -94 68 -32 C 40 -40 -40 -40 -66 -30 Z" fill="#6f735b" {...st} />
      <path d="M -66 -30 C -40 -26 30 -24 86 -32 C 74 -18 -48 -18 -66 -26 Z" fill="#5d614b" {...st} />
      <path d="M -40 -70 C -10 -80 20 -80 46 -66" fill="none" stroke="#8a8f74" strokeWidth={4} opacity={0.8} />
    </g>
  );
};
