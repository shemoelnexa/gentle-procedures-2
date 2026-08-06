/* Headless-Chrome capture for the inner pages.
   usage: node scripts/inner-shoot.js <page-slug[,slug2]> <outDir> [WxH] [motion|reduce] [full]
   e.g.   node scripts/inner-shoot.js pollock-technique .shots/approach 1904x1000 motion */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.otf': 'font/otf', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => {
    if (e) { console.log('404', p); res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(d);
  });
});

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const slugs = (process.argv[2] || 'pollock-technique').split(',');
const outDir = process.argv[3] || '.shots';
const vp = (process.argv[4] || '1904x1000').split('x').map(Number);
const motion = process.argv[5] === 'motion';
const fullPage = process.argv[6] === 'full';
const PORT = 4193;

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  await new Promise(r => server.listen(PORT, '127.0.0.1', r));
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars'],
    defaultViewport: { width: vp[0], height: vp[1], deviceScaleFactor: 1 },
  });

  for (const slug of slugs) {
    const page = await browser.newPage();
    const errs = [];
    page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
    page.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
    page.on('requestfailed', r => errs.push('REQFAIL ' + r.url() + ' :: ' + (r.failure() && r.failure().errorText)));
    if (!motion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

    await page.goto(`http://127.0.0.1:${PORT}/inner/${slug}.html`, { waitUntil: 'networkidle0', timeout: 60000 });
    try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch (e) {}
    await new Promise(r => setTimeout(r, 900));

    const info = await page.evaluate(() => ({
      title: document.title,
      hasNav: !!document.getElementById('nav'),
      hasFoot: !!document.querySelector('.foot'),
      leftoverSlots: document.querySelectorAll('[data-chrome]').length,
      secs: Array.from(document.querySelectorAll('main > section, main > figure, .onward, .foot')).map(el => ({
        id: el.id || (el.className || '').split(' ').slice(0, 2).join('.'),
        top: Math.round(el.getBoundingClientRect().top + window.scrollY),
        h: Math.round(el.offsetHeight),
      })),
      pageH: document.documentElement.scrollHeight,
      docW: document.documentElement.scrollWidth,
      winW: window.innerWidth,
    }));
    console.log('\n=== ' + slug + ' ===');
    console.log(JSON.stringify({ title: info.title, hasNav: info.hasNav, hasFoot: info.hasFoot, leftoverSlots: info.leftoverSlots, pageH: info.pageH, docW: info.docW, winW: info.winW }, null, 1));
    if (info.docW > info.winW) console.log('!! HORIZONTAL OVERFLOW: docW ' + info.docW + ' > winW ' + info.winW);
    info.secs.forEach(s => console.log('  ' + String(s.top).padStart(6) + '  h=' + String(s.h).padStart(5) + '  ' + s.id));

    if (motion) {
      const maxY = info.pageH - vp[1];
      for (let y = 0; y <= maxY; y += Math.round(vp[1] / 3)) {
        await page.evaluate(yy => window.scrollTo(0, yy), y);
        await new Promise(r => setTimeout(r, 260));
      }
      await new Promise(r => setTimeout(r, 1400));
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 500));
    }

    const dir = path.join(outDir, slug);
    fs.mkdirSync(dir, { recursive: true });
    if (fullPage) {
      await page.screenshot({ path: path.join(dir, 'full.png'), fullPage: true });
      console.log('  shot full.png');
    } else {
      let i = 0;
      for (const s of info.secs) {
        await page.evaluate(y => window.scrollTo(0, y), s.top);
        await new Promise(r => setTimeout(r, 420));
        const name = String(i).padStart(2, '0') + '-' + s.id.replace(/[^\w.-]/g, '') + '.png';
        await page.screenshot({ path: path.join(dir, name) });
        i++;
      }
      console.log('  shot ' + i + ' sections');
    }

    if (errs.length) { console.log('  --- ISSUES ---'); errs.forEach(e => console.log('  ' + e)); }
    else console.log('  --- no console/network errors ---');
    await page.close();
  }

  await browser.close();
  server.close();
  console.log('\nDONE ' + outDir);
})().catch(e => { console.error(e); process.exit(1); });
