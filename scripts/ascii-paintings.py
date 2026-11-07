"""Render the public-domain paintings in SOURCES into the ASCII files under public/ascii/.

Usage:
    python3 -m venv .venv && .venv/bin/pip install pillow numpy
    .venv/bin/python scripts/ascii-paintings.py ~/.cache/balatinac-paintings

Missing images are downloaded from Wikimedia Commons into the cache directory.
Each painting becomes, per theme, <id>-<theme>.txt (the glyphs) and
<id>-<theme>.webp (one pixel per character: the painting's hue at a lightness
that reads on that theme, painted through the glyphs by background-clip: text).
The dark theme uses each render's chosen mode; the light theme always gives
dark pixels the densest glyphs, so the painting reads as ink on paper.
Every file in a slot shares that slot's grid, so the page can swap paintings
without the frame changing size. The ids must match src/lib/paintings.ts.
"""
import colorsys
import os
import sys
import urllib.parse
import urllib.request

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
FONT = os.path.join(ROOT, 'public', 'fonts', 'geist-mono-latin.woff2')
SLOTS = {'hero': (260, 94), 'band': (290, 66), 'figure': (110, 78)}
# A Geist Mono cell at 15px is 9px wide: the 0.6em advance the page's CSS relies on.
CELL_W, CELL_H = 9, 15
# Glyphs a cell may become. The page's ambient shimmer steps along this order by ink coverage.
CHARSET = " .,:;'`\"^-_~=+*<>!?/\\|()[]{}#%&@$"
# Lightness of the colour maps: light glyphs on the dark theme, dark glyphs on the light one.
THEME_LIGHTNESS = {'dark': 0.72, 'light': 0.33}

SOURCES = {
    'sunrise': 'Monet - Impression, Sunrise.jpg',
    'starry': 'Van Gogh - Starry Night - Google Art Project.jpg',
    'wave': 'Tsunami by hokusai 19th century.jpg',
    'adam': 'Michelangelo - Creation of Adam (cropped).jpg',
    'hunters': 'Pieter Bruegel the Elder - Hunters in the Snow (Winter) - Google Art Project.jpg',
    'supper': 'Leonardo da Vinci (1452-1519) - The Last Supper (1495-1498).jpg',
    'pearl': '1665 Girl with a Pearl Earring.jpg',
    'wanderer': 'Caspar David Friedrich - Wanderer above the sea of fog.jpg',
    'vitruvian': 'Vitruvian Man by Leonardo da Vinci.jpg',
    'monalisa': 'Mona Lisa, by Leonardo da Vinci, from C2RMF retouched.jpg',
    'vgself': 'Vincent van Gogh - Self-Portrait - Google Art Project (454045).jpg',
    'durer': 'Albrecht Dürer - 1500 self-portrait (High resolution and detail).jpg',
    'fuji': 'Red Fuji southern wind clear morning.jpg',
    'venus': 'Sandro Botticelli - La nascita di Venere - Google Art Project - edited.jpg',
    'sunflowers': 'Vincent van Gogh - Sunflowers (1888, National Gallery London).jpg',
    'babel': 'Pieter Bruegel the Elder - The Tower of Babel (Vienna) - Google Art Project - edited.jpg',
    'seaofice': 'Caspar David Friedrich - Das Eismeer - Hamburger Kunsthalle - 02.jpg',
    'moon': 'Friedrich - Two Men Contemplating the Moon.jpg',
    'athens': '"The School of Athens" by Raffaello Sanzio da Urbino.jpg',
    'shower': 'Hiroshige Atake sous une averse soudaine (cropped).jpg',
    'ermine': 'Lady with an Ermine - Leonardo da Vinci - Google Art Project.jpg',
    'hare': 'Albrecht Dürer - Hare, 1502 - Google Art Project.jpg',
    'arnolfini': 'Van Eyck - Arnolfini Portrait.jpg',
    'whistler': 'Whistlers Mother high res.jpg',
    'gothic': 'Grant DeVolson Wood - American Gothic.jpg',
    'mondrian': 'Piet Mondriaan, 1930 - Mondrian Composition II in Red, Blue, and Yellow.jpg',
    'milkmaid': 'Johannes Vermeer - Het melkmeisje - Google Art Project.jpg',
}

