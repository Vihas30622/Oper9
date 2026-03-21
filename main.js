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
    const originalCards = Array.from(marquee.children);
    // Clone 30 times guaranteeing an un-hittable edge for massive momentum flicks
    for (let i = 0; i < 30; i++) {
      originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        marquee.appendChild(clone);
      });
    }

    let isScrolling = true;
    let interactionTimeout;
    let lastScrollLeft = 0;
    
    // Exact visual synchronization measurement
    let setWidth = 0;
    setTimeout(() => {
      const allCards = marquee.querySelectorAll('.visionary-card');
      if (allCards.length > 5) {
        setWidth = allCards[5].offsetLeft - allCards[0].offsetLeft;
        marquee.scrollLeft = setWidth * 15; // Set precisely in the middle!
        lastScrollLeft = marquee.scrollLeft;
      }
    }, 500);

    // ANY physical movement (touch, mouse, wheel, MOMENTUM physics) fires the 'scroll' event.
    // By exclusively debouncing this, we NEVER kill a native momentum swipe mid-flight!
    marquee.addEventListener('scroll', () => {
      // Causality Check: Did our internal autoScroll engine trigger this?
      if (Math.abs(marquee.scrollLeft - lastScrollLeft) <= 1) {
        return; // Ignore engine-driven scrolls
      }
      
      // If we reach here, it's a real user swipe or momentum coasting!
      isScrolling = false;
      clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        isScrolling = true;
      }, 3000); // Resume after 3 seconds of inactivity
    }, {passive: true});

    // We also listen to explicit user grabs so it doesn't squirm while they hold it still
    const pauseFunc = () => { 
      isScrolling = false; 
      clearTimeout(interactionTimeout); 
    };
    const resumeFunc = () => {
      clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        isScrolling = true;
      }, 3000);
    };

    marquee.addEventListener('touchstart', pauseFunc, {passive: true});
    marquee.addEventListener('mousedown', pauseFunc);
    marquee.addEventListener('touchend', resumeFunc, {passive: true});
    marquee.addEventListener('mouseup', resumeFunc);
    
    let autoScrollSpeed = 0.5; // Gentler cinematic speed (reduced from devicePixelRatio scaling)

    function autoScroll() {
      // ONLY manipulate scroll physics natively if NO momentum is active
      if (isScrolling && setWidth > 0) {
        marquee.scrollLeft += autoScrollSpeed;
        lastScrollLeft = marquee.scrollLeft; // Sync causality tracker

        // If they drift extremely far, secretly jump them back by PERFECT visual exact blocks
        // We only do this when momentum is entirely dead so we never cause an abrupt halt.
        if (marquee.scrollLeft > setWidth * 25) {
          marquee.scrollLeft -= (setWidth * 10); 
          lastScrollLeft = marquee.scrollLeft;
        }
        else if (marquee.scrollLeft < setWidth * 5) {
          marquee.scrollLeft += (setWidth * 10); 
          lastScrollLeft = marquee.scrollLeft;
        }
      }
      requestAnimationFrame(autoScroll);
    }
    
    requestAnimationFrame(autoScroll);
  }
});
