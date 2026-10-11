import React from "react";
import { Composition, Folder } from "remotion";
import { CharacterSheet } from "./compositions/CharacterSheet";
import { BackdropSheet } from "./compositions/BackdropSheet";
import { Main } from "./compositions/Main";
import { Vertical } from "./compositions/Vertical";
import { AdBreak, EndCard, Recap, TitleCard } from "./compositions/brand";
import { AD_FRAMES, ENDCARD_FRAMES, RECAP_FRAMES, TITLE_FRAMES, TOTAL_FRAMES } from "./lib/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="F01L01" component={Main} width={1920} height={1080} fps={30} durationInFrames={TOTAL_FRAMES} />
      <Composition id="F01L01-Vertical" component={Vertical} width={1080} height={1920} fps={30} durationInFrames={TOTAL_FRAMES} />
      <Folder name="Brand">
        <Composition id="TitleCard" component={TitleCard} width={1920} height={1080} fps={30} durationInFrames={TITLE_FRAMES} />
        <Composition id="AdBreak" component={AdBreak} width={1920} height={1080} fps={30} durationInFrames={AD_FRAMES} />
        <Composition id="Recap" component={Recap} width={1920} height={1080} fps={30} durationInFrames={RECAP_FRAMES} />
        <Composition id="EndCard" component={EndCard} width={1920} height={1080} fps={30} durationInFrames={ENDCARD_FRAMES} />
      </Folder>
      <Folder name="Bible">
        <Composition id="CharacterSheet" component={CharacterSheet} width={1920} height={1080} fps={30} durationInFrames={150} />
        <Composition id="BackdropSheet" component={BackdropSheet} width={1920} height={1080} fps={30} durationInFrames={300} />
      </Folder>
    </>
  );
};
