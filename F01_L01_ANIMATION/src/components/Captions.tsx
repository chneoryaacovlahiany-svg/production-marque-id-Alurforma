import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, fonts, speakerColor, speakerName } from "../theme";
import { frameToLesson, segments, Segment } from "../lib/timeline";

// Burned-in subtitles from the Descript transcript, split into ≤ 2 short lines and timed proportionally.
const MAX = 68;

type Chunk = { speaker: Segment["speaker"]; start: number; end: number; text: string };

const chunks: Chunk[] = segments.flatMap((s) => {
  const words = s.text.split(" ");
  const parts: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > MAX && cur) {
      parts.push(cur.trim());
      cur = w;
    } else cur += " " + w;
  }
  if (cur.trim()) parts.push(cur.trim());
  const total = parts.reduce((a, p) => a + p.length, 0);
  let t = s.start;
  return parts.map((p) => {
    const d = ((s.end - s.start) * p.length) / total;
    const c = { speaker: s.speaker, start: t, end: t + d, text: p };
    t += d;
    return c;
  });
});

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frameToLesson(frame);
  if (t === null) return null;
  const c = chunks.find((x) => t >= x.start - 0.05 && t < x.end + 0.25);
  if (!c) return null;
  const k = Math.min(1, (t - c.start + 0.05) / 0.15);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 46, pointerEvents: "none" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          maxWidth: 1500,
          padding: "12px 26px 14px 14px",
          borderRadius: 22,
          background: "rgba(22, 20, 30, 0.72)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          opacity: k,
          translate: `0px ${(1 - k) * 8}px`,
        }}
      >
        <div
          style={{
            flexShrink: 0,
            padding: "6px 16px",
            borderRadius: 999,
            background: speakerColor[c.speaker],
            color: "#fff",
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: 1,
          }}
        >
          {speakerName[c.speaker]}
        </div>
        <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 38, lineHeight: 1.22, color: C.paper, textAlign: "left" }}>{c.text}</div>
      </div>
    </AbsoluteFill>
  );
};

/** SRT export of the same chunks (written by scripts/export_srt.mjs). */
export const captionChunks = chunks;
