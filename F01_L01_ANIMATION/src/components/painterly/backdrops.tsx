import React from "react";
import { random } from "remotion";
import { C } from "../../theme";
import { Cloud, Cypress, Grass, Hill, House, LightRays, Motes, Plant, SkyGradient, Tree } from "./primitives";

// Hand-built painterly sets (fallback when no painted plate exists in public/bg).
// Every set is a 1920×1080 SVG driven by lesson time `t` (wind, clouds, light).

type BP = { t: number };
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1920 1080" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

const Clouds: React.FC<{ t: number; seed: string; y?: number; tint?: string; shade?: string; n?: number; speed?: number }> = ({ t, seed, y = 0, tint, shade, n = 4, speed = 7 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x0 = (i * 2200) / n + random(`${seed}${i}`) * 200 - 200;
      const x = ((x0 + t * speed * (0.6 + i * 0.15)) % 2500) - 300;
      return <Cloud key={i} seed={`${seed}${i}`} x={x} y={y + 160 + random(`${seed}y${i}`) * 180} s={0.7 + random(`${seed}s${i}`) * 0.7} tint={tint} shade={shade} />;
    })}
  </g>
);

const Flowers: React.FC<{ seed: string; y0: number; y1: number; n?: number }> = ({ seed, y0, y1, n = 60 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <circle
        key={i}
        cx={random(`${seed}x${i}`) * 1920}
        cy={y0 + random(`${seed}y${i}`) * (y1 - y0)}
        r={3 + random(`${seed}r${i}`) * 4}
        fill={["#ffffff", "#ffe27a", "#f7a9c4", "#c9b8ff"][Math.floor(random(`${seed}c${i}`) * 4)]}
      />
    ))}
  </g>
);

export const Hillside: React.FC<BP> = ({ t }) => (
  <Svg>
    <SkyGradient id="hs" top="#3f8fd6" mid="#8cc6ec" bottom="#e9f5f3" sun={{ x: 260, y: 120, r: 380, color: "#fff4cc" }} />
    <Clouds t={t} seed="hs" n={5} />
    <Hill pts={[[-100, 640], [300, 600], [700, 640], [1100, 590], [1500, 620], [2000, 580]]} fill="#9cbcd0" />
    <Hill pts={[[-100, 700], [400, 660], [900, 700], [1400, 650], [2000, 690]]} fill="#93c26c" />
    {[1080, 1180, 1290, 1380, 1480, 1560, 1660].map((x, i) => (
      <House key={x} x={x} y={690 - (i % 3) * 8} s={0.42 + (i % 2) * 0.08} floors={1 + (i % 2)} roof={i % 3 ? C.terracotta : "#c9613e"} />
    ))}
    <House x={1240} y={700} s={0.55} floors={3} w={180} glow={0.6} />
    {[980, 1050, 1720, 1800].map((x, i) => (
      <Cypress key={x} x={x} y={700} s={0.5 + (i % 2) * 0.15} sway={Math.sin(t + i) * 1.5} />
    ))}
    <Tree x={160} y={760} s={1.25} seed="hst" sway={Math.sin(t * 0.9) * 1.5} />
    <Hill pts={[[-100, 780], [500, 820], [1000, 880], [1500, 930], [2000, 960]]} fill="#7ab553" />
    <path d="M 380 1100 C 520 980 700 930 900 900 C 1100 870 1300 860 1500 850" fill="none" stroke="#ead6a6" strokeWidth={70} strokeLinecap="round" opacity={0.9} />
    <Flowers seed="hsf" y0={860} y1={1080} />
    <Grass t={t} y={1090} seed="hsg" h={90} n={90} />
    <Motes t={t} seed="hsm" n={30} />
  </Svg>
);

