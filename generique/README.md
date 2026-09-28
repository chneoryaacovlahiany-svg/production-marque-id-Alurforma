# Générique Alurforma — « Le Seuil »

Générique de marque de 14 s, 16:9, 1920×1080, 25 i/s (norme TV française).

## Le concept

Le logo Alurforma, c'est un toit en « A », une **porte ouverte** et **deux chemins**
(marine et vert) qui y mènent. Le générique raconte ce logo :
les deux chemins, c'est **la règle** et **la pratique**, et ils mènent au **métier**.

Au lieu de plaquer le logo à la fin, on traverse la porte, et la lumière de cette porte
**devient** la porte du logo.

## Découpage, calé sur le jingle (104 BPM)

| Temps | Plan | Musique |
|---|---|---|
| 0 – 2,49 s | **Ouverture.** Noir. Sur chaque pulsation, un filet de lumière or tombe puis s'ouvre en fenêtre sur l'image principale. La première fenêtre s'ouvre pile sur le filet de lumière de la porte. | Clavinet seul, tintements de verre |
| 2,49 – 4,78 s | **Installation.** Des panneaux de verre architecturaux entrent sur les temps (langage de la référence 001941). Chacun est une fenêtre réfractée sur l'image. Puis ils pivotent comme des volets et libèrent l'image. | Basse et batterie, whooshes |
| 4,78 – 7,07 s | **Image principale.** Plein cadre, lente poussée vers la porte, reflets de verre au premier plan, halo qui respire sur les temps. | Groove complet |
| 7,07 – 9,37 s | **Accélération.** Couloir de parois de verre qui défilent, la porte au bout, vitesse croissante, flou de mouvement. | Montée en tension |
| 9,37 – 10,6 s | **Convergence.** Trois filets or se referment sur l'encadrement, plongée dans la lumière de la porte. | Note grave tenue |
| 10,6 – 11,0 s | **Le plan.** Écran lumineux ; le logo se trace en contours or, les deux chemins se dessinent vers la porte. | Respiration (musique creusée) |
| **11,0 s** | **Le « A » tombe** sur le premier impact grave, la porte s'ouvre, le nom se dévoile. | Impact grave + scintillement de verre |
| **11,6 s** | **« COMPRENDRE LA RÈGLE. SÉCURISER LA PRATIQUE. »** | Second impact |
| 12,2 – 14 s | « Formation professionnelle immobilière », reflet satiné sur le logo, tenue. | Queue de réverbération |

## Fichiers

- `out/ALURFORMA_GENERIQUE_MASTER_1080p25.mp4` : master web (son à −14 LUFS).
- `audio/mix-web.wav` : mixage web/réseaux (−14 LUFS, crête −1,4 dBTP).
- `audio/mix-broadcast-r128.wav` : mixage diffusion TV, norme EBU R128 (−23 LUFS).
- `src/` : le générique dans Remotion, une scène par fichier (`src/scenes/`).
- `src/logo-paths.json` : logo vectorisé depuis le PNG du site, découpé en calques (A, chemins, battant, liseré or, nom).
- `tools/vectorize_logo.py` : vectorisation du logo.
- `tools/sound_design.py` : sound design posé sur le jingle Suno.

## Sources

- Image principale : `porte-1600.mp4` du site, fluidifiée à 50 i/s (interpolation de mouvement), agrandie en 1080p et jouée à demi-vitesse.
- Logo, couleurs et police (Inter) : ceux du site `site-vitrine-Alurforma`.
- Musique : jingle Suno « Éclat Fonctuel » (0 – 12 s), prolongé à 14 s par le sound design.
  Vérifier que la génération a été faite avec un abonnement Suno payant (usage commercial).

## Refaire le rendu

```bash
npm install
# prévisualisation interactive
npx remotion studio
# master
npx remotion render Generique out/ALURFORMA_GENERIQUE_MASTER_1080p25.mp4 --audio-codec=aac --audio-bitrate=320k
# son : regénérer le mixage
python3 tools/sound_design.py audio/jingle-source-12s.mp3 audio/mix-raw.wav
ffmpeg -i audio/mix-raw.wav -af "volume=4.6dB,alimiter=limit=0.84:attack=3:release=60:level=disabled" -c:a pcm_s24le audio/mix-web.wav
ffmpeg -i audio/mix-raw.wav -af "volume=-4.75dB" -c:a pcm_s24le audio/mix-broadcast-r128.wav
cp audio/mix-web.wav public/mix-web.wav
```
