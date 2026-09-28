#!/usr/bin/env python3
"""Masters du film à partir du montage : web (−14 LUFS, −1 dBTP) et diffusion TV EBU R128 (−23 LUFS, −1 dBTP).
Normalisation loudnorm en deux passes (mesure puis application linéaire), vidéo recopiée sans ré-encodage.

  python3 film/tools/masters.py [film/out/ALURFORMA_FILM_HUGO_montage_voixA.mp4]
"""
import json, pathlib, re, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "film" / "out" / "ALURFORMA_FILM_HUGO_montage_voixA.mp4"
OUT = ROOT / "film" / "out"
TARGETS = {"web": (-14.0, -1.0, 11.0), "broadcast_r128": (-23.0, -1.0, 15.0)}


def measure(src, I, TP, LRA):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(src), "-af", f"loudnorm=I={I}:TP={TP}:LRA={LRA}:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True)
    m = re.search(r"\{[^{}]*\}\s*$", r.stderr, re.S)
    return json.loads(m.group(0))


def master(name, I, TP, LRA):
    s = measure(SRC, I, TP, LRA)
    af = (f"loudnorm=I={I}:TP={TP}:LRA={LRA}:measured_I={s['input_i']}:measured_TP={s['input_tp']}:measured_LRA={s['input_lra']}"
          f":measured_thresh={s['input_thresh']}:offset={s['target_offset']}:linear=true:print_format=summary")
    dest = OUT / f"ALURFORMA_FILM_HUGO_MASTER_1080p25_{name}.mp4"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(SRC), "-map", "0:v", "-map", "0:a", "-c:v", "copy",
                    "-af", af, "-ar", "48000", "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", str(dest)], check=True)
    wav = OUT / f"ALURFORMA_FILM_HUGO_MASTER_{name}.wav"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(dest), "-map", "0:a", "-c:a", "pcm_s24le", str(wav)], check=True)
    v = measure(dest, I, TP, LRA)
    print(f"{name:15s} -> {dest.name}  mesuré : {float(v['input_i']):.1f} LUFS, crête {float(v['input_tp']):.1f} dBTP, LRA {float(v['input_lra']):.1f} LU")


if __name__ == "__main__":
    for name, (I, TP, LRA) in TARGETS.items():
        master(name, I, TP, LRA)
