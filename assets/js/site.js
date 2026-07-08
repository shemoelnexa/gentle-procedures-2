/* ============================================================
   GENTLE PROCEDURES — site motion
   Calm, centered. Gentle fades + slow parallax. Chapter-rail scroll-spy.
   ============================================================ */
window.GP = window.GP || {};

window.GP.prepareHero = function () {
  if (window.GP.reduced) return;
  const title = document.querySelector('[data-hero-title]');
  if (title && window.GP.splitLines) gsap.set(window.GP.splitLines(title), { yPercent: 115, y: 0 });
  gsap.set('[data-hero-el]', { opacity: 0, y: 22 });
  gsap.set('[data-hero-media] img', { scale: 1.2 });
};

window.GP.heroReveal = function () {
  const tl = gsap.timeline();
  const title = document.querySelector('[data-hero-title]');
  const lines = title ? title.__lines : [];
  tl.to('[data-hero-media] img', { scale: 1, duration: 2.6, ease: 'expo.out' }, 0)
    .to(lines, { yPercent: 0, y: 0, duration: 1.5, ease: 'expo.out', stagger: 0.11 }, 0.3)
    .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.95)
    .to('.hero__intro', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 1.1)
    .to('.hero__scroll', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 1.25);
  return tl;
};

window.GP.conceptInit = function ({ gsap, ScrollTrigger, reduced }) {
  initChapterTabs(gsap, reduced);
  initChapters(gsap, ScrollTrigger, reduced);
  initPillars(gsap, ScrollTrigger, reduced);
  initFigures(gsap, ScrollTrigger, reduced);

  if (!reduced) {
    // hero drift
    gsap.to('[data-hero-media]', { yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    // the giant word may fade+drift; the intro copy only drifts (fading it made it disappear on scroll)
    gsap.to('.hero__word', { yPercent: -14, opacity: 0.4, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__intro', { yPercent: -8, ease: 'none',
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
};

/* ---- Chapter tabs (click swaps background image + headline + copy + CTA) ---- */
function initChapterTabs(gsap, reduced) {
  const nav = document.querySelector('.chapter__nav');
  if (!nav) return;
  const chapter = nav.closest('.chapter');
  const imgs = Array.from(chapter.querySelectorAll('.chapter__img'));
  const panel = chapter.querySelector('.chapter__panel');
  const titleEl = panel.querySelector('.chapter__title');
  const copyEl = panel.querySelector('.chapter__copy');
  const ctaEl = panel.querySelector('.chapter__cta');
  const buttons = Array.from(nav.querySelectorAll('button[data-tab]'));

  const data = {
    story: {
      title: 'Thirty years, one quiet idea.',
      copy: 'One surgeon set out to prove this could be virtually painless, virtually bloodless, and genuinely gentle. Well over two hundred thousand families later, that idea has come home to Dubai.',
      cta: 'Read our story', href: '#believe',
    },
    approach: {
      title: 'A sanctuary, not a clinic.',
      copy: 'You are welcomed, never processed. From the message you send tonight to the drive home with your son asleep in the back, the day unfolds unhurried, warm, and entirely yours.',
      cta: "See your family's journey", href: '#journey',
    },
    day: {
      title: "You don't have to wonder how the day will feel.",
      copy: 'Arriving, held close, home together — three quiet chapters make up the day, each one gentler than the last.',
      cta: 'Follow the day', href: '#journey',
    },
    promises: {
      title: 'Five quiet promises.',
      copy: 'The substance beneath the calm, kept whether or not you ever ask about them — comfort first, clear aftercare, and a cherished moment treated as one.',
      cta: 'See all five promises', href: '#promises',
    },
    team: {
      title: 'The people who hold this.',
      copy: 'An internationally trained Consultant Neonatal & Paediatric Surgeon, personally certified in the Pollock Technique by Dr. Pollock — licensed by the Dubai Health Authority to its highest standard.',
      cta: 'Meet the standard', href: '#standard',
    },
  };

  let current = 'approach';
  let busy = false;

  function apply(key) {
    const d = data[key];
    titleEl.textContent = d.title;
    copyEl.textContent = d.copy;
    ctaEl.textContent = d.cta;
    ctaEl.setAttribute('href', d.href);
  }

  function setTab(key) {
    if (key === current || busy || !data[key]) return;
    current = key;
    buttons.forEach((b) => { const on = b.dataset.tab === key; b.classList.toggle('is-current', on); b.setAttribute('aria-selected', on); });
    imgs.forEach((im) => im.classList.toggle('is-active', im.dataset.tabImg === key));

    if (reduced || !gsap) { apply(key); return; }
    busy = true;
    gsap.to(panel, { opacity: 0, y: 8, duration: 0.28, ease: 'power2.in', onComplete: () => {
      apply(key);
      gsap.fromTo(panel, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', onComplete: () => { busy = false; } });
    } });
  }

  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-tab]');
    if (btn) setTab(btn.dataset.tab);
  });
}

/* ---- Figures: the scattered stats rise + resolve from blur, one by one (Elyse-style) ---- */
function initFigures(gsap, ScrollTrigger, reduced) {
  const grid = document.querySelector('.figures');
  if (!grid) return;
  const figs = gsap.utils.toArray('.fig');
  if (reduced || !figs.length) return;
  gsap.set(figs, { autoAlpha: 0, y: 40, filter: 'blur(14px)' });
  ScrollTrigger.create({
    trigger: grid,
    start: 'top 82%',
    once: true,
    onEnter: () => gsap.to(figs, {
      autoAlpha: 1, y: 0, filter: 'blur(0px)',
      duration: 1.15, ease: 'power3.out', stagger: 0.16,
      onComplete: () => gsap.set(figs, { clearProps: 'filter,transform,opacity,visibility' }),
    }),
  });
}

/* ---- Promises: cards rise + resolve from blur, one by one, as the section enters view ---- */
function initPillars(gsap, ScrollTrigger, reduced) {
  const grid = document.querySelector('.pillars__grid');
  if (!grid) return;
  const cards = gsap.utils.toArray('.pillar');
  if (reduced || !cards.length) return; // static (visible) fallback
  gsap.set(cards, { autoAlpha: 0, y: 48, filter: 'blur(16px)' });
  ScrollTrigger.create({
    trigger: grid,
    start: 'top 80%',
    once: true,
    onEnter: () => gsap.to(cards, {
      autoAlpha: 1, y: 0, filter: 'blur(0px)',
      duration: 1.1, ease: 'power3.out', stagger: 0.14,
      // clear inline transforms so the CSS :hover lift works afterwards
      onComplete: () => gsap.set(cards, { clearProps: 'filter,transform,opacity,visibility' }),
    }),
  });
}

/* ---- Journey chapters: pin the split stage; a scrubbed timeline crossfades content + images
       seamlessly as you scroll (continuous, scroll-linked — not stepped toggles) ---- */
function initChapters(gsap, ScrollTrigger, reduced) {
  const sec = document.querySelector('.chapters');
  if (!sec) return;
  const rows = gsap.utils.toArray('.chapters .crow');
  const countN = sec.querySelector('.chapters__count-n');
  const n = rows.length;
  if (n < 2 || reduced) return; // static stacked fallback (all rows visible)

  const parts = rows.map((r) => ({
    text: r.querySelector('.crow__text'),
    back: r.querySelector('.crow__img--back'),
    front: r.querySelector('.crow__img--front'),
  }));

  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', () => {
    sec.classList.add('is-pinned');
    // initial state: first chapter visible, the rest offset & hidden
    parts.forEach((p, i) => {
      gsap.set(p.text, { autoAlpha: i === 0 ? 1 : 0, yPercent: i === 0 ? 0 : 8 });
      gsap.set([p.back, p.front], { autoAlpha: i === 0 ? 1 : 0 });
      gsap.set(p.back, { yPercent: i === 0 ? 0 : 6 });
      gsap.set(p.front, { yPercent: i === 0 ? 0 : 10 });
    });

    // Rhythm: hold a chapter, then a TRUE crossfade into the next (both fade simultaneously so total
    // opacity stays ~1 — no blank dip), then hold again. Timeline is scrubbed = locked to scroll.
    const HOLD = 0.5, TR = 1;
    const tl = gsap.timeline({
      defaults: { ease: 'power1.inOut' },
      scrollTrigger: {
        trigger: sec,
        start: 'top top',
        end: () => '+=' + window.innerHeight * (n - 1) * 1.4,
        pin: '.chapters__inner',
        scrub: 0.6,          // tight coupling to the scrollwheel — feels connected, not laggy
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (countN) {
            const i = Math.min(n - 1, Math.round(self.progress * (n - 1)));
            countN.textContent = String(i + 1).padStart(2, '0');
          }
        },
      },
    });

    let at = HOLD;
    for (let i = 1; i < n; i++) {
      const prev = parts[i - 1], cur = parts[i];
      tl.to(prev.text, { autoAlpha: 0, yPercent: -10, duration: TR }, at)
        .to(prev.back, { autoAlpha: 0, yPercent: -7, duration: TR }, at)
        .to(prev.front, { autoAlpha: 0, yPercent: -10, duration: TR }, at)
        .to(cur.text, { autoAlpha: 1, yPercent: 0, duration: TR }, at)      // same start = crossfade
        .to(cur.back, { autoAlpha: 1, yPercent: 0, duration: TR }, at)
        .to(cur.front, { autoAlpha: 1, yPercent: 0, duration: TR }, at + 0.06);
      at += TR + HOLD;
    }

    return () => { sec.classList.remove('is-pinned'); tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); gsap.set(rows.flatMap((r) => [r.querySelector('.crow__text'), r.querySelector('.crow__img--back'), r.querySelector('.crow__img--front')]), { clearProps: 'all' }); };
  });
}
