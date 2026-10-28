import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const work = path.resolve('output/website-logo-check');
await mkdir(work, { recursive: true });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(fn) {
  for (let i = 0; i < 50; i++) {
    try { const result = await fn(); if (result) return result; } catch {}
    await sleep(300);
  }
  throw new Error('Timed out waiting for local preview');
}
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4178', '--strictPort'], { windowsHide: true, stdio: 'ignore' });
const profile = path.join(work, `edge-${Date.now()}`);
const browser = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-background-networking', '--remote-debugging-port=0', '--remote-debugging-address=127.0.0.1', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let socket;
try {
  await until(async () => (await fetch('http://127.0.0.1:4178')).ok);
  const port = await until(async () => (await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]);
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  let sequence = 0;
  const pending = new Map();
  const exceptions = [];
  socket.addEventListener('message', event => {
    const value = JSON.parse(event.data);
    if (value.id && pending.has(value.id)) {
      const { resolve, reject, timer } = pending.get(value.id);
      clearTimeout(timer); pending.delete(value.id);
      value.error ? reject(new Error(JSON.stringify(value.error))) : resolve(value.result);
    }
    if (value.method === 'Runtime.exceptionThrown') exceptions.push(value.params.exceptionDetails.text);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)); }, 20000);
    pending.set(id, { resolve, reject, timer }); socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    return result.result.value;
  };
  const shot = async name => { const { data } = await send('Page.captureScreenshot', { format: 'png' }); await writeFile(path.join(work, `${name}.png`), Buffer.from(data, 'base64')); };
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  const results = [];
  for (const [name, width, height] of [['desktop',1440,1000],['mobile',390,844],['narrow',320,700],['tablet',768,1024]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: 'http://127.0.0.1:4178/' });
    await until(() => evaluate('!!document.querySelector("footer img")'));
    await sleep(1300);
    const layout = await evaluate(`(() => {
      const logos = [...document.querySelectorAll('header img, footer img')].filter(img => img.getBoundingClientRect().width > 0);
      return { width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth, logos: logos.map(img => ({ src: img.getAttribute('src'), width: img.getBoundingClientRect().width, loaded: img.complete && img.naturalWidth > 0 })), homeLabels: [...document.querySelectorAll('a[aria-label="Alan Luby Photography, home"]')].every(a => a.getAttribute('href') === '/') };
    })()`);
    if (layout.overflow || !layout.homeLabels || layout.logos.length !== 2 || layout.logos.some(logo => !logo.loaded)) throw new Error(`${name} layout failed: ${JSON.stringify(layout)}`);
    results.push({ viewport: name, ...layout });
    if (name === 'desktop' || name === 'mobile') {
      await shot(`${name}-header`);
      await evaluate('document.querySelector("footer").scrollIntoView({behavior:"instant"})');
      await sleep(450); await shot(`${name}-footer`);
    }
    if (name === 'mobile') {
      await evaluate('window.scrollTo({top:0,behavior:"instant"}); document.querySelector("button[aria-controls=mobile-nav]").click()');
      await sleep(150);
      if (!await evaluate('document.querySelector("button[aria-controls=mobile-nav]").getAttribute("aria-expanded") === "true" && !!document.getElementById("mobile-nav")')) throw new Error('Mobile menu failed');
      await evaluate('document.querySelector("#mobile-nav a").click()');
      await sleep(200);
      await evaluate('document.querySelector("header a[aria-label]").click()');
      await sleep(200);
      if (!await evaluate('location.pathname === "/" && !document.getElementById("mobile-nav")')) throw new Error('Logo home link failed');
    }
  }
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    await evaluate('sessionStorage.removeItem("splash-seen")');
    await send('Page.reload');
    await until(() => evaluate('!!document.querySelector("[role=status]")'));
    await sleep(1000);
    const visibleLogo = await evaluate(`(() => { const image = [...document.querySelectorAll('[role=status] img[src*="/brand/"]')].find(img => img.getBoundingClientRect().width > 0); return image && image.complete && image.naturalWidth > 0; })()`);
    if (!visibleLogo) throw new Error(`${name} splash logo failed`);
    await shot(`${name}-splash`);
  }
  const icon = await fetch('http://127.0.0.1:4178/favicon.svg?v=premium-v1');
  if (!icon.ok || !(await icon.text()).includes('photographic framing corner')) throw new Error('Updated favicon missing');
  if (exceptions.length) throw new Error(`Browser exceptions: ${exceptions.join(', ')}`);
  await writeFile(path.join(work, 'results.json'), JSON.stringify({ results, mobileNavigation: 'passed', splash: 'passed', favicon: 'passed', browserExceptions: exceptions }, null, 2));
  console.log(JSON.stringify({ results, mobileNavigation: 'passed', splash: 'passed', favicon: 'passed' }, null, 2));
  await send('Browser.close');
} finally {
  if (socket) socket.close();
  browser.kill();
  server.kill();
}
