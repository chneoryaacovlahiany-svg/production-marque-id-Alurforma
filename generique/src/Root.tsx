import {Composition} from 'remotion';
import {Generique} from './Generique';
import {FPS, H, TOTAL_FRAMES, W} from './timing';

export const Root: React.FC = () => (
  <Composition id="Generique" component={Generique} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
);
