(() => {
  'use strict';
  const header=document.querySelector('.modern-nav');
  const links=[...document.querySelectorAll('.modern-nav nav a[href^="#"]')];
  const sections=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const updateHeader=()=>header?.classList.toggle('is-scrolled',window.scrollY>20);
  updateHeader();
  window.addEventListener('scroll',updateHeader,{passive:true});
  if('IntersectionObserver'in window&&sections.length){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        links.forEach(link=>{
          if(link.getAttribute('href')==='#'+entry.target.id)link.setAttribute('aria-current','location');
          else link.removeAttribute('aria-current');
        });
      });
    },{rootMargin:'-28% 0px -62% 0px'});
    sections.forEach(section=>observer.observe(section));
  }
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const selector='.interest-card,.value-card,.cms-project-card,.skill-chip,.video-card';
  const attach=root=>{
    const cards=[];
    if(root.nodeType===1&&root.matches?.(selector))cards.push(root);
    root.querySelectorAll?.(selector).forEach(card=>cards.push(card));
    cards.forEach(card=>{
      if(card.dataset.pointerReady==='true')return;
      card.dataset.pointerReady='true';
      if(!fine||reduce)return;
      let frame=0,lastX=0,lastY=0;
      card.addEventListener('pointermove',event=>{
        const rect=card.getBoundingClientRect();
        lastX=event.clientX-rect.left;
        lastY=event.clientY-rect.top;
        if(frame)return;
        frame=requestAnimationFrame(()=>{
          frame=0;
          card.style.setProperty('--mx',lastX+'px');
          card.style.setProperty('--my',lastY+'px');
        });
      },{passive:true});
      card.addEventListener('pointerleave',()=>{
        card.style.setProperty('--mx','50%');
        card.style.setProperty('--my','50%');
      },{passive:true});
    });
  };
  attach(document);
  if('MutationObserver'in window){
    const mutations=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1)attach(node);})));
    mutations.observe(document.querySelector('main')||document.body,{childList:true,subtree:true});
  }
})();