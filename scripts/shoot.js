const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

// --- self-contained static server ---
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.otf': 'font/otf', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(d);
  });
});

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const url = process.argv[2] || 'http://127.0.0.1:4173/index.html';
const outDir = process.argv[3] || 'C:\\Users\\Shemoel\\AppData\\Local\\Temp\\claude\\D--Code-Files-gentle-procedures-2\\bc786df6-c883-4b0a-b7d8-276d175a2d16\\scratchpad\\shots';
const tag = process.argv[4] || 'a';
const reduced = process.argv[5] !== 'motion'; // default reduced; pass 'motion' for animated
const sections = process.argv[6] ? process.argv[6].split(',') : null;
const vp = (process.argv[7] || '1440x900').split('x').map(Number);

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  await new Promise(r => server.listen(4188, '127.0.0.1', r));
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars'],
    defaultViewport: { width: vp[0], height: vp[1], deviceScaleFactor: 2 },
  });
  const page = await browser.newPage();
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, reduced ? 1500 : 4500));
  try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch (e) {}

  // STEPS mode: capture N evenly-spaced frames across the whole scroll height
  if (sections && sections[0] && sections[0].startsWith('steps')) {
    const n = parseInt(sections[0].split(':')[1] || '12');
    const maxY = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - window.innerHeight));
    for (let k = 0; k < n; k++) {
      const y = Math.round((maxY * k) / (n - 1));
      await page.evaluate((yy) => {
        if (window.__lenis) window.__lenis.scrollTo(yy, { immediate: true });
        else window.scrollTo(0, yy);
      }, y);
      await new Promise(r => setTimeout(r, 850));
      const name = String(k).padStart(2, '0') + '-' + tag + '-step.png';
      await page.screenshot({ path: path.join(outDir, name) });
      console.log('shot', name, 'y=' + y);
    }
    await browser.close();
    server.close();
    console.log('DONE', outDir);
    return;
  }

  // discover sections
  const secs = await page.evaluate((wanted) => {
    const list = [];
    const els = wanted
      ? wanted.map(id => document.getElementById(id)).filter(Boolean)
      : Array.from(document.querySelectorAll('main > section, footer'));
    els.forEach((el) => {
      list.push({ id: el.id || el.className.split(' ')[0], top: el.getBoundingClientRect().top + window.scrollY, h: el.offsetHeight });
    });
    return list;
  }, sections);

  let i = 0;
  for (const s of secs) {
    await page.evaluate((y) => window.scrollTo(0, y), s.top);
    await new Promise(r => setTimeout(r, 700));
    const name = String(i).padStart(2, '0') + '-' + tag + '-' + s.id + '.png';
    await page.screenshot({ path: path.join(outDir, name) });
    console.log('shot', name, 'h=' + s.h);
    i++;
  }
  await browser.close();
  server.close();
  console.log('DONE', outDir);
})().catch(e => { console.error(e); process.exit(1); });