export const Office: React.FC<BP> = ({ t }) => (
  <Svg>
    <defs>
      <clipPath id="of-win">
        <path d="M 330 690 L 330 300 C 330 140 790 140 790 300 L 790 690 Z" />
      </clipPath>
      <linearGradient id="of-beam" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff2c4" stopOpacity={0.55} />
        <stop offset="1" stopColor="#fff2c4" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="of-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a8774c" />
        <stop offset="1" stopColor="#c08f5f" />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="#f2e3c7" />
    <rect y={0} width={1920} height={60} fill="#e5d2b0" />
    {/* window with the countryside outside */}
    <g clipPath="url(#of-win)">
      <SkyGradient id="ofs" top="#5aa5e2" mid="#a8d6f0" bottom="#eaf6f2" />
      <Clouds t={t} seed="ofc" n={3} y={-40} speed={4} />
      <Hill pts={[[300, 560], [550, 520], [820, 560]]} fill="#9cc275" />
      <Hill pts={[[300, 620], [600, 600], [820, 630]]} fill="#7fb35a" />
      <House x={470} y={600} s={0.35} floors={2} />
      <House x={650} y={610} s={0.3} />
    </g>
    <path d="M 330 690 L 330 300 C 330 140 790 140 790 300 L 790 690 Z" fill="none" stroke="#fbf6ea" strokeWidth={26} />
    <path d="M 560 170 L 560 690 M 330 440 L 790 440" stroke="#fbf6ea" strokeWidth={14} />
    <rect x={300} y={680} width={520} height={30} rx={6} fill="#efe2c8" stroke={C.ink} strokeWidth={3} />
    {/* ivy */}
    {Array.from({ length: 18 }, (_, i) => (
      <ellipse key={i} cx={330 + i * 26 + Math.sin(t + i) * 2} cy={170 + Math.sin(i * 1.7) * 30 + (i % 4) * 22} rx={16} ry={10} fill={i % 2 ? "#4f8d3d" : "#6fae4f"} transform={`rotate(${i * 37} ${330 + i * 26} ${170 + (i % 4) * 22})`} />
    ))}
    {/* wainscot + floor */}
    <rect y={730} width={1920} height={70} fill="#d8c09b" />
    <rect y={726} width={1920} height={8} fill="#b99a70" />
    <rect y={800} width={1920} height={280} fill="url(#of-floor)" />
    {Array.from({ length: 14 }, (_, i) => (
      <path key={i} d={`M ${-300 + i * 180} 1080 L ${200 + i * 110} 800`} stroke="#8e6440" strokeWidth={3} opacity={0.5} />
    ))}
    <ellipse cx={980} cy={960} rx={640} ry={95} fill="#26356a" />
    <ellipse cx={980} cy={960} rx={600} ry={80} fill="none" stroke={C.emerald} strokeWidth={8} />
    <ellipse cx={980} cy={960} rx={540} ry={64} fill="none" stroke={C.gold} strokeWidth={3} opacity={0.8} />
    {/* sun beams through the window */}
    <path d="M 340 300 L 790 300 L 1500 1080 L 700 1080 Z" fill="url(#of-beam)" opacity={0.75 + Math.sin(t * 0.6) * 0.1} style={{ mixBlendMode: "screen" }} />
    {/* cork board */}
    <rect x={1010} y={210} width={330} height={220} rx={10} fill="#c99a63" stroke={C.ink} strokeWidth={4} />
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`translate(${1040 + (i % 2) * 150} ${235 + Math.floor(i / 2) * 95}) rotate(${(i % 2 ? 4 : -3) + i})`}>
        <rect width={120} height={80} fill="#fffaf0" stroke={C.ink} strokeWidth={2} />
        <rect x={8} y={8} width={104} height={50} fill={["#9fd0ea", "#bfe3a6", "#f3c9a0", "#c8d8f0"][i]} />
        <path d={`M 30 58 L 30 36 L 60 18 L 90 36 L 90 58 Z`} fill={["#f2e7d2", "#fff", "#f7efe0", "#efe4cf"][i]} stroke={C.ink} strokeWidth={1.5} />
        <circle cx={60} cy={4} r={5} fill={C.red} />
      </g>
    ))}
    {/* bookshelf */}
    <rect x={1520} y={150} width={320} height={600} fill="#8a5a3a" stroke={C.ink} strokeWidth={4} />
    {[0, 1, 2, 3].map((r) => (
      <g key={r}>
        <rect x={1536} y={175 + r * 145} width={288} height={118} fill="#5e3c25" />
        {Array.from({ length: 9 }, (_, i) => (
          <rect
            key={i}
            x={1542 + i * 31}
            y={190 + r * 145 + (i % 3) * 6}
            width={26}
            height={103 - (i % 3) * 6}
            fill={["#2b3a6e", "#14915f", "#c9a45c", "#d0574a", "#e9d8b4", "#3f86c6"][(i + r) % 6]}
            stroke={C.ink}
            strokeWidth={1.5}
          />
        ))}
      </g>
    ))}
    {/* armchair + lamp */}
    <g transform="translate(1660 900)">
      <path d="M -150 0 L -150 -150 C -150 -230 150 -230 150 -150 L 150 0 Z" fill="#1f7a55" stroke={C.ink} strokeWidth={4} />
      <rect x={-180} y={-120} width={60} height={130} rx={24} fill="#238a60" stroke={C.ink} strokeWidth={4} />
      <rect x={120} y={-120} width={60} height={130} rx={24} fill="#238a60" stroke={C.ink} strokeWidth={4} />
      <rect x={-130} y={-60} width={260} height={50} rx={14} fill="#2a9a6c" stroke={C.ink} strokeWidth={4} />
    </g>
    <g transform="translate(1440 800)">
      <path d="M 0 0 L 0 -330" stroke={C.gold} strokeWidth={8} />
      <path d="M -60 -330 L 60 -330 L 40 -400 L -40 -400 Z" fill="#f0d79a" stroke={C.ink} strokeWidth={3} />
      <circle cx={0} cy={-330} r={120} fill="#fff1c0" opacity={0.18} />
    </g>
    <Plant x={160} y={820} s={1.3} t={t} />
    <Motes t={t} seed="ofm" n={26} area={[380, 300, 900, 700]} size={2.4} />
  </Svg>
);

