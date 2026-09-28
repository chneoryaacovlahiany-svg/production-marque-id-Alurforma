import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../brand';
import {fontFamily} from '../font';
import logo from '../logo-paths.json';
import {CUT, FPS, TOTAL, ease, mix, prog} from '../timing';

/**
 * 13,88 → 18,72 s — La révélation.
 * La lumière de la porte devient la porte du logo. Le logo se construit comme un bâtiment :
 * tracé or (le plan), les deux chemins qui mènent à la porte, puis le « A » tombe sur le
 * l'accord final du morceau (13,96 s), la porte s'ouvre, le nom se dévoile ; la signature
 * arrive en deux temps pendant que l'accord résonne.
 */
const L = logo.layers;
const DOOR = logo.meta.door.map(([x, y]) => `${x},${y}`).join(' ');
const ROADS = '0,425 0,330 120,305 230,294 275,294 275,425';
const A_REGION = 'M0,0H412V425H275V294H230L120,305L0,330Z';
const LOGO_W = 1180;
const K = LOGO_W / logo.meta.width;
const LOGO_H = logo.meta.height * K;
const LOGO_TOP = 300;

const Words: React.FC<{text: string; start: number; t: number}> = ({text, start, t}) => (
  <>
    {text.split(' ').map((w, i) => {
      const e = prog(t, start + i * 0.045, start + i * 0.045 + 0.4, ease.out);
      return (
        <span
          key={i}
          style={{
            display: 'inline-block',
            marginRight: '0.55em',
            opacity: e,
            transform: `translateY(${(1 - e) * 16}px)`,
            filter: `blur(${(1 - e) * 5}px)`,
          }}
        >
          {w}
        </span>
      );
    })}
  </>
);

