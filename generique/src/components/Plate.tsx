import {Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FPS, H, W} from '../timing';

/**
 * Image principale : le couloir et la porte de la marque (générique V26 en 1080p, fluidifié à 50 i/s
 * et jouée à demi-vitesse). Avant T0 on tient la première image (porte presque fermée,
 * un simple filet de lumière), après la fin on tient la dernière (porte grande ouverte).
 */
const T0 = 6.28; // la porte finit de s'ouvrir juste avant la plongée dans la lumière
const RATE = 0.5;
const SRC_DUR = 4.36;
export const PLATE_END = T0 + SRC_DUR / RATE;

export const Plate: React.FC<{style?: React.CSSProperties; filter?: string}> = ({style, filter}) => {
  const t = useCurrentFrame() / FPS;
  const media: React.CSSProperties = {width: W, height: H, display: 'block', filter};
  let content: React.ReactNode;
  if (t < T0) content = <Img src={staticFile('hero-first.jpg')} style={media} />;
  else if (t >= PLATE_END) content = <Img src={staticFile('hero-last.jpg')} style={media} />;
  else
    content = (
      <Sequence from={Math.round(T0 * FPS)} layout="none">
        <OffthreadVideo src={staticFile('porte-hero-50fps.mp4')} playbackRate={RATE} muted style={media} />
      </Sequence>
    );
  return <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, ...style}}>{content}</div>;
};