export const Street: React.FC<BP> = ({ t }) => {
  const facade = (x: number, w: number, floors: number, color: string, glowFloor = -1) => (
    <g>
      <rect x={x} y={830 - floors * 150} width={w} height={floors * 150 + 10} fill={color} stroke={C.ink} strokeWidth={4} />
      <path d={`M ${x - 10} ${830 - floors * 150} L ${x + w + 10} ${830 - floors * 150} L ${x + w - 10} ${800 - floors * 150 - 40} L ${x + 10} ${800 - floors * 150 - 40} Z`} fill="#7d8ea3" stroke={C.ink} strokeWidth={4} />
      {Array.from({ length: floors }, (_, f) =>
        Array.from({ length: Math.floor(w / 140) }, (_, k) => {
          const wx = x + 40 + k * 140;
          const wy = 830 - (f + 1) * 150 + 30;
          const lit = f === glowFloor && k === 1;
          return (
            <g key={`${f}-${k}`}>
              <rect x={wx} y={wy} width={60} height={95} fill={lit ? `rgba(255,212,140,${0.75 + Math.sin(t * 2) * 0.15})` : "#41607a"} stroke={C.ink} strokeWidth={3} />
              <rect x={wx - 22} y={wy} width={20} height={95} fill="#4f86b5" stroke={C.ink} strokeWidth={2} />
              <rect x={wx + 62} y={wy} width={20} height={95} fill="#4f86b5" stroke={C.ink} strokeWidth={2} />
              {f > 0 && <path d={`M ${wx - 26} ${wy + 95} L ${wx + 86} ${wy + 95} L ${wx + 86} ${wy + 112} L ${wx - 26} ${wy + 112} Z`} fill="none" stroke="#2c2c2c" strokeWidth={3} />}
              {f > 0 && (k + f) % 2 === 0 && <ellipse cx={wx + 30} cy={wy + 92} rx={44} ry={10} fill="#d9574a" opacity={0.85} />}
            </g>
          );
        }),
      )}
    </g>
  );
  return (
    <Svg>
      <SkyGradient id="st" top="#4b98d8" mid="#9ccdee" bottom="#eef6f2" />
      <Clouds t={t} seed="stc" n={3} y={-60} />
      {facade(900, 300, 3, "#efe0c3")}
      {facade(1150, 260, 4, "#f4e8d2")}
      {facade(-40, 820, 4, "#f6ebd3", 2)}
      {facade(1360, 600, 5, "#efe2c9")}
      <rect x={300} y={700} width={120} height={130} fill="#6b4a33" stroke={C.ink} strokeWidth={4} />
      {/* cobbles */}
      <rect y={830} width={1920} height={250} fill="#c9b79a" />
      {Array.from({ length: 6 }, (_, r) =>
        Array.from({ length: 26 }, (_, k) => (
          <ellipse key={`${r}-${k}`} cx={k * 80 + (r % 2) * 40} cy={850 + r * 40} rx={34} ry={14} fill={(r + k) % 3 ? "#b9a586" : "#d6c5a6"} stroke="#a08e70" strokeWidth={2} />
        )),
      )}
      <rect y={824} width={1920} height={14} fill="#a39274" />
      {/* plane tree + dappled shade */}
      {Array.from({ length: 10 }, (_, i) => (
        <ellipse key={i} cx={900 + i * 110 + Math.sin(t * 0.6 + i) * 12} cy={900 + (i % 3) * 50} rx={60} ry={16} fill="rgba(60,80,40,0.18)" />
      ))}
      <path d="M 1180 830 C 1170 700 1200 600 1190 480 L 1214 480 C 1226 600 1196 700 1210 830 Z" fill="#8c7a5e" stroke={C.ink} strokeWidth={3} />
      <Tree x={1200} y={560} s={1.4} seed="stt" sway={Math.sin(t * 0.8) * 1.2} leaf="#6aa84f" />
      {/* bicycle */}
      <g transform="translate(1560 820)" fill="none" stroke="#2f3b48" strokeWidth={5}>
        <circle cx={-70} cy={-40} r={40} />
        <circle cx={70} cy={-40} r={40} />
        <path d="M -70 -40 L -20 -100 L 50 -100 L 70 -40 M -20 -100 L 0 -40 L 50 -100 M -30 -115 L -5 -115 M 50 -100 L 46 -125 L 66 -125" />
      </g>
      <Motes t={t} seed="stm" n={18} />
    </Svg>
  );
};

