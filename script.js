/* =========================================================
   KOKA GROUP — Script
   ========================================================= */

// Register GSAP plugins
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* --- Header Universe Adaptation --- */
if (typeof ScrollTrigger !== 'undefined') {
  const headerEl = document.querySelector('.header');
  const zones = document.querySelectorAll('[data-universe]');
  if (zones.length && headerEl) {
    // Set initial header universe only if not already set in HTML
    if (!headerEl.hasAttribute('data-header-universe')) {
      headerEl.setAttribute('data-header-universe', zones[0].dataset.universe);
    }

    zones.forEach(zone => {
      ScrollTrigger.create({
        trigger: zone,
        start: 'top 10%',
        end: 'bottom 10%',
        onEnter: () => headerEl.setAttribute('data-header-universe', zone.dataset.universe),
        onEnterBack: () => headerEl.setAttribute('data-header-universe', zone.dataset.universe)
      });
    });
  }
}

/* --- Menu --- */
const burger = document.querySelector('.burger');
const navOverlay = document.querySelector('.nav-overlay');
if (burger && navOverlay) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
  });
  navOverlay.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
    burger.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }));
}

/* --- Header scroll state --- */
const header = document.querySelector('.header');
if (header) {
  const heroSection = document.querySelector('.hero-vinyl');
  let lastY = 0;
  const updateHeader = () => {
    header.classList.toggle('scrolled', scrollY > 80);
    if (heroSection) {
      header.classList.toggle('hero-hidden', scrollY < heroSection.offsetHeight * 0.85);
    }
    lastY = scrollY;
  };
  // Start hidden, reveal after hero scroll
  if (heroSection) header.classList.add('hero-hidden');
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

/* --- Hero entrance + letter animations + image cycle --- */
const heroVinyl = document.querySelector('.hero-vinyl');
if (heroVinyl) {
  // Trigger entrance (CSS animations handle the staggered fade-in)
  requestAnimationFrame(() => {
    setTimeout(() => heroVinyl.classList.add('is-loaded'), 200);
  });

  // Animate feTurbulence displacement: subtle heat shimmer on letters
  if (typeof gsap !== 'undefined') {
    const displace = document.querySelector('#logoDistort feDisplacementMap');
    const turb = document.getElementById('turbulence');
    if (displace && turb) {
      // Gentle shimmer loop: scale pulses 0 → 4 → 0
      gsap.to({ val: 0 }, {
        val: 4,
        duration: 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        onUpdate: function () {
          displace.setAttribute('scale', this.targets()[0].val);
        }
      });
      // Slowly drift the noise seed for organic variation
      gsap.to({ freq: 0.015 }, {
        freq: 0.025,
        duration: 8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        onUpdate: function () {
          const f = this.targets()[0].freq;
          turb.setAttribute('baseFrequency', f + ' ' + (f * 0.8));
        }
      });
    }
  }

  // Image cycle with Ken Burns + dot color pulse + bg photo sync
  const vinylO = document.getElementById('vinylO');
  const dot = document.getElementById('vinylDot');
  const heroBgPhoto = document.querySelector('#heroBgPhoto img');
  if (vinylO && dot && typeof gsap !== 'undefined') {
    const slides = vinylO.querySelectorAll('.vinyl-o-img');
    const bgImages = Array.from(slides).map(function(s) { return s.querySelector('img').src; });
    const colors = ['#C8A96E', '#5b8cc9', '#b97fbf', '#D4766A'];
    let current = 0;
    const HOLD = 3.5;

    // Initial Ken Burns
    gsap.fromTo(slides[0], { scale: 1 }, { scale: 1.15, duration: HOLD, ease: 'none' });

    function cycle() {
      const prev = current;
      current = (current + 1) % slides.length;
      const ct = gsap.timeline();

      // Dot pulse + color change
      ct.to(dot, { scale: 8, opacity: 0, duration: .4, ease: 'power2.in' }, 0);
      ct.set(dot, { background: colors[current], boxShadow: '0 0 25px ' + colors[current] + '80' });
      ct.to(dot, { scale: 1, opacity: 1, duration: .5, ease: 'back.out(2)' }, .5);

      // Image crossfade
      ct.to(slides[prev], { opacity: 0, scale: 1.15, duration: .6, ease: 'power2.inOut' }, .2);
      ct.fromTo(slides[current], { opacity: 0, scale: .95 }, { opacity: 1, scale: 1, duration: .6, ease: 'power2.out' }, .35);

      // Ken Burns on new image
      ct.to(slides[current], { scale: 1.15, duration: HOLD, ease: 'none' }, .7);

      // Sync background photo
      if (heroBgPhoto) {
        ct.to(heroBgPhoto, { opacity: 0, duration: .4, ease: 'power2.in' }, .1);
        ct.call(function() { heroBgPhoto.src = bgImages[current]; }, null, .5);
        ct.to(heroBgPhoto, { opacity: .1, duration: .6, ease: 'power2.out' }, .6);
      }
    }

    var cycleId = setInterval(cycle, (HOLD + .5) * 1000);
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) clearInterval(cycleId);
      else cycleId = setInterval(cycle, (HOLD + .5) * 1000);
    });
  }

  // Idle floating animation on letters — amplified, organic motion
  if (typeof gsap !== 'undefined') {
    var idleLetters = [];

    // K1: drift up-left, rotate, squash/stretch
    var k1 = document.getElementById('layerK1');
    if (k1) {
      var k1tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
      k1tl.to(k1, { y: -18, x: -8, rotation: -3, duration: 3.2 }, 0);
      k1tl.to(k1, { scaleY: 1.04, scaleX: 0.96, duration: 2.4 }, 0);
      idleLetters.push(k1tl);
    }

    // K2: drift right-down, opposite phase
    var k2 = document.getElementById('layerK2');
    if (k2) {
      var k2tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' }, delay: 0.5 });
      k2tl.to(k2, { y: 14, x: 10, rotation: 2.5, duration: 2.8 }, 0);
      k2tl.to(k2, { scaleY: 0.96, scaleX: 1.04, duration: 2.6 }, 0);
      idleLetters.push(k2tl);
    }

    // A: slow breathing scale + larger tilt
    var la = document.getElementById('layerA');
    if (la) {
      var atl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' }, delay: 1 });
      atl.to(la, { y: -20, x: 12, rotation: 4, duration: 3.5 }, 0);
      atl.to(la, { scaleX: 1.06, scaleY: 0.94, duration: 3 }, 0);
      idleLetters.push(atl);
    }

    // Portal: breathing + slight drift opposite to letters
    var portal = document.querySelector('.vinyl-portal');
    if (portal) {
      var ptl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' }, delay: 0.3 });
      ptl.to(portal, { y: -10, x: -5, scale: 1.03, duration: 3.8 }, 0);
      idleLetters.push(ptl);
    }

    // Dot: pulsing scale + color glow
    var dotEl = document.getElementById('vinylDot');
    if (dotEl) {
      var dtl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
      dtl.to(dotEl, { scale: 1.4, duration: 1.5 }, 0);
      idleLetters.push(dtl);
    }

    // "group" label: subtle float
    var groupLabel = document.getElementById('vinylGroupLabel');
    if (groupLabel) {
      var gtl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' }, delay: 0.8 });
      gtl.to(groupLabel, { y: -6, x: 4, opacity: 0.55, duration: 3 }, 0);
      idleLetters.push(gtl);
    }

    // Kill idle animations when user starts scrolling (ScrollTrigger takes over)
    window.addEventListener('scroll', function killIdle() {
      if (window.scrollY > 50) {
        idleLetters.forEach(function(tl) { tl.kill(); });
        window.removeEventListener('scroll', killIdle);
      }
    }, { passive: true });
  }

  // Click interaction on K, K, A letters — squash/stretch/spin then bounce back
  if (typeof gsap !== 'undefined') {
    var letterConfigs = [
      { id: 'layerK1', scaleX: 0.3, scaleY: 1.6, rotation: -20, x: -30 },
      { id: 'layerK2', scaleX: 1.5, scaleY: 0.4, rotation: 15, x: 20 },
      { id: 'layerA',  scaleX: 0.5, scaleY: 1.4, rotation: 25, x: 0 },
    ];
    letterConfigs.forEach(function(cfg) {
      var el = document.getElementById(cfg.id);
      if (!el) return;
      var animating = false;
      // Listen on the SVG shapes inside (polygon/path), animate the parent layer
      el.querySelectorAll('polygon, path').forEach(function(shape) {
        shape.addEventListener('click', function(e) {
          e.stopPropagation();
          if (animating) return;
          animating = true;
          var tl = gsap.timeline({
            onComplete: function() { animating = false; }
          });
          tl.to(el, {
            scaleX: cfg.scaleX, scaleY: cfg.scaleY,
            rotation: cfg.rotation, x: cfg.x,
            duration: 0.15, ease: 'power4.out'
          });
          tl.to(el, {
            scaleX: 1, scaleY: 1, rotation: 0, x: 0,
            duration: 0.8, ease: 'elastic.out(1.2, 0.4)'
          });
        });
      });
    });
  }
}

