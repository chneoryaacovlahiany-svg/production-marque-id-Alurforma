import React from "react";
import { C, fonts } from "../theme";

// Drawn props. Hand items are centred on the hand (0,0) and sized for a ~600 px tall character.
const ink = { stroke: C.ink, strokeWidth: 3.5, strokeLinejoin: "round" as const };

export const PhoneItem: React.FC = () => (
  <g transform="translate(-6 -30)">
    <rect x={-16} y={-34} width={32} height={62} rx={7} fill="#2b3a6e" {...ink} />
    <rect x={-11} y={-27} width={22} height={40} rx={3} fill="#9fd0ea" />
  </g>
);

export const FolderItem: React.FC<{ color?: string }> = ({ color = C.emerald }) => (
  <g transform="translate(18 -40) rotate(-6)">
    <rect x={-50} y={-60} width={100} height={130} rx={8} fill={color} {...ink} />
    <rect x={-40} y={-48} width={80} height={14} rx={3} fill="#fffaf0" opacity={0.9} />
    <rect x={-40} y={-26} width={60} height={8} rx={3} fill="#fffaf0" opacity={0.6} />
  </g>
);

export const PaperItem: React.FC<{ sealed?: boolean }> = ({ sealed }) => (
  <g transform="translate(20 -50) rotate(-4)">
    <rect x={-48} y={-66} width={96} height={128} rx={6} fill="#fffdf6" {...ink} />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={-34} y={-48 + i * 18} width={i === 4 ? 40 : 68} height={6} rx={3} fill="#c9bfae" />
    ))}
    {sealed && <circle cx={22} cy={40} r={13} fill={C.red} {...ink} strokeWidth={2} />}
  </g>
);

export const MagnifierItem: React.FC = () => (
  <g transform="translate(10 -70) rotate(-20)">
    <rect x={-8} y={10} width={16} height={70} rx={6} fill="#7a5236" {...ink} />
    <circle cx={0} cy={-30} r={42} fill="rgba(200,230,255,0.45)" stroke={C.gold} strokeWidth={9} />
    <path d="M -18 -48 Q -6 -60 10 -56" stroke="#fff" strokeWidth={5} fill="none" opacity={0.8} />
  </g>
);

export const KeyItem: React.FC<{ color?: string }> = ({ color = C.gold }) => (
  <g transform="translate(0 -20) rotate(-30)">
    <circle cx={0} cy={-36} r={22} fill="none" stroke={color} strokeWidth={10} />
    <rect x={-6} y={-16} width={12} height={70} fill={color} {...ink} strokeWidth={2} />
    <rect x={6} y={30} width={16} height={8} fill={color} />
    <rect x={6} y={44} width={12} height={8} fill={color} />
  </g>
);

export const CardItem: React.FC = () => (
  <g transform="translate(20 -30) rotate(-8)">
    <rect x={-56} y={-36} width={112} height={72} rx={10} fill="#fffdf6" {...ink} />
    <rect x={-56} y={-36} width={112} height={18} rx={8} fill={C.navy} />
    <circle cx={-30} cy={8} r={13} fill={C.stone} stroke={C.ink} strokeWidth={2} />
    <rect x={-8} y={0} width={50} height={6} rx={3} fill="#c9bfae" />
    <rect x={-8} y={14} width={36} height={6} rx={3} fill="#c9bfae" />
  </g>
);

export const PenItem: React.FC = () => (
  <g transform="translate(6 -30) rotate(30)">
    <rect x={-7} y={-60} width={14} height={80} rx={6} fill={C.navy} {...ink} strokeWidth={2.5} />
    <path d="M -7 20 L 0 38 L 7 20 Z" fill={C.gold} {...ink} strokeWidth={2} />
  </g>
);

