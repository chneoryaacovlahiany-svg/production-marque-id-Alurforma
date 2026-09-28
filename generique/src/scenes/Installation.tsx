import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../brand';
import {Glass} from '../components/Glass';
import {Plate} from '../components/Plate';
import {CUT, FPS, ease, mix, prog} from '../timing';

/**
 * 2,51 → 5,94 s — L'installation.
 * Les panneaux de verre entrent sur les pulsations (langage de la référence 001941),
 * chacun est une fenêtre réfractée sur l'image principale. Puis ils pivotent comme
 * des volets et libèrent l'image en plein cadre, pile sur la coupe de 5,94 s.
 */
type P = {
  t: number;
  x: number;
  y: number;
  w: number;
  h: number;
  ry: number;
  z: number;
  from: [number, number, number, number]; // dx, dy, dz, drotY
  tint: 'green' | 'navy' | 'clear';
  exitSide: 1 | -1;
  label: string;
};

const PANELS: P[] = [
  {t: 2.51, x: 200, y: 330, w: 540, h: 660, ry: 26, z: 0, from: [1500, 0, -500, -60], tint: 'green', exitSide: -1, label: 'DÉONTOLOGIE'},
  {t: 2.8, x: 1060, y: 80, w: 470, h: 920, ry: -22, z: -120, from: [-1500, 0, -400, 70], tint: 'navy', exitSide: 1, label: 'NON-\nDISCRIMINATION'},
  {t: 3.09, x: 1590, y: 220, w: 360, h: 680, ry: -36, z: -320, from: [0, 1100, -200, -30], tint: 'clear', exitSide: 1, label: 'ANTI-\nBLANCHIMENT'},
  {t: 3.37, x: 130, y: -70, w: 470, h: 270, ry: 18, z: -400, from: [-1400, -300, -300, 40], tint: 'navy', exitSide: -1, label: 'GESTION\nLOCATIVE'},
  {t: 3.65, x: 700, y: -20, w: 420, h: 330, ry: 6, z: -900, from: [0, -1400, -300, 0], tint: 'clear', exitSide: -1, label: 'TRANSACTION'},
  {t: 3.94, x: 690, y: 790, w: 440, h: 300, ry: -6, z: -900, from: [0, 1400, -300, 0], tint: 'green', exitSide: 1, label: 'DPE &\nÉNERGIE'},
  {t: 4.23, x: 1720, y: -70, w: 440, h: 200, ry: -20, z: -520, from: [1400, -300, -300, -40], tint: 'clear', exitSide: 1, label: 'FISCALITÉ'},
  {t: 4.52, x: 760, y: 360, w: 300, h: 380, ry: 0, z: -1500, from: [0, 0, -2600, 0], tint: 'navy', exitSide: 1, label: 'COPRO-\nPRIÉTÉ'},
];

export const Installation: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < CUT.installation || t >= CUT.hero) return null;
  const local = t - CUT.installation;
  const release = prog(t, CUT.hero - 0.34, CUT.hero, ease.in); // ouverture des volets
  const truck = local * -70; // travelling latéral continu
  const bgReveal = prog(t, CUT.hero - 0.4, CUT.hero, ease.inOut);
  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
      {/* l'image principale, en fond, se dévoile à mesure que les volets s'ouvrent */}
      <Plate
        filter={`brightness(${mix(0.26, 1, bgReveal)}) blur(${mix(12, 0, bgReveal)}px) saturate(${mix(0.8, 1, bgReveal)})`}
        style={{transform: `scale(${mix(1.08, 1, bgReveal)})`}}
      />
      <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: '50% 45%'}}>
        <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `rotateY(${mix(3, -4, local / (CUT.hero - CUT.installation))}deg)`}}>
          {PANELS.map((p, i) => {
            const e = prog(t, p.t, p.t + 0.36, ease.out);
            if (e <= 0) return null;
            const [dx, dy, dz, dr] = p.from;
            const tx = dx * (1 - e) + truck * (1 - p.z / 1400);
            const ty = dy * (1 - e);
            const tz = p.z + dz * (1 - e) + release * 380;
            const ry = p.ry + dr * (1 - e) + release * 84 * p.exitSide;
            const sheen = mix(-0.2, 0.9, prog(t, p.t, p.t + 1.2, ease.soft)) + release * 0.6;
            return (
              <Glass
                key={i}
                x={p.x}
                y={p.y}
                w={p.w}
                h={p.h}
                tint={p.tint}
                sheen={sheen}
                refract={[ry * 1.6, 0]}
                opacity={1 - prog(t, CUT.hero - 0.12, CUT.hero)}
                transform={`translate3d(${tx}px, ${ty}px, ${tz}px) rotateY(${ry}deg)`}
                label={p.label}
                labelIn={prog(t, p.t + 0.12, p.t + 0.5, ease.out)}
              />
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
