"""Parse the Descript SRT into speaker-attributed utterances + per-frame mouth envelope.
Usage: python3 scripts/prepare_transcript.py content/transcript.srt public/audio/f01-l01-podcast.mp3 src/data
"""
import json, re, subprocess, sys
import numpy as np

srt_path, audio_path, out_dir = sys.argv[1:4]
FPS = 30
# Obvious ASR fixes (documented in content/storyboard.md)
FIXES = [("on différencie\nl'action", "on diffère\nl'action"), ("on différencie l'action", "on diffère l'action"),
         ("pouvoirs express", "pouvoirs exprès"), ("qui entraîne des", "qui entraînent des")]

def ts(s):
    h, m, rest = s.split(":"); sec, ms = rest.split(",")
    return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000

raw = open(srt_path, encoding="utf-8").read()
for a, b in FIXES:
    raw = raw.replace(a, b)
blocks = [b for b in raw.strip().split("\n\n") if b.strip()]
cues = []
for b in blocks:
    lines = b.split("\n")
    a, z = [ts(x.strip()) for x in lines[1].split("-->")]
    cues.append((a, z, " ".join(l.strip() for l in lines[2:])))

# split cues on speaker labels, carrying the speaker forward
speaker = "LEA"
segs = []
for a, z, text in cues:
    parts = re.split(r"(Speaker 2:|Speaker:)", text)
    pieces = []
    cur = parts[0]
    if cur.strip():
        pieces.append((speaker, cur))
    for i in range(1, len(parts), 2):
        speaker = "HUGO" if parts[i] == "Speaker 2:" else "LEA"
        pieces.append((speaker, parts[i + 1]))
    total = sum(max(len(p[1].strip()), 1) for p in pieces)
    t = a
    for spk, p in pieces:
        d = (z - a) * max(len(p.strip()), 1) / total
        segs.append({"speaker": spk, "start": round(t, 3), "end": round(t + d, 3), "text": p.strip()})
        t += d

# attach orphan punctuation (e.g. "?" / ":" / "»") to the previous segment of the same speaker / next one
clean = []
for s in segs:
    txt = s["text"]
    if re.fullmatch(r"[?:»«.\s]*", txt):
        if clean and txt.strip() in ("?", "»", "?»") and clean[-1]["speaker"] == s["speaker"]:
            clean[-1]["text"] += " " + txt.strip(); clean[-1]["end"] = s["end"]
        continue
    txt = re.sub(r"^[:\s]+", "", txt)
    if txt.startswith("» "):
        txt = txt[2:]
    if clean and clean[-1]["speaker"] == s["speaker"] and s["start"] - clean[-1]["end"] < 0.05 and not re.search(r"[.?!]$", clean[-1]["text"]):
        clean[-1]["text"] += " " + txt; clean[-1]["end"] = s["end"]; continue
    clean.append({**s, "text": txt})

# audio envelope + pitch
pcm = subprocess.run(["ffmpeg", "-v", "quiet", "-i", audio_path, "-af", "aresample=async=1:first_pts=0", "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
x = np.frombuffer(pcm, dtype=np.int16).astype(float)
sr = 16000
n = int(len(x) / sr * FPS)
hop = sr // FPS
rms = np.array([np.sqrt((x[i * hop:(i + 1) * hop] ** 2).mean() + 1e-9) for i in range(n)])
ref = np.percentile(rms, 97)
env = np.clip(rms / ref, 0, 1)
env = np.where(env < 0.08, 0, env)

def f0_at(a, b):
    seg = x[int(a * sr):int(b * sr)]
    res = []
    for i in range(0, len(seg) - 800, 400):
        fr = seg[i:i + 800]
        if np.sqrt((fr ** 2).mean()) < 500:
            continue
        fr = fr - fr.mean(); ac = np.correlate(fr, fr, "full")[799:]
        lo, hi = sr // 400, sr // 70
        k = lo + np.argmax(ac[lo:hi])
        if ac[k] > 0.4 * ac[0]:
            res.append(sr / k)
    return float(np.median(res)) if res else None

mismatch = []
for s in clean:
    f = f0_at(s["start"], s["end"])
    s["f0"] = round(f) if f else None
    guess = None if f is None else ("LEA" if f > 170 else "HUGO")
    if guess and guess != s["speaker"] and s["end"] - s["start"] > 0.8:
        mismatch.append((s["start"], s["speaker"], guess, f, s["text"][:50]))

json.dump({"fps": FPS, "duration": len(x) / sr, "segments": clean}, open(f"{out_dir}/transcript.json", "w"), ensure_ascii=False, indent=1)

# ── body-language signals per speaker, simulated with damped springs (natural lag + follow-through) ──
def spring(target, w, z):
    pos, vel, out, dt = 0.0, 0.0, [], 1 / FPS
    for tg in target:
        vel += (w * w * (tg - pos) - 2 * z * w * vel) * dt
        pos += vel * dt
        out.append(pos)
    return np.array(out)

def movavg(a, n):
    return np.convolve(a, np.ones(n) / n, mode="full")[: len(a)]

def enc(a, lo, hi):  # 2 hex chars per frame
    q = np.clip(np.round((a - lo) / (hi - lo) * 255), 0, 255).astype(int)
    return "".join(f"{v:02x}" for v in q)

motion = {}
for spk in ("LEA", "HUGO"):
    mask = np.zeros(n)
    for sgm in clean:
        if sgm["speaker"] == spk:
            mask[int(sgm["start"] * FPS): int(sgm["end"] * FPS) + 3] = 1
    v = env * mask
    short = movavg(v, 6)
    long_ = np.concatenate([np.zeros(6), movavg(v, 18)[:-6]])
    accent = np.clip(short - long_, 0, None)
    active = movavg(mask, 9)
    motion[spk] = {
        "gest": enc(spring(accent * 2.2 + active * 0.15, 7.0, 0.5), -0.3, 1.3),  # hands: beats with overshoot
        "nod": enc(spring(accent * 2.5, 12.0, 0.45), -0.3, 1.3),  # head: quicker, lighter
        "active": enc(spring(active, 4.0, 1.0), -0.1, 1.1),  # turn-taking, no overshoot
    }
json.dump({"fps": FPS, "ranges": {"gest": [-0.3, 1.3], "nod": [-0.3, 1.3], "active": [-0.1, 1.1]}, **motion}, open(f"{out_dir}/motion.json", "w"))
# per-frame mouth: quantised 0..9 as a compact string
json.dump({"fps": FPS, "mouth": "".join(str(int(round(v * 9))) for v in env)}, open(f"{out_dir}/envelope.json", "w"))
print("segments", len(clean), "frames", n)
for m in mismatch:
    print("MISMATCH", m)
