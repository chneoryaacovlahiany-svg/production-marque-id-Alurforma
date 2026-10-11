---
name: animating-training-lessons
description: Turn an ALURFORMA training-lesson podcast (MP3) into a fully animated, subtitled Remotion film in the painted storybook style of F01 L01 — transcript-first, data-driven scenes, recurring characters Léa & Hugo, brand opener, ad inserts and end card. Use for any new lesson video (F01 L02, F02 L01, …).
---

# Animating ALURFORMA training lessons

Reference implementation: `F01_L01_ANIMATION/` (read its README first). Copy that project to `FXX_LYY_ANIMATION/` and replace only the lesson data and scenes.

## Non-negotiables

- **The transcript is the source of truth.** Never invent business, legal or real-estate rules. Every keyword, check mark and label must paraphrase a sentence of the transcript. If no reliable transcript exists, stop and say what is missing.
- Never guess the lesson content from the file name.
- Same characters, same looks, every lesson (`src/components/characters/looks.ts`). Speaker 1 / 2 are assigned to Léa / Hugo by voice pitch (female ≈ 245 Hz, male ≈ 110 Hz) — re-check with `prepare_transcript.py`, it prints mismatches.

## Steps

1. **Audio**: put the MP3 in `public/audio/`. Re-encode with `ffmpeg -af aresample=async=1:first_pts=0` (podcast MP3s may contain corrupt frames that shift sync).
2. **Transcript**: import the MP3 into Descript (`import_media`, language `fr`), then `export_transcript` as SRT → `content/transcript.srt`. Fix obvious ASR errors in the `FIXES` list of `scripts/prepare_transcript.py` and document them in the storyboard.
3. `python3 scripts/prepare_transcript.py content/transcript.srt public/audio/<file>.mp3 src/data` → transcript.json + lip-sync envelope.
4. **Storyboard**: write `src/data/scenes.json` (semantic beats, not fixed intervals; every field of the schema), choose the ad-break at a natural pause, then `python3 scripts/make_storyboard.py`. Show the compact table to the user.
5. **Scenes**: one component per scene in `src/scenes/`, animating in lesson seconds via `useT()`, `ramp()`, `span()`, `pop()`. Each scene: at least one motivated movement, one keyword max on screen, examples shown (not written), varied transitions (`iris`, `leaves`, `clouds`, `page`, `zoom`, `split`).
6. **Pilot first**: render stills with `node scripts/stills.mjs F01L01 <dir> <frames…>` for the first ~30 s, inspect, fix, then extend.
7. **Layout rule — overlays never cover a character.** Keywords stay on one line in the top band (above the heads); boards and cards go in the free space between characters, and characters walk aside to make room when a board arrives. Verify automatically:
   `node scripts/qa_overlap.mjs /tmp/qa 0.5 && python3 scripts/qa_overlap.py /tmp/qa` (renders characters-only and overlays-only silhouettes and reports every frame where an overlay covers >1 % of a body or face). Fix until it reports 0 frames.
8. **QA**: inspect frames of every scene (overflow, safe zones, captions vs. keywords, character continuity, last frame of each scene), then render and export SRT.
9. Publish the MP4 (Descript `import_media` + `publish_project`) and commit the project (MP4s stay out of git).

## Painted plates (optional)

If image generation is available (Figma `generate_image`), generate one background per set name in `backdrops.tsx` with prompts like “hand-painted 2D anime background art, lush watercolor and gouache texture, … no people, no text, no logos”, save as `public/bg/<name>.png`, run `python3 scripts/sync_bg_manifest.py`. Never imitate a named studio's characters or logos.
