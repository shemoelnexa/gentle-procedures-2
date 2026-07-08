/* ============================================================
   CONCEPT B — after the Eloria/Aethel reference · self-contained motion
   Lenis + GSAP + ScrollTrigger. Clip-wipe reveals, promises accordion,
   counters, hero intro. Light, warm, luxurious.
   ============================================================ */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;
  gsap.registerPlugin(ScrollTrigger);

  let lenis = null;
  if (!reduced) {
    lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }

  /* ---------- Reveals ---------- */
  function reveals() {
    gsap.utils.toArray('[data-b-head]').forEach((h) => {
      gsap.to(h.querySelectorAll('.b-line'), { clipPath: 'inset(0 -0.5% 0 0)', duration: 1.0, ease: 'power4.out', stagger: 0.12, scrollTrigger: { trigger: h, start: 'top 86%' } });
    });
    gsap.utils.toArray('[data-b]').forEach((el) => {
      gsap.to(el, { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', delay: parseFloat(el.dataset.bDelay || 0), scrollTrigger: { trigger: el, start: 'top 92%' } });
    });
    gsap.utils.toArray('[data-b-img]').forEach((el) => {
      const img = el.querySelector('img');
      gsap.set(el, { opacity: 1 });
      gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.15, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
      if (img) gsap.fromTo(img, { scale: 1.16 }, { scale: 1, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
  }
  function revealsStatic() {
    gsap.set('[data-b], [data-hero-el]', { opacity: 1, y: 0 });
    gsap.set('[data-b-img]', { opacity: 1 });
    gsap.utils.toArray('[data-b-head] .b-line, .bhero__title .b-line').forEach((l) => (l.style.clipPath = 'none'));
  }

  function prep() { if (!reduced) gsap.set('[data-b]', { y: 26 }); }

  /* ---------- Hero intro ---------- */
  function heroIntro() {
    if (reduced) return;
    const tl = gsap.timeline();
    tl.fromTo('.bhero__media img', { scale: 1.18 }, { scale: 1, duration: 2.4, ease: 'expo.out' }, 0)
      .to('.bhero__title .b-line', { clipPath: 'inset(0 -0.5% 0 0)', duration: 1.1, ease: 'power4.out', stagger: 0.13 }, 0.25)
      .to('.bhero__sub', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.9)
      .to('.bhero__cta', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 1.05)
      .to('.bhero__badge', { opacity: 1, duration: 1, ease: 'power2.out' }, 1.2);
  }

  /* ---------- Nav ---------- */
  function nav() {
    const n = document.querySelector('.bnav');
    if (!n) return;
    const on = (y) => n.classList.toggle('is-solid', y > 72);
    if (lenis) lenis.on('scroll', ({ scroll }) => on(scroll)); else window.addEventListener('scroll', () => on(window.scrollY), { passive: true });
    on(window.scrollY);
  }

  /* ---------- Counters ---------- */
  function counters() {
    gsap.utils.toArray('[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset.count), obj = { v: 0 }, fmt = (v) => Math.round(v).toString();
      if (reduced) { el.textContent = fmt(target); return; }
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => gsap.to(obj, { v: target, duration: 1.8, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(obj.v)) }) });
    });
  }

  /* ---------- Promises accordion (single-open) ---------- */
  function accordion() {
    const items = Array.from(document.querySelectorAll('.bacc'));
    if (!items.length) return;
    const open = (i) => items.forEach((it, k) => {
      const on = k === i;
      it.classList.toggle('is-open', on);
      const bar = it.querySelector('.bacc__bar');
      if (bar) bar.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    items.forEach((it, i) => {
      const bar = it.querySelector('.bacc__bar');
      bar.addEventListener('click', () => open(it.classList.contains('is-open') ? -1 : i));
      if (!isTouch) bar.addEventListener('mouseenter', () => open(i));
    });
  }

  /* ---------- Magnetic ---------- */
  function magnetic() {
    if (isTouch || reduced) return;
    gsap.utils.toArray('[data-magnetic]').forEach((el) => {
      const s = parseFloat(el.dataset.magnetic) || 0.3;
      el.addEventListener('mousemove', (e) => { const r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * s, y: (e.clientY - r.top - r.height / 2) * s, duration: 0.6, ease: 'power3.out' }); });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' }));
    });
  }

  /* ---------- Preloader ---------- */
  function preloader(done) {
    const pre = document.querySelector('.bload');
    if (!pre || reduced) { if (pre) pre.style.display = 'none'; done(); return; }
    const tl = gsap.timeline({ onComplete: () => { pre.style.display = 'none'; done(); } });
    tl.to('.bload__word', { opacity: 1, duration: 0.6, ease: 'power2.out' })
      .to('.bload__bar i', { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0.1)
      .to('.bload__word', { opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=0.15')
      .to(pre, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.12');
  }

  function boot() {
    prep(); nav(); counters(); accordion(); magnetic();
    if (reduced) revealsStatic(); else { reveals(); heroIntro(); }
    ScrollTrigger.refresh();
  }
  window.addEventListener('load', () => preloader(() => { boot(); ScrollTrigger.refresh(); }));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
