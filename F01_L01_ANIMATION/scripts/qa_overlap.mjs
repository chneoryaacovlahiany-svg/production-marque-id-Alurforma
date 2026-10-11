// Layout QA: render the lesson twice at low resolution — characters only, overlays only — as black
// silhouettes, then scripts/qa_overlap.py measures how much of the characters the overlays cover.
// Usage: node scripts/qa_overlap.mjs <outDir> [stepSeconds=0.5] [fromSec=0] [toSec=392]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "fs";
import path from "path";

const [outDir, step = "0.5", from = "0", to = "392"] = process.argv.slice(2);
const PW = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browserExecutable = fs.existsSync(PW) ? PW : undefined;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const scenes = JSON.parse(fs.readFileSync("src/data/scenes.json", "utf8"));
const LESSON_START = Math.round(17.13 * 30) + 6 * 30;
const AD = Math.round(scenes.adBreak.duration * 30);
const toFrame = (t) => LESSON_START + Math.round(t * 30) + (t >= scenes.adBreak.at ? AD : 0);
fs.mkdirSync(outDir, { recursive: true });
for (const qa of ["chars", "ui"]) {
  const composition = await selectComposition({ serveUrl, id: "F01L01-QA", inputProps: { qa }, browserExecutable });
  for (let t = Number(from); t <= Number(to); t += Number(step)) {
    const output = path.join(outDir, `${qa}_${t.toFixed(1).padStart(6, "0")}.jpeg`);
    if (fs.existsSync(output)) continue;
    await renderStill({ serveUrl, composition, frame: toFrame(t), output, imageFormat: "jpeg", jpegQuality: 70, scale: 0.25, inputProps: { qa }, browserExecutable });
  }
  console.log("done", qa);
}
