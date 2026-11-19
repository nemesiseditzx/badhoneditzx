(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const menu = $('#mainNav');
  const menuToggle = $('#menuToggle');
  const langSwitch = $('#langSwitch');
  let language = 'en';

  function setLanguage(next) {
    language = next;
    document.documentElement.lang = next === 'bn' ? 'bn' : 'en';
    document.body.classList.toggle('bn', next === 'bn');
    $$('[data-en][data-bn]').forEach(el => {
      const value = el.dataset[next];
      if (value !== undefined) el.innerHTML = value;
    });
    langSwitch.textContent = next === 'en' ? 'বাংলা' : 'English';
    langSwitch.setAttribute('aria-label', next === 'en' ? 'Switch to Bangla' : 'Switch to English');
  }
  langSwitch.addEventListener('click', () => setLanguage(language === 'en' ? 'bn' : 'en'));

  menuToggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  $$('.main-nav a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  const progress = $('#scrollProgress');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
  $('#yearNow').textContent = new Date().getFullYear();

  // Optional Cloudflare Worker endpoint. Set window.BADHON_STATS_ENDPOINT to your deployed Worker URL.
  // The public site never contains the YouTube API key.
  async function loadChannelStats() {
    const endpoint = window.BADHON_STATS_ENDPOINT;
    const status = $('#statsStatus');
    if (!endpoint) return;
    try {
      const response = await fetch(endpoint, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Stats endpoint returned ${response.status}`);
      const data = await response.json();
      if (data.subscriberCount != null) $('#subscriberCount').textContent = Number(data.subscriberCount).toLocaleString();
      if (data.viewCount != null) $('#viewCount').textContent = Number(data.viewCount).toLocaleString();
      if (data.videoCount != null) $('#videoCount').textContent = Number(data.videoCount).toLocaleString();
      status.innerHTML = '<span class="status-dot" style="background:#5ef0bd;box-shadow:0 0 10px #5ef0bd"></span><span>Updated from YouTube API · cached response</span>';
    } catch (error) {
      console.warn('Could not load YouTube channel statistics:', error);
      status.innerHTML = '<span class="status-dot"></span><span>Live statistics unavailable · showing last provided subscriber count</span>';
    }
  }
  loadChannelStats();
})();