export const Valley: React.FC<BP> = ({ t }) => (
  <Svg>
    <SkyGradient id="va" top="#4c97d9" mid="#a2d1ee" bottom="#eef7ef" />
    <Clouds t={t} seed="vac" n={4} y={-120} />
    <Hill pts={[[-100, 300], [400, 250], [900, 300], [1400, 240], [2000, 290]]} fill="#a7c3d6" />
    <Hill pts={[[-100, 360], [500, 330], [1100, 370], [2000, 330]]} fill="#a9cf86" />
    <Hill pts={[[-100, 480], [600, 440], [1300, 500], [2000, 460]]} fill="#93c26c" />
    <path d="M 0 600 C 400 560 700 620 1000 600 C 1300 580 1600 640 1920 610 L 1920 1080 L 0 1080 Z" fill="#86bb5f" />
    <path d="M 120 700 C 400 660 600 720 760 760 L 520 900 C 300 860 160 800 120 700 Z" fill="#c9d77a" opacity={0.7} />
    <path d="M 1180 720 C 1400 680 1700 700 1880 760 L 1820 920 C 1600 900 1380 860 1180 720 Z" fill="#a8cf6a" opacity={0.7} />
    {/* five paths from the fork */}
    {[
      "M 960 1100 C 960 1000 960 960 960 900 C 820 860 500 760 330 560",
      "M 960 900 C 900 800 720 620 650 450",
      "M 960 900 C 960 760 990 560 1000 410",
      "M 960 900 C 1050 780 1260 620 1350 460",
      "M 960 900 C 1150 860 1500 760 1650 570",
    ].map((d, i) => (
      <g key={i}>
        <path d={d} fill="none" stroke="#b79b69" strokeWidth={i === 0 ? 62 : 40} strokeLinecap="round" opacity={0.5} />
        <path d={d} fill="none" stroke="#f0dfb3" strokeWidth={i === 0 ? 48 : 28} strokeLinecap="round" />
      </g>
    ))}
    <House x={330} y={560} s={0.6} />
    <House x={650} y={450} s={0.55} floors={2} w={140} roof="#c9613e" />
    <House x={1000} y={410} s={0.5} floors={3} w={220} roof="#7d8ea3" />
    <House x={1350} y={460} s={0.6} w={260} roof="#b85a3c" />
    <House x={1650} y={570} s={0.55} floors={4} w={260} roof="#5b6f86" />
    {[[200, 600], [520, 500], [820, 480], [1180, 470], [1500, 520], [1800, 620], [140, 760], [1760, 820]].map(([x, y], i) => (
      <Tree key={i} x={x} y={y} s={0.45 + (i % 3) * 0.1} seed={`vat${i}`} sway={Math.sin(t + i) * 1.2} />
    ))}
    {/* signpost at the fork */}
    <rect x={952} y={760} width={16} height={150} fill="#7a5236" stroke={C.ink} strokeWidth={3} />
    <Grass t={t} y={1095} seed="vag" h={80} n={80} />
    <Motes t={t} seed="vam" n={22} />
  </Svg>
);

