"""Bande-son du générique Alurforma (18,6 s).

Aucun montage : le morceau Suno « Éclat Fonctuel » joue tel quel depuis le début et
s'arrête dans le creux qui suit sa fin de phrase (deux coups graves à 15,65 s et 16,25 s),
exactement comme le premier jingle de 12 s (coups à 11,05 s et 11,65 s), deux mesures
plus tard. Pour ne pas couper sec, la fin résonne dans une réverbération faite à partir
de la musique elle-même.

Sound design très léger, hors tonalité : tintements de verre à l'ouverture, whooshes sur
les changements de plan.

Sortie : WAV 48 kHz stéréo non normalisé (normalisation ensuite via ffmpeg, voir README).
"""
import sys
import numpy as np
import librosa
import soundfile as sf
from scipy import signal

SR = 48000
TOTAL = 18.6
SONG_STOP = 16.63  # dans le creux qui suit le second coup grave (16,25 s)
rng = np.random.default_rng(7)

src, out = sys.argv[1], sys.argv[2]
song, _ = librosa.load(src, sr=SR, mono=False, duration=SONG_STOP + 1.0)
N = int(TOTAL * SR)
mix = np.zeros((2, N))


def at(t):
    return int(round(t * SR))


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


# --- 1. Le morceau, tel quel, jusqu'au creux de fin de phrase ------------------------
music = song[:, : at(SONG_STOP)].copy()
fade = at(0.12)
music[:, -fade:] *= np.cos(np.linspace(0, np.pi / 2, fade)) ** 2
add(music, 0.0)

# --- 2. La fin résonne : réverbération de la dernière mesure, dans la tonalité --------
n_ir = at(2.4)
ir = noise(2.4) * np.exp(-np.arange(n_ir) / SR / 0.75)
ir = signal.sosfilt(signal.butter(2, 5000, "low", fs=SR, output="sos"), ir)
ir /= np.sqrt((ir**2).sum(axis=1, keepdims=True))
src_tail = song[:, at(15.5) : at(SONG_STOP)]
tail = np.stack([signal.fftconvolve(src_tail[c], ir[c]) for c in range(2)])
# la queue ne commence à s'entendre qu'au moment où la musique s'arrête
t0 = at(SONG_STOP - 15.5 - 0.1)
tail[:, :t0] = 0
ramp = at(0.1)
tail[:, t0 : t0 + ramp] *= np.linspace(0, 1, ramp)
tail[:, -at(0.4) :] *= np.linspace(1, 0, at(0.4))
add(tail, 15.5, -7)


# --- 3. Tintements de verre sur les fentes lumineuses de l'ouverture ------------------
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


# --- 4. Whooshes sur les changements de plan ------------------------------------------
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

peak = np.abs(mix).max()
sf.write(out, (mix / peak * 0.89).T.astype(np.float32), SR, subtype="FLOAT")
print("écrit", out, "durée", N / SR)