/** Free-standing icons (SVG in their own box). */
export const Icon: React.FC<{ kind: "shield" | "chest" | "coin" | "envelope" | "house" | "key" | "lock" | "phone" | "doc" | "people" | "handshake" | "signature" | "badge" | "ledger"; size?: number; color?: string }> = ({
  kind,
  size = 120,
  color,
}) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{ overflow: "visible", display: "block" }}>
    {kind === "shield" && (
      <g>
        <path d="M 0 -52 L 44 -36 C 44 6 30 36 0 54 C -30 36 -44 6 -44 -36 Z" fill={color ?? C.emerald} {...ink} />
        <path d="M 0 -40 L 32 -28 C 32 2 22 24 0 38 Z" fill="rgba(255,255,255,0.25)" />
        <path d="M -16 0 L -4 14 L 20 -14" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
    {kind === "chest" && (
      <g>
        <path d="M -50 -6 L 50 -6 L 50 44 L -50 44 Z" fill="#9a6a43" {...ink} />
        <path d="M -50 -6 C -50 -46 50 -46 50 -6 Z" fill="#b07c50" {...ink} />
        <rect x={-50} y={-10} width={100} height={10} fill={color ?? C.gold} {...ink} strokeWidth={2.5} />
        <rect x={-10} y={-4} width={20} height={24} rx={4} fill={color ?? C.gold} {...ink} strokeWidth={2.5} />
        <path d="M -30 -40 L -30 44 M 30 -40 L 30 44" stroke={color ?? C.gold} strokeWidth={6} />
      </g>
    )}
    {kind === "coin" && (
      <g>
        <circle r={40} fill={color ?? "#f2c14e"} {...ink} />
        <circle r={28} fill="none" stroke="#c99a2e" strokeWidth={4} />
        <text x={0} y={14} textAnchor="middle" fontFamily={fonts.title} fontWeight={800} fontSize={40} fill="#a67b1f">€</text>
      </g>
    )}
    {kind === "envelope" && (
      <g>
        <rect x={-50} y={-32} width={100} height={66} rx={6} fill="#fffdf6" {...ink} />
        <path d="M -50 -32 L 0 8 L 50 -32" fill="none" {...ink} />
        <circle cx={0} cy={8} r={10} fill={C.red} {...ink} strokeWidth={2} />
      </g>
    )}
    {kind === "house" && (
      <g>
        <rect x={-36} y={-6} width={72} height={52} fill={C.stone} {...ink} />
        <path d="M -48 -4 L 0 -46 L 48 -4 Z" fill={color ?? C.terracotta} {...ink} />
        <rect x={-10} y={16} width={20} height={30} fill="#7a5236" {...ink} strokeWidth={2.5} />
      </g>
    )}
    {kind === "key" && <KeyItem color={color} />}
    {kind === "lock" && (
      <g>
        <path d="M -22 -10 L -22 -26 C -22 -54 22 -54 22 -26 L 22 -10" fill="none" stroke={C.ink} strokeWidth={10} />
        <rect x={-34} y={-12} width={68} height={56} rx={10} fill={color ?? C.amber} {...ink} />
        <circle cx={0} cy={12} r={8} fill={C.ink} />
      </g>
    )}
    {kind === "phone" && (
      <g>
        <rect x={-26} y={-48} width={52} height={96} rx={10} fill={C.navy} {...ink} />
        <rect x={-19} y={-38} width={38} height={66} rx={4} fill="#9fd0ea" />
      </g>
    )}
    {kind === "doc" && (
      <g>
        <path d="M -38 -50 L 22 -50 L 40 -32 L 40 50 L -38 50 Z" fill="#fffdf6" {...ink} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={-26} y={-28 + i * 18} width={i === 3 ? 34 : 52} height={7} rx={3} fill="#c9bfae" />
        ))}
      </g>
    )}
    {kind === "people" && (
      <g fill={color ?? C.navy} {...ink}>
        <circle cx={-20} cy={-20} r={16} />
        <path d="M -46 40 C -46 4 6 4 6 40 Z" />
        <circle cx={22} cy={-14} r={14} fill={C.emerald} />
        <path d="M 0 40 C 0 10 46 10 46 40 Z" fill={C.emerald} />
      </g>
    )}
    {kind === "handshake" && (
      <g {...ink}>
        <path d="M -56 -6 L -20 -20 L 10 -4 L -8 10 Z" fill="#f1c9a7" />
        <path d="M 56 -6 L 20 -20 L -10 0 L 12 22 L 30 8 Z" fill="#c98f6b" />
        <rect x={-62} y={-14} width={16} height={30} fill={C.emerald} />
        <rect x={46} y={-14} width={16} height={30} fill={C.navy} />
      </g>
    )}
    {kind === "signature" && (
      <g>
        <rect x={-50} y={-40} width={100} height={80} rx={6} fill="#fffdf6" {...ink} />
        <path d="M -36 18 C -24 -10 -16 30 -4 4 S 14 -6 20 14 S 34 6 40 8" fill="none" stroke={C.navy} strokeWidth={4} strokeLinecap="round" />
        <path d="M -38 26 L 40 26" stroke="#c9bfae" strokeWidth={3} />
      </g>
    )}
    {kind === "badge" && (
      <g>
        <rect x={-34} y={-44} width={68} height={88} rx={8} fill="#fffdf6" {...ink} />
        <rect x={-34} y={-44} width={68} height={20} rx={6} fill={color ?? C.emerald} />
        <circle cx={0} cy={0} r={14} fill={C.stone} stroke={C.ink} strokeWidth={2} />
        <rect x={-20} y={22} width={40} height={6} rx={3} fill="#c9bfae" />
      </g>
    )}
    {kind === "ledger" && (
      <g>
        <rect x={-46} y={-50} width={92} height={100} rx={6} fill="#fffdf6" {...ink} />
        <rect x={-46} y={-50} width={92} height={18} rx={4} fill={color ?? C.emerald} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={-34} y={-20 + i * 16} width={40} height={6} rx={3} fill="#c9bfae" />
            <circle cx={24} cy={-17 + i * 16} r={6} fill="#f2c14e" stroke={C.ink} strokeWidth={1.5} />
          </g>
        ))}
      </g>
    )}
  </svg>
);

