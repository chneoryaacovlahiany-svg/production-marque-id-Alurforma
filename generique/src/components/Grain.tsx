import {AbsoluteFill, useCurrentFrame} from 'remotion';

/** Grain pellicule animé + vignettage : casse l'aspect « image de synthèse ». */
export const Grain: React.FC<{opacity?: number; vignette?: number}> = ({opacity = 0.07, vignette = 0.55}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {vignette > 0 ? (
        <AbsoluteFill
          style={{background: `radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,${vignette}) 100%)`}}
        />
      ) : null}
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity, mixBlendMode: 'overlay'}}>
        <filter id={`grain-${f}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 97} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${f})`} />
      </svg>
    </AbsoluteFill>
  );
};
