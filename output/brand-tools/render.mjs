import { spawn } from 'node:child_process';
import { mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const kit = path.join(root, 'public/brand/premium-v1');
const work = path.join(root, 'output/brand-tools/render-work');
const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
await mkdir(work, { recursive: true });

async function screenshot(url, output, width, height) {
  const args = ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--disable-background-networking', '--hide-scrollbars',
    '--default-background-color=00000000', '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=1500', `--user-data-dir=${path.join(work,'edge-profile')}`,
    `--window-size=${width},${height}`, `--screenshot=${output}`, url];
  await new Promise((resolve, reject) => {
    const child = spawn(edge, args, { windowsHide: true, stdio: 'ignore' });
    const timeout = setTimeout(() => { child.kill(); reject(new Error('Browser render timed out')); }, 45000);
    child.once('error', error => { clearTimeout(timeout); reject(error); });
    child.once('exit', code => { clearTimeout(timeout); code === 0 ? resolve() : reject(new Error(`Browser exit ${code}`)); });
  });
  const result = await stat(output);
  console.log(`${path.basename(output)}: ${width} x ${height}, ${result.size} bytes`);
}

for (const name of ['primary','monogram','primary-black','primary-white','monogram-black','monogram-white']) {
  const svgPath = path.join(kit,'vector',`${name}.svg`);
  const source = await readFile(svgPath,'utf8');
  const box = source.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const width = name.startsWith('primary') ? 3240 : 1280;
  const height = Math.round(width * box[3] / box[2]);
  const wrapper = path.join(work,`${name}.html`);
  await writeFile(wrapper,`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}img{display:block;width:100vw;height:100vh;object-fit:contain}</style></head><body><img src="${pathToFileURL(svgPath).href}" alt="Alan Luby Photography"></body></html>`);
  await screenshot(pathToFileURL(wrapper).href,path.join(kit,`${name}.png`),width,height);
}
await screenshot(pathToFileURL(path.join(kit,'preview.html')).href,path.join(kit,'identity-preview.png'),1440,920);
