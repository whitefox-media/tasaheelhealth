// ------------------ Utilities ------------------
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

// ------------------ Sticky Year ------------------
$('#year').textContent = new Date().getFullYear();

// ------------------ Mobile Navigation ------------------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
});


// ------------------ Scroll Spy ------------------
const sections = $$('section[id]');
const navAnchors = $$('.nav-links a');

const onScrollSpy = () => {
  let currentId = '';
  const fromTop = window.scrollY + 100;

  for (const sec of sections) {
    if (fromTop >= sec.offsetTop && fromTop < sec.offsetTop + sec.offsetHeight) {
      currentId = sec.id;
      break;
    }
  }

  navAnchors.forEach(a => {
    a.classList.toggle('is-current', a.getAttribute('href') === `#${currentId}`);
  });
};

window.addEventListener('scroll', onScrollSpy);
onScrollSpy();

// ------------------ Hero Background Carousel ------------------
const heroBg = $('.hero-background');
const heroImages = [
  'images/Home1.jpg',
  'images/Home2.jpg',
  'images/Home3.jpg',
  'images/Home4.jpg'
];
let heroIndex = 0;
let heroTimer;

function preload(srcs) {
  srcs.forEach(src => { const img = new Image(); img.src = src; });
}

function setHeroBackground(idx) {
  if (!heroBg) return;
  heroBg.style.opacity = 0;
  setTimeout(() => {
    heroBg.style.backgroundImage = `url(${heroImages[idx]})`;
    heroBg.style.opacity = 1;
  }, 400);
}

function startHeroCarousel() {
  if (!heroBg) return;
  setHeroBackground(heroIndex);
  heroTimer = setInterval(() => {
    heroIndex = (heroIndex + 1) % heroImages.length;
    setHeroBackground(heroIndex);
  }, 5000);
}

function stopHeroCarousel() {
  clearInterval(heroTimer);
}

preload(heroImages);
startHeroCarousel();

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopHeroCarousel();
  else startHeroCarousel();
});

// ------------------ FAQ Accordion ------------------
$$('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.closest('.faq-item');
    const isOpen = parent.classList.contains('open');

    // Close all
    $$('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      parent.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ------------------ Contact Form Validation ------------------
const form = $('.contact-form');
const note = $('.form-note');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  if (!data.name || !data.email || !data.topic || !data.message) {
    note.textContent = 'Please fill in all required fields.';
    note.style.color = '#d9534f';
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(data.email)) {
    note.textContent = 'Please enter a valid email address.';
    note.style.color = '#d9534f';
    return;
  }

  if (data.phone && !/^\d{7,15}$/.test(data.phone.replace(/\D/g,''))) {
    note.textContent = 'Please enter a valid phone number.';
    note.style.color = '#d9534f';
    return;
  }

  note.textContent = 'Thanks! Your message has been sent. We will contact you shortly.';
  note.style.color = 'var(--brand)';
  form.reset();
});

// ------------------ Back to Top ------------------
const toTop = $('.back-to-top');

const toggleBackToTop = () => {
  if (window.scrollY > 600) toTop.classList.add('show');
  else toTop.classList.remove('show');
};

window.addEventListener('scroll', toggleBackToTop);

toTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ------------------ Reveal on Scroll ------------------
const revealEls = $$('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -10% 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ------------------ Testimonials Carousel ------------------
const testiTrack = $('.testi-track');
const testiCards = $$('.testi-track .card');
const testiPrev = $('.testi-btn.prev');
const testiNext = $('.testi-btn.next');
const testiDotsContainer = $('.testi-dots');

let testiIndex = 0;
let testiAutoPlay;

// Create dots
testiCards.forEach((_, i) => {
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => {
    testiIndex = i;
    updateTestiCarousel();
    resetTestiAutoPlay();
  });
  testiDotsContainer.appendChild(dot);
});

const testiDots = testiDotsContainer.querySelectorAll('button');

function updateTestiCarousel() {
  testiTrack.style.transform = `translateX(-${testiIndex * 100}%)`;
  testiDots.forEach((dot, i) => dot.classList.toggle('active', i === testiIndex));
}

testiNext.addEventListener('click', () => {
  testiIndex = (testiIndex + 1) % testiCards.length;
  updateTestiCarousel();
  resetTestiAutoPlay();
});
testiPrev.addEventListener('click', () => {
  testiIndex = (testiIndex - 1 + testiCards.length) % testiCards.length;
  updateTestiCarousel();
  resetTestiAutoPlay();
});

function startTestiAutoPlay() {
  testiAutoPlay = setInterval(() => {
    testiIndex = (testiIndex + 1) % testiCards.length;
    updateTestiCarousel();
  }, 5000);
}
function stopTestiAutoPlay() {
  clearInterval(testiAutoPlay);
}
function resetTestiAutoPlay() {
  stopTestiAutoPlay();
  startTestiAutoPlay();
}
startTestiAutoPlay();

// Pause on hover
const testiContainer = $('.testi-carousel-container');
testiContainer?.addEventListener('mouseenter', stopTestiAutoPlay);
testiContainer?.addEventListener('mouseleave', startTestiAutoPlay);

// ------------------ About Carousel ------------------
const aboutTrack = $('.about-track');
const aboutImgs = $$('.about-track img');
const aboutPrev = $('.about-btn.prev');
const aboutNext = $('.about-btn.next');
const aboutDotsContainer = $('.about-dots');

let aboutIndex = 0;

// Create dots
aboutImgs.forEach((_, i) => {
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => {
    aboutIndex = i;
    updateAboutCarousel();
  });
  aboutDotsContainer.appendChild(dot);
});

const aboutDots = aboutDotsContainer.querySelectorAll('button');

function updateAboutCarousel() {
  aboutTrack.style.transform = `translateX(-${aboutIndex * 100}%)`;
  aboutDots.forEach((dot, i) => dot.classList.toggle('active', i === aboutIndex));
}

aboutNext.addEventListener('click', () => {
  aboutIndex = (aboutIndex + 1) % aboutImgs.length;
  updateAboutCarousel();
});
aboutPrev.addEventListener('click', () => {
  aboutIndex = (aboutIndex - 1 + aboutImgs.length) % aboutImgs.length;
  updateAboutCarousel();
});
