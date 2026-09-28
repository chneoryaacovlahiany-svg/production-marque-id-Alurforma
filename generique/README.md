# Générique Alurforma — « Le Seuil »

Générique de marque de 18,7 s, 16:9, 1920×1080, 25 i/s (norme TV française).

## Le concept

Le logo Alurforma, c'est un toit en « A », une **porte ouverte** et **deux chemins**
(marine et vert) qui y mènent. Le générique raconte ce logo :
les deux chemins, c'est **la règle** et **la pratique**, et ils mènent au **métier**.

Au lieu de plaquer le logo à la fin, on traverse la porte, et la lumière de cette porte
**devient** la porte du logo.

## Découpage, calé sur la musique (103,4 BPM)

| Temps | Plan | Musique |
|---|---|---|
| 0 – 2,51 s | **Ouverture.** Noir. Sur chaque temps, un filet de lumière or tombe puis s'ouvre en fenêtre sur l'image principale. La première fenêtre s'ouvre pile sur le filet de lumière de la porte. | Clavinet, tintements de verre |
| 2,51 – 5,94 s | **Quoi ?** Huit panneaux de verre entrent sur les temps (langage de la référence 001941), chacun gravé d'un thème : DÉONTOLOGIE, NON-DISCRIMINATION, ANTI-BLANCHIMENT, GESTION LOCATIVE, FISCALITÉ, TRANSACTION, DPE & ÉNERGIE, COPROPRIÉTÉ. Puis ils pivotent comme des volets et libèrent l'image. | Le groove s'installe |
| 5,94 – 9,40 s | **Pourquoi ?** Image principale en plein cadre, lente poussée vers la porte. « FORMATIONS ALUR EN LIGNE », « Renouvelez votre carte professionnelle », « sans perdre de temps. » | Groove complet, montée |
| 9,40 – 13,88 s | **Comment ?** Couloir de parois de verre, la porte au bout : 14 H PAR AN · 100 % EN LIGNE · À VOTRE RYTHME, sous « VOTRE FORMATION OBLIGATOIRE ». Puis trois filets or se referment sur la porte et sa lumière envahit la pièce. | Groove, montée filtrée et accord inversé sur la dernière mesure |
| **13,96 s** | **Le « A » tombe**, les chemins se dessinent, la porte s'ouvre, puis le nom se dévoile. | **Accord final du morceau** |
| 15,21 / 15,91 s | « COMPRENDRE LA RÈGLE. » / « SÉCURISER LA PRATIQUE. » | L'accord résonne |
| 16,66 s | « FORMATION PROFESSIONNELLE IMMOBILIÈRE », reflet satiné sur le logo, tenue. | L'accord s'éteint naturellement (≈ 18,4 s) |

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

## Musique : le morceau en continu, puis son accord final

Le morceau Suno « Éclat Fonctuel » dure 3 min. `tools/sound_design.py` :

- joue le morceau **en continu** depuis le début, sans aucune coupe, jusqu'à 13,96 s (premier temps) ;
- enchaîne alors sur **l'accord final du morceau** (≈ 175,06 s), qui résonne jusqu'au silence.

Le raccord se cache sous l'attaque de l'accord, recalée à l'échantillon près, avec un fondu enchaîné
de 30 ms. Il est préparé par l'accord final lui-même passé à l'envers (« reverse swell », donc dans la
tonalité) et par une montée filtrée sur la dernière mesure, pendant que le groove s'efface de 4 dB.

Le reste du sound design est discret et hors tonalité : whooshes sur les coupes, tintements de verre
à l'ouverture.

## Fichiers

- `out/ALURFORMA_GENERIQUE_MASTER_1080p25.mp4` : master web (son à −14 LUFS), H.264 BT.709.
- `audio/mix-web.wav` : mixage web/réseaux (−14 LUFS, crête −1,5 dBTP).
- `audio/mix-broadcast-r128.wav` : mixage diffusion TV, norme EBU R128 (−23 LUFS).
- `audio/eclat-fonctuel-suno-180s.mp3` : morceau Suno complet, source du montage musical.
- `src/` : le générique dans Remotion, une scène par fichier (`src/scenes/`).
- `src/logo-paths.json` : logo vectorisé depuis le PNG du site, découpé en calques (A, chemins, battant, liseré or, nom).
- `tools/vectorize_logo.py` : vectorisation du logo.
- `tools/sound_design.py` : montage musical et sound design.
- `tools/stills.mjs` : rendu d'images de contrôle.

## Sources

- Image principale : plan de la porte du générique actuel (`ALURFORMA_CLAUDE_EXPORT/06_GENERIQUE_V26_1080P.mp4`, 0 – 4,4 s, vraie 1080p),
  fluidifié à 50 i/s (interpolation de mouvement) et joué à demi-vitesse.
- Logo, couleurs et police (Inter) : ceux du site `site-vitrine-Alurforma`.
- Musique : morceau Suno « Éclat Fonctuel ».
  Vérifier que la génération a été faite avec un abonnement Suno payant (usage commercial).

## Refaire le rendu

```bash
npm install
# prévisualisation interactive
npx remotion studio
# son : regénérer le montage musical et les mixages
python3 tools/sound_design.py audio/eclat-fonctuel-suno-180s.mp3 audio/mix-raw.wav
ffmpeg -i audio/mix-raw.wav -af "volume=-0.5dB" -c:a pcm_s24le audio/mix-web.wav
ffmpeg -i audio/mix-raw.wav -af "volume=-9.5dB" -c:a pcm_s24le audio/mix-broadcast-r128.wav
cp audio/mix-web.wav public/mix-web.wav
# master (puis conversion BT.709 plage TV)
npx remotion render Generique rendu.mp4 --audio-codec=aac --audio-bitrate=320k
ffmpeg -i rendu.mp4 -vf "scale=in_range=pc:in_color_matrix=bt601:out_range=tv:out_color_matrix=bt709,format=yuv420p" \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:v libx264 -preset slow -crf 15 -movflags +faststart -c:a copy out/ALURFORMA_GENERIQUE_MASTER_1080p25.mp4
```
