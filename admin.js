(() => {
'use strict';
const $=s=>document.querySelector(s),form=$('#contentForm');
const db=window.supabase&&window.BADHON_SUPABASE_URL&&window.BADHON_SUPABASE_PUBLISHABLE_KEY?window.supabase.createClient(window.BADHON_SUPABASE_URL,window.BADHON_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
let adminUser=null,existingContent={};
const val=k=>form.elements[k]?.value??'';
function status(t,saved=false){const e=$('#publishState');if(e){e.textContent=(saved?'✓ ':'● ')+t;e.classList.toggle('saved',saved);}}
function message(t){const e=$('#loginMessage');if(e)e.textContent=t;}
function isAdmin(user){return user?.app_metadata?.role==='admin';}
function put(k,v){if(form.elements[k]&&v!=null)form.elements[k].value=v;}
const fields={videos:[['url','YouTube video URL','url'],['label','Video title','text']],social:[['url','Profile URL','url'],['name','Platform name','text'],['label','Short label','text']],projects:[['title','Project title','text'],['category','Category / type','text'],['url','Project URL','url'],['image','Project image URL (optional)','url'],['description','Short description','text']],skills:[['name','Skill or tool','text'],['level','Level / category (optional)','text']],experience:[['year','Year','text'],['title','Milestone title','text'],['description','Description','text'],['status','Label (optional)','text']]};
function makeRow(type,item={}){const row=document.createElement('div');row.className='simple-row';row.dataset.rowType=type;fields[type].forEach(([key,placeholder,inputType])=>{const input=document.createElement('input');input.type=inputType;input.name=key;input.placeholder=placeholder;input.value=item[key]||'';input.setAttribute('aria-label',placeholder);row.append(input);});const remove=document.createElement('button');remove.type='button';remove.className='remove-row-btn';remove.textContent='Remove';remove.addEventListener('click',()=>{row.remove();status('Unsaved changes');});row.append(remove);return row;}
function renderRows(id,type,items){const host=$('#'+id);if(!host)return;host.replaceChildren();(items?.length?items:[{}]).forEach(item=>host.append(makeRow(type,item)));}
function rowsFrom(id,type){const host=$('#'+id);if(!host)return[];return [...host.querySelectorAll('.simple-row')].map(row=>Object.fromEntries([...row.querySelectorAll('input')].map(input=>[input.name,input.value.trim()]))).filter(item=>type==='projects'?item.title:type==='skills'?item.name:type==='experience'?item.title&&item.year:item.url);}
function pair(k){return{en:val(k+'En'),bn:val(k+'Bn')};}
function fill(d){existingContent={...d};put('brandName',d.brandName||'Badhon EditZX');put('fullName',d.fullName||'Md Mahim Badhon');['heroKicker','heroRole','heroDescription','introQuote','aboutIntro','projectDescription','droneIntro'].forEach(k=>{put(k+'En',d[k]?.en||'');put(k+'Bn',d[k]?.bn||'');});['heroVideoUrl','heroPosterUrl','contactEmail','projectTitle','projectUrl','accentColor','secondaryColor'].forEach(k=>put(k,d[k]||''));put('droneHours',d.droneHours||'');renderRows('videoRows','videos',d.videos||[]);renderRows('socialRows','social',d.socialLinks||[]);renderRows('projectRows','projects',d.projects||[]);renderRows('skillRows','skills',d.skills||[]);renderRows('experienceRows','experience',d.experience||[]);}
function read(){return{...existingContent,brandName:val('brandName').trim(),fullName:val('fullName').trim(),heroKicker:pair('heroKicker'),heroRole:pair('heroRole'),heroDescription:pair('heroDescription'),introQuote:pair('introQuote'),aboutIntro:pair('aboutIntro'),projectDescription:pair('projectDescription'),droneIntro:pair('droneIntro'),droneHours:val('droneHours').trim(),heroVideoUrl:val('heroVideoUrl').trim(),heroPosterUrl:val('heroPosterUrl').trim(),contactEmail:val('contactEmail').trim(),projectTitle:val('projectTitle').trim(),projectUrl:val('projectUrl').trim(),accentColor:val('accentColor'),secondaryColor:val('secondaryColor'),videos:rowsFrom('videoRows','videos'),socialLinks:rowsFrom('socialRows','social'),projects:rowsFrom('projectRows','projects'),skills:rowsFrom('skillRows','skills'),experience:rowsFrom('experienceRows','experience')};}
async function loadDashboard(){if(!db)throw Error('Supabase client unavailable.');const {data,error}=await db.auth.getUser();if(error||!isAdmin(data?.user))return false;adminUser=data.user;const {data:row,error:loadError}=await db.from('site_content').select('content').eq('id',1).single();if(loadError)throw loadError;fill(row.content||{});$('#loginView').hidden=true;$('#dashboardView').hidden=false;status('Connected to Supabase · content loaded');return true;}
$('#loginForm').addEventListener('submit',async e=>{e.preventDefault();if(!db){message('Supabase failed to load. Check network and public config.');return;}const b=e.currentTarget.querySelector('button');b.disabled=true;message('Checking admin credentials…');try{const {data,error}=await db.auth.signInWithPassword({email:$('#adminEmail').value.trim(),password:$('#adminPassword').value});if(error)throw error;if(!isAdmin(data.user)){await db.auth.signOut();throw Error('This account is not assigned as a website admin.');}adminUser=data.user;$('#adminPassword').value='';if(!await loadDashboard())throw Error('Admin session could not be verified. Sign in again.');}catch(err){message(err.message||'Sign-in failed.');}finally{b.disabled=false;}});
document.querySelectorAll('[data-add-row]').forEach(button=>button.addEventListener('click',()=>{const type=button.dataset.addRow;const ids={videos:'videoRows',social:'socialRows',projects:'projectRows',skills:'skillRows',experience:'experienceRows'};$('#'+ids[type])?.append(makeRow(type));status('Unsaved changes');}));
$('#logoutBtn').addEventListener('click',async()=>{if(db)await db.auth.signOut();location.reload();});
form.addEventListener('input',()=>status('Unsaved changes'));
form.addEventListener('submit',async e=>{e.preventDefault();if(!db||!adminUser){status('Please sign in again before publishing.');return;}const b=$('#saveBtn');b.disabled=true;b.textContent='Publishing…';try{const content=read();const {data,error}=await db.from('site_content').update({content,is_published:true,updated_at:new Date().toISOString(),updated_by:adminUser.id}).eq('id',1).select('id').single();if(error)throw error;if(!data)throw Error('No CMS row was updated.');existingContent=content;status('Published — live portfolio updated',true);}catch(err){status(err.message||'Publish failed.');}finally{b.disabled=false;b.innerHTML='Save & publish <span>↗</span>'; }});
const mimeByExt={jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',mp4:'video/mp4',webm:'video/webm'};
function friendlyUploadError(err){const raw=[err?.message,err?.error,err?.statusCode].filter(Boolean).join(' · ');if(/row.level security|not authorized|permission|unauthorized|403/i.test(raw))return'Upload permission denied. Sign out and sign in again; confirm this account has the admin role.';if(/bucket not found|no such bucket/i.test(raw))return'Media storage bucket is missing. Check the badhoneditzx-media bucket.';if(/file size|payload too large|413/i.test(raw))return'File is larger than the storage limit (90 MB).';if(/mime|content.type|not allowed/i.test(raw))return'File type is not allowed. Use JPG, PNG, WebP, MP4 or WebM.';return raw||'Upload failed. Check your connection and try again.';}
async function uploadFile(file,targetField,statusEl){
 if(!file)return;
 if(!db||!adminUser){statusEl.textContent='Sign in as admin before uploading.';return;}
 if(file.size===0){statusEl.textContent='This file is empty. Choose another file.';return;}
 if(file.size>90*1024*1024){statusEl.textContent='File exceeds the 90 MB storage limit.';return;}
 const ext=(file.name.split('.').pop()||'').toLowerCase().replace(/[^a-z0-9]/g,'');
 const mime=file.type||mimeByExt[ext]||'';
 const allowed=['image/jpeg','image/png','image/webp','video/mp4','video/webm'];
 if(!allowed.includes(mime)||mimeByExt[ext]!==mime){statusEl.textContent='Unsupported file. Use JPG, PNG, WebP, MP4 or WebM.';return;}
 const field=form.elements[targetField];if(!field){statusEl.textContent='Upload target field is missing. Reload the admin page.';return;}
 statusEl.textContent='Checking admin session…';
 try{
  const {data:auth,error:authError}=await db.auth.getUser();
  if(authError||!isAdmin(auth?.user)){adminUser=null;throw Error('Your admin session expired or lacks the admin role. Sign out and sign in again.');}
  adminUser=auth.user;
  statusEl.textContent='Uploading '+file.name+'…';
  const id=globalThis.crypto?.randomUUID?.()||('file-'+Date.now()+'-'+Math.random().toString(36).slice(2));
  const path='uploads/'+id+'.'+ext;
  const {data,error}=await db.storage.from('badhoneditzx-media').upload(path,file,{cacheControl:'3600',upsert:false,contentType:mime});
  if(error)throw error;
  const {data:publicData}=db.storage.from('badhoneditzx-media').getPublicUrl(data.path||path);
  if(!publicData?.publicUrl)throw Error('Upload completed, but Supabase did not return a public URL.');
  field.value=publicData.publicUrl;field.dispatchEvent(new Event('input',{bubbles:true}));field.dispatchEvent(new Event('change',{bubbles:true}));
  status('Media uploaded — save to publish');statusEl.textContent='Upload complete. Click “Save & publish” to make it live.';
 }catch(err){statusEl.textContent=friendlyUploadError(err);console.error('Badhon EditZX media upload failed:',err);}
}
$('#videoUpload').addEventListener('change',async e=>{try{await uploadFile(e.target.files?.[0],'heroVideoUrl',$('#uploadStatus'));}finally{e.target.value='';}});
$('#posterUpload').addEventListener('change',async e=>{try{await uploadFile(e.target.files?.[0],'heroPosterUrl',$('#uploadStatus'));}finally{e.target.value='';}});
if(db){loadDashboard().catch(err=>message('Admin setup error: '+(err.message||'Unknown error')));}else{message('Supabase client failed to load.');$('#loginForm button').disabled=true;}
})();