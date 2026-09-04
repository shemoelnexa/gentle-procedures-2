/**
 * Gentle Procedures — site interactions.
 * Bootstrap 5 (via CDN bundle) handles the accordion, dropdown and
 * offcanvas primitives declaratively through data-bs-* attributes.
 * AOS (via CDN) handles reveal-on-scroll animation through data-aos
 * attributes in the markup. This file layers the remaining bespoke
 * behaviour: scroll-aware header, back-to-top, the inline video
 * play/pause/mute controls, and the stats counter animation.
 */
(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- AOS init ---------- */
  if (window.AOS) {
    window.AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: prefersReducedMotion,
    });
  }

  var header = document.getElementById("siteHeader");
  var backToTop = document.getElementById("backToTop");

  /* ---------- Header background on scroll ---------- */
  function onScroll() {
    var scrolled = window.scrollY > 40;
    if (header) header.classList.toggle("is-scrolled", scrolled);
    if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 600);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Stats counter animation ---------- */
  var counters = document.querySelectorAll(".gp-stats__count");
  if (counters.length) {
    var animateCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count-to"), 10);
      if (prefersReducedMotion || !target) {
        el.textContent = target;
        return;
      }
      var duration = 1400;
      var start = null;
      var easeOutQuad = function (t) { return t * (2 - t); };

      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var value = Math.round(easeOutQuad(progress) * target);
        el.textContent = value;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      window.requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      var statsObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              statsObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach(function (el) { statsObserver.observe(el); });
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------- Video card: inline play / pause / mute ---------- */
  var playBtn = document.getElementById("playVideoBtn");
  var muteBtn = document.getElementById("muteVideoBtn");
  var clinicVideo = document.getElementById("clinicVideo");
  var videoLabel = document.getElementById("videoCardLabel");

  if (playBtn && clinicVideo) {
    // Each page sets its own resting label ("Play Video", "Visit Us", "Read
    // the guide"...) — remember it so pause/ended restores that exact text
    // instead of a hardcoded default.
    var restingLabel = videoLabel ? videoLabel.textContent : "";

    playBtn.addEventListener("click", function () {
      if (clinicVideo.paused || clinicVideo.ended) {
        clinicVideo.muted = false;
        if (muteBtn) {
          muteBtn.setAttribute("aria-pressed", "false");
          muteBtn.classList.remove("is-muted");
        }
        clinicVideo.play().catch(function () { /* playback blocked; button stays in its current state */ });
      } else {
        clinicVideo.pause();
      }
    });

    clinicVideo.addEventListener("play", function () {
      playBtn.setAttribute("aria-pressed", "true");
      if (videoLabel) videoLabel.textContent = "Pause Video";
    });

    ["pause", "ended"].forEach(function (evt) {
      clinicVideo.addEventListener(evt, function () {
        playBtn.setAttribute("aria-pressed", "false");
        if (videoLabel) videoLabel.textContent = restingLabel;
      });
    });
  }

  if (muteBtn && clinicVideo) {
    muteBtn.addEventListener("click", function () {
      clinicVideo.muted = !clinicVideo.muted;
      muteBtn.setAttribute("aria-pressed", String(clinicVideo.muted));
      muteBtn.classList.toggle("is-muted", clinicVideo.muted);
    });
  }

  /* ---------- Hero title rolling word slider ---------- */
  document.querySelectorAll(".gp-hero__title-rotator").forEach(function (rotator) {
    var words = rotator.querySelectorAll(".gp-hero__title-rotator-word");
    if (words.length < 2 || prefersReducedMotion) return;
    var index = 0;
    setInterval(function () {
      var current = words[index];
      var nextIndex = (index + 1) % words.length;
      var next = words[nextIndex];
      current.classList.remove("is-active");
      current.classList.add("is-leaving");
      next.classList.add("is-active");
      setTimeout(function () { current.classList.remove("is-leaving"); }, 600);
      index = nextIndex;
    }, 2400);
  });

  /* ---------- Language switcher (UI only) ---------- */
  document.querySelectorAll(".gp-lang__menu .dropdown-item").forEach(function (item) {
    item.addEventListener("click", function () {
      document.querySelectorAll(".gp-lang__btn").forEach(function (btn) {
        btn.textContent = item.textContent.trim() === "English" ? "En" : "Ar";
      });
    });
  });
})();
