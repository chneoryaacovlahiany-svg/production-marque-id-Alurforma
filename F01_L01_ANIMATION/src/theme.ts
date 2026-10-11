import { Easing } from "remotion";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts (render machines may be offline): storybook serif for keywords,
// rounded sans for captions, geometric sans for the brand.
const face = (family: string, file: string, weight: string) =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, format: "woff2" });
[
  ["Fraunces", "fraunces-600.woff2", "600"],
  ["Fraunces", "fraunces-800.woff2", "800"],
  ["Nunito", "nunito-600.woff2", "600"],
  ["Nunito", "nunito-700.woff2", "700"],
  ["Nunito", "nunito-800.woff2", "800"],
  ["Outfit", "outfit-400.woff2", "400"],
  ["Outfit", "outfit-600.woff2", "600"],
].forEach(([f, file, w]) => face(f, file, w));

export const fonts = {
  title: "Fraunces, Georgia, serif",
  body: "Nunito, 'Trebuchet MS', sans-serif",
  brand: "Outfit, Nunito, sans-serif",
};

// Design system — painterly countryside palette anchored on the ALURFORMA brand colours.
export const C = {
  navy: "#0f1f4b",
  navyDeep: "#0a1433",
  emerald: "#14915f",
  emeraldSoft: "#5fbf8f",
  gold: "#c9a45c",
  cream: "#f7f3e8",
  paper: "#fbf7ee",
  ink: "#3a2a22", // warm brown outline used for every drawing
  inkSoft: "#6b5245",
  sky: "#6fb3e0",
  skyDeep: "#3f86c6",
  cloud: "#ffffff",
  cloudShade: "#b9cbe0",
  grass: "#7cb95a",
  grassDark: "#4f8d3d",
  grassLight: "#b5d97a",
  terracotta: "#d9774b",
  stone: "#efe4cf",
  wood: "#9a6a43",
  red: "#d0574a",
  amber: "#e9a93b",
  lea: "#14915f",
  hugo: "#d48a2c",
};

export const speakerColor = { LEA: C.lea, HUGO: C.hugo } as const;
export const speakerName = { LEA: "Léa", HUGO: "Hugo" } as const;

// Motion rules: gentle anticipation, soft settle, nothing snappy.
export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
};

export const stroke = 4; // base line weight for drawings at 1080p
export const radius = { card: 28, chip: 999 };
export const shadow = "0 18px 40px rgba(40, 30, 20, 0.22), 0 4px 10px rgba(40, 30, 20, 0.12)";
