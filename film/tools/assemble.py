#!/usr/bin/env python3
"""Montage du film « Le temps de Hugo » : plans générés + voix B + génériques.

  python3 film/tools/assemble.py            # film/out/ALURFORMA_FILM_HUGO_montage.mp4 (52,1 s)
  python3 film/tools/assemble.py --film     # seulement film/work/film.mp4 (29,0 s, muet)

Les plans absents de film/plans/jobs.json sont remplacés par un carton bleu nuit (comme l'animatique).
Timecodes : film/CALAGE_VOIX_B.md et film/DECOUPAGE_V2_HUGO.md. Assemblage : dossier § 10.
"""
import json, pathlib, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
FILM = ROOT / "film"
FONT = str(FILM / "fonts" / "Inter-SemiBold.ttf")
FONT_R = str(FILM / "fonts" / "Inter-Regular.ttf")
INTRO = ROOT / "ALURFORMA_CLAUDE_EXPORT" / "ALURFORMA_GENERIQUE_MASTER_1080p25-V2.mp4"
OUTRO = ROOT / "ALURFORMA_CLAUDE_EXPORT" / "06_GENERIQUE_V26_1080P.mp4"
VO = FILM / "vo" / "VO_B_v110.wav"
WORK = FILM / "work"; OUT = FILM / "out"
FILM_START = 15.5     # absolu
OUTRO_START = 43.3    # absolu
NAVY, EMERALD, GOLD, IVORY = "0x041d4b", "0x0b8f63", "0xc9a56a", "0xfaf8f3"

# (clé, début film, fin film, titre, point d'entrée dans le clip généré)
# Le point d'entrée « in » se règle plan par plan après visionnage.
SEGMENTS = [
    ("1",  0.00,  2.20, "Le matin, le téléphone", 0.3),
    ("2",  2.20,  4.60, "La visite", 0.3),
    ("3",  4.60,  6.16, "Plus tard", 0.3),
    ("4",  6.16,  9.50, "L'échéance", 0.5),     # lecture du courrier, agenda, respiration (avant le regard caméra)
    ("5",  9.50, 11.66, "La découverte", 0.5),
    ("6a", 11.66, 13.05, "La formation — la leçon", 0.5),
    ("6b", 13.05, 14.44, "La formation — entre deux visites", 0.5),
    ("6c", 14.44, 15.82, "La formation — la validation", 0.5),
    ("7a", 15.82, 18.50, "L'attestation — à l'écran", 0.3),
    ("7b", 18.50, 20.32, "L'attestation — la chemise", 0.5),
    ("8",  20.32, 23.64, "L'accompagnement", 0.5),
    ("9",  23.64, 26.60, "Retour au métier", 2.8),   # veste prise, sortie, poignée de main
    ("10", 26.60, 29.00, "L'agence vide → le couloir", 0.3),
]
PLAN1 = FILM / "plans" / "PLAN01_test_heygen_5s_1080p.mp4"


def clip_files():
    files = {"1": PLAN1} if PLAN1.exists() else {}
    jobs_path = FILM / "plans" / "jobs.json"
    if jobs_path.exists():
        for key, j in json.loads(jobs_path.read_text()).items():
            if j.get("file") and j.get("use", True):
                files[key] = ROOT / j["file"]
    return files


def txt(name, s):
    p = WORK / f"txt_{name}.txt"; p.write_text(s); return str(p)


