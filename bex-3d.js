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
const cards=[...document.querySelectorAll('.motion-reveal')];
if(reduceMotion||!('IntersectionObserver'in window)){cards.forEach(card=>card.classList.add('motion-visible'));return;}
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
 if(!entry.isIntersecting)return;
 entry.target.classList.add('motion-visible');
 observer.unobserve(entry.target);
}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
cards.forEach((card,index)=>{card.style.transitionDelay=(index%4)*65+'ms';observer.observe(card);});
})();