import {C} from '../brand';
import {fontFamily} from '../font';
import {H, W} from '../timing';
import {Plate} from './Plate';

type Props = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** transformation 3D appliquée au panneau (après placement) */
  transform?: string;
  /** position 0→1 du reflet spéculaire qui balaie la vitre */
  sheen?: number;
  /** décalage de l'image vue à travers le verre : fausse réfraction */
  refract?: [number, number];
  tint?: 'green' | 'navy' | 'clear';
  opacity?: number;
  blur?: number;
  plateFilter?: string;
  showPlate?: boolean;
  /** thème de formation gravé sur la vitre */
  label?: string;
  /** apparition 0→1 de l'étiquette */
  labelIn?: number;
};

/**
 * Panneau de verre architectural : on voit l'image principale à travers, légèrement réfractée,
 * avec une épaisseur de tranche teintée, un liseré or et un reflet spéculaire qui balaie la surface.
 */
export const Glass: React.FC<Props> = ({
  x,
  y,
  w,
  h,
  transform = '',
  sheen = 0.5,
  refract = [0, 0],
  tint = 'green',
  opacity = 1,
  blur = 0,
  plateFilter = 'brightness(1.08) contrast(1.05) saturate(1.05)',
  showPlate = true,
  label,
  labelIn = 1,
}) => {
  const edge = tint === 'green' ? C.greenSoft : tint === 'navy' ? '#8fb2ff' : '#ffffff';
  const body =
    tint === 'green'
      ? 'linear-gradient(135deg, rgba(11,143,99,0.26), rgba(4,29,75,0.10) 48%, rgba(127,216,181,0.10))'
      : tint === 'navy'
        ? 'linear-gradient(135deg, rgba(18,58,126,0.30), rgba(4,29,75,0.12) 50%, rgba(143,178,255,0.08))'
        : 'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.08))';
  const sp = -60 + sheen * 220;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transform,
        transformOrigin: '50% 50%',
        overflow: 'hidden',
        opacity,
        filter: blur ? `blur(${blur}px)` : undefined,
        boxShadow: `0 50px 140px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.22)`,
        backfaceVisibility: 'hidden',
      }}
    >
      {showPlate ? (
        <Plate
          filter={plateFilter}
          style={{
            left: -x + refract[0],
            top: -y + refract[1],
            width: W,
            height: H,
            transform: 'scale(1.04)',
          }}
        />
      ) : null}
      <div style={{position: 'absolute', inset: 0, background: body}} />
      {/* tranche du verre (épaisseur) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 16,
          background: `linear-gradient(90deg, ${edge}88, ${edge}00)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: `linear-gradient(270deg, rgba(255,255,255,0.35), rgba(255,255,255,0))`,
        }}
      />
      {/* liseré or */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 1.5, background: C.gold, opacity: 0.85}} />
      {label ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            transform: `translateY(-50%) translateX(${(1 - labelIn) * 24}px)`,
            textAlign: 'center',
            fontFamily,
            fontWeight: 600,
            // taille calée sur la ligne la plus longue, espacement compris (≈ 0,95 em par lettre)
            fontSize: Math.min(54, (w * 0.8) / (Math.max(...label.split('\n').map((l) => l.length)) * 0.95)),
            lineHeight: 1.15,
            letterSpacing: '0.14em',
            color: '#ffffff',
            opacity: labelIn,
            textShadow: `0 0 24px ${edge}aa, 0 2px 12px rgba(0,0,0,0.6)`,
            whiteSpace: 'pre',
          }}
        >
          {label}
          <div style={{margin: '14px auto 0', width: 60 * labelIn, height: 1.5, background: C.gold}} />
        </div>
      ) : null}
      {/* reflet spéculaire */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(105deg, rgba(255,255,255,0) ${sp - 18}%, rgba(255,255,255,0.20) ${sp}%, rgba(255,255,255,0.05) ${sp + 6}%, rgba(255,255,255,0) ${sp + 22}%)`,
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
};
