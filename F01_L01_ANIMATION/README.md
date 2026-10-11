# ALURFORMA · F01 L01 — Clarifier le cadre en transaction immobilière

Film d'animation pédagogique (≈ 7 min 24 s, 1920×1080, 30 fps) construit avec Remotion à partir du podcast de la leçon : univers peint façon animation japonaise artisanale, personnages récurrents, mots-clés animés, exemples mis en scène, sous-titres, encarts et pub ALURFORMA.

## Déroulé

1. Générique ALURFORMA (master existant)
2. Carton titre peint
3. Leçon animée, 20 scènes synchronisées sur la voix (voir `content/storyboard.md`)
4. Pub mid-roll de 11 s (jingle « Éclat Fonctuel ») entre la partie « qualifier la demande » et la partie « documents »
5. Deux encarts publicitaires discrets pendant la leçon, plus le logo incrusté
6. « À retenir » puis carte de fin de marque

## Prévisualiser

```bash
npm i
npx remotion studio
```

Compositions : `F01L01` (film 16:9), `F01L01-Vertical` (9:16), `Brand/*` (titre, pub, récap, fin), `Bible/*` (planche personnages, planche décors).

## Rendre

```bash
npx remotion render F01L01 out/F01L01_Clarifier_le_cadre_1080p.mp4 --crf=18
npx remotion render F01L01-Vertical out/F01L01_vertical.mp4
python3 scripts/export_srt.py out/F01L01.fr.srt     # sous-titres alignés sur le film final
node scripts/stills.mjs F01L01 out/stills 700 1500  # images de contrôle
```

En session cloud, le Chromium préinstallé est utilisé automatiquement (`remotion.config.ts`).

## Où modifier quoi

| Besoin | Fichier |
|---|---|
| Timings, mots-clés, décor et transition de chaque scène | `src/data/scenes.json` (source unique, puis `python3 scripts/make_storyboard.py`) |
| Mise en scène d'une scène | `src/scenes/part1.tsx` (S01–S07), `part2.tsx` (S08–S14), `part3.tsx` (S15–S20) |
| Personnages (look, poses, expressions) | `src/components/characters/` |
| Décors | `src/components/painterly/backdrops.tsx` ou des plates peintes `public/bg/<nom>.png` + `scripts/sync_bg_manifest.py` |
| Pub, encarts, titre, récap, carte de fin | `src/compositions/brand.tsx` |
| Bruitages | `src/data/sfx.ts` |
| Palette, typographies, easing | `src/theme.ts` |

## Pipeline de données

```text
podcast.mp3 ──► Descript (transcription FR) ──► content/transcript.srt
            └─► scripts/prepare_transcript.py ──► src/data/transcript.json (répliques + locuteur vérifié au pitch)
                                               └► src/data/envelope.json (ouverture de bouche par image)
src/data/scenes.json ──► scènes Remotion + content/storyboard.md + content/scenes.json
```

## Livrables

- `out/F01L01_Clarifier_le_cadre_1080p.mp4` : vidéo finale (non versionnée, publiée sur Descript)
- `out/F01L01.fr.srt` : sous-titres
- `content/storyboard.md`, `content/scenes.json`, `content/characters.md`, `content/asset-manifest.md`
- Skill réutilisable pour les leçons suivantes : `../.claude/skills/animating-training-lessons/SKILL.md`
