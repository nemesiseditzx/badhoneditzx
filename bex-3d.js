(() => {
'use strict';
const intro=document.getElementById('bexIntro');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(intro){
 document.body.classList.add('bex-intro-active');
 let closed=false;
 const close=()=>{if(closed)return;closed=true;intro.classList.add('is-leaving');document.body.classList.remove('bex-intro-active');window.setTimeout(()=>intro.remove(),850);};
 window.setTimeout(close,reduceMotion?250:1900);
 window.addEventListener('pageshow',()=>window.setTimeout(close,2400),{once:true});
}
// Reveal meaningful content in a single observer; no layout polling or scroll handler.
const revealTargets=document.querySelectorAll('.section-top,.section-intro,.about-grid,.approach-heading,.principle-card,.discipline-card,.skills-panel,.motion-lab-heading,.motion-card,.journey-heading,.timeline,.timeline-item,.cycling-story,.drone-visual,.drone-copy,.featured-project,.video-heading,.contact-layout');
if(reduceMotion||!('IntersectionObserver' in window)){
 revealTargets.forEach(el=>el.classList.add('pro-visible','motion-visible'));
}else{
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  entry.target.classList.add('pro-visible','motion-visible');
  revealObserver.unobserve(entry.target);
 }),{rootMargin:'0px 0px -7% 0px',threshold:.08});
 revealTargets.forEach((el,index)=>{
  el.classList.add('pro-reveal');
  el.style.setProperty('--reveal-delay',(index%4)*65+'ms');
  revealObserver.observe(el);
 });
}
// Pointer-following card illumination is intentionally limited to fine pointers.
if(!reduceMotion&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
 document.addEventListener('pointermove',event=>{
  const card=event.target.closest('.motion-card,.cms-project-card,.video-card');
  if(!card)return;
  const rect=card.getBoundingClientRect();
  card.style.setProperty('--spot-x',(event.clientX-rect.left)+'px');
  card.style.setProperty('--spot-y',(event.clientY-rect.top)+'px');
 },{passive:true});
}
// Keep navigation context in sync with the section currently in view.
const navLinks=[...document.querySelectorAll('.main-nav a[href^="#"]')];
const sections=navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver' in window){
 const navObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   navLinks.forEach(link=>{
    if(link.getAttribute('href')==='#'+entry.target.id)link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
   });
  });
 },{rootMargin:'-28% 0px -62% 0px',threshold:0});
 sections.forEach(section=>navObserver.observe(section));
}
// Compact the sticky header after the opening viewport without extra scroll work.
const header=document.querySelector('.site-header');
if(header&&'IntersectionObserver'in window){
 const sentinel=document.createElement('span');
 sentinel.setAttribute('aria-hidden','true');
 sentinel.style.cssText='position:absolute;top:100px;left:0;width:1px;height:1px;pointer-events:none';
 document.body.prepend(sentinel);
 const headerObserver=new IntersectionObserver(([entry])=>header.classList.toggle('is-scrolled',!entry.isIntersecting));
 headerObserver.observe(sentinel);
}
})();