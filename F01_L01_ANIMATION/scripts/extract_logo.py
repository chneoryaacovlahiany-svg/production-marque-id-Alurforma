"""Key the cream background out of the générique end frame to get a transparent ALURFORMA logo.
Usage: python3 scripts/extract_logo.py frame.png public/brand/logo.png"""
import sys
import numpy as np
from PIL import Image
src, dst = sys.argv[1:3]
im = np.asarray(Image.open(src).convert("RGB")).astype(float)[270:670, 340:1590]
# background = local cream colour; distance from it gives alpha
bg = np.array([247, 247, 241], dtype=float)
d = np.sqrt(((im - bg) ** 2).sum(-1))
alpha = np.clip((d - 22) / 45, 0, 1)
# un-premultiply against the background so edges keep the right colour
a = alpha[..., None]
rgb = np.where(a > 0.01, (im - bg * (1 - a)) / np.maximum(a, 1e-3), 0)
out = np.dstack([np.clip(rgb, 0, 255), alpha * 255]).astype(np.uint8)
Image.fromarray(out, "RGBA").save(dst)
print(out.shape)
