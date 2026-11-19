(() => {
'use strict';
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let language='en',cmsData=null;
const db=(window.supabase&&window.BADHON_SUPABASE_URL&&window.BADHON_SUPABASE_PUBLISHABLE_KEY)?window.supabase.createClient(window.BADHON_SUPABASE_URL,window.BADHON_SUPABASE_PUBLISHABLE_KEY):null;
const textValue=v=>typeof v==='object'&&v!==null?(v[language]??v.en??''):v??'';
function setLanguage(next){language=next==='bn'?'bn':'en';document.documentElement.lang=language;document.body.classList.toggle('bn',language==='bn');$$('[data-en][data-bn]').forEach(el=>el.textContent=el.dataset[language]??el.dataset.en??el.textContent);const b=$('#langSwitch');if(b)b.textContent=language==='en'?'বাংলা':'English';if(cmsData)applyCMS(cmsData);}
$('#langSwitch')?.addEventListener('click',()=>setLanguage(language==='en'?'bn':'en'));
const nav=$('#mainNav'),menu=$('#menuToggle');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
$$('.nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false');}));
const cards=$$('.world-card');
cards.forEach(card=>card.querySelector('.world-more')?.addEventListener('click',e=>{const btn=e.currentTarget,detail=card.querySelector('.world-detail'),opening=btn.getAttribute('aria-expanded')!=='true';cards.forEach(c=>{c.querySelector('.world-more')?.setAttribute('aria-expanded','false');c.querySelector('.world-detail')?.setAttribute('hidden','');});if(opening){btn.setAttribute('aria-expanded','true');detail?.removeAttribute('hidden');}}));
const progress=$('#scrollProgress');function onScroll(){const max=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.width=(max?scrollY/max*100:0)+'%';}addEventListener('scroll',onScroll,{passive:true});onScroll();
$('#yearNow').textContent=new Date().getFullYear();
if('IntersectionObserver'in window){const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveal.unobserve(e.target);}}),{threshold:.1});$$('.section-pad,.world-card,.project-feature,.feature-card').forEach(el=>{el.style.opacity='0';el.style.transform='translateY(18px)';el.style.transition='opacity .7s ease,transform .7s ease';reveal.observe(el);});const style=document.createElement('style');style.textContent='.visible{opacity:1!important;transform:none!important}';document.head.append(style);const links=$$('.nav a');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}),{rootMargin:'-35% 0px -55% 0px'});links.forEach(a=>{const s=$(a.hash);if(s)observer.observe(s);});}
const safeUrl=v=>{try{const u=new URL(v,location.href);return ['https:','http:'].includes(u.protocol)?u.href:'';}catch{return '';}};
function setCMS(k,v){const el=$('[data-cms="'+k+'"]');if(el)el.textContent=textValue(v);}
function renderSocials(items){const host=$('#heroSocialLinks');if(!host||!Array.isArray(items)||!items.length)return;host.replaceChildren();items.forEach(item=>{const url=safeUrl(item.url);if(!url)return;const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=(item.label||item.name||'SOCIAL').toUpperCase()+' ↗';host.append(a);});}
function renderVideos(items){const host=$('#videoGrid');if(!host||!Array.isArray(items)||!items.length)return;host.replaceChildren();items.forEach((item,i)=>{const url=safeUrl(item.url);if(!url)return;let id='';try{const u=new URL(url);id=u.hostname.includes('youtu.be')?u.pathname.slice(1):u.searchParams.get('v')||'';}catch{}const a=document.createElement('a');a.className='video-card';a.href=url;a.target='_blank';a.rel='noopener noreferrer';if(id){const img=document.createElement('img');img.src='https://i.ytimg.com/vi/'+encodeURIComponent(id)+'/hqdefault.jpg';img.alt=item.label||'Video thumbnail';img.loading='lazy';a.append(img);}const label=document.createElement('span');label.textContent=(item.label||'PLAY FILM / 0'+(i+1)).toUpperCase()+' ↗';a.append(label);host.append(a);});}
function applyCMS(d){if(!d||typeof d!=='object')return;cmsData=d;
if(d.fullName){document.title=(d.brandName||'Badhon EditZX')+' — '+d.fullName;const meta=$('meta[name="description"]');if(meta)meta.content='The creative portfolio of '+d.fullName+' — '+(d.brandName||'Badhon EditZX')+'.';}
if(d.brandName){const brand=$('.brand>span');if(brand){const words=d.brandName.trim().split(/\s+/);brand.textContent=words.join(' ').toUpperCase();}}
document.documentElement.style.setProperty('--blue',d.accentColor||'#5966f2');document.documentElement.style.setProperty('--purple',d.secondaryColor||'#a78bfa');
['heroRole','heroDescription','introQuote','aboutIntro','droneIntro','projectDescription'].forEach(k=>{if(d[k]!=null)setCMS(k,d[k]);});
if(d.projectTitle){const e=$('[data-cms="projectTitle"]');if(e)e.textContent=textValue(d.projectTitle);}
const hours=$('[data-cms="droneHours"]');if(hours&&d.droneHours)hours.textContent=d.droneHours;
const email=$('#contactEmail');if(email&&d.contactEmail){email.href='mailto:'+d.contactEmail;email.textContent='Email me ↗';}
const project=$('#projectLink');if(project&&d.projectUrl){const url=safeUrl(d.projectUrl);if(url)project.href=url;}
renderSocials(d.socialLinks);renderVideos(d.videos);
}
async function loadCMS(){if(!db)return false;try{const {data,error}=await db.from('site_content').select('content,updated_at').eq('id',1).eq('is_published',true).maybeSingle();if(error)throw error;if(data?.content){applyCMS(data.content);document.documentElement.dataset.cmsReady='true';return true;}return false;}catch(error){console.warn('Portfolio CMS unavailable; showing built-in content.',error);document.documentElement.dataset.cmsReady='fallback';return false;}}
loadCMS();
if(db){try{db.channel('badhon-site-content-live').on('postgres_changes',{event:'UPDATE',schema:'public',table:'site_content',filter:'id=eq.1'},payload=>{if(payload.new?.is_published&&payload.new?.content)applyCMS(payload.new.content);}).subscribe();}catch(e){console.warn('Live content updates unavailable.',e);}}
addEventListener('focus',loadCMS);
})();