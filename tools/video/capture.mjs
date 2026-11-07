// Nusantara landing (#2a) demo video: deterministic frame-capture harness.
// Salinan berparameter dari nusantara-3d/tools/video/capture.mjs (CDP, jam virtual, gl.readPixels -> ffmpeg).
// Beda: halaman digerakkan scroll, animasi CSS ikut jam virtual (inject.js), mode 'shot' memotong di scrollY,
// cek kata terlarang pada teks DOM yang terlihat. Kontrak: nusantara-landing/video/CONTRACT.md + shots.json.
//
//   node tools/video/capture.mjs S02_walk [--frames N] [--keep]
//   node tools/video/capture.mjs all | --dry ID | --check-determinism ID | --eval "expr;;expr"

import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { once } from 'node:events';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');                  // nusantara-landing/
const VIDEO = join(ROOT, 'video');
const CLIPS = join(VIDEO, 'clips');
const CONTACT = join(VIDEO, 'contact');
const SHOTS = JSON.parse(readFileSync(join(VIDEO, 'shots.json'), 'utf8'));
const INJECT = readFileSync(join(HERE, 'inject.js'), 'utf8');
const PORT = 8150;                                        // devserver landing; 8124 DILARANG
const BASE_URL = `http://127.0.0.1:${PORT}/index.html`;
const DEBUG_PORT = Number(process.env.NUSA_CDP_PORT) || 9367;
const FRAME_PORT = Number(process.env.NUSA_FRAME_PORT) || 9368;
const W = SHOTS.meta.width, Hh = SHOTS.meta.height, FPS = SHOTS.meta.fps;
const SEED = 20261021;
const CACHE = process.env.NUSA_CACHE || 'C:/Users/juliu/dev/nusa-video-cache/landing';
const OVR = existsSync(join(HERE, 'overrides.json')) ? JSON.parse(readFileSync(join(HERE, 'overrides.json'), 'utf8')) : {};
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// pagar fakta (CONTRACT §8). "inaugurated" diizinkan HANYA untuk Plaza Seremoni -> dicatat, dinilai manual
const FORBIDDEN = [/\b17\s?m\b/i, /680/, /\bRp\s?(?!381)\d/, /4[.,]661/, /4[.,]854/, /61[.,]317/, /diorama/i];
// Rp381,7 miliar = Plaza Seremoni tahap I saja (Setneg/PUPR, bersumber di README landing) -> CHECK, bukan FAIL
const WATCH = [/inaugurat/i, /Rp\s?381/];

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      const p = msg.id && this.pending.get(msg.id);
      if (!p) return;
      this.pending.delete(msg.id);
      msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
    });
  }
  static async open(url) { const ws = new WebSocket(url); await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; }); return new CDP(ws); }
  send(method, params = {}, timeoutMs = 90000) {
    const id = ++this.id; this.ws.send(JSON.stringify({ id, method, params }));
    return Promise.race([new Promise((resolve, reject) => this.pending.set(id, { resolve, reject })),
      sleep(timeoutMs).then(() => { this.pending.delete(id); throw new Error('CDP timeout (' + timeoutMs + ' ms): ' + method); })]);
  }
  async eval(expr, timeoutMs = 120000) {
    const r = await Promise.race([
      this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }),
      sleep(timeoutMs).then(() => { throw new Error('eval timeout (' + timeoutMs + ' ms): ' + String(expr).slice(0, 120)); }),
    ]);
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + (r.exceptionDetails.exception?.description || ''));
    return r.result && r.result.value;
  }
  close() { this.ws.close(); }
}

