(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-28% 0px -62% 0px' });
    sections.forEach(section => navObserver.observe(section));
  }

  if (reduceMotion) return;

  const motionSelector = [
    '.hero-copy > *', '.hero-portrait-wrap', '.section-top', '.about-grid', '.fact-strip',
    '.approach-heading', '.principle-grid', '.section-intro', '.discipline-grid',
    '.skills-panel', '.journey-layout', '.cycling-story', '.work-heading',
    '.featured-project', '.project-grid', '.video-heading', '.video-grid',
    '.drone-layout', '.channel-layout', '.outside-inner', '.contact-layout'
  ].join(',');

  let motionObserver = null;
  if ('IntersectionObserver' in window) {
    motionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-visible');
        motionObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
  }

  const prepareMotion = root => {
    const targets = [];
    if (root.nodeType === 1 && root.matches?.(motionSelector)) targets.push(root);
    root.querySelectorAll?.(motionSelector).forEach(node => targets.push(node));
    targets.forEach((node, index) => {
      if (node.dataset.motionReady === 'true') return;
      node.dataset.motionReady = 'true';
      node.classList.add('motion-item');
      if (node.closest('.hero-copy')) node.style.setProperty('--motion-delay', Math.min(index * 65, 260) + 'ms');
      if (motionObserver) motionObserver.observe(node);
      else node.classList.add('motion-visible');
    });
  };

  document.body.classList.add('motion-ready');
  prepareMotion(document);

  if ('MutationObserver' in window) {
    const cmsObserver = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === 1) prepareMotion(node);
      }));
    });
    cmsObserver.observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    });
  });
})();
