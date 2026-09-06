#!/usr/bin/env python3
"""Server statis untuk nusantara-landing, plus satu endpoint POST /save.

Endpoint itu dipakai untuk menangkap ulang gambar pratinjau langsung dari
scene three.js: halaman merender sudut kamera yang diinginkan, lalu mengirim
hasilnya ke sini sebagai data URL. Tanpa ini, gambar harus melewati konteks
agent sebagai base64 — mahal dan tidak perlu.

Jalankan dari akar nusantara-landing/:
    python tools/devserver.py 8150
"""
import base64
import json
import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Hanya folder ini yang boleh ditulisi, dan hanya nama berkas polos.
SAVE_DIR = os.path.join(ROOT, 'secret-pathways-assets', 'generated')
SAFE_NAME = re.compile(r'^[a-z0-9][a-z0-9._-]{0,63}\.(webp|png|jpg)$')


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        if '/save' in (self.path or ''):
            sys.stderr.write('%s\n' % (fmt % args))

    def _json(self, code, payload):
        body = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if self.path != '/save':
            return self._json(404, {'error': 'endpoint tidak dikenal'})
        try:
            n = int(self.headers.get('Content-Length', 0))
            if n <= 0 or n > 40 * 1024 * 1024:
                return self._json(413, {'error': 'ukuran tidak wajar'})
            req = json.loads(self.rfile.read(n))
            name = req.get('name', '')
            if not SAFE_NAME.match(name):
                return self._json(400, {'error': 'nama berkas ditolak: %r' % name})
            data = req.get('dataUrl', '')
            if ',' not in data:
                return self._json(400, {'error': 'dataUrl tidak valid'})
            raw = base64.b64decode(data.split(',', 1)[1])
            os.makedirs(SAVE_DIR, exist_ok=True)
            path = os.path.join(SAVE_DIR, name)
            with open(path, 'wb') as f:
                f.write(raw)
            return self._json(200, {'ok': True, 'path': name, 'bytes': len(raw)})
        except Exception as exc:                      # noqa: BLE001
            return self._json(500, {'error': str(exc)})


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8150
    print('melayani %s di http://localhost:%d  (POST /save -> %s)'
          % (ROOT, port, os.path.relpath(SAVE_DIR, ROOT)))
    ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
