/* ============================================================
   GENTLE PROCEDURES — Shared motion layer
   Lenis smooth scroll + GSAP/ScrollTrigger + reveals
   ============================================================ */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (!reduced) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.09,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add('lenis');
    window.__lenis = lenis;
  }

  /* expose helpers for concept scripts */
  window.GP = window.GP || {};
  window.GP.lenis = lenis;
  window.GP.reduced = reduced;

  /* ---------- Line splitter (words grouped into masked lines) ---------- */
  function splitLines(el) {
    if (el.dataset.split === 'done') return el.__lines || [];
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.textContent = '';
    const words = text.split(/(\s+)/);
    const wordSpans = [];
    words.forEach((w) => {
      if (w.trim() === '') { el.appendChild(document.createTextNode(w)); return; }
      const ws = document.createElement('span');
      ws.className = 'gp-w';
      ws.style.display = 'inline-block';
      ws.setAttribute('aria-hidden', 'true');
      ws.textContent = w;
      el.appendChild(ws);
      wordSpans.push(ws);
    });
    // group by offsetTop into lines
    const lines = [];
    let cur = null, top = null;
    wordSpans.forEach((w) => {
      const t = w.offsetTop;
      if (top === null || Math.abs(t - top) > 4) { cur = []; lines.push(cur); top = t; }
      cur.push(w);
    });
    // rebuild with line masks
    el.textContent = '';
    const inners = [];
    lines.forEach((lineWords) => {
      const mask = document.createElement('span');
      mask.className = 'line-mask';
      const inner = document.createElement('span');
      inner.className = 'line-inner';
      lineWords.forEach((w, i) => {
        inner.appendChild(w);
        if (i < lineWords.length - 1) inner.appendChild(document.createTextNode(' '));
      });
      mask.appendChild(inner);
      el.appendChild(mask);
      inners.push(inner);
    });
    el.dataset.split = 'done';
    el.__lines = inners;
    return inners;
  }
  window.GP.splitLines = splitLines;

  function revealLines(el, opts = {}) {
    if (reduced) return;
    const inners = splitLines(el);
    gsap.set(inners, { yPercent: 112 });
    gsap.to(inners, {
      yPercent: 0,
      duration: opts.duration || 1.05,
      ease: 'expo.out',
      stagger: opts.stagger || 0.09,
      scrollTrigger: opts.trigger === false ? undefined : {
        trigger: opts.scope || el,
        start: opts.start || 'top 82%',
      },
      delay: opts.delay || 0,
    });
  }
  window.GP.revealLines = revealLines;

  /* ---------- Generic reveals ---------- */
  function initReveals() {
    // split-line headings
    gsap.utils.toArray('[data-split]').forEach((el) => {
      revealLines(el, { start: 'top 85%' });
    });
    if (reduced) return;
    // fade-up
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        delay: parseFloat(el.dataset.delay || 0),
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });
    // fade only
    gsap.utils.toArray('[data-reveal-fade]').forEach((el) => {
      gsap.to(el, {
        opacity: 1, duration: 1.3, ease: 'power2.out',
        delay: parseFloat(el.dataset.delay || 0),
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });
    // image scale reveals (clip)
    gsap.utils.toArray('[data-img-reveal]').forEach((el) => {
      const img = el.querySelector('img') || el;
      gsap.fromTo(el, { clipPath: 'inset(14% 8% round 14px)' }, {
        clipPath: 'inset(0% 0% round 14px)', duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 84%' },
      });
      gsap.fromTo(img, { scale: 1.28 }, {
        scale: 1, duration: 1.6, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 84%' },
      });
    });
  }

  /* ---------- Parallax ---------- */
  function initParallax() {
    if (reduced) return;
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      gsap.fromTo(el, { yPercent: -speed * 100 }, {
        yPercent: speed * 100, ease: 'none',
        scrollTrigger: { trigger: el.closest('[data-parallax-scope]') || el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  /* ---------- Count-up stats ---------- */
  function initCounters() {
    gsap.utils.toArray('[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || 0);
      const obj = { v: 0 };
      const suffix = el.dataset.suffix || '';
      const format = (v) => {
        let n = dec ? v.toFixed(dec) : Math.round(v).toString();
        if (el.dataset.comma === 'true') n = Number(n).toLocaleString('en-US');
        return n + suffix;
      };
      if (reduced) { el.textContent = format(target); return; }
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => gsap.to(obj, {
          v: target, duration: 2, ease: 'power2.out',
          onUpdate: () => { el.textContent = format(obj.v); },
        }),
      });
    });
  }

  /* ---------- Nav behaviour ---------- */
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const solidAt = parseInt(nav.dataset.solidAt || 60);
    let lastY = 0;
    const onScroll = (y) => {
      if (y > solidAt) nav.classList.add('is-solid'); else nav.classList.remove('is-solid');
      if (y > 480 && y > lastY + 4) nav.classList.add('is-hidden');
      else if (y < lastY - 4) nav.classList.remove('is-hidden');
      lastY = y;
    };
    if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
    else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
    onScroll(window.scrollY);
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (isTouch || reduced) return;
    gsap.utils.toArray('[data-magnetic]').forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.4;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        gsap.to(el, { x, y, duration: 0.6, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' }));
    });
  }

  /* ---------- Custom cursor ---------- */
  function initCursor() {
    if (isTouch) return;
    const dot = document.createElement('div'); dot.className = 'cursor';
    const ring = document.createElement('div'); ring.className = 'cursor cursor--ring';
    document.body.append(dot, ring);
    let rx = 0, ry = 0, mx = 0, my = 0;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      gsap.set(dot, { x: mx, y: my });
    });
    gsap.ticker.add(() => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      gsap.set(ring, { x: rx, y: ry });
    });
    const hoverables = 'a,button,[data-magnetic],[data-cursor]';
    document.querySelectorAll(hoverables).forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ---------- Preloader ---------- */
  function heroReveal(at, tl) {
    // concept supplies a timeline factory; else fall back to generic
    if (typeof window.GP.heroReveal === 'function') {
      const ht = window.GP.heroReveal();
      if (ht) tl.add(ht, at);
      return;
    }
    const els = gsap.utils.toArray('[data-hero-reveal]');
    if (els.length) tl.from(els, { yPercent: 115, opacity: 0, duration: 1.15, ease: 'expo.out', stagger: 0.09 }, at);
  }

  function initPreloader() {
    const pre = document.querySelector('.preloader');
    const finish = () => {
      if (lenis) lenis.start();
      document.documentElement.classList.remove('lenis-stopped');
      ScrollTrigger.refresh();
    };
    if (reduced) {
      if (pre) pre.style.display = 'none';
      document.documentElement.classList.remove('lenis-stopped');
      finish();
      return null;
    }
    if (!pre) {
      const tl = gsap.timeline({ delay: 0.1 });
      heroReveal(0, tl);
      tl.from('.nav', { y: -24, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.1);
      finish();
      return tl;
    }
    if (lenis) lenis.stop();
    document.documentElement.classList.add('lenis-stopped');
    const bar = pre.querySelector('.preloader__bar span');
    const count = pre.querySelector('.preloader__count b');
    const mark = pre.querySelector('.preloader__mark');
    const word = pre.querySelector('.preloader__word span');
    const tl = gsap.timeline({ onComplete: () => { pre.style.display = 'none'; finish(); } });
    const c = { v: 0 };
    tl.to(mark, { opacity: 1, duration: 0.8, ease: 'power2.out' })
      .to(word, { y: 0, duration: 0.7, ease: 'expo.out' }, '<')
      .to(bar, { scaleX: 1, duration: 2.0, ease: 'power2.inOut' }, 0.15)
      .to(c, { v: 100, duration: 2.0, ease: 'power2.inOut',
        onUpdate: () => { if (count) count.textContent = Math.round(c.v); } }, 0.15)
      .to(pre.querySelectorAll('.preloader__count,.preloader__word,.preloader__mark,.preloader__bar'),
        { opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=0.2')
      .to(pre, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.05');
    heroReveal('-=0.72', tl);
    tl.from('.nav', { y: -28, opacity: 0, duration: 0.9, ease: 'power3.out' }, '-=0.85');
    return tl;
  }
  window.GP.initPreloader = initPreloader;

  /* ---------- boot ---------- */
  function boot() {
    initNav();
    initReveals();
    initParallax();
    initCounters();
    initMagnetic();
    initCursor();
    if (typeof window.GP.conceptInit === 'function') window.GP.conceptInit({ gsap, ScrollTrigger, lenis, reduced });
    ScrollTrigger.refresh();
  }

  window.addEventListener('load', () => {
    // prepare hero (split lines, keep hidden) before the curtain lifts
    if (typeof window.GP.prepareHero === 'function') window.GP.prepareHero();
    boot();
    initPreloader();
  });

  // Refresh ST after fonts load (line splitting depends on metrics)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();
