import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C, ease, fonts, shadow } from "../theme";
import { pop, ramp } from "../lib/timeline";
import { Character } from "../components/characters/Character";
import { BASELINE, Briefcase, BriefcaseItem, HouseMark, Letter, LETTERS, LOGO_H, LOGO_W, Sheet } from "./LogoParts";

/**
 * ALURFORMA lesson intro (≈ 12 s), in the spirit of a studio ident:
 * the agent runs in with his briefcase, trips, the briefcase squashes the "o" of the wordmark,
 * papers fly, he tidies up, reaches the waiting couple and opens the briefcase — the house-shaped
 * "A" of the logo pops out and completes the logo. Then the lesson card: formation, chapter, lesson, part.
 */
export type IntroProps = {
  formationCode: string; // "F01"
  formationTitle?: string; // e.g. "Transaction immobilière" (optional)
  chapter?: string; // e.g. "Chapitre 1" (optional)
  lessonCode?: string; // "L01"
  lessonTitle: string;
  part?: number | null; // 1, 2, 3… (hidden when empty)
  partsTotal?: number | null; // "Partie 1 / 3" when given
};

export const INTRO_FRAMES = 12 * 30;

export const introDefaults: IntroProps = {
  formationCode: "F01",
  formationTitle: "",
  chapter: "Chapitre 1",
  lessonCode: "L01",
  lessonTitle: "Clarifier le cadre en transaction immobilière",
  part: 1,
  partsTotal: null,
};

const num = (code?: string) => (code ? code.replace(/[^0-9]/g, "").padStart(2, "0") : "");
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** Parabolic hop between two points with a given apex height (logo-space units). */
const arc = (k: number, from: [number, number], to: [number, number], apex: number): [number, number] => [lerp(from[0], to[0], k), lerp(from[1], to[1], k) - apex * 4 * k * (1 - k)];
/** Damped spring settle: 0 at t0, oscillates toward 0 (used for squash recovery). */
const wobble = (t: number, t0: number, amp: number, freq = 16, damp = 5) => (t < t0 ? 0 : amp * Math.exp(-(t - t0) * damp) * Math.cos((t - t0) * freq));

