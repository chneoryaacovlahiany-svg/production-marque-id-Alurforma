import {CameraMotionBlur} from '@remotion/motion-blur';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../brand';
import {Plate} from '../components/Plate';
import {fontFamily} from '../font';
import {CUT, FPS, ease, mix, prog} from '../timing';
import {pulse} from './Hero';

/**
 * 7,31 → 9,80 s — Accélération puis convergence.
 * On file dans un couloir de portiques de verre, l'image principale au bout (la porte).
 * La vitesse monte avec la tension. Puis trois filets or se referment sur l'encadrement
 * de la porte, la lumière de la porte envahit la pièce juste avant le premier coup grave.
 */
const SPACING = 820;
const COUNT = 16;
const ORIGIN: [number, number] = [960, 515]; // centre de la porte dans l'image
const DOOR = {x0: 827, y0: 70, x1: 1094, y1: 960}; // encadrement de la porte ouverte

const camZ = (t: number) => {
  const u = Math.max(0, t - CUT.tunnel);
  return 900 * u + 950 * u * u;
};

const plateScale = (t: number) =>
  t < CUT.convergence
    ? mix(1.1, 1.42, prog(t, CUT.tunnel, CUT.convergence, ease.soft))
    : mix(1.42, 7.5, prog(t, CUT.convergence, CUT.whiteout, (x) => Math.pow(x, 2.6)));

