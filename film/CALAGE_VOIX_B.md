# Calage du découpage sur la voix B (Refined French Storyteller)

Voix B, vitesse 1,10 : 29,13 s, dernier mot à 28,86 s. Fichier `film/vo/VO_B_v110.wav`, temps des mots dans `film/vo/VO_B_v110_mots.json`.
Le film fait 29,0 s ; il commence à 15,50 s absolu (sous le fondu du générique d'ouverture).

| Plan | Film | Absolu | Phrase (début du premier mot) |
|---|---|---|---|
| 1 — Le matin, le téléphone | 0,00 – 2,20 | 15,50 – 17,70 | « Hugo n'a jamais le temps. » (0,08) |
| 2 — Le quotidien (triptyque) | 2,20 – 4,60 | 17,70 – 20,10 | « Des visites, des mandats, des clients… » (1,68) |
| 3 — Plus tard | 4,60 – 6,16 | 20,10 – 21,66 | « … et une formation qu'il remet à plus tard. » |
| 4 — L'échéance | 6,16 – 9,50 | 21,66 – 25,00 | « Jusqu'au jour où l'échéance de sa carte professionnelle approche. » (6,16) |
| 5 — La découverte | 9,50 – 11,66 | 25,00 – 27,16 | « Alors, il découvre Alurforma. » (9,50) |
| 6 — La formation | 11,66 – 15,82 | 27,16 – 31,32 | « Une formation claire, qu'il suit à son rythme… et qu'il valide. » (11,66) |
| 7 — L'attestation | 15,82 – 20,32 | 31,32 – 35,82 | « Son attestation est prête. Les documents utiles à son dossier, aussi. » (15,82) |
| 8 — L'accompagnement | 20,32 – 23,64 | 35,82 – 39,14 | « Pour les démarches administratives, il est accompagné. » (20,32) |
| 9 — Retour au métier | 23,64 – 26,60 | 39,14 – 42,10 | « Hugo peut retourner à son métier. » (23,64) ; « Continuez votre métier. » commence à 25,68, sur sa sortie |
| 10 — L'agence vide → le couloir | 26,60 – 29,00 | 42,10 – 44,50 | « Alurforma simplifie le reste. » (27,38 → 28,86) |

Générique de fin en fondu à partir de 43,30 absolu (plan 10 déjà en bleu nuit), impact du générique à 47,80.

## Durées à générer par plan (marge comprise)

HeyGen Cinematic Avatar accepte 4 à 15 s. On génère toujours un peu plus long que le plan, pour choisir la meilleure portion au montage.

| Plan | Durée montée | À générer | Outil prévu |
|---|---|---|---|
| 1 | 2,2 s | fait (5 s, test validé) | HeyGen |
| 2 (a, b, c) | 0,8 s × 3 | 4 s chacun | InVideo (mains, objets) |
| 3 | 1,6 s | 4 s | InVideo (écran, Hugo flou) |
| 4 | 3,3 s | 6 s | HeyGen |
| 5 | 2,2 s | 5 s | HeyGen |
| 6 (a, b, c) | 1,4 s × 3 | 4 s chacun | HeyGen (a, c), InVideo ou HeyGen (b) |
| 7 | 4,5 s | 6 s (écran) + 4 s (mains) | InVideo |
| 8 | 3,3 s | 5 s | HeyGen |
| 9 | 3,0 s | 6 s | HeyGen |
| 10 | 2,4 s | 5 s | InVideo, puis panneau de verre et texte ajoutés au montage (Remotion) |

## Version voix A

Même découpage, à recaler sur `film/vo/VO_A_mots.json` (28,4 s) : les écarts entre les deux voix sont inférieurs à 0,5 s par phrase, les plans générés servent aux deux versions.
