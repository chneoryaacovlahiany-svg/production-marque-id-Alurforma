import React from "react";
import { random } from "remotion";
import { C } from "../../theme";

// Painterly building blocks shared by every backdrop. All coordinates are in a 1920×1080 SVG space.

/** Cumulus cloud: shaded underside, sunlit top, soft edge. */
export const Cloud: React.FC<{ x: number; y: number; s?: number; seed: string; tint?: string; shade?: string; opacity?: number }> = ({
  x,
  y,
  s = 1,
  seed,
  tint = C.cloud,
  shade = C.cloudShade,
  opacity = 1,
}) => {
  const puffs = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 8) * Math.PI;
    const r = 60 + random(`${seed}-r${i}`) * 70;
    return { cx: Math.cos(a) * -170 + (random(`${seed}-x${i}`) - 0.5) * 40, cy: -Math.sin(a) * 90 - random(`${seed}-y${i}`) * 60, r };
  });
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <ellipse cx={0} cy={18} rx={230} ry={40} fill={shade} opacity={0.9} />
      {puffs.map((p, i) => (
        <circle key={`s${i}`} cx={p.cx + 10} cy={p.cy + 22} r={p.r} fill={shade} />
      ))}
      {puffs.map((p, i) => (
        <circle key={`w${i}`} cx={p.cx - 6} cy={p.cy} r={p.r * 0.92} fill={tint} />
      ))}
      {puffs.slice(2, 7).map((p, i) => (
        <circle key={`h${i}`} cx={p.cx - 22} cy={p.cy - 18} r={p.r * 0.45} fill="#ffffff" opacity={0.85} />
      ))}
    </g>
  );
};

/** Sky gradient with a sun glow. */
export const SkyGradient: React.FC<{ id: string; top: string; mid: string; bottom: string; sun?: { x: number; y: number; color: string; r: number } }> = ({ id, top, mid, bottom, sun }) => (
  <>
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="0.6" stopColor={mid} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
      {sun && (
        <radialGradient id={`${id}-sun`}>
          <stop offset="0" stopColor={sun.color} stopOpacity={0.95} />
          <stop offset="0.25" stopColor={sun.color} stopOpacity={0.5} />
          <stop offset="1" stopColor={sun.color} stopOpacity={0} />
        </radialGradient>
      )}
    </defs>
    <rect x={-200} y={-200} width={2320} height={1480} fill={`url(#${id}-sky)`} />
    {sun && <circle cx={sun.x} cy={sun.y} r={sun.r} fill={`url(#${id}-sun)`} />}
  </>
);

/** Rolling hill band from a list of crest points, filled down to the bottom. */
export const Hill: React.FC<{ pts: [number, number][]; fill: string; bottom?: number; stroke?: string; opacity?: number }> = ({ pts, fill, bottom = 1300, stroke, opacity = 1 }) => {
  let d = `M -200 ${bottom} L ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` C ${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`;
  }
  d += ` L 2120 ${bottom} Z`;
  return <path d={d} fill={fill} stroke={stroke} strokeWidth={stroke ? 3 : 0} opacity={opacity} />;
};

/** Round broadleaf tree made of overlapping foliage blobs. */
export const Tree: React.FC<{ x: number; y: number; s?: number; seed: string; leaf?: string; leafDark?: string; leafLight?: string; sway?: number }> = ({
  x,
  y,
  s = 1,
  seed,
  leaf = "#5f9e48",
  leafDark = "#3f7a37",
  leafLight = "#9cc964",
  sway = 0,
}) => {
  const blobs = Array.from({ length: 7 }, (_, i) => ({
    cx: (random(`${seed}a${i}`) - 0.5) * 150,
    cy: -170 - random(`${seed}b${i}`) * 140,
    r: 55 + random(`${seed}c${i}`) * 40,
  }));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -14 0 C -10 -60 -16 -120 -8 -170 L 8 -170 C 14 -120 10 -60 16 0 Z" fill="#6b4a33" />
      <g transform={`rotate(${sway} 0 -60)`}>
        {blobs.map((b, i) => (
          <circle key={`d${i}`} cx={b.cx + 8} cy={b.cy + 10} r={b.r} fill={leafDark} />
        ))}
        {blobs.map((b, i) => (
          <circle key={`m${i}`} cx={b.cx} cy={b.cy} r={b.r * 0.9} fill={leaf} />
        ))}
        {blobs.slice(0, 4).map((b, i) => (
          <circle key={`l${i}`} cx={b.cx - 16} cy={b.cy - 18} r={b.r * 0.42} fill={leafLight} opacity={0.9} />
        ))}
      </g>
    </g>
  );
};

/** Slender cypress. */
export const Cypress: React.FC<{ x: number; y: number; s?: number; sway?: number }> = ({ x, y, s = 1, sway = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${sway} 0 0)`}>
    <path d="M 0 -260 C 34 -200 40 -80 26 0 L -26 0 C -40 -80 -34 -200 0 -260 Z" fill="#3c6b3a" />
    <path d="M 0 -250 C -20 -190 -26 -90 -18 -10 L -4 -10 C -10 -90 -8 -190 0 -250 Z" fill="#5d8f4c" />
  </g>
);

