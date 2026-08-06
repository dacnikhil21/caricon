/* Caircon Enterprises V2 — GSAP 3, Letter-by-Letter Animation & Motion Controller */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Initialize Fluid Lenis Scroll Engine
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 0.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 2.0,
      smoothTouch: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // 2. Letter-by-Letter Typewriter Entrance Animation for Hero Title
  const titleLines = document.querySelectorAll('.hero-main-title .title-line');
  if (titleLines.length > 0 && typeof gsap !== 'undefined') {
    titleLines.forEach(line => {
      const rawText = line.textContent.trim();
      line.innerHTML = rawText.split('').map(char => {
        if (char === ' ') return '&nbsp;';
        return `<span class="char">${char}</span>`;
      }).join('');
    });

    gsap.from('.hero-main-title .char', {
      opacity: 0,
      y: 18,
      stagger: 0.035,
      duration: 0.45,
      ease: 'power2.out',
      delay: 0.3
    });
  }

  // 3. Register GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0, 0);
    }

    // GSAP Subtitle & Buttons Reveal Timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
    heroTl
      .from('.hero-content-wrapper .editorial-section-label', { opacity: 0, y: -15, delay: 0.1 })
      .from('.hero-sub-para', { opacity: 0, y: 18 }, '+=0.6')
      .from('.hero-btn-group', { opacity: 0, y: 15 }, '-=0.4')
      .from('.hero-trust-grid .trust-item', { opacity: 0, y: 12, stagger: 0.08 }, '-=0.3');

    // Process Timeline Scroll-Linked Fill Progress
    const timelineContainer = document.querySelector('.process-timeline');
    const progressBar = document.querySelector('.timeline-progress-bar');
    const timelineItems = document.querySelectorAll('.timeline-step-item');

    if (timelineContainer && progressBar) {
      gsap.to(progressBar, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: timelineContainer,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 0.3
        }
      });
    }

    timelineItems.forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 75%',
        onEnter: () => item.classList.add('active'),
        onLeaveBack: () => item.classList.remove('active')
      });
    });
  }

  // 4. Throttled Floating Navbar Scroll Handler
  const floatingNav = document.getElementById('floating-nav');
  let ticking = false;

  if (floatingNav) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 30) {
            floatingNav.classList.add('scrolled');
          } else {
            floatingNav.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // 5. Swiper.js Carousels
  if (typeof Swiper !== 'undefined') {
    const industriesSwiper = new Swiper('.industries-swiper', {
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      watchSlidesProgress: true,
      observer: true,
      observeParents: true,
      speed: 700,
      grabCursor: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24
        }
      }
    });

    const standardsSwiper = new Swiper('.standards-swiper', {
      slidesPerView: 'auto',
      spaceBetween: 20,
      loop: true,
      freeMode: true,
      freeModeMomentum: false,
      speed: 4000,
      allowTouchMove: true,
      grabCursor: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      breakpoints: {
        0: {
          spaceBetween: 12
        },
        768: {
          spaceBetween: 20
        }
      }
    });
  }

  // 6. Morphing SVG Hamburger & Staggered Drawer Controls
  const mobileHamburgerBtn = document.getElementById('mobile-hamburger-btn');
  const mobileNavSheet = document.getElementById('mobile-nav-sheet');
  const closeMobileNavBtn = document.getElementById('close-mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(open) {
    if (!mobileNavSheet) return;
    if (open) {
      mobileNavSheet.classList.add('active');
      if (mobileHamburgerBtn) mobileHamburgerBtn.classList.add('active');
      document.body.style.overflow = 'hidden';

      mobileNavLinks.forEach((link, idx) => {
        link.style.animationDelay = `${0.08 + idx * 0.04}s`;
      });
    } else {
      mobileNavSheet.classList.remove('active');
      if (mobileHamburgerBtn) mobileHamburgerBtn.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileHamburgerBtn) {
    mobileHamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileNavSheet.classList.contains('active');
      toggleMobileMenu(!isOpen);
    });
  }

  if (closeMobileNavBtn) {
    closeMobileNavBtn.addEventListener('click', () => toggleMobileMenu(false));
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // 7. Modal Controls
  const modalBackdrop = document.getElementById('consultation-modal');
  const openBtns = document.querySelectorAll('.open-modal-btn');
  const closeBtns = document.querySelectorAll('.close-modal-btn');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modalBackdrop) {
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modalBackdrop) {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 8. Technical FAQ Accordions
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-accordion-item').forEach(i => {
        i.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 9. Metric Counter Observer
  const counters = document.querySelectorAll('.counter-anim');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseFloat(counter.getAttribute('data-target'));
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const step = Math.max(1, target / 30);

          const timer = setInterval(() => {
            count += step;
            if (count >= target) {
              counter.innerText = prefix + target + suffix;
              clearInterval(timer);
            } else {
              counter.innerText = prefix + Math.floor(count) + suffix;
            }
          }, 40);

          obs.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  // 10. Proposal Inquiry Form Handler
  const inquiryForm = document.getElementById('spec-inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = inquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Transmitting Request...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = '✓ Proposal Request Transmitted';
        submitBtn.style.backgroundColor = 'var(--color-secondary)';
        submitBtn.style.borderColor = 'var(--color-secondary)';

        setTimeout(() => {
          if (modalBackdrop) modalBackdrop.classList.remove('active');
          document.body.style.overflow = '';
          inquiryForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
          submitBtn.style.borderColor = '';
        }, 1800);
      }, 900);
    });
  }
});
