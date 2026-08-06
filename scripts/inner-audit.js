/* Layout audit for the inner pages.
   Measures real geometry in headless Chrome and reports:
     · content blocks that sit at an unintended small indent from their column
     · blocks wider than their container
     · reading measures far outside 45–95 characters
     · vertical gaps that break the rhythm inside a .statement
   usage: node scripts/inner-audit.js [WxH] */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.otf': 'font/otf', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  const f = path.join(ROOT, p);
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(d);
  });
});

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const vp = (process.argv[2] || '1904x1000').split('x').map(Number);
const PORT = 4195;
const PAGES = fs.readdirSync(path.join(ROOT, 'inner')).filter(f => f.endsWith('.html'));

(async () => {
  await new Promise(r => server.listen(PORT, '127.0.0.1', r));
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: true,
    args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars'],
    defaultViewport: { width: vp[0], height: vp[1] },
  });

  let total = 0;
  for (const file of PAGES) {
    const page = await browser.newPage();
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(`http://127.0.0.1:${PORT}/inner/${file}`, { waitUntil: 'networkidle0', timeout: 60000 });
    try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch (e) {}
    await new Promise(r => setTimeout(r, 500));

    const issues = await page.evaluate(() => {
      const out = [];
      const R = el => el.getBoundingClientRect();
      const label = el => {
        const c = (el.className || '').toString().split(' ').filter(Boolean).slice(0, 2).join('.');
        return el.tagName.toLowerCase() + (c ? '.' + c : '');
      };
      const txt = el => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 46);

      /* ---- 1 · indent drift ----
         Walk every element that renders its own text and compare its left
         edge with its column's. A column is the nearest .wrap / .veil__inner
         / direct child of a .duo|.trio|.quad. Anything sitting 1–72px inside
         its column, without being a deliberately indented component part,
         is drift the eye reads as broken. */
      const INDENTED_OK = new Set(['ledger__b', 'nightlist__b', 'sheet__foot', 'qa__body']);
      const isColumn = el =>
        el.classList.contains('wrap') || el.classList.contains('veil__inner') ||
        (el.parentElement && /\b(duo|trio|quad|form__row|pairs|figures|btns|qlinks|maplinks)\b/.test(el.parentElement.className || ''));

      const rendersText = el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());

      document.querySelectorAll('main *').forEach(el => {
        if (!rendersText(el)) return;
        const cs = getComputedStyle(el);
        if (cs.display === 'inline' || cs.position === 'absolute' || cs.display === 'none') return;
        if (R(el).height === 0) return;
        // deliberately centred content is not drift
        if (cs.textAlign === 'center' || cs.marginLeft === 'auto') return;
        if (el.closest('.centre, .statement--centre')) return;
        // skip things that are legitimately inset by their component
        let p = el;
        let skip = false;
        while (p && p !== document.body) {
          const cls = (p.className || '').toString();
          if ([...INDENTED_OK].some(k => cls.includes(k))) { skip = true; break; }
          if (/\b(nav|foot|pinned|crumb|filmcard|sheet|card|onward|portrait|person|read|detail|field|finder|qrail|set)\b/.test(cls)) { skip = true; break; }
        // component parts the frame itself insets: the ledger numeral gutter
        // and the night-list chevron gutter. Their consistency is checked below.
        if (/\b(ledger__head|ledger__row|nightlist__row|qgroup__head)\b/.test(cls)) { skip = true; break; }
          p = p.parentElement;
        }
        if (skip) return;

        let col = el.parentElement;
        while (col && col !== document.body && !isColumn(col)) col = col.parentElement;
        if (!col || col === document.body) return;

        const d = Math.round(R(el).left) - Math.round(R(col).left);
        if (d > 0 && d < 72) out.push({ kind: 'indent', el: label(el), by: d, txt: txt(el) });
        if (d < -2) out.push({ kind: 'outdent', el: label(el), by: d, txt: txt(el) });
      });

      /* ---- 1b · a list's titles must all start on one axis ---- */
      document.querySelectorAll('.ledger, .nightlist').forEach(list => {
        const sel = list.classList.contains('ledger') ? '.ledger__t' : '.nightlist__t';
        const xs = [...list.querySelectorAll(sel)].map(t => Math.round(R(t).left));
        if (xs.length < 2) return;
        const spread = Math.max(...xs) - Math.min(...xs);
        if (spread > 1) out.push({ kind: 'wobble', el: sel + ' ×' + xs.length, by: spread, txt: 'titles do not share an axis' });
      });

      /* ---- 1c · a body must sit on its own title's axis ---- */
      document.querySelectorAll('.ledger__row, .nightlist__row').forEach(row => {
        const t = row.querySelector('.ledger__t, .nightlist__t');
        const b = row.querySelector('.ledger__b > p, .nightlist__b > p');
        if (!t || !b) return;
        const d = Math.round(R(b).left) - Math.round(R(t).left);
        if (Math.abs(d) > 1) out.push({ kind: 'axis', el: label(row), by: d, txt: txt(t) });
      });

      /* ---- 2 · overflow past the container ---- */
      document.querySelectorAll('.wrap > *').forEach(b => {
        const r = R(b), p = R(b.parentElement);
        if (r.right > p.right + 2) out.push({ kind: 'overflow', el: label(b), by: Math.round(r.right - p.right), txt: txt(b) });
      });

      /* ---- 3 · reading measure ---- */
      const chW = (() => {
        const s = document.createElement('span');
        s.textContent = '0'.repeat(50); s.style.cssText = 'position:absolute;visibility:hidden;font:inherit';
        document.body.appendChild(s); const w = s.getBoundingClientRect().width / 50; s.remove(); return w;
      })();
      document.querySelectorAll('.prose > p, .statement__lede, .article > p, .ledger__b > p, .nightlist__b > p, .focus, .lead').forEach(p => {
        const ch = Math.round(R(p).width / chW);
        if (ch > 98) out.push({ kind: 'measure', el: label(p), by: ch, txt: txt(p) });
      });

      /* ---- 4 · vertical rhythm inside a statement ---- */
      document.querySelectorAll('.statement').forEach(s => {
        const kids = [...s.children].filter(k => R(k).height > 0);
        const gaps = [];
        for (let i = 1; i < kids.length; i++) {
          gaps.push(Math.round(R(kids[i]).top - R(kids[i - 1]).bottom));
        }
        gaps.forEach((g, i) => { if (g < -4) out.push({ kind: 'collide', el: label(kids[i + 1]), by: g, txt: txt(kids[i + 1]) }); });
      });

      return out;
    });

    if (issues.length) {
      console.log('\n=== ' + file + ' (' + issues.length + ') ===');
      const byKind = {};
      issues.forEach(i => { (byKind[i.kind] = byKind[i.kind] || []).push(i); });
      for (const k in byKind) {
        console.log(' ' + k + ':');
        byKind[k].slice(0, 14).forEach(i => console.log('   ' + String(i.by).padStart(5) + '  ' + i.el.padEnd(26) + ' ' + i.txt));
        if (byKind[k].length > 14) console.log('   … +' + (byKind[k].length - 14) + ' more');
      }
      total += issues.length;
    }
    await page.close();
  }

  console.log('\nTOTAL ISSUES: ' + total);
  await browser.close();
  server.close();
})().catch(e => { console.error(e); process.exit(1); });
