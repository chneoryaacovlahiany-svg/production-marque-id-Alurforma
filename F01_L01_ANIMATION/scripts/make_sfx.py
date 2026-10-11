"""Synthesise the small sound-effect kit (no network needed). Usage: python3 scripts/make_sfx.py public/sfx"""
import sys, wave
import numpy as np
out = sys.argv[1]
SR = 48000
rng = np.random.default_rng(7)

def save(name, x):
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    with wave.open(f"{out}/{name}.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def t(d): return np.arange(int(d * SR)) / SR

def lowpass(x, a):  # one-pole
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc); y[i] = acc
    return y

def bandsweep(x, f0, f1):
    n = len(x); y = np.zeros(n); lp = 0.0; bp = 0.0
    for i in range(n):  # state-variable filter with moving cutoff
        f = f0 + (f1 - f0) * i / n
        k = 2 * np.sin(np.pi * f / SR)
        hp = x[i] - lp - 0.5 * bp
        bp += k * hp; lp += k * bp
        y[i] = bp
    return y

# whoosh: noise through a rising/falling band, bell envelope
d = t(0.7); env = np.sin(np.pi * np.clip(d / 0.7, 0, 1)) ** 2
save("whoosh", bandsweep(rng.standard_normal(len(d)), 300, 2200) * env)
# soft wind gust (longer)
d = t(1.6); env = np.sin(np.pi * d / 1.6) ** 1.5
save("gust", bandsweep(rng.standard_normal(len(d)), 500, 900) * env)
# chime: two bell partials
d = t(1.8)
save("chime", (np.sin(2 * np.pi * 1318 * d) + 0.5 * np.sin(2 * np.pi * 1975 * d) + 0.25 * np.sin(2 * np.pi * 2637 * d)) * np.exp(-d * 3.2))
# pop: short pitched blip
d = t(0.18)
save("pop", np.sin(2 * np.pi * (520 + 900 * np.exp(-d * 30)) * d) * np.exp(-d * 28))
# page / paper slide: filtered noise burst
d = t(0.45); env = np.exp(-((d - 0.12) / 0.09) ** 2)
save("paper", lowpass(rng.standard_normal(len(d)), 0.35) * env)
# stamp: low thump + click
d = t(0.5)
save("stamp", np.sin(2 * np.pi * (60 + 90 * np.exp(-d * 25)) * d) * np.exp(-d * 9) + 0.3 * rng.standard_normal(len(d)) * np.exp(-d * 80))
# check: two-note tick (gentle positive)
d = t(0.35)
a = np.sin(2 * np.pi * 880 * d) * np.exp(-d * 18); b = np.sin(2 * np.pi * 1320 * d) * np.exp(-d * 14)
save("check", np.concatenate([a[: int(0.09 * SR)], b])[: len(d)])
# negative: soft low two-note
save("nope", np.concatenate([np.sin(2 * np.pi * 330 * d[: int(0.12 * SR)]), np.sin(2 * np.pi * 247 * d)])[: len(d)] * np.exp(-d * 9))
# phone ring (old style trill)
d = t(1.2)
save("ring", (np.sin(2 * np.pi * 1200 * d) * (np.sign(np.sin(2 * np.pi * 22 * d)) > 0) * ((d % 0.6) < 0.45)) * 0.6)
# engine sputter (fails) + engine purr (starts)
d = t(1.4)
pulses = (np.sin(2 * np.pi * 9 * d) > 0.6) * np.exp(-d * 1.5)
save("sputter", lowpass(rng.standard_normal(len(d)), 0.08) * pulses + 0.4 * np.sin(2 * np.pi * 55 * d) * pulses)
d = t(2.4)
rpm = 28 + 10 * (1 - np.exp(-d * 2))
phase = 2 * np.cumsum(np.pi * rpm / SR)
save("engine", (lowpass(rng.standard_normal(len(d)), 0.06) * (0.6 + 0.4 * np.sin(phase))) * np.minimum(1, d * 4) * np.exp(-np.maximum(0, d - 1.8) * 4))
# sparkle (magic shimmer for reveals)
d = t(1.0); s = np.zeros(len(d))
for k in range(14):
    f = 2000 + 2500 * rng.random(); st = rng.random() * 0.6
    s += np.sin(2 * np.pi * f * d) * np.exp(-np.maximum(0, d - st) * 18) * (d > st)
save("sparkle", s)
print("ok")
