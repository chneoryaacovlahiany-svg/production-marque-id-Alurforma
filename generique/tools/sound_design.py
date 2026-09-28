"""Bande-son du générique Alurforma (≈ 18,8 s).

1. Montage musical : le morceau Suno « Éclat Fonctuel » joue en continu depuis le début,
   puis, sur un premier temps (13,98 s), enchaîne sur son accord final (≈ 175,0 s), qui
   résonne jusqu'au silence. Le raccord se cache sous l'attaque de l'accord ; il est préparé
   par l'accord final lui-même passé à l'envers (« reverse swell », donc dans la tonalité)
   et par une montée filtrée sur la dernière mesure, pendant que le groove s'efface légèrement.
2. Sound design léger, hors tonalité (bruits filtrés, tintements très discrets).

Sortie : WAV 48 kHz stéréo non normalisé (normalisation ensuite via ffmpeg, voir README).
"""
import sys
import numpy as np
import librosa
import soundfile as sf
from scipy import signal

SR = 48000
BODY_END = 13.98  # premier temps de la 7e mesure : on quitte le groove ici
FINAL_CHORD = 174.98  # attaque de l'accord final du morceau
SONG_END = 179.8  # l'accord s'est éteint
rng = np.random.default_rng(7)

src, out = sys.argv[1], sys.argv[2]
song, _ = librosa.load(src, sr=SR, mono=False)


def at(t):
    return int(round(t * SR))


def refine(t, win=0.06):
    """Recale un instant sur l'attaque la plus forte dans ±win s."""
    mono = song.mean(axis=0)
    hop = 64
    seg = mono[at(t - win) : at(t + win)]
    env = librosa.onset.onset_strength(y=seg, sr=SR, hop_length=hop)
    return t - win + np.argmax(env) * hop / SR


# --- 1. Montage musical -------------------------------------------------------------
cut_a = refine(BODY_END)
cut_b = refine(FINAL_CHORD, win=0.1)
TOTAL = round((cut_a + SONG_END - cut_b) * 25) / 25  # durée calée sur une image
N = int(TOTAL * SR)
mix = np.zeros((2, N))

xf = at(0.03)
groove = song[:, : at(cut_a) + xf // 2].copy()
chord = song[:, at(cut_b) - xf // 2 : at(SONG_END)].copy()
# le groove s'efface de 4 dB sur le dernier temps, aspiré par l'accord
d0 = at(cut_a - 0.45)
g = np.ones(groove.shape[1])
g[d0:] = np.linspace(1, 10 ** (-4 / 20), groove.shape[1] - d0)
groove *= g
w = np.linspace(0, np.pi / 2, xf)
seam = groove[:, -xf:] * np.cos(w) + chord[:, :xf] * np.sin(w)
music = np.concatenate([groove[:, :-xf], seam, chord[:, xf:]], axis=1)[:, :N]
music = np.pad(music, ((0, 0), (0, N - music.shape[1])))
tail = at(0.3)
music[:, -tail:] *= np.linspace(1, 0, tail)
mix += music
X = cut_a  # instant de l'accord final dans le générique
print(f"raccord : {cut_a:.3f} s → accord final du morceau {cut_b:.3f} s ; durée totale {TOTAL:.2f} s")

def add(buf, t, gain_db=0.0):
    i = at(t)
    if buf.ndim == 1:
        buf = np.stack([buf, buf])
    j = min(N, i + buf.shape[1])
    mix[:, i:j] += buf[:, : j - i] * 10 ** (gain_db / 20)


def env(n, attack, tau):
    t = np.arange(n) / SR
    return np.clip(t / max(attack, 1e-4), 0, 1) * np.exp(-np.maximum(t - attack, 0) / tau)


def noise(dur):
    return rng.standard_normal((2, int(dur * SR)))


def spectral_sweep(x, f_lo, f_hi, curve=2.0):
    """Passe-bas dont la coupure monte de f_lo à f_hi sur la durée (via STFT)."""
    f, t, Z = signal.stft(x, SR, nperseg=2048)
    cut = f_lo * (f_hi / f_lo) ** ((t / t[-1]) ** curve)
    mask = 1 / (1 + (f[:, None] / cut[None, :]) ** 6)
    _, y = signal.istft(Z * mask, SR, nperseg=2048)
    y = y[..., : x.shape[-1]]
    pad = x.shape[-1] - y.shape[-1]
    return np.pad(y, [(0, 0)] * (y.ndim - 1) + [(0, pad)]) if pad > 0 else y


# --- 2. Tintements de verre sur les fentes lumineuses de l'ouverture ------------------
def glass_ping(base, dur=0.9, tau=0.35, partials=(1, 1.504, 2.03, 2.71)):
    n = int(dur * SR)
    t = np.arange(n) / SR
    o = np.zeros((2, n))
    for c in range(2):
        for k, p in enumerate(partials):
            f = base * p * (1 + rng.uniform(-0.002, 0.002))
            o[c] += np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) * env(n, 0.002, tau / (1 + 0.5 * k)) / (1 + k)
    return o


for i, tb in enumerate([0.09, 0.65, 1.23, 1.81]):
    add(glass_ping(2637.0 * (1, 1.122, 0.891, 1.335)[i]), tb, -32)


# --- 3. Whooshes sur les changements de plan ------------------------------------------
def whoosh(pre=0.38, post=0.3):
    n1, n2 = int(pre * SR), int(post * SR)
    x = spectral_sweep(noise(pre + post), 300, 5000, 1.5)
    e = np.concatenate([np.linspace(0, 1, n1) ** 2.5, np.exp(-np.arange(n2) / SR / (post / 4))])
    n = min(x.shape[1], e.shape[0])
    x, e = x[:, :n], e[:n]
    x[1] = np.roll(x[1], int(0.004 * SR))
    return x * e, pre


for tb, gdb in [(2.51, -25), (5.94, -23), (9.40, -23)]:
    w_, pre = whoosh()
    add(w_, tb - pre, gdb)

# --- 4. L'accord final à l'envers aspire vers le raccord (même accord : même tonalité) ---
rev_len = at(0.9)
rev = song[:, at(cut_b) : at(cut_b) + rev_len][:, ::-1].copy()
rev *= np.linspace(0, 1, rev_len) ** 3
add(rev, X - rev_len / SR, -9)

# --- 5. Montée filtrée sur la dernière mesure, coupée net sur l'accord ----------------
dur = X - 12.84
x = spectral_sweep(noise(dur), 250, 9000, 2.2)
e = np.linspace(0, 1, x.shape[1]) ** 2.6
e[-at(0.02) :] *= np.linspace(1, 0, at(0.02))
add(x * e, 12.84, -24)

peak = np.abs(mix).max()
sf.write(out, (mix / peak * 0.89).T.astype(np.float32), SR, subtype="FLOAT")
print("écrit", out, "durée", N / SR)
print(f"ACCORD={X:.3f} TOTAL={TOTAL:.2f}")