export const Forest: React.FC<BP> = ({ t }) => (
  <Svg>
    <defs>
      <linearGradient id="fo-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e3efd9" />
        <stop offset="0.55" stopColor="#a8c9a0" />
        <stop offset="1" stopColor="#4f7a4f" />
      </linearGradient>
      <linearGradient id="fo-mist" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity={0} />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity={0.55} />
        <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#fo-bg)" />
    {Array.from({ length: 12 }, (_, i) => (
      <rect key={`f${i}`} x={60 + i * 160 + (i % 3) * 20} y={0} width={34} height={720} fill="#9fbf9a" opacity={0.6} />
    ))}
    <rect x={-100} y={480} width={2200} height={260} fill="url(#fo-mist)" transform={`translate(${Math.sin(t * 0.2) * 60} 0)`} />
    {Array.from({ length: 8 }, (_, i) => (
      <g key={`m${i}`}>
        <rect x={i * 260 - 40} y={0} width={62} height={820} fill="#5f7d55" />
        <circle cx={i * 260 - 9} cy={80 + (i % 3) * 60} r={150} fill="#4d7a45" opacity={0.85} />
      </g>
    ))}
    <LightRays x={1500} y={-100} t={t} n={6} spread={60} opacity={0.22} />
    {/* winding path with hidden holes */}
    <path d="M 700 1100 C 820 960 1100 900 1000 800 C 920 720 900 680 960 620 L 1000 620 C 980 690 1020 740 1100 800 C 1240 900 1100 1000 1260 1100 Z" fill="#c8a978" />
    <path d="M 760 1100 C 860 980 1080 920 1010 820" fill="none" stroke="#e3c899" strokeWidth={30} opacity={0.6} strokeLinecap="round" />
    {[[900, 1000, 70], [1080, 880, 46], [990, 760, 30]].map(([x, y, r], i) => (
      <g key={i}>
        <ellipse cx={x} cy={y} rx={r} ry={r * 0.32} fill="#3b2a1d" />
        <ellipse cx={x} cy={y - r * 0.08} rx={r * 0.8} ry={r * 0.18} fill="#1d140e" />
      </g>
    ))}
    {/* big near trunks */}
    <path d="M -40 1080 C -20 700 20 300 0 -20 L 170 -20 C 150 300 190 700 240 1080 Z" fill="#4a3829" />
    <path d="M 1720 1080 C 1740 700 1700 300 1730 -20 L 1940 -20 L 1960 1080 Z" fill="#40301f" />
    {Array.from({ length: 16 }, (_, i) => (
      <ellipse key={`fern${i}`} cx={i < 8 ? 120 + i * 70 : 1300 + (i - 8) * 80} cy={1000 + (i % 3) * 30} rx={90} ry={34} fill={i % 2 ? "#3f7a3f" : "#5d9a4f"} transform={`rotate(${(i % 5) * 9 - 18 + Math.sin(t + i) * 3} ${i < 8 ? 120 + i * 70 : 1300 + (i - 8) * 80} ${1000 + (i % 3) * 30})`} />
    ))}
    <Motes t={t} seed="fom" n={40} color="#fffde8" size={2.6} />
  </Svg>
);