export const LessonIntro: React.FC<IntroProps> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  // ── camera: follows the action close-up, then pulls back to reveal the full logo and the card ──
  // keys: [time, logo-space x at screen centre, scale, screen y of the baseline]
  const CAM: [number, number, number, number][] = [
    [0, 960, 2.1, 780],
    [2.5, 940, 2.15, 780],
    [3.0, 900, 2.25, 790],
    [5.65, 900, 2.2, 790],
    [6.6, 330, 2.0, 790],
    [8.3, 300, 1.95, 790],
    [8.95, 625, 1.42, 700],
    [9.9, 625, 0.8, 90 + BASELINE * 0.8],
  ];
  const camO = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: ease.inOut };
  const ts = CAM.map((k) => k[0]);
  const cx = interpolate(t, ts, CAM.map((k) => k[1]), camO);
  const S = interpolate(t, ts, CAM.map((k) => k[2]), camO);
  const by = interpolate(t, ts, CAM.map((k) => k[3]), camO);
  const left = 960 - cx * S;
  const top = by - BASELINE * S;

  // ── the "o" gets squashed by the briefcase, then springs back ──
  const hitO = 3.05;
  const oSy = t < hitO ? 1 : t < hitO + 0.1 ? lerp(1, 0.45, (t - hitO) / 0.1) : Math.min(1.12, 1 - wobble(t, hitO + 0.1, 0.55, 15, 4.5));
  const oSx = 1 / Math.sqrt(Math.max(0.4, oSy));
  const shake = (i: number) => wobble(t, hitO, i % 2 ? 3 : -3, 22, 7);

  // ── briefcase flight ──
  const H0: [number, number] = [985, 198];
  const O: [number, number] = [863, 150 + (1 - oSy) * 108];
  const F: [number, number] = [760, BASELINE + 8];
  let bc: [number, number] | null = null;
  let bcRot = 0;
  if (t >= 2.65 && t < hitO) {
    bc = arc(ramp(t, 2.65, hitO, ease.inOut), H0, [863, 150], 160);
    bcRot = -ramp(t, 2.65, hitO) * 150;
  } else if (t >= hitO && t < hitO + 0.12) {
    bc = O;
    bcRot = -150;
  } else if (t >= hitO + 0.12 && t < 3.5) {
    bc = arc(ramp(t, hitO + 0.12, 3.5), O, F, 90);
    bcRot = lerp(-150, -360, ramp(t, hitO + 0.12, 3.5));
  } else if (t >= 3.5 && t < 5.4) {
    bc = F;
    bcRot = 0;
  } else if (t >= 5.4 && t < 5.75) {
    bc = arc(ramp(t, 5.4, 5.75), F, [958, 222], 70);
  }
  const bcOpen = t < 3.5 ? 0 : t < 5.25 ? ramp(t, 3.5, 3.65, ease.back) : 1 - ramp(t, 5.25, 5.35);
  const inHand = t < 2.65 || t >= 5.75;

  // ── papers ──
  const sheets = [
    { peak: [700, 70] as [number, number], rest: [712, BASELINE + 2] as [number, number], rot: 70 },
    { peak: [835, 30] as [number, number], rest: [826, BASELINE + 4] as [number, number], rot: -78 },
    { peak: [905, 45] as [number, number], rest: [1002, 96] as [number, number], rot: 8 }, // lands on the agent's head
  ];
  const sheetPos = (i: number): { x: number; y: number; r: number; s: number } | null => {
    const sh = sheets[i];
    const src: [number, number] = [F[0], F[1] - 30];
    if (t < 3.55) return null;
    if (t < 3.95) {
      const k = ramp(t, 3.55, 3.95);
      return { x: lerp(src[0], sh.peak[0], k), y: lerp(src[1], sh.peak[1], k), r: k * 200 * (i % 2 ? -1 : 1), s: 1 };
    }
    const fall = i === 2 ? ramp(t, 3.95, 4.3, ease.in) : ramp(t, 3.95, 4.7, ease.inOut);
    let x = lerp(sh.peak[0], sh.rest[0], fall) + Math.sin(t * 9 + i) * 18 * (1 - fall);
    let y = lerp(sh.peak[1], sh.rest[1], fall);
    let r = lerp(20, sh.rot, fall) + Math.sin(t * 7 + i) * 20 * (1 - fall);
    if (i === 2 && t > 4.45) {
      // the agent plucks it off his head
      const k = ramp(t, 4.45, 4.75);
      x = lerp(sh.rest[0], 1022, k);
      y = lerp(sh.rest[1], 118, k);
      r = lerp(sh.rot, -20, k);
    }
    if (t > 4.9) {
      // magic: every sheet swirls back into the briefcase
      const k = ramp(t, 4.9 + i * 0.07, 5.25 + i * 0.07, ease.inOut);
      const sw = Math.sin(k * Math.PI) * 60;
      return { x: lerp(x, src[0], k) + sw, y: lerp(y, src[1], k) - sw * 0.6, r: r + k * 540, s: 1 - k * 0.6 };
    }
    return { x, y, r, s: 1 };
  };

  // ── agent body: fall, get up, hop over the house ──
  const fallRot = t < 2.6 ? 0 : t < 2.85 ? -ramp(t, 2.6, 2.85, ease.in) * 82 : t < 3.5 ? -82 + Math.abs(wobble(t, 2.85, 6, 20, 8)) : -82 * (1 - ramp(t, 3.5, 3.9, ease.back));
  const jumpK = ramp(t, 8.4, 9.1, ease.inOut);
  const jumpY = t > 8.4 && t < 9.1 ? -300 * 4 * jumpK * (1 - jumpK) : 0;
  const squash = t > 8.3 && t < 8.42 ? 1 - ramp(t, 8.3, 8.36) * 0.15 : t >= 9.1 ? 1 - Math.max(0, wobble(t, 9.1, 0.16, 18, 8)) : 1;
  const spin = t > 8.4 && t < 9.1 ? -jumpK * 360 : 0;
  const agentX: [number, number][] = [
    [0.8, 1500],
    [2.6, 1012],
    [2.9, 990],
    [5.8, 990],
    [6.6, 420],
    [8.4, 420],
    [9.1, -75],
  ];
  const agentFeet = { x: interpolate(t, agentX.map((k) => k[0]), agentX.map((k) => k[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), y: BASELINE + 14 };

  // ── house pops out of the briefcase ──
  const houseK = ramp(t, 7.0, 7.75, ease.back);
  const houseIn = t >= 7.0;
  const hx = lerp(360, 190, Math.min(1, houseK));
  const hy = lerp(185, 160, Math.min(1, houseK));
  const hs = lerp(0.06, 1, houseK);
  const houseGrow = 1 + wobble(t, 7.75, -0.08, 18, 7);

  // ── couple ──
  const enter = ramp(t, 8.25, 8.95, ease.inOut);
  const coupleH = (h: number) => lerp(h, h * 0.62, enter);
  const coupleOpacity = 1 - ramp(t, 8.7, 8.98);

  // swap the rebuilt logo for the official artwork under a sparkle
  const swap = ramp(t, 8.9, 9.25);
  const flash = Math.max(0, 1 - Math.abs(t - 9.05) / 0.25);

  const formationLine = `FORMATION ${num(p.formationCode)}${p.formationTitle ? ` · ${p.formationTitle.toUpperCase()}` : ""}`;
  const partLabel = p.part ? `PARTIE ${p.part}${p.partsTotal ? ` / ${p.partsTotal}` : ""}` : null;

  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #fdfbf5 0%, #f1ead9 70%, #e7dec9 100%)", overflow: "hidden" }}>
      <Img src={staticFile("tex/paper.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "multiply", opacity: 0.4 }} />

      {/* ── the stage, in logo space ── */}
      <div style={{ position: "absolute", left: 0, top: 0, width: LOGO_W, height: LOGO_H, transformOrigin: "0 0", translate: `${left}px ${top}px`, scale: String(S) }}>
        {/* stage floor: a soft warm plane under the letters */}
        <div style={{ position: "absolute", left: -1400, top: BASELINE + 4, width: LOGO_W + 2800, height: 700, background: "linear-gradient(180deg, rgba(160,120,70,0.10), rgba(160,120,70,0) 60%)", opacity: 1 - swap }} />
        {/* floor shadow */}
        <div style={{ position: "absolute", left: -400, top: BASELINE - 6, width: LOGO_W + 800, height: 60, background: "radial-gradient(ellipse at center, rgba(60,45,30,0.10), rgba(60,45,30,0) 70%)", opacity: 1 - swap }} />
        <svg width={LOGO_W} height={LOGO_H} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: 1 - swap }}>
          {/* pebble the agent trips on */}
          <ellipse cx={1036} cy={BASELINE + 12} rx={11} ry={6} fill="#a39a8c" stroke="#4b3328" strokeWidth={1.5} opacity={1 - ramp(t, 8.6, 8.9)} />
          {houseIn && (
            <g transform={`translate(${hx} ${hy}) scale(${hs}) translate(-190 -160)`}>
              <HouseMark grow={houseGrow} door={ramp(t, 7.85, 8.2)} glow={t < 8.0 ? 0 : Math.min(ramp(t, 8.0, 8.3), 1 - ramp(t, 8.9, 9.2))} road={ramp(t, 7.55, 8.05)} />
            </g>
          )}
          {LETTERS.map((l, i) =>
            l.ch === "o" ? (
              <Letter key={i} ch={l.ch} x={l.x} sx={oSx} sy={oSy} />
            ) : (
              <Letter key={i} ch={l.ch} x={l.x} rot={Math.abs(l.x - 863) < 120 ? shake(i) : 0} />
            ),
          )}
        </svg>

        {/* official logo takes over */}
        <Img src={staticFile("brand/logo.png")} style={{ position: "absolute", inset: 0, width: LOGO_W, height: LOGO_H, opacity: swap }} />

        {/* couple waiting for their house */}
        {coupleOpacity > 0 && (
          <div style={{ opacity: coupleOpacity }}>
            <Character
              who="CLIENT_F"
              t={t}
              talk={0}
              x={[[0, 92], [8.25, 92], [8.95, 196]]}
              y={BASELINE + 12 - enter * 6}
              h={coupleH(168)}
              walk={[[8.25, 8.95]]}
              pose={[{ at: 0, pose: "handsHips" }, { at: 6.5, pose: "wave" }, { at: 7.1, pose: "rest" }, { at: 7.8, pose: "cheer" }, { at: 8.25, pose: "rest" }]}
              mood={[{ at: 0, mood: "neutral" }, { at: 3.1, mood: "surprised" }, { at: 3.8, mood: "smile" }, { at: 7.0, mood: "surprised" }, { at: 7.7, mood: "happy" }]}
              look={[[0, 0.4], [1.5, 0.9], [2.6, 0.9], [3.2, 0.9], [6.4, 0.8], [8.2, 0.3]]}
              seed={31}
            />
            <Character
              who="CLIENT_M"
              t={t}
              talk={0}
              x={[[0, 262], [8.25, 262], [8.95, 222]]}
              y={BASELINE + 12 - enter * 6}
              h={coupleH(166)}
              walk={[[8.25, 8.95]]}
              pose={[{ at: 0, pose: "think" }, { at: 6.5, pose: "wave" }, { at: 7.1, pose: "rest" }, { at: 7.8, pose: "cheer" }, { at: 8.25, pose: "rest" }]}
              mood={[{ at: 0, mood: "neutral" }, { at: 3.1, mood: "surprised" }, { at: 3.8, mood: "smile" }, { at: 7.0, mood: "surprised" }, { at: 7.7, mood: "happy" }]}
              look={[[0, 0.7], [2.6, 0.9], [6.4, 0.9], [8.2, -0.3]]}
              seed={47}
            />
          </div>
        )}

        {/* the agent (wrapper handles the fall, the jump and squash & stretch around his feet) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: `${agentFeet.x}px ${agentFeet.y}px`,
            rotate: `${fallRot + spin}deg`,
            translate: `0px ${jumpY}px`,
            scale: `${1 / Math.sqrt(squash)} ${squash}`,
          }}
        >
          <Character
            who="AGENT"
            t={t}
            talk={0}
            x={agentX}
            y={agentFeet.y}
            h={178}
            gait="run"
            walk={[[0.8, 2.6], [5.8, 6.6]]}
            pose={[{ at: 0, pose: "rest" }, { at: 2.6, pose: "cheer" }, { at: 2.9, pose: "rest" }, { at: 4.4, pose: "phone" }, { at: 4.85, pose: "rest" }, { at: 6.65, pose: "offerL" }, { at: 8.1, pose: "wave" }, { at: 8.4, pose: "cheer" }, { at: 9.15, pose: "wave" }]}
            mood={[{ at: 0, mood: "happy" }, { at: 2.6, mood: "surprised" }, { at: 3.5, mood: "worried" }, { at: 3.9, mood: "smile" }, { at: 4.3, mood: "worried" }, { at: 4.9, mood: "happy" }]}
            look={[[0, -0.9], [2.6, -0.9], [3.9, -0.8], [4.3, 0], [4.9, 0], [5.7, -0.9], [6.6, -0.9], [8.2, 0], [9.3, 0.5]]}
            leftItem={inHand ? <BriefcaseItem open={t > 6.85 ? ramp(t, 6.85, 7.0, ease.back) : 0} /> : undefined}
            seed={5}
          />
        </div>

        {/* flying briefcase and papers */}
        <svg width={LOGO_W} height={LOGO_H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {bc && (
            <g transform={`translate(${bc[0]} ${bc[1]}) rotate(${bcRot}) scale(0.95)`}>
              <Briefcase open={bcOpen} />
            </g>
          )}
          {[0, 1, 2].map((i) => {
            const s = sheetPos(i);
            if (!s || t > 5.45) return null;
            return (
              <g key={i} transform={`translate(${s.x} ${s.y}) rotate(${s.r}) scale(${s.s})`}>
                <Sheet s={0.9} />
              </g>
            );
          })}
          {/* sparkle when the logo completes */}
          {flash > 0 &&
            Array.from({ length: 10 }, (_, i) => {
              const a = (i / 10) * Math.PI * 2;
              const r = 60 + (1 - flash) * 260;
              return <circle key={i} cx={190 + Math.cos(a) * r} cy={170 + Math.sin(a) * r * 0.7} r={7 * flash} fill="#f2d27a" />;
            })}
        </svg>
      </div>

      {/* ── lesson card ── */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 455 }}>
        <div style={{ width: 760 * ramp(t, 9.5, 10.2), height: 3, background: C.gold, borderRadius: 3, marginBottom: 26 }} />
        <div style={{ fontFamily: fonts.brand, fontWeight: 600, fontSize: 34, letterSpacing: 7, color: C.emerald, opacity: ramp(t, 9.6, 10.0), translate: `0px ${(1 - ramp(t, 9.6, 10.1)) * 20}px` }}>{formationLine}</div>
        <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
          {[p.chapter, p.lessonCode ? `LEÇON ${num(p.lessonCode)}` : null].filter(Boolean).map((label, i) => (
            <div
              key={i}
              style={{
                padding: "8px 24px",
                borderRadius: 999,
                border: `3px solid ${C.navy}`,
                fontFamily: fonts.brand,
                fontWeight: 600,
                fontSize: 28,
                letterSpacing: 4,
                color: C.navy,
                textTransform: "uppercase",
                scale: String(interpolate(pop(t, 9.85 + i * 0.12), [0, 1], [0.5, 1])),
                opacity: ramp(t, 9.85 + i * 0.12, 10.05 + i * 0.12),
              }}
            >
              {label}
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 30,
            maxWidth: 1500,
            textAlign: "center",
            fontFamily: fonts.title,
            fontWeight: 800,
            fontSize: p.lessonTitle.length > 48 ? 62 : 74,
            lineHeight: 1.08,
            color: C.navy,
            opacity: ramp(t, 10.0, 10.5),
            translate: `0px ${(1 - ramp(t, 10.0, 10.6)) * 30}px`,
          }}
        >
          {p.lessonTitle}
        </div>
        {partLabel && (
          <div
            style={{
              marginTop: 34,
              padding: "12px 36px",
              borderRadius: 999,
              background: C.emerald,
              color: "#fff",
              fontFamily: fonts.brand,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: 6,
              boxShadow: shadow,
              scale: String(interpolate(pop(t, 10.45, 0.5), [0, 1], [0.3, 1])),
              opacity: ramp(t, 10.45, 10.6),
            }}
          >
            {partLabel}
          </div>
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fffaf0", opacity: 1 - ramp(t, 0, 0.4) }} />

      {/* ── sound ── */}
      <Audio src={staticFile("audio/jingle.mp3")} volume={(f) => 0.8 * (1 - ramp(f / 30, 9.9, 10.5))} />
      <Sequence from={Math.round(9.4 * 30)}>
        <Audio src={staticFile("audio/music-chord.mp3")} volume={(f) => 0.28 * Math.min(1, f / 20) * (1 - ramp(f / 30, 2.0, 2.6))} />
      </Sequence>
      {SFX.map(([at, file, vol], i) => (
        <Sequence key={i} from={Math.round(at * 30)} durationInFrames={45}>
          <Audio src={staticFile(`sfx/${file}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const steps = (a: number, b: number): [number, string, number][] => {
  const out: [number, string, number][] = [];
  for (let x = a; x < b; x += 0.21) out.push([x, "step", 0.22]);
  return out;
};

const SFX: [number, string, number][] = [
  ...steps(0.85, 2.6),
  [2.62, "whoosh", 0.25],
  [2.86, "stamp", 0.3],
  [3.05, "pop", 0.3],
  [3.16, "boing", 0.35],
  [3.5, "stamp", 0.18],
  [3.56, "pop", 0.28],
  [3.62, "paper", 0.3],
  [4.28, "paper", 0.3],
  [4.9, "sparkle", 0.3],
  [5.35, "check", 0.3],
  ...steps(5.85, 6.6),
  [6.88, "pop", 0.25],
  [7.0, "whoosh", 0.3],
  [7.8, "chime", 0.25],
  [8.4, "whoosh", 0.22],
  [9.02, "sparkle", 0.3],
  [9.12, "stamp", 0.16],
  [10.45, "check", 0.25],
];
