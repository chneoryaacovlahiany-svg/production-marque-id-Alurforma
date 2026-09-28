#!/usr/bin/env python3
"""Mesures de prosodie des voix off (Praat via parselmouth) : variabilité de hauteur, débit, silences.
Une voix « robot » a typiquement une hauteur très stable (écart-type faible en demi-tons) et un débit régulier."""
import sys, json, pathlib, subprocess, numpy as np, parselmouth

def analyse(path):
    wav = pathlib.Path("/tmp/_vo_an.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(path), "-ac", "1", "-ar", "44100", str(wav)], check=True)
    snd = parselmouth.Sound(str(wav))
    pitch = snd.to_pitch(time_step=0.01, pitch_floor=75, pitch_ceiling=400)
    f0 = pitch.selected_array["frequency"]; f0 = f0[f0 > 0]
    st = 12 * np.log2(f0 / np.median(f0))
    intensity = snd.to_intensity(time_step=0.01)
    ii = intensity.values[0]; sil = (ii < (ii.max() - 25)).mean()
    # variation locale : écart moyen entre trames consécutives (mouvement mélodique)
    mvt = np.abs(np.diff(st)).mean() if len(st) > 1 else 0
    mots = None
    mj = path.with_name(path.stem + "_mots.json")
    if mj.exists():
        w = [x for x in json.loads(mj.read_text()) if not x["word"].startswith("<")]
        parle = sum(x["end"] - x["start"] for x in w); mots = len(w) / parle if parle else None
    return dict(fichier=path.name, duree=round(snd.duration, 2), f0_med=round(float(np.median(f0))), f0_std_st=round(float(st.std()), 2),
                f0_p10_p90_st=round(float(np.percentile(st, 90) - np.percentile(st, 10)), 2), mouvement=round(float(mvt), 3),
                silence=round(float(sil), 2), mots_par_s_parlee=round(mots, 2) if mots else None)

if __name__ == "__main__":
    rows = [analyse(pathlib.Path(p)) for p in sys.argv[1:]]
    keys = list(rows[0].keys())
    print(" | ".join(f"{k:>14s}" for k in keys))
    for r in sorted(rows, key=lambda r: -r["f0_std_st"]):
        print(" | ".join(f"{str(r[k]):>14s}" for k in keys))
