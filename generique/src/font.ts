import {continueRender, delayRender, staticFile} from 'remotion';

/** Inter (police du site), embarquée localement : le rendu ne dépend pas du réseau. */
export const fontFamily = 'InterAlurforma';

if (typeof document !== 'undefined') {
  const handle = delayRender('Chargement de la police Inter');
  const face = new FontFace(fontFamily, `url(${staticFile('inter-latin.woff2')}) format('woff2')`, {weight: '100 900'});
  face
    .load()
    .then((f) => {
      document.fonts.add(f);
      continueRender(handle);
    })
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}
