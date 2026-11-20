(() => {
'use strict';
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header=document.querySelector('.site-header');
const navLinks=[...document.querySelectorAll('.main-nav a[href^="#"]')];
const sections=navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
const updateHeader=()=>header?.classList.toggle('is-scrolled',window.scrollY>18);
updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});
if('IntersectionObserver'in window&&sections.length){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  navLinks.forEach(link=>{const active=link.getAttribute('href')==='#'+entry.target.id;if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 }),{rootMargin:'-28% 0px -62% 0px',threshold:0});
 sections.forEach(section=>observer.observe(section));
}
const selector='.interest-card,.cms-project-card,.video-card,.skill-chip';
const enhance=root=>{
 const cards=root.matches?.(selector)?[root]:[...(root.querySelectorAll?.(selector)||[])];
 cards.forEach(card=>{
  if(card.dataset.advancedUi==='1')return;card.dataset.advancedUi='1';
  card.addEventListener('pointermove',event=>{
   const rect=card.getBoundingClientRect();card.style.setProperty('--mx',(event.clientX-rect.left)+'px');card.style.setProperty('--my',(event.clientY-rect.top)+'px');
   if(!reduceMotion&&matchMedia('(hover: hover) and (pointer: fine)').matches){const x=(event.clientX-rect.left)/rect.width-.5,y=(event.clientY-rect.top)/rect.height-.5;card.style.transform='perspective(900px) rotateX('+(-y*2.2)+'deg) rotateY('+(x*2.2)+'deg) translateY(-2px)';}
  },{passive:true});
  card.addEventListener('pointerleave',()=>{card.style.transform='';},{passive:true});
 });
};
enhance(document);
if('MutationObserver'in window){const mo=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1)enhance(node);})));['#projectsGrid','#videoGrid','#skillsGrid'].forEach(id=>{const host=document.querySelector(id);if(host)mo.observe(host,{childList:true,subtree:true});});}
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{const target=document.querySelector(link.getAttribute('href'));if(target&&!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');}));
})();