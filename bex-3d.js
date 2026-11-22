(() => {
'use strict';
const intro=document.getElementById('bexIntro');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(intro){document.body.classList.add('bex-intro-active');let closed=false;const close=()=>{if(closed)return;closed=true;intro.classList.add('is-leaving');document.body.classList.remove('bex-intro-active');setTimeout(()=>intro.remove(),850);};setTimeout(close,reduced?250:2450);window.addEventListener('pageshow',()=>setTimeout(close,3200),{once:true});}
const canvas=document.getElementById('bexWorld');
if(!canvas||!window.THREE)return;
try{
 const THREE=window.THREE,scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,100);camera.position.set(0,0,12);
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;
 scene.add(new THREE.AmbientLight(0x9bcaff,1.35));const key=new THREE.PointLight(0x68dfff,28,40);key.position.set(4,3,7);scene.add(key);const fill=new THREE.PointLight(0x8d78ff,18,35);fill.position.set(-5,-2,3);scene.add(fill);
 const group=new THREE.Group();scene.add(group);
 const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(2.05,.42,180,24,2,5),new THREE.MeshPhysicalMaterial({color:0x77dff5,metalness:.72,roughness:.2,clearcoat:1,clearcoatRoughness:.12,wireframe:false}));group.add(knot);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(3.05,.018,8,180),new THREE.MeshBasicMaterial({color:0x9a8cff,transparent:true,opacity:.55}));ring.rotation.set(.9,.25,.2);group.add(ring);
 const ring2=new THREE.Mesh(new THREE.TorusGeometry(3.55,.009,6,180),new THREE.MeshBasicMaterial({color:0x79eaff,transparent:true,opacity:.32}));ring2.rotation.set(.3,1.05,.7);group.add(ring2);
 const count=850,positions=new Float32Array(count*3);for(let i=0;i<count;i++){const r=5+Math.random()*12,a=Math.random()*Math.PI*2;positions[i*3]=Math.cos(a)*r;positions[i*3+1]=(Math.random()-.5)*13;positions[i*3+2]=(Math.random()-.5)*15-3;}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));const dust=new THREE.Points(geo,new THREE.PointsMaterial({color:0x9ccfff,size:.018,transparent:true,opacity:.58,sizeAttenuation:true}));scene.add(dust);
 let targetX=0,targetY=0,scrollTarget=0;const pointer=e=>{targetX=(e.clientX/innerWidth-.5)*.65;targetY=(e.clientY/innerHeight-.5)*.4;};addEventListener('pointermove',pointer,{passive:true});addEventListener('scroll',()=>{scrollTarget=Math.min(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight),1);},{passive:true});
 let frame=0,raf=0;const render=()=>{raf=requestAnimationFrame(render);frame+=.006;group.rotation.y+=(targetX*.55+frame*.12-group.rotation.y)*.018;group.rotation.x+=(targetY*.35+Math.sin(frame*.6)*.08-group.rotation.x)*.018;group.position.y+=(-scrollTarget*1.1+Math.sin(frame*.7)*.12-group.position.y)*.02;group.scale.setScalar(1-scrollTarget*.17);ring.rotation.z+=.0009;ring2.rotation.x+=.0005;dust.rotation.y+=.00012;renderer.render(scene,camera);};
 const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.position.z=innerWidth<700?15:12;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));};addEventListener('resize',resize,{passive:true});
 if(reduced){group.rotation.set(.12,.25,0);renderer.render(scene,camera);}else render();
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&raf)cancelAnimationFrame(raf);else if(!document.hidden&&!reduced)render();});
}catch(error){console.warn('BEX 3D scene unavailable; continuing with CSS fallback.',error);canvas.hidden=true;}
})();
