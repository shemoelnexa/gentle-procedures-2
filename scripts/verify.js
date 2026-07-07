const puppeteer = require('puppeteer-core');
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.otf': 'font/otf' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html';
  fs.readFile(path.join(ROOT, p), (e, d) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
});
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUT = process.argv[2];

(async () => {
  await new Promise(r => server.listen(4173, '127.0.0.1', r));
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars'], defaultViewport: { width: 390, height: 844, deviceScaleFactor: 2 } });

  for (const page of ['concept-a.html', 'concept-b.html']) {
    const p = await browser.newPage();
    const errors = [];
    p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    p.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
    await p.goto('http://127.0.0.1:4173/' + page, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(r => setTimeout(r, 5000));
    // slow-scroll to bottom to trigger everything
    await p.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y <= h; y += 400) { (window.__lenis ? window.__lenis.scrollTo(y) : window.scrollTo(0, y)); await new Promise(r => setTimeout(r, 60)); }
    });
    await new Promise(r => setTimeout(r, 1500));
    console.log('=== ' + page + ' (mobile 390px) ===');
    console.log('console errors:', errors.length ? errors : 'NONE');
    await p.close();
  }
  // desktop mobile screenshots
  await browser.close();
  server.close();
  console.log('VERIFY DONE');
})().catch(e => { console.error(e); process.exit(1); });
