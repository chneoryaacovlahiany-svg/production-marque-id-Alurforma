import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from './components/Grain';
import {Hero} from './scenes/Hero';
import {Installation} from './scenes/Installation';
import {Ouverture} from './scenes/Ouverture';
import {Revelation} from './scenes/Revelation';
import {Tunnel} from './scenes/Tunnel';
import {CUT, FPS} from './timing';

/**
 * Générique Alurforma — « Le Seuil ».
 * Les deux chemins du logo (la règle, la pratique) mènent à la porte (le métier).
 * Chaque scène décide elle-même de sa présence à partir du temps global.
 */
export const Generique: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const dark = t < CUT.whiteout;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Ouverture />
      <Installation />
      <Hero />
      <Tunnel />
      <Revelation />
      <Grain opacity={dark ? 0.08 : 0.04} vignette={dark ? 0.5 : 0} />
      <Audio src={staticFile('mix-web.wav')} />
    </AbsoluteFill>
  );
};
