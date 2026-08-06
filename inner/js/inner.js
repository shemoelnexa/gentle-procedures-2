/* ============================================================
   GENTLE PROCEDURES — INNER PAGES
   Shared behaviour. No dependencies.

   The nav and footer are injected from the templates below so the
   fifteen pages share one source of truth for chrome. Everything
   else is progressive: with JS off the pages still read top to
   bottom, all copy present, all accordions openable (<details>).
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Claim the page for JS immediately — the reveal initial states in the
     stylesheet are gated on html.js, so with JS off nothing is hidden and
     with JS on nothing flashes in before being hidden. */
  document.documentElement.classList.add('js');

  /* ---------------------------------------------------------
     SITEMAP — single source of truth for nav and footer
     --------------------------------------------------------- */
  var PAGES = {
    'about-us':                     { label: 'About Us',        title: 'Our Story' },
    'pollock-technique':            { label: 'Our Approach',    title: 'Our Approach' },
    'our-team':                     { label: 'Our Team',        title: 'Our Team' },
    'our-surgeon':                  { label: 'Our Surgeon',     title: "Your son's surgeon" },
    'newborn-circumcision-dubai':   { label: 'What to Expect',  title: "Your Family's Journey" },
    'circumcision-package-dubai':   { label: "What's Included", title: "What's Included" },
    'pricing':                      { label: 'Pricing',         title: 'Pricing' },
    'faqs':                         { label: 'FAQ',             title: 'Your Questions, Answered' },
    'resources':                    { label: 'Resources',       title: 'Resources' },
    'contact':                      { label: 'Contact Us',      title: 'Come and see us' },
    'careers':                      { label: 'Careers',         title: 'Careers' }
  };

  var NAV = ['about-us', 'pollock-technique', 'our-team', 'newborn-circumcision-dubai',
             'circumcision-package-dubai', 'faqs', 'resources'];

  var ARROW = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">' +
              '<path d="M2.6 7h8.4M7.6 3.2 11.4 7l-3.8 3.8" stroke="currentColor" ' +
              'stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var CARET = '<svg viewBox="0 0 8 8" fill="none" aria-hidden="true">' +
              '<path d="M1 2.6 4 5.6l3-3" stroke="currentColor" stroke-width="1.2" ' +
              'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------------------------------------------------------
     CHROME
     --------------------------------------------------------- */
  function currentSlug() {
    var f = location.pathname.split('/').pop() || 'index.html';
    return f.replace(/\.html$/, '');
  }

  function buildNav(slug) {
    var links = NAV.map(function (key) {
      var cur = key === slug ? ' aria-current="page"' : '';
      return '<a class="nav__link" href="' + key + '.html"' + cur + '>' + PAGES[key].label + '</a>';
    }).join('');

    return '' +
      '<header class="nav" id="nav">' +
        '<a class="nav__logo" href="../index.html" aria-label="Gentle Procedures Clinic — home">' +
          '<img class="on-dark" src="img/logo-ondark.svg" alt="Gentle Procedures Clinic">' +
          '<img class="on-light" src="img/logo.svg" alt="Gentle Procedures Clinic">' +
        '</a>' +
        '<nav class="nav__links" id="navLinks" aria-label="Main">' + links + '</nav>' +
        '<div class="nav__end">' +
          '<button class="nav__lang" type="button" aria-label="Language: English">En ' + CARET + '</button>' +
          '<a class="nav__cta" href="contact.html">Contact us ' + ARROW + '</a>' +
          '<button class="nav__burger" type="button" id="navBurger" aria-expanded="false" ' +
            'aria-controls="navLinks" aria-label="Menu"><i></i></button>' +
        '</div>' +
      '</header>';
  }

  function footCol(head, items) {
    return '<div><h4>' + head + '</h4>' +
      items.map(function (it) { return '<a href="' + it[1] + '">' + it[0] + '</a>'; }).join('') +
      '</div>';
  }

  function buildFoot() {
    return '' +
      '<footer class="foot">' +
        '<div class="foot__media"><img src="img/footer.jpg" alt="" aria-hidden="true"></div>' +
        '<div class="foot__scrim"></div>' +
        '<div class="foot__top"><div class="wrap wrap--wide"><div class="foot__cols">' +
          '<div class="foot__brand">' +
            '<img src="img/logo-ondark.svg" alt="Gentle Procedures Clinic">' +
            '<p>Exceptional care, delivered gently — the first international clinic ' +
              'of The Pollock Group.</p>' +
            '<p class="meta">DHA Licence No. [to confirm]</p>' +
          '</div>' +
          footCol('The clinic', [
            ['Our Story', 'about-us.html'],
            ['Our Approach', 'pollock-technique.html'],
            ['Our Team', 'our-team.html'],
            ["Your Family's Journey", 'newborn-circumcision-dubai.html'],
            ['Visiting Us', 'contact.html']
          ]) +
          footCol('Discover', [
            ["What's Included", 'circumcision-package-dubai.html'],
            ['Pricing', 'pricing.html'],
            ['Aftercare at Home', 'resources-caring-for-him-at-home.html'],
            ['Careers', 'careers.html']
          ]) +
          footCol('Questions', [
            ['Your Questions, Answered', 'faqs.html'],
            ['Resources', 'resources.html'],
            ['Choosing a provider', 'resources-choosing-a-provider.html'],
            ['The first week at home', 'resources-preparing-your-home.html']
          ]) +
          footCol('Get in touch', [
            ['Call the clinic', 'contact.html'],
            ['WhatsApp', 'contact.html'],
            ['Email us', 'contact.html']
          ]) +
        '</div></div></div>' +
        '<p class="foot__wordmark">Gentle Procedures</p>' +
        '<div class="wrap wrap--wide"><div class="foot__base">' +
          '<span>&copy; 2026 Gentle Procedures Dubai</span>' +
          '<span>Al Wasl Road, Jumeirah, Dubai</span>' +
          "<span>Held with care — your family's privacy comes first</span>" +
        '</div></div>' +
      '</footer>';
  }

  function mountChrome() {
    var slug = currentSlug();
    var navSlot  = document.querySelector('[data-chrome="nav"]');
    var footSlot = document.querySelector('[data-chrome="foot"]');
    if (navSlot)  navSlot.outerHTML  = buildNav(slug.replace(/^resources-.*/, 'resources'));
    if (footSlot) footSlot.outerHTML = buildFoot();
  }

  /* ---------------------------------------------------------
     NAV BEHAVIOUR — solidify on scroll, hide on scroll down
     --------------------------------------------------------- */
  function initNav() {
    var nav = document.getElementById('nav');
    if (!nav) return;
    var burger = document.getElementById('navBurger');
    var links  = document.getElementById('navLinks');
    var last = 0;

    if (burger) {
      burger.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        nav.classList.add('is-stuck');
        burger.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
      });
      links.addEventListener('click', function (e) {
        if (e.target.closest('a') && nav.classList.contains('is-open')) burger.click();
      });
    }

    function onScroll() {
      var y = window.scrollY;
      nav.classList.toggle('is-stuck', y > 40);
      if (!nav.classList.contains('is-open')) {
        nav.classList.toggle('is-hidden', y > 320 && y > last);
      }
      last = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------
     PINNED STRIP — measure it, so the nav below always clears it
     (the copy wraps to two lines on narrow screens)
     --------------------------------------------------------- */
  function initStrip() {
    var strip = document.querySelector('.pinned');
    if (!strip) return;
    function measure() {
      document.body.style.setProperty('--strip-h', strip.offsetHeight + 'px');
    }
    window.addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    measure();
  }

  /* ---------------------------------------------------------
     REVEALS
     --------------------------------------------------------- */
  function initReveals() {
    var els = document.querySelectorAll('[data-reveal],[data-reveal-fade],[data-reveal-wipe]');
    if (!els.length) return;

    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(clear);
      return;
    }

    function show(el, delay) {
      var wipe = el.hasAttribute('data-reveal-wipe');
      var fade = el.hasAttribute('data-reveal-fade');
      el.style.transition =
        (wipe ? 'clip-path 1s' : 'opacity .9s, transform .9s, filter .9s') +
        ' cubic-bezier(.22,1,.36,1) ' + delay + 'ms';
      requestAnimationFrame(function () {
        if (wipe) el.style.clipPath = 'inset(0 0 0 0)';
        else {
          el.style.opacity = '1';
          if (!fade) { el.style.transform = 'none'; el.style.filter = 'none'; }
        }
      });
      // hand the element back to CSS once it has landed
      setTimeout(function () { clear(el); }, delay + 1100);
    }

    function clear(el) {
      el.style.transition = '';
      el.style.opacity = '';
      el.style.transform = '';
      el.style.filter = '';
      el.style.clipPath = '';
      el.removeAttribute('data-reveal');
      el.removeAttribute('data-reveal-fade');
      el.removeAttribute('data-reveal-wipe');
      el.classList.add('is-shown');
    }

    /* A clip-path that hides the element entirely also empties its
       intersection rect, so a wipe target can never observe itself into
       view. Watch its parent instead and keep a map back to the targets. */
    var watched = new Map();
    els.forEach(function (el) {
      var proxy = el.hasAttribute('data-reveal-wipe') ? (el.parentElement || el) : el;
      if (!watched.has(proxy)) watched.set(proxy, []);
      watched.get(proxy).push(el);
    });

    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        (watched.get(e.target) || []).forEach(function (el) {
          show(el, n * 70);
          n++;
        });
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    watched.forEach(function (_targets, proxy) { io.observe(proxy); });
  }

  /* ---------------------------------------------------------
     SPINE — a hairline that fills as you read (Our Approach)
     --------------------------------------------------------- */
  function initSpine() {
    var spine = document.querySelector('[data-spine]');
    if (!spine) return;
    var travel = document.createElement('span');
    travel.className = 'spine__travel';
    spine.appendChild(travel);
    if (reduced) { travel.style.setProperty('--progress', '100%'); return; }

    function tick() {
      var r = spine.getBoundingClientRect();
      var mid = window.innerHeight * 0.55;
      var p = (mid - r.top) / r.height;
      travel.style.setProperty('--progress', Math.max(0, Math.min(1, p)) * 100 + '%');
    }
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    tick();
  }

  /* ---------------------------------------------------------
     SCROLL-SPY — journey rail + question rail
     --------------------------------------------------------- */
  function initSpy(railSel, itemSel, sectionAttr) {
    var rail = document.querySelector(railSel);
    if (!rail) return;
    var items = Array.prototype.slice.call(rail.querySelectorAll(itemSel));
    var targets = items
      .map(function (it) { return document.getElementById(it.getAttribute('href').slice(1)); })
      .filter(Boolean);
    if (!targets.length) return;

    function tick() {
      var line = window.innerHeight * 0.34;
      var active = 0;
      targets.forEach(function (t, i) {
        if (t.getBoundingClientRect().top <= line) active = i;
      });
      items.forEach(function (it, i) { it.classList.toggle('is-current', i === active); });
    }
    window.addEventListener('scroll', tick, { passive: true });
    tick();
    void sectionAttr;
  }

  /* ---------------------------------------------------------
     ACCORDIONS — the frame has two: the light numbered ledger and
     the chevron list over photography. Both animate the same way.
     --------------------------------------------------------- */
  var ROWS = 'details.ledger__row, details.nightlist__row';

  function initAccordions() {
    document.querySelectorAll(ROWS).forEach(function (d) {
      var body = d.querySelector('.ledger__b, .nightlist__b');
      if (!body || reduced) return;
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        body.style.overflow = 'hidden';
        var h = body.scrollHeight;
        body.animate(
          [{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }],
          { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' }
        ).finished.then(function () { body.style.overflow = ''; }).catch(function () {});
      });
    });

    /* A ledger group behaves as the frame shows it: one row open at a
       time, so the numbered rhythm never breaks into two open blocks. */
    document.querySelectorAll('[data-single]').forEach(function (group) {
      var rows = group.querySelectorAll('details');
      rows.forEach(function (d) {
        d.addEventListener('toggle', function () {
          if (!d.open) return;
          rows.forEach(function (o) { if (o !== d) o.open = false; });
        });
      });
    });
  }

  /* ---------------------------------------------------------
     QUESTION SEARCH — filters the accordions in place
     --------------------------------------------------------- */
  function initFinder() {
    var input = document.querySelector('[data-finder]');
    if (!input) return;
    var count  = document.querySelector('[data-finder-count]');
    var items  = Array.prototype.slice.call(document.querySelectorAll(ROWS));
    var groups = Array.prototype.slice.call(document.querySelectorAll('.qgroup'));
    var total  = items.length;

    function apply() {
      var q = input.value.trim().toLowerCase();
      var shown = 0;

      items.forEach(function (d) {
        var hit = !q || d.textContent.toLowerCase().indexOf(q) !== -1;
        d.classList.toggle('is-hidden', !hit);
        if (hit) shown++;
        if (q && hit) d.open = true;
        if (!q) d.open = false;
      });

      groups.forEach(function (g) {
        var any = g.querySelector('details:not(.is-hidden)');
        g.style.display = any || !q ? '' : 'none';
      });

      if (count) {
        count.textContent = !q
          ? total + ' questions, all answered.'
          : shown === 0
            ? 'Nothing matched “' + input.value.trim() + '”. Send it to us and we will answer it properly.'
            : shown + (shown === 1 ? ' question' : ' questions') + ' matched.';
      }
    }

    input.addEventListener('input', apply);
    apply();
  }

  /* ---------------------------------------------------------
     FORMS — client-side only; there is no endpoint yet
     --------------------------------------------------------- */
  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var note = form.querySelector('[data-form-note]');
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        if (note) {
          note.textContent = 'Thank you — this is a design prototype, so nothing was sent. ' +
            'The live form will reach the clinic directly.';
          note.style.color = 'var(--navy)';
        }
      });
    });
  }

  /* ---------------------------------------------------------
     BOOT
     --------------------------------------------------------- */
  function boot() {
    mountChrome();
    initStrip();
    initNav();
    initReveals();
    initSpine();
    initSpy('[data-journey-rail]', '.journey__step', 'chapter');
    initSpy('[data-qrail]', 'a', 'qgroup');
    initSpy('[data-inv-rail]', 'a', 'movement');
    initAccordions();
    initFinder();
    initForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
