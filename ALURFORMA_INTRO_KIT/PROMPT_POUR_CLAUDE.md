# Message à donner à Claude (autre conversation)

Copier-coller le texte ci-dessous dans la conversation, en joignant le fichier `ALURFORMA_INTRO_KIT.zip`.

---

Je te transmets le **kit d'intro animée ALURFORMA** (fichier `ALURFORMA_INTRO_KIT.zip` joint). Toutes les vidéos de formation que tu produis pour mon LMS ALURFORMA doivent commencer par cette intro de 12 secondes. Elle affiche la marque, la formation, le chapitre, la leçon et la partie.

Démo de ce qu'on attend : https://share.descript.com/view/hyF2fx4joSE (l'exemple est aussi dans `exemple/F01L01_intro.mp4`).

Ce que je te demande :

1. Décompresse le kit et lis `README.md` en entier avant de commencer.
2. Pour chaque vidéo de formation, ajoute une entrée dans `content/intros.json` : `formationCode`, `formationTitle`, `chapter`, `lessonCode`, `lessonTitle`, `part`, `partsTotal`. Si tu ne connais pas un intitulé, demande-le-moi : ne l'invente pas. Les champs facultatifs vides sont masqués.
3. Génère l'intro avec `npm install` puis `node scripts/render_intros.mjs <id>`. Tu obtiens `out/intros/<id>_intro.mp4` et `out/intros/<id>_vignette.png` (vignette pour le LMS).
4. Place l'intro au début de la vidéo :
   - si la vidéo est faite avec Remotion, mets `<LessonIntro … />` en première séquence (`INTRO_FRAMES` = 360 images à 30 i/s) ; le README contient l'exemple de code ;
   - sinon, colle-la avec `scripts/ajouter_intro.sh <intro.mp4> <lecon.mp4> <sortie.mp4>`.
5. Ne modifie ni l'animation, ni le logo, ni les couleurs, ni le jingle : c'est la signature de la marque, identique pour toutes les vidéos.
6. Avant de me livrer, vérifie une image du carton final (vers 11,5 s) : textes lisibles, rien de coupé, la bonne partie affichée.

Si tu ne peux pas exécuter de code dans cette conversation, dis-le-moi : je te fournirai directement les fichiers MP4 d'intro déjà rendus, et tu me diras seulement à quel endroit les placer.
