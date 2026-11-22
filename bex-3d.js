(() => {
'use strict';
const intro=document.getElementById('bexIntro');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(intro){
 document.body.classList.add('bex-intro-active');
 let closed=false;
 const close=()=>{if(closed)return;closed=true;intro.classList.add('is-leaving');document.body.classList.remove('bex-intro-active');window.setTimeout(()=>intro.remove(),850);};
 window.setTimeout(close,reduced?250:2450);
 window.addEventListener('pageshow',()=>window.setTimeout(close,3200),{once:true});
}
if(reduced)return;
const selector=[
 '.portrait-frame','.discipline-card','.principle-card','.skill-chip','.timeline-item',
 '.featured-project','.cms-project-card','.video-card','.drone-visual',
 '.channel-stats>div','.cycling-story','.sports-list>div','.contact-details .button-outline'
].join(',');
const bind=root=>{
 const nodes=[];
 if(root.nodeType===1&&root.matches?.(selector))nodes.push(root);
 root.querySelectorAll?.(selector).forEach(node=>nodes.push(node));
 nodes.forEach(node=>{
  if(node.dataset.bexDepth==='1')return;
  node.dataset.bexDepth='1';
  node.addEventListener('pointermove',event=>{
   if(event.pointerType==='touch')return;
   const rect=node.getBoundingClientRect();
   const x=(event.clientX-rect.left)/rect.width;
   const y=(event.clientY-rect.top)/rect.height;
   node.style.setProperty('--bex-rx',((.5-y)*7).toFixed(2)+'deg');
   node.style.setProperty('--bex-ry',((x-.5)*8).toFixed(2)+'deg');
   node.style.setProperty('--bex-lx',(x*100).toFixed(1)+'%');
   node.style.setProperty('--bex-ly',(y*100).toFixed(1)+'%');
   node.classList.add('bex-depth-active');
  },{passive:true});
  node.addEventListener('pointerleave',()=>{
   node.style.setProperty('--bex-rx','0deg');node.style.setProperty('--bex-ry','0deg');
   node.classList.remove('bex-depth-active');
  });
 });
};
bind(document);
if('MutationObserver'in window){
 const observer=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===1)bind(node);})));
 observer.observe(document.querySelector('main')||document.body,{childList:true,subtree:true});
}
document.querySelectorAll('.hero-copy h1,.section-heading h2,.approach-heading h2,.section-intro h2,.journey-heading h2,.work-heading h2,.outside-inner h2,.contact-layout h2').forEach(el=>el.classList.add('bex-dimensional-type'));
})();