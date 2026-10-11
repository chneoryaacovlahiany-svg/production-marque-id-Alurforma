import React from "react";
import scenesData from "../data/scenes.json";
import { C, fonts, shadow, speakerColor } from "../theme";
import { ramp, span, speakerAt } from "../lib/timeline";
import { Character } from "../components/characters/Character";
import { Who } from "../components/characters/looks";
import type { TransitionKind } from "../components/SceneShell";

export type SceneMeta = { id: string; startSec: number; endSec: number; transitionIn: TransitionKind };
export const meta = (id: string): SceneMeta => {
  const s = scenesData.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene ${id}`);
  return s as SceneMeta;
};

// Standard staging for the two hosts in interior two-shots.
export const GROUND = 935;
export const HOST_H = 560;

/** Words of a quote revealed one by one between `a` and `b`. */
export const QuoteText: React.FC<{ t: number; a: number; b: number; text: string; size?: number; color?: string; italic?: boolean }> = ({ t, a, b, text, size = 52, color = C.navy, italic = true }) => {
  const words = text.split(" ");
  return (
    <span style={{ fontFamily: fonts.title, fontWeight: 600, fontStyle: italic ? "italic" : undefined, fontSize: size, color, lineHeight: 1.25 }}>
      {words.map((w, i) => {
        const at = a + ((b - a) * i) / words.length;
        const k = ramp(t, at, at + 0.3);
        return (
          <span key={i} style={{ display: "inline-block", opacity: k, translate: `0px ${(1 - k) * 14}px`, marginRight: size * 0.25 }}>
            {w}
          </span>
        );
      })}
    </span>
  );
};

/** Round portrait of a character (bust), glowing when that character speaks. */
export const Medallion: React.FC<{ who: Who; t: number; x: number; y: number; r?: number; at?: number; until?: number; label?: string }> = ({ who, t, x, y, r = 110, at = -1e9, until = 1e9, label }) => {
  const vis = span(t, at, until, 0.35, 0.35);
  if (vis <= 0) return null;
  const speaking = speakerAt(t) === who;
  const ring = who === "LEA" || who === "HUGO" ? speakerColor[who] : C.gold;
  const H = r * 5.2;
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", opacity: vis, scale: String(0.6 + 0.4 * ramp(t, at, at + 0.4)) }}>
      <div
        style={{
          width: r * 2,
          height: r * 2,
          borderRadius: 999,
          overflow: "hidden",
          position: "relative",
          background: "radial-gradient(circle at 40% 35%, #fffaf0, #e9dcc0)",
          border: `6px solid ${speaking ? ring : C.ink}`,
          boxShadow: speaking ? `0 0 0 8px ${ring}55, ${shadow}` : shadow,
        }}
      >
        <Character who={who} t={t} x={r} y={r + H * 0.84} h={H} pose="rest" look={0} />
      </div>
      {label && (
        <div style={{ textAlign: "center", marginTop: 8, fontFamily: fonts.body, fontWeight: 800, fontSize: 30, color: C.paper, textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>{label}</div>
      )}
    </div>
  );
};

/** Lines placed in an absolute box (for custom card layouts). */
export const Box: React.FC<{ x: number; y: number; w?: number; children: React.ReactNode; center?: boolean; opacity?: number }> = ({ x, y, w, children, center = true, opacity = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, translate: center ? "-50% -50%" : undefined, opacity }}>{children}</div>
);
