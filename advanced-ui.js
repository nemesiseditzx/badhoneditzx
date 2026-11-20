(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const header = document.querySelector('.site-header');
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sections.forEach(section => navObserver.observe(section));
  }

  const cardSelector = '.interest-card,.cms-project-card,.skill-chip';
  const attachCards = root => {
    const cards = root.matches?.(cardSelector) ? [root] : [...(root.querySelectorAll?.(cardSelector) || [])];
    cards.forEach(card => {
      if (card.dataset.motionReady === 'true') return;
      card.dataset.motionReady = 'true';
      card.setAttribute('data-tilt-card', '');
      if (!finePointer || reduceMotion) return;
      let frame = 0;
      let latest = null;
      card.addEventListener('pointermove', event => {
        latest = event;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (!latest) return;
          const rect = card.getBoundingClientRect();
          const x = (latest.clientX - rect.left) / rect.width - .5;
          const y = (latest.clientY - rect.top) / rect.height - .5;
          card.style.setProperty('--tilt-x', (x * 2.4).toFixed(2) + 'deg');
          card.style.setProperty('--tilt-y', (-y * 2.4).toFixed(2) + 'deg');
          card.style.setProperty('--mx', (latest.clientX - rect.left) + 'px');
          card.style.setProperty('--my', (latest.clientY - rect.top) + 'px');
        });
      }, { passive: true });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      }, { passive: true });
    });
  };
  attachCards(document);

  if ('MutationObserver' in window) {
    const cardObserver = new MutationObserver(records => records.forEach(record =>
      record.addedNodes.forEach(node => { if (node.nodeType === 1) attachCards(node); })
    ));
    ['#projectsGrid', '#videoGrid', '#skillsGrid'].forEach(selector => {
      const host = document.querySelector(selector);
      if (host) cardObserver.observe(host, { childList: true, subtree: true });
    });
  }

  const revealTargets = [...document.querySelectorAll('.reveal:not(.visible)')];
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }), { threshold: .08, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('visible'));
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    });
  });
})();