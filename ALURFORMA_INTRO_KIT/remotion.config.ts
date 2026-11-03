import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Use the pre-installed headless Chromium when present (cloud sessions have no download access).
const PW = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
import fs from "fs";
if (fs.existsSync(PW)) Config.setBrowserExecutable(PW);
