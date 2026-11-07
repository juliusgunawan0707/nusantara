# Nusantara landing (#2a) Demo Video: musik, teks layar, SFX (sesi C)

Ditulis 20 Okt 2026. Tidak ada file yang diunduh, tidak ada credit AI, `shots.json` tidak disentuh. Julius yang mengunduh.
Halaman lagu dibuka satu per satu lewat WebFetch (judul, artis, durasi, lisensi, label AI/Content ID). Teks overlay dirapikan dengan skill `humanizer`. Aturan teks: CONTRACT 2a §4 (lebih ketat dari 2b) dan ledger `kairos\profil\carousel\nusantara-2a\copy.md`.

Lokasi simpan
- Musik: `C:\Users\juliu\OneDrive\Claude\Claude Code\nusantara-landing\video\audio\` (nama berkas di bawah)
- SFX: `C:\Users\juliu\OneDrive\Claude\Claude Code\nusantara-landing\video\audio\sfx\` (salin saja lima berkas yang sudah ada di `nusantara-3d\video\audio\sfx\`, tidak ada unduhan baru)

## 0. Lisensi dan hal yang TIDAK bisa diverifikasi

- Ketiga halaman menyatakan "Free for use under the Pixabay Content License" (atribusi tidak wajib, boleh dipotong dan dimixing, dilarang menjual berkas mentahnya). Ringkasan: https://pixabay.com/service/license-summary/
- Ketiganya berlabel Content ID Registered (aman di LinkedIn, mungkin diklaim bila diunggah ke YouTube). **Tidak ada yang berlabel AI generated** di halamannya.
- BPM tidak tertera di Pixabay. Titik naik dan titik potong di bawah adalah HIPOTESIS dari deskripsi, bukan hasil dengar. Setelah diunduh, ukur BPM seperti di 2b (`beats.json`).
- Dibuang karena berlabel AI atau profil artisnya mengaku AI: "Cinematic Calm" (AvelineMusic), "Cinematic Lofi" (ZephiraMusic), "Impossible" (kaazoom; profil artis menyatakan semua musiknya AI), "Dusk" (MarloweMusic).
- Dibuang karena nuansa tidak cocok: "Awards Night" (The_Mountain, orkestra gala/trailer, terlalu dekat ke rasa GBK), lagu "Tension" dan "Suspense" (terlalu thriller).

Beda dari lagu lain
- 2b: Cinematic Documentary (Lexin_Music), 85 BPM, akustik hangat (kalimba, gitar). 2a sengaja elektronik atmosferik, dingin dan lapang, senja ke malam.
- GBK: anthem stadion 128 BPM.

## 1. Shortlist musik (peringkat)

Struktur video 2a: hook 0 sampai 4 dtk (wordmark NUSA, caption masuk ±2,3 dtk), jalan empat babak 4 sampai 24 dtk, skala 24 sampai 28 dtk, bug 28 sampai 32,7 dtk, end card 32,7 sampai 36 dtk. Yang dicari: pembuka tenang yang naik di ±4 dtk (f120, awal scroll), tanjakan di ±24 dtk (angka 252,660 ha), sedikit ketegangan di ±28 dtk (bug), lalu selesai.

| Rank | Judul | Artis | URL | Durasi | Suasana (dari halaman) | Alasan | Perkiraan titik potong (hipotesis) | Nama berkas yang diunduh |
|---|---|---|---|---|---|---|---|---|
| **#1** | Inspiring Cinematic Ambient | Clavier-Music | https://pixabay.com/music/electronic-inspiring-cinematic-ambient-255033/ | 1:25 | Genre Electronic, Build Up Scenes, Ambient. Mood Dreamy, Restless, Bright, Hopeful, Suspense. Tag Night, Evening, Timelapse, Stars, Night Sky. Deskripsi: soaring synth pads dan deep atmospheric textures | Satu-satunya yang tag-nya menyebut Evening dan Night secara langsung, cocok dengan tema dusk di capture. Genre Build Up Scenes berarti ada tanjakan, dan campuran Hopeful dengan Suspense cocok dengan jalur dari jalan-jalan ke bug ke end card. Tidak ada drum keras. Terbit 28 Okt 2024 | Mulai dari awal. Dengarkan apakah pad naik di ±4 dtk (f120). Potong di 0:36 dengan fade 1,5 dtk. Lagu cuma 1:25, jadi punya ruang untuk digeser offset bila tanjakannya jatuh di tempat lain | `clavier-music-inspiring-cinematic-ambient-255033.mp3` (perkiraan, ikuti nama yang diberi Pixabay) |
| #2 | Cinematic Ambient | Kulakovka | https://pixabay.com/music/pulses-cinematic-ambient-274889/ | 1:58 | Genre Pulses, Electronic, Ambient, Build Up Scenes. Mood Dreamy, Bright, Hopeful, Relaxing. Tag Chill, Landscape, Sky, Nature, Piano | Ada denyut ritmis (Pulses) di bawah pad, jadi video terasa bergerak walau tanpa drum. Cocok untuk scroll panjang 4 babak. Tag Landscape dan Sky pas untuk kamera lanskap. Risiko: moodnya cerah dan lega, bukan malam, jadi bagian bug mungkin terasa terlalu manis | Naik di ±4 dtk bila pulsa mulai masuk. Potong 0:36 dengan fade 1,5 dtk. Bila pulsa baru muncul setelah 10 dtk, mulai klip dari offset tempat pulsa masuk | `kulakovka-cinematic-ambient-274889.mp3` |
| #3 | Atmosphere Pulse | leberch | https://pixabay.com/music/pulses-atmosphere-pulse-263075/ | 2:06 | Genre Pulses, Electronic. Mood Restless, Suspense, Mysterious, Dreamy, Dark. Tag Cinematic, Dark, Deep, Sci-fi, Minimal, Drone | Opsi paling gelap dan paling "teknis". Pilih ini bila Julius ingin bagian bug (S04) terasa seperti penyelidikan dan malam terasa dalam. Risiko: tag Tension dan Sci-fi, hook bisa terasa seperti trailer thriller dan tidak cocok dengan caption "Indonesia is building a new capital" | Dengarkan dulu 0:00 sampai 0:45. Bila tegang sejak awal, jangan pakai. Bila ada bagian tenang di awal lalu naik, potong 0:36 dengan fade 1,5 dtk | `leberch-atmosphere-pulse-263075.mp3` |

Cadangan yang sudah diperiksa
- "Ambient Piano and Strings" (Good_B_Music), https://pixabay.com/music/beautiful-plays-ambient-piano-and-strings-10711/ , 3:37, Beautiful Plays, Ambient, Pulses. Lembut dan hangat, tidak berlabel AI, tapi rasanya paling dekat ke lagu 2b (hangat dan akustik), jadi tidak dipilih untuk menjaga 2a dan 2b tampil beda.

**Pilihan #1: Inspiring Cinematic Ambient (Clavier-Music).** Dengarkan 0:00 sampai 0:45 dulu. Bila pad datar tanpa tanjakan, pindah ke #2.

## 2. Teks layar final (bahasa Inggris)

Aturan yang dicek
- Maks 7 kata per kartu. Kata = potongan dipisah spasi. Yang dihitung = teks besar kartu. Tidak dihitung: eyebrow (label kecil), URL, catatan kaki 32 px, kode. Kolom "+eyebrow" memperlihatkan total bila eyebrow ikut dihitung.
- Tanpa em dash/en dash, tanpa tanda titik dua, angka hanya dari ledger 2a, kata terlarang CONTRACT 2a §4 = 0 (`17 m`, `680`, `Rp`+angka, `4.661`, `4.854`, `61.317`, `diorama`, perbandingan dengan versi 3D maket).
- Hasil humanizer: tidak ada pola "bukan X tapi Y", penutup satu baris, atau triad. Satu kasus baris fragmen digabung (S04). Fakta tidak diubah.

| Shot | Kartu | Sekarang (shots.json) | Final | Kata | +eyebrow | Alasan |
|---|---|---|---|---|---|---|
| S01 | Caption | Indonesia is building / a new capital. | **Tetap** | 6 | 6 | Jelas, 6 kata, tanpa angka. "Still being built" ada di ledger |
| S02 | ActTag | The Nationhood Axis · Plaza Bhinneka · Kusuma Bangsa Park · Ceremonial Plaza | **Tetap** | 3, 2, 3, 2 | sama | Nama babak persis seperti carousel 2a dan halaman |
| S02 | Caption | eyebrow One scroll, four acts / Rendered live in the browser. | **Tetap** | 5 | 9 | Eyebrow 4 kata, kartu 5 kata. Teks halaman sudah banyak di S02, jadi tidak ditambah. "Four acts" = ledger |
| S03 | StatLine | eyebrow The scale / 252,660 ha / about 3.4 times Singapore / note Law 21/2023 · SingStat | eyebrow **The scale** / **252,660 ha** / **about 3.4 times Singapore** / catatan kaki **Law 21/2023 and SingStat** | 6 | 8 + catatan 4 | Titik tengah di catatan diganti "and" supaya terbaca sebagai kalimat. Angka 252,660 dan 3.4 sama dengan ledger (2.526,6 km² dibagi 744,3 km² = 3,39). Catatan kaki 32 px |
| S04 | Caption | eyebrow The silent bug / No error. / Fully invisible. | eyebrow **The silent bug** / **No error, yet fully invisible.** | 5 | 8 | Dua fragmen pendek berurutan adalah pola panggung dramatis. Digabung jadi satu kalimat, tanpa menambah fakta |
| S04 | CodeCard | `new THREE.CanvasTexture(img)   // no error, transparent` dan `ctx.drawImage(img, 0, 0)      // the fix` | `new THREE.CanvasTexture(img)   // no error, transparent` dan `ctx.drawImage(img, 0, 0); new THREE.CanvasTexture(canvas)` | kode (komentar 3 kata) | sama | Baris kedua aslinya hanya `drawImage`, padahal perbaikannya = gambar ke canvas dulu, LALU CanvasTexture dari canvas (persis seperti baris kode di slide 7 carousel dan Known Fixes di CLAUDE.md). Komentar "the fix" dibuang supaya kode berbicara sendiri. Baris 2 panjang (±58 karakter), pakai ukuran huruf kecil di kartu |
| S05 | EndCard | Walk it yourself / nusantara-alpha.vercel.app / Best on a laptop. Nothing to install. / disclaimer | Walk it yourself / nusantara-alpha.vercel.app / **Best on a laptop.** / disclaimer **tidak diubah** | 3 + 4 = 7 | 7 | Hint aslinya 7 kata, total kartu 10. "Nothing to install" dibuang untuk memenuhi batas (carousel mengklaim "one HTML file" tidak dipakai; klaim ini tidak ada di ledger 2a jadi lebih aman keluar). URL dan disclaimer di luar hitungan |

