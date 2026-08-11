(() => {
  'use strict';

  document.documentElement.classList.add('has-js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const automaticRevealSelector = [
    '.section > .a-section-label',
    '.section > .h1-page',
    '.section > .intro',
    '.nature-item',
    '.pub-group-head',
    '.pub-item',
    '.course',
    '.mentor-card',
    '.award-row',
    '.patent-list > div',
    '.talk-row',
    '.media-row',
    '.reach-card'
  ].join(',');

  document.querySelectorAll(automaticRevealSelector).forEach((item) => item.classList.add('reveal'));
  const revealItems = [...document.querySelectorAll('.reveal')];

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px' });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
      revealObserver.observe(item);
    });
  }

  const counters = [...document.querySelectorAll('[data-count]')];
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const node = entry.target;
        const target = Number(node.dataset.count || 0);
        const suffix = node.dataset.suffix || '';
        const started = performance.now();
        const duration = 850;

        const tick = (time) => {
          const progress = Math.min((time - started) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = `${Math.round(target * eased)}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.unobserve(node);
      });
    }, { threshold: 0.7 });

    counters.forEach((counter) => countObserver.observe(counter));
  }

  const heroMap = document.querySelector('.hero-map');
  if (heroMap && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    const moveMap = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 12;
      const y = (event.clientY / window.innerHeight - 0.5) * 10;
      heroMap.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    window.addEventListener('pointermove', moveMap, { passive: true });
  }

  document.querySelectorAll('a[href^="#"], a[href*="index.html#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const nav = document.querySelector('.nav');
      if (nav) nav.classList.remove('is-open');
    });
  });
})();
