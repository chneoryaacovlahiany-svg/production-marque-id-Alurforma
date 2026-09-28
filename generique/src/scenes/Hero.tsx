import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../brand';
import {Glass} from '../components/Glass';
import {fontFamily} from '../font';
import {Plate} from '../components/Plate';
import {BEATS, CUT, FPS, W, ease, mix, prog} from '../timing';

/**
 * 4,71 → 7,31 s — L'image principale.
 * Plein cadre, lente poussée vers la porte. Le verre ne fait que passer au premier plan,
 * en reflets : il accompagne l'image, il ne la cache jamais.
 */
export const pulse = (t: number, from: number, to: number, decay = 0.16) =>
  BEATS.filter((b) => b >= from && b <= to && t >= b).reduce((m, b) => Math.max(m, Math.exp(-(t - b) / decay)), 0);

export const Hero: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < CUT.hero || t >= CUT.tunnel) return null;
  const p = prog(t, CUT.hero, CUT.tunnel, ease.inOut);
  const scale = mix(1, 1.1, p);
  const beat = pulse(t, CUT.hero, CUT.tunnel);
  // deux dalles de verre traversent le premier plan, très lentement
  const slabA = mix(-900, W + 200, prog(t, CUT.hero - 0.2, CUT.tunnel + 0.4));
  const slabB = mix(W + 300, -800, prog(t, CUT.hero + 0.5, CUT.tunnel + 0.6));
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Plate
        filter={`contrast(1.06) saturate(1.06) brightness(${1 + beat * 0.07})`}
        style={{transform: `scale(${scale}) translateX(${mix(8, -8, p)}px)`, transformOrigin: '50% 47%'}}
      />
      {/* halo de la porte, qui respire sur les pulsations */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 18% 42% at 50% 48%, rgba(255,236,200,${0.1 + beat * 0.18}), rgba(255,236,200,0) 70%)`,
          mixBlendMode: 'screen',
        }}
      />
      {/* filet anamorphique horizontal */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '48%',
          height: 2,
          background: 'linear-gradient(90deg, rgba(143,178,255,0), rgba(190,210,255,0.55) 50%, rgba(143,178,255,0))',
          opacity: 0.25 + beat * 0.5,
          filter: 'blur(1.5px)',
          mixBlendMode: 'screen',
        }}
      />
      <Glass x={slabA} y={-120} w={560} h={1340} tint="clear" sheen={p * 1.4} refract={[-26, 0]} opacity={0.38} blur={1.2} transform="rotate(7deg)" />
      <Glass x={slabB} y={-160} w={380} h={1400} tint="green" sheen={1 - p} refract={[30, 0]} opacity={0.28} blur={2.2} transform="rotate(-5deg)" />
      {/* étalonnage : ombres bleu nuit, hautes lumières chaudes */}
      <AbsoluteFill
        style={{background: 'linear-gradient(180deg, rgba(4,29,75,0.35), rgba(4,29,75,0) 30%, rgba(4,29,75,0) 60%, rgba(1,5,15,0.78))'}}
      />
      {/* l'accroche du site, en deux temps sur les pulsations */}
      <Accroche t={t} />
    </AbsoluteFill>
  );
};

const Line: React.FC<{t: number; start: number; children: React.ReactNode; style: React.CSSProperties}> = ({t, start, children, style}) => {
  const e = prog(t, start, start + 0.45, ease.out);
  const out = prog(t, CUT.tunnel - 0.22, CUT.tunnel, ease.in);
  return (
    <div
      style={{
        opacity: e * (1 - out),
        transform: `translateY(${(1 - e) * 22 - out * 10}px)`,
        filter: `blur(${(1 - e) * 6 + out * 6}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Accroche: React.FC<{t: number}> = ({t}) => {
  const rule = prog(t, CUT.hero + 0.05, CUT.hero + 0.6, ease.out) * (1 - prog(t, CUT.tunnel - 0.22, CUT.tunnel));
  return (
    <div style={{position: 'absolute', left: 150, bottom: 150, fontFamily, textShadow: '0 2px 24px rgba(1,5,15,0.7)'}}>
      <div style={{width: 90 * rule, height: 2, background: C.gold, marginBottom: 22}} />
      <Line t={t} start={CUT.hero} style={{fontSize: 20, fontWeight: 600, letterSpacing: '0.42em', color: C.goldLight, marginBottom: 20}}>
        FORMATIONS ALUR EN LIGNE
      </Line>
      <Line t={t} start={CUT.hero + 0.18} style={{fontSize: 60, fontWeight: 600, letterSpacing: '-0.01em', color: '#ffffff', lineHeight: 1.1}}>
        Renouvelez votre carte professionnelle
      </Line>
      <Line t={t} start={5.36} style={{fontSize: 60, fontWeight: 600, letterSpacing: '-0.01em', color: C.goldLight, lineHeight: 1.1}}>
        sans perdre de temps.
      </Line>
    </div>
  );
};
