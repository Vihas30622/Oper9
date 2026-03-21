/* ============================================
   OPER9 — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll-activated header shadow ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile Menu ---------- */
  const menuBtn   = document.querySelector('#menu-btn');
  const menuClose = document.querySelector('#menu-close');
  const mobileMenu= document.querySelector('.mobile-menu');
  const overlay   = document.querySelector('.mobile-menu-overlay');

  const openMenu  = () => mobileMenu && mobileMenu.classList.add('open');
  const closeMenu = () => mobileMenu && mobileMenu.classList.remove('open');

  menuBtn  && menuBtn.addEventListener('click', openMenu);
  menuClose&& menuClose.addEventListener('click', closeMenu);
  overlay  && overlay.addEventListener('click', closeMenu);

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Active Nav Link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page]').forEach(link => {
    const page = link.getAttribute('data-page');
    if (page === currentPage || (currentPage === '' && page === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- Scroll Reveal (Intersection Observer) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Counter Animation ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          let current = 0;
          const step = target / 50;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current) + suffix;
            if (current >= target) clearInterval(timer);
          }, 30);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countObserver.observe(el));
  }

  /* ---------- Form Submit Feedback ---------- */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Sent!';
      btn.style.background = 'var(--secondary)';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Safe Spinning Glow Injection ---------- */
  document.querySelectorAll('.module-card, .service-card').forEach(card => {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-glow-wrapper';
    
    // Map vital visual grid attributes so layout flows perfectly
    if (card.classList.contains('bento-wide')) {
      wrapper.classList.add('bento-wide');
    }
    
    const computed = window.getComputedStyle(card);
    wrapper.style.gridColumn = computed.gridColumn;
    wrapper.style.gridRow = computed.gridRow;
    
    card.parentNode.insertBefore(wrapper, card);
    wrapper.appendChild(card);
  });

  /* ---------- Flawless Cinematic Auto-Scroller ---------- */
  const marquee = document.getElementById('visionary-marquee');
  if (marquee) {
    // 1. Clone the base elements cleanly through JS to build a massive robust track
    // We clone our 5 cards 25 times = 125 cards! This ensures extreme momentum scrolls never hit the edge.
    const originalCards = Array.from(marquee.children);
    for (let i = 0; i < 25; i++) {
      originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        marquee.appendChild(clone);
      });
    }

    let isScrolling = true;
    
    // Jump straight to the center of the massive buffer track!
    setTimeout(() => {
      marquee.scrollLeft = (marquee.scrollWidth / 2);
    }, 500);

    // Completely pause animation when they interact so we don't fight native momentum!
    // But NEVER pause on desktop pointer hover, only on active clicks/touches!
    marquee.addEventListener('touchstart', () => isScrolling = false, {passive: true});
    marquee.addEventListener('touchend', () => setTimeout(() => isScrolling = true, 1000));
    marquee.addEventListener('mousedown', () => isScrolling = false);
    marquee.addEventListener('mouseup', () => setTimeout(() => isScrolling = true, 1000));
    
    // Trackpad scroll safety
    let wheelTimeout;
    marquee.addEventListener('wheel', () => {
      isScrolling = false;
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => isScrolling = true, 800);
    }, {passive: true});

    let autoScrollSpeed = window.devicePixelRatio > 1 ? window.devicePixelRatio : 1; // ensure minimum 1 pixel scaling
    
    // Seamless gentle auto-scroll
    function autoScroll() {
      if (isScrolling) {
        // Fallback robust scroll left shift
        marquee.scrollLeft += autoScrollSpeed;

        // If they drift extremely far, secretly jump them back precisely to the center!
        // We only do this logic while isScrolling is TRUE (meaning native physics is inactive!)
        // This permanently guarantees a native smooth swipe experience
        if (marquee.scrollLeft >= marquee.scrollWidth * 0.8) {
          marquee.scrollLeft = marquee.scrollWidth * 0.3; // safe exact jump safely inside
        }
        else if (marquee.scrollLeft <= marquee.scrollWidth * 0.1) {
          marquee.scrollLeft = marquee.scrollWidth * 0.6; // safe exact jump securely inside
        }
      }
      requestAnimationFrame(autoScroll);
    }
    
    requestAnimationFrame(autoScroll);
  }
});
