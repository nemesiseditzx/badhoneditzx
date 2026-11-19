(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const menu = $('#mainNav'), menuToggle = $('#menuToggle'), langSwitch = $('#langSwitch');
  let language = 'en';
  function setLanguage(next) {
    language = next;
    document.documentElement.lang = next === 'bn' ? 'bn' : 'en';
    document.body.classList.toggle('bn', next === 'bn');
    $$('[data-en][data-bn]').forEach(el => { const value = el.dataset[next]; if (value !== undefined) el.innerHTML = value; });
    langSwitch.textContent = next === 'en' ? 'বাংলা' : 'English';
    langSwitch.setAttribute('aria-label', next === 'en' ? 'Switch to Bangla' : 'Switch to English');
  }
  langSwitch.addEventListener('click', () => setLanguage(language === 'en' ? 'bn' : 'en'));
  menuToggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  $$('.main-nav a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false');
  }));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: .13, rootMargin: '0px 0px -35px 0px' });
    $$('.reveal').forEach((el, index) => {
      if (!reduceMotion && index % 3 === 1) el.style.transitionDelay = '.10s';
      if (!reduceMotion && index % 3 === 2) el.style.transitionDelay = '.18s';
      revealObserver.observe(el);
    });
  } else { $$('.reveal').forEach(el => el.classList.add('visible')); }
  const progress = $('#scrollProgress');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true }); updateProgress();
  $('#yearNow').textContent = new Date().getFullYear();
  const hero = $('.hero'), art = $('.hero-image-frame');
  if (hero && art && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', event => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      art.style.transform = `translate3d(${x * 10}px,${y * 10}px,0) rotate(${2 + x * 2}deg)`;
    });
    hero.addEventListener('pointerleave', () => { art.style.transform = ''; });
  }
  async function loadChannelStats() {
    const endpoint = window.BADHON_STATS_ENDPOINT, status = $('#statsStatus');
    if (!endpoint) return;
    try {
      const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Stats endpoint returned ${response.status}`);
      const data = await response.json();
      if (data.subscriberCount != null) $('#subscriberCount').textContent = Number(data.subscriberCount).toLocaleString();
      if (data.viewCount != null) $('#viewCount').textContent = Number(data.viewCount).toLocaleString();
      if (data.videoCount != null) $('#videoCount').textContent = Number(data.videoCount).toLocaleString();
      status.innerHTML = '<span class="status-dot"></span><span>Updated from YouTube API · cached response</span>';
    } catch (error) {
      console.warn('Could not load YouTube channel statistics:', error);
      status.innerHTML = '<span class="status-dot"></span><span>Live statistics unavailable · showing last provided subscriber count</span>';
    }
  }
  loadChannelStats();
})();