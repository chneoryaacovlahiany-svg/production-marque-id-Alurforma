# Découpage V2 — « Hugo à l'écran » (calé sur la voix B, 29,0 s)

Règle : **Hugo est cadré dans 9 plans sur 10**, en action. Les objets (agenda, courrier, écran, attestation, téléphone)
n'apparaissent jamais seuls : ils sont dans ses mains ou en amorce devant lui. Le seul plan sans lui est le dernier,
l'agence vide qui devient le couloir du générique de fin.

Temps de présence de Hugo à l'écran : 26,6 s sur 29,0 s (92 %).

Timecodes **film** (0 = première image du film ; le film commence à 15,50 s absolu). Voix : `film/vo/VO_B_v110.wav`.

| # | Film | Plan | Hugo | Voix | Outil | À générer |
|---|---|---|---|---|---|---|
| 1 | 0,00 – 2,20 | **Le matin, le téléphone.** Hugo à son bureau, téléphone à l'épaule, il écrit dans l'agenda, tourne une page. L'ivoire du générique devient la surexposition de la fenêtre. Lente poussée avant. | Oui, plan moyen | « Hugo n'a jamais le temps. » | HeyGen | **fait** (test validé, 5 s) |
| 2 | 2,20 – 4,60 | **La visite.** Hugo dans l'embrasure d'un appartement lumineux, il remet un trousseau de clés à un jeune couple, sourire bref, il regarde déjà sa montre. | Oui, plan moyen, trois-quarts | « Des visites, des mandats, des clients… » | HeyGen | 5 s |
| 3 | 4,60 – 6,16 | **Plus tard.** Hugo de retour au bureau, l'écran en amorce : une notification « Formation continue · à planifier ». Il la referme d'un geste sans la regarder et reprend le téléphone. Cadré sur lui, l'écran net au premier plan. | Oui, plan rapproché | « … et une formation qu'il remet à plus tard. » | HeyGen | 4 s |
| 4 | 6,16 – 9,50 | **L'échéance.** Le soir, agence vide, lampe allumée. Veste sur la chaise, Hugo ouvre un courrier et lit ; on lit avec lui « Renouvellement de la carte professionnelle — dossier à préparer ». Il pose la lettre, regarde l'agenda, s'arrête, respire. Sur la cloison vitrée derrière lui, le reflet de la lampe devient un filet vertical or. | Oui, rapproché puis gros plan | « Jusqu'au jour où l'échéance de sa carte professionnelle approche. » | HeyGen | 6 s |
| 5 | 9,50 – 11,66 | **La découverte.** Même soir. Il tape ; la caméra tourne autour de lui et de l'écran, qui affiche alurforma.fr. La lumière ivoire de l'écran remplace la lampe sur son visage. Il se penche légèrement. | Oui, rapproché en arc | « Alors, il découvre Alurforma. » | HeyGen | 5 s |
| 6 | 11,66 – 15,82 | **La formation.** Trois moments : (a) le soir, il suit une leçon, un formateur à l'écran, il note quelque chose ; (b) le lendemain, siège passager d'une voiture, il termine une leçon sur son téléphone et jette un œil à l'immeuble en face ; (c) fin d'après-midi au bureau, la coche « Évaluation validée » apparaît en amorce, il se cale dans son fauteuil, épaules qui tombent. | Oui, dans les trois | « Une formation claire, qu'il suit à son rythme… et qu'il valide. » | HeyGen ×3 | 4 s + 4 s + 4 s |
| 7 | 15,82 – 20,32 | **L'attestation.** Hugo devant l'écran : « Attestation de formation » se compose, puis la liste « Documents utiles à votre dossier ». Il clique. Raccord : il prend l'attestation qui sort de l'imprimante et la glisse dans une chemise bleu nuit ; on voit son visage au-dessus des mains. Un reflet de verre émeraude à liseré or balaie l'écran puis la chemise. | Oui, rapproché, puis plan sur ses mains avec le visage | « Son attestation est prête. Les documents utiles à son dossier, aussi. » | HeyGen (écran) + HeyGen ou InVideo (imprimante) | 5 s + 4 s |
| 8 | 20,32 – 23,64 | **L'accompagnement.** Hugo lit un message sur son téléphone, tenu à hauteur de poitrine, l'écran lisible en amorce : « Votre dossier de prise en charge est complet. Nous vous accompagnons pour la suite. — Votre conseillère Alurforma ». Il expire, demi-sourire, pose le téléphone. | Oui, gros plan | « Pour les démarches administratives, il est accompagné. » | HeyGen | 5 s |
| 9 | 23,64 – 26,60 | **Retour au métier.** Hugo referme le portable, prend ses clés et sa veste, traverse l'agence et sort par la porte vitrée, qui finit **au centre du cadre**. Dehors, un client l'attend, poignée de main vue à travers la vitre. Travelling arrière lent. | Oui, plan large | « Hugo peut retourner à son métier. » puis « Continuez votre métier. » (25,68) | HeyGen | 6 s |
| 10 | 26,60 – 29,00 | **L'agence vide → le couloir.** Plan fixe, porte au centre, lumière derrière. Texte « Continuez votre métier. / Alurforma simplifie le reste. ». Un panneau de verre émeraude traverse l'image, l'agence passe en bleu nuit, la lumière se resserre en filet, deux reflets bleu et vert au sol. Fondu vers le générique de fin à 43,30 absolu. | Non (transition de marque) | « Alurforma simplifie le reste. » (27,38) | InVideo ou HeyGen (agence vide) + Remotion (panneau, texte) | 5 s |

