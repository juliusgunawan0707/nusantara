#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Siapkan aset gambar IKN dari hasil generate Julius di ~/Downloads/ikn.

1. Istana Garuda  -> PNG beralpha, dipotong pas ke bangunan.
   Latar aslinya HITAM MURNI (sudah diperiksa: warna terbanyak (0,0,0)), jadi
   kuncinya cukup dari kanal terbesar: gelap = transparan. Celah antar-sirip
   sayap ikut jadi transparan, dan itu memang yang diinginkan.
2. Tiga kartu galeri Babak 02 -> webp, ukuran mengikuti kartu yang sudah ada.

    python tools/aset_ikn.py
"""
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(os.path.expanduser('~'), 'Downloads', 'ikn')
GEN = os.path.join(ROOT, 'secret-pathways-assets', 'generated')

# nama berkas dari ChatGPT -> peran
GARUDA = 'ChatGPT Image Sep 5, 2026, 07_25_20 PM.png'
KARTU = [
    ('ChatGPT Image Sep 5, 2026, 07_27_01 PM.png', 'bhinneka-bridge.webp', (1536, 1024)),
    ('ChatGPT Image Sep 5, 2026, 07_27_54 PM.png', 'tugu-titik-nol.webp',  (1024, 1536)),
    ('ChatGPT Image Sep 5, 2026, 07_28_47 PM.png', 'amfiteater.webp',      (1536, 1024)),
]

# ambang kunci: 0 = hitam, 1 = putih (dari kanal terbesar)
KUNCI_BAWAH = 0.020   # di bawah ini transparan penuh
KUNCI_ATAS = 0.110    # di atas ini opak penuh


def kunci_garuda():
    src = os.path.join(SRC, GARUDA)
    im = Image.open(src).convert('RGB')
    w, h = im.size
    px = im.load()

    a = Image.new('L', (w, h))
    ap = a.load()
    lo, hi = KUNCI_BAWAH * 255.0, KUNCI_ATAS * 255.0
    span = hi - lo
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            m = r if r > g else g
            if b > m:
                m = b
            if m <= lo:
                ap[x, y] = 0
            elif m >= hi:
                ap[x, y] = 255
            else:
                ap[x, y] = int((m - lo) / span * 255.0)

    out = im.copy()
    out.putalpha(a)
    box = a.getbbox()
    out = out.crop(box)
    # 1600 px sudah lebih lebar daripada tampilnya di layar (bangunan ini
    # dilihat dari 24+ satuan), dan webp beralpha jauh lebih ringan daripada
    # PNG untuk berkas mandiri: 1,8 MB -> 289 KB.
    lebar = 1600
    out = out.resize((lebar, round(lebar * out.size[1] / out.size[0])), Image.LANCZOS)
    dst = os.path.join(GEN, 'istana-garuda.webp')
    out.save(dst, 'WEBP', quality=88, method=6)
    print('istana-garuda.webp %dx%d  (dipotong dari %dx%d)  %d KB'
          % (out.size[0], out.size[1], w, h, os.path.getsize(dst) // 1024))
    return out.size


def kartu():
    for nama, keluaran, ukuran in KARTU:
        src = os.path.join(SRC, nama)
        if not os.path.exists(src):
            print('  ! hilang:', nama)
            continue
        im = Image.open(src).convert('RGB')
        # potong tengah ke rasio target, baru diperkecil
        tw, th = ukuran
        w, h = im.size
        if w / h > tw / th:
            nw = int(h * tw / th)
            im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
        else:
            nh = int(w * th / tw)
            im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
        im = im.resize(ukuran, Image.LANCZOS)
        dst = os.path.join(GEN, keluaran)
        im.save(dst, 'WEBP', quality=82, method=6)
        print('%-22s %dx%d  %d KB' % (keluaran, tw, th, os.path.getsize(dst) // 1024))


def main():
    if not os.path.isdir(SRC):
        print('folder sumber tidak ada:', SRC)
        return 1
    kunci_garuda()
    kartu()
    return 0


if __name__ == '__main__':
    sys.exit(main())