async function launch() {
  if (!CHROME) throw new Error('Chrome/Edge tidak ditemukan');
  const profile = mkdtempSync(join(tmpdir(), 'nusalanding-'));
  const chrome = spawn(CHROME, [
    '--headless=new', `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profile}`,
    '--use-angle=d3d11', '--enable-gpu-rasterization', '--ignore-gpu-blocklist',
    '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows',
    '--hide-scrollbars', '--mute-audio', '--no-first-run', '--no-default-browser-check',
    `--window-size=${W},${Hh}`, 'about:blank',
  ], { stdio: 'ignore' });
  let target;
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(250);
    target = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`).then((r) => r.json()).then((l) => l.find((t) => t.type === 'page')).catch(() => null);
  }
  if (!target) { chrome.kill(); throw new Error('endpoint DevTools tidak muncul'); }
  const cdp = await CDP.open(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: W, height: Hh, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  const close = async () => { try { cdp.close(); } catch {} chrome.kill(); await sleep(600); try { rmSync(profile, { recursive: true, force: true }); } catch {} };
  return { cdp, close };
}

let serverProc = null;
async function ensureServer() {
  const ok = () => fetch(BASE_URL, { method: 'HEAD' }).then((r) => r.ok).catch(() => false);
  if (await ok()) return;
  console.log(`server ${PORT} belum ada -> python tools/devserver.py ${PORT}`);
  serverProc = spawn('python', ['tools/devserver.py', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
  for (let i = 0; i < 40; i++) { await sleep(300); if (await ok()) return; }
  throw new Error(`server ${PORT} tidak bisa dijalankan`);
}

function resolveSpec(id) {
  const raw = SHOTS.captures[id];
  if (!raw) throw new Error(`capture tidak dikenal: ${id}`);
  const spec = JSON.parse(JSON.stringify(raw));
  if (OVR.captures && OVR.captures[id]) Object.assign(spec, JSON.parse(JSON.stringify(OVR.captures[id])));
  spec.dt = Math.abs(spec.sim.dtSec - 1 / 30) < 1e-5 ? 1 / 30 : spec.sim.dtSec;
  spec.handle = spec.handle ?? 30;
  spec.total = spec.handle * 2 + spec.outFrames;
  spec.id = id;
  spec.mode = spec.sim.ui ? 'shot' : 'gl';
  return spec;
}

async function openPage(cdp, spec) {
  const src = `window.__HCFG=${JSON.stringify({ seed: SEED, theme: spec.sim.theme || 'dusk' })};\n${INJECT}`;
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: src });
  await cdp.send('Page.navigate', { url: `${BASE_URL}?adapt=0&v=${Date.now()}` });   // adapt=0 mengunci governor resolusi (PERF.locked)
  const t0 = Date.now();
  while (!(await cdp.eval('!!(window.__H && (__H.ready() || (__H.pump(2), false)))').catch(() => false))) {
    if (Date.now() - t0 > 180000) throw new Error('halaman tidak pernah siap (landing)');
    await sleep(100);
  }
  await cdp.eval('__H.install()');
  await sleep(3000);                                      // gambar/tekstur async: waktu NYATA, jam virtual beku (intro belum maju)
  if (!spec.sim.intro) for (let i = 0; i < 6; i++) { await cdp.eval('__H.pump(30)'); await sleep(250); }   // intro selesai
  const th = await cdp.eval(`document.documentElement.getAttribute('data-theme')`);
  console.log(`  halaman siap ${((Date.now() - t0) / 1000).toFixed(1)} dtk, tema ${th}, anchors ${JSON.stringify(await cdp.eval('__H.anchors().map(Math.round)'))}`);
}

let lastFrame = null, frameServer = null;
async function startFrameServer() {
  if (frameServer) return;
  frameServer = createServer((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => { lastFrame = Buffer.concat(chunks); res.writeHead(200, { 'Access-Control-Allow-Origin': '*' }); res.end('ok'); });
  });
  frameServer.listen(FRAME_PORT, '127.0.0.1');
  await once(frameServer, 'listening');
}
function darkShare(rgba) {
  let d = 0, n = 0;
  for (let i = 0; i < rgba.length; i += 4 * 97) { n++; if (0.2126 * rgba[i] + 0.7152 * rgba[i + 1] + 0.0722 * rgba[i + 2] < 12) d++; }
  return d / n;
}
const ENC = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-g', '30',
  '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', '-movflags', '+faststart'];
function ffmpeg(args) {
  const r = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error('ffmpeg gagal: ' + (r.stderr || r.error));
}
function contactSheet(mp4, frames, out) {
  mkdirSync(CONTACT, { recursive: true });
  const secs = Math.ceil(frames / FPS), cols = 4, rows = Math.max(1, Math.ceil(secs / cols));
  ffmpeg(['-i', mp4, '-vf', `select='not(mod(n,${FPS}))',scale=480:270,tile=${cols}x${rows}`, '-vsync', '0', '-frames:v', '1', out]);
}

async function recordFrames(cdp, spec, opts) {
  const total = Math.min(spec.total, opts.frames || spec.total);
  const events = [], progs = [], hashes = [], dark = [], textHits = [];
  const t0 = Date.now();
  let ff = null, ffDone = null;
  await cdp.eval(`__H.begin(${JSON.stringify(spec)})`);
  if (spec.mode === 'gl') {
    await startFrameServer();
    await cdp.eval(`__H.sink = 'http://127.0.0.1:${FRAME_PORT}/f'`);
    if (opts.mp4 && !opts.hashOnly) {
      const inArgs = ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${Hh}`, '-framerate', String(FPS), '-i', 'pipe:0'];
      ff = spawn('ffmpeg', [...inArgs, '-vf', 'vflip,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p', ...ENC, opts.mp4], { stdio: ['pipe', 'ignore', 'pipe'] });
      let err = ''; ff.stderr.on('data', (d) => { err += d; });
      ffDone = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg pipe gagal: ' + err)))));
    }
  }
  for (let fi = 0; fi < total; fi++) {
    let r, buf;
    if (spec.mode === 'gl') {
      r = await cdp.eval(`__H.frameRb(${fi})`, 60000);
      buf = lastFrame; lastFrame = null;
      if (!buf || buf.length !== W * Hh * 4) throw new Error(`frame ${fi}: ukuran mentah ${buf && buf.length} != ${W * Hh * 4} (kanvas ${r && r.size})`);
      dark.push(+darkShare(buf).toFixed(3));
      if (opts.hashOnly) hashes.push(createHash('sha256').update(buf).digest('hex'));
      else if (ff) { if (!ff.stdin.write(buf)) await once(ff.stdin, 'drain'); }
    } else {
      r = await cdp.eval(`__H.frame(${fi})`);
      const shot = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 96, fromSurface: true, clip: { x: 0, y: r.scrollY, width: W, height: Hh, scale: 1 } });   // clip = koordinat DOKUMEN
      buf = Buffer.from(shot.data, 'base64');
      if (opts.hashOnly) hashes.push(createHash('sha256').update(buf).digest('hex'));
      else writeFileSync(join(opts.framesDir, String(fi).padStart(6, '0') + '.jpg'), buf);
      if (fi % 15 === 0) {
        const txt = await cdp.eval('__H.visibleText()');
        for (const re of FORBIDDEN) if (re.test(txt)) textHits.push({ frame: fi, rule: String(re), level: 'FAIL', excerpt: txt.slice(Math.max(0, txt.search(re) - 60), txt.search(re) + 60) });
        for (const re of WATCH) if (re.test(txt)) textHits.push({ frame: fi, rule: String(re), level: 'CHECK', excerpt: txt.slice(Math.max(0, txt.search(re) - 80), txt.search(re) + 40) });
      }
    }
    for (const e of r.ev) events.push(e);
    progs.push(r.prog);
    if (fi % 30 === 0 || fi === total - 1) {
      const el = (Date.now() - t0) / 1000;
      process.stdout.write(`\r  frame ${fi + 1}/${total}  ${((fi + 1) / el).toFixed(2)} fps  prog ${r.prog.toFixed(2)}  y ${r.scrollY}   `);
    }
  }
  process.stdout.write('\n');
  if (ff) { ff.stdin.end(); await ffDone; }
  return { events, progs, hashes, dark, textHits, frames: total, secs: (Date.now() - t0) / 1000 };
}