const Portals: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const z0 = camZ(t);
  const flash = pulse(t, CUT.tunnel, CUT.whiteout, 0.14);
  return (
    <AbsoluteFill style={{perspective: 1100, perspectiveOrigin: '50% 47%'}}>
      <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `rotateZ(${Math.sin((t - CUT.tunnel) * 1.4) * 1.8}deg)`}}>
        {Array.from({length: COUNT}, (_, i) => {
          const z = -(i + 1) * SPACING + z0;
          if (z > 1000 || z < -8000) return null;
          const fade = prog(z, -8000, -4500) * (1 - prog(z, 500, 950));
          const tint = i % 2 === 0 ? 'rgba(11,143,99,' : 'rgba(18,58,126,';
          const glow = i % 2 === 0 ? C.greenSoft : '#8fb2ff';
          // parois de verre de part et d'autre : le couloir défile, la porte reste dégagée
          return [-1, 1].map((side) => {
            const x = side * (760 + (i % 3) * 60);
            const depth = 620;
            const hgt = 980 - (i % 2) * 120;
            return (
              <div
                key={`${i}-${side}`}
                style={{
                  position: 'absolute',
                  left: 960 - depth / 2,
                  top: 520 - hgt / 2,
                  width: depth,
                  height: hgt,
                  transform: `translate3d(${x}px, 0, ${z}px) rotateY(${side * 84}deg)`,
                  opacity: fade,
                  background: `linear-gradient(${side > 0 ? 90 : 270}deg, ${tint}0.50), rgba(255,255,255,0.10) 45%, ${tint}0.22))`,
                  boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.3), 0 0 ${16 + flash * 40}px ${glow}55`,
                }}
              >
                <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 2, background: C.goldLight, opacity: 0.6 + flash * 0.4}} />
                <div style={{position: 'absolute', top: 0, bottom: 0, left: side > 0 ? 0 : undefined, right: side > 0 ? undefined : 0, width: 2, background: C.goldLight, opacity: 0.5 + flash * 0.5, boxShadow: `0 0 14px ${C.gold}`}} />
              </div>
            );
          });
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Tunnel: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < CUT.tunnel || t >= CUT.whiteout + 0.04) return null;
  const s = plateScale(t);
  const toScreen = (x: number, y: number) => [ORIGIN[0] + (x - ORIGIN[0]) * s, ORIGIN[1] + (y - ORIGIN[1]) * s];
  const [dx0, dy0] = toScreen(DOOR.x0, DOOR.y0);
  const [dx1, dy1] = toScreen(DOOR.x1, DOOR.y1);
  const bloom = prog(t, CUT.convergence + 0.1, CUT.whiteout, ease.in);
  // la lumière de la porte envahit la pièce depuis le centre (pas de flash plein cadre)
  const pour = prog(t, CUT.whiteout - 0.55, CUT.whiteout, ease.in);
  const white = prog(t, CUT.whiteout - 0.55, CUT.whiteout - 0.35);
  const flash = pulse(t, CUT.tunnel, CUT.whiteout, 0.14);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Plate
        filter={`contrast(1.08) brightness(${0.86 + flash * 0.08 + bloom * 0.4})`}
        style={{transform: `scale(${s})`, transformOrigin: `${ORIGIN[0]}px ${ORIGIN[1]}px`}}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 70% 70% at 50% 47%, rgba(1,5,15,0) 40%, rgba(1,5,15,0.6))'}} />
      <CameraMotionBlur samples={6} shutterAngle={200}>
        <Portals />
      </CameraMotionBlur>
      {/* trois filets or se referment sur l'encadrement de la porte */}
      {[CUT.convergence, CUT.convergence + 0.18, CUT.convergence + 0.36].map((start, i) => {
        const e = prog(t, start, start + 0.4, ease.out);
        if (e <= 0) return null;
        const inset = 4 + i * 10;
        const x0 = mix(40, dx0 - inset, e);
        const y0 = mix(30, dy0 - inset, e);
        const x1 = mix(1880, dx1 + inset, e);
        const y1 = mix(1050, dy1 + inset, e);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x0,
              top: y0,
              width: x1 - x0,
              height: y1 - y0,
              border: `${2 - i * 0.4}px solid ${C.goldLight}`,
              boxShadow: `0 0 18px rgba(232,207,159,0.8)`,
              opacity: mix(0.2, 1, e) * (1 - white),
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 47%, rgba(255,250,240,${bloom}), rgba(255,236,200,${bloom * 0.6}) ${20 + bloom * 50}%, rgba(255,236,200,0) ${40 + bloom * 60}%)`,
          mixBlendMode: 'screen',
        }}
      />
      {/* ombre au sol derrière les arguments, pour qu'ils restent lisibles devant la lumière */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 55% 34% at 50% 100%, rgba(1,5,15,0.82), rgba(1,5,15,0.5) 55%, rgba(1,5,15,0) 100%)',
          opacity: prog(t, CUT.tunnel, CUT.tunnel + 0.3) * (1 - prog(t, CUT.whiteout - 0.6, CUT.whiteout - 0.3)),
        }}
      />
      <Methode t={t} />
      <AbsoluteFill
        style={{
          opacity: white,
          background: `radial-gradient(circle at 50% 47%, ${C.ivory} 0%, ${C.ivory} ${pour * 110}%, rgba(250,248,243,0) ${pour * 110 + 35}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Le « comment » : les trois arguments s'empilent sur les demi-temps et restent à l'écran
 * ensemble jusqu'à la plongée dans la lumière (lisibles sans défilement).
 */
const WORDS: {word: string; at: number}[] = [
  {word: '14 H PAR AN', at: 7.31},
  {word: '100 % EN LIGNE', at: 7.63},
  {word: 'À VOTRE RYTHME', at: 7.96},
];

const Methode: React.FC<{t: number}> = ({t}) => {
  const end = CUT.whiteout - 0.3;
  const out = prog(t, end - 0.3, end, ease.in);
  const eyebrow = prog(t, CUT.tunnel, CUT.tunnel + 0.4, ease.out);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center', fontFamily, opacity: 1 - out, filter: out ? `blur(${out * 8}px)` : undefined}}>
      <div style={{fontSize: 22, fontWeight: 600, letterSpacing: '0.4em', color: C.goldLight, opacity: eyebrow, marginBottom: 16, textShadow: '0 0 12px rgba(1,5,15,1), 0 2px 24px rgba(1,5,15,1)'}}>
        VOTRE FORMATION OBLIGATOIRE
      </div>
      {WORDS.map((w) => {
        const e = prog(t, w.at, w.at + 0.28, ease.out);
        return (
          <div
            key={w.word}
            style={{
              fontSize: 68,
              fontWeight: 600,
              lineHeight: 1.18,
              letterSpacing: `${0.26 - e * 0.1}em`,
              color: '#ffffff',
              opacity: e,
              transform: `translateY(${(1 - e) * 18}px) scale(${1.08 - e * 0.08})`,
              filter: `blur(${(1 - e) * 8}px)`,
              textShadow: `0 0 36px rgba(143,178,255,0.45), 0 4px 28px rgba(1,5,15,0.95)`,
            }}
          >
            {w.word}
          </div>
        );
      })}
    </div>
  );
};
