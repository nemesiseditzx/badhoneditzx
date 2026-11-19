import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";
import { firebaseConfig, adminEmail } from "./firebase-config.js";

const $ = s => document.querySelector(s), form = $("#contentForm");
const ready = Object.values(firebaseConfig).every(value => value && !value.startsWith("REPLACE_")) && !adminEmail.startsWith("REPLACE_");
const defaults = {
  brandName:"Badhon EditZX", fullName:"Md Mahim Badhon",
  heroKicker:{en:"Hello, I'm",bn:"হ্যালো, আমি"},
  heroRole:{en:"Creator. Entrepreneur. Digital Explorer.",bn:"ক্রিয়েটর। উদ্যোক্তা। ডিজিটাল অনুসন্ধানী।"},
  heroDescription:{en:"I turn ideas into edits, sounds, digital experiences and ambitious projects. One skill at a time. One project at a time.",bn:"আমি আইডিয়াকে রূপ দিই ভিডিও এডিট, সুর, ডিজিটাল অভিজ্ঞতা ও নতুন প্রজেক্টে। একবারে একটি দক্ষতা, একটি প্রজেক্ট।"},
  introQuote:{en:"SUCCESS TAKES BLOOD, SWEAT & SACRIFICE.",bn:"সাফল্যের জন্য লাগে ঘাম, পরিশ্রম ও ত্যাগ।"},
  aboutIntro:{en:"I'm Md Mahim Badhon, known online as Badhon EditZX.",bn:"আমি Md Mahim Badhon, অনলাইনে Badhon EditZX নামে পরিচিত।"},
  projectTitle:"GrabZone", projectDescription:{en:"A multi-vendor marketplace project exploring e-commerce, vendor systems and digital business operations.",bn:"ই-কমার্স, ভেন্ডর সিস্টেম ও ডিজিটাল ব্যবসা পরিচালনা নিয়ে তৈরি একটি মাল্টি-ভেন্ডর মার্কেটপ্লেস প্রজেক্ট।"},
  projectUrl:"https://grabzone.tech/", contactEmail:"bdnemesisgaming@gmail.com",
  heroVideoUrl:"", heroPosterUrl:"", accentColor:"#d7ff3f", secondaryColor:"#5c70ff",
  videos:[{url:"https://youtu.be/3lkTGcBtfrI",label:"VIDEO EDIT / SHOWCASE 01"},{url:"https://youtu.be/PHJYMsd-rZk",label:"VIDEO EDIT / SHOWCASE 02"},{url:"https://youtu.be/2Fji1WFDIjY",label:"VIDEO EDIT / SHOWCASE 03"}],
  socialLinks:[{label:"YT",name:"YouTube",url:"https://www.youtube.com/@badhoneditzx"},{label:"IG",name:"Instagram",url:"https://www.instagram.com/badhoneditzx/"},{label:"TT",name:"TikTok",url:"https://www.tiktok.com/@badhoneditzx"},{label:"TG",name:"Telegram",url:"https://t.me/badhoneditzx01"}]
};
let app, auth, db, storage;
if (ready) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  $("#loginMessage").textContent = "Firebase setup is not finished yet. Complete firebase-config.js first.";
  $("#loginForm").querySelector("button").disabled = true;
}
const val = key => form.elements[key]?.value ?? "";
function status(message, saved=false) {
  const el=$("#publishState"); el.textContent=(saved?"✓ ":"● ")+message; el.classList.toggle("saved",saved);
}
function fill(data={}) {
  const d={...defaults,...data};
  const put=(k,v)=>{if(form.elements[k]&&v!=null)form.elements[k].value=v;};
  put("brandName",d.brandName); put("fullName",d.fullName);
  ["heroKicker","heroRole","heroDescription","introQuote","aboutIntro","projectDescription"].forEach(k=>{
    put(k+"En",d[k]?.en??defaults[k]?.en??""); put(k+"Bn",d[k]?.bn??defaults[k]?.bn??"");
  });
  ["heroVideoUrl","heroPosterUrl","contactEmail","projectTitle","projectUrl","accentColor","secondaryColor"].forEach(k=>put(k,d[k]));
  put("videosJson",JSON.stringify(d.videos||[],null,2));
  put("socialJson",JSON.stringify(d.socialLinks||[],null,2));
}
function read() {
  const pair=k=>({en:val(k+"En"),bn:val(k+"Bn")});
  let videos,socialLinks;
  try { videos=JSON.parse(val("videosJson")||"[]"); if(!Array.isArray(videos))throw Error("Expected an array"); }
  catch(e){throw Error("Video list: "+e.message);}
  try { socialLinks=JSON.parse(val("socialJson")||"[]"); if(!Array.isArray(socialLinks))throw Error("Expected an array"); }
  catch(e){throw Error("Social links: "+e.message);}
  return {
    ...defaults, brandName:val("brandName").trim(), fullName:val("fullName").trim(),
    heroKicker:pair("heroKicker"),heroRole:pair("heroRole"),heroDescription:pair("heroDescription"),
    introQuote:pair("introQuote"),aboutIntro:pair("aboutIntro"),projectDescription:pair("projectDescription"),
    heroVideoUrl:val("heroVideoUrl").trim(),heroPosterUrl:val("heroPosterUrl").trim(),
    contactEmail:val("contactEmail").trim(),projectTitle:val("projectTitle").trim(),
    projectUrl:val("projectUrl").trim(),accentColor:val("accentColor"),secondaryColor:val("secondaryColor"),
    videos,socialLinks,updatedAt:new Date().toISOString()
  };
}
async function loadContent() {
  const snap=await getDoc(doc(db,"site","content"));
  const data=snap.exists()?snap.data():defaults;
  fill(data); status(snap.exists()?"Connected to Firebase":"Ready — first publish will create your content");
}
async function showDashboard(user) {
  if(user.email?.toLowerCase()!==adminEmail.toLowerCase()) {
    await signOut(auth);
    $("#loginMessage").textContent="This account is not authorized for this admin panel.";
    return;
  }
  $("#loginView").hidden=true; $("#dashboardView").hidden=false;
  await loadContent();
}
$("#loginForm").addEventListener("submit",async e=>{
  e.preventDefault(); if(!ready)return;
  const button=e.currentTarget.querySelector("button"); button.disabled=true;
  $("#loginMessage").textContent="Signing in…";
  try { const credential=await signInWithEmailAndPassword(auth,$("#adminEmail").value.trim(),$("#adminPassword").value); await showDashboard(credential.user); }
  catch(error){$("#loginMessage").textContent=error.code==="auth/invalid-credential"?"Email or password is incorrect.":error.message;}
  finally{button.disabled=false;}
});
$("#logoutBtn").addEventListener("click",()=>signOut(auth).then(()=>location.reload()));
form.addEventListener("input",()=>status("Unsaved changes"));
form.addEventListener("submit",async e=>{
  e.preventDefault(); let data;
  try{data=read();}catch(error){status(error.message);return;}
  const button=$("#saveBtn"); button.disabled=true; button.textContent="Publishing…";
  try {
    const user=auth.currentUser;
    if(!user||user.email?.toLowerCase()!==adminEmail.toLowerCase())throw Error("Please sign in with the authorized admin account.");
    await setDoc(doc(db,"site","content"),data);
    status("Published — public website updated",true);
  } catch(error){status(error.message);}
  finally{button.disabled=false;button.innerHTML="Save & publish <span>↗</span>";}
});
$("#videoUpload").addEventListener("change",async e=>{
  const file=e.target.files?.[0]; if(!file)return;
  const message=$("#uploadStatus");
  if(file.size>90*1024*1024){message.textContent="File exceeds 90 MB limit.";e.target.value="";return;}
  if(!["video/mp4","video/webm"].includes(file.type)){message.textContent="Choose an MP4 or WebM video.";e.target.value="";return;}
  const user=auth.currentUser;
  if(!user||user.email?.toLowerCase()!==adminEmail.toLowerCase()){message.textContent="Sign in with the authorized admin account first.";e.target.value="";return;}
  const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"-");
  const target=ref(storage,"portfolio/videos/"+Date.now()+"-"+safeName);
  message.textContent="Uploading "+file.name+"…";
  const task=uploadBytesResumable(target,file,{contentType:file.type});
  task.on("state_changed",snapshot=>{
    const pct=Math.round(snapshot.bytesTransferred/snapshot.totalBytes*100);
    message.textContent="Uploading… "+pct+"%";
  },error=>{message.textContent=error.message;},async()=>{
    try{form.elements.heroVideoUrl.value=await getDownloadURL(task.snapshot.ref);status("Video uploaded — click Save & publish");message.textContent="Upload complete. Click Save & publish.";}
    catch(error){message.textContent=error.message;}
  });
  e.target.value="";
});
if(ready) onAuthStateChanged(auth,user=>{
  if(user) showDashboard(user).catch(error=>$("#loginMessage").textContent=error.message);
});