def build_film():
    WORK.mkdir(exist_ok=True)
    files = clip_files()
    inputs, filters, labels = [], [], []
    for i, (key, t0, t1, title, inpt) in enumerate(SEGMENTS):
        dur = round(t1 - t0, 3)
        if key in files:
            inputs += ["-i", str(files[key])]
            idx = len(inputs) // 2 - 1
            # clips HeyGen à 24 i/s : passage à 25 i/s par légère accélération (pas d'image doublée)
            filters.append(
                f"[{idx}:v]trim=start={inpt},setpts=PTS-STARTPTS,setpts=PTS*24/25,fps=25,"
                f"scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p,trim=duration={dur},setpts=PTS-STARTPTS[s{i}]")
        else:
            filters.append(
                f"color=c={NAVY}:s=1920x1080:r=25:d={dur},format=yuv420p,"
                f"drawtext=fontfile={FONT}:textfile={txt(key+'a', 'PLAN '+key.upper())}:fontcolor={IVORY}:fontsize=44:x=120:y=420,"
                f"drawtext=fontfile={FONT_R}:textfile={txt(key+'b', title)}:fontcolor={IVORY}@0.85:fontsize=30:x=120:y=490,"
                f"drawtext=fontfile={FONT_R}:textfile={txt('gen', 'à générer')}:fontcolor={GOLD}:fontsize=22:x=120:y=560[s{i}]")
        labels.append(f"[s{i}]")
    n = len(SEGMENTS)
    filters.append("".join(labels) + f"concat=n={n}:v=1:a=0[cat]")
    # Plan 10 : panneau de verre émeraude à liseré or (26,9 → 29,0), virage bleu nuit dans son sillage, texte en deux temps.
    p0, pdur = 26.9, 2.1
    filters.append(
        f"color=c={NAVY}:s=1920x1080:r=25:d=29.0,format=yuv420p[navy];"
        f"[cat][navy]blend=all_expr='A*(1-P)+B*P':all_opacity=1[dk]".replace(
            "P", f"clip((T-{p0})/{pdur}-((X)/1920)*0.6,0,1)*0.85"))
    filters.append(
        f"color=c={EMERALD}@0.42:s=360x1080:r=25:d=29.0,format=yuva420p[pane];"
        f"color=c={GOLD}@0.9:s=6x1080:r=25:d=29.0,format=yuva420p[edge];"
        f"[dk][pane]overlay=x='-360+(1920+360)*clip((t-{p0})/{pdur},0,1)':y=0:enable='between(t,{p0},{p0+pdur})':format=auto[ov1];"
        f"[ov1][edge]overlay=x='-6+(1920+366)*clip((t-{p0})/{pdur},0,1)':y=0:enable='between(t,{p0},{p0+pdur})':format=auto[ov2]")
    t_a, t_b = 25.68, 27.38  # débuts des deux phrases dans la voix B
    filters.append(
        f"[ov2]drawtext=fontfile={FONT}:textfile={txt('base1', 'Continuez votre métier.')}:fontcolor={IVORY}:fontsize=64:"
        f"x=(w-text_w)/2:y=h/2-90:alpha='clip((t-{t_a})/0.5,0,1)':enable='gte(t,{t_a})',"
        f"drawtext=fontfile={FONT}:textfile={txt('base2', 'Alurforma simplifie le reste.')}:fontcolor={IVORY}:fontsize=64:"
        f"x=(w-text_w)/2:y=h/2+10:alpha='clip((t-{t_b})/0.5,0,1)':enable='gte(t,{t_b})'[v]")
    cmd = ["ffmpeg", "-y", "-v", "warning", "-stats", *inputs, "-filter_complex", ";".join(filters),
           "-map", "[v]", "-r", "25", "-t", "29.0", "-c:v", "libx264", "-preset", "medium", "-crf", "16",
           "-pix_fmt", "yuv420p", str(WORK / "film.mp4")]
    subprocess.run(cmd, check=True)
    print("film/work/film.mp4 :", ", ".join(k for k, *_ in SEGMENTS if k in files), "| cartons :",
          ", ".join(k for k, *_ in SEGMENTS if k not in files) or "aucun")


def build_full():
    OUT.mkdir(exist_ok=True)
    music = WORK / "musique.wav"   # musique du film (§ 6.6), quand elle existera
    inputs = ["-i", str(INTRO), "-i", str(WORK / "film.mp4"), "-i", str(OUTRO), "-i", str(VO)]
    fc = [
        f"[0:v][1:v]xfade=transition=fade:duration=1.5:offset={FILM_START}[v01]",
        f"[v01][2:v]xfade=transition=fade:duration=1.2:offset={OUTRO_START}[v]",
        f"[3:a]aformat=sample_rates=48000:channel_layouts=stereo,loudnorm=I=-18:TP=-2,adelay={int(FILM_START*1000)}|{int(FILM_START*1000)}[vo]",
        f"[2:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay={int(OUTRO_START*1000)}|{int(OUTRO_START*1000)}[out]",
        "[0:a]aformat=sample_rates=48000:channel_layouts=stereo[in]",
    ]
    mix = "[in][vo][out]"; n = 3
    if music.exists():
        inputs += ["-i", str(music)]
        fc.append("[4:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay=14000|14000,"
                  "afade=t=in:st=14:d=3,afade=t=out:st=43:d=2,volume=-4dB[mus]")
        mix += "[mus]"; n = 4
    fc.append(f"{mix}amix=inputs={n}:normalize=0:duration=longest[a]")
    dest = OUT / "ALURFORMA_FILM_HUGO_montage.mp4"
    cmd = ["ffmpeg", "-y", "-v", "error", "-stats", *inputs, "-filter_complex", ";".join(fc),
           "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p",
           "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
           "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", "-t", "52.1", str(dest)]
    subprocess.run(cmd, check=True)
    print("->", dest.relative_to(ROOT))


if __name__ == "__main__":
    build_film()
    if "--film" not in sys.argv:
        build_full()
