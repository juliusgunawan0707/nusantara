# Nusantara landing (#2a) Demo Video — CONTRACT

Ditulis 20 Okt 2026. Turunan `nusantara-3d/video/CONTRACT.md` (aturan umum, kepemilikan, skema `shots.json` SAMA).
Yang berbeda ditulis di sini. Rencana: `C:\Users\juliu\.claude\plans\c-users-juliu-onedrive-claude-claude-co-concurrent-quill.md`.

## 1. Keluaran
| Item | Nilai |
|---|---|
| Master | 1920×1080, 30 fps, 1080 frame (36 dtk; dikunci ke ketukan), H.264 yuv420p + AAC 48 kHz |
| Path master | `nusantara-landing/video/out/nusantara-demo-16x9.mp4` |
| Animatic | `nusantara-landing/video/out/animatic-nusantara.mp4` |
| Remotion | komposisi `NusaLanding` di `C:\Users\juliu\dev\nusantara-demo-video\` |

## 2. Halaman & kait harness
- Server `python tools/devserver.py 8150` (folder `nusantara-landing/`), URL `index.html?adapt=0`
  (`adapt=0` mengunci governor resolusi `PERF`; tanpa itu jam virtual 1/30 membuat resolusi jatuh ke 0,55).
- Handle `window.__secret` = { RIG, WORLD, WORD, CAM, POST, renderer, scene, camera, anchors() }. 5 bagian `[data-cam]`
  0 hero · 1 `#gate` · 2 `#pathways` · 3 `#lessons` · 4 `#eternity`. `RIG.prog/smooth` 0..4.
- Scroll: `scroll.keys[{f, prog}]` → `scrollTo(0, y)` per frame (y dari `anchors()`), halaman sendiri menghaluskan (`RIG.smooth`).
- Animasi CSS (reveal teks) dipause & `currentTime` disetel dari jam virtual tiap tick (`document.getAnimations()`).
- Tema: `localStorage['nusa-theme']` disetel SEBELUM skrip halaman (`dusk`; malam menggantung headless di kamera tangan).
- Kamera tangan: pembungkus `renderer.render` (pola carousel.mjs `nusantara2a`), `WORD.group` disembunyikan (`hideWord`).
- Mode: `sim.ui: true` → `Page.captureScreenshot` dgn clip y = `scrollY` (koordinat DOKUMEN), teks halaman ikut;
  `false` → `gl.readPixels` (cepat), teks halaman disembunyikan.
- Grain & kursor kustom (`#grain`, `#cursor`) selalu disembunyikan (acak / ikut mouse).

## 3. Gaya visual (Remotion)
- Font: `kairos/profil/carousel/nusantara-2a/slides/fonts/` Instrument Serif (judul, miring = aksen) + Inter (badan).
- Warna: night-forest `#0c1411`, krem `#f3ece0`, amber `#e9a25b`, redup `#a59c8c`. Slab 82%.
- Ukuran, area aman, kurva gerak: sama dgn kontrak 2b. Teks halaman sudah banyak → overlay HEMAT di S02.

## 4. Fakta (pagar, lebih ketat dari 2b)
- Angka boleh: 252.660 ha (UU 21/2023), ±3,4× Singapura (SingStat 744,3 km²), empat babak, kode bug CanvasTexture.
- DILARANG di overlay MAUPUN teks halaman yang terekam: `17 m`, `680`, `Rp`+angka, 4.661/4.854/61.317, kata `diorama`
  atau perbandingan dgn versi 3D maket. Harness memindai teks DOM terlihat tiap 15 frame (`textHits`, FAIL = tolak klip).
- "inaugurated" di halaman hanya untuk Plaza Seremoni 14 Agu 2024 (diizinkan) → dicatat `CHECK`, dinilai manual.
- Dicek 20 Okt: `17 m` dan `Rp680` SUDAH tidak ada di `index.html`. Yang tersisa: "Rp381.7 billion" untuk Plaza Seremoni
  tahap I (babak 1 `#gate`, bersumber Setneg/PUPR, sama dgn carousel 2a) → `CHECK`, bukan FAIL. Overlay tetap tanpa Rp.
- End card: "Personal project, not an official statement. Buildings are stylised."