/** Vintage pale-green truck (side view). `rumble` shakes it, `lights` 0..1 turns the headlamp on. */
export const Truck: React.FC<{ x: number; y: number; s?: number; rumble?: number; lights?: number; puff?: number }> = ({ x, y, s = 1, rumble = 0, lights = 0, puff = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: `-50% -100%`, scale: String(s), transformOrigin: "50% 100%" }}>
    <svg width={760} height={420} viewBox="0 0 760 420" style={{ overflow: "visible", translate: `0px ${rumble}px` }}>
      {puff > 0 && (
        <g opacity={Math.max(0, 1 - puff)}>
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={20 - puff * 120 - i * 40} cy={330 - puff * 40 - i * 18} r={20 + puff * 30 + i * 10} fill="#d8d2c8" />
          ))}
        </g>
      )}
      <rect x={30} y={120} width={400} height={210} rx={18} fill="#a9c9a0" {...ink} strokeWidth={5} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={50 + i * 76} y={140} width={10} height={170} fill="#94b78a" />
      ))}
      <path d="M 430 330 L 430 150 C 430 100 470 80 540 80 L 600 80 C 640 80 660 110 680 170 L 720 220 C 735 240 740 260 740 290 L 740 330 Z" fill="#b8d6ad" {...ink} strokeWidth={5} />
      <path d="M 470 180 L 470 110 C 470 100 480 96 500 96 L 590 96 C 615 96 630 120 645 180 Z" fill="#cfe6f2" {...ink} strokeWidth={4} />
      <rect x={480} y={200} width={12} height={40} rx={4} fill={C.ink} />
      <ellipse cx={728} cy={250} rx={16} ry={22} fill={lights > 0 ? `rgba(255,236,160,${0.5 + lights * 0.5})` : "#f3edd8"} {...ink} strokeWidth={4} />
      {lights > 0 && <path d="M 742 236 L 900 190 L 900 330 L 742 266 Z" fill={`rgba(255,240,180,${lights * 0.35})`} />}
      <rect x={20} y={318} width={730} height={26} rx={10} fill="#7a7f86" {...ink} strokeWidth={4} />
      {[150, 600].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={350} r={62} fill="#2f2f33" {...ink} strokeWidth={5} />
          <circle cx={cx} cy={350} r={30} fill="#c7c9cc" {...ink} strokeWidth={4} />
        </g>
      ))}
    </svg>
  </div>
);

/** Kite with a fluttering ribbon carrying a label. */
export const Kite: React.FC<{ x: number; y: number; t: number; color: string; label: string; w?: number }> = ({ x, y, t, color, label, w = 560 }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", rotate: `${Math.sin(t * 1.3 + x) * 4}deg` }}>
    <svg width={160} height={200} viewBox="-80 -100 160 200" style={{ position: "absolute", left: -80, top: -170, overflow: "visible" }}>
      <path d="M 0 -95 L 70 -10 L 0 90 L -70 -10 Z" fill={color} {...ink} strokeWidth={4} />
      <path d="M 0 -95 L 0 90 M -70 -10 L 70 -10" stroke={C.ink} strokeWidth={3} />
      <path d="M 0 -95 L 70 -10 L 0 -10 Z" fill="rgba(255,255,255,0.25)" />
      <path d={`M 0 90 C ${20 + Math.sin(t * 3) * 20} 140 ${-20 + Math.cos(t * 3) * 20} 170 0 230`} fill="none" stroke={C.ink} strokeWidth={3} />
    </svg>
    <div
      style={{
        width: w,
        marginTop: 70,
        background: C.paper,
        border: `4px solid ${C.ink}`,
        borderRadius: 16,
        padding: "14px 22px",
        fontFamily: fonts.body,
        fontWeight: 800,
        fontSize: 40,
        color: C.navy,
        textAlign: "center",
        boxShadow: "0 10px 20px rgba(30,20,10,0.25)",
        rotate: `${Math.sin(t * 2 + x) * 2}deg`,
      }}
    >
      {label}
    </div>
  </div>
);

/** Glowing lantern medallion with a label (forest scene). */
export const Lantern: React.FC<{ x: number; y: number; on: number; label: string; icon: React.ReactNode }> = ({ x, y, on, label, icon }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", textAlign: "center", opacity: 0.35 + on * 0.65, scale: String(0.85 + on * 0.15) }}>
    <div
      style={{
        width: 170,
        height: 170,
        borderRadius: 999,
        margin: "0 auto",
        background: `radial-gradient(circle, rgba(255,240,180,${on}) 0%, rgba(255,214,120,${on * 0.6}) 45%, rgba(255,214,120,0) 70%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 110, height: 110, borderRadius: 999, background: C.paper, border: `4px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
    </div>
    <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 36, color: C.paper, textShadow: "0 2px 8px rgba(0,0,0,0.6)", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
  </div>
);
