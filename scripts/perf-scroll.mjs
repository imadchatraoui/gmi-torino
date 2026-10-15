import { spawn } from 'node:child_process';
const url = process.argv[2];
const port = 9900 + Math.floor(Math.random()*90);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=/tmp/cdp-${port}`, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let tabs; for (let i=0;i<50;i++){ try { tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await sleep(200); } }
const ws = new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id=0; const pending=new Map();
ws.onmessage = e => { const m=JSON.parse(e.data); if (m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);} };
const send=(method,params={})=>new Promise(r=>{const i=++id;pending.set(i,r);ws.send(JSON.stringify({id:i,method,params}));});
await send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:2,mobile:true});
await send('Emulation.setCPUThrottlingRate',{rate:4});
await send('Page.enable'); await send('Page.navigate',{url}); await sleep(2500);
await send('Runtime.evaluate',{expression:`window.__f=[];window.__y=[];(function t(ts){__f.push(ts);__y.push(Math.round(scrollY));requestAnimationFrame(t)})(performance.now())`});
await send('Input.synthesizeScrollGesture',{x:180,y:500,yDistance:-6000,speed:1500,gestureSourceType:'touch'});
const r = await send('Runtime.evaluate',{expression:`(()=>{const d=[];for(let i=1;i<__f.length;i++)d.push(__f[i]-__f[i-1]);d.sort((a,b)=>a-b);return JSON.stringify({frames:d.length,p50:d[d.length>>1].toFixed(1),p95:d[Math.floor(d.length*.95)].toFixed(1),max:d[d.length-1].toFixed(1),over33:d.filter(x=>x>33).length, y:scrollY, slowAt:__f.map((f,i)=>i&&f-__f[i-1]>33?__y[i-1]:null).filter(v=>v!==null)})})()`,returnByValue:true});
console.log(r.result.result.value);
ws.close(); chrome.kill();
