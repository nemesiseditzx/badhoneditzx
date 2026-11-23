(() => {
'use strict';
const stylesheet=document.createElement('link');
stylesheet.rel='stylesheet';
stylesheet.href='fresh-rebuild.css?v=20261122-v1';
document.head.append(stylesheet);
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const intro=document.getElementById('bexIntro');
if(intro){document.body.classList.add('bex-intro-active');let closed=false;const close=()=>{if(closed)return;closed=true;intro.classList.add('is-leaving');document.body.classList.remove('bex-intro-active');window.setTimeout(()=>intro.remove(),700);};window.setTimeout(close,reduceMotion?120:1100);window.addEventListener('pageshow',()=>window.setTimeout(close,1400),{once:true});}
const revealTargets=document.querySelectorAll('.section-top,.section-intro,.about-grid,.approach-heading,.principle-card,.discipline-card,.skills-panel,.motion-lab-heading,.motion-card,.journey-heading,.timeline,.timeline-item,.cycling-story,.drone-visual,.drone-copy,.featured-project,.video-heading,.contact-layout,.channel-layout');
if(reduceMotion||!('IntersectionObserver'in window)){revealTargets.forEach(el=>el.classList.add('pro-visible','motion-visible'));}
else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('pro-visible','motion-visible');observer.unobserve(entry.target);}),{rootMargin:'0px 0px -6% 0px',threshold:.08});revealTargets.forEach((el,index)=>{el.classList.add('pro-reveal');el.style.setProperty('--reveal-delay',(index%4)*70+'ms');observer.observe(el);});}
const navLinks=[...document.querySelectorAll('.main-nav a[href^="#"]')],sections=navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver'in window){const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;navLinks.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}),{rootMargin:'-28% 0px -62% 0px'});sections.forEach(section=>navObserver.observe(section));}
const header=document.querySelector('.site-header');if(header&&'IntersectionObserver'in window){const marker=document.createElement('span');marker.setAttribute('aria-hidden','true');marker.style.cssText='position:absolute;top:100px;left:0;width:1px;height:1px;pointer-events:none';document.body.prepend(marker);const headerObserver=new IntersectionObserver(([entry])=>header.classList.toggle('is-scrolled',!entry.isIntersecting));headerObserver.observe(marker);}
if(!reduceMotion&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){document.addEventListener('pointermove',event=>{const card=event.target.closest('.motion-card,.cms-project-card,.video-card');if(!card)return;const rect=card.getBoundingClientRect();card.style.setProperty('--spot-x',(event.clientX-rect.left)+'px');card.style.setProperty('--spot-y',(event.clientY-rect.top)+'px');},{passive:true});}
})();