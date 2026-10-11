import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, ease, fonts, shadow } from "../theme";
import { FPS, pop, ramp, span } from "../lib/timeline";
import { Backdrop, PaperOverlay } from "../components/painterly/Backdrop";
import { Character } from "../components/characters/Character";
import { CheckLine } from "../components/ui";

const useLocalT = () => useCurrentFrame() / FPS;

const Logo: React.FC<{ h: number; style?: React.CSSProperties }> = ({ h, style }) => (
  <Img src={staticFile("brand/logo.png")} style={{ height: h, width: h * 3.125, ...style }} />
);

const LogoPill: React.FC<{ h: number; pad?: number }> = ({ h, pad = 16 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", background: C.cream, borderRadius: 999, padding: `${pad * 0.6}px ${pad * 1.4}px`, boxShadow: shadow }}>
    <Logo h={h} />
  </div>
);

/** Painted title card: « F01 · L01 — Clarifier le cadre en transaction immobilière ». */
export const TitleCard: React.FC = () => {
  const t = useLocalT();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ scale: String(1.08 - t * 0.012) }}>
        <Backdrop name="hillside" t={200 + t} />
        <Character who="LEA" t={t} talk={0} x={[[0, -150], [2.2, 700]]} walk={[[0, 2.2]]} y={1010} h={470} pose={[{ at: 2.4, pose: "wave" }, { at: 4.4, pose: "rest" }]} mood="happy" look={0.4} />
        <Character who="HUGO" t={t} talk={0} x={[[0, 2100], [2.4, 1220]]} walk={[[0, 2.4]]} y={1010} h={480} pose={[{ at: 2.6, pose: "wave" }, { at: 4.6, pose: "handsHips" }]} mood="happy" look={-0.4} />
      </AbsoluteFill>
      <PaperOverlay />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 120 }}>
        <div style={{ opacity: ramp(t, 0.4, 1), translate: `0px ${(1 - ramp(t, 0.4, 1.2)) * -40}px`, display: "flex", gap: 16, alignItems: "center" }}>
          <LogoPill h={46} />
        </div>
        <div style={{ marginTop: 28, padding: "10px 28px", background: C.emerald, color: "#fff", borderRadius: 999, fontFamily: fonts.body, fontWeight: 800, fontSize: 32, letterSpacing: 4, opacity: ramp(t, 0.8, 1.3), scale: String(interpolate(pop(t, 0.8), [0, 1], [0.6, 1])) }}>
          FORMATION 01 · LEÇON 01
        </div>
        <div
          style={{
            marginTop: 26,
            maxWidth: 1400,
            textAlign: "center",
            fontFamily: fonts.title,
            fontWeight: 800,
            fontSize: 96,
            lineHeight: 1.05,
            color: C.navy,
            textShadow: "0 4px 0 rgba(255,250,235,0.9), 0 0 30px rgba(255,250,235,0.9)",
            opacity: ramp(t, 1.1, 1.8),
            translate: `0px ${(1 - ramp(t, 1.1, 2)) * 40}px`,
          }}
        >
          Clarifier le cadre en transaction immobilière
        </div>
        <div style={{ marginTop: 18, fontFamily: fonts.body, fontWeight: 700, fontSize: 36, color: C.ink, opacity: ramp(t, 2.6, 3.2), background: "rgba(255,250,235,0.85)", padding: "6px 20px", borderRadius: 12 }}>avec Léa & Hugo</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fffaf0", opacity: ramp(t, 5.3, 6, ease.in) }} />
    </AbsoluteFill>
  );
};

