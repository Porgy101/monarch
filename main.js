/* ═══════════════════════════════════════════════════════════════
   MONARCH — B2B WEBSITE   |   main.js
   ─────────────────────────────────────────────────────────────
   Sections:
   01. Navbar — scroll shrink + active link highlight
   02. Mobile Menu — hamburger open/close
   03. Hero — entrance animations
   04. Scroll Reveal — Intersection Observer fade-in
   05. Stat Counters — animated number roll-up
   06. Testimonial Slider — prev/next/dot navigation + auto-play
   07. Pricing Toggle — monthly ↔ annual switch
   08. FAQ Accordion — open/close answers
   09. Contact Form — validation + success state
   10. Edit Mode — inline text editing for all [data-editable] nodes
   11. Active Nav Link — highlight on scroll section entry
   12. Smooth Anchor Scroll — offset for fixed navbar
   13. Init — wire everything up on DOMContentLoaded
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   01. NAVBAR — shrink on scroll
───────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load
}

/* ─────────────────────────────────────────────────────────────
   02. MOBILE MENU — hamburger toggle
───────────────────────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  function toggleMenu(forceClose = false) {
    const isOpen = mobileMenu.classList.contains('open') || forceClose;
    if (isOpen) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      mobileMenu.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  hamburger.addEventListener('click', () => toggleMenu());

  // Close on any mobile link click
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-link, a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      toggleMenu(true);
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   03. HERO — staggered entrance animations
───────────────────────────────────────────────────────────── */
function initHeroAnimations() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  const elements = [
    heroContent.querySelector('.hero-badge'),
    ...heroContent.querySelectorAll('.hero-title .line'),
    heroContent.querySelector('.hero-sub'),
    heroContent.querySelector('.hero-actions'),
  ].filter(Boolean);

  elements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`;
  });

  // Small delay so CSS vars/fonts are ready
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });

  // Hero card (if present)
  const heroCard = document.querySelector('.hero-card');
  if (heroCard) {
    heroCard.style.opacity = '0';
    heroCard.style.transform = 'translateY(32px)';
    heroCard.style.transition = 'opacity 0.8s ease 0.55s, transform 0.8s ease 0.55s';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      heroCard.style.opacity = '1';
      heroCard.style.transform = 'translateY(0)';
    }));
  }
}

/* ─────────────────────────────────────────────────────────────
   04. SCROLL REVEAL — fade-in elements as they enter viewport
───────────────────────────────────────────────────────────── */
function initScrollReveal() {
  // Add .reveal to all key sectional children automatically
  const targets = document.querySelectorAll(
    '.service-card, .stat-item, .step, .testimonial-card, ' +
    '.price-card, .faq-item, .pillar, .about-floater, ' +
    '.section-header, .contact-item, .footer-col'
  );

  targets.forEach((el, i) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      // Stagger siblings that share the same parent
      const siblings = Array.from(el.parentElement.children);
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = `${idx * 0.07}s`;
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   05. STAT COUNTERS — animated roll-up on first view
───────────────────────────────────────────────────────────── */
function initStatCounters() {
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  if (!statNums.length) return;

  function animateCount(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const duration = 1800; // ms
    const start    = performance.now();

    // Easing: ease-out cubic
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOut(progress) * target);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   06. TESTIMONIAL SLIDER — manual + auto-play
───────────────────────────────────────────────────────────── */
function initTestimonialSlider() {
  const track  = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsEl  = document.getElementById('sliderDots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  if (!cards.length) return;

  let current  = 0;
  let autoTimer = null;

  function goTo(index) {
    // Clamp & wrap
    current = ((index % cards.length) + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;

    // Active card class
    cards.forEach((c, i) => c.classList.toggle('active', i === current));

    // Dots
    if (dotsEl) {
      const dots = dotsEl.querySelectorAll('.dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 5000);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  // Dot clicks
  if (dotsEl) {
    dotsEl.querySelectorAll('.dot').forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); startAuto(); });
    });
  }

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    stopAuto();
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    startAuto();
  }, { passive: true });

  // Init
  goTo(0);
  startAuto();
}

/* ─────────────────────────────────────────────────────────────
   07. PRICING TOGGLE — monthly ↔ annual
───────────────────────────────────────────────────────────── */
function initPricingToggle() {
  const toggle = document.getElementById('pricingToggle');
  if (!toggle) return;

  const amounts = document.querySelectorAll('.amount[data-monthly]');

  function updatePrices(annual) {
    amounts.forEach(el => {
      el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
    });
  }

  toggle.addEventListener('change', () => updatePrices(toggle.checked));
  updatePrices(false); // start monthly
}

/* ─────────────────────────────────────────────────────────────
   08. FAQ ACCORDION — one open at a time
───────────────────────────────────────────────────────────── */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    if (!btn || !ans) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-a');
        if (a) a.style.maxHeight = '0';
      });

      // Open this one if it was closed
      if (!isOpen) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   09. CONTACT FORM — validation + success feedback
───────────────────────────────────────────────────────────── */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  // Real-time field validation
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(input);
    });
  });

  function validateField(field) {
    const empty   = !field.value.trim();
    const badEmail = field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
    const invalid  = empty || badEmail;

    field.classList.toggle('invalid', invalid);
    field.classList.toggle('valid',   !invalid);

    // Remove old error msg
    const existing = field.parentElement.querySelector('.field-error');
    if (existing) existing.remove();

    if (invalid) {
      const msg = document.createElement('span');
      msg.className = 'field-error';
      msg.style.cssText = 'color:#E07070;font-size:0.74rem;margin-top:0.25rem;display:block;';
      msg.textContent = badEmail ? 'Please enter a valid email address.'
                                 : 'This field is required.';
      field.parentElement.appendChild(msg);
    }
    return !invalid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) allValid = false;
    });

    if (!allValid) {
      // Shake the submit button
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.style.animation = 'none';
        btn.offsetHeight; // reflow
        btn.style.animation = 'shake 0.4s ease';
        setTimeout(() => btn.style.animation = '', 400);
      }
      return;
    }

    // Simulate async send
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = 'Sending…';
      btn.disabled = true;
    }

    setTimeout(() => {
      if (success) success.classList.add('visible');
      form.reset();
      inputs.forEach(i => { i.classList.remove('valid', 'invalid'); });
      if (btn) { btn.textContent = 'Send Message'; btn.disabled = false; }
    }, 1200);
  });

  // Inject shake keyframe once
  if (!document.getElementById('shakeKeyframe')) {
    const style = document.createElement('style');
    style.id = 'shakeKeyframe';
    style.textContent = `
      @keyframes shake {
        0%,100%{transform:translateX(0)}
        20%{transform:translateX(-6px)}
        40%{transform:translateX(6px)}
        60%{transform:translateX(-4px)}
        80%{transform:translateX(4px)}
      }
      .form-group input.invalid,
      .form-group select.invalid,
      .form-group textarea.invalid {
        border-color: #E07070 !important;
        box-shadow: 0 0 0 3px rgba(224,112,112,0.12) !important;
      }
      .form-group input.valid,
      .form-group select.valid,
      .form-group textarea.valid {
        border-color: #5BDE95 !important;
      }
    `;
    document.head.appendChild(style);
  }
}

/* ─────────────────────────────────────────────────────────────
   10. EDIT MODE — click ✏ button to make [data-editable] nodes
       contenteditable; click again to lock. Changes persist in
       localStorage so the page remembers edits on reload.
───────────────────────────────────────────────────────────── */
function initEditMode() {
  // Inject the edit toggle button + toast if not already in HTML
  let editToggle = document.getElementById('editToggle');
  let editToast  = document.getElementById('editToast');

  if (!editToggle) {
    editToggle = document.createElement('button');
    editToggle.id        = 'editToggle';
    editToggle.className = 'edit-toggle';
    editToggle.title     = 'Toggle Edit Mode';
    editToggle.textContent = '✏';
    document.body.appendChild(editToggle);
  }

  if (!editToast) {
    editToast = document.createElement('div');
    editToast.id        = 'editToast';
    editToast.className = 'edit-toast';
    editToast.innerHTML = 'Edit Mode <span id="editStatus">ON</span>';
    document.body.appendChild(editToast);
  }

  const editStatus = document.getElementById('editStatus');
  const STORAGE_KEY = 'monarchEditableContent';
  let editMode = false;

  // ── Restore saved content on load ──
  function restoreSaved() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      document.querySelectorAll('[data-editable="true"]').forEach((el, i) => {
        const key = 'el_' + i;
        if (saved[key] !== undefined) el.innerHTML = saved[key];
      });
    } catch (_) {}
  }

  // ── Persist all editable content ──
  function saveAll() {
    try {
      const data = {};
      document.querySelectorAll('[data-editable="true"]').forEach((el, i) => {
        data['el_' + i] = el.innerHTML;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  // ── Enable / disable editing ──
  function setEditMode(active) {
    editMode = active;
    document.body.classList.toggle('edit-mode', active);
    editToggle.classList.toggle('active', active);

    if (editStatus) {
      editStatus.textContent = active ? 'ON' : 'OFF';
      editStatus.className   = active ? '' : 'off';
    }

    document.querySelectorAll('[data-editable="true"]').forEach(el => {
      // Don't make buttons/links fully contenteditable — it breaks clicks
      const tag = el.tagName.toLowerCase();
      const skip = tag === 'a' || tag === 'button' || tag === 'select' || tag === 'input';
      el.contentEditable = (active && !skip) ? 'true' : 'false';

      if (!active) {
        // Remove blue browser focus ring leftover
        el.blur();
      }
    });

    // Toast
    editToast.classList.add('visible');
    clearTimeout(editToast._timer);
    editToast._timer = setTimeout(() => editToast.classList.remove('visible'), 2200);

    // Save on exit
    if (!active) saveAll();
  }

  // ── Keyboard shortcut: Ctrl+E ──
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      setEditMode(!editMode);
    }
    // ESC exits edit mode
    if (e.key === 'Escape' && editMode) setEditMode(false);
  });

  // ── Save on every keystroke while editing ──
  document.addEventListener('input', (e) => {
    if (editMode && e.target.getAttribute('data-editable') === 'true') {
      saveAll();
    }
  });

  editToggle.addEventListener('click', () => setEditMode(!editMode));

  // ── Paste as plain text to avoid pasting HTML styles ──
  document.addEventListener('paste', (e) => {
    if (!editMode) return;
    const active = document.activeElement;
    if (active && active.getAttribute('data-editable') === 'true') {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text/plain');
      document.execCommand('insertText', false, text);
    }
  });

  restoreSaved();
}

/* ─────────────────────────────────────────────────────────────
   11. ACTIVE NAV LINK — highlight on scroll section entry
───────────────────────────────────────────────────────────── */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const matches = link.getAttribute('href') === '#' + id;
          link.classList.toggle('nav-active', matches);
          link.style.color = matches ? 'var(--gold)' : '';
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

/* ─────────────────────────────────────────────────────────────
   12. SMOOTH ANCHOR SCROLL — offset for fixed navbar height
───────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navbar     = document.getElementById('navbar');
      const navHeight  = navbar ? navbar.offsetHeight : 80;
      const targetTop  = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   BONUS A. Navbar — subtle parallax on hero-bg orbs
───────────────────────────────────────────────────────────── */
function initOrbParallax() {
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  if (!orb1 && !orb2) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY * 0.25;
    if (orb1) orb1.style.transform = `translateY(${y}px)`;
    if (orb2) orb2.style.transform = `translateY(${-y * 0.6}px)`;
  }, { passive: true });
}

/* ─────────────────────────────────────────────────────────────
   BONUS B. Service cards — subtle tilt on mouse move
───────────────────────────────────────────────────────────── */
function initCardTilt() {
  const cards = document.querySelectorAll('.service-card, .price-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -(dy * 4).toFixed(2);
      const rotY   =  (dx * 4).toFixed(2);
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform  = '';
      setTimeout(() => card.style.transition = '', 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease';
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   BONUS C. Back-to-top — appears after scrolling 500px
───────────────────────────────────────────────────────────── */
function initBackToTop() {
  // Create button
  const btn = document.createElement('button');
  btn.id    = 'backToTop';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  btn.style.cssText = `
    position:fixed; bottom:6.5rem; right:2rem;
    width:44px; height:44px; border-radius:50%;
    background:var(--navy-mid); color:var(--gold);
    border:1.5px solid rgba(201,168,76,0.3);
    font-size:1.1rem; cursor:pointer; z-index:9998;
    opacity:0; pointer-events:none;
    transition:opacity 0.3s, transform 0.3s, background 0.2s;
    display:flex; align-items:center; justify-content:center;
  `;
  document.body.appendChild(btn);

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  btn.addEventListener('mouseenter', () => btn.style.background = 'var(--gold-dim)');
  btn.addEventListener('mouseleave', () => btn.style.background = 'var(--navy-mid)');

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 500;
    btn.style.opacity        = show ? '1' : '0';
    btn.style.pointerEvents  = show ? 'auto' : 'none';
    btn.style.transform      = show ? 'translateY(0)' : 'translateY(10px)';
  }, { passive: true });
}

/* ─────────────────────────────────────────────────────────────
   BONUS D. Marquee — pause on hover
───────────────────────────────────────────────────────────── */
function initMarqueePause() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}

/* ─────────────────────────────────────────────────────────────
   13. INIT — run everything on DOM ready
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initHeroAnimations();
  initScrollReveal();
  initStatCounters();
  initTestimonialSlider();
  initPricingToggle();
  initFAQ();
  initContactForm();
  initEditMode();
  initActiveNavLinks();
  initSmoothScroll();
  initOrbParallax();
  initCardTilt();
  initBackToTop();
  initMarqueePause();

  console.log('%cMonarch B2B — JS loaded ✓', 'color:#C9A84C;font-weight:bold;font-size:14px;');
});
