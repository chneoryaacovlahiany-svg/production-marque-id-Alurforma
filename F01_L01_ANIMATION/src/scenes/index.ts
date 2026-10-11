import React from "react";
import { S01, S02, S03, S04, S05, S06, S07 } from "./part1";
import { S08, S09, S10, S11, S12, S13, S14 } from "./part2";
import { S15, S16, S17, S18, S19, S20 } from "./part3";

// Scene id (scenes.json) → component.
export const SCENES: Record<string, React.FC | undefined> = {
  "S01-appel": S01,
  "S02-pieges": S02,
  "S03-foret": S03,
  "S04-episode": S04,
  "S05-qualifier": S05,
  "S06-occuper": S06,
  "S07-activites": S07,
  "S08-exemple": S08,
  "S09-questions": S09,
  "S10-documents": S10,
  "S11-carte": S11,
  "S12-habilitation": S12,
  "S13-mandat": S13,
  "S14-camion": S14,
  "S15-negocier": S15,
  "S16-delmas": S16,
  "S17-changement": S17,
  "S18-assurances": S18,
  "S19-checklist": S19,
  "S20-conclusion": S20,
};
