import React from "react";
import { Composition } from "remotion";
import { INTRO_FRAMES, introDefaults, LessonIntro } from "./intro/LessonIntro";

export const RemotionRoot: React.FC = () => (
  <Composition id="LessonIntro" component={LessonIntro} width={1920} height={1080} fps={30} durationInFrames={INTRO_FRAMES} defaultProps={introDefaults} />
);