export const Desk: React.FC<BP> = ({ t }) => (
  <Svg>
    <defs>
      <linearGradient id="dk" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#c08752" />
        <stop offset="1" stopColor="#9c6538" />
      </linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#dk)" />
    {Array.from({ length: 9 }, (_, i) => (
      <g key={i}>
        <rect x={0} y={i * 125} width={1920} height={3} fill="#7f4f2a" opacity={0.6} />
        <path d={`M 0 ${i * 125 + 60} C 400 ${i * 125 + 40} 800 ${i * 125 + 80} 1200 ${i * 125 + 55} S 1700 ${i * 125 + 70} 1920 ${i * 125 + 50}`} stroke="#b07a48" strokeWidth={2} fill="none" opacity={0.6} />
      </g>
    ))}
    {/* leaf shadows from the window */}
    <g opacity={0.22} transform={`translate(${Math.sin(t * 0.5) * 18} ${Math.cos(t * 0.4) * 10})`}>
      {Array.from({ length: 22 }, (_, i) => (
        <ellipse key={i} cx={random(`dks${i}`) * 900} cy={random(`dky${i}`) * 500} rx={70} ry={26} fill="#2d1a0d" transform={`rotate(${random(`dkr${i}`) * 180} ${random(`dks${i}`) * 900} ${random(`dky${i}`) * 500})`} />
      ))}
    </g>
    {/* tea cup */}
    <g transform="translate(1690 200)">
      <circle r={130} fill="#f4efe6" stroke={C.ink} strokeWidth={4} />
      <circle r={80} fill="#fbf8f2" stroke={C.ink} strokeWidth={4} />
      <circle r={62} fill="#a8642e" />
      <ellipse cx={-14} cy={-16} rx={20} ry={10} fill="#d49a5c" opacity={0.6} />
      <path d="M 78 -10 C 120 -14 120 30 76 26" fill="none" stroke={C.ink} strokeWidth={10} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${-30 + i * 30} -40 C ${-50 + i * 30} ${-90 - ((t * 30 + i * 20) % 40)} ${-10 + i * 30} -110 ${-30 + i * 30} -150`} stroke="#fff" strokeWidth={6} fill="none" opacity={0.25} />
      ))}
    </g>
    {/* pen */}
    <g transform="translate(1600 900) rotate(-30)">
      <rect x={-160} y={-14} width={300} height={28} rx={14} fill={C.navy} stroke={C.ink} strokeWidth={3} />
      <path d="M 140 -14 L 200 0 L 140 14 Z" fill={C.gold} stroke={C.ink} strokeWidth={3} />
      <rect x={-100} y={-16} width={14} height={32} fill={C.gold} />
    </g>
    {/* keys */}
    <g transform="translate(180 880)">
      <circle r={44} fill="none" stroke="#c9a45c" strokeWidth={8} />
      <g transform="rotate(30)">
        <rect x={30} y={-10} width={110} height={20} rx={6} fill="#c9a45c" stroke={C.ink} strokeWidth={2} />
        <rect x={120} y={10} width={10} height={18} fill="#c9a45c" />
      </g>
    </g>
    <Plant x={190} y={300} s={1.2} t={t} />
  </Svg>
);

export const Countryside: React.FC<BP> = ({ t }) => (
  <Svg>
    <SkyGradient id="cs" top="#3d88cf" mid="#9ccdeb" bottom="#fbe8c8" sun={{ x: 1650, y: 260, r: 500, color: "#fff0c2" }} />
    <Clouds t={t} seed="csc" n={4} y={-40} />
    <Hill pts={[[-100, 600], [500, 560], [1000, 610], [1500, 560], [2000, 600]]} fill="#a0bcd2" />
    <Hill pts={[[-100, 660], [600, 630], [1300, 670], [2000, 640]]} fill="#97c46e" />
    {/* sunflowers */}
    {Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 34 }, (_, k) => {
        const x = k * 60 + (r % 2) * 30 - 20;
        const y = 690 + r * 26;
        const s = 0.5 + r * 0.12;
        return (
          <g key={`${r}-${k}`} transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(t * 1.4 + k * 0.4) * 4})`}>
            <rect x={-3} y={0} width={6} height={60} fill="#4f8d3d" />
            <circle r={22} fill="#f5c331" />
            <circle r={10} fill="#6b4220" />
          </g>
        );
      }),
    )}
    <rect y={860} width={1920} height={220} fill="#7cb95a" />
    <path d="M -50 900 C 600 880 1300 890 1970 900 L 1970 1000 C 1300 990 600 985 -50 1000 Z" fill="#dcc08d" />
    <path d="M -50 945 C 600 935 1300 940 1970 948" stroke="#c4a571" strokeWidth={6} fill="none" strokeDasharray="40 30" />
    <Grass t={t} y={1095} seed="csg" h={70} n={80} />
    <Motes t={t} seed="csm" n={24} />
  </Svg>
);