## Ce qui change par rapport au dossier initial

- Plan 2 : plus un triptyque d'objets (clés, agenda, téléphone), mais **Hugo en visite**, qui remet les clés lui-même.
- Plan 3 : l'écran n'est plus seul, **Hugo est net dans le cadre** et c'est lui qui balaie la notification.
- Plan 7 : plus d'insert écran sans personne ; **Hugo devant l'écran**, puis ses mains avec son visage.
- Plan 8 : plus d'insert téléphone puis contre-champ ; **un seul plan sur Hugo**, téléphone lisible en amorce.
- Plan 10 : inchangé, c'est la transition vers le générique de fin.

## Prompts HeyGen (Cinematic Avatar, look `f00f1a4be9e78e78d9fce23795894b5e`, référence décor `27d9774fa33b44a2b90474d410ef5e99`)

Le prompt maître (dossier § 6.2) est repris en tête de chacun. `aspect_ratio: 16:9`, `resolution: 1080p`.

**Plan 2 (5 s)** — Medium three-quarter shot, 50 mm. Hugo (the avatar) stands in the doorway of a bright, empty, freshly painted apartment with tall windows, handing a set of keys to a young couple whose backs are partly to camera. A brief warm smile, then he glances at his steel watch. Soft daylight, warm highlights, navy shadows. Mood: momentum, a full day. Smooth, minimal camera drift.

**Plan 3 (4 s)** — Close medium shot, 50 mm, shallow focus, back at the agency (reference image). Hugo in focus at his desk, the laptop screen in the lower foreground edge showing a discreet ivory notification card reading "Formation continue · à planifier". Without looking at it he dismisses it with one swipe and picks up his phone. Morning window light. Mood: quiet avoidance.

**Plan 4 (6 s)** — Evening at the agency (reference image), windows dark blue, only the brass desk lamp on. Hugo, blazer hung on the chair, white shirt sleeves, opens a letter and reads; the paper is readable: "Renouvellement de la carte professionnelle — dossier à préparer". He sets it down, looks at the open diary, stops, breathes. Camera holds, then a slow push into a close-up, 85 mm. Behind him the lamp's reflection on the glass partition forms a thin vertical line of gold light. Mood: realization, contained worry.

**Plan 5 (5 s)** — Same evening. Hugo types; the laptop shows the Alurforma website (midnight-navy header, ivory page, emerald accents, headline "Renouvelez votre carte professionnelle sans perdre de temps."). The camera arcs slowly around him and the screen, 35 mm; the ivory screen light replaces the lamp on his face. He leans in slightly. Mood: curiosity, first relief.

**Plan 6a (4 s)** — Profile shot, 50 mm, evening lamp light. Hugo watches a video lesson on the laptop, a trainer speaking in a clean navy-and-ivory interface labelled "Leçon 2 / 3", and writes one note in his diary. Mood: focus.

**Plan 6b (4 s)** — Daytime, passenger seat of a parked car, shot from the dashboard, 35 mm. Hugo, same navy blazer, finishes a lesson on his phone in the Alurforma interface, glances out at a building across the street, then back to the screen. Soft daylight through the windshield. Mood: at his own pace.

**Plan 6c (4 s)** — Late afternoon at the agency (reference image), frontal medium shot, laptop screen in the lower foreground edge. An emerald check mark appears with "Évaluation validée". Hugo leans back into his chair, shoulders dropping, a small exhale. Mood: ease.

**Plan 7a (5 s)** — Agency, soft daylight, medium close shot over the laptop. Hugo watches a document titled "Attestation de formation" compose itself on an ivory page with a navy header, then a short list "Documents utiles à votre dossier" (attestation, programme, durée, date). He clicks. A soft emerald glass reflection with a thin gold edge sweeps across the screen. Mood: things falling into place.

**Plan 7b (4 s)** — Close shot, 50 mm, Hugo's face above his hands: he takes a freshly printed attestation from the printer and slides it into a midnight-navy folder labelled "Carte professionnelle — renouvellement". Mood: order.

**Plan 8 (5 s)** — Close-up, 85 mm, warm daylight at the agency. Hugo holds his phone at chest height, screen readable in the lower foreground: a clean navy-and-ivory message "Votre dossier de prise en charge est complet. Nous vous accompagnons pour la suite. — Votre conseillère Alurforma". He reads, exhales slowly, a half smile, and sets the phone down. Mood: relief.

**Plan 9 (6 s)** — Wide shot, slow dolly backwards, 35 mm, late-afternoon golden backlight, agency from the reference image. Hugo closes the laptop, takes his keys and blazer, walks through the agency and out through the glass entrance door, which ends up exactly centered in the frame. Outside, a client waits and they shake hands, seen through the glass. Mood: confidence, lightness.

**Plan 10 (5 s)** — Static wide shot, 35 mm, the same agency, empty, the glass entrance door centered with warm light behind it, no people. Calm, still, late afternoon turning to dusk. (Le panneau de verre, le virage bleu nuit et le texte sont ajoutés au montage.)

## Ordre de génération

1. Plans 4 et 9 (ils portent le soir et le raccord de sortie).
2. Plans 2, 5, 8.
3. Plans 3, 6a, 6b, 6c, 7a, 7b.
4. Plan 10.

Chaque plan : une génération, contrôle sur planche d'images, reprise uniquement si le visage, la tenue ou le décor dérivent.
