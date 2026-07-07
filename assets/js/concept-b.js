/* ============================================================
   CONCEPT B — "The Quiet Hours" (dark immersive) motion
   Centered dark hero · fixed chapter-rail scroll-spy · parallax scenes
   ============================================================ */
window.GP = window.GP || {};

window.GP.prepareHero = function () {
  if (window.GP.reduced) return;
  const title = document.querySelector('[data-hero-title]');
  if (title && window.GP.splitLines) gsap.set(window.GP.splitLines(title), { yPercent: 115 });
  gsap.set('[data-hero-el]', { opacity: 0, y: 24 });
  gsap.set('[data-hero-media] img', { scale: 1.2 });
};

window.GP.heroReveal = function () {
  const tl = gsap.timeline();
  const title = document.querySelector('[data-hero-title]');
  const lines = title ? title.__lines : [];
  tl.to('[data-hero-media] img', { scale: 1, duration: 2.6, ease: 'expo.out' }, 0)
    .to('.dhero__eyebrow', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.4)
    .to(lines, { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.1 }, 0.52)
    .to('.dhero__sub', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 1.05)
    .to('.dhero__scroll', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 1.15);
  return tl;
};

window.GP.conceptInit = function ({ gsap, ScrollTrigger, lenis, reduced }) {

  /* ---- top nav solid / hide ---- */
  const dnav = document.querySelector('.dnav');
  if (dnav) {
    let lastY = 0;
    const onScroll = (y) => {
      dnav.classList.toggle('is-solid', y > 72);
      if (y > 460 && y > lastY + 4) dnav.classList.add('is-hidden');
      else if (y < lastY - 4) dnav.classList.remove('is-hidden');
      lastY = y;
    };
    if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
    else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
  }

  /* ---- chapter rail scroll-spy ---- */
  const railItems = Array.from(document.querySelectorAll('.rail__item'));
  const setRail = (key) => railItems.forEach((it) => it.classList.toggle('is-active', it.dataset.rail === key));
  document.querySelectorAll('[data-rail-section]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 45%', end: 'bottom 45%',
      onToggle: (self) => { if (self.isActive) setRail(sec.dataset.railSection); },
    });
  });

  if (reduced) return;

  /* ---- hero parallax ---- */
  gsap.to('[data-hero-media]', { yPercent: 12, ease: 'none',
    scrollTrigger: { trigger: '.dhero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.dhero__inner', { yPercent: -16, opacity: 0.35, ease: 'none',
    scrollTrigger: { trigger: '.dhero', start: 'top top', end: 'bottom top', scrub: true } });

  /* ---- film pulse halo ---- */
  const play = document.querySelector('.dfilm__play');
  if (play) {
    const halo = document.createElement('span');
    halo.className = 'dfilm__play-halo';
    play.appendChild(halo);
    gsap.to(halo, { scale: 1.5, opacity: 0, duration: 2.8, ease: 'power1.out', repeat: -1 });
  }
};