/** Mid-roll ad insert in the ALURFORMA brand world (navy, emerald glass, gold), with the jingle. */
export const AdBreak: React.FC = () => {
  const t = useLocalT();
  const panels = [
    [180, 140, 260, 760, C.emerald],
    [1500, 90, 220, 820, "#2a4a8a"],
    [1730, 260, 140, 600, C.gold],
    [40, 300, 120, 560, "#2a4a8a"],
  ] as const;
  const chips: [string, number][] = [
    ["14 h par an", 4.0],
    ["100 % en ligne", 4.6],
    ["À votre rythme", 5.2],
  ];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #1d2f66 0%, ${C.navyDeep} 70%)` }}>
      {panels.map(([x, y, w, h, col], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: w,
            height: h,
            borderRadius: 18,
            background: `linear-gradient(160deg, ${col}cc, ${col}22)`,
            border: "2px solid rgba(255,255,255,0.25)",
            opacity: 0.55,
            translate: `${Math.sin(t * 0.8 + i) * 18 + (1 - ramp(t, 0, 1)) * (i % 2 ? 600 : -600)}px ${Math.cos(t * 0.6 + i) * 12}px`,
            rotate: `${(i % 2 ? 4 : -5) + Math.sin(t + i) * 1.5}deg`,
          }}
        />
      ))}
      <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0) 60%)", translate: `${interpolate(t, [0, 11], [-1400, 1400])}px 0px` }} />
      <div style={{ position: "absolute", left: 40, top: 30, fontFamily: fonts.body, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: "rgba(255,255,255,0.6)" }}>PUBLICITÉ</div>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 90 }}>
        <div style={{ scale: String(interpolate(pop(t, 0.6, 0.6), [0, 1], [0.5, 1])), opacity: ramp(t, 0.6, 1) }}>
          <LogoPill h={78} pad={22} />
        </div>
        <div style={{ marginTop: 40, fontFamily: fonts.brand, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: C.emeraldSoft, opacity: ramp(t, 1.5, 2) }}>FORMATIONS LOI ALUR EN LIGNE</div>
        <div
          style={{
            marginTop: 18,
            maxWidth: 1300,
            textAlign: "center",
            fontFamily: fonts.title,
            fontWeight: 800,
            fontSize: 78,
            lineHeight: 1.08,
            color: "#fff",
            opacity: ramp(t, 2.0, 2.6),
            translate: `0px ${(1 - ramp(t, 2.0, 2.8)) * 40}px`,
          }}
        >
          Renouvelez votre carte professionnelle <span style={{ color: C.gold }}>sans perdre de temps.</span>
        </div>
        <div style={{ display: "flex", gap: 28, marginTop: 44 }}>
          {chips.map(([c, at]) => (
            <div
              key={c}
              style={{
                padding: "14px 34px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                border: `3px solid ${C.gold}`,
                color: "#fff",
                fontFamily: fonts.brand,
                fontWeight: 600,
                fontSize: 40,
                scale: String(interpolate(pop(t, at), [0, 1], [0.3, 1])),
                opacity: ramp(t, at, at + 0.2),
              }}
            >
              {c}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 50, fontFamily: fonts.brand, fontWeight: 600, fontSize: 34, letterSpacing: 6, color: "#fff", opacity: span(t, 7.2, 11, 0.5, 0.6) }}>
          COMPRENDRE LA RÈGLE. <span style={{ color: C.emeraldSoft }}>SÉCURISER LA PRATIQUE.</span>
        </div>
      </AbsoluteFill>
      <Character who="LEA" t={t} talk={0} x={[[2.6, -200], [3.6, 230]]} y={1120} h={520} pose={[{ at: 3.6, pose: "wave" }, { at: 6, pose: "pointUpR" }]} mood="happy" look={0.5} />
      <Character who="HUGO" t={t} talk={0} x={[[2.8, 2120], [3.8, 1690]]} y={1120} h={540} pose={[{ at: 3.8, pose: "cheer" }, { at: 6.2, pose: "handsHips" }]} mood="happy" look={-0.5} />
      <AbsoluteFill style={{ background: "#fffaf0", opacity: Math.max(1 - ramp(t, 0, 0.5), ramp(t, 10.4, 11, ease.in)) }} />
    </AbsoluteFill>
  );
};

/** Small in-lesson ad banner (encart) that slides in at the top-left. */
export const Encart: React.FC<{ text: string; sub: string; dur: number }> = ({ text, sub, dur }) => {
  const t = useLocalT();
  const k = Math.min(ramp(t, 0, 0.6), 1 - ramp(t, dur - 0.6, dur, ease.in));
  return (
    <div
      style={{
        position: "absolute",
        left: 36,
        top: 34,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "14px 26px 14px 18px",
        borderRadius: 20,
        background: `linear-gradient(120deg, ${C.navyDeep}, #1d2f66)`,
        border: `2px solid ${C.gold}`,
        boxShadow: shadow,
        translate: `${(1 - k) * -720}px 0px`,
        opacity: k,
      }}
    >
      <div style={{ background: C.cream, borderRadius: 14, padding: "8px 14px" }}>
        <Logo h={40} />
      </div>
      <div>
        <div style={{ fontFamily: fonts.brand, fontWeight: 600, fontSize: 30, color: "#fff" }}>{text}</div>
        <div style={{ fontFamily: fonts.brand, fontWeight: 400, fontSize: 22, color: C.emeraldSoft, marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ position: "absolute", right: 12, top: -12, fontFamily: fonts.body, fontWeight: 800, fontSize: 14, letterSpacing: 2, color: C.navyDeep, background: C.gold, borderRadius: 6, padding: "2px 8px" }}>PUB</div>
    </div>
  );
};