export const Garden: React.FC<BP> = ({ t }) => (
  <Svg>
    <SkyGradient id="ga" top="#4f9bdc" mid="#a7d4ef" bottom="#f1f7ee" sun={{ x: 1500, y: 140, r: 360, color: "#fff6d0" }} />
    <Clouds t={t} seed="gac" n={4} y={-60} />
    <Hill pts={[[-100, 560], [600, 520], [1300, 560], [2000, 530]]} fill="#a9c5d6" />
    <Hill pts={[[-100, 640], [700, 610], [2000, 650]]} fill="#93c26c" />
    {/* the Delmas house */}
    <g>
      <rect x={250} y={380} width={620} height={420} fill="#e9dcc2" stroke={C.ink} strokeWidth={5} />
      {Array.from({ length: 40 }, (_, i) => (
        <rect key={i} x={260 + (i % 8) * 76 + (Math.floor(i / 8) % 2) * 30} y={400 + Math.floor(i / 8) * 80} width={60} height={30} rx={8} fill="#dccdb0" opacity={0.6} />
      ))}
      <path d="M 220 390 L 560 200 L 900 390 Z" fill="#c45a3a" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 560 200 L 900 390 L 640 390 Z" fill="rgba(90,30,15,0.25)" />
      {[330, 690].map((x) => (
        <g key={x}>
          <rect x={x} y={460} width={100} height={120} fill="#45657e" stroke={C.ink} strokeWidth={4} />
          <rect x={x - 34} y={460} width={30} height={120} fill="#5d93b8" stroke={C.ink} strokeWidth={3} />
          <rect x={x + 104} y={460} width={30} height={120} fill="#5d93b8" stroke={C.ink} strokeWidth={3} />
        </g>
      ))}
      <path d="M 510 800 L 510 640 C 510 600 610 600 610 640 L 610 800 Z" fill="#7a5236" stroke={C.ink} strokeWidth={4} />
      {/* wisteria + roses */}
      {Array.from({ length: 24 }, (_, i) => (
        <ellipse key={i} cx={250 + i * 27} cy={410 + (i % 3) * 14 + Math.sin(t * 1.2 + i) * 3} rx={12} ry={30} fill={i % 2 ? "#a98bd8" : "#c3a8ec"} opacity={0.9} />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={`r${i}`} cx={262 + (i % 2) * 18} cy={500 + i * 18} r={9} fill={i % 3 ? "#d94c5a" : "#4f8d3d"} />
      ))}
    </g>
    <Tree x={1050} y={720} s={1.1} seed="gat" sway={Math.sin(t * 0.8) * 1.3} />
    {/* stone wall + cat */}
    <rect x={880} y={720} width={420} height={80} fill="#d9ccb0" stroke={C.ink} strokeWidth={4} />
    <g transform={`translate(1180 720)`}>
      <ellipse cx={0} cy={-18} rx={44} ry={20} fill="#e9a35a" stroke={C.ink} strokeWidth={3} />
      <circle cx={-38} cy={-30} r={18} fill="#e9a35a" stroke={C.ink} strokeWidth={3} />
      <path d="M -50 -44 L -46 -58 L -38 -46 M -32 -46 L -26 -58 L -22 -42" fill="#e9a35a" stroke={C.ink} strokeWidth={3} />
      <path d={`M 40 -18 C 70 -18 ${70 + Math.sin(t * 2) * 10} -50 60 -60`} fill="none" stroke={C.ink} strokeWidth={8} />
    </g>
    {/* fence and gate */}
    {Array.from({ length: 13 }, (_, i) => (
      <rect key={i} x={1320 + i * 46} y={700} width={28} height={130} rx={6} fill="#f2ead8" stroke={C.ink} strokeWidth={3} />
    ))}
    <rect x={1310} y={735} width={620} height={16} fill="#f2ead8" stroke={C.ink} strokeWidth={3} />
    <rect x={1310} y={790} width={620} height={16} fill="#f2ead8" stroke={C.ink} strokeWidth={3} />
    <path d="M -50 800 C 600 790 1300 820 1970 810 L 1970 1080 L -50 1080 Z" fill="#82bf5c" />
    {Array.from({ length: 4 }, (_, i) => (
      <path key={i} d={`M ${120 + i * 40} 860 L ${520 + i * 40} 1080`} stroke="#6aa54a" strokeWidth={20} opacity={0.6} />
    ))}
    <Flowers seed="gaf" y0={830} y1={1060} n={50} />
    <Grass t={t} y={1095} seed="gag" h={70} n={70} />
    <Motes t={t} seed="gam" n={22} />
  </Svg>
);

export const TowerSet: React.FC<BP> = ({ t }) => (
  <Svg>
    <SkyGradient id="tw" top="#3f8bd0" mid="#a5d2ee" bottom="#f2f7ef" sun={{ x: 900, y: 120, r: 420, color: "#fff4cc" }} />
    <Clouds t={t} seed="twc" n={4} y={-40} />
    <Hill pts={[[-100, 560], [400, 470], [800, 540], [1200, 450], [1600, 520], [2000, 470]]} fill="#a3bfd3" />
    <Hill pts={[[-100, 700], [600, 650], [1300, 690], [2000, 660]]} fill="#93c26c" />
    <Tree x={260} y={860} s={2.1} seed="twt" sway={Math.sin(t * 0.7) * 1.2} />
    {/* tower */}
    <g>
      <rect x={1380} y={180} width={320} height={700} fill="#d8ccb6" stroke={C.ink} strokeWidth={5} />
      {Array.from({ length: 48 }, (_, i) => (
        <rect key={i} x={1390 + (i % 4) * 78 + (Math.floor(i / 4) % 2) * 30} y={190 + Math.floor(i / 4) * 56} width={64} height={40} rx={8} fill="#c8bba2" opacity={0.7} />
      ))}
      <path d="M 1360 190 L 1720 190 L 1720 140 L 1680 140 L 1680 160 L 1640 160 L 1640 140 L 1600 140 L 1600 160 L 1560 160 L 1560 140 L 1520 140 L 1520 160 L 1480 160 L 1480 140 L 1440 140 L 1440 160 L 1400 160 L 1400 140 L 1360 140 Z" fill="#d8ccb6" stroke={C.ink} strokeWidth={5} />
      <path d="M 1480 880 L 1480 700 C 1480 640 1600 640 1600 700 L 1600 880 Z" fill="#6b4a33" stroke={C.ink} strokeWidth={5} />
      <rect x={1520} y={740} width={40} height={36} rx={6} fill="#5c5c5c" stroke={C.ink} strokeWidth={3} />
      <path d="M 1526 742 C 1526 712 1554 712 1554 742" fill="none" stroke="#5c5c5c" strokeWidth={8} />
      <rect x={1510} y={330} width={60} height={110} rx={30} fill="#3d5a73" stroke={C.ink} strokeWidth={4} />
      {Array.from({ length: 30 }, (_, i) => (
        <ellipse key={`iv${i}`} cx={1380 + (i % 6) * 18 + Math.sin(i) * 10} cy={300 + i * 19} rx={22} ry={14} fill={i % 2 ? "#4f8d3d" : "#6fae4f"} transform={`rotate(${i * 31 + Math.sin(t + i) * 4} ${1380 + (i % 6) * 18} ${300 + i * 19})`} />
      ))}
    </g>
    <path d="M -50 860 C 600 840 1300 870 1970 850 L 1970 1080 L -50 1080 Z" fill="#7ab553" />
    <Flowers seed="twf" y0={880} y1={1060} n={40} />
    <Grass t={t} y={1095} seed="twg" h={70} n={70} />
    <Motes t={t} seed="twm" n={20} />
  </Svg>
);

export const Sunset: React.FC<BP> = ({ t }) => (
  <Svg>
    <SkyGradient id="ss" top="#26306a" mid="#c2607a" bottom="#ffcf86" sun={{ x: 1180, y: 640, r: 620, color: "#ffd98f" }} />
    {Array.from({ length: 40 }, (_, i) => (
      <circle key={i} cx={random(`sst${i}`) * 1920} cy={random(`ssy${i}`) * 260} r={1.5 + random(`ssr${i}`) * 1.8} fill="#fff8e0" opacity={0.3 + 0.6 * Math.max(0, Math.sin(t * 1.5 + i))} />
    ))}
    <circle cx={1180} cy={650} r={90} fill="#ffe6a8" />
    <Clouds t={t} seed="ssc" n={4} y={120} tint="#ffb48a" shade="#b2587a" speed={4} />
    <path d="M -50 690 L 1970 690 L 1970 760 L -50 760 Z" fill="#5a3d6e" />
    {[[200, 70], [300, 110], [380, 80], [520, 130], [700, 90], [860, 120], [1000, 80], [1450, 100], [1560, 140], [1700, 90], [1820, 120]].map(([x, h], i) => (
      <rect key={i} x={x} y={690 - h} width={90} height={h} fill="#4a3260" />
    ))}
    <path d="M 1300 690 L 1300 520 L 1320 470 L 1340 520 L 1340 690 Z" fill="#4a3260" />
    {/* river with glints */}
    <path d="M -50 760 L 1970 760 L 1970 820 L -50 820 Z" fill="#e79c7a" />
    {Array.from({ length: 14 }, (_, i) => (
      <rect key={i} x={1040 + (i % 5) * 50 + Math.sin(t * 2 + i) * 20} y={770 + i * 4} width={60 - i * 3} height={3} fill="#fff1c4" opacity={0.8} />
    ))}
    <path d="M -50 800 C 500 760 1000 840 1970 820 L 1970 1080 L -50 1080 Z" fill="#2f4a3a" />
    <path d="M -50 880 C 500 840 900 900 1970 900 L 1970 1080 L -50 1080 Z" fill="#253d30" />
    <Tree x={260} y={880} s={1.6} seed="sst" leaf="#2f4a3a" leafDark="#203427" leafLight="#4a6d4f" sway={Math.sin(t * 0.7) * 1} />
    {/* emerald bench */}
    <g transform="translate(960 900)">
      <rect x={-200} y={-90} width={400} height={20} rx={8} fill={C.emerald} stroke={C.ink} strokeWidth={4} />
      <rect x={-200} y={-140} width={400} height={18} rx={8} fill={C.emerald} stroke={C.ink} strokeWidth={4} />
      <rect x={-180} y={-70} width={16} height={70} fill="#2a2a2a" />
      <rect x={164} y={-70} width={16} height={70} fill="#2a2a2a" />
    </g>
    <Motes t={t} seed="ssf" n={36} color="#fff2a0" size={3.2} area={[0, 760, 1920, 320]} glow />
  </Svg>
);

export const BACKDROPS = {
  hillside: Hillside,
  office: Office,
  street: Street,
  valley: Valley,
  forest: Forest,
  desk: Desk,
  truck: Countryside,
  garden: Garden,
  tower: TowerSet,
  sunset: Sunset,
};
export type BackdropName = keyof typeof BACKDROPS;
