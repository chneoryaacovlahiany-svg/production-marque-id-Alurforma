import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../brand';
import {Plate} from '../components/Plate';
import {CUT, FPS, H, W, ease, mix, prog} from '../timing';

/**
 * 0 → 2,49 s — L'ouverture.
 * Noir. Sur chaque pulsation, un filet de lumière or tombe puis s'ouvre en fenêtre :
 * à travers, l'image principale. La première fenêtre s'ouvre pile sur le filet de
 * lumière de la porte : le sujet est là dès la première seconde.
 */
const SLITS = [
  {t: 0.07, x: 960, w: 250, top: 0, h: H, drift: -6},
  {t: 0.64, x: 560, w: 170, top: 150, h: 780, drift: 14},
  {t: 1.33, x: 1370, w: 200, top: 90, h: 900, drift: -18},
  {t: 1.92, x: 250, w: 130, top: 230, h: 620, drift: 22},
  {t: 1.92 + 0.14, x: 1690, w: 120, top: 260, h: 560, drift: -26},
];

export const Ouverture: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t >= CUT.installation) return null;
  // léger travelling avant sur toute la séquence, puis coup de fouet latéral avant la coupe
  const push = mix(1, 1.07, prog(t, 0, CUT.installation, ease.soft));
  const whip = prog(t, CUT.installation - 0.2, CUT.installation, ease.in);
  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${push}) translateX(${-whip * 520}px)`, filter: whip ? `blur(${whip * 14}px)` : undefined}}>
        {SLITS.map((s, i) => {
          const line = prog(t, s.t, s.t + 0.18, ease.out);
          const open = prog(t, s.t + 0.06, s.t + 0.55, ease.out);
          if (line <= 0) return null;
          const cx = s.x + s.drift * (t - s.t);
          const w = s.w * open;
          const flash = 1 - prog(t, s.t, s.t + 0.35);
          const lineGlow = `0 0 10px rgba(232,207,159,${0.6 + flash * 0.4}), 0 0 36px rgba(201,165,106,${0.25 + flash * 0.4})`;
          return (
            <div key={i}>
              {/* fenêtre sur l'image principale */}
              <div
                style={{
                  position: 'absolute',
                  left: cx - w / 2,
                  top: s.top + (s.h * (1 - line)) / 2,
                  width: w,
                  height: s.h * line,
                  overflow: 'hidden',
                }}
              >
                <Plate
                  filter={`brightness(${1 + flash * 0.5}) contrast(1.06)`}
                  style={{left: -(cx - w / 2) + (s.x - cx) * 0.5, top: -(s.top + (s.h * (1 - line)) / 2)}}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, rgba(11,143,99,0.18), rgba(4,29,75,0) 30%, rgba(4,29,75,0) 70%, rgba(127,216,181,0.14))',
                  }}
                />
              </div>
              {/* arêtes lumineuses */}
              {[-1, 1].map((side) => (
                <div
                  key={side}
                  style={{
                    position: 'absolute',
                    left: cx + (side * w) / 2 - 1,
                    top: s.top + (s.h * (1 - line)) / 2,
                    width: 2,
                    height: s.h * line,
                    background: C.goldLight,
                    opacity: mix(1, 0.45, open),
                    boxShadow: lineGlow,
                  }}
                />
              ))}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