Disclaimer end card (WAJIB persis, CONTRACT 2a §4): `Personal project, not an official statement. Buildings are stylised.` 9 kata, catatan kaki 32 px.

Perubahan yang perlu diterapkan orkestrator (props di shots.json)
1. S03 StatLine: `note` jadi `"Law 21/2023 and SingStat"`.
2. S04 Caption: `lines` jadi `["No error, yet", "fully invisible."]`.
3. S04 CodeCard: `lines[1]` jadi `"ctx.drawImage(img, 0, 0); new THREE.CanvasTexture(canvas)"`.
4. S05 EndCard: `hint` jadi `"Best on a laptop."`.
Selain itu tidak ada perubahan.

## 2.1 SFX (pakai berkas yang sama dengan video Nusantara 3D)

Semua sudah diverifikasi saat 2b (lisensi Pixabay Content License, tanpa label Content ID/AI) dan sudah diunduh Julius di `nusantara-3d\video\audio\sfx\`. Salin ke `nusantara-landing\video\audio\sfx\`. Frame di bawah dari `shots.json` 2a sebelum ketukan dikunci; offset puncak transien (detik dari awal berkas): table_tap 0,3 · low_hit 0,2 · caption_in 0,6 · light_sweep 1,2 · ui_tap 0,2.

| Cue | Berkas | Dipakai di | Frame (sebelum ketukan dikunci) |
|---|---|---|---|
| low_hit | `universfield-cinematic-low-hit-291095.mp3` | Wordmark NUSA muncul (S01), nilai 252,660 ha (S03), end card (S05) | wordmark: waktu intro dari `events` (bila tak ada, f0); S03: puncak di f726 (mulai f720); S05: puncak di f984 (mulai f978) |
| caption_in | `universfield-swoosh-012-352858.mp3` | Caption masuk S01, S02, S04; pergantian babak (ActTag berubah) | puncak di f70 (S01), f128 (S02 caption), f846 (S04 caption); pergantian babak ±f210, ±f390, ±f540, ±f690 (120 + kunci scroll prog 1, 2, 3, 4) |
| ui_tap | `universfield-soft-ui-click-147352.mp3` | CodeCard muncul (S04) | puncak di f900 (840 + 60) |

Catatan
- Setiap `caption_in` dimulai 18 frame SEBELUM frame puncak di atas (puncak transien 0,6 dtk dari awal berkas). `low_hit` dan `ui_tap` dimulai 6 frame sebelum puncak.
- Frame pergantian babak (ActTag) harus dibaca dari `events.act` hasil rekam, bukan dari angka di atas; angka itu perkiraan dari `scroll.keys` S02.
- Tidak ada SFX untuk scroll itu sendiri. Mixing: gain mengikuti saran di `nusantara-3d\video\beats.json` (musik turun ±4 dB, SFX −2 sampai −8 dB).

## 3. Hasil cek (dijalankan di teks final)

Dijalankan lewat skrip Python (hitung kata dipisah spasi, cari U+2013/U+2014, titik dua di teks kartu, dan daftar kata terlarang CONTRACT 2a §4) terhadap string final di bagian 2:

| Elemen | Kata (kartu) | Kata (+eyebrow) | Em/en dash | Titik dua | Kata terlarang |
|---|---|---|---|---|---|
| S01 caption | 6 | 6 | 0 | 0 | 0 |
| S02 tag 1 sampai 4 | 3, 2, 3, 2 | sama | 0 | 0 | 0 |
| S02 caption | 5 | 9 | 0 | 0 | 0 |
| S03 stat | 6 | 8 | 0 | 0 | 0 |
| S03 catatan kaki | 4 | 4 | 0 | 0 | 0 |
| S04 caption | 5 | 8 | 0 | 0 | 0 |
| S04 kode (2 baris) | komentar 3 kata | sama | 0 | 0 | 0 |
| S05 end card (judul + hint) | 7 | 7 | 0 | 0 | 0 |
| S05 disclaimer (catatan kaki, wajib persis) | 9 | 9 | 0 | 0 | 0 |

Semua kartu besar ≤ 7 kata. Total dengan eyebrow maksimum 9 (S02 caption); S03 8, S04 8. Angka di layar (252,660 ha, 3.4, empat babak, Law 21/2023, SingStat) semuanya ada di ledger 2a. Tidak ada kata "diorama" atau perbandingan dengan versi 3D maket.

## 4. Catatan untuk Julius dan orkestrator

1. **Teks halaman yang terekam di S01 dan S02 (ui: true) bisa menggagalkan `textHits`.** Ledger 2a mencatat landing live masih menampilkan "17 m" dan "Rp680 bn" sampai sesi lain memperbaikinya, dan teks kecil babak 4 memuat "Rp381.7 billion" (kata `Rp`+angka dilarang di CONTRACT 2a §4, bahkan untuk teks halaman). Selama halaman belum diperbaiki, klip S01 dan S02 akan ditolak harness atau perlu ditutup (masking) di Remotion. Ini di luar tugas saya, hanya diberi tahu.
2. **"Inaugurated"** untuk Plaza Seremoni 14 Agu 2024 diizinkan, dinilai manual (§4).
3. Saya tidak menambah overlay baru di S02 (kontrak §3: hemat karena teks halaman sudah banyak).
4. **Lagu #1 atau #2?** Setelah dipilih dan diunduh, beri tahu saya untuk mengukur BPM dan menulis `beats.json` 2a seperti di 2b.
