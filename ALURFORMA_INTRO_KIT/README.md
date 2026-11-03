# Kit « Intro animée ALURFORMA »

Intro de 12 secondes à placer **avant chaque vidéo de formation** du LMS ALURFORMA, avec la marque, la formation, le chapitre, la leçon et la partie. Le kit est autonome : il contient le code d'animation, le logo, les personnages, les polices, le jingle et les bruitages.

Exemple rendu : `exemple/F01L01_intro.mp4` (+ vignette `exemple/F01L01_vignette.png`).
Démo en ligne : https://share.descript.com/view/hyF2fx4joSE

## Ce qui se passe (dans l'esprit d'un ident de studio d'animation)

| Temps | Action |
|---|---|
| 0 – 0,8 s | Le mot « Alurforma » est posé au sol. Il manque le « A » en forme de maison ; à sa place, un couple attend. |
| 0,8 – 2,6 s | L'agent ALURFORMA arrive en courant avec sa mallette. |
| 2,6 – 3,5 s | Il trébuche sur un caillou ; la mallette s'envole et **écrase le « o »**, qui rebondit (« boing »). |
| 3,5 – 4,9 s | La mallette s'ouvre, les papiers s'envolent, une feuille lui tombe sur la tête ; il la retire, gêné. |
| 4,9 – 5,8 s | Les papiers rentrent tout seuls dans la mallette, qui revient dans sa main. |
| 5,8 – 7,0 s | Il rejoint le couple et ouvre la mallette. |
| 7,0 – 8,2 s | **La maison en forme de « A » jaillit et complète le logo**, calée sur les impacts du jingle « Éclat Fonctuel ». |
| 8,2 – 9,2 s | Le couple entre dans la maison ; l'agent saute par-dessus le toit. Le logo officiel prend le relais. |
| 9,2 – 12 s | La caméra recule : carton formation · chapitre · leçon · partie. |

## Utilisation

Prérequis : Node.js 18+ et ffmpeg.

```bash
npm install
```

### 1. Renseigner les vidéos

`content/intros.json`, une entrée par vidéo :

```json
{
  "intros": [
    {
      "id": "F01L01",
      "formationCode": "F01",
      "formationTitle": "",
      "chapter": "Chapitre 1",
      "lessonCode": "L01",
      "lessonTitle": "Clarifier le cadre en transaction immobilière",
      "part": 1,
      "partsTotal": null
    }
  ]
}
```

| Champ | Affichage | Obligatoire |
|---|---|---|
| `id` | nom des fichiers produits | oui |
| `formationCode` | « FORMATION 01 » | oui |
| `formationTitle` | « FORMATION 01 · GESTION LOCATIVE » | non (vide = masqué) |
| `chapter` | pastille « CHAPITRE 1 » | non |
| `lessonCode` | pastille « LEÇON 01 » | non |
| `lessonTitle` | grand titre | oui |
| `part` / `partsTotal` | « PARTIE 2 » ou « PARTIE 2 / 3 » | non (`null` = masqué) |

### 2. Générer les intros

```bash
npm run intros              # toutes les entrées
node scripts/render_intros.mjs F01L01   # une seule
```

Résultat dans `out/intros/` :

- `<id>_intro.mp4` : 1920×1080, 30 i/s, H.264 + son ;
- `<id>_vignette.png` : image fixe (vignette du LMS).

Comptez environ 1 à 2 minutes par intro.

### 3. Coller l'intro devant une vidéo de formation

Quel que soit l'outil qui a produit la leçon (Remotion, HeyGen, Descript, enregistrement d'écran…) :

```bash
scripts/ajouter_intro.sh out/intros/F01L01_intro.mp4 ma_lecon.mp4 ma_lecon_avec_intro.mp4
```

La leçon est remise au format de l'intro (1080p, 30 i/s, son stéréo). Une vidéo sans son reçoit une piste silencieuse.

### Ou l'intégrer dans une composition Remotion existante

Copier `src/intro/`, `src/components/characters/`, `src/lib/timeline.ts`, `src/theme.ts` et le contenu de `public/` dans le projet, puis :

```tsx
import { Series } from "remotion";
import { INTRO_FRAMES, LessonIntro } from "./intro/LessonIntro";

<Series>
  <Series.Sequence durationInFrames={INTRO_FRAMES}>
    <LessonIntro formationCode="F01" chapter="Chapitre 1" lessonCode="L01" lessonTitle="…" part={1} />
  </Series.Sequence>
  <Series.Sequence durationInFrames={dureeDeLaLecon}>{/* la leçon */}</Series.Sequence>
</Series>
```

### Prévisualiser et ajuster

```bash
npm run studio
```

Ouvrir la composition `LessonIntro` : les champs se modifient en direct dans le panneau des propriétés.

## Comment c'est construit

```text
src/
├── intro/
│   ├── LessonIntro.tsx   la mise en scène : chronologie, caméra, gag, carton, son
│   └── LogoParts.tsx     le logo reconstruit en pièces animables + mallette + feuilles
├── components/characters/
│   ├── Character.tsx     rig SVG des personnages (course, marche, gestes, clignements…)
│   ├── looks.ts          fiches : AGENT (costume marine, cravate émeraude), CLIENT_F, CLIENT_M
│   └── poses.ts          poses de bras et transitions naturelles (épaule puis coude)
├── lib/timeline.ts       aides d'animation (ramp, pop, span)
└── theme.ts              couleurs ALURFORMA et polices
public/
├── brand/logo.png        logo officiel (affiché à la fin)
├── fonts/                Fraunces (titres), Nunito, Outfit (marque)
├── audio/jingle.mp3      « Éclat Fonctuel » (impacts de fin à 7,5 / 7,75 / 8,2 s)
├── audio/music-chord.mp3 accord de fin sous le carton
├── sfx/                  pas, whoosh, boing, papiers, étincelles…
└── tex/paper.jpg         grain de papier
```

Points clés :

- **Le logo s'anime puis passe la main au logo officiel.** Pendant l'action, le « A »-maison et les lettres « Alurforma » sont redessinés en SVG. Leurs positions ont été mesurées sur le logo officiel (`LETTERS`, `HouseMark`), ce qui permet d'écraser le « o » ou de faire jaillir la maison. À 9 s, sous des étincelles, le PNG officiel le remplace : le logo final est exactement celui de la charte.
- **Espace logo.** Toute la scène est dessinée dans la boîte 1250×400 du logo (ligne de base à y = 258). Une seule « caméra » (`CAM` dans `LessonIntro.tsx` : temps, centre, zoom) la suit en plan rapproché, puis recule sur le logo complet.
- **Personnages.** Ils utilisent le même rig que les films de formation ALURFORMA : style animation peinte, trait chaud, ombres en deux tons, mouvements avec élan et retombée. L'agent court : foulée, buste penché, bras qui balancent.
- **Son.** Le jingle démarre à 0 s : ses impacts de fin tombent pile quand la maison jaillit. Les bruitages sont listés dans `SFX` en bas de `LessonIntro.tsx`.
- **Mise en page du carton.** Le logo en haut, le texte au centre, l'agent à gauche du logo : rien ne se superpose. Les titres longs passent automatiquement sur 2 lignes, en taille réduite.

## Règles de marque

- Ne pas modifier le logo final (PNG officiel) ni ses couleurs : marine `#0f1f4b`, émeraude `#14915f`, or `#c9a45c`, fond crème `#fbf8f1`.
- Ne pas inventer les intitulés : les reprendre du programme de formation.
- Garder la même intro pour toutes les vidéos : c'est la signature de la marque.
