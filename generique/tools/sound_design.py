"""Bande-son du générique Alurforma (20 s).

1. Montage musical : le début du morceau Suno « Éclat Fonctuel » (0 → 9,40 s, 4 mesures)
   est raccordé sur un premier temps à sa vraie fin (167,99 s → fin) : break sans basse,
   coup, second break, accord final. Le raccord est affiné à l'échantillon près sur les
   attaques, avec un fondu enchaîné à puissance constante de 25 ms.
2. Sound design léger, hors tonalité (bruits filtrés, tintements très discrets) :
   aucune note ni impact ajouté sur les coups de la musique, qui font eux-mêmes le travail.

Sortie : WAV 48 kHz stéréo non normalisé (normalisation ensuite via ffmpeg, voir README).
"""
import sys
import numpy as np
import librosa
import soundfile as sf
from scipy import signal

SR = 48000
TOTAL = 20.0
BODY_END = 9.40  # premier temps de la 5e mesure du morceau
ENDING_START = 167.99  # premier temps, en plein break de la fin du morceau
FADE_FROM = 18.5  # fondu de l'accord final, qui résonne encore
rng = np.random.default_rng(7)

src, out = sys.argv[1], sys.argv[2]
song, _ = librosa.load(src, sr=SR, mono=False)
N = int(TOTAL * SR)
mix = np.zeros((2, N))


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
cut_b = refine(ENDING_START)
xf = at(0.025)
a = song[:, : at(cut_a) + xf // 2]
b = song[:, at(cut_b) - xf // 2 :]
w = np.linspace(0, np.pi / 2, xf)
seam = a[:, -xf:] * np.cos(w) + b[:, :xf] * np.sin(w)
music = np.concatenate([a[:, :-xf], seam, b[:, xf:]], axis=1)[:, :N]
music = np.pad(music, ((0, 0), (0, N - music.shape[1])))
f0, f1 = at(FADE_FROM), N
music[:, f0:f1] *= np.cos(np.linspace(0, np.pi / 2, f1 - f0)) ** 2
mix += music
offset = cut_b - cut_a
print(f"raccord : {cut_a:.3f} s → {cut_b:.3f} s (décalage fin = morceau − {offset:.3f} s)")
for name, t_song in [("coup", 171.22), ("accord final", 174.95)]:
    print(f"  {name} : {t_song - offset:.2f} s dans le générique")


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


for tb, gdb in [(2.51, -25), (5.94, -23), (BODY_END, -22)]:
    w_, pre = whoosh()
    add(w_, tb - pre, gdb)

# --- 4. Montée en tension jusqu'au break, coupée net sur le raccord -------------------
dur = BODY_END - 7.66
x = spectral_sweep(noise(dur), 250, 9000, 2.2)
e = np.linspace(0, 1, x.shape[1]) ** 2.6
e[-at(0.02) :] *= np.linspace(1, 0, at(0.02))
add(x * e, 7.66, -23)

# --- 5. Souffle de lumière pendant la plongée dans la porte ---------------------------
coup = 171.22 - offset
dur = coup - 0.05 - 11.72
air = spectral_sweep(noise(dur), 2500, 14000, 1.2) * np.linspace(0, 1, int(dur * SR)) ** 2
air[:, -at(0.03) :] *= np.linspace(1, 0, at(0.03))
add(air, 11.72, -33)

peak = np.abs(mix).max()
sf.write(out, (mix / peak * 0.89).T.astype(np.float32), SR, subtype="FLOAT")
print("écrit", out, "durée", N / SR)
