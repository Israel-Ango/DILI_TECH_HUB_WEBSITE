/* ============================================================
   DILI TECH HUB — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Theme ── */
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('dth-theme') || 'dark';
  setTheme(savedTheme);

  function setTheme(t) {
    root.setAttribute('data-theme', t);
    themeIcon.textContent = t === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('dth-theme', t);
  }

  themeBtn.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ── Loader ── */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1800);
  });

  /* ── Navbar scroll ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  /* ── Mobile menu ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ── Scroll to top ── */
  document.getElementById('scrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Particles ── */
  const particleContainer = document.getElementById('particles');
  const colors = ['rgba(16,185,129,.4)', 'rgba(245,158,11,.3)', 'rgba(255,255,255,.15)', 'rgba(16,185,129,.2)'];

  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 2;
    const delay = Math.random() * 12;
    const duration = Math.random() * 15 + 10;
    const left = Math.random() * 100;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${duration}s;
      animation-delay:${delay}s;
    `;
    particleContainer.appendChild(p);
  }

  /* ── Animated counters ── */
  function animateCounter(el, target, suffix = '', duration = 2000) {
    const start = performance.now();
    const startVal = 0;
    const step = ts => {
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(ease * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ── Intersection Observer ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');
  const counterEls = document.querySelectorAll('[data-count]');
  const progressEls = document.querySelectorAll('[data-progress]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.count);
        const suffix = e.target.dataset.suffix || '';
        animateCounter(e.target, target, suffix);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.progress + '%';
        progressObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  progressEls.forEach(el => progressObserver.observe(el));

  /* ── Hero stat counters ── */
  const heroStats = document.querySelectorAll('[data-hero-count]');
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.heroCount);
        const suffix = e.target.dataset.suffix || '';
        animateCounter(e.target, target, suffix);
        heroObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  heroStats.forEach(el => heroObserver.observe(el));

  /* ── Projects filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp .5s ease both';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ── Testimonials carousel ── */
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let autoplay;

  function getVisibleCount() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 600) return 2;
    return 1;
  }

  function goToSlide(n) {
    const cards = track.querySelectorAll('.testimonial-card');
    const visible = getVisibleCount();
    const maxSlide = Math.max(0, cards.length - visible);
    currentSlide = Math.max(0, Math.min(n, maxSlide));
    const cardWidth = cards[0]?.offsetWidth || 0;
    const gap = 28;
    track.style.transform = `translateX(-${currentSlide * (cardWidth + gap)}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  document.getElementById('carouselPrev')?.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoplay(); });
  document.getElementById('carouselNext')?.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoplay(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); resetAutoplay(); }));

  function startAutoplay() { autoplay = setInterval(() => { const cards = track.querySelectorAll('.testimonial-card'); const visible = getVisibleCount(); const max = Math.max(0, cards.length - visible); goToSlide(currentSlide >= max ? 0 : currentSlide + 1); }, 5000); }
  function resetAutoplay() { clearInterval(autoplay); startAutoplay(); }
  startAutoplay();

  window.addEventListener('resize', () => goToSlide(0));

  /* ── Contact form ── */
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit .btn');
    const success = document.getElementById('formSuccess');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      form.reset();
      success.style.display = 'block';
      setTimeout(() => success.style.display = 'none', 4000);
    }, 1500);
  });

  /* ── Newsletter form ── */
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('button');
    btn.textContent = '✓ Subscribed!';
    btn.style.background = 'var(--emerald-dark)';
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
      newsletterForm.reset();
    }, 3000);
  });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${section.id}`) {
            link.style.color = 'var(--emerald)';
          }
        });
      }
    });
  }, { passive: true });

});
