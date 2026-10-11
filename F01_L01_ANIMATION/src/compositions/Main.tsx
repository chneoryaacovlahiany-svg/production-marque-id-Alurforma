import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio, Video } from "@remotion/media";
import scenesData from "../data/scenes.json";
import { SFX } from "../data/sfx";
import {
  AD_AT,
  AD_FRAMES,
  ENDCARD_FRAMES,
  FPS,
  GENERIQUE_FRAMES,
  LESSON_DURATION,
  LESSON_START,
  lessonToFrame,
  RECAP_FRAMES,
  SceneTime,
  TITLE_FRAMES,
} from "../lib/timeline";
import { TRANSITION_LEAD } from "../components/SceneShell";
import { Captions } from "../components/Captions";
import { AdBreak, BrandBug, EndCard, Encart, Recap, TitleCard } from "./brand";
import { SCENES } from "../scenes";
import { SceneMeta } from "../scenes/common";

const AD_START = lessonToFrame(AD_AT) - AD_FRAMES; // first frame of the ad
const LESSON_END = lessonToFrame(LESSON_DURATION);
const RECAP_START = LESSON_END;
const END_START = RECAP_START + RECAP_FRAMES;

/** The full F01 L01 film: brand opener → title → animated lesson (with mid-roll ad) → recap → end card. */
export const Main: React.FC = () => {
  const scenes = scenesData.scenes as SceneMeta[];
  return (
    <AbsoluteFill style={{ background: "#fffaf0" }}>
      {/* 1. ALURFORMA brand opener (existing master, 25 fps, with its own soundtrack) */}
      <Sequence name="Générique" durationInFrames={GENERIQUE_FRAMES}>
        <Video src={staticFile("generique.mp4")} />
      </Sequence>

      {/* 2. Painted title card */}
      <Sequence name="Titre" from={GENERIQUE_FRAMES} durationInFrames={TITLE_FRAMES + 30}>
        <TitleCard />
        <Audio src={staticFile("audio/music-chord.mp3")} volume={0.35} />
      </Sequence>

      {/* 3. Lesson scenes (timed in lesson seconds from scenes.json) */}
      {scenes.map((m, i) => {
        const Comp = SCENES[m.id];
        if (!Comp) return null;
        const lead = TRANSITION_LEAD[m.transitionIn] ?? 0;
        const from = lessonToFrame(m.startSec) - Math.round(lead * FPS);
        const next = scenes[i + 1];
        const to = next ? lessonToFrame(next.startSec) : RECAP_START + 2;
        return (
          <Sequence key={m.id} name={m.id} from={from} durationInFrames={Math.max(1, to - from)}>
            <SceneTime start={m.startSec} lead={lead}>
              <Comp />
            </SceneTime>
          </Sequence>
        );
      })}

      {/* 4. Mid-roll ad between the two parts of the lesson */}
      <Sequence name="Pub" from={AD_START} durationInFrames={AD_FRAMES}>
        <AdBreak />
        <Audio src={staticFile("audio/jingle.mp3")} volume={(f) => 0.7 * Math.min(1, (AD_FRAMES - f) / 20)} />
      </Sequence>

      {/* in-lesson banners */}
      {scenesData.encarts.map((e) => (
        <Sequence key={e.id} name={e.id} from={lessonToFrame(e.startSec)} durationInFrames={Math.round((e.endSec - e.startSec) * FPS)}>
          <Encart text={e.text} sub={e.sub} dur={e.endSec - e.startSec} />
        </Sequence>
      ))}

      {/* brand bug + subtitles over the lesson */}
      <Sequence name="Bug" from={LESSON_START} durationInFrames={AD_START - LESSON_START}>
        <BrandBug />
      </Sequence>
      <Sequence name="Bug2" from={AD_START + AD_FRAMES + 20} durationInFrames={LESSON_END - AD_START - AD_FRAMES - 20}>
        <BrandBug />
      </Sequence>
      <Captions />

      {/* 5. Recap + end card */}
      <Sequence name="À retenir" from={RECAP_START} durationInFrames={RECAP_FRAMES}>
        <Recap />
        <Audio src={staticFile("audio/music-piano.mp3")} volume={(f) => 0.4 * Math.min(1, f / 15) * Math.min(1, (RECAP_FRAMES - f) / 30)} />
      </Sequence>
      <Sequence name="Fin" from={END_START} durationInFrames={ENDCARD_FRAMES}>
        <EndCard />
        <Audio src={staticFile("audio/music-chord.mp3")} volume={0.45} />
      </Sequence>

      {/* ── Audio: voice (split around the ad), music bed, sound design ── */}
      <Sequence name="Voix A" from={LESSON_START} durationInFrames={AD_START - LESSON_START}>
        <Audio src={staticFile("audio/f01-l01-voice.mp3")} />
      </Sequence>
      <Sequence name="Voix B" from={AD_START + AD_FRAMES} durationInFrames={LESSON_END - AD_START - AD_FRAMES}>
        <Audio src={staticFile("audio/f01-l01-voice.mp3")} trimBefore={AD_START - LESSON_START} />
      </Sequence>
      <Sequence name="Musique A" from={LESSON_START} durationInFrames={AD_START - LESSON_START}>
        <Audio src={staticFile("audio/music-calm.mp3")} loop volume={(f) => 0.06 * Math.min(1, f / 60) * Math.min(1, (AD_START - LESSON_START - f) / 30)} />
      </Sequence>
      <Sequence name="Musique B" from={AD_START + AD_FRAMES} durationInFrames={LESSON_END - AD_START - AD_FRAMES}>
        <Audio src={staticFile("audio/music-piano.mp3")} loop volume={(f) => 0.055 * Math.min(1, f / 60) * Math.min(1, (LESSON_END - AD_START - AD_FRAMES - f) / 45)} />
      </Sequence>
      {SFX.map(([t, file, vol], i) => (
        <Sequence key={i} name={`sfx ${file}`} from={lessonToFrame(t)} durationInFrames={3 * FPS}>
          <Audio src={staticFile(`sfx/${file}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
