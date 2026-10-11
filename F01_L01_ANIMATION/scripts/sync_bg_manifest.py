"""List painted background plates present in public/bg so the video uses them instead of the SVG sets.
Usage: python3 scripts/sync_bg_manifest.py"""
import json, os
here = os.path.dirname(os.path.abspath(__file__))
bg = os.path.join(here, "..", "public", "bg")
files = sorted(f[:-4] for f in os.listdir(bg) if f.endswith(".png")) if os.path.isdir(bg) else []
json.dump({"files": files}, open(os.path.join(here, "..", "src", "data", "bg-manifest.json"), "w"), indent=1)
print("painted plates:", files)