/** Little French house: cream walls, terracotta roof, blue shutters. */
export const House: React.FC<{ x: number; y: number; w?: number; h?: number; s?: number; wall?: string; roof?: string; shutter?: string; floors?: number; glow?: number }> = ({
  x,
  y,
  w = 160,
  h = 120,
  s = 1,
  wall = C.stone,
  roof = C.terracotta,
  shutter = "#5b8fb8",
  floors = 1,
  glow = 0,
}) => {
  const H = h * floors;
  const wins = [];
  for (let f = 0; f < floors; f++) {
    for (let k = 0; k < 2; k++) {
      const wx = -w / 2 + w * (k === 0 ? 0.22 : 0.62);
      const wy = -H + 30 + f * h;
      wins.push(
        <g key={`${f}-${k}`}>
          <rect x={wx} y={wy} width={w * 0.16} height={h * 0.38} fill={f === floors - 1 && k === 1 && glow ? `rgba(255,214,140,${0.5 + glow * 0.5})` : "#3d5a73"} />
          <rect x={wx - w * 0.07} y={wy} width={w * 0.06} height={h * 0.38} fill={shutter} />
          <rect x={wx + w * 0.17} y={wy} width={w * 0.06} height={h * 0.38} fill={shutter} />
        </g>,
      );
    }
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-H} width={w} height={H} fill={wall} stroke={C.ink} strokeWidth={2.5} />
      <rect x={w * 0.25} y={-H} width={w * 0.25} height={H} fill="rgba(120,90,60,0.12)" />
      <path d={`M ${-w / 2 - 14} ${-H} L 0 ${-H - h * 0.55} L ${w / 2 + 14} ${-H} Z`} fill={roof} stroke={C.ink} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={`M 0 ${-H - h * 0.55} L ${w / 2 + 14} ${-H} L ${w * 0.1} ${-H} Z`} fill="rgba(90,40,20,0.22)" />
      {wins}
      <rect x={-w * 0.08} y={-h * 0.5} width={w * 0.16} height={h * 0.5} fill="#7a5236" stroke={C.ink} strokeWidth={2} />
    </g>
  );
};

