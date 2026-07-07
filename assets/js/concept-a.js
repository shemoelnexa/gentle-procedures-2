/* ============================================================
   CONCEPT A — "The Stillness" (Soneva-family) motion
   Calm, centered. Gentle fades + slow parallax. No pinning.
   ============================================================ */
window.GP = window.GP || {};

window.GP.prepareHero = function () {
  if (window.GP.reduced) return;
  const title = document.querySelector('[data-hero-title]');
  if (title && window.GP.splitLines) gsap.set(window.GP.splitLines(title), { yPercent: 115 });
  gsap.set('[data-hero-el]', { opacity: 0, y: 22 });
  gsap.set('.hero__ornament', { scaleY: 0, transformOrigin: 'top' });
  gsap.set('[data-hero-media] img', { scale: 1.2 });
};

window.GP.heroReveal = function () {
  const tl = gsap.timeline();
  const title = document.querySelector('[data-hero-title]');
  const lines = title ? title.__lines : [];
  tl.to('[data-hero-media] img', { scale: 1, duration: 2.6, ease: 'expo.out' }, 0)
    .to('.hero__ornament', { scaleY: 1, duration: 1.1, ease: 'expo.out' }, 0.2)
    .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.5)
    .to(lines, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.11 }, 0.6)
    .to('.hero__note', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 1.1)
    .to('.hero__scroll', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 1.2);
  return tl;
};

window.GP.conceptInit = function ({ gsap, ScrollTrigger, reduced }) {
  if (!reduced) {
    // hero drift
    gsap.to('[data-hero-media]', { yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__inner', { yPercent: -14, opacity: 0.4, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // film pulse halo
    const play = document.querySelector('.film__play');
    if (play) {
      const halo = document.createElement('span');
      halo.className = 'film__play-halo';
      play.appendChild(halo);
      gsap.to(halo, { scale: 1.5, opacity: 0, duration: 2.8, ease: 'power1.out', repeat: -1 });
    }
  }

  initPromiseCarousel(gsap, reduced);
};

/* ---- Promises carousel (Six Senses-style: image band + peeking teaser columns) ---- */
function initPromiseCarousel(gsap, reduced) {
  const car = document.querySelector('.pcar');
  if (!car) return;
  const viewport = car.querySelector('.pcar__viewport');
  const track = car.querySelector('.pcar__track');
  const imgs = Array.from(car.querySelectorAll('.pcar__img'));
  const counter = car.querySelector('.pcar__count b');
  const originals = Array.from(track.children);
  const N = originals.length;

  const getVisible = () => (window.innerWidth <= 640 ? 1 : window.innerWidth <= 1024 ? 2 : 3);
  let visible = getVisible();

  // clone for seamless loop: prepend last `visible`, append first `visible`
  originals.slice(N - visible).reverse().forEach((c) => track.insertBefore(c.cloneNode(true), track.firstChild));
  originals.slice(0, visible).forEach((c) => track.appendChild(c.cloneNode(true)));
  const all = Array.from(track.children);
  const offset = visible;
  let pos = offset;
  let colW = 0;
  let animating = false;

  const realIndex = () => (((pos - offset) % N) + N) % N;

  function updateActive() {
    all.forEach((c, i) => c.classList.toggle('is-active', i === pos));
    const ri = realIndex();
    imgs.forEach((im, i) => im.classList.toggle('is-active', i === ri));
    if (counter) counter.textContent = String(ri + 1).padStart(2, '0');
  }
  function place(anim) {
    const x = -pos * colW;
    if (anim && !reduced) {
      animating = true;
      gsap.to(track, { x, duration: 0.9, ease: 'power3.inOut', onComplete: () => {
        if (pos >= offset + N) { pos -= N; gsap.set(track, { x: -pos * colW }); }
        else if (pos < offset) { pos += N; gsap.set(track, { x: -pos * colW }); }
        updateActive();
        animating = false;
      } });
    } else {
      if (pos >= offset + N) pos -= N; else if (pos < offset) pos += N;
      gsap.set(track, { x: -pos * colW });
      updateActive();
    }
  }
  function measure() {
    colW = viewport.clientWidth / visible;
    all.forEach((c) => (c.style.width = colW + 'px'));
    gsap.set(track, { x: -pos * colW });
  }
  function go(dir) {
    if (animating) return;
    pos += dir;
    updateActive(); // image + counter respond immediately
    place(true);
  }

  measure();
  updateActive();
  car.querySelector('.pcar__arrow--next').addEventListener('click', () => go(1));
  car.querySelector('.pcar__arrow--prev').addEventListener('click', () => go(-1));

  let timer = reduced ? null : setInterval(() => go(1), 7000);
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  car.addEventListener('mouseenter', stop);
  car.addEventListener('touchstart', stop, { passive: true });

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const v = getVisible();
      if (v !== visible) { visible = v; } // width recompute handles most cases
      measure();
    }, 150);
  });
}
