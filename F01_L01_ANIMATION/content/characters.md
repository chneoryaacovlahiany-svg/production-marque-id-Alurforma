# Fiches de continuité — personnages F01 L01

Un seul rig SVG (`src/components/characters/Character.tsx`) et une fiche par personnage (`looks.ts`) : le même personnage garde exactement le même visage, la même coiffure et les mêmes vêtements dans toutes les scènes. La bouche de Léa et de Hugo est animée par l'enveloppe réelle de la voix off (`src/data/envelope.json`), uniquement quand la transcription indique que c'est leur tour de parole.

## Style (V2) : animation japonaise peinte à la main

Direction artistique originale inspirée de l'animation 2D artisanale (aucun personnage existant n'est reproduit) :

- trait fin et chaud (brun `#4b3328`), ombres en deux tons (cel shading), lumière venant d'en haut à gauche ;
- visages d'adultes : yeux en amande avec iris sombre et un seul reflet, paupière supérieure marquée, nez suggéré par une ombre, petite bouche, joues rosées en dégradé ;
- cheveux en mèches avec reflet peint ; corps aux épaules tombantes, taille, genoux, plis de vêtements ; vraies mains (pouce, doigts).

## Mouvement (V2) : plus fluide, plus humain

- **Gestes calés sur la voix** : les accents de la parole (syllabes appuyées) pilotent mains et hochements de tête via une simulation de ressorts amortis précalculée (`src/data/motion.json`, `scripts/prepare_transcript.py`) : élan, léger dépassement puis retour, sans à-coups.
- **Action décalée** : l'épaule part la première, le coude suit 2 images plus tard avec une petite retombée.
- **Écoute active** : celui qui ne parle pas hoche doucement la tête.
- **Vie au repos** : respiration (épaules), transfert de poids d'une hanche à l'autre, micro-mouvements de tête, regards qui bougent (saccades), clignements en 3 images.
- **Marche** : bras en balancier opposé aux jambes, pied qui se lève, rebond du corps.
- **Cheveux et vêtements** : léger vent, les cheveux suivent la tête avec un retard.

Les voix ont été attribuées par mesure de hauteur (pitch) : Speaker 1 ≈ 245 Hz → **Léa**, Speaker 2 ≈ 110 Hz → **Hugo**.

| | Léa | Hugo | M. Delmas | Inès | Acheteur |
|---|---|---|---|---|---|
| Rôle | Experte, voix 1 du podcast | Co-animateur curieux, voix 2 | Client du cas pratique (cité dans le cours) | Collaboratrice habilitée (exemple d'attestation) | Acheteur intéressé (cas Delmas) |
| Morphologie | Taille moyenne, épaules fines | Grand (×1,05), épaules larges | Un peu plus petit (×0,95), léger ventre | Taille moyenne (×0,98) | Grand (×1,02) |
| Visage | Yeux bruns, joues rosées | Yeux bruns, lunettes rondes | Yeux gris-bleu, moustache blanche | Peau mate, yeux sombres | Yeux bruns |
| Coiffure | Carré châtain foncé, frange sur le côté | Châtain, mèches souples en bataille, épi | Cheveux blancs sur les tempes, casquette plate | Noire, queue de cheval qui se balance, élastique émeraude | Noire, courte et nette |
| Vêtements | Gilet vert sauge à boutons dorés, blouse crème, pantalon marine | Pull sans manches ocre, chemise bleu ciel manches retroussées, pantalon taupe | Veste velours marron, chemise crème, pantalon gris | Blazer marine, chemise blanche, badge sur cordon émeraude | Veste bleue, pantalon anthracite |
| Accessoires | Boucles d'oreilles dorées | — | Casquette | Badge professionnel | — |
| Personnalité visuelle | Posée, précise, gestes de présentation | Spontané, enthousiaste, hausse les épaules | Pressé puis rassuré | Professionnelle, souriante | Enthousiaste |
| Couleur de sous-titre | Émeraude `#14915f` | Ocre `#d48a2c` | — | — | — |

## Expressions et gestes disponibles

- Humeurs : `smile`, `happy`, `neutral`, `surprised`, `worried`, `focused`.
- Poses de bras : `rest`, `explain`, `open`, `shrug`, `hold`, `holdR`, `pointR/L`, `pointUpR/L`, `phone`, `think`, `wave`, `offerR/L`, `cheer`, `handsHips`, `fingerUp`.
- Vie automatique : respiration, balancement, clignement des yeux (3–5 s), hochement de tête et gestes de mains pendant la parole, marche.
- Objets tenus : téléphone, dossier, document scellé, loupe, clé, carte professionnelle, stylo.

Planche de référence : composition `CharacterSheet` dans Remotion Studio.
