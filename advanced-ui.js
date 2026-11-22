(() => {
  'use strict';
  const header=document.querySelector('.site-header');
  const nav=document.querySelector('.main-nav');
  const links=[...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const update=()=>header?.classList.toggle('is-scrolled',scrollY>12);
  update();addEventListener('scroll',update,{passive:true});
  const toggle=document.querySelector('#menuToggle');
  toggle?.addEventListener('click',()=>{const open=nav?.classList.contains('open');toggle.setAttribute('aria-expanded',String(!!open));});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');}));
  if('IntersectionObserver'in window&&sections.length){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;links.forEach(a=>a.getAttribute('href')==='#'+entry.target.id?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));}),{rootMargin:'-30% 0px -60% 0px'});sections.forEach(s=>observer.observe(s));}
})();
