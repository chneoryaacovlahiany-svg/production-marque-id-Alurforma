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
MUSIC = ROOT / "ALURFORMA_CLAUDE_EXPORT" / "Warm Piano Motif.mp3"   # musique du film (Suno, prompt § 6.6), choisie par le client
VO = FILM / "vo" / "VO_A_v100.wav"    # voix retenue : French Expert Narrator à 1,0 ; --vo <fichier> pour en essayer une autre
WORK = FILM / "work"; OUT = FILM / "out"
FILM_START = 15.5     # absolu
FILM_DUR = 29.0       # recalculé sur la voix : dernier mot + 0,15 s, minimum 29,0
OUTRO_START = FILM_START + FILM_DUR - 1.2    # absolu (fondu de 1,2 s)
NAVY, EMERALD, GOLD, IVORY = "0x041d4b", "0x0b8f63", "0xc9a56a", "0xfaf8f3"

# (clé, début film, fin film, titre, point d'entrée dans le clip généré)
# Le point d'entrée « in » se règle plan par plan après visionnage.
SEGMENTS = [
    ("1",  0.00,  2.20, "Le matin, le téléphone", 0.3),
    ("2",  2.20,  4.60, "La visite", 0.5),          # remise des clés, sourire
    ("3",  4.60,  6.16, "Plus tard", 1.2),          # notification visible puis balayée
    ("4",  6.16,  9.50, "L'échéance", 0.5),     # lecture du courrier, agenda, respiration (avant le regard caméra)
    ("5",  9.50, 11.66, "La découverte", 1.5),      # arc autour de l'écran alurforma.fr
    ("6a", 11.66, 13.05, "La formation — la leçon", 0.5),
    ("6b", 13.05, 14.44, "La formation — entre deux visites", 0.5),
    ("6c", 14.44, 15.82, "La formation — la validation", 0.5),
    ("7a", 15.82, 18.50, "L'attestation — à l'écran", 0.3),
    ("7b", 18.50, 20.32, "L'attestation — la chemise", 0.5),
    ("8",  20.32, 23.64, "L'accompagnement", 1.0),   # lecture, demi-sourire, pose le téléphone
    ("9",  23.64, 26.60, "Retour au métier", 2.5),   # veste prise, sortie, poignée de main
    ("10", 26.60, 29.00, "L'agence vide → le couloir", 0.3),
]
PLAN1 = FILM / "plans" / "PLAN01_test_heygen_5s_1080p.mp4"

# Premier mot de chaque plan dans la voix off (index du mot, en comptant sans les balises) : plan -> mot
# « Hugo(0) n'a jamais le temps. Des(5) visites, des mandats, des clients… et(11) une formation qu'il remet à plus tard.
#   Jusqu'au(19) jour où l'échéance de sa carte professionnelle approche. Alors,(29) il découvre Alurforma.
#   Une(33) formation claire, qu'il suit à son rythme… et qu'il valide. Son(45) attestation est prête. Les documents utiles à son dossier, aussi.
#   Pour(56) les démarches administratives, il est accompagné. Hugo(63) peut retourner à son métier. Continuez(69) votre métier. Alurforma(72) simplifie le reste. »
PHRASES = {"1": "Hugo", "2": "Des", "3": "et", "4": "Jusqu'au", "5": "Alors,", "6a": "Une", "7a": "Son", "8": "Pour", "9": "Hugo", "9b": "Continuez", "10": "Alurforma"}


