import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, fonts } from "../theme";
import { Character } from "../components/characters/Character";
import { looks, Who } from "../components/characters/looks";

// Continuity sheet: the four recurring characters in their main poses.
export const CharacterSheet: React.FC = () => {
  const frame = useCurrentFrame();
  const t = 10 + frame / 30;
  const who: Who[] = ["LEA", "HUGO", "DELMAS", "INES"];
  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: fonts.body }}>
      {who.map((w, i) => (
        <React.Fragment key={w}>
          <Character who={w} t={t} x={240 + i * 480} y={900} h={700} pose={(["explain", "phone", "think", "shrug"] as const)[i]} mood={(["smile", "happy", "worried", "neutral"] as const)[i]} look={i % 2 ? -0.5 : 0.5} talk={i === 0 ? 0.6 : undefined} />
          <div style={{ position: "absolute", left: 240 + i * 480 - 200, width: 400, top: 950, textAlign: "center", fontSize: 40, fontWeight: 800, color: C.ink }}>{looks[w].name}</div>
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
