"""Vectorise le logo PNG Alurforma en calques SVG séparés (navy, vert, or, porte).

Chaque couleur devient un calque animable indépendamment dans Remotion.
"""
import json, sys
import numpy as np
from PIL import Image
import potrace

SRC = sys.argv[1]
OUT = sys.argv[2]
UP = 4  # sur-échantillonnage pour des courbes lisses

im = Image.open(SRC).convert("RGBA")
W, H = im.size
big = im.resize((W * UP, H * UP), Image.LANCZOS)
a = np.array(big).astype(float)
r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3] / 255.0

opaque = al > 0.5
# le liseré or est semi-transparent : on le détecte sur la teinte, pas sur l'opacité
gold = (al > 0.12) & (r > 110) & (r > b + 25) & (g > 90)
green = opaque & ~gold & (g > 70) & (g > b + 10)
navy = opaque & ~gold & ~green


def trace(mask, turd=40):
    # potracer trace les pixels sombres : on inverse le masque
    bm = potrace.Bitmap(~mask)
    plist = bm.trace(turdsize=turd, alphamax=1.0, opticurve=True, opttolerance=0.2)
    d = []
    for curve in plist:
        s = curve.start_point
        seg = [f"M{s.x / UP:.2f},{s.y / UP:.2f}"]
        for c in curve.segments:
            if c.is_corner:
                seg.append(f"L{c.c.x / UP:.2f},{c.c.y / UP:.2f}L{c.end_point.x / UP:.2f},{c.end_point.y / UP:.2f}")
            else:
                seg.append(
                    f"C{c.c1.x / UP:.2f},{c.c1.y / UP:.2f} {c.c2.x / UP:.2f},{c.c2.y / UP:.2f} {c.end_point.x / UP:.2f},{c.end_point.y / UP:.2f}"
                )
        seg.append("Z")
        d.append("".join(seg))
    return " ".join(d)


# Séparation mark / wordmark : colonne vide entre les deux
cols = opaque.any(axis=0)
split = None
for x in range(int(W * UP * 0.2), int(W * UP * 0.45)):
    if not cols[x]:
        split = x
        break
print("split px", split / UP if split else None)
mark = np.zeros_like(opaque); mark[:, :split] = True
word = ~mark

# Ouverture de porte (zone transparente dans le A), relevée à la main sur le PNG
DOOR = [[174, 132], [276, 188], [276, 298], [174, 298]]

layers = {
    "navyMark": trace(navy & mark),
    "greenMark": trace(green & mark),
    # le liseré or antialiasé se trace mal : polygone net relevé sur le PNG
    "gold": "M229,163 L276,188 L276,290 L270,288 L268,196 Z",
    "word": trace(navy & word),
}
meta = {"width": W, "height": H, "split": split / UP, "door": DOOR}
json.dump({"meta": meta, "layers": layers}, open(OUT, "w"))
print(meta, {k: len(v) for k, v in layers.items()})
