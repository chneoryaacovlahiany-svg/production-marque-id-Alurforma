"""Render content/storyboard.md from src/data/scenes.json (single source of truth) and copy scenes.json to content/.
Usage: python3 scripts/make_storyboard.py"""
import json, os, shutil
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.join(here, "..")
sc = json.load(open(os.path.join(root, "src/data/scenes.json"), encoding="utf-8"))
shutil.copy(os.path.join(root, "src/data/scenes.json"), os.path.join(root, "content/scenes.json"))

def mmss(t):
    return f"{int(t // 60)}:{t % 60:04.1f}"

L = [f"# Storyboard — {sc['lesson']}", "",
     "Source de vérité : transcription Descript de la voix off (`content/transcript.srt`). Aucune règle métier n'a été ajoutée : chaque mot-clé, coche ou étiquette reprend une phrase de la transcription.", "",
     "## Structure du film", "",
     "| Bloc | Durée | Contenu |", "|---|---|---|",
     "| Générique ALURFORMA | 17,1 s | Master existant `ALURFORMA_GENERIQUE_MASTER_1080p25-V2.mp4` |",
     "| Carton titre peint | 6 s | « Clarifier le cadre en transaction immobilière » — Léa & Hugo entrent et saluent |",
     f"| Leçon partie 1 | 0:00 → {mmss(sc['adBreak']['at'])} | S01 → S09 (qualifier la demande) |",
     f"| Pub mid-roll | {sc['adBreak']['duration']} s | Encart ALURFORMA + jingle « Éclat Fonctuel » — {sc['adBreak']['reason']} |",
     f"| Leçon partie 2 | {mmss(sc['adBreak']['at'])} → 6:32 | S10 → S20 (documents, pouvoirs, assurances, check-list) |",
     "| À retenir | 10 s | Synthèse des enseignements réels |",
     "| Carte de fin | 8 s | Logo + signature de marque |", "",
     "Encarts publicitaires dans la leçon : " + " ; ".join(f"{e['text']} ({mmss(e['startSec'])}–{mmss(e['endSec'])})" for e in sc["encarts"]) + ".", "",
     "## Découpage compact", "",
     "| # | Temps (leçon) | Décor | Mot-clé | Personnages | Transition |", "|---|---|---|---|---|---|"]
for s in sc["scenes"]:
    L.append(f"| {s['id']} | {mmss(s['startSec'])} → {mmss(s['endSec'])} | {s['setting']} | {s['keyword']} | {', '.join(s['characters'])} | {s['transitionIn']} |")
L += ["", "## Scènes détaillées", ""]
for s in sc["scenes"]:
    L += [f"### {s['id']} · {mmss(s['startSec'])} → {mmss(s['endSec'])}", "",
          f"- **Narration** : {s['narration']}",
          f"- **Intention pédagogique** : {s['learningIntent']}",
          f"- **Mot-clé** : {s['keyword']} — *{s['kineticType']}*",
          f"- **Action des personnages** : {s['characterAction']}",
          f"- **Exemple visuel** : {s['visualExample']}",
          f"- **Caméra** : {s['camera']}",
          f"- **Transitions** : entrée `{s['transitionIn']}` / sortie `{s['transitionOut']}`",
          f"- **Sons** : {', '.join(s['sfx'])}", ""]
L += ["## Corrections de transcription", "",
      "Erreurs évidentes de reconnaissance vocale corrigées dans les sous-titres (le sens est inchangé) :", "",
      "- « on **différencie** l'action jusqu'à régularisation » → « on **diffère** l'action jusqu'à régularisation » (6:02)",
      "- « les pouvoirs **express** » → « les pouvoirs **exprès** » (5:54)",
      "- « fautes du professionnel qui **entraîne** » → « qui **entraînent** » (5:23)", "",
      "À signaler : la voix off prononce « Guillemets doubles » à 0:06 (artefact de synthèse vocale lisant les guillemets). Il est conservé dans les sous-titres puisqu'il est audible ; il faudrait le couper dans le podcast source pour une version définitive.", ""]
open(os.path.join(root, "content/storyboard.md"), "w", encoding="utf-8").write("\n".join(L))
print("ok")
