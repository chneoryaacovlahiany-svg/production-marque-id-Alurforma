"""Report frames where overlays (keywords, cards, chips…) cover characters. Usage: python3 scripts/qa_overlap.py <outDir>"""
import glob, json, os, sys
import numpy as np
from scipy import ndimage
from PIL import Image
d = sys.argv[1]
scenes = json.load(open(os.path.join(os.path.dirname(__file__), "..", "src/data/scenes.json")))["scenes"]
def scene_of(t):
    for s in scenes:
        if s["startSec"] <= t < s["endSec"]:
            return s["id"]
    return "?"
rows = []
for f in sorted(glob.glob(os.path.join(d, "chars_*.jpeg"))):
    t = float(os.path.basename(f)[6:-5])
    u = f.replace("chars_", "ui_")
    if not os.path.exists(u):
        continue
    c = np.asarray(Image.open(f).convert("L")) < 128
    o = np.asarray(Image.open(u).convert("L")) < 128
    area = c.sum()
    if area < 50:
        continue
    ov = (c & o).sum() / area
    # faces matter most: overlap inside the top 30 % of each separate silhouette
    lab, n = ndimage.label(c)
    head = 0.0
    for i in range(1, n + 1):
        ys, xs = np.nonzero(lab == i)
        if len(ys) < 40:
            continue
        top = ys.min() + (ys.max() - ys.min()) * 0.3
        hm = (lab == i) & (np.arange(c.shape[0])[:, None] <= top)
        head = max(head, (hm & o).sum() / max(1, hm.sum()))
    rows.append((t, scene_of(t), max(ov, head)))
bad = [r for r in rows if r[2] > 0.01]
print(f"frames checked: {len(rows)}  frames with overlap > 1% (body or face): {len(bad)}")
by = {}
for t, sc, ov in bad:
    by.setdefault(sc, []).append((t, ov))
for sc, items in by.items():
    worst = max(items, key=lambda x: x[1])
    print(f"{sc:18s} {len(items):3d} frames  worst {worst[1]*100:4.1f}% at {worst[0]:.1f}s  times {items[0][0]:.1f}–{items[-1][0]:.1f}")
