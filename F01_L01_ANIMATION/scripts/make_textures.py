"""Watercolour-paper texture used as a multiply overlay. Usage: python3 scripts/make_textures.py public/tex"""
import sys
import numpy as np
from PIL import Image, ImageFilter
out = sys.argv[1]
rng = np.random.default_rng(3)
W, H = 1920, 1080
acc = np.zeros((H, W))
for scale, amp in [(2, 0.35), (6, 0.25), (24, 0.25), (90, 0.15)]:
    small = rng.random((H // scale + 2, W // scale + 2))
    im = Image.fromarray((small * 255).astype(np.uint8)).resize((W + 2 * scale, H + 2 * scale), Image.BICUBIC)
    acc += amp * (np.asarray(im).astype(float)[:H, :W] / 255)
acc = (acc - acc.min()) / (acc.max() - acc.min())
# paper: mostly white, faint darker fibres/blotches
paper = 255 - (acc ** 2.2) * 38
Image.fromarray(paper.astype(np.uint8), "L").convert("RGB").save(f"{out}/paper.jpg", quality=90)
# soft watercolour blooms (for multiply, very light)
blob = Image.fromarray((acc * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(18))
b = np.asarray(blob).astype(float) / 255
bloom = 255 - np.clip((b - 0.45) * 2.2, 0, 1) * 30
Image.fromarray(bloom.astype(np.uint8), "L").convert("RGB").save(f"{out}/bloom.jpg", quality=90)
print("ok")
