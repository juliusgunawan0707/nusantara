# QC klip 2a — landing (sesi capture, 20 Okt 2026)

Harness `tools/video/capture.mjs` + `inject.js` (2a), benih 20261021, tema `dusk`, `?adapt=0`, kanvas 1920×1080 (pixelRatio 1).
Semua contact sheet final `video/contact/<id>.png` sudah dibaca. Koreksi kamera: TIDAK ada (`overrides.json` tidak dibuat, shots.json dipakai apa adanya).
Orkestrator tetap melakukan QC akhir.

| Klip | Frame (rekam / pakai) | Mode | darkShareMax | textFail | textCheck | Vonis | Catatan |
|---|---|---|---|---|---|---|---|
| S01_hook | 120 / 120 (handle 0) | shot (ui) | n/a | 0 | 0 | LULUS | f0 gelap pekat lalu intro NUSA naik dari awal (terlihat huruf muncul f~6-18), preloader tak terlihat, judul hero ter-reveal bergerak di jam virtual; kamera hero mendekat pelan sampai N/A terpotong tepi (desain halaman), pas menyambung ke awal S02 |
| S02_walk | 660 / 600 (handle 30+30) | shot (ui) | n/a | 0 | 17 (lihat bawah) | LULUS | 4 babak lengkap, reveal teks CSS bergerak (judul babak terpotong lalu terbuka), jeda terbaca di tiap babak, screenshot terpotong tepat di `scrollY` anchors 1123 / 2300 / 3506 / 4656 |
| S03_scale | 180 / 120 (handle 30+30) | gl | 0,055 | 0 | 0 | LULUS | tugu + tangga + istana, WORD tersembunyi, senja terang, dorong pelan; deterministik (45/45 SHA-256 identik) |
| S04_bug | 200 / 140 | gl | 0,024 | 0 | 0 | LULUS | tugu-close, orbit kecil, istana di kanan; daun besar lewat di f0 (sebelum handle berakhir, aman) |
| S05_end | 160 / 100 | gl | 0,065 | 0 | 0 | LULUS | tangga + istana di tengah, tugu masuk dari kanan; sepertiga bawah = tangga gelap, aman untuk teks end card |

Frame = indeks klip TEREKAM; klip pakai dipotong `handle` di depan (30) — untuk S02 kurangi 30 dari angka `events.json` agar jadi waktu klip pakai.

## Event `act` S02 (events.json, frame rekam → frame klip pakai)
Babak 0 f0 → 0 · babak 1 f110 → 80 · babak 2 f296 → 266 · babak 3 f446 → 416 · babak 4 f596 → 566 (klip pakai 600 frame, babak 4 ditahan sampai akhir).
Sumbu `ActTag` ikut `events.act`: 4 label shots.json cocok dengan 4 babak (Nationhood Axis / Plaza Bhinneka / Kusuma Bangsa Park / Ceremonial Plaza).

## Pagar fakta (`textHits` S02)
- FAIL: 0 di semua klip.
- CHECK `Rp381` x12, f90–255 (babak 1 / `#gate`): kalimat halaman "…Plaza Seremoni, was built between December 2022 and December 2023 for Rp381.7 billion." (teks badan kecil, terbaca di 1080p). Diizinkan CONTRACT §37 (Setneg/PUPR) tetapi muncul di video selama ±5,5 dtk — **keputusan orkestrator: biarkan, atau potong/tutup area itu di Remotion**. Overlay tanpa Rp.
- CHECK `inaugurat` x5, f585–645 (babak 4 / Plaza Seremoni): "…inaugurated on 14 August 2024" — sesuai izin (Plaza Seremoni, 14 Agu 2024), tidak ada kemunculan lain.
- Teks halaman lain yang terlihat (bukan dilarang tapi dicatat): "1,995 m² holding a plaza" di babak 3 (Taman Kusuma Bangsa); angka statistik babak 1 = 252,660 / 75 / 2022 / ∞.

## Perbaikan harness (tools/video saja)
1. **Penyebab macet S01 (frame 14)**: `Page.captureScreenshot` PNG pada UI penuh ±3,1–4,2 MB per frame; pesan CDP > 4 MiB menggantung tanpa error (terbukti: hang tepat saat base64 melewati 4.194.304 karakter; WebP lossless 3,6 MB lolos tapi 2 dtk/frame dan nyaris di batas). Diganti **JPEG quality 96** (≈0,5–1,0 MB, 0,16 dtk/frame; S02 jadi ±10 fps, bukan 1 fps). Ekstensi frame `.jpg`, ffmpeg membaca `%06d.jpg`. Kualitas tetap tinggi (encode akhir x264 CRF 12).
2. `CDP.send` kini punya timeout 90 dtk (error jelas, bukan menggantung selamanya).
3. `inject.js` TIDAK diubah; sudah benar (reveal CSS mengikuti jam virtual, WORD disembunyikan, `H.clean(true)` tidak menyembunyikan kanvas).

## Determinisme
- S03_scale (gl): 45/45 frame identik SHA-256.
- S01_hook (shot, compositor screenshot): bukan bit-persis. Dibanding dua rekaman: f0–28 identik byte-per-byte; setelah itu hanya selisih sepetak piksel kecil (daun partikel di kiri bawah) dengan PSNR 63–79 dB (tak terlihat mata). Hash JPEG berbeda tapi gambar sama; cukup untuk video, bukan untuk uji hash. Satu rekaman memperlihatkan selisih mikro di f6 pada percobaan lain (pola sama: sepetak piksel).
