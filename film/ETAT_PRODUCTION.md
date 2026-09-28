# État de production — « Le temps de Hugo »

Mis à jour le 28 septembre 2026.

## Plans

| Plan | État | Fichier | Remarque |
|---|---|---|---|
| 1 | **fait** | `plans/PLAN01_test_heygen_5s_1080p.mp4` | test validé |
| 2 | à générer | | 5 s |
| 3 | à générer | | 4 s |
| 4 | **fait** | `plans/PLAN04_heygen_6s_1080p.mp4` | soir, lampe, courrier, agenda ; visage et décor conformes. Il garde sa veste (le prompt la demandait sur la chaise). Le texte du courrier n'est pas lisible : à incruster au montage si on veut qu'il le soit. Regard caméra à partir de 5 s : non utilisé (fenêtre 0,5 – 3,8 s). |
| 5 | à générer | | 5 s |
| 6a, 6b, 6c | à générer | | 4 s chacun |
| 7a, 7b | à générer | | 5 s + 4 s |
| 8 | à générer | | 5 s |
| 9 | **fait** | `plans/PLAN09_heygen_6s_1080p.mp4` | ferme le portable, veste, sortie par la porte vitrée, poignée de main avec une cliente, contre-jour doré. Fenêtre montée 2,8 – 5,8 s. |
| 10 | à générer | | 5 s, agence vide (panneau, virage bleu nuit et texte faits au montage, déjà en place) |

Les jobs HeyGen sont dans `plans/jobs.json` (video_id, statut, fichier).

## Coût HeyGen mesuré

Cinematic Avatar 1080p : les plans 4 et 9 (2 × 6 s) ont coûté **35,33 $** (67,78 → 32,45 $ de portefeuille)
et 2 120 crédits API, soit **≈ 2,95 $ la seconde générée**.

Reste à générer : 45 s (plans 2, 3, 5, 6a, 6b, 6c, 7a, 7b, 8, 10) ≈ **133 $** à ce tarif.
Portefeuille restant : 32,45 $ (≈ 11 s). Pas de tarif 720p mesuré.

## Outils

- `tools/heygen_plans.py` : `submit <plans>`, `status`, `wait` (télécharge dans `plans/`), `quota`, `prompt <plan>`.
  Prompts = prompt maître (dossier § 6.2) + prompt du plan (découpage V2), avatar « Hugo Alurforma », image de référence de l'agence pour les plans d'agence.
- `tools/assemble.py` : montage du film (29,0 s) puis assemblage avec les deux génériques (52,1 s) et la voix B.
  Les plans manquants sont remplacés par un carton bleu nuit. Points d'entrée par plan dans `SEGMENTS`.
  Clips HeyGen à 24 i/s passés à 25 i/s par légère accélération (4 %), sans image doublée.
- `fonts/` : Inter (SIL Open Font License), pour les textes incrustés.

## Montage courant

`out/ALURFORMA_FILM_HUGO_montage.mp4` : 52,1 s, 1920×1080, 25 i/s, −16,1 LUFS, crête −3 dBTP.
Générique d'ouverture → film (plans 1, 4, 9 réels, les autres en cartons) → générique de fin.
Transition A (ivoire → fenêtre du matin) et transition B (panneau émeraude → couloir) en place, texte du plan 10 en deux temps sur la voix.

## Reste à faire

1. Décider du budget HeyGen (recharger ≈ 135 $, ou réduire : plans à 4 s, 720p, fusion 6a/6b/6c et 7a/7b).
2. Générer les plans restants dans l'ordre 2, 5, 8, puis 3, 6, 7, puis 10 ; contrôler visage, tenue, décor.
3. Musique du film (prompt Suno § 6.6) : déposer en `work/musique.wav`, `assemble.py` la mixe automatiquement.
4. Étalonnage unique, textes d'interface lisibles (courrier plan 4, écrans plans 3, 5, 6, 7, 8) si on les veut nets.
5. Masters −14 LUFS (web) et −23 LUFS (TV).
