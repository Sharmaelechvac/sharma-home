#!/usr/bin/env python3
"""Build public/logo.png and PWA icons from the Sharma logo if they are missing."""
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
PUBLIC.mkdir(exist_ok=True)
LOGO = PUBLIC / "logo.png"
SRC = "https://sharma-crew.sharma-crew.workers.dev/logo-800.png"

if not LOGO.exists():
    urllib.request.urlretrieve(SRC, LOGO)
    print("downloaded logo.png")

try:
    from PIL import Image, ImageDraw
except ImportError:
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "pillow"])
    from PIL import Image, ImageDraw

logo = Image.open(LOGO).convert("RGBA")
try:
    import numpy as np
    arr = np.array(logo)
    rgb = arr[:, :, :3]
    mask = (rgb < 245).any(axis=2)
    ys, xs = mask.nonzero()
    logo = logo.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
except Exception:
    pass

def make_icon(size, bg="#003a6e"):
    canvas = Image.new("RGBA", (size, size), bg)
    card = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(card)
    r = int(size * 0.18)
    inset = int(size * 0.08)
    draw.rounded_rectangle([inset, inset, size - inset, size - inset], radius=r, fill="#ffffff")
    canvas.alpha_composite(card)
    lw, lh = logo.size
    box = int(size * 0.76)
    scale = min(box / lw, box / lh)
    nw, nh = int(lw * scale), int(lh * scale)
    resized = logo.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas.alpha_composite(resized, ((size - nw) // 2, (size - nh) // 2))
    return canvas.convert("RGB")

for size, name in [(180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")]:
    path = PUBLIC / name
    make_icon(size).save(path, "PNG", optimize=True)
    print("wrote", path.name)
