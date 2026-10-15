// usage: node shot.mjs url out.png [scrollY,...] [--reduce] [--dark|--light] [--size=375x667] [--en]
// scrollY: pixel, percentuale (es. 50%), #id (inizio elemento) o #id@0.4 (avanzamento 40% di una sezione poke)
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const args = process.argv.slice(2);
const flags = args.filter(a => a.startsWith('--'));
const [url, out, scrolls = '0'] = args.filter(a => !a.startsWith('--'));
const [W, H] = (flags.find(f => f.startsWith('--size='))?.slice(7) ?? '375x812').split('x').map(Number);
const port = 9333 + Math.floor(Math.random()*500);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new', `--remote-debugging-port=${port}`, '--hide-scrollbars', `--user-data-dir=/tmp/cdp-${port}`, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let tabs; for (let i=0;i<50;i++){ try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params={}) => new Promise(r => { const i=++id; pending.set(i, r); ws.send(JSON.stringify({id:i, method, params})); });
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true });
const features = [];
if (flags.includes('--reduce')) features.push({ name: 'prefers-reduced-motion', value: 'reduce' });
if (flags.includes('--light')) features.push({ name: 'prefers-color-scheme', value: 'light' });
if (flags.includes('--dark')) features.push({ name: 'prefers-color-scheme', value: 'dark' });
if (features.length) await send('Emulation.setEmulatedMedia', { features });
if (flags.includes('--en')) await send('Page.addScriptToEvaluateOnNewDocument', { source: "try{localStorage.setItem('gmi-lang','en')}catch{}" });
await send('Page.enable'); await send('Runtime.enable');
await send('Page.navigate', { url }); await sleep(1800);
const logs = await send('Runtime.evaluate', { expression: 'JSON.stringify({w:innerWidth, sw:document.documentElement.scrollWidth, h:document.documentElement.scrollHeight})', returnByValue: true });
console.log(logs.result.result.value);
const list = scrolls.split(',');
for (let k=0;k<list.length;k++) {
  const y = list[k];
  await send('Runtime.evaluate', { expression: `(() => { const v='${y}'; let t = v.includes('@') ? (() => { const [sel, f] = v.split('@'); const s = document.querySelector(sel); const st = s.querySelector('.poke__sticky'); return s.offsetTop + (s.offsetHeight - st.offsetHeight) * parseFloat(f); })() : v.startsWith('#') ? document.querySelector(v).getBoundingClientRect().top+scrollY : (v.endsWith('%') ? (document.documentElement.scrollHeight-innerHeight)*parseFloat(v)/100 : +v); window.scrollTo(0,t); dispatchEvent(new Event('scroll')); })()` });
  await sleep(700);
  const r = await send('Page.captureScreenshot', { format: 'png' });
  const f = list.length > 1 ? out.replace('.png', `-${k}.png`) : out;
  writeFileSync(f, Buffer.from(r.result.data, 'base64')); console.log(f);
}
ws.close(); chrome.kill();
