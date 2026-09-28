import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../brand';
import {Glass} from '../components/Glass';
import {Plate} from '../components/Plate';
import {CUT, FPS, ease, mix, prog} from '../timing';

/**
 * 2,49 → 4,78 s — L'installation.
 * Les panneaux de verre entrent sur les pulsations (langage de la référence 001941),
 * chacun est une fenêtre réfractée sur l'image principale. Puis ils pivotent comme
 * des volets et libèrent l'image en plein cadre, pile sur la coupe de 4,78 s.
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
};

const PANELS: P[] = [
  {t: 2.49, x: 250, y: 150, w: 540, h: 800, ry: 26, z: 0, from: [1500, 0, -500, -60], tint: 'green', exitSide: -1},
  {t: 2.78, x: 1010, y: 80, w: 470, h: 920, ry: -22, z: -120, from: [-1500, 0, -400, 70], tint: 'navy', exitSide: 1},
  {t: 3.06, x: 1480, y: 200, w: 380, h: 700, ry: -36, z: -320, from: [0, 1100, -200, -30], tint: 'clear', exitSide: 1},
  {t: 3.63, x: -40, y: 260, w: 330, h: 560, ry: 40, z: -520, from: [0, -1200, -300, 40], tint: 'navy', exitSide: -1},
  {t: 4.2, x: 700, y: 330, w: 420, h: 520, ry: 8, z: -700, from: [0, 0, -2600, 0], tint: 'green', exitSide: 1},
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
        <AbsoluteFill style={{transformStyle: 'preserve-3d', transform: `rotateY(${mix(3, -4, local / 2.3)}deg)`}}>
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
              />
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