/** Swaying grass tufts along a ground line. */
export const Grass: React.FC<{ t: number; y: number; n?: number; seed: string; color?: string; dark?: string; h?: number; x0?: number; x1?: number }> = ({
  t,
  y,
  n = 70,
  seed,
  color = C.grass,
  dark = C.grassDark,
  h = 60,
  x0 = -40,
  x1 = 1960,
}) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = x0 + ((x1 - x0) * (i + random(`${seed}g${i}`) * 0.8)) / n;
      const hh = h * (0.6 + random(`${seed}h${i}`) * 0.8);
      const lean = Math.sin(t * 1.6 + x * 0.004) * 10 + (random(`${seed}l${i}`) - 0.5) * 14;
      const c = random(`${seed}c${i}`) > 0.5 ? color : dark;
      return <path key={i} d={`M ${x - 6} ${y} Q ${x + lean * 0.4} ${y - hh * 0.6} ${x + lean} ${y - hh} Q ${x + lean * 0.3} ${y - hh * 0.5} ${x + 6} ${y} Z`} fill={c} />;
    })}
  </g>
);

/** Soft god-rays. */
export const LightRays: React.FC<{ x: number; y: number; t: number; color?: string; n?: number; spread?: number; len?: number; opacity?: number }> = ({
  x,
  y,
  t,
  color = "#fff3c9",
  n = 5,
  spread = 50,
  len = 1400,
  opacity = 0.18,
}) => (
  <g style={{ mixBlendMode: "screen" }}>
    {Array.from({ length: n }, (_, i) => {
      const a = ((i - (n - 1) / 2) * spread) / n + 35 + Math.sin(t * 0.4 + i) * 1.5;
      const r = (a * Math.PI) / 180;
      const w = 40 + i * 14;
      const ex = x + Math.cos(r) * len;
      const ey = y + Math.sin(r) * len;
      return (
        <path
          key={i}
          d={`M ${x} ${y} L ${ex - w} ${ey} L ${ex + w * 2} ${ey} Z`}
          fill={color}
          opacity={opacity * (0.6 + 0.4 * Math.sin(t * 0.8 + i * 1.7))}
        />
      );
    })}
  </g>
);

/** Floating pollen / dust / fireflies. */
export const Motes: React.FC<{ t: number; n?: number; seed: string; color?: string; size?: number; area?: [number, number, number, number]; glow?: boolean }> = ({
  t,
  n = 40,
  seed,
  color = "#fffbe6",
  size = 3,
  area = [0, 0, 1920, 1080],
  glow,
}) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const bx = area[0] + random(`${seed}x${i}`) * area[2];
      const by = area[1] + random(`${seed}y${i}`) * area[3];
      const sp = 6 + random(`${seed}s${i}`) * 14;
      const x = bx + Math.sin(t * 0.5 + i) * 30 + t * sp;
      const y = by + Math.cos(t * 0.7 + i * 2) * 20 - t * sp * 0.4;
      const xx = ((x - area[0]) % area[2] + area[2]) % area[2] + area[0];
      const yy = ((y - area[1]) % area[3] + area[3]) % area[3] + area[1];
      const tw = glow ? 0.35 + 0.65 * Math.max(0, Math.sin(t * 2 + i * 1.3)) : 0.7;
      return <circle key={i} cx={xx} cy={yy} r={size * (0.6 + random(`${seed}r${i}`))} fill={color} opacity={tw} />;
    })}
  </g>
);

/** Potted plant. */
export const Plant: React.FC<{ x: number; y: number; s?: number; t: number; pot?: string }> = ({ x, y, s = 1, t, pot = "#c4734c" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: 9 }, (_, i) => {
      const a = -80 + i * 20 + Math.sin(t * 1.2 + i) * 3;
      return (
        <g key={i} transform={`rotate(${a} 0 -70)`}>
          <path d="M 0 -70 C 18 -120 10 -170 0 -190 C -10 -170 -18 -120 0 -70 Z" fill={i % 2 ? "#4f8d3d" : "#6fae4f"} stroke={C.ink} strokeWidth={2} />
        </g>
      );
    })}
    <path d="M -46 -80 L 46 -80 L 36 0 L -36 0 Z" fill={pot} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
    <rect x={-50} y={-92} width={100} height={18} rx={4} fill={pot} stroke={C.ink} strokeWidth={3} />
  </g>
);
