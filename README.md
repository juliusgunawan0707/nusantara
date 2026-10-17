# Nusantara — a rainforest becoming a capital

Four acts along **Sumbu Kebangsaan**, the nationhood axis of Nusantara in East
Kalimantan, rendered live in WebGL. One page, no build step, no dependencies at
runtime. Almost every surface in the 3D scene is drawn into a canvas when the
page loads; the two exceptions are the palace closing the valley and the three
gallery plates, which are generated images. Nothing on the page is a
photograph.

**Live:** <https://juliusgunawan0707.github.io/nusantara/>

---

## What it is

A personal project, and **not a statement by any institution.** The buildings in
the scene are stylised reconstructions drawn from public references — they carry
the atmosphere of the places, not the authority of them. Where the page states a
figure or a date it comes from a government source, listed below.

The four acts follow the axis from its southern end back up to the palace:

| Act | Place |
|---|---|
| 01 | Sumbu Kebangsaan — the axis, and the three plazas URBAN+ designed on it |
| 02 | Plaza Bhinneka Tunggal Ika — the Bhinneka Bridge, 0 km Plaza, Diversity Amphitheater |
| 03 | Taman Kusuma Bangsa — the Soekarno–Hatta statues, Api Abadi, Monumen Bendera |
| 04 | Plaza Seremoni — the space nearest the palace |

## Sources for the figures on the page

- Land area 252,660 ha — Law 21/2023 (revising Law 3/2022)
- Green cover 75% — forest-city target: 65% protected area + 10% food production
  (explanatory note to Article 2(a) of Law 3/2022; annex to Perpres 63/2022)
- Sumbu Kebangsaan **stage one** (Plaza Seremoni): built Dec 2022 – Dec 2023,
  Rp381.7 billion, contract Rp365.8 billion to PT Brantas Abipraya, inaugurated
  14 August 2024 — [pu.go.id](https://pu.go.id/berita/kementerian-pupr-targetkan-penataan-sumbu-kebangsaan-ikn-tahap-i-rampung-desember-2023),
  [setneg.go.id](https://setneg.go.id/baca/index/presiden_jokowi_resmikan_plaza_seremoni_sumbu_kebangsaan_di_ibu_kota_nusantara).
  That figure covers stage one (Plaza Seremoni) only.
- Taman Kusuma Bangsa: 1,915 m², opened 12 August 2024, the Sayap Pelindung
  Nusantara garuda-wing element, 79 m flag monument (a MURI record as the country's tallest) — [pu.go.id](https://pu.go.id/berita/simbol-penghormatan-bagi-para-pahlawan-bangsa-taman-kusuma-bangsa-di-ikn-diresmikan)
- The three plazas were designed by [URBAN+](https://www.urbanplus.co.id/projects/)
  for the Ministry of Public Works

## Running it

Any static server will do. The repository ships one for convenience, because the
page loads its assets over relative paths and `file://` will not serve them:

```bash
python tools/devserver.py 8150
```

Then open <http://localhost:8150/>.

### Query flags

| Flag | Effect |
|---|---|
| `?shot=0` … `?shot=5` | jump straight to one act, no intro |
| `?post=0` | turn off bloom, grain and vignette |
| `?nogl=1` | disable WebGL entirely — the page stays a page |
| `?driver=timer` | drive the frame loop from `setTimeout` instead of rAF |

## Building the standalone file

`tools/build.py` inlines three.js, the fonts and every image as data URIs and
writes `nusantara-standalone.html` — one file, zero external references, opens
straight from disk:

```bash
python tools/build.py
```

That file is not committed; it is roughly 8 MB and regenerates in a second.

## Credits

Adapted from the **Kage** page by [ThreeUI](https://threeui.com). The geometry,
the copy and the artwork are new; the scene's scaffolding — camera rig, post
chain, cloth cards, foreground parallax — is theirs.

Photographs used as shape references while modelling the Tugu Titik Nol are
© Humas Otorita IKN and Kementerian PU. **None of them appear on the page**, and
none are included in this repository — every texture is generated in code.
