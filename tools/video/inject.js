/* Nusantara landing (#2a) demo video - sisi-halaman harness (disuntik SEBELUM skrip halaman).
   Turunan nusantara-3d/tools/video/inject.js. Bedanya dgn diorama:
   - halaman digerakkan SCROLL: per frame scrollTo(0, y(prog)) dari window.__secret.anchors()
   - animasi CSS (reveal teks, mask-line) TIDAK ikut jam virtual -> tiap frame semua document.getAnimations()
     dipause lalu currentTime disetel dari jam virtual (deterministik walau rekam ±1 fps)
   - kamera tangan: pembungkus renderer.render (pola carousel.mjs nusantara2a)
   - tema lewat localStorage 'nusa-theme' SEBELUM skrip halaman membacanya
   - cek kata terlarang pada teks DOM yang terlihat (H.visibleText) */
(() => {
  'use strict';
  const CFG = window.__HCFG || { seed: 20261021, theme: 'dusk' };
  const H = window.__H = { cfg: CFG, events: [], rec: null, cam: null };
  try { localStorage.setItem('nusa-theme', CFG.theme || 'dusk'); } catch (_) {}

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  let rng = mulberry32(CFG.seed);
  Math.random = () => rng();

  /* ---------------- jam virtual */
  let vnow = 1000;
  const BASE = 1761004800000;
  performance.now = () => vnow;
  Date.now = () => BASE + vnow;
  const timers = new Map();
  let tid = 0;
  window.setTimeout = (fn, ms, ...a) => { const id = ++tid; timers.set(id, { due: vnow + Math.max(0, +ms || 0), fn, a, every: null }); return id; };
  window.setInterval = (fn, ms, ...a) => { const id = ++tid; const e = Math.max(1, +ms || 0); timers.set(id, { due: vnow + e, fn, a, every: e }); return id; };
  window.clearTimeout = window.clearInterval = (id) => { timers.delete(id); };
  let rq = [], rid = 0;
  window.requestAnimationFrame = (cb) => { rq.push([++rid, cb]); return rid; };
  window.cancelAnimationFrame = (id) => { rq = rq.filter((e) => e[0] !== id); };
  function fireTimers() {
    for (let guard = 0; guard < 10000; guard++) {
      let bid = 0, bt = null;
      for (const [id, t] of timers) if (t.due <= vnow && (!bt || t.due < bt.due)) { bid = id; bt = t; }
      if (!bt) return;
      if (bt.every != null) bt.due += bt.every; else timers.delete(bid);
      try { if (typeof bt.fn === 'function') bt.fn(...bt.a); } catch (e) { console.error('[H] timer', e); }
    }
  }
  /* animasi CSS/Web Animations mengikuti jam virtual */
  function driveAnimations() {
    let list;
    try { list = document.getAnimations(); } catch (_) { return; }
    for (const a of list) {
      if (a.__hb === undefined) { a.__hb = vnow; try { a.pause(); } catch (_) {} }
      try { a.currentTime = vnow - a.__hb; } catch (_) {}
    }
  }
  H.tick = (dtSec) => {
    vnow += dtSec * 1000;
    fireTimers();
    const cbs = rq; rq = [];
    for (const e of cbs) { try { e[1](vnow); } catch (err) { console.error('[H] raf', err); } }
    driveAnimations();
  };
  H.pump = (n, dt) => { for (let i = 0; i < n; i++) H.tick(dt || 1 / 30); return vnow; };
  H.vnow = () => vnow;
  try { Object.defineProperty(document, 'hidden', { get: () => false }); Object.defineProperty(document, 'visibilityState', { get: () => 'visible' }); } catch (_) {}

  const EASE = {
    linear: (t) => t,
    outCubic: (t) => 1 - Math.pow(1 - t, 3),
    inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  };
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const S = () => window.__secret;

  /* key-frame umum: ease per ruas, tahan di luar rentang */
  function keyAt(keys, f, ease, mix) {
    if (keys.length === 1 || f <= keys[0].f) return keys[0];
    const L = keys[keys.length - 1];
    if (f >= L.f) return L;
    let i = 0; while (i < keys.length - 2 && f > keys[i + 1].f) i++;
    const a = keys[i], b = keys[i + 1], e = EASE[ease] || EASE.inOutSine;
    return mix(a, b, e(clamp((f - a.f) / Math.max(1e-6, b.f - a.f), 0, 1)));
  }
  const mixPose = (a, b, u) => ({ pos: a.pos.map((v, j) => lerp(v, b.pos[j], u)), look: a.look.map((v, j) => lerp(v, b.look[j], u)), fov: lerp(a.fov, b.fov, u) });
  const mixProg = (a, b, u) => ({ prog: lerp(a.prog, b.prog, u) });

  function pushEv(type, data) { H.events.push({ type, frame: H.rec ? H.rec.fi : -1, data }); }

  H.ready = () => { const s = S(); return !!(s && !s.fallback && s.renderer && s.anchors); };
  H.install = () => {
    const s = S();
    if (s.renderer.__hOrig) return true;
    const orig = s.renderer.render, cam = s.camera;
    s.renderer.__hOrig = orig;
    s.renderer.render = function (sc, cm, ...r) {
      if (cm === cam && H.cam) {
        cam.position.set(...H.cam.pos); cam.lookAt(...H.cam.look);
        if (Math.abs(cam.fov - H.cam.fov) > 1e-4) { cam.fov = H.cam.fov; cam.updateProjectionMatrix(); }
      }
      return orig.call(this, sc, cm, ...r);
    };
    return true;
  };
  H.clean = (on) => {
    let st = document.getElementById('hclean');
    if (!st) { st = document.createElement('style'); st.id = 'hclean'; document.head.appendChild(st); }
    // grain & kursor kustom selalu dibuang (acak/ikut mouse); clean = semua teks halaman juga
    st.textContent = '#cursor,#grain,#pre{display:none !important}' + (on ? '#top,#nav,#rail,main,section,footer,.sec,.hero{visibility:hidden !important}' : '');
  };
  function scrollYFor(prog) {
    const a = S().anchors(), i = Math.floor(clamp(prog, 0, a.length - 1)), j = Math.min(a.length - 1, i + 1);
    return lerp(a[i], a[j], prog - i);
  }
  H.anchors = () => S().anchors();

  /* teks DOM yang terlihat di viewport (untuk cek kata terlarang) */
  H.visibleText = () => {
    const out = [], w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const t = n.textContent.trim(); if (!t) continue;
      const el = n.parentElement; if (!el) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < 0.05) continue;
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (r.width < 1 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
      out.push(t);
    }
    return out.join(' | ');
  };

  H.begin = (spec) => {
    H.install();
    const s = S();
    H.clean(!spec.sim.ui);
    if (s.WORD && s.WORD.group) s.WORD.group.visible = !spec.sim.hideWord;
    H.rec = { fi: -1, handle: spec.handle, outFrames: spec.outFrames, dt: spec.dt, sim: spec.sim, camera: spec.camera, scroll: spec.scroll, lastAct: null };
    return true;
  };

  H.frame = (fi) => {
    const R = H.rec, s = S();
    R.fi = fi;
    const f = fi - R.handle;
    const pr = keyAt(R.scroll.keys, f, R.scroll.ease, mixProg).prog;
    const y = scrollYFor(pr);
    window.scrollTo(0, y);
    if (R.camera && R.camera.keys) H.cam = keyAt(R.camera.keys, f, R.camera.ease, mixPose); else H.cam = null;
    H.tick(R.dt);
    const act = Math.round(s.RIG.smooth);
    if (act !== R.lastAct && Math.abs(s.RIG.smooth - act) < 0.08) { pushEv('act', { act, prog: +s.RIG.smooth.toFixed(3) }); R.lastAct = act; }
    const evs = H.events; H.events = [];
    return { ev: evs, prog: +s.RIG.smooth.toFixed(4), scrollY: Math.round(scrollY), scale: s.renderer.getPixelRatio() };
  };
  H.frameRb = async (fi) => {
    const r = H.frame(fi);
    const gl = S().renderer.getContext(), w = gl.drawingBufferWidth, hh = gl.drawingBufferHeight;
    if (!H.buf || H.buf.length !== w * hh * 4) H.buf = new Uint8Array(w * hh * 4);
    gl.readPixels(0, 0, w, hh, gl.RGBA, gl.UNSIGNED_BYTE, H.buf);
    await fetch(H.sink, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: H.buf });
    r.size = [w, hh];
    return r;
  };
})();
