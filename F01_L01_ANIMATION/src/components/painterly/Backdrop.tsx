import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import manifest from "../../data/bg-manifest.json";
import { BACKDROPS, BackdropName } from "./backdrops";

const painted = new Set<string>(manifest.files);

/**
 * Scene set. If a painted plate `public/bg/<name>.png` exists (see scripts/sync_bg_manifest.py)
 * it is used with a slow drift; otherwise the hand-built SVG set is drawn.
 */
export const Backdrop: React.FC<{ name: BackdropName; t: number; drift?: number }> = ({ name, t, drift = 0 }) => {
  if (painted.has(name)) {
    return (
      <AbsoluteFill>
        <Img
          src={staticFile(`bg/${name}.png`)}
          style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(1.04 + drift * 0.002), translate: `${Math.sin(t * 0.05) * 10}px 0px` }}
        />
      </AbsoluteFill>
    );
  }
  const Set = BACKDROPS[name];
  return (
    <AbsoluteFill>
      <Set t={t} />
    </AbsoluteFill>
  );
};

/** Watercolour paper + vignette, laid over the whole painted world (not over UI text). */
export const PaperOverlay: React.FC<{ warmth?: number }> = ({ warmth = 0.08 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <Img src={staticFile("tex/paper.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "multiply", opacity: 0.55 }} />
    <Img src={staticFile("tex/bloom.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "multiply", opacity: 0.5 }} />
    <AbsoluteFill style={{ background: `rgba(255, 196, 120, ${warmth})`, mixBlendMode: "soft-light" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(40,25,10,0.28) 100%)" }} />
  </AbsoluteFill>
);