def retime_from_vo(vo_path):
    """Recale SEGMENTS, FILM_DUR, OUTRO_START et les temps des textes sur les mots de la voix off."""
    global SEGMENTS, FILM_DUR, OUTRO_START, T_A, T_B
    mj = vo_path.with_name(vo_path.stem + "_mots.json")
    if not mj.exists():
        print("pas de", mj.name, ": découpage d'origine conservé"); return
    words = [w for w in json.loads(mj.read_text()) if not w["word"].startswith("<")]
    starts = {}
    i = 0
    for plan, first in [("1", "Hugo"), ("2", "Des"), ("3", "et"), ("4", "Jusqu'au"), ("5", "Alors,"), ("6a", "Une"), ("7a", "Son"),
                        ("8", "Pour"), ("9", "Hugo"), ("9b", "Continuez"), ("10", "Alurforma")]:
        while i < len(words) and words[i]["word"] != first:
            i += 1
        if i >= len(words):
            print("mot introuvable :", first, ": découpage d'origine conservé"); return
        starts[plan] = words[i]["start"]; i += 1
    end = words[-1]["end"]
    FILM_DUR = max(29.0, round(end + 0.15, 2))
    OUTRO_START = round(FILM_START + FILM_DUR - 1.2, 2)
    b = {"1": 0.0, "2": starts["2"], "3": starts["3"], "4": starts["4"], "5": starts["5"], "6a": starts["6a"],
         "7a": starts["7a"], "8": starts["8"], "9": starts["9"], "10": starts["10"] - 0.8, "end": FILM_DUR}
    # sous-plans 6 et 7 : tiers / 60-40
    d6 = b["7a"] - b["6a"]; b["6b"] = b["6a"] + d6 / 3; b["6c"] = b["6a"] + 2 * d6 / 3
    d7 = b["8"] - b["7a"]; b["7b"] = b["7a"] + 0.6 * d7
    order = ["1", "2", "3", "4", "5", "6a", "6b", "6c", "7a", "7b", "8", "9", "10", "end"]
    new = []
    for key, t0, t1, title, inpt in SEGMENTS:
        k = order.index(key)
        new.append((key, round(b[key], 2), round(b[order[k + 1]], 2), title, inpt))
    SEGMENTS = new
    T_A, T_B = round(starts["9b"], 2), round(starts["10"], 2)
    print(f"découpage recalé sur {vo_path.name} : film {FILM_DUR} s, générique de fin à {OUTRO_START} s absolu")
    for seg in SEGMENTS:
        print(f"  plan {seg[0]:3s} {seg[1]:6.2f} – {seg[2]:6.2f}")


T_A, T_B = 25.68, 27.38  # débuts des deux phrases finales (voix B v110)
GRADE = True


# Un clip généré en une fois pour deux segments (prix HeyGen fixe par vidéo) : segment -> (clé du job, point d'entrée)
ALIAS = {"6a": ("6ac", 0.5), "6c": ("6ac", 7.6), "7a": ("7ab", 0.5), "7b": ("7ab", 5.0)}   # 6c : la coche apparaît à 8 s ; 7b : la feuille sort de l'imprimante à 5 s


