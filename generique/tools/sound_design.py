"""Sound design du générique Alurforma, posé sur le jingle Suno de 12 s.

Ajoute : ticks de verre à l'ouverture, whooshes sur les changements de plan,
montée en tension, silence de respiration avant le logo, impact grave + scintillement
de verre sur la révélation, et une queue de réverbération qui prolonge le tout à 14 s.
Sortie : WAV 48 kHz stéréo non normalisé (la normalisation se fait ensuite via ffmpeg).
"""
import sys
import numpy as np
import librosa
import soundfile as sf
from scipy import signal

SR = 48000
TOTAL = 14.0
rng = np.random.default_rng(7)

src, out = sys.argv[1], sys.argv[2]
music, _ = librosa.load(src, sr=SR, mono=False)
if music.ndim == 1:
    music = np.stack([music, music])
N = int(TOTAL * SR)
mix = np.zeros((2, N))


def at(t):
    return int(round(t * SR))


def add(buf, t, gain_db=0.0):
    i = at(t)
    if buf.ndim == 1:
        buf = np.stack([buf, buf])
    j = min(N, i + buf.shape[1])
    if i < 0:
        buf, i = buf[:, -i:], 0
    mix[:, i:j] += buf[:, : j - i] * 10 ** (gain_db / 20)


def env(n, attack, tau):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-np.maximum(t - attack, 0) / tau)


def ramp(n):
    return np.linspace(0, 1, n)


def noise(dur, chans=2):
    return rng.standard_normal((chans, int(dur * SR)))


def spectral_sweep(x, f_lo, f_hi, curve=2.0):
    """Filtre passe-bas dont la coupure monte de f_lo à f_hi sur la durée (via STFT)."""
    f, t, Z = signal.stft(x, SR, nperseg=2048)
    prog = (t / t[-1]) ** curve
    cut = f_lo * (f_hi / f_lo) ** prog
    mask = 1 / (1 + (f[:, None] / cut[None, :]) ** 6)
    _, y = signal.istft(Z * mask, SR, nperseg=2048)
    y = y[..., : x.shape[-1]]
    pad = x.shape[-1] - y.shape[-1]
    return np.pad(y, [(0, 0)] * (y.ndim - 1) + [(0, pad)]) if pad > 0 else y


def reverb_ir(dur=3.0, tau=0.9):
    n = int(dur * SR)
    ir = noise(dur) * np.exp(-np.arange(n) / SR / tau)
    sos = signal.butter(2, 6000, "low", fs=SR, output="sos")
    ir = signal.sosfilt(sos, ir)
    return ir / np.sqrt((ir ** 2).sum(axis=1, keepdims=True))


IR = reverb_ir()


def reverb(x):
    return np.stack([signal.fftconvolve(x[c], IR[c]) for c in range(2)])


# --- 1. Musique ---------------------------------------------------------------
m = music.copy()
fade = at(0.04)
m[:, -fade:] *= np.linspace(1, 0, fade)
# respiration avant le logo : on creuse la musique de -9 dB entre 10,62 et 10,96 s
g = np.ones(m.shape[1])
a0, a1, b0, b1 = at(10.60), at(10.64), at(10.94), at(10.99)
g[a0:a1] = np.linspace(1, 0.355, a1 - a0)
g[a1:b0] = 0.355
g[b0:b1] = np.linspace(0.355, 1, b1 - b0)
m *= g
add(m, 0.0)

# queue de réverbération : la fin du jingle résonne jusqu'à 14 s au lieu d'être coupée
tail_src = music[:, at(11.45):]
tail = reverb(tail_src)
add(tail, 11.45, -9)

# reverse swell : la réverbération de l'impact, inversée, aspire vers 11,0 s
rev = reverb(music[:, at(11.0):at(11.35)])[:, : at(0.62)][:, ::-1]
add(rev * ramp(rev.shape[1]) ** 2, 11.0 - rev.shape[1] / SR, -11)

# --- 2. Ticks de verre sur les fentes lumineuses de l'ouverture -----------------
def glass_ping(dur=0.9, base=2637.0, tau=0.35, partials=(1, 1.504, 2.03, 2.71)):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out_ = np.zeros((2, n))
    for c in range(2):
        for k, p in enumerate(partials):
            f = base * p * (1 + rng.uniform(-0.002, 0.002))
            out_[c] += np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) * env(n, 0.002, tau / (1 + 0.5 * k)) / (1 + k)
    return out_

for i, tb in enumerate([0.07, 0.64, 1.33, 1.92]):
    add(glass_ping(base=2637.0 * (1, 1.122, 0.891, 1.335)[i]), tb, -31)

# --- 3. Whooshes sur les changements de plan ---------------------------------------
def whoosh(pre=0.38, post=0.3, f_lo=300, f_hi=5000):
    n1, n2 = int(pre * SR), int(post * SR)
    x = noise(pre + post)
    x = spectral_sweep(x, f_lo, f_hi, 1.5)
    e = np.concatenate([ramp(n1) ** 2.5, np.exp(-np.arange(n2) / SR / (post / 4))])
    e = e[: x.shape[1]]
    x = x[:, : e.shape[0]]
    # léger décalage stéréo pour la largeur
    x[1] = np.roll(x[1], int(0.004 * SR))
    return x * e, pre

for tb, gdb in [(2.49, -24), (4.78, -21), (7.07, -22)]:
    w, pre = whoosh()
    add(w, tb - pre, gdb)

# --- 4. Montée en tension (7,07 → 10,55 s) ----------------------------------------
dur = 10.55 - 7.07
x = spectral_sweep(noise(dur), 250, 9000, 2.2)
e = np.linspace(0, 1, x.shape[1]) ** 2.6
cut = at(0.03)
e[-cut:] *= np.linspace(1, 0, cut)
add(x * e, 7.07, -21)

# --- 5. Impact grave + scintillement de verre sur la révélation -------------------
def sub_hit(dur=3.2, f0=72, f1=34, tau=1.3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.12)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * env(n, 0.004, tau)
    click = signal.sosfilt(signal.butter(2, 900, "low", fs=SR, output="sos"), rng.standard_normal(n)) * env(n, 0.001, 0.012) * 0.6
    y = np.tanh(1.6 * (body + click)) / np.tanh(1.6)
    return np.stack([y, y])

add(sub_hit(), 11.0, -7)
add(sub_hit(dur=2.6, f0=64, f1=38, tau=0.9), 11.6, -13)
add(reverb(glass_ping(dur=2.5, base=1318.5, tau=1.6, partials=(1, 1.5, 2.0, 2.52, 3.0, 4.0))), 11.0, -27)
add(glass_ping(dur=2.2, base=1975.5, tau=1.2, partials=(1, 1.5, 2.0, 3.0)), 11.6, -30)
# brillance de lumière sur la montée de porte (air)
air = spectral_sweep(noise(1.2), 3000, 14000, 1.0) * np.linspace(0, 1, int(1.2 * SR)) ** 2
add(air, 9.37, -34)

peak = np.abs(mix).max()
sf.write(out, (mix / peak * 0.89).T.astype(np.float32), SR, subtype="FLOAT")
print("écrit", out, "durée", N / SR, "crête avant normalisation", round(float(peak), 3))
