import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { HouseMark, LETTERS, Letter, LOGO_H, LOGO_W } from "./LogoParts";

// Calibration: rebuilt logo (red tint) over the official PNG, to align letters and mark.
export const LogoCalib: React.FC = () => (
  <AbsoluteFill style={{ background: "#fff", alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "relative", width: LOGO_W, height: LOGO_H, scale: "1.4" }}>
      <Img src={staticFile("brand/logo.png")} style={{ position: "absolute", inset: 0, width: LOGO_W, height: LOGO_H }} />
      <svg width={LOGO_W} height={LOGO_H} style={{ position: "absolute", inset: 0, opacity: 0.5, mixBlendMode: "multiply", filter: "hue-rotate(140deg) saturate(4)" }}>
        <HouseMark grow={1} door={0} glow={0} road={1} />
        {LETTERS.map((l, i) => (
          <Letter key={i} ch={l.ch} x={l.x} />
        ))}
      </svg>
    </div>
  </AbsoluteFill>
);
