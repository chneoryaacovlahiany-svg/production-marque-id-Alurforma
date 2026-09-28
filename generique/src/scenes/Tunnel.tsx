import {CameraMotionBlur} from '@remotion/motion-blur';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../brand';
import {Plate} from '../components/Plate';
import {fontFamily} from '../font';
import {CUT, FPS, ease, mix, prog} from '../timing';
import {pulse} from './Hero';

/**
 * 9,40 → 12,55 s — Accélération puis convergence, pendant le break de la musique.
 * On file dans un couloir de portiques de verre, l'image principale au bout (la porte).
 * La vitesse monte avec la tension. Puis trois filets or se referment sur l'encadrement
 * de la porte, la lumière de la porte envahit la pièce juste avant le coup.
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

/** Le « comment », frappé sur les pulsations, en bas du cadre (sur le sol sombre). */
const WORDS: {word: string; at: number}[] = [
  {word: '14 H PAR AN', at: 9.45},
  {word: '100 % EN LIGNE', at: 10.52},
  {word: 'À VOTRE RYTHME', at: 11.68},
];

const Methode: React.FC<{t: number}> = ({t}) => {
  const end = CUT.whiteout - 0.3;
  const eyebrow = prog(t, CUT.tunnel + 0.1, CUT.tunnel + 0.5, ease.out) * (1 - prog(t, end - 0.25, end));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 56, textAlign: 'center', fontFamily}}>
      <div style={{position: 'relative', height: 120}}>
        {WORDS.map((w, i) => {
          const next = WORDS[i + 1]?.at ?? end;
          const e = prog(t, w.at, w.at + 0.22, ease.out);
          // le mot sort juste avant la pulsation suivante : pas de chevauchement entre deux mots
          const out = prog(t, next - 0.14, next - 0.02, ease.in);
          if (e <= 0 || out >= 1) return null;
          return (
            <div
              key={w.word}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                fontSize: 100,
                fontWeight: 600,
                letterSpacing: `${0.3 - e * 0.12}em`,
                color: '#ffffff',
                opacity: e * (1 - out),
                transform: `scale(${1.18 - e * 0.18 + out * 0.08})`,
                filter: `blur(${(1 - e) * 10 + out * 8}px)`,
                textShadow: `0 0 40px rgba(143,178,255,0.45), 0 4px 30px rgba(1,5,15,0.9)`,
              }}
            >
              {w.word}
            </div>
          );
        })}
      </div>
      <div style={{fontSize: 24, fontWeight: 600, letterSpacing: '0.4em', color: C.goldLight, opacity: eyebrow, marginTop: 14, textShadow: '0 0 12px rgba(1,5,15,1), 0 2px 24px rgba(1,5,15,1)'}}>
        VOTRE FORMATION OBLIGATOIRE
      </div>
    </div>
  );
};
