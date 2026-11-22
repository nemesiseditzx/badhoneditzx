(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const links = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-28% 0px -62% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  const cardSelector = '.principle-card,.discipline-card,.cms-project-card,.skill-chip,.video-card';
  const attachPointer = root => {
    const cards = [];
    if (root.nodeType === 1 && root.matches?.(cardSelector)) cards.push(root);
    root.querySelectorAll?.(cardSelector).forEach(card => cards.push(card));
    cards.forEach(card => {
      if (card.dataset.pointerReady === 'true') return;
      card.dataset.pointerReady = 'true';
      if (!finePointer || reducedMotion) return;
      let frame = 0;
      let x = 0;
      let y = 0;
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          card.style.setProperty('--pointer-x', x + 'px');
          card.style.setProperty('--pointer-y', y + 'px');
        });
      }, { passive: true });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--pointer-x', '50%');
        card.style.setProperty('--pointer-y', '50%');
      }, { passive: true });
    });
  };

  attachPointer(document);
  if ('MutationObserver' in window) {
    const contentObserver = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === 1) attachPointer(node);
      }));
    });
    contentObserver.observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    });
  });
})();
