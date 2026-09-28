import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../brand';
import {fontFamily} from '../font';
import logo from '../logo-paths.json';
import {CUT, FPS, ease, mix, prog} from '../timing';

/**
 * 10,6 → 14 s — La révélation.
 * La lumière de la porte devient la porte du logo. Le logo se construit comme un bâtiment :
 * tracé or (le plan), les deux chemins qui mènent à la porte, puis le « A » tombe sur le
 * premier impact grave (11,0 s), la porte s'ouvre, le nom se dévoile ; la signature
 * arrive sur le second impact (11,6 s).
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

  const whiteHold = 1 - prog(t, CUT.whiteout, CUT.whiteout + 0.35, ease.soft);
  const zoom = mix(1, 1.035, prog(t, CUT.whiteout, 14, ease.soft));

  // tracé du plan (contours or), puis chemins, puis le A qui tombe sur l'impact
  const outline = prog(t, CUT.whiteout, CUT.logoHit, ease.inOut);
  const outlineFade = 1 - prog(t, CUT.logoHit, CUT.logoHit + 0.3);
  const roads = prog(t, CUT.whiteout + 0.05, CUT.logoHit + 0.02, ease.inOut);
  const slam = prog(t, CUT.logoHit, CUT.logoHit + 0.38, ease.out);
  const aOn = prog(t, CUT.logoHit - 0.01, CUT.logoHit + 0.05);
  const leaf = prog(t, CUT.logoHit + 0.06, CUT.logoHit + 0.42, ease.out);
  const goldEdge = prog(t, CUT.logoHit + 0.12, CUT.logoHit + 0.45, ease.out);
  const word = prog(t, 11.08, 11.5, ease.out);
  const wordOutline = prog(t, CUT.whiteout + 0.1, 11.1, ease.inOut);
  const doorLight = mix(1, 0.12, prog(t, CUT.logoHit, CUT.taglineHit + 0.2, ease.soft));
  const sheen = prog(t, 12.55, 13.35, ease.inOut);

  // secousse caméra sur les deux impacts graves
  const shake = (hit: number, amp: number) => {
    const u = t - hit;
    return u < 0 ? 0 : amp * Math.exp(-u / 0.09) * Math.sin(u * 95);
  };
  const sy = shake(CUT.logoHit, 4) + shake(CUT.taglineHit, 1.6);
  const flash = t >= CUT.logoHit ? Math.exp(-(t - CUT.logoHit) / 0.18) : 0;

  const line = prog(t, 11.42, 11.95, ease.out);
  const sub = prog(t, 12.2, 12.8, ease.out);

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
          <Words text="SÉCURISER LA PRATIQUE." start={CUT.taglineHit + 0.29} t={t} />
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
