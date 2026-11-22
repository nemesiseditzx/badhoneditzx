(() => {
'use strict';
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const db=window.supabase&&window.BADHON_SUPABASE_URL&&window.BADHON_SUPABASE_PUBLISHABLE_KEY?window.supabase.createClient(window.BADHON_SUPABASE_URL,window.BADHON_SUPABASE_PUBLISHABLE_KEY):null;
let language='en',content={};
const textValue=v=>{let value=v;for(let i=0;i<3&&value&&typeof value==='object';i++)value=value[language]??value.en??value.bn??'';return value??'';};
function setLanguage(next){language=next==='bn'?'bn':'en';document.documentElement.lang=language;document.body.classList.toggle('bn',language==='bn');$$('[data-en][data-bn]').forEach(el=>{const value=el.dataset[language];if(value!==undefined)el.innerHTML=value;});const b=$('#langSwitch');if(b){b.textContent=language==='en'?'বাংলা':'English';b.setAttribute('aria-label',language==='en'?'Switch to Bangla':'Switch to English');}applyContent(content);}
const contactDialog=$('#contactDialog');
let contactEmail='bdnemesisgaming@gmail.com';
$$('[data-open-contact]').forEach(button=>button.addEventListener('click',()=>contactDialog?.showModal()));
$$('[data-close-contact]').forEach(button=>button.addEventListener('click',()=>contactDialog?.close()));
contactDialog?.addEventListener('click',event=>{if(event.target===contactDialog)contactDialog.close();});
$('#contactForm')?.addEventListener('submit',async event=>{event.preventDefault();const form=event.currentTarget;const status=$('#contactStatus');const button=form.querySelector('[type="submit"]');const data=new FormData(form);if(String(data.get('bot-field')||'').trim())return;const setStatus=(message,ok)=>{if(status){status.hidden=false;status.textContent=message;status.dataset.state=ok?'success':'error';}};if(!form.reportValidity())return;button.disabled=true;button.textContent='Sending…';setStatus('Sending your message securely…',true);try{const encoded=new URLSearchParams();for(const [key,value] of data.entries())encoded.append(key,String(value));const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:encoded.toString(),credentials:'same-origin'});if(!response.ok)throw new Error('The form service returned '+response.status+'.');form.reset();setStatus('Your message was submitted successfully. Thank you — I will get back to you soon.',true);}catch(error){setStatus('Your message could not be sent. Please try again or email bdnemesisgaming@gmail.com directly.',false);console.error('Contact form submission failed:',error);}finally{button.disabled=false;button.textContent='Send message ↗';}});
$('#langSwitch')?.addEventListener('click',()=>setLanguage(language==='en'?'bn':'en'));
const nav=$('#mainNav'),toggle=$('#menuToggle');
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','Open navigation');}));
const progress=$('#scrollProgress');function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.width=(max?scrollY/max*100:0)+'%';}addEventListener('scroll',updateProgress,{passive:true});updateProgress();$('#yearNow').textContent=new Date().getFullYear();
const subscriber=$('#subscriberCount');if(subscriber&&subscriber.textContent.trim()==='933')subscriber.textContent='—';
const statsStatus=$('#statsStatus');if(statsStatus)statsStatus.lastElementChild.textContent='Live YouTube API not connected';
const safeUrl=value=>{if(typeof value!=='string'||!value.trim())return '';try{const u=new URL(value.trim(),location.href);return u.protocol==='https:'?u.href:'';}catch{return '';}};
const portraitImage=$('#profilePortrait');
if(portraitImage){
 const markPortrait=(loaded)=>{portraitImage.dataset.portraitReady=loaded?'true':'false';};
 portraitImage.addEventListener('load',()=>markPortrait(portraitImage.naturalWidth>0));
 portraitImage.addEventListener('error',()=>{markPortrait(false);portraitImage.removeAttribute('src');});
 if(portraitImage.complete)markPortrait(portraitImage.naturalWidth>0);
}
function applyText(selector,value){const el=$(selector);if(el&&value!=null)el.textContent=textValue(value);}
function renderProjects(items){const host=$('#projectsGrid');if(!host)return;host.replaceChildren();(Array.isArray(items)?items:[]).filter(x=>x.title).forEach((item,i)=>{const card=document.createElement('article');card.className='cms-project-card';const image=safeUrl(item.image);if(image){const img=document.createElement('img');img.src=image;img.alt=item.title+' project preview';img.loading='lazy';card.append(img);}const type=document.createElement('span');type.className='project-type';type.textContent=item.category||'SELECTED PROJECT';const title=document.createElement('h3');title.textContent=item.title;const desc=document.createElement('p');desc.textContent=textValue(item.description);card.append(type,title,desc);const url=safeUrl(item.url);if(url){const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='VIEW PROJECT ↗';card.append(link);}host.append(card);});}
function renderVideos(items){const host=$('#videoGrid');if(!host||!Array.isArray(items)||!items.length)return;host.replaceChildren();items.forEach((item,i)=>{const url=safeUrl(item.url);if(!url)return;let id='';try{const u=new URL(url);id=u.hostname.includes('youtu.be')?u.pathname.slice(1):u.searchParams.get('v')||u.pathname.match(/\/embed\/([^/]+)/)?.[1]||'';}catch{}const a=document.createElement('a');a.className='video-card';a.href=url;a.target='_blank';a.rel='noopener noreferrer';const thumb=document.createElement('div');thumb.className='video-thumb';if(id){const img=document.createElement('img');img.src='https://i.ytimg.com/vi/'+encodeURIComponent(id)+'/hqdefault.jpg';img.alt=(item.label||'Video')+' thumbnail';img.loading='lazy';thumb.append(img);}const play=document.createElement('span');play.textContent='▶';thumb.append(play);const meta=document.createElement('div');meta.className='video-meta';const label=document.createElement('span');label.textContent=(item.label||'CREATIVE WORK '+String(i+1).padStart(2,'0')).toUpperCase();const watch=document.createElement('b');watch.textContent='Watch ↗';meta.append(label,watch);a.append(thumb,meta);host.append(a);});}
function renderSkills(items){const host=$('#skillsGrid');if(!host)return;host.replaceChildren();(Array.isArray(items)?items:[]).filter(x=>x.name).forEach((item,i)=>{const card=document.createElement('article');card.className='skill-chip';card.style.setProperty('--card-index',i);const title=document.createElement('strong');title.textContent=item.name;card.append(title);if(item.level||item.category){const meta=document.createElement('small');meta.textContent=[item.category,item.level].filter(Boolean).join(' · ');card.append(meta);}const description=textValue(item.description);if(description){const detail=document.createElement('p');detail.textContent=description;card.append(detail);}host.append(card);});}
function renderTimeline(items){
 const host=$('#timelineGrid');
 if(!host||!Array.isArray(items)||!items.length)return;
 host.replaceChildren();
 items.forEach(item=>{
  const article=document.createElement('article');
  article.className='timeline-item';
  const year=document.createElement('span');
  year.className='timeline-year';
  year.textContent=textValue(item.year)||'';
  const body=document.createElement('div');
  const title=document.createElement('h3');
  title.textContent=textValue(item.title)||'';
  const desc=document.createElement('p');
  desc.textContent=textValue(item.description)||'';
  body.append(title,desc);
  const status=document.createElement('span');
  status.className='timeline-status';
  status.textContent=textValue(item.status)||'MILESTONE';
  article.append(year,body,status);
  host.append(article);
 });
}
function socialIcon(name){const key=name.replace(/[^a-z]/g,'');const paths={youtube:'<svg viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12z"/></svg>',instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',tiktok:'<svg viewBox="0 0 24 24"><path d="M15.5 3c.3 2.3 1.6 3.7 4 3.9v3.2a8.2 8.2 0 0 1-4-1.2v6.2a6.1 6.1 0 1 1-6.1-6.1c.4 0 .8 0 1.2.1v3.4a2.9 2.9 0 1 0 1.7 2.6V3z"/></svg>',telegram:'<svg viewBox="0 0 24 24"><path d="m21.8 4.2-3.3 15.5c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6.1 13.2l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.5 2.6c.9-.3 1.7.2 1.3 1.6Z"/></svg>'};return paths[key]||'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>';}
function applyContent(d){if(!d||typeof d!=='object')return;content=d;
const fields=['heroKicker','heroRole','heroDescription','introQuote','aboutIntro','projectDescription','cyclingIntro'];fields.forEach(k=>{if(d[k]!=null){const el=$('[data-cms="'+k+'"]');if(el)el.textContent=textValue(d[k]);}});
if(d.fullName){const hero=$('.hero-copy h1');if(hero){hero.replaceChildren();String(d.fullName).trim().split(/\s+/).filter(Boolean).forEach((part,index)=>{if(index)hero.append(document.createElement('br'));hero.append(document.createTextNode(part.toUpperCase()));});const period=document.createElement('span');period.className='hero-period';period.textContent='.';hero.append(period);}document.title=(d.brandName||'Badhon EditZX')+' — '+String(d.fullName);}
if(d.heroKicker){const kicker=$('.hero-kicker');if(kicker)kicker.textContent=textValue(d.heroKicker);}
if(d.heroPosterUrl){const img=$('#profilePortrait');if(img){const url=safeUrl(d.heroPosterUrl);if(url){img.dataset.portraitReady='false';img.src=url;img.alt=(d.fullName||'Badhon EditZX')+' portrait';}}}
{const hero=$('.modern-hero'),url=safeUrl(d.heroVideoUrl);if(hero&&url){let video=$('#heroBackgroundVideo');if(!video){video=document.createElement('video');video.id='heroBackgroundVideo';video.className='hero-background-video';video.muted=true;video.autoplay=true;video.loop=true;video.playsInline=true;video.preload='metadata';video.setAttribute('aria-hidden','true');hero.prepend(video);}if(video.src!==url){video.src=url;video.load();}const play=video.play();if(play?.catch)play.catch(()=>{});}else{$('#heroBackgroundVideo')?.remove();}}
if(d.contactEmail){contactEmail=d.contactEmail;const link=$('.contact-email');if(link){link.href='mailto:'+d.contactEmail;link.textContent=d.contactEmail+' ↗';}}
if(d.projectTitle){const title=$('.project-info h3');if(title)title.textContent=d.projectTitle;}
if(d.projectUrl){const link=$('.project-visual');const url=safeUrl(d.projectUrl);if(link&&url)link.href=url;}
if(d.projectDescription){const p=$('.project-info p');if(p)p.textContent=textValue(d.projectDescription);}
if(d.droneIntro){const e=$('#droneIntroText');if(e)e.textContent=textValue(d.droneIntro);}


if(d.droneDetails){const e=$('#droneDetailsText');if(e)e.textContent=textValue(d.droneDetails);}
if(Array.isArray(d.droneSkills)){const host=$('#droneSkillsGrid');if(host){host.replaceChildren();d.droneSkills.filter(x=>x.name).forEach((item,i)=>{const card=document.createElement('article');card.className='drone-skill';card.style.setProperty('--card-index',i);const title=document.createElement('strong');title.textContent=item.name;const detail=document.createElement('p');detail.textContent=textValue(item.description);card.append(title,detail);host.append(card);});}}
if(d.introQuote){const e=$('.intro-strip p');if(e)e.textContent=textValue(d.introQuote);}
/* Admin theme controls update the public palette safely. */
const hexColor=value=>typeof value==='string'&&/^#[0-9a-f]{6}$/i.test(value)?value:null;
const accent=hexColor(d.accentColor),secondary=hexColor(d.secondaryColor);
if(accent){document.documentElement.style.setProperty('--accent',accent);}
if(secondary){document.documentElement.style.setProperty('--deep',secondary);}

function renderSocialLinks(items){const valid=(Array.isArray(items)?items:[]).filter(item=>safeUrl(item.url));if(!valid.length)return;['.social-links','.modern-social .social-bar-links','.contact-dialog-social-links'].forEach(selector=>{const host=$(selector);if(!host)return;host.replaceChildren();valid.forEach(item=>{const url=safeUrl(item.url);const name=(item.name||item.label||'Social').toLowerCase();const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label',item.name||item.label||'Social');const icon=document.createElement('span');icon.className='social-icon';icon.innerHTML=socialIcon(name);const label=document.createElement('span');label.textContent=item.name||item.label||'Social';const arrow=document.createElement('b');arrow.textContent='↗';link.append(icon,label,arrow);host.append(link);});});}
renderSocialLinks(d.socialLinks);

const cycling=$('#cyclingStory p[data-cms="cyclingIntro"]');if(cycling&&d.cyclingIntro!=null)cycling.textContent=textValue(d.cyclingIntro);renderProjects(d.projects);renderVideos(d.videos);renderSkills(d.skills);renderTimeline(d.experience);
}
async function loadContent(){if(!db)return;try{const {data,error}=await db.from('site_content').select('content').eq('id',1).eq('is_published',true).maybeSingle();if(error)throw error;if(data?.content)applyContent(data.content);}catch(error){console.warn('Portfolio CMS unavailable; using built-in portfolio content.',error);}}
loadContent();if(db){db.channel('badhon-portfolio-content').on('postgres_changes',{event:'UPDATE',schema:'public',table:'site_content',filter:'id=eq.1'},payload=>{if(payload.new?.is_published&&payload.new?.content)applyContent(payload.new.content);}).subscribe();}
addEventListener('focus',loadContent);
})();