export const Revelation: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < CUT.whiteout) return null;

  const W0 = CUT.whiteout;
  const HIT = CUT.logoHit;
  // le voile de lumière est dissipé au moment du coup : le A tombe net, en pleine couleur
  const whiteHold = 1 - prog(t, W0, HIT + 0.02, ease.soft);
  const zoom = mix(1, 1.035, prog(t, W0, TOTAL, ease.soft));

  // tracé du plan (contours or) et chemins, puis le A qui tombe sur le coup de la musique
  const outline = prog(t, W0 - 0.05, HIT + 0.25, ease.inOut);
  const outlineFade = 1 - prog(t, HIT + 0.25, HIT + 0.55);
  const roads = prog(t, HIT - 0.05, HIT + 0.45, ease.inOut);
  const slam = prog(t, HIT, HIT + 0.38, ease.out);
  const aOn = prog(t, HIT - 0.01, HIT + 0.05);
  const leaf = prog(t, HIT + 0.15, HIT + 0.5, ease.out);
  const goldEdge = prog(t, HIT + 0.2, HIT + 0.55, ease.out);
  const word = prog(t, HIT + 0.55, HIT + 1.2, ease.out);
  const wordOutline = prog(t, W0, HIT + 0.6, ease.inOut);
  const doorLight = mix(1, 0.12, prog(t, HIT, HIT + 1.4, ease.soft));
  const sheen = prog(t, CUT.signature + 0.1, CUT.signature + 0.95, ease.inOut);

  // secousse caméra sur l'accord final, et plus légère sur la mention
  const shake = (hit: number, amp: number) => {
    const u = t - hit;
    return u < 0 ? 0 : amp * Math.exp(-u / 0.09) * Math.sin(u * 95);
  };
  const sy = shake(HIT, 4) + shake(CUT.signature, 1.2);
  const flash = t >= HIT ? Math.exp(-(t - HIT) / 0.18) : 0;

  const line = prog(t, CUT.taglineHit - 0.35, CUT.taglineHit + 0.25, ease.out);
  const sub = prog(t, CUT.signature, CUT.signature + 0.6, ease.out);

  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 65% 60% at 50% 42%, #ffffff, ${C.ivory} 58%, #efeadf)`, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom}) translateY(${sy}px)`}}>
        {/* éclair de lumière derrière le A à l'impact */}
        <div
          style={{
            position: 'absolute',
            left: (1920 - LOGO_W) / 2 + 225 * K - 500,
            top: LOGO_TOP + 215 * K - 500,
            width: 1000,
            height: 1000,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,207,159,0.55), rgba(232,207,159,0) 65%)',
            opacity: flash,
          }}
        />
        <svg
          viewBox={`0 0 ${logo.meta.width} ${logo.meta.height}`}
          width={LOGO_W}
          height={LOGO_H}
          style={{position: 'absolute', left: (1920 - LOGO_W) / 2, top: LOGO_TOP, overflow: 'visible'}}
        >
          <defs>
            <clipPath id="roads">
              <polygon points={ROADS} />
            </clipPath>
            <clipPath id="aRegion">
              <path d={A_REGION} />
            </clipPath>
            <linearGradient id="roadWipe" gradientUnits="userSpaceOnUse" x1="0" y1="425" x2="276" y2="294">
              <stop offset={mix(-0.1, 1, roads)} stopColor="#fff" />
              <stop offset={mix(-0.02, 1.08, roads)} stopColor="#000" />
            </linearGradient>
            <mask id="roadMask" maskUnits="userSpaceOnUse" x="0" y="0" width="1480" height="425">
              <rect width="1480" height="425" fill="url(#roadWipe)" />
            </mask>
            <linearGradient id="wordWipe" gradientUnits="userSpaceOnUse" x1="440" y1="0" x2="1480" y2="0">
              <stop offset={mix(-0.08, 1, word)} stopColor="#fff" />
              <stop offset={mix(0, 1.08, word)} stopColor="#000" />
            </linearGradient>
            <mask id="wordMask" maskUnits="userSpaceOnUse" x="0" y="-50" width="1600" height="525">
              <rect x="0" y="-50" width="1600" height="525" fill="url(#wordWipe)" />
            </mask>
            <radialGradient id="doorGlow" cx="0.5" cy="0.55" r="0.75">
              <stop offset="0" stopColor="#fffdf6" />
              <stop offset="0.6" stopColor={C.goldLight} />
              <stop offset="1" stopColor={C.gold} />
            </radialGradient>
            <linearGradient id="sheen" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="260" y2="80" gradientTransform={`translate(${mix(-500, 1700, sheen)} 0)`}>
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.38" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <filter id="slamBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation={(1 - slam) * 7} />
            </filter>
          </defs>

          {/* la lumière du tunnel devient la porte du logo */}
          <polygon points={DOOR} fill="url(#doorGlow)" opacity={doorLight} />

          {/* le plan : contours or tracés au trait */}
          <g fill="none" stroke={C.gold} strokeWidth={1.4} opacity={outlineFade}>
            <path d={L.navyMark} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - outline} />
            <path d={L.greenMark} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - outline} />
          </g>
          <path d={L.word} fill="none" stroke={C.gold} strokeWidth={1.2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - wordOutline} opacity={1 - word} />

          {/* les deux chemins qui mènent à la porte */}
          <g clipPath="url(#roads)" mask="url(#roadMask)">
            <path d={L.navyMark} fill={C.navy} />
            <path d={L.greenMark} fill={C.green} />
          </g>

          {/* le A tombe sur l'impact */}
          <g clipPath="url(#aRegion)">
            <g
              opacity={aOn}
              filter={slam < 1 ? 'url(#slamBlur)' : undefined}
              transform={`translate(220 335) scale(${mix(1.12, 1, slam)}) translate(-220 -335)`}
            >
              <path d={L.navyMark} fill={C.navy} />
            </g>
            {/* battant vert de la porte qui s'ouvre */}
            <g transform={`translate(261 0) scale(${leaf} 1) translate(-261 0)`}>
              <path d={L.greenMark} fill={C.green} />
            </g>
            <path d={L.gold} fill={C.gold} opacity={goldEdge} />
          </g>

          {/* le nom */}
          <g mask="url(#wordMask)" transform={`translate(${(1 - word) * 26} 0)`}>
            <path d={L.word} fill={C.navy} />
          </g>

          {/* reflet satiné final */}
          {sheen > 0 && sheen < 1 ? (
            <g>
              <path d={L.navyMark} fill="url(#sheen)" />
              <path d={L.word} fill="url(#sheen)" />
            </g>
          ) : null}
        </svg>

        {/* filet or + signature */}
        <div
          style={{
            position: 'absolute',
            left: 960 - 330 * line,
            top: LOGO_TOP + LOGO_H + 70,
            width: 660 * line,
            height: 1.5,
            background: `linear-gradient(90deg, rgba(201,165,106,0), ${C.gold} 20%, ${C.gold} 80%, rgba(201,165,106,0))`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: LOGO_TOP + LOGO_H + 104,
            textAlign: 'center',
            fontFamily,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: '0.26em',
            color: C.navy,
          }}
        >
          <Words text="COMPRENDRE LA RÈGLE." start={CUT.taglineHit} t={t} />
          <Words text="SÉCURISER LA PRATIQUE." start={CUT.tagline2} t={t} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: LOGO_TOP + LOGO_H + 164,
            textAlign: 'center',
            fontFamily,
            fontWeight: 500,
            fontSize: 17,
            letterSpacing: '0.46em',
            color: C.green,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 10}px)`,
          }}
        >
          FORMATION PROFESSIONNELLE IMMOBILIÈRE
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#fffdf8', opacity: whiteHold}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 80% at 50% 45%, rgba(0,0,0,0) 60%, rgba(60,45,20,0.10))'}} />
    </AbsoluteFill>
  );
};