# mode 'light' gives bright pixels the densest glyphs, 'ink' gives dark pixels the densest glyphs.
# An optional 'light' dict overrides settings for the light theme's ink rendering.
RENDERS = {
    'sunrise': {'hero': dict(mode='light', boost=3, boostmin=0.3, gamma=1.0, floor=0.14, cutoff=2, focus=(0.56, 0.5), zoom=1.2,
                             light=dict(boost=-3))},
    'starry': {'hero': dict(mode='light', gamma=1.3, floor=0.22, focus=(0.5, 0.42)),
               'band': dict(mode='light', gamma=1.3, floor=0.22, focus=(0.5, 0.3), zoom=1.05)},
    'wave': {'hero': dict(mode='ink', gamma=1.0, floor=0.15, focus=(0.5, 0.45)),
             'band': dict(mode='ink', gamma=1.0, floor=0.15, focus=(0.5, 0.42))},
    'adam': {'hero': dict(mode='ink', boost=-0.8, boostmin=0.04, gamma=1.2, floor=0.3),
             'band': dict(mode='ink', boost=-0.8, boostmin=0.04, gamma=1.2, floor=0.28, focus=(0.43, 0.44), zoom=2.1)},
    'hunters': {'hero': dict(mode='ink', gamma=1.2, floor=0.3),
                'band': dict(mode='ink', gamma=1.2, floor=0.32, focus=(0.5, 0.58))},
    'supper': {'band': dict(mode='light', gamma=1.0, floor=0.08, focus=(0.5, 0.6))},
    'pearl': {'figure': dict(mode='light', gamma=1.1, floor=0.08, zoom=1.05)},
    'wanderer': {'figure': dict(mode='light', gamma=1.6, floor=0.35)},
    'vitruvian': {'figure': dict(mode='ink', gamma=0.9, floor=0.3, pool='min', cutoff=0.5, focus=(0.5, 0.44), zoom=1.1)},
    'monalisa': {'figure': dict(mode='light', gamma=1.0, floor=0.08, focus=(0.5, 0.38), zoom=1.2)},
    'vgself': {'figure': dict(mode='light', equalize=True, gamma=1.3, floor=0.22, focus=(0.5, 0.42), zoom=1.35,
                              light=dict(equalize=False, gamma=1.0, floor=0.1))},
    'durer': {'figure': dict(mode='light', equalize=True, gamma=1.4, floor=0.22, focus=(0.5, 0.36), zoom=1.5,
                             light=dict(equalize=False, gamma=1.0, floor=0.08))},
    'fuji': {'hero': dict(mode='ink', gamma=1.1, floor=0.2),
             'band': dict(mode='ink', gamma=1.1, floor=0.2, focus=(0.5, 0.45))},
    'venus': {'hero': dict(mode='light', gamma=1.1, floor=0.15, focus=(0.5, 0.45))},
    'sunflowers': {'figure': dict(mode='ink', gamma=1.1, floor=0.2)},
    'babel': {'hero': dict(mode='light', gamma=1.1, floor=0.15, light=dict(gamma=0.85, floor=0.02)),
              'band': dict(mode='light', gamma=1.1, floor=0.15, focus=(0.5, 0.45), light=dict(gamma=0.85, floor=0.02))},
    'seaofice': {'hero': dict(mode='light', gamma=1.1, floor=0.15, light=dict(gamma=0.9, floor=0.04)),
                 'band': dict(mode='light', gamma=1.1, floor=0.15, focus=(0.5, 0.55), light=dict(gamma=0.9, floor=0.04))},
    'moon': {'hero': dict(mode='light', gamma=1.1, floor=0.12)},
    'athens': {'band': dict(mode='light', gamma=1.1, floor=0.12, focus=(0.5, 0.55), light=dict(equalize=True, gamma=0.9, floor=0.05)),
               'hero': dict(mode='light', gamma=1.1, floor=0.12, light=dict(equalize=True, gamma=0.9, floor=0.05))},
    'shower': {'figure': dict(mode='ink', gamma=1.0, floor=0.18)},
    'ermine': {'figure': dict(mode='light', gamma=1.1, floor=0.1, focus=(0.5, 0.42), zoom=1.1)},
    'hare': {'figure': dict(mode='ink', gamma=1.0, floor=0.18, focus=(0.5, 0.5), zoom=1.1)},
    'arnolfini': {'figure': dict(mode='light', equalize=True, gamma=1.3, floor=0.2, focus=(0.5, 0.45),
                                 light=dict(equalize=False, gamma=1.1, floor=0.12))},
    'whistler': {'figure': dict(mode='light', equalize=True, gamma=1.2, floor=0.12, focus=(0.6, 0.5),
                                light=dict(equalize=False, gamma=1.1, floor=0.12))},
    'gothic': {'figure': dict(mode='light', gamma=1.1, floor=0.12)},
    'mondrian': {'figure': dict(mode='light', boost=2.5, boostmin=0.1, gamma=1.0, floor=0.1, light=dict(boost=0))},
    'milkmaid': {'figure': dict(mode='light', gamma=1.1, floor=0.12, focus=(0.5, 0.45))},
}


def glyph_bitmaps():
    """Each CHARSET glyph rasterised into a CELL_W x CELL_H cell as ink coverage 0..1."""
    font = ImageFont.truetype(FONT, CELL_H)
    ascent, descent = font.getmetrics()
    top = (CELL_H - (ascent + descent)) / 2  # CSS half-leading at line-height 1
    bitmaps = []
    for ch in CHARSET:
        cell = Image.new('L', (CELL_W, CELL_H), 0)
        ImageDraw.Draw(cell).text((0, top), ch, font=font, fill=255)
        bitmaps.append(np.asarray(cell, dtype=np.float32).ravel() / 255.0)
    return np.stack(bitmaps)


GLYPHS = None


