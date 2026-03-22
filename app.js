/* ============================================
   OPER9 — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll-activated header shadow ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update scrolled class for shadow
      header.classList.toggle('scrolled', currentScrollY > 12);

      // Hide/Show logic based on direction
      // We only hide if we scroll down and passed a threshold (e.g., 80px)
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        header.classList.add('nav-hidden');
      } else {
        header.classList.remove('nav-hidden');
      }
      
      lastScrollY = currentScrollY;
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

  /* ---------- Form Submit Feedback (Full Screen) ---------- */
  const contactForm = document.querySelector('#contact-form');
  const formContainer = document.querySelector('#contact-form-container');
  const successScreen = document.querySelector('#contact-success');
  const resetBtn = document.querySelector('#reset-form');

  if (contactForm && formContainer && successScreen) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      
      const btn = contactForm.querySelector('button[type="submit"]');
      const btnText = btn.querySelector('.button-text');
      const originalBtnText = btnText.textContent;
      const errorEl = document.querySelector('#form-error');
      
      // Hide any previous error
      if (errorEl) errorEl.style.display = 'none';

      // Check browser-level validation
      if (!contactForm.reportValidity()) return;
      
      // 1. Loading State
      btn.disabled = true;
      btnText.textContent = 'Sending...';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          // 2. Hide form, show success
          formContainer.style.display = 'none';
          successScreen.style.display = 'flex';
          
          const card = contactForm.closest('.form-card');
          if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          contactForm.reset();
        } else {
          throw new Error();
        }
      } catch (err) {
        // ERROR: Restore button and show inline feedback
        btn.disabled = false;
        btnText.textContent = originalBtnText;
        if (errorEl) {
          errorEl.textContent = 'Submission failed. Please check your connection and try again.';
          errorEl.style.display = 'block';
        }
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        // Reset
        successScreen.style.display = 'none';
        formContainer.style.display = 'block';
        if (errorEl) errorEl.style.display = 'none';
        contactForm.reset();
      });
    }
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

  /* ---------- Buttery Smooth Transform Marquee ---------- */
  const marquee = document.getElementById('visionary-marquee');
  const track = document.getElementById('marquee-track');
  
  if (marquee && track) {
    // 1. Build a massive track via JS
    const originalCards = Array.from(track.children);
    for (let i = 0; i < 30; i++) {
      originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }

    let isAutoScrolling = true;
    let isDragging = false;
    let startX = 0;
    let startTranslate = 0;
    let currentTranslate = 0;
    let autoScrollSpeed = 0.15;
    let setWidth = 0;
    let resumeTimeout;

    // Measure and Initialize
    setTimeout(() => {
      const allCards = track.querySelectorAll('.visionary-card');
      if (allCards.length > 5) {
        setWidth = allCards[5].offsetLeft - allCards[0].offsetLeft;
        currentTranslate = -setWidth * 12; // Start in the middle of our massive track
        track.style.transform = `translateX(${currentTranslate}px)`;
      }
    }, 500);

    // Interaction Handlers
    const startDrag = (e) => {
      isDragging = true;
      isAutoScrolling = false;
      clearTimeout(resumeTimeout);
      startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      startTranslate = currentTranslate;
    };

    const moveDrag = (e) => {
      if (!isDragging) return;
      const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const delta = x - startX;
      currentTranslate = startTranslate + delta;
      
      // Boundary check during drag
      if (setWidth > 0) {
        if (currentTranslate < -setWidth * 25) currentTranslate += (setWidth * 10);
        if (currentTranslate > -setWidth * 5) currentTranslate -= (setWidth * 10);
      }
      
      track.style.transform = `translateX(${currentTranslate}px)`;
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      // Start 3s resume timer
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        isAutoScrolling = true;
      }, 3000);
    };

    marquee.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);

    marquee.addEventListener('touchstart', startDrag, {passive: true});
    window.addEventListener('touchmove', moveDrag, {passive: false});
    window.addEventListener('touchend', endDrag);

    // Motor
    function animate() {
      if (isAutoScrolling && !isDragging && setWidth > 0) {
        currentTranslate -= autoScrollSpeed;
        
        // Endless loop logic
        if (currentTranslate < -setWidth * 25) {
          currentTranslate += (setWidth * 10);
        }
        
        track.style.transform = `translateX(${currentTranslate}px)`;
      }
      requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
  }

  /* ---------- Mobile Hover-Then-Redirect Logic ---------- */
  const isMobile = () => window.innerWidth <= 768;
  
  document.addEventListener('click', (e) => {
    // Only intercept on mobile
    if (!isMobile()) return;

    // Find the nearest link that needs this behavior
    const link = e.target.closest('a');
    if (!link) return;

    // Target specific interactive components that have distinct hover states
    const targetSelectors = ['.btn', '.animated-cta', '.service-card', '.module-card', '.card', '.why-card', '.card-glow-wrapper'];
    const needsAnimation = targetSelectors.some(sel => link.matches(sel) || link.closest(sel));

    if (needsAnimation && !link.dataset.animating) {
      e.preventDefault();
      
      // Mark as animating to prevent recursive loops
      link.dataset.animating = "true";
      
      // Add the play-hover class to the link itself or its nearest visual parent
      const visualTarget = link.closest('.card-glow-wrapper, .card, .service-card, .module-card, .why-card, .btn, .animated-cta') || link;
      visualTarget.classList.add('play-hover');

      // Wait for the animation (longest is 0.45s, so 500ms is safe)
      setTimeout(() => {
        window.location.href = link.href;
      }, 500);
    }
  });

});
