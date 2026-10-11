import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop, PaperOverlay } from "../components/painterly/Backdrop";
import { BACKDROPS, BackdropName } from "../components/painterly/backdrops";

// Preview of one set per frame range (30 frames each) — used for the art bible.
export const BackdropSheet: React.FC = () => {
  const frame = useCurrentFrame();
  const names = Object.keys(BACKDROPS) as BackdropName[];
  const name = names[Math.min(names.length - 1, Math.floor(frame / 30))];
  return (
    <AbsoluteFill>
      <Backdrop name={name} t={20 + frame / 30} />
      <PaperOverlay />
    </AbsoluteFill>
  );
};
