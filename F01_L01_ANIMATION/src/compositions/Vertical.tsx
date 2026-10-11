import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, fonts } from "../theme";
import { Main } from "./Main";

// 9:16 delivery: the same data-driven film, framed for phones with a brand header and footer.
// Scenes, timings and audio are reused as-is; only the framing changes.
export const Vertical: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.navyDeep}, #1d2f66 55%, ${C.navyDeep})` }}>
    <Img src={staticFile("tex/paper.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "soft-light", opacity: 0.35 }} />
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
      <div style={{ background: C.cream, borderRadius: 999, padding: "16px 34px" }}>
        <Img src={staticFile("brand/logo.png")} style={{ height: 70, width: 219 }} />
      </div>
      <div style={{ marginTop: 40, fontFamily: fonts.body, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.emeraldSoft }}>FORMATION 01 · LEÇON 01</div>
      <div style={{ marginTop: 16, width: 940, textAlign: "center", fontFamily: fonts.title, fontWeight: 800, fontSize: 66, lineHeight: 1.08, color: "#fff" }}>
        Clarifier le cadre en transaction immobilière
      </div>
    </AbsoluteFill>
    <div style={{ position: "absolute", left: 0, top: 690, width: 1920, height: 1080, scale: String(1080 / 1920), transformOrigin: "0 0", borderRadius: 40, overflow: "hidden" }}>
      <Main />
    </div>
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 200 }}>
      <div style={{ fontFamily: fonts.brand, fontWeight: 600, fontSize: 30, letterSpacing: 5, color: "#fff", textAlign: "center", lineHeight: 1.6 }}>
        COMPRENDRE LA RÈGLE.
        <br />
        <span style={{ color: C.emeraldSoft }}>SÉCURISER LA PRATIQUE.</span>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
