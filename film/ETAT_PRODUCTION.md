# État de production — « Le temps de Hugo »

Mis à jour le 28 septembre 2026.

## Plans

| Plan | État | Fichier | Remarque |
|---|---|---|---|
| 1 | **fait** | `plans/PLAN01_test_heygen_5s_1080p.mp4` | test validé |
| 2 | **fait** | `plans/PLAN02_heygen_5s_1080p.mp4` | remise des clés dans un appartement lumineux, sourire, coup d'œil à la montre. Fenêtre 0,5 s → |
| 3 | **fait** | `plans/PLAN03_heygen_4s_1080p.mp4` | notification « Formation continue - à planifer » (coquille HeyGen, à masquer par une carte propre si on veut du texte net), balayée sans regarder, téléphone repris. Fenêtre 1,2 s → |
| 4 | **fait** | `plans/PLAN04_heygen_6s_1080p.mp4` | soir, lampe, courrier, agenda ; visage et décor conformes. Il garde sa veste (le prompt la demandait sur la chaise). Le texte du courrier n'est pas lisible : à incruster au montage si on veut qu'il le soit. Regard caméra à partir de 5 s : non utilisé (fenêtre 0,5 – 3,8 s). |
| 5 | **fait** | `plans/PLAN05_heygen_5s_1080p.mp4` | arc de caméra autour de l'écran alurforma.fr sous la lampe ; texte d'écran approximatif. Fenêtre 1,5 s → |
| 6a + 6c | **fait** | `plans/PLAN06AC_heygen_10s_1080p.mp4` | un seul clip : leçon de profil (0 – 4 s), puis face, coche « Évaluation validée » à 8 s, sourire. Fenêtres 0,5 s et 7,6 s |
| 6b | **fait** | `plans/PLAN06B_heygen_4s_1080p.mp4` | siège passager, leçon sur le téléphone, regard vers l'immeuble |
| 7a + 7b | **fait** | `plans/PLAN07AB_heygen_8s_1080p.mp4` | « Attestation de formation » à l'écran, clic, puis la feuille sort de l'imprimante (5 s) et va dans la chemise bleu nuit. Fenêtres 0,5 s et 5,0 s |
| 8 | **fait** | `plans/PLAN08_heygen_5s_1080p.mp4` | message de la conseillère lisible en amorce, demi-sourire, pose le téléphone. Fenêtre 1,0 s → |
| 9 | **fait** | `plans/PLAN09_heygen_6s_1080p.mp4` | ferme le portable, veste, sortie par la porte vitrée, poignée de main avec une cliente, contre-jour doré. Fenêtre montée 2,8 – 5,8 s. |
| 10 | **fait** | `plans/PLAN10_heygen_5s_1080p.mp4` | agence vide, lampe, lumière qui refroidit ; panneau, virage bleu nuit et texte au montage |

Les jobs HeyGen sont dans `plans/jobs.json` (video_id, statut, fichier).

## Coût HeyGen mesuré

Cinematic Avatar 1080p : **17,67 $ par vidéo, quelle que soit la durée** (mesuré de 4 à 10 s), soit 1 060 crédits API.
Texte → parole : environ 0,07 $ par voix off complète.

Dépensé sur le film : 12 vidéos (plans 1 à 10, dont 6ac et 7ab fusionnés, plus le test du plan 1) ≈ 212 $.

## Voix off

Voix retenue : **French Expert Narrator (voix A) à vitesse 1,0** (`vo/VO_A_v100.wav`, mots dans `vo/VO_A_v100_mots.json`), 32,4 s.
La voix B à 1,10 sonnait mécanique : débit le plus rapide (4,4 mots/s parlée) et hauteur très stable ; c'est en outre un registre masculin.
Sept candidates à vitesse naturelle et leurs mesures (`tools/vo_analyse.py`) sont dans `vo/candidats/`.
Le montage (`tools/assemble.py`) se recale sur les mots de la voix : chaque plan démarre sur le premier mot de sa phrase,
le film dure dernier mot + 0,15 s (32,3 s avec la voix A) et le générique de fin se décale d'autant.

## Outils

- `tools/heygen_plans.py` : `submit <plans>`, `status`, `wait` (télécharge dans `plans/`), `quota`, `prompt <plan>`.
  Prompts = prompt maître (dossier § 6.2) + prompt du plan (découpage V2), avatar « Hugo Alurforma », image de référence de l'agence pour les plans d'agence.
- `tools/assemble.py` : montage du film puis assemblage avec les deux génériques et la voix (`--vo <fichier>` pour en changer).
  Les plans manquants sont remplacés par un carton bleu nuit. Points d'entrée par plan dans `SEGMENTS`, clips fusionnés dans `ALIAS`.
  Clips HeyGen à 24 i/s passés à 25 i/s par légère accélération (4 %), sans image doublée.
- `tools/vo_candidats.py` : voix off HeyGen (texte → parole) pour plusieurs voix ; `tools/vo_analyse.py` : mesures de prosodie.
- `fonts/` : Inter (SIL Open Font License), pour les textes incrustés.

## Musique

« Warm Piano Motif » (Suno, prompt § 6.6 en 500 caractères, choisi par le client parmi deux propositions) :
`ALURFORMA_CLAUDE_EXPORT/Warm Piano Motif.mp3`, 40 s, fin naturelle à 39 s. L'autre proposition, « Calm Reassurance », reste dans le même dossier.
Au mixage : normalisée à −23 LUFS sous la voix (−18 LUFS), naît à 14,0 s absolu sous l'accord du générique d'ouverture (fondu 3 s),
s'éteint sur 2 s sous la montée du générique de fin.

## Étalonnage

Appliqué aux dix plans (pas aux génériques), dans `tools/assemble.py` (`--no-grade` pour le désactiver) :
ombres vers le bleu nuit, hautes lumières légèrement chaudes, saturation 0,9, contraste doux, courbe avec noirs et blancs
légèrement relevés, grain fin.

## Masters (`tools/masters.py`, loudnorm deux passes, vidéo intacte)

| Fichier | Norme | Mesuré |
|---|---|---|
| `out/ALURFORMA_FILM_HUGO_MASTER_1080p25_web.mp4` + `_web.wav` | web / réseaux : −14 LUFS, −1 dBTP | −13,9 LUFS, −1,4 dBTP, LRA 5,9 LU |
| `out/ALURFORMA_FILM_HUGO_MASTER_1080p25_broadcast_r128.mp4` + `_broadcast_r128.wav` | TV EBU R128 : −23 LUFS, −1 dBTP | −23,0 LUFS, −9,8 dBTP, LRA 7,1 LU |

55,44 s, 1920×1080, 25 i/s, H.264 BT.709. `out/ALURFORMA_FILM_HUGO_MASTER_web_preview.mp4` : copie légère pour relecture.
Le montage intermédiaire (`out/ALURFORMA_FILM_HUGO_montage*.mp4`) n'est plus versionné : `python3 film/tools/assemble.py` le régénère.

## Reste à faire (optionnel)

1. Textes d'interface nets (notification plan 3, écran plan 5, message plan 8, courrier plan 4) : cartes propres à incruster au montage.
2. Mention légale en bas du plan 10 si diffusion publicitaire (dossier § 9).
3. Version courte 21 s (dossier § 8) si besoin.