def fetch(cache, pid):
    path = os.path.join(cache, pid + '.jpg')
    if not os.path.exists(path):
        name = urllib.parse.quote(SOURCES[pid].replace(' ', '_'))
        req = urllib.request.Request(
            f'https://commons.wikimedia.org/wiki/Special:FilePath/{name}?width=1600',
            headers={'User-Agent': 'balatinac.dev ascii-paintings (hello@balatinac.com)'},
        )
        with urllib.request.urlopen(req) as res, open(path, 'wb') as out:
            out.write(res.read())
    return path


def crop(rgb, cols, rows, focus, zoom):
    w, h = rgb.size
    target = cols * CELL_W / (rows * CELL_H)
    cw, ch = (h * target, h) if w / h > target else (w, w / target)
    cw, ch = cw / zoom, ch / zoom
    x0 = min(max(focus[0] * w - cw / 2, 0), w - cw)
    y0 = min(max(focus[1] * h - ch / 2, 0), h - ch)
    return rgb.crop((round(x0), round(y0), round(x0 + cw), round(y0 + ch)))


def glyphs(path, cols, rows, mode='light', gamma=1.0, floor=0.1, boost=0.0, boostmin=0.0,
           cutoff=1.0, equalize=False, pool='mean', focus=(0.5, 0.5), zoom=1.0):
    global GLYPHS
    if GLYPHS is None:
        GLYPHS = glyph_bitmaps()
    rgb = crop(Image.open(path).convert('RGB'), cols, rows, focus, zoom)
    big = rgb.resize((cols * CELL_W, rows * CELL_H), Image.LANCZOS)
    im = big.convert('L')
    if boost:
        # Shift warm, saturated pixels so a red sun or skin against sky survives greyscale.
        a = np.asarray(big, dtype=np.float32) / 255.0
        warm = np.clip(a[..., 0] - a[..., 2] - boostmin, 0, 1)
        lum = np.asarray(im, dtype=np.float32) / 255.0
        im = Image.fromarray((np.clip(lum + boost * warm, 0, 1) * 255).astype(np.uint8))
    if equalize:
        im = ImageOps.equalize(im)
    im = ImageOps.autocontrast(im, cutoff=cutoff)
    if pool == 'min':
        # Thicken pen hairlines before matching so a drawing keeps its lines.
        im = im.filter(ImageFilter.MinFilter(3))
    im = im.filter(ImageFilter.UnsharpMask(radius=3, percent=140, threshold=2))

    tone = np.asarray(im, dtype=np.float32) / 255.0
    ink = (1 - tone) if mode == 'ink' else tone
    ink = np.clip((ink - floor) / (1 - floor), 0, 1) ** gamma
    # Scale the target to the coverage range the glyphs can actually reach.
    ink *= GLYPHS.mean(axis=1).max() * 1.6
    patches = ink.reshape(rows, CELL_H, cols, CELL_W).transpose(0, 2, 1, 3).reshape(rows * cols, -1)
    # Nearest glyph by squared distance: shape and tone together.
    dist = (patches ** 2).sum(1)[:, None] - 2 * patches @ GLYPHS.T + (GLYPHS ** 2).sum(1)[None, :]
    picks = dist.argmin(1).reshape(rows, cols)
    return '\n'.join(''.join(CHARSET[i] for i in row).rstrip() for row in picks)


def colour_maps(path, cols, rows, focus=(0.5, 0.5), zoom=1.0, **_):
    rgb = crop(Image.open(path).convert('RGB'), cols, rows, focus, zoom)
    small = np.asarray(rgb.resize((cols, rows), Image.LANCZOS), dtype=np.float32) / 255.0
    maps = {}
    for theme, lightness in THEME_LIGHTNESS.items():
        out = np.empty_like(small)
        for y in range(rows):
            for x in range(cols):
                hue, _, sat = colorsys.rgb_to_hls(*small[y, x])
                # Greys carry hue noise, so only colours that are already saturated get boosted.
                out[y, x] = colorsys.hls_to_rgb(hue, lightness, min(1.0, sat * 1.3) if sat > 0.15 else sat * 0.5)
        maps[theme] = Image.fromarray((out * 255).astype(np.uint8))
    return maps


if __name__ == '__main__':
    cache = sys.argv[1]
    os.makedirs(cache, exist_ok=True)
    out_root = os.path.join(ROOT, 'public', 'ascii')
    for pid, slots in RENDERS.items():
        src = fetch(cache, pid)
        for slot, opts in slots.items():
            cols, rows = SLOTS[slot]
            dark = dict(opts)
            override = dark.pop('light', {})
            light = {**dark, 'mode': 'ink', **override}
            texts = {'dark': glyphs(src, cols, rows, **dark), 'light': glyphs(src, cols, rows, **light)}
            maps = colour_maps(src, cols, rows, **dark)
            os.makedirs(os.path.join(out_root, slot), exist_ok=True)
            for theme in THEME_LIGHTNESS:
                with open(os.path.join(out_root, slot, f'{pid}-{theme}.txt'), 'w') as fh:
                    fh.write(texts[theme] + '\n')
                maps[theme].save(os.path.join(out_root, slot, f'{pid}-{theme}.webp'), quality=82, method=6)
            print(f'{slot}/{pid}')