/* --- GSAP Scroll Animations --- */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

  // Hero parallax
  (function initHeroParallax() {
    var hero = document.getElementById('hero');
    if (!hero) return;

    var cfg = function(end) {
      return { trigger: hero, start: 'top top', end: end || '45% top', scrub: 0.4 };
    };

    // Letter layers — explosive parallax: each letter scatters in its own direction
    gsap.to('#layerK1', { y: -300, x: -120, rotation: -15, scale: 0.6, opacity: 0, ease: 'power1.in', scrollTrigger: cfg() });
    gsap.to('#layerK2', { y: -200, x: 80, rotation: 12, scale: 0.7, opacity: 0, ease: 'power1.in', scrollTrigger: cfg() });
    gsap.to('#layerA', { y: -350, x: 150, rotation: 18, scale: 0.5, opacity: 0, ease: 'power1.in', scrollTrigger: cfg() });

    // Portal — shrinks and fades dramatically
    gsap.to('.vinyl-portal', { y: -150, scale: 0.3, opacity: 0, ease: 'power1.in', scrollTrigger: cfg() });

    // "group" label — drifts down-right and fades
    gsap.fromTo('.vinyl-group-label', { opacity: 0.5, y: 0, x: 0 }, { y: 80, x: 60, opacity: 0, ease: 'power1.in', scrollTrigger: cfg() });

    // Scroll hint disappears immediately
    gsap.to('.hero-scroll', { opacity: 0, y: 60, ease: 'none', scrollTrigger: cfg('15% top') });
  })();

  // Parallax on all large images
  document.querySelectorAll('.svc-img img, .presta-panel-img img, .about-photo img, .about-img img, .page-hero-bg img').forEach(img => {
    gsap.fromTo(img,
      { yPercent: -6, scale: 1.12 },
      { yPercent: 6, scale: 1.12, ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.svc, .presta-panel, .about-split, .about-hero, .page-hero') || img.parentElement,
          start: 'top bottom', end: 'bottom top', scrub: true
        }
      }
    );
  });

  // === HELPER: gsap.fromTo with clearProps to avoid opacity:0 bug ===
  function reveal(targets, from, to, stOpts) {
    var toVars = Object.assign({}, to, { clearProps: 'transform,opacity' });
    if (stOpts) toVars.scrollTrigger = stOpts;
    gsap.fromTo(targets, from, toVars);
  }

  // Service panel text reveals
  document.querySelectorAll('.svc-body, .presta-panel-body').forEach(body => {
    reveal(body.children, { y: 45, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .08, ease: 'power3.out' },
      { trigger: body, start: 'top 85%', once: true });
  });

  // Big numbers scale
  document.querySelectorAll('.svc-num, .cat-num').forEach(n => {
    reveal(n, { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' },
      { trigger: n.parentElement, start: 'top 85%', once: true });
  });

  // Category headers
  document.querySelectorAll('.cat-head').forEach(ch => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: ch, start: 'top 85%', once: true } });
    const label = ch.querySelector('.label');
    const h2 = ch.querySelector('h2');
    const p = ch.querySelector(':scope > p');
    if (label) tl.fromTo(label, { x: -25, opacity: 0 }, { x: 0, opacity: 1, duration: .5, ease: 'power3.out', clearProps: 'all' }, 0);
    if (h2) tl.fromTo(h2, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'power3.out', clearProps: 'all' }, .08);
    if (p) tl.fromTo(p, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out', clearProps: 'all' }, .2);
  });

  // Presta cards stagger
  document.querySelectorAll('.presta-grid').forEach(grid => {
    reveal(grid.querySelectorAll('.presta-card'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .1, ease: 'power3.out' },
      { trigger: grid, start: 'top 85%', once: true });
  });

  // About body
  document.querySelectorAll('.about-body, .about-txt').forEach(el => {
    reveal(el.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .08, ease: 'power3.out' },
      { trigger: el, start: 'top 85%', once: true });
  });

  // Blockquotes
  document.querySelectorAll('.quote-section, .presta-sep').forEach(qs => {
    const q = qs.querySelector('blockquote');
    const c = qs.querySelector('cite');
    if (q) reveal(q, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power3.out' },
      { trigger: qs, start: 'top 85%', once: true });
    if (c) reveal(c, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: .6, delay: .25, ease: 'power3.out' },
      { trigger: qs, start: 'top 85%', once: true });
  });

  // Instagram grid
  const instaGrid = document.querySelector('.insta-grid');
  if (instaGrid) {
    reveal(instaGrid.children, { scale: .88, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, stagger: .05, ease: 'power2.out' },
      { trigger: instaGrid, start: 'top 85%', once: true });
  }

  // CTA
  document.querySelectorAll('.cta, .presta-cta').forEach(cta => {
    reveal(cta.children, { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .1, ease: 'power3.out' },
      { trigger: cta, start: 'top 85%', once: true });
  });

  // Members
  document.querySelectorAll('.member').forEach((m, i) => {
    reveal(m, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: .8, delay: i * .12, ease: 'power3.out' },
      { trigger: m, start: 'top 85%', once: true });
  });

  // Partner cards
  document.querySelectorAll('.partner-card').forEach((p, i) => {
    reveal(p, { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: .6, delay: i * .08, ease: 'power3.out' },
      { trigger: p, start: 'top 88%', once: true });
  });

  // Contact
  const contactWrap = document.querySelector('.contact-wrap');
  if (contactWrap) {
    reveal(contactWrap.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .1, ease: 'power3.out' },
      { trigger: contactWrap, start: 'top 85%', once: true });
  }

  // Page hero content
  const pageHeroContent = document.querySelector('.page-hero-content');
  if (pageHeroContent) {
    gsap.fromTo(pageHeroContent.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .12, ease: 'power3.out', delay: .2, clearProps: 'transform,opacity' });
  }

  // Reel slight parallax shift
  document.querySelectorAll('.reel').forEach(reel => {
    gsap.fromTo(reel, { x: 0 }, {
      x: reel.classList.contains('reel-reverse') ? 60 : -60,
      ease: 'none',
      scrollTrigger: { trigger: reel, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // Stats counter animation
  document.querySelectorAll('.stat').forEach((s, i) => {
    reveal(s, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .6, delay: i * .1, ease: 'power3.out' },
      { trigger: s, start: 'top 88%', once: true });
  });

  // Process steps stagger
  const processSteps = document.querySelectorAll('.process-step');
  if (processSteps.length) {
    reveal(processSteps, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .12, ease: 'power3.out' },
      { trigger: processSteps[0].parentElement, start: 'top 85%', once: true });
  }

  // Values items stagger
  document.querySelectorAll('.value-item').forEach((v, i) => {
    reveal(v, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: .5, delay: i * .08, ease: 'power3.out' },
      { trigger: v, start: 'top 88%', once: true });
  });
}

/* --- Contact Form --- */
const form = document.querySelector('.contact-form');
if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  alert('Merci ! Votre message a bien été envoyé.');
  form.reset();
});