async function runCapture(id, o) {
  const spec = resolveSpec(id);
  console.log(`\n=== ${id}: ${spec.total} frame (handle ${spec.handle} + ${spec.outFrames} + ${spec.handle}), mode ${spec.mode}, tema ${spec.sim.theme}`);
  const outDir = o.frames ? join(CLIPS, '_test') : join(CLIPS, id);
  mkdirSync(outDir, { recursive: true });
  const mp4 = join(outDir, id + (o.frames ? '.partial' : '') + '.mp4');
  const framesDir = spec.mode === 'shot' ? join(o.keep ? CACHE : tmpdir(), o.keep ? id : 'nusa-landing-' + id, 'frames') : null;
  if (framesDir) { rmSync(framesDir, { recursive: true, force: true }); mkdirSync(framesDir, { recursive: true }); }
  await ensureServer();
  const { cdp, close } = await launch();
  try {
    await openPage(cdp, spec);
    const rec = await recordFrames(cdp, spec, { frames: o.frames, mp4, framesDir });
    if (spec.mode === 'shot') ffmpeg(['-framerate', String(FPS), '-start_number', '0', '-i', join(framesDir, '%06d.jpg'), '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p', ...ENC, mp4]);
    const used = rec.dark.slice(spec.handle, spec.handle + spec.outFrames);
    const darkMax = used.length ? Math.max(...used) : null;
    const fails = rec.textHits.filter((h) => h.level === 'FAIL');
    const events = {
      captureId: id, fps: FPS, dtSec: +spec.dt.toFixed(7), handle: spec.handle, outFrames: spec.outFrames, frames: rec.frames, seed: SEED,
      viewport: [W, Hh], mode: spec.mode, note: 'frame = indeks klip TEREKAM (termasuk handle). progs = RIG.smooth per frame (0..4 = babak).',
      events: rec.events.sort((a, b) => a.frame - b.frame), progs: rec.progs, textHits: rec.textHits,
      darkShareMax: darkMax, darkFail: darkMax != null && darkMax > 0.2, textFail: fails.length > 0,
    };
    writeFileSync(join(outDir, 'events.json'), JSON.stringify(events));
    const contact = join(CONTACT, id + (o.frames ? '.partial' : '') + '.png');
    contactSheet(mp4, rec.frames, contact);
    if (spec.mode === 'shot' && !o.keep) rmSync(dirname(framesDir), { recursive: true, force: true });
    const sum = { id, frames: rec.frames, secs: +rec.secs.toFixed(1), fps: +(rec.frames / rec.secs).toFixed(2), darkShareMax: darkMax,
      textFail: fails.length, textCheck: rec.textHits.length - fails.length, eventTypes: [...new Set(rec.events.map((e) => e.type))], mp4, contact };
    console.log('  ' + JSON.stringify(sum));
    if (events.darkFail) console.log('  !! GAGAL: frame hitam > 20%');
    if (fails.length) console.log('  !! GAGAL pagar fakta: ' + JSON.stringify(fails.slice(0, 3)));
    return sum;
  } finally { await close(); }
}