/** Persistent brand bug during the lesson. */
export const BrandBug: React.FC = () => (
  <div style={{ position: "absolute", right: 34, top: 30, display: "flex", alignItems: "center", gap: 12, background: "rgba(251,247,238,0.92)", borderRadius: 999, padding: "8px 18px", boxShadow: "0 6px 16px rgba(0,0,0,0.18)" }}>
    <Logo h={30} />
    <span style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 22, color: C.navy, letterSpacing: 2, borderLeft: `2px solid ${C.gold}`, paddingLeft: 12 }}>F01 · L01</span>
  </div>
);

/** Visual synthesis of the lesson's real takeaways. */
export const Recap: React.FC = () => {
  const t = useLocalT();
  const items: [string, number][] = [
    ["Qualifier la demande : quel acte, pour qui, dans quel contexte", 1.4],
    ["Carte professionnelle · habilitation · mandat écrit : les trois clés", 2.8],
    ["Négocier ≠ engager : le pouvoir d'accepter doit être exprès", 4.2],
    ["Nouvelle mission = nouvelle vérification", 5.6],
    ["RCP toujours obligatoire · garantie financière pour les fonds détenus", 7.0],
  ];
  return (
    <AbsoluteFill>
      <Backdrop name="desk" t={300 + t} />
      <PaperOverlay />
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 520,
          width: 1380,
          translate: `-50% calc(-50% + ${(1 - ramp(t, 0, 0.8)) * 900}px)`,
          rotate: `${(1 - ramp(t, 0, 0.8)) * 6 - 1}deg`,
          background: C.paper,
          border: `5px solid ${C.ink}`,
          borderRadius: 26,
          boxShadow: shadow,
          padding: "34px 54px 40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: fonts.title, fontWeight: 800, fontSize: 70, color: C.navy }}>À retenir</div>
          <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 28, color: "#fff", background: C.emerald, borderRadius: 999, padding: "8px 22px", letterSpacing: 2 }}>F01 · L01</div>
        </div>
        <div style={{ height: 4, background: C.gold, borderRadius: 4, margin: "14px 0 18px", width: `${ramp(t, 0.6, 1.4) * 100}%` }} />
        {items.map(([txt, at]) => (
          <CheckLine key={txt} t={t} at={at} text={txt} size={38} />
        ))}
      </div>
      <AbsoluteFill style={{ background: "#fffaf0", opacity: ramp(t, 9.4, 10, ease.in) }} />
    </AbsoluteFill>
  );
};

/** Brand end card. */
export const EndCard: React.FC = () => {
  const t = useLocalT();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, #fbfaf4 0%, #efe9da 100%)" }}>
      <Img src={staticFile("tex/paper.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "multiply", opacity: 0.45 }} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 210 }}>
        <div style={{ scale: String(interpolate(pop(t, 0.2, 0.7), [0, 1], [0.7, 1])), opacity: ramp(t, 0.2, 0.8) }}>
          <Logo h={250} />
        </div>
        <div style={{ width: 640 * ramp(t, 1.0, 1.8), height: 2, background: C.gold, marginTop: 40 }} />
        <div style={{ marginTop: 34, fontFamily: fonts.brand, fontWeight: 600, fontSize: 40, letterSpacing: 9, color: C.navy, opacity: ramp(t, 1.4, 2) }}>
          COMPRENDRE LA RÈGLE. SÉCURISER LA PRATIQUE.
        </div>
        <div style={{ marginTop: 18, fontFamily: fonts.brand, fontWeight: 400, fontSize: 24, letterSpacing: 9, color: C.emerald, opacity: ramp(t, 2, 2.6) }}>FORMATION PROFESSIONNELLE IMMOBILIÈRE</div>
        <div style={{ marginTop: 34, fontFamily: fonts.brand, fontWeight: 400, fontSize: 28, color: C.inkSoft, opacity: ramp(t, 2.6, 3.2) }}>Formations loi ALUR en ligne · 14 h par an · 100 % en ligne · à votre rythme</div>
      </AbsoluteFill>
      <Character who="LEA" t={t} talk={0} x={170} y={1130} h={420} pose={[{ at: 1.6, pose: "wave" }]} mood="happy" look={0.4} />
      <Character who="HUGO" t={t} talk={0} x={1750} y={1130} h={430} pose={[{ at: 1.9, pose: "wave" }]} mood="happy" look={-0.4} />
      <AbsoluteFill style={{ background: "#000", opacity: ramp(t, 7.2, 8, ease.in) }} />
    </AbsoluteFill>
  );
};
