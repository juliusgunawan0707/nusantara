#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rakit index.html jadi SATU berkas mandiri yang bisa dibuka tanpa server.

three.js, fonts.css, dan seluruh gambar disisipkan sebagai data URI. Berguna
karena halaman ini memuat asetnya lewat path relatif, jadi lewat file://
biasa gambar dan font-nya gagal.

    python tools/build.py            -> nusantara-standalone.html
"""
import base64
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'index.html')
OUT = os.path.join(ROOT, 'nusantara-standalone.html')

MIME = {'.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg'}


def data_uri(path):
    ext = os.path.splitext(path)[1].lower()
    with open(path, 'rb') as f:
        return 'data:%s;base64,%s' % (MIME[ext], base64.b64encode(f.read()).decode('ascii'))


def main():
    html = io.open(SRC, encoding='utf-8').read()
    before = len(html.encode('utf-8'))
    disisipkan = []

    # 1. fonts.css (isinya sudah base64 sendiri) -> <style> inline
    css_path = os.path.join(ROOT, 'secret-pathways-assets', 'fonts.css')
    css = io.open(css_path, encoding='utf-8').read()
    html, n = re.subn(
        r'<link rel="stylesheet" href="secret-pathways-assets/fonts\.css">',
        lambda m: '<style>\n' + css + '\n</style>', html, count=1)
    if n != 1:
        print('GAGAL menyisipkan fonts.css')
        return 1
    disisipkan.append(('fonts.css', os.path.getsize(css_path)))

    # 2. three.min.js -> <script> inline.
    #    Pakai fungsi pengganti supaya backslash di dalam kode tidak
    #    ditafsirkan sebagai grup regex.
    js_path = os.path.join(ROOT, 'secret-pathways-assets', 'three.min.js')
    js = io.open(js_path, encoding='utf-8').read()
    html, n = re.subn(
        r'<script src="secret-pathways-assets/three\.min\.js"></script>',
        lambda m: '<script>\n' + js + '\n</script>', html, count=1)
    if n != 1:
        print('GAGAL menyisipkan three.min.js')
        return 1
    disisipkan.append(('three.min.js', os.path.getsize(js_path)))

    # 3. semua gambar (src="..." dan url(...) di CSS) -> data URI
    seen = {}

    def swap(m):
        rel = m.group('path')
        full = os.path.join(ROOT, rel.replace('/', os.sep))
        if not os.path.exists(full):
            print('  ! aset hilang:', rel)
            return m.group(0)
        if rel not in seen:
            seen[rel] = data_uri(full)
            disisipkan.append((os.path.basename(rel), os.path.getsize(full)))
        return m.group(0).replace(rel, seen[rel])

    html = re.sub(r'src="(?P<path>secret-pathways-assets/[^"]+\.(?:webp|png|jpg))"', swap, html)
    html = re.sub(r"url\('(?P<path>secret-pathways-assets/[^']+\.(?:webp|png|jpg))'\)", swap, html)
    html = re.sub(r'url\("?(?P<path>secret-pathways-assets/[^")]+\.(?:webp|png|jpg))"?\)', swap, html)

    # Hanya rujukan sungguhan yang dihitung. Path juga disebut di dalam
    # komentar CSS penulis asli, dan itu bukan sesuatu yang perlu dimuat.
    sisa = (re.findall(r'src="(secret-pathways-assets/[^"]+)"', html)
            + re.findall(r'href="(secret-pathways-assets/[^"]+)"', html)
            + re.findall(r'url\(["\']?(secret-pathways-assets/[^"\')]+)', html))
    io.open(OUT, 'w', encoding='utf-8').write(html)

    after = os.path.getsize(OUT)
    print('%-26s %s' % ('disisipkan', 'kb'))
    for name, size in disisipkan:
        print('  %-24s %d' % (name, size // 1024))
    print('\n%d berkas · %d KB -> %d KB' % (len(disisipkan), before // 1024, after // 1024))
    print('keluaran:', os.path.relpath(OUT, ROOT))
    if sisa:
        print('\nMASIH ADA RUJUKAN LUAR (%d):' % len(sisa), sorted(set(sisa))[:5])
        return 1
    print('nol rujukan luar — berkas benar-benar mandiri')
    return 0


if __name__ == '__main__':
    sys.exit(main())
