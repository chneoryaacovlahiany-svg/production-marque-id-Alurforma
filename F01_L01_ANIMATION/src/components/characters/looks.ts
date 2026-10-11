// Character continuity sheets (see content/characters.md). One rig, four looks.
export type Who = "LEA" | "HUGO" | "DELMAS" | "INES" | "BUYER";

export type Look = {
  name: string;
  skin: string;
  skinShade: string;
  blush: string;
  hair: string;
  hairShade: string;
  hairStyle: "bob" | "messy" | "cap" | "ponytail";
  iris: string;
  top: string;
  topShade: string;
  topStyle: "cardigan" | "vest" | "jacket" | "blazer";
  inner: string;
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
  brows: string;
};

export const looks: Record<Who, Look> = {
  LEA: {
    name: "Léa",
    skin: "#f6d5bb", skinShade: "#e4b294", blush: "#f19a8e",
    hair: "#4a2b20", hairShade: "#2f1a14", hairStyle: "bob", iris: "#5b3a28",
    top: "#2f9c6c", topShade: "#21794f", topStyle: "cardigan", inner: "#f7f0e1",
    bottom: "#24315f", bottomShade: "#1a2448", shoes: "#5b3a29",
    sleeveSkin: false, heightScale: 1, shoulder: 80, belly: 0, earrings: true, brows: "#3a2119",
  },
  HUGO: {
    name: "Hugo",
    skin: "#efc6a4", skinShade: "#d9a47f", blush: "#e99484",
    hair: "#7b4a2a", hairShade: "#5a331c", hairStyle: "messy", iris: "#4a3424",
    top: "#d99a3a", topShade: "#b67b25", topStyle: "vest", inner: "#a9c9e6",
    bottom: "#6b5a48", bottomShade: "#544536", shoes: "#3b2b20",
    sleeveSkin: true, heightScale: 1.05, shoulder: 88, belly: 0, glasses: true, brows: "#5a331c",
  },
  DELMAS: {
    name: "M. Delmas",
    skin: "#f1cdb1", skinShade: "#dcab8c", blush: "#e8907f",
    hair: "#ebe7df", hairShade: "#c9c3b8", hairStyle: "cap", iris: "#3e5560",
    top: "#8a5a3a", topShade: "#6d442a", topStyle: "jacket", inner: "#f3ead8",
    bottom: "#7b8088", bottomShade: "#62666d", shoes: "#3a2a20",
    sleeveSkin: false, heightScale: 0.95, shoulder: 90, belly: 16, mustache: true, brows: "#d9d4ca",
  },
  INES: {
    name: "Inès",
    skin: "#c98f6b", skinShade: "#ad7352", blush: "#d9776a",
    hair: "#221817", hairShade: "#120c0c", hairStyle: "ponytail", iris: "#2e1f18",
    top: "#2b3a6e", topShade: "#1f2b54", topStyle: "blazer", inner: "#fbfbf7",
    bottom: "#3b3f4a", bottomShade: "#2c2f37", shoes: "#1f1b1b",
    sleeveSkin: false, heightScale: 0.98, shoulder: 78, belly: 0, badge: true, brows: "#1a1111",
  },
  BUYER: {
    name: "Acheteur",
    skin: "#e9b98f", skinShade: "#cf9a70", blush: "#e08a78",
    hair: "#2a1d18", hairShade: "#170f0c", hairStyle: "messy", iris: "#3a2a20",
    top: "#5b7fb0", topShade: "#46658f", topStyle: "jacket", inner: "#f4efe4",
    bottom: "#3f4650", bottomShade: "#2f343c", shoes: "#2b221c",
    sleeveSkin: false, heightScale: 1.02, shoulder: 84, belly: 0, brows: "#2a1d18",
  },
};
