// Batch-render the ALURFORMA lesson intro for every entry of content/intros.json:
// out/intros/<id>_intro.mp4 (12 s, 1080p, with sound) and out/intros/<id>_vignette.png (LMS thumbnail).
// Usage: node scripts/render_intros.mjs [id ...]   (no id = all entries)
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import fs from "fs";
import path from "path";

const only = process.argv.slice(2);
const { intros } = JSON.parse(fs.readFileSync("content/intros.json", "utf8"));
const PW = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browserExecutable = fs.existsSync(PW) ? PW : undefined;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
fs.mkdirSync("out/intros", { recursive: true });
for (const entry of intros.filter((e) => only.length === 0 || only.includes(e.id))) {
  const { id, ...inputProps } = entry;
  const composition = await selectComposition({ serveUrl, id: "LessonIntro", inputProps, browserExecutable });
  await renderMedia({ serveUrl, composition, codec: "h264", crf: 18, outputLocation: `out/intros/${id}_intro.mp4`, inputProps, browserExecutable, concurrency: 4 });
  await renderStill({ serveUrl, composition, frame: composition.durationInFrames - 15, output: `out/intros/${id}_vignette.png`, imageFormat: "png", inputProps, browserExecutable });
  console.log("✓", id);
}
