import React from "react";
import { C, fonts } from "../theme";

// The ALURFORMA logo rebuilt as animatable parts, in "logo space" (the 1250×400 box of public/brand/logo.png):
// the house-shaped "A" mark on the left, the "Alurforma" wordmark on the right, baseline at y = 258.
export const LOGO_W = 1250;
export const LOGO_H = 400;
export const BASELINE = 258;

const NAVY = "#0f1f4b";
const GREEN = "#12895c";
const GOLD = "#c8a46a";

/** Letter centres measured on the official wordmark. */
export const LETTERS: { ch: string; x: number }[] = [
  { ch: "A", x: 452 },
  { ch: "l", x: 545 },
  { ch: "u", x: 626 },
  { ch: "r", x: 717 },
  { ch: "f", x: 779 },
  { ch: "o", x: 863 },
  { ch: "r", x: 964 },
  { ch: "m", x: 1076 },
  { ch: "a", x: 1184 },
];

/** One wordmark letter, squashable around its foot (Pixar-lamp style). */
export const Letter: React.FC<{ ch: string; x: number; sx?: number; sy?: number; dy?: number; rot?: number }> = ({ ch, x, sx = 1, sy = 1, dy = 0, rot = 0 }) => (
  <g transform={`translate(${x} ${BASELINE + dy}) rotate(${rot}) scale(${sx} ${sy})`}>
    <ellipse cx={0} cy={4} rx={44 * sx} ry={6} fill="rgba(15,31,75,0.12)" />
    <text x={0} y={0} textAnchor="middle" fontFamily={fonts.brand} fontWeight={600} fontSize={176} fill={NAVY} transform={ch === "m" ? "scale(0.92 1)" : undefined}>
      {ch}
    </text>
  </g>
);

/**
 * The house mark. `grow` 0→1 raises the A-frame from its base (with overshoot allowed),
 * `door` 0→1 swings the golden door open, `glow` lights the doorway, `road` 0→1 lays the paths.
 */
export const HouseMark: React.FC<{ grow: number; door: number; glow: number; road: number }> = ({ grow, door, glow, road }) => (
  <g>
    <defs>
      <clipPath id="mark-road">
        <rect x={0} y={260} width={380} height={140 * road} />
      </clipPath>
      <radialGradient id="mark-glow">
        <stop offset="0" stopColor="#fff6c8" stopOpacity={0.95} />
        <stop offset="1" stopColor="#fff6c8" stopOpacity={0} />
      </radialGradient>
    </defs>
    {glow > 0 && <circle cx={210} cy={220} r={60 + 120 * glow} fill="url(#mark-glow)" opacity={glow} />}
    <g transform={`translate(0 296) scale(1 ${grow}) translate(0 -296)`}>
      {/* A-frame: outer legs, doorway cut-out */}
      <path
        d="M 186 27 L 191 27 L 344 290 C 346 294 345 296 341 296 L 238 296 L 238 183 L 154 131 L 152 268 C 110 276 66 290 34 303 L 33 297 C 60 280 66 270 72 262 Z"
        fill={NAVY}
      />
      {/* inner wall + green door + golden door leaf */}
      <path d="M 154 131 L 236 181 L 236 266 L 153 266 Z" fill="#fbf8f1" />
      <path d="M 197 176 L 225 190 L 225 264 L 197 264 Z" fill={GREEN} />
      <path d={`M 203 159 L ${203 + 32 * (1 - door * 0.7)} ${178 - door * 6} L ${205 + 32 * (1 - door * 0.7)} 262 L 204 262 Z`} fill={GOLD} />
    </g>
    {/* paths leading to the door */}
    <g clipPath="url(#mark-road)">
      <path d="M 15 370 C 40 330 110 290 212 266 L 216 268 C 140 290 90 330 62 370 Z" fill={NAVY} />
      <path d="M 102 370 C 130 320 170 285 220 266 L 224 268 C 190 292 165 330 157 370 Z" fill={GREEN} />
    </g>
  </g>
);

/** Leather briefcase. `open` 0→1 lifts the lid. Origin: centre of the bottom edge. */
export const Briefcase: React.FC<{ open?: number; s?: number }> = ({ open = 0, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M -14 -52 C -14 -64 14 -64 14 -52" fill="none" stroke="#5a3a24" strokeWidth={6} strokeLinecap="round" />
    <g transform={`rotate(${-open * 110} -38 -44)`}>
      <rect x={-38} y={-52} width={76} height={14} rx={5} fill="#9a6337" stroke="#4b3328" strokeWidth={2.5} />
    </g>
    <rect x={-38} y={-40} width={76} height={40} rx={6} fill="#a86c3c" stroke="#4b3328" strokeWidth={2.5} />
    <rect x={-38} y={-24} width={76} height={4} fill="#8a5530" />
    <rect x={-24} y={-44} width={9} height={9} rx={2} fill={GOLD} stroke="#4b3328" strokeWidth={1.5} />
    <rect x={15} y={-44} width={9} height={9} rx={2} fill={GOLD} stroke="#4b3328" strokeWidth={1.5} />
  </g>
);

/** Hand-held version (hangs below the hand, keeps upright). */
export const BriefcaseItem: React.FC<{ open?: number }> = ({ open = 0 }) => (
  <g transform="translate(4 70)">
    <Briefcase s={0.95} open={open} />
  </g>
);

/** A sheet of paper with a few lines (and the green ALURFORMA tab). */
export const Sheet: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-24} y={-32} width={48} height={64} rx={3} fill="#fffdf6" stroke="#4b3328" strokeWidth={2} />
    <rect x={-24} y={-32} width={48} height={9} rx={2} fill={C.emerald} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={-16} y={-16 + i * 11} width={i === 3 ? 18 : 32} height={4} rx={2} fill="#cbbfac" />
    ))}
  </g>
);
