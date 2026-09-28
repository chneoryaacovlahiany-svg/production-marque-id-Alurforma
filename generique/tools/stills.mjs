// Rendu d'images de contrôle : node tools/stills.mjs out/dir 5 30 55 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const [outDir, ...frames] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Generique', browserExecutable});
for (const f of frames) {
  await renderStill({composition, serveUrl, frame: Number(f), output: `${outDir}/f${String(f).padStart(3, '0')}.jpg`, imageFormat: 'jpeg', jpegQuality: 85, browserExecutable});
  console.log('ok', f);
}
