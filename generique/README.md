# Générique Alurforma — « Le Seuil »

Générique de marque de 17,08 s, 16:9, 1920×1080, 25 i/s (norme TV française),
sur le morceau « Warm Resolved Chord ».

## Le concept

Le logo Alurforma, c'est un toit en « A », une **porte ouverte** et **deux chemins**
(marine et vert) qui y mènent. Le générique raconte ce logo :
les deux chemins, c'est **la règle** et **la pratique**, et ils mènent au **métier**.

Au lieu de plaquer le logo à la fin, on traverse la porte, et la lumière de cette porte
**devient** la porte du logo.

## Découpage, calé sur la musique (92,3 BPM)

| Temps | Plan | Musique |
|---|---|---|
| 0 – 1,46 s | **Ouverture.** Noir. Sur les premières attaques, des filets de lumière or tombent puis s'ouvrent en fenêtres sur l'image principale. La première s'ouvre pile sur le filet de lumière de la porte. | Intro |
| 1,46 – 4,71 s | **Quoi ?** Huit panneaux de verre entrent sur les demi-temps (langage de la référence 001941), chacun gravé d'un thème : DÉONTOLOGIE, NON-DISCRIMINATION, ANTI-BLANCHIMENT, GESTION LOCATIVE, FISCALITÉ, TRANSACTION, DPE & ÉNERGIE, COPROPRIÉTÉ. Puis ils pivotent comme des volets et libèrent l'image. | Groove |
| 4,71 – 7,31 s | **Pourquoi ?** Image principale en plein cadre, lente poussée vers la porte. « FORMATIONS ALUR EN LIGNE », « Renouvelez votre carte professionnelle », « sans perdre de temps. » | Groove |
| 7,31 – 9,80 s | **Comment ?** Couloir de parois de verre, la porte au bout. 14 H PAR AN, 100 % EN LIGNE, À VOTRE RYTHME s'empilent sous « VOTRE FORMATION OBLIGATOIRE » et restent ensemble à l'écran. Puis trois filets or se referment sur la porte et sa lumière envahit la pièce. | Fin du groove, passage en tension |
| **9,87 s** | **Le « A » tombe**, les chemins se dessinent, la porte s'ouvre, le nom se dévoile. | **L'accord résolu se pose** |
| 10,56 / 11,21 s | « COMPRENDRE LA RÈGLE. » / « SÉCURISER LA PRATIQUE. » | L'accord résonne |
| 11,86 s → fin | « FORMATION PROFESSIONNELLE IMMOBILIÈRE », reflet satiné sur le logo, tenue. | L'accord s'éteint jusqu'au silence |

## Textes

Chaque séquence répond à une seule question :

- **Quoi ?** (panneaux) les thèmes de formation ALUR ;
- **Pourquoi ?** (image principale) l'accroche d'accueil du site ;
- **Comment ?** (couloir) 14 h par an (décret n° 2016-173), 100 % en ligne, à votre rythme ;
- **Qui ?** (révélation) le logo et le slogan.

Slogan, accroche et thèmes Transaction / Gestion / Syndic viennent du site (`site-vitrine-Alurforma`).
FISCALITÉ et DPE & ÉNERGIE ont été ajoutés car Alurforma prévoit de couvrir la quasi-totalité des thèmes ALUR.
Les thèmes se modifient dans `src/scenes/Installation.tsx`, les accroches dans `src/scenes/Hero.tsx` et `src/scenes/Tunnel.tsx`,
tous les temps de coupe dans `src/timing.ts`.

## Musique

« Warm Resolved Chord » (`ALURFORMA_CLAUDE_EXPORT/Warm Resolved Chord.mp3`) est utilisé **tel quel**,
du début à la fin, sans montage ni effet ajouté : seul le niveau est ajusté (gain simple, sans limiteur).
L'image est calée sur ses repères mesurés : groove à 92,3 BPM jusqu'à 8,2 s, passage en tension,
accord résolu à 9,87 s, extinction jusqu'au silence.

## Fichiers

- `out/ALURFORMA_GENERIQUE_MASTER_1080p25.mp4` : master web (son à −14 LUFS), H.264 BT.709.
- `audio/mix-web.wav` : mixage web/réseaux (−14 LUFS, crête −3 dBTP).
- `audio/mix-broadcast-r128.wav` : mixage diffusion TV, norme EBU R128 (−23 LUFS).
- `audio/warm-resolved-chord.mp3` : le morceau source.
- `src/` : le générique dans Remotion, une scène par fichier (`src/scenes/`).
- `src/logo-paths.json` : logo vectorisé depuis le PNG du site, découpé en calques (A, chemins, battant, liseré or, nom).
- `tools/vectorize_logo.py` : vectorisation du logo.
- `tools/stills.mjs` : rendu d'images de contrôle.

Les versions précédentes (morceau Suno « Éclat Fonctuel », montages et sound design) restent dans l'historique git.

## Sources

- Image principale : plan de la porte du générique actuel (`ALURFORMA_CLAUDE_EXPORT/06_GENERIQUE_V26_1080P.mp4`, 0 – 4,4 s, vraie 1080p),
  fluidifié à 50 i/s (interpolation de mouvement) et joué à demi-vitesse.
- Logo, couleurs et police (Inter) : ceux du site `site-vitrine-Alurforma`.
- Musique : « Warm Resolved Chord ». Vérifier les droits d'usage commercial de sa source.

## Refaire le rendu

```bash
npm install
# prévisualisation interactive
npx remotion studio
# son : mise à niveau du morceau (gain simple)
ffmpeg -i audio/warm-resolved-chord.mp3 -map 0:a -ar 48000 -ac 2 -af "volume=1.5dB" -c:a pcm_s24le audio/mix-web.wav
ffmpeg -i audio/warm-resolved-chord.mp3 -map 0:a -ar 48000 -ac 2 -af "volume=-7.5dB" -c:a pcm_s24le audio/mix-broadcast-r128.wav
cp audio/mix-web.wav public/mix-web.wav
# master (puis conversion BT.709 plage TV)
npx remotion render Generique rendu.mp4 --audio-codec=aac --audio-bitrate=320k
ffmpeg -i rendu.mp4 -vf "scale=in_range=pc:in_color_matrix=bt601:out_range=tv:out_color_matrix=bt709,format=yuv420p" \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:v libx264 -preset slow -crf 15 -movflags +faststart -c:a copy out/ALURFORMA_GENERIQUE_MASTER_1080p25.mp4
```