def clip_files():
    files = {"1": (PLAN1, None)} if PLAN1.exists() else {}
    jobs_path = FILM / "plans" / "jobs.json"
    jobs = json.loads(jobs_path.read_text()) if jobs_path.exists() else {}
    for key, j in jobs.items():
        if j.get("file") and j.get("use", True):
            files[key] = (ROOT / j["file"], None)
    for seg, (job, inpt) in ALIAS.items():
        if seg not in files and job in jobs and jobs[job].get("file") and jobs[job].get("use", True):
            files[seg] = (ROOT / jobs[job]["file"], inpt)
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
            path, alias_in = files[key]
            if alias_in is not None:
                inpt = alias_in
            inputs += ["-i", str(path)]
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
    filters.append("".join(labels) + f"concat=n={n}:v=1:a=0[cat0]")
    # Étalonnage unique (dossier § 4.6) : ombres bleu nuit, hautes lumières légèrement chaudes, saturation contenue,
    # contraste doux, grain fin. Désactivable avec --no-grade.
    if GRADE:
        filters.append(
            "[cat0]colorbalance=rs=-0.05:gs=-0.02:bs=0.08:rm=0.0:gm=0.0:bm=0.02:rh=0.05:gh=0.02:bh=-0.04,"
            "eq=saturation=0.9:contrast=1.04:brightness=-0.01:gamma=1.0,"
            "curves=all='0/0.02 0.25/0.24 0.75/0.77 1/0.98',"
            "noise=alls=5:allf=t+u,format=yuv420p[cat]")
    else:
        filters.append("[cat0]null[cat]")
    # Plan 10 : panneau de verre émeraude à liseré or (2,1 s avant la fin), virage bleu nuit dans son sillage, texte en deux temps.
    p0, pdur = round(FILM_DUR - 2.1, 2), 2.1
    filters.append(
        f"color=c={NAVY}:s=1920x1080:r=25:d={FILM_DUR},format=yuv420p[navy];"
        f"[cat][navy]blend=all_expr='A*(1-P)+B*P':all_opacity=1[dk]".replace(
            "P", f"clip((T-{p0})/{pdur}-((X)/1920)*0.6,0,1)*0.85"))
    filters.append(
        f"color=c={EMERALD}@0.42:s=360x1080:r=25:d={FILM_DUR},format=yuva420p[pane];"
        f"color=c={GOLD}@0.9:s=6x1080:r=25:d={FILM_DUR},format=yuva420p[edge];"
        f"[dk][pane]overlay=x='-360+(1920+360)*clip((t-{p0})/{pdur},0,1)':y=0:enable='between(t,{p0},{p0+pdur})':format=auto[ov1];"
        f"[ov1][edge]overlay=x='-6+(1920+366)*clip((t-{p0})/{pdur},0,1)':y=0:enable='between(t,{p0},{p0+pdur})':format=auto[ov2]")
    t_a, t_b = T_A, T_B
    filters.append(
        f"[ov2]drawtext=fontfile={FONT}:textfile={txt('base1', 'Continuez votre métier.')}:fontcolor={IVORY}:fontsize=64:"
        f"x=(w-text_w)/2:y=h/2-90:alpha='clip((t-{t_a})/0.5,0,1)':enable='gte(t,{t_a})',"
        f"drawtext=fontfile={FONT}:textfile={txt('base2', 'Alurforma simplifie le reste.')}:fontcolor={IVORY}:fontsize=64:"
        f"x=(w-text_w)/2:y=h/2+10:alpha='clip((t-{t_b})/0.5,0,1)':enable='gte(t,{t_b})'[v]")
    cmd = ["ffmpeg", "-y", "-v", "warning", "-stats", *inputs, "-filter_complex", ";".join(filters),
           "-map", "[v]", "-r", "25", "-t", str(FILM_DUR), "-c:v", "libx264", "-preset", "medium", "-crf", "16",
           "-pix_fmt", "yuv420p", str(WORK / "film.mp4")]
    subprocess.run(cmd, check=True)
    print("film/work/film.mp4 :", ", ".join(k for k, *_ in SEGMENTS if k in files), "| cartons :",
          ", ".join(k for k, *_ in SEGMENTS if k not in files) or "aucun")


def build_full():
    OUT.mkdir(exist_ok=True)
    music = MUSIC if MUSIC.exists() else WORK / "musique.wav"
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
        fc.append("[4:a]aformat=sample_rates=48000:channel_layouts=stereo,loudnorm=I=-23:TP=-6:LRA=9,adelay=14000|14000,"
                  f"afade=t=in:st=14:d=3,afade=t=out:st={OUTRO_START - 0.3}:d=2[mus]")
        mix += "[mus]"; n = 4
    fc.append(f"{mix}amix=inputs={n}:normalize=0:duration=longest[a]")
    dest = OUT / "ALURFORMA_FILM_HUGO_montage.mp4"
    cmd = ["ffmpeg", "-y", "-v", "error", "-stats", *inputs, "-filter_complex", ";".join(fc),
           "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p",
           "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
           "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", "-t", str(round(OUTRO_START + 8.8, 2)), str(dest)]
    subprocess.run(cmd, check=True)
    print("->", dest.relative_to(ROOT))


if __name__ == "__main__":
    GRADE = "--no-grade" not in sys.argv
    if "--vo" in sys.argv:
        VO = pathlib.Path(sys.argv[sys.argv.index("--vo") + 1]).resolve()
    retime_from_vo(VO)
    build_film()
    if "--film" not in sys.argv:
        build_full()