async function checkDeterminism(id) {
  const spec = resolveSpec(id), n = Math.min(45, spec.total), runs = [];
  await ensureServer();
  for (let k = 0; k < 2; k++) {
    const { cdp, close } = await launch();
    try { await openPage(cdp, spec); runs.push((await recordFrames(cdp, spec, { frames: n, hashOnly: true })).hashes); } finally { await close(); }
  }
  const diff = runs[0].map((h, i) => (h === runs[1][i] ? null : i)).filter((x) => x !== null);
  console.log(diff.length ? `TIDAK deterministik: ${diff.length}/${n} frame beda (pertama f${diff[0]})` : `deterministik: ${n}/${n} frame identik (SHA-256)`);
  return diff.length === 0;
}

async function main() {
  const argv = process.argv.slice(2);
  const flag = (k) => argv.includes(k);
  const val = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
  const ids0 = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && ['--frames', '--eval'].includes(argv[i - 1])));
  const ids = ids0.includes('all') ? Object.keys(SHOTS.captures) : ids0;
  try {
    if (flag('--check-determinism')) { process.exitCode = (await checkDeterminism(ids[0])) ? 0 : 1; return; }
    if (flag('--dry')) { ids.forEach((id) => console.log(JSON.stringify(resolveSpec(id), null, 1))); return; }
    if (flag('--eval')) {
      await ensureServer(); await startFrameServer();
      const spec = resolveSpec(ids[0] || 'S02_walk');
      const { cdp, close } = await launch();
      try {
        await openPage(cdp, spec);
        await cdp.eval(`__H.sink = 'http://127.0.0.1:${FRAME_PORT}/f'`);
        for (const ex of val('--eval').split(';;')) { const t = Date.now(); console.log('>', ex.slice(0, 90)); console.log(JSON.stringify(await cdp.eval(ex, 30000)).slice(0, 800), `(${Date.now() - t} ms)`); }
      } finally { await close(); }
      return;
    }
    if (!ids.length) { console.log('pakai: node tools/video/capture.mjs <captureId...>|all [--frames N] [--keep] [--dry] [--check-determinism] [--eval]'); return; }
    const o = { frames: val('--frames') ? +val('--frames') : null, keep: flag('--keep') };
    const res = [];
    for (const id of ids) res.push(await runCapture(id, o));
    if (!o.frames) writeFileSync(join(CLIPS, 'summary.json'), JSON.stringify(res, null, 2));
  } finally {
    if (frameServer) frameServer.close();
    if (serverProc) serverProc.kill();
  }
}
main().catch((e) => { console.error(e); process.exitCode = 1; if (serverProc) serverProc.kill(); process.exit(1); });
