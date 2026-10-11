import React from "react";
import { AbsoluteFill, interpolate, random } from "remotion";
import { C, ease } from "../theme";
import { ramp, useT } from "../lib/timeline";
import { Backdrop, PaperOverlay } from "./painterly/Backdrop";
import { BackdropName } from "./painterly/backdrops";
import { Cloud } from "./painterly/primitives";

export type TransitionKind = "iris" | "leaves" | "clouds" | "page" | "zoom" | "split" | "fade" | "fade-from-white" | "none";
export const TRANSITION_LEAD: Record<TransitionKind, number> = {
  iris: 0.8,
  leaves: 1.0,
  clouds: 1.2,
  page: 0.8,
  zoom: 0.7,
  split: 0.8,
  fade: 0.6,
  "fade-from-white": 0.8,
  none: 0,
};

/** Camera keyframe: [lessonTime, scale, panX px, panY px]. */
export type CamKey = [number, number, number, number];

const camAt = (keys: CamKey[] | undefined, t: number) => {
  if (!keys || keys.length === 0) return { s: 1, x: 0, y: 0 };
  if (keys.length === 1) return { s: keys[0][1], x: keys[0][2], y: keys[0][3] };
  const ts = keys.map((k) => k[0]);
  const o = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const, easing: ease.inOut };
  return {
    s: interpolate(t, ts, keys.map((k) => k[1]), o),
    x: interpolate(t, ts, keys.map((k) => k[2]), o),
    y: interpolate(t, ts, keys.map((k) => k[3]), o),
  };
};

/**
 * One scene: painted world (backdrop + characters, moved by the camera, under a watercolour paper pass)
 * and a flat UI layer (keywords, cards) on top. The entry transition plays during the scene's lead-in.
 */
export const SceneShell: React.FC<{
  start: number;
  enter: TransitionKind;
  backdrop: BackdropName;
  camera?: CamKey[];
  world?: React.ReactNode;
  ui?: React.ReactNode;
  warmth?: number;
  origin?: [number, number]; // iris centre (px)
}> = ({ start, enter, backdrop, camera, world, ui, warmth, origin = [960, 540] }) => {
  const t = useT();
  const lead = TRANSITION_LEAD[enter];
  const k = lead > 0 ? ramp(t, start - lead, start, ease.inOut) : 1;
  const cam = camAt(camera, t);

  let style: React.CSSProperties = {};
  let contentOpacity = 1;
  if (k < 1) {
    switch (enter) {
      case "iris":
        style = { clipPath: `circle(${k * 120}% at ${origin[0]}px ${origin[1]}px)` };
        break;
      case "leaves":
        style = { clipPath: `polygon(0 0, ${k * 140}% 0, ${k * 140 - 30}% 100%, 0 100%)` };
        break;
      case "page":
        style = { translate: `${(1 - k) * 1920}px 0px`, rotate: `${(1 - k) * 4}deg`, boxShadow: "-30px 0 60px rgba(0,0,0,0.35)" };
        break;
      case "zoom":
        style = { scale: String(1 + (1 - k) * 0.35), opacity: k, filter: `blur(${(1 - k) * 10}px)` };
        break;
      case "split":
        style = { clipPath: `inset(${(1 - k) * 50}% 0 ${(1 - k) * 50}% 0)` };
        break;
      case "fade":
        style = { opacity: k };
        break;
      case "clouds":
        contentOpacity = k > 0.5 ? 1 : 0;
        break;
      default:
        break;
    }
  }

  return (
    <AbsoluteFill style={style}>
      <AbsoluteFill style={{ opacity: contentOpacity }}>
        <AbsoluteFill style={{ scale: String(cam.s), translate: `${cam.x}px ${cam.y}px` }}>
          <Backdrop name={backdrop} t={t} />
          {world}
        </AbsoluteFill>
        <PaperOverlay warmth={warmth} />
        <AbsoluteFill>{ui}</AbsoluteFill>
      </AbsoluteFill>
      {enter === "fade-from-white" && k < 1 && <AbsoluteFill style={{ background: "#fffaf0", opacity: 1 - k }} />}
      {enter === "leaves" && k > 0 && k < 1 && <LeafGust k={k} />}
      {enter === "clouds" && k > 0 && k < 1 && <CloudSweep k={k} />}
    </AbsoluteFill>
  );
};

/** A gust of leaves riding the wipe edge. */
const LeafGust: React.FC<{ k: number }> = ({ k }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%">
      {Array.from({ length: 46 }, (_, i) => {
        const y = random(`lg-y${i}`) * 1080;
        const edge = k * 1.4 * 1920 - (y / 1080) * 0.3 * 1920;
        const x = edge + (random(`lg-x${i}`) - 0.6) * 380;
        const r = random(`lg-r${i}`) * 360 + k * 720;
        const col = ["#6fae4f", "#4f8d3d", "#9cc964", "#d99a3a", "#c9613e"][i % 5];
        return (
          <g key={i} transform={`translate(${x} ${y + Math.sin(k * 8 + i) * 40}) rotate(${r})`}>
            <path d="M 0 -22 C 16 -10 16 10 0 22 C -16 10 -16 -10 0 -22 Z" fill={col} stroke={C.ink} strokeWidth={2} />
            <path d="M 0 -20 L 0 20" stroke={C.ink} strokeWidth={1.5} opacity={0.6} />
          </g>
        );
      })}
    </svg>
  </AbsoluteFill>
);

/** Big soft clouds rolling across the frame; the cut happens behind them. */
const CloudSweep: React.FC<{ k: number }> = ({ k }) => {
  const cover = Math.sin(k * Math.PI); // 0 → 1 → 0
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "#f6fbff", opacity: Math.max(0, cover - 0.25) * 1.2 }} />
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        {Array.from({ length: 12 }, (_, i) => {
          const row = i % 4;
          const x = interpolate(k, [0, 1], [2400 + (i % 3) * 300, -900 - (i % 3) * 300]) + row * 120;
          return <Cloud key={i} seed={`cs${i}`} x={x} y={120 + row * 290} s={1.6 + (i % 3) * 0.4} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};
