/* PsychTabber shared data + helpers (used by panel, page overlay, window view, background). */
(function(g){
const N=["Breathing","Warp flow","Patterns","Color drift","Trails","Recursion","Glow","Chromatic split","Visual snow","Detail boost","Kaleidoscope","Texture crawl","Spirals & tunnels","Lattice patterns","Eyes (DeepDream style)","Double vision","Lens swell","Melting","Edge auras","Fractal folding","Plasma in shadows","Ripple interference","Tunnel vignette","Brightness waves","Slice tearing","Datamosh blocks","RGB shift bursts","CRT scanlines","Pixelate","Posterize banding","VHS wobble","GPU artifacts","Signal dropout","Pixel stretch","Thermal vision","Solarize","Swirl vortices","Prism facets","Spectral cycling","Dream haze","Mirror world","Light streaks","Organic veins","Tint split","Tile echo","Cobweb"];
const BUILTIN={"Light":[0.3,0.3,0.3,0.3,0.2,0.1,0.3,0.2,0.1,0.3,0,0.2,0,0,0,0,0,0,0.2,0,0,0,0.15,0.2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"Gentle Come-Up":[0.3,0,0,0.3,0.2,0,0.2,0,0,0.2,0,0.3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"LSD":[0.5,0.6,0.8,0.8,0.5,0.5,0.6,0.5,0.3,0.6,0.25,0.5,0.35,0.4,0,0.3,0.3,0.15,0.5,0.25,0.3,0.3,0.2,0.3,0,0,0,0,0,0,0,0,0,0,0,0,0.3,0.2,0.4,0.3,0,0.2,0.3,0.2,0,0.2],"Mushrooms":[0.8,0.7,0.5,0.6,0.4,0.3,0.5,0.2,0.2,0.3,0,0.6,0.2,0.15,0,0.25,0.4,0.35,0.2,0,0.15,0.15,0.3,0.35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.3,0,0,0.2,0,0,0],"Deep Dream":[0,0.5,0.9,0.7,0.3,0.6,0.4,0,0,0.6,0,0,0,0,0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.4,0,0.4,0,0,0,0.4,0,0,0],"Kaleidoscope Trip":[0,0,0,0.9,0,0.5,0.5,0,0,0,0.7,0,0.5,0.4,0,0,0,0,0.4,0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.3,0,0,0.3,0,0,0,0,0],"Breathing Walls":[0.9,0.4,0,0.4,0,0,0.3,0,0.1,0.4,0,0.8,0,0,0,0,0,0.3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"Closed-Eye Visuals":[0,0,0,0.6,0,0,0,0,0,0,0,0,0.5,0.6,0,0,0,0,0,0,0.9,0.4,0.5,0.3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.5,0,0,0.6],"Mushroom Forest":[0.7,0.5,0,0.3,0,0,0,0,0,0,0,0.6,0,0,0,0,0,0.3,0,0,0.2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.4,0,0,0.6,0.6,0,0],"Cosmic Mandala":[0,0,0,0,0,0,0.5,0,0,0,0.8,0,0.6,0,0,0,0,0,0,0.4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.3,0,0.6,0,0.5,0,0,0,0,0.5],"Liquid Melt":[0.5,0.7,0,0.6,0.5,0,0,0,0,0,0,0,0,0,0,0.3,0,0.8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.7,0,0,0.4,0,0,0,0,0,0],"Neon Dream":[0,0,0,0.9,0.5,0,0.8,0.4,0,0,0,0,0,0,0,0,0,0,0.9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.8,0.3,0,0.7,0,0,0,0],"Crystal Prism":[0,0,0,0.5,0,0,0.4,0.5,0,0,0.3,0,0,0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.8,0,0,0.5,0,0,0,0.5,0],"Synesthesia Pulse":[0.4,0,0,0.7,0.4,0,0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.7,0,0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.6,0,0,0,0,0,0,0.4],"Thermal Hallucination":[0,0.5,0,0,0.5,0,0.4,0,0,0,0,0.4,0,0,0,0,0,0,0.4,0,0.4,0,0,0,0,0,0,0,0,0,0,0,0,0,0.9,0,0,0,0,0,0,0,0,0,0,0],"Overwhelming":[0.8,0.8,0.8,0.9,0.7,0.6,0.6,0.5,0,0,0.4,0,0.6,0,0,0.5,0.5,0.5,0.6,0.5,0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.6,0,0,0,0,0,0,0,0,0],"Off":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]};
/* Effects 24-33 are the glitch effects. They stay in the shader (so indexes match the web app
   and saved presets) but are hidden and forced to zero in this psychedelic-only edition. */
const HIDDEN=new Set([24,25,26,27,28,29,30,31,32,33]);
const VISIBLE=N.map((_,i)=>i).filter(i=>!HIDDEN.has(i));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,+v||0));
const MOVES=['none','handheld','breathe','spiral','orbit','sway','dutch','figure8','drift'];
const FBD={on:false,echoes:8,amt:.85,zoom:.94,rot:3,x:0,y:0,soft:.5,glow:.5,fringe:.4,hue:4,sat:.4,edge:.5,noise:.3,move:'none',mspeed:1,kon:false,kcol:'#00ff00',ktol:.22,ksoft:.1};
const CAMD={x:0,y:0,d:1.2,yaw:0,pitch:0,roll:0,fov:45.2};
function normCam(c){c=c||{};const g=(k,a,b)=>clamp(c[k]==null?CAMD[k]:c[k],a,b);return{x:g('x',-.8,.8),y:g('y',-.8,.8),d:g('d',.6,3),yaw:g('yaw',-40,40),pitch:g('pitch',-35,35),roll:g('roll',-180,180),fov:g('fov',15,90)}}
function camMat(c){const D=Math.PI/180,y=-c.yaw*D,p=c.pitch*D,r=c.roll*D,cy=Math.cos(y),sy=Math.sin(y),cp=Math.cos(p),sp=Math.sin(p),cr=Math.cos(r),sr=Math.sin(r);
 const Ry=[cy,0,sy,0,1,0,-sy,0,cy],Rx=[1,0,0,0,cp,-sp,0,sp,cp],Rz=[cr,-sr,0,sr,cr,0,0,0,1];
 const m=(A,B)=>{const o=[];for(let i=0;i<3;i++)for(let j=0;j<3;j++)o[i*3+j]=A[i*3]*B[j]+A[i*3+1]*B[3+j]+A[i*3+2]*B[6+j];return o};return m(m(Ry,Rx),Rz)}
function normFb(f){f=f||{};const c=(k,a,b)=>clamp(f[k]==null?FBD[k]:f[k],a,b);
 const rects=(Array.isArray(f.rects)?f.rects:[]).filter(r=>Array.isArray(r)&&r.length===4&&r.every(Number.isFinite)).slice(0,6).map(r=>{const a=r.map(x=>clamp(x,0,1));return[Math.min(a[0],a[2]),Math.min(a[1],a[3]),Math.max(a[0],a[2]),Math.max(a[1],a[3])]});
 return{cam:normCam(f.cam),on:!!f.on,echoes:Math.round(c('echoes',2,25)),amt:c('amt',0,1),zoom:c('zoom',.7,1.3),rot:c('rot',-60,60),x:c('x',-.15,.15),y:c('y',-.15,.15),soft:c('soft',0,1),glow:c('glow',0,1),fringe:c('fringe',0,1),hue:c('hue',-30,30),sat:c('sat',0,1),edge:c('edge',0,1),noise:c('noise',0,1),
  move:MOVES.includes(f.move)?f.move:'none',mspeed:c('mspeed',.2,3),kon:!!f.kon,kcol:/^#[0-9a-f]{6}$/i.test(f.kcol)?f.kcol:FBD.kcol,ktol:c('ktol',0,.6),ksoft:c('ksoft',0,.3),rects}}
function defaults(){return{fb:normFb(null),act:true,master:1,speed:1,drift:false,scale:.75,fps:30,mode:'page',comp:.12,on:N.map(()=>true),val:BUILTIN.Light.slice()}}
function normalize(s){
  const d=defaults();s=s||{};
  const o={act:s.act!==false,master:clamp(s.master==null?1:s.master,0,1.5),speed:clamp(s.speed==null?1:s.speed,.2,2),drift:!!s.drift,
    scale:[1,.75,.5,.35].includes(+s.scale)?+s.scale:d.scale,fps:[15,24,30,60].includes(+s.fps)?+s.fps:d.fps,mode:s.mode==='lite'?'lite':'page',comp:clamp(s.comp==null?d.comp:s.comp,0,.8),
    on:N.map((_,i)=>Array.isArray(s.on)?s.on[i]!==false:true),val:N.map((_,i)=>Array.isArray(s.val)?clamp(s.val[i],0,1):d.val[i])};
  o.fb=normFb(s.fb);
  HIDDEN.forEach(i=>{o.val[i]=0;o.on[i]=false});
  return o}
/* A preset = {names,on,val,master?,speed?}. Matching is by effect NAME so presets from the web app
   (36 or 46 effects) import correctly; anything unknown or hidden (glitch) is dropped. */
function presetToState(S,p,withMS){
  const val=N.map(()=>0),on=N.map(()=>false);
  N.forEach((n,i)=>{const j=Array.isArray(p.names)?p.names.indexOf(n):i;
    if(j>=0&&!HIDDEN.has(i)){val[i]=clamp(p.val[j],0,1);on[i]=Array.isArray(p.on)?p.on[j]!==false:true}});
  S.val=val;S.on=on;
  if(withMS){if(p.master!=null)S.master=clamp(p.master,0,1.5);if(p.speed!=null)S.speed=clamp(p.speed,.2,2);if(p.fb)S.fb=normFb(p.fb)}
  return S}
function stateToPreset(S,name){return{app:'psychtabber',v:2,name:name||'',names:N.slice(),on:S.on.slice(),val:S.val.map(v=>+(+v).toFixed(3)),master:S.master,speed:S.speed,fb:S.fb}}
function validPreset(p){return p&&typeof p==='object'&&Array.isArray(p.val)&&p.val.length>0&&p.val.every(v=>typeof v==='number'||v==null)}
g.PS={normCam,camMat,CAMD,normFb,MOVES,N,BUILTIN,HIDDEN,VISIBLE,defaults,normalize,presetToState,stateToPreset,validPreset,clamp};
})(typeof self!=='undefined'?self:window);