/* --- Smooth Anchors --- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* === CONTACT WIZARD === */
(function initWizard() {
  var wizard = document.getElementById('wizard');
  if (!wizard) return;

  var steps = wizard.querySelectorAll('.wizard-step');
  var bar = document.getElementById('wizardBar');
  var label = document.getElementById('wizardStepLabel');
  var current = 1;
  var data = { eventType: '', guests: '', needs: [] };

  function goTo(n) {
    steps.forEach(function(s) { s.classList.remove('active'); });
    var target = wizard.querySelector('[data-step="' + n + '"]');
    if (target) { target.classList.add('active'); current = n; }
    var total = 4;
    var pct = n <= total ? (n / total * 100) : 100;
    if (bar) bar.style.width = pct + '%';
    if (label) label.textContent = n <= total ? ('Étape ' + n + '/' + total) : 'Terminé';
  }

  // Step 1: Event type (single select → auto-advance)
  var eventChoices = wizard.querySelectorAll('#eventTypeChoices .wizard-choice');
  eventChoices.forEach(function(btn) {
    btn.addEventListener('click', function() {
      eventChoices.forEach(function(b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      data.eventType = btn.dataset.value;
      setTimeout(function() { goTo(2); }, 300);
    });
  });

  // Step 2: Guest count (single select)
  var guestChoices = wizard.querySelectorAll('#guestChoices .wizard-choice');
  guestChoices.forEach(function(btn) {
    btn.addEventListener('click', function() {
      guestChoices.forEach(function(b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      data.guests = btn.dataset.value;
    });
  });

  // Step 3: Needs (multi-select)
  var needsChoices = wizard.querySelectorAll('#needsChoices .wizard-choice');
  needsChoices.forEach(function(btn) {
    btn.addEventListener('click', function() {
      btn.classList.toggle('selected');
      data.needs = Array.from(needsChoices).filter(function(b) { return b.classList.contains('selected'); }).map(function(b) { return b.dataset.value; });
    });
  });

  // Navigation buttons
  wizard.querySelectorAll('.wizard-next').forEach(function(btn) {
    btn.addEventListener('click', function() { goTo(current + 1); });
  });
  wizard.querySelectorAll('.wizard-back').forEach(function(btn) {
    btn.addEventListener('click', function() { goTo(current - 1); });
  });

  // Submit
  var submitBtn = wizard.querySelector('.wizard-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      var name = document.getElementById('wizName');
      var email = document.getElementById('wizEmail');
      if (!name || !name.value.trim() || !email || !email.value.trim()) {
        if (name && !name.value.trim()) name.style.borderColor = '#D4766A';
        if (email && !email.value.trim()) email.style.borderColor = '#D4766A';
        return;
      }
      // Collect all data
      data.name = name.value;
      data.email = email.value;
      data.phone = (document.getElementById('wizPhone') || {}).value || '';
      data.date = (document.getElementById('wizDate') || {}).value || '';
      data.lieu = (document.getElementById('wizLieu') || {}).value || '';
      data.message = (document.getElementById('wizMessage') || {}).value || '';
      console.log('KOKA Contact Form:', data);
      goTo(5);
    });
  }
})();

/* === DYNAMIC ENHANCEMENTS === */

/* --- Custom Cursor (desktop only) --- */
if (window.matchMedia('(pointer:fine)').matches) {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  let cx = 0, cy = 0, dx = 0, dy = 0;
  document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });

  (function moveCursor() {
    dx += (cx - dx) * 0.15;
    dy += (cy - dy) * 0.15;
    cursor.style.left = dx + 'px';
    cursor.style.top = dy + 'px';
    dot.style.left = cx + 'px';
    dot.style.top = cy + 'px';
    requestAnimationFrame(moveCursor);
  })();

  document.querySelectorAll('a, button, .svc-card, .presta-card, .gallery-grid a, .btn, .burger').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

/* --- Scroll-triggered visibility (section lines, value items, etc.) --- */
if (typeof IntersectionObserver !== 'undefined') {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section-pad, .hr-animated, .line-reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // Add animated separator lines between major sections
  document.querySelectorAll('.services-grid, .about-split, .values, .gallery, .cta, .trust').forEach(el => {
    el.classList.add('section-pad');
    revealObserver.observe(el);
  });
}

/* --- Tilt effect on service cards --- */
document.querySelectorAll('.svc-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = 'translateY(-8px) perspective(600px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* --- Magnetic buttons --- */
document.querySelectorAll('.btn, .btn-cta, .btn-submit').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = 'translate(' + (x * 0.2) + 'px,' + (y * 0.2) + 'px) scale(1.05)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* --- Testimonial slider --- */
(function() {
  var slider = document.getElementById('testimonialSlider');
  if (!slider) return;
  var items = slider.querySelectorAll('.testimonial');
  if (items.length < 2) return;
  var current = 0;
  setInterval(function() {
    // Fade out current
    items[current].classList.remove('active');
    // Wait for exit transition, then fade in next
    setTimeout(function() {
      current = (current + 1) % items.length;
      items[current].classList.add('active');
    }, 500);
  }, 6000);
})();
