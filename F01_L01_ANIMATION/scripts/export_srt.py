"""Write the burned-in subtitles as an SRT aligned on the FINAL film timeline (opener + title + ad offsets).
Usage: python3 scripts/export_srt.py out/F01L01.fr.srt"""
import json, os, sys
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.join(here, "..")
tr = json.load(open(os.path.join(root, "src/data/transcript.json"), encoding="utf-8"))
sc = json.load(open(os.path.join(root, "src/data/scenes.json"), encoding="utf-8"))
FPS = 30
LESSON_START = round(17.13 * FPS) + 6 * FPS  # générique + title card (see src/lib/timeline.ts)
AD_AT, AD = sc["adBreak"]["at"], round(sc["adBreak"]["duration"] * FPS)
NAMES = {"LEA": "Léa", "HUGO": "Hugo"}
MAX = 68

def g(t):  # lesson seconds → film seconds
    return (LESSON_START + round(t * FPS) + (AD if t >= AD_AT else 0)) / FPS

def ts(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{sec:02},{ms:03}"

out, n = [], 0
for s in tr["segments"]:
    words, parts, cur = s["text"].split(" "), [], ""
    for w in words:
        if len((cur + " " + w).strip()) > MAX and cur:
            parts.append(cur.strip()); cur = w
        else:
            cur += " " + w
    if cur.strip():
        parts.append(cur.strip())
    total = sum(len(p) for p in parts); t = s["start"]
    for p in parts:
        d = (s["end"] - s["start"]) * len(p) / total
        n += 1
        out.append(f"{n}\n{ts(g(t))} --> {ts(g(t + d))}\n{NAMES[s['speaker']]} : {p}\n")
        t += d
open(sys.argv[1], "w", encoding="utf-8").write("\n".join(out))
print(n, "cues →", sys.argv[1])
