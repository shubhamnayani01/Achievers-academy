/**
 * Initialize all page interactions and animations
 * Waits for GSAP libraries to load before setting up animations
 */
const initPage = () => {
  try {
    // Verify GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded, deferring initialization');
      requestAnimationFrame(initPage);
      return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Base functionality (doesn't depend on GSAP)
    setupNavbar();
    setupMobileMenu();
    setupSmoothScroll();
    setupActiveNavLinks();
    setupContactForm();

    // GSAP-based animations (enhancement layer)
    setupHeroAnimation();
    setupScrollReveal();
    setupCounters();
    setupCourseGlow();
    setupExtraAnimations();
    setupWaFab();

    console.log('[Achievers Academy] Page initialization complete');
  } catch (error) {
    console.error('[Achievers Academy] Initialization error:', error);
  }
};

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPage);
} else {
  initPage();
}

  /* NAVBAR */
  function setupNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    let bannerHeight = document.getElementById('admBanner')?.offsetHeight || 36;

    const update = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        navbar.style.top = '0';
      } else {
        navbar.classList.remove('scrolled');
        navbar.style.top = (document.getElementById('admBanner') ? bannerHeight : 0) + 'px';
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', () => {
      bannerHeight = document.getElementById('admBanner')?.offsetHeight || 0;
    });
    update();
  }

  /* MOBILE MENU */
  function setupMobileMenu() {
    const btn = document.getElementById('hamburger');
    const links = document.getElementById('navLinks');
    if (!btn || !links) return;

    btn.addEventListener('click', () => {
      btn.classList.toggle('open');
      links.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link, .nav-cta-btn').forEach(a => {
      a.addEventListener('click', () => {
        btn.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  /* SMOOTH SCROLL */
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        e.preventDefault();
        const navbar = document.getElementById('navbar');
        const navH = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ACTIVE NAV LINKS */
  function setupActiveNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    if (!navLinks.length) return;

    window.addEventListener('scroll', () => {
      let current = '';
      const sections = ['home', 'why-us', 'about', 'courses', 'achievers', 'faculty', 'reviews', 'contact'];

      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= window.scrollY + 100) {
          current = id;
        }
      });

      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = Array.from(navLinks).find(l => l.getAttribute('href') === '#' + current);
      if (activeLink) activeLink.classList.add('active');
    });
  }


  /* HERO ANIMATION */
  function setupHeroAnimation() {
    // Only animate if GSAP is available
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    let animationAdded = false;

    // Hero lines - subtle scale and fade effect
    if (document.getElementById('heroLine1')) {
      tl.from('#heroLine1', { opacity: 0.7, scale: 0.96, duration: 0.8, delay: 0.2 }, 0)
        .from('#heroLine2', { opacity: 0.7, scale: 0.96, duration: 0.8 }, 0.1)
        .from('#heroLine3', { opacity: 0.7, scale: 0.96, duration: 0.8 }, 0.2);
      animationAdded = true;
    }

    // Badge - subtle entrance
    const badge = document.querySelector('.hero-badge');
    if (badge) {
      tl.from(badge, { opacity: 0.5, y: 10, duration: 0.6, ease: 'back.out(1.2)' }, 0.15);
      animationAdded = true;
    }

    // Supporting text and buttons
    const elements = [
      { sel: '.hero-sub', delay: 0.2 },
      { sel: '.hero-highlight', delay: 0.25 },
      { sel: '.hero-desc', delay: 0.3 },
      { sel: '.hero-btns', delay: 0.35 },
      { sel: '.hero-pills', delay: 0.4 }
    ];

    elements.forEach(({ sel, delay }) => {
      const el = document.querySelector(sel);
      if (el) {
        tl.from(el, { opacity: 0.6, y: 8, duration: 0.5, ease: 'power2.out' }, delay);
        animationAdded = true;
      }
    });

    // Floating shapes - visible but enhanced with animation
    const shapes = document.querySelectorAll('.shape');
    if (shapes.length) {
      gsap.from(shapes, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        delay: 0.6,
        ease: 'elastic.out(1, 0.5)'
      });
      animationAdded = true;
    }

    if (animationAdded) {
      console.log('[Hero Animation] Setup complete');
    }
  }

  /* SCROLL REVEAL */
  function setupScrollReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Staggered fade-in for reveal-up elements (already visible, just enhanced)
    const revealUpElements = document.querySelectorAll('.reveal-up');
    revealUpElements.forEach((el, idx) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => {
          gsap.from(el, {
            opacity: 0.7,
            y: 20,
            duration: 0.6,
            delay: (idx % 6) * 0.05,
            ease: 'power2.out',
            overwrite: false,
            clearProps: 'transform,opacity'
          });
        }
      });
    });

    // Horizontal reveal animations
    const revealSideElements = document.querySelectorAll('.reveal-left, .reveal-right');
    revealSideElements.forEach(el => {
      const isLeft = el.classList.contains('reveal-left');
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          gsap.from(el, {
            opacity: 0.6,
            x: isLeft ? 40 : -40,
            duration: 0.7,
            ease: 'power2.out',
            overwrite: false,
            clearProps: 'transform,opacity'
          });
        }
      });
    });

    // Heading animations
    document.querySelectorAll('.section-heading').forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        onEnter: () => {
          gsap.from(el, {
            opacity: 0.7,
            y: 20,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: false,
            clearProps: 'transform,opacity'
          });
        }
      });
    });

    // Blob parallax animations
    document.querySelectorAll('.blob').forEach(blob => {
      if (!blob.parentElement) return;
      gsap.to(blob, {
        y: -60,
        scrollTrigger: {
          scrub: 2,
          trigger: blob.parentElement,
          start: 'top bottom',
          end: 'bottom top'
        }
      });
    });

    console.log('[Scroll Reveal] Setup complete with', revealUpElements.length + revealSideElements.length, 'elements');
  }

  /* COUNTERS */
  function setupCounters() {
    document.querySelectorAll('.counter-val').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      let triggered = false;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => {
          if (triggered) return;
          triggered = true;

          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.floor(obj.val);
            }
          });
        }
      });
    });
  }

  /* COURSE GLOW */
  function setupCourseGlow() {
    if (typeof gsap === 'undefined') return;

    const courseCards = document.querySelectorAll('.course-card');
    let setupCount = 0;

    courseCards.forEach(card => {
      const glowColor = card.getAttribute('data-glow') || '#f5c518';

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          boxShadow: `0 20px 60px ${glowColor}33`,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          boxShadow: '0 0 0 rgba(0,0,0,0)',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      setupCount++;
    });

    if (setupCount > 0) {
      console.log('[Course Glow] Setup for', setupCount, 'cards');
    }
  }

  /* CONTACT FORM */
  function setupContactForm() {
    const form = document.getElementById('inquiryForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      try {
        const name = document.getElementById('fname')?.value.trim();
        const phone = document.getElementById('fphone')?.value.trim();
        const grade = document.getElementById('fgrade')?.value;
        const subject = document.getElementById('fsubject')?.value;
        const msg = document.getElementById('fmsg')?.value.trim();

        if (!name || !phone) {
          const field = !name ? 'fname' : 'fphone';
          shakeField(field);
          return;
        }

        const text = encodeURIComponent(
          `Hi! I'm ${name}. I want to know more about ${subject || 'coaching'} for ${grade || 'my class'}. My phone: ${phone}.${msg ? '\n' + msg : ''}`
        );

        const btn = document.getElementById('formSubmit');
        if (btn) {
          btn.innerHTML = '<span>Opening WhatsApp...</span>';
          btn.style.background = '#22c55e';
        }

        setTimeout(() => {
          window.open(`https://wa.me/918521282110?text=${text}`, '_blank');
          form.reset();
          if (btn) {
            btn.innerHTML = '<span>📞 Get Free Demo Class →</span><div class="btn-shine"></div>';
            btn.style.background = '';
          }
        }, 600);
      } catch (error) {
        console.error('[Contact Form] Submission error:', error);
      }
    });
  }

  function shakeField(fieldId) {
    const el = document.getElementById(fieldId);
    if (!el) return;

    try {
      if (typeof gsap !== 'undefined') {
        gsap.to(el, {
          x: [-8, 8, -6, 6, 0],
          duration: 0.4,
          ease: 'power2.out',
          borderColor: '#ef4444',
          overwrite: 'auto'
        });
      } else {
        // Fallback without GSAP
        el.style.borderColor = '#ef4444';
      }
      el.focus();
    } catch (error) {
      console.warn('[Shake Field] Error:', error);
      el.focus();
    }
  }

  /* WHATSAPP FAB */
  function setupWaFab() {
    const fab = document.getElementById('waFab');
    if (!fab) {
      console.warn('[WhaatsApp FAB] Element not found');
      return;
    }

    // Reveal FAB after delay
    setTimeout(() => {
      try {
        fab.classList.add('visible');
        if (typeof gsap !== 'undefined') {
          gsap.from(fab, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: 'back.out(1.7)',
            overwrite: 'auto'
          });
        }
      } catch (error) {
        console.warn('[WhatsApp FAB] Animation error:', error);
        // Fallback: just show it
        fab.style.opacity = '1';
        fab.style.transform = 'scale(1)';
      }
    }, 2500);
  }

  /* EXTRA ANIMATIONS */
  function setupExtraAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    try {
      // Nav animations
      const navLogo = document.querySelector('.nav-logo');
      if (navLogo) {
        gsap.from(navLogo, {
          opacity: 0,
          x: -30,
          duration: 0.6,
          delay: 0.05,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }

      const navItems = document.querySelectorAll('.nav-links li');
      if (navItems.length) {
        gsap.from(navItems, {
          opacity: 0,
          y: -12,
          duration: 0.4,
          stagger: 0.06,
          delay: 0.2,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }

      // Grid animations - use a cleaner pattern
      const grids = [
        { selector: '.faculty-grid', cardSel: '.faculty-card', delay: 0.15 },
        { selector: '.achievers-grid', cardSel: '.achiever-card', delay: 0.1 },
        { selector: '.courses-grid', cardSel: '.course-card', delay: 0.12 },
        { selector: '.counters-grid', cardSel: '.counter-card', delay: 0.12 },
        { selector: '.trust-grid', cardSel: '.trust-card', delay: 0.1 }
      ];

      grids.forEach(({ selector, cardSel, delay }) => {
        const grid = document.querySelector(selector);
        if (grid) {
          ScrollTrigger.create({
            trigger: grid,
            start: 'top 85%',
            onEnter: () => {
              gsap.from(cardSel, {
                opacity: 0.6,
                y: 30,
                scale: 0.95,
                duration: 0.5,
                stagger: delay,
                ease: 'back.out(1.2)',
                overwrite: false,
                clearProps: 'transform,opacity,scale'
              });
            }
          });
        }
      });

      // Feature card icon scale
      const featureCards = document.querySelectorAll('.feature-card');
      featureCards.forEach(card => {
        const icon = card.querySelector('span');
        if (icon) {
          card.addEventListener('mouseenter', () => {
            gsap.to(icon, {
              scale: 1.25,
              duration: 0.25,
              ease: 'back.out(2)',
              overwrite: 'auto'
            });
          });
          card.addEventListener('mouseleave', () => {
            gsap.to(icon, {
              scale: 1,
              duration: 0.2,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          });
        }
      });

      // Continuous shape rotation
      const shape1 = document.querySelector('.shape-1');
      if (shape1) {
        gsap.to(shape1, {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: 'none'
        });
      }

      // Footer animation
      const footer = document.querySelector('.footer');
      if (footer) {
        ScrollTrigger.create({
          trigger: footer,
          start: 'top 90%',
          onEnter: () => {
            gsap.from('.footer-grid > *', {
              opacity: 0.7,
              y: 20,
              duration: 0.5,
              stagger: 0.1,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        });
      }

      // About meta grid animation
      const metaGrid = document.querySelector('.about-meta-grid');
      if (metaGrid) {
        ScrollTrigger.create({
          trigger: metaGrid,
          start: 'top 88%',
          onEnter: () => {
            gsap.from('.meta-item', {
              opacity: 0.7,
              x: -20,
              duration: 0.4,
              stagger: 0.08,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        });
      }

      console.log('[Extra Animations] Setup complete');
    } catch (error) {
      console.warn('[Extra Animations] Error during setup:', error);
    }
  }