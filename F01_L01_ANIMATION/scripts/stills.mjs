// QA helper: bundle once, render several frames of a composition as JPEGs.
// Usage: node scripts/stills.mjs <compositionId> <outDir> <frame> [frame...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "fs";
import path from "path";

const [id, outDir, ...frames] = process.argv.slice(2);
const PW = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browserExecutable = fs.existsSync(PW) ? PW : undefined;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
fs.mkdirSync(outDir, { recursive: true });
for (const f of frames.map(Number)) {
  const output = path.join(outDir, `${id}_${String(f).padStart(5, "0")}.jpeg`);
  await renderStill({ serveUrl, composition, frame: f, output, imageFormat: "jpeg", jpegQuality: 85, browserExecutable });
  console.log(output);
}
