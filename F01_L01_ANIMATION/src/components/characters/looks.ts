// Character continuity sheets (see content/characters.md). One rig, five looks.
// Hand-painted anime style: muted natural palette, two-tone cel shading, warm thin line.
export type Who = "LEA" | "HUGO" | "DELMAS" | "INES" | "BUYER" | "AGENT" | "CLIENT_F" | "CLIENT_M";

export type Look = {
  name: string;
  skin: string;
  skinShade: string;
  blush: string;
  hair: string;
  hairShade: string;
  hairHi: string; // painted highlight band
  hairStyle: "bob" | "messy" | "cap" | "ponytail" | "short";
  iris: string;
  top: string;
  topShade: string;
  topStyle: "cardigan" | "vest" | "jacket" | "blazer";
  inner: string;
  innerShade: string;
  bottom: string;
  bottomShade: string;
  shoes: string;
  sleeveSkin: boolean; // rolled sleeves → forearms show skin
  heightScale: number;
  shoulder: number; // half shoulder width
  belly: number;
  glasses?: boolean;
  mustache?: boolean;
  earrings?: boolean;
  badge?: boolean;
  tie?: string; // drawn on the shirt for blazer/jacket looks
  brows: string;
};

export const looks: Record<Who, Look> = {
  LEA: {
    name: "Léa",
    skin: "#f8dcc6", skinShade: "#e8b89c", blush: "#f2948a",
    hair: "#4e3226", hairShade: "#352018", hairHi: "#8a5d48", hairStyle: "bob", iris: "#4a2c22",
    top: "#4f9a72", topShade: "#3a7a58", topStyle: "cardigan", inner: "#f6eedd", innerShade: "#e2d4bb",
    bottom: "#2f3d66", bottomShade: "#222d4f", shoes: "#6b4532",
    sleeveSkin: false, heightScale: 1, shoulder: 78, belly: 0, earrings: true, brows: "#3e271d",
  },
  HUGO: {
    name: "Hugo",
    skin: "#f2cdb0", skinShade: "#ddaa88", blush: "#ec9a86",
    hair: "#7a4b2c", hairShade: "#583420", hairHi: "#b07c52", hairStyle: "messy", iris: "#3e2a1e",
    top: "#d39a45", topShade: "#b07a30", topStyle: "vest", inner: "#b9d2e8", innerShade: "#93b2cf",
    bottom: "#6e5a46", bottomShade: "#574636", shoes: "#43302a",
    sleeveSkin: true, heightScale: 1.05, shoulder: 86, belly: 0, glasses: true, brows: "#583420",
  },
  DELMAS: {
    name: "M. Delmas",
    skin: "#f3d2b8", skinShade: "#dfb093", blush: "#ea9483",
    hair: "#eeebe4", hairShade: "#c8c2b6", hairHi: "#ffffff", hairStyle: "cap", iris: "#34495a",
    top: "#8b5e3c", topShade: "#6d462b", topStyle: "jacket", inner: "#f3ead8", innerShade: "#ddd0b8",
    bottom: "#7d838c", bottomShade: "#646971", shoes: "#3f2d22",
    sleeveSkin: false, heightScale: 0.95, shoulder: 88, belly: 16, mustache: true, brows: "#dcd7cd",
  },
  INES: {
    name: "Inès",
    skin: "#cf9673", skinShade: "#b47a58", blush: "#d97a6c",
    hair: "#2a1d1b", hairShade: "#170f0e", hairHi: "#5b4038", hairStyle: "ponytail", iris: "#2a1a14",
    top: "#2f3e70", topShade: "#232f57", topStyle: "blazer", inner: "#fbfaf4", innerShade: "#e3e0d6",
    bottom: "#3d414c", bottomShade: "#2d3038", shoes: "#241e1d",
    sleeveSkin: false, heightScale: 0.98, shoulder: 76, belly: 0, badge: true, brows: "#1d1312",
  },
  BUYER: {
    name: "Acheteur",
    skin: "#ebbd95", skinShade: "#d29f76", blush: "#e28b78",
    hair: "#2d201b", hairShade: "#1a120f", hairHi: "#5e463b", hairStyle: "short", iris: "#33251d",
    top: "#5d80ae", topShade: "#47658e", topStyle: "jacket", inner: "#f4efe4", innerShade: "#ddd6c7",
    bottom: "#424955", bottomShade: "#323842", shoes: "#2e241e",
    sleeveSkin: false, heightScale: 1.02, shoulder: 82, belly: 0, brows: "#2d201b",
  },
  // Intro mascot: the ALURFORMA agent and the couple he brings the house to.
  AGENT: {
    name: "Agent ALURFORMA",
    skin: "#f4d3b6", skinShade: "#e0ae8e", blush: "#ee9686",
    hair: "#8a4a28", hairShade: "#63341b", hairHi: "#c27a4c", hairStyle: "messy", iris: "#3e2a1e",
    top: "#14305e", topShade: "#0f2349", topStyle: "blazer", inner: "#fbfaf4", innerShade: "#e3e0d6",
    bottom: "#1d2b52", bottomShade: "#142040", shoes: "#3a281f",
    sleeveSkin: false, heightScale: 1, shoulder: 80, belly: 0, tie: "#14915f", brows: "#63341b",
  },
  CLIENT_F: {
    name: "Cliente",
    skin: "#f6d8c2", skinShade: "#e4b597", blush: "#f0928a",
    hair: "#c9944f", hairShade: "#a1703a", hairHi: "#e8bf7c", hairStyle: "bob", iris: "#3e5a46",
    top: "#d2604c", topShade: "#ad4a3a", topStyle: "cardigan", inner: "#fbf3e6", innerShade: "#e6d9c4",
    bottom: "#465a7a", bottomShade: "#36465f", shoes: "#6b4532",
    sleeveSkin: false, heightScale: 0.96, shoulder: 74, belly: 0, earrings: true, brows: "#8f6131",
  },
  CLIENT_M: {
    name: "Client",
    skin: "#d9a582", skinShade: "#bf8763", blush: "#dc8a76",
    hair: "#2b211d", hairShade: "#18110e", hairHi: "#5c473d", hairStyle: "short", iris: "#2b1d16",
    top: "#5f8f5a", topShade: "#4a7346", topStyle: "vest", inner: "#f1ece0", innerShade: "#d9d1bf",
    bottom: "#5a4a3a", bottomShade: "#46392c", shoes: "#2f241d",
    sleeveSkin: true, heightScale: 1.04, shoulder: 84, belly: 0, brows: "#2b211d",
  },
};
