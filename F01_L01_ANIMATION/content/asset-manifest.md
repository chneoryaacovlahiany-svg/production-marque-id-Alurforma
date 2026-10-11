# Manifeste des assets — F01 L01

| Fichier | Origine | Usage |
|---|---|---|
| `public/audio/f01-l01-podcast.mp3` | Podcast fourni « Clarifier le cadre en transaction immobilière » (6:32) | Source originale (non utilisée directement) |
| `public/audio/f01-l01-voice.mp3` | Podcast réencodé avec `aresample=async=1` : ~50 trames MP3 corrompues dans la source décalaient l'audio de 1,2 s en fin de fichier | Voix off du film, synchro labiale |
| `content/transcript.srt` | Transcription Descript (projet « ALURFORMA F01 L01 — Clarifier le cadre (transcription) ») | Source de vérité du contenu |
| `src/data/transcript.json` | `scripts/prepare_transcript.py` (répliques + locuteur vérifié au pitch) | Sous-titres, synchro des scènes |
| `src/data/envelope.json` | `scripts/prepare_transcript.py` (RMS de la voix par image à 30 fps) | Ouverture de la bouche des personnages |
| `public/generique.mp4` | `ALURFORMA_CLAUDE_EXPORT/ALURFORMA_GENERIQUE_MASTER_1080p25-V2.mp4` | Ouverture du film |
| `public/audio/jingle.mp3` | `ALURFORMA_CLAUDE_EXPORT/Éclat Fonctuel.mp3` (10,9 s) | Pub mid-roll |
| `public/audio/music-calm.mp3` | `Calm Reassurance.mp3` | Nappe musicale, partie 1 (−24 dB) |
| `public/audio/music-piano.mp3` | `Warm Piano Motif.mp3` | Nappe musicale, partie 2 + « À retenir » |
| `public/audio/music-chord.mp3` | `Warm Resolved Chord.mp3` | Carton titre + carte de fin |
| `public/brand/logo.png` | Détouré de la dernière image du générique (`scripts/extract_logo.py`) | Encarts, pub, carte de fin, logo incrusté |
| `public/sfx/*.wav` | Synthétisés (`scripts/make_sfx.py`) : whoosh, gust, chime, pop, paper, stamp, check, nope, ring, sputter, engine, sparkle | Design sonore (`src/data/sfx.ts`) |
| `public/tex/paper.jpg`, `bloom.jpg` | Générés (`scripts/make_textures.py`) | Grain de papier aquarelle |
| `public/fonts/*.woff2` | Google Fonts (Fraunces, Nunito, Outfit), `scripts/fetch_fonts.sh` | Typographie hors ligne |
| Décors | 10 décors SVG dessinés dans `src/components/painterly/backdrops.tsx` | Colline, bureau, rue, vallée, forêt, bureau vu de dessus, campagne + camion, jardin, tour, coucher de soleil |
| Décors peints (option) | 10 plates générées avec Figma AI (`gpt-image-2.5-sunburst`), mêmes noms que les décors SVG | Non intégrés : le téléchargement depuis www.figma.com est bloqué par la politique réseau de l'environnement. Déposer `public/bg/<nom>.png` puis lancer `python3 scripts/sync_bg_manifest.py` : ils remplacent automatiquement les décors SVG |

Aucun visuel d'un studio ou d'une œuvre existante n'est reproduit : l'univers « animation japonaise peinte à la main » est une direction artistique originale (ciel à cumulus, lumière dorée, campagne, papier aquarelle).
