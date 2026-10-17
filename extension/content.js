/* PsychTabber page script. Everything is drawn ON the tab, never in another window.
   1. Full shader: capture this tab, limit the capture to <body> with Element Capture (so our overlay never
      sees itself), render the WebGL shader on a click-through canvas above the page.
      Route A = tabCapture stream (silent). Route B = Chrome's "share this tab" prompt (one confirm).
   2. Reduced mode (lite.js): no capture at all, CSS backdrop-filter + SVG filter on the tab. Starts at once
      whenever the full shader can't, and a banner offers the upgrade. Exact errors are kept in ps_diag. */
(()=>{
if(window.__psychCS)return;window.__psychCS=true;
let eng=null,stream=null,cv=null,vid=null,rv=null,pr=null,keep=null,lite=null,banner=null,toastEl=null,toastT=0,gen=0,L=[],mode='',lastKey='',lastFps=0,lastErr='';
const send=m=>{try{chrome.runtime.sendMessage(m).catch(()=>{})}catch(e){}};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const errs=e=>((e&&e.name)?e.name+': ':'')+((e&&e.message)||String(e));
const top=el=>{try{el.setAttribute('popover','manual');document.documentElement.appendChild(el);el.showPopover()}catch(e){el.removeAttribute('popover');document.documentElement.appendChild(el)}};
const unpop=el=>{try{el.matches(':popover-open')&&el.hidePopover()}catch(e){}el.remove()};
function note(s){L.push(s);if(L.length>40)L.shift();try{chrome.storage.local.set({ps_diag:{at:Date.now(),host:location.host,secure:isSecureContext,lines:L.slice()}})}catch(e){}}
function cleanupFull(){
 if(eng){try{eng.destroy()}catch(e){}eng=null}
 if(stream){stream.getTracks().forEach(t=>{t.onended=null;try{t.stop()}catch(e){}});stream=null}
 stopProc();if(keep){keep.remove();keep=null}
 if(rv){rv.srcObject=null;rv.remove();rv=null}
 if(vid&&vid.frame){try{vid.frame.close()}catch(e){}}vid=null;
 lastKey='';
 if(cv){unpop(cv);cv=null}}
const stopLite=()=>{if(lite){try{lite.destroy()}catch(e){}lite=null}};
const hideBanner=()=>{if(banner){unpop(banner);banner=null}};
const hideToast=()=>{clearTimeout(toastT);if(toastEl){unpop(toastEl);toastEl=null}};
function stopAll(){gen++;camOn=false;endDraw();cleanupFull();stopLite();hideBanner();hideToast();mode=''}
const FIX='all:unset!important;display:block!important;position:fixed!important;margin:0!important;padding:0!important;border:0!important;pointer-events:none!important;z-index:2147483647!important;opacity:1!important;visibility:visible!important;transform:none!important;filter:none!important;mix-blend-mode:normal!important;max-width:none!important;max-height:none!important;inset:auto!important;';
const CARD='background:#241633!important;color:#fff!important;font:13px/1.45 system-ui,sans-serif!important;padding:12px 14px!important;border-radius:10px!important;box-shadow:0 6px 30px #000a!important;border:1px solid #8e3ccb!important;';
function toast(msg,ms){hideToast();toastEl=document.createElement('div');toastEl.setAttribute('data-psychtabber','1');
 toastEl.style.cssText=FIX+CARD+'left:16px!important;bottom:16px!important;max-width:340px!important;';toastEl.textContent=msg;top(toastEl);toastT=setTimeout(hideToast,ms||7000)}
function place(el,x,y,w,h){el.style.cssText=FIX+`background:transparent!important;left:${x}px!important;top:${y}px!important;width:${w}px!important;height:${h}px!important`}
/* Visible part of <body> in viewport coordinates, plus how the captured frame maps onto it. */
function region(){
 const de=document.documentElement,b=document.body;if(!b)return null;
 const vw=de.clientWidth,vh=de.clientHeight,r=b.getBoundingClientRect();
 const x0=Math.max(0,r.left),y0=Math.max(0,r.top),x1=Math.min(vw,r.right),y1=Math.min(vh,r.bottom);
 if(x1-x0<8||y1-y0<8){const h=de.getBoundingClientRect();return{r:h,x0:0,y0:0,x1:vw,y1:vh}} /* body has no visible box (YouTube etc.): use the whole viewport */
 return{r,x0,y0,x1,y1}}
function geom(){
 const g=region();if(!g||!vid||!vid.videoWidth){cv&&cv.style.setProperty('display','none','important');lastKey='';return null}
 const{r,x0,y0,x1,y1}=g,k=x0+','+y0+','+x1+','+y1;if(k!==lastKey){lastKey=k;place(cv,x0,y0,x1-x0,y1-y0)}
 const va=vid.videoWidth/vid.videoHeight,ar=(x1-x0)/(y1-y0),fa=r.width/r.height;
 let R=null,pw=vid.videoWidth,ph=vid.videoHeight;
 if(Math.abs(va/ar-1)>.04&&Math.abs(va/fa-1)<=.04){
  const xl=(x0-r.left)/r.width,xr=(x1-r.left)/r.width,yt=(y0-r.top)/r.height,yb=(y1-r.top)/r.height;
  R=[xl,1-yb,xr-xl,yb-yt];pw=vid.videoWidth*R[2];ph=vid.videoHeight*R[3]}
 return{pw,ph,R}}
/* Draws a magenta patch and checks whether it shows up in our own captured frames (= feedback loop). Returns 'ok'|'noframes'|'feedback'. */
async function selfTest(){
 const t0=Date.now();while(!(vid.videoWidth&&region())&&Date.now()-t0<4000)await wait(60);
 const g=region();if(!g||!vid.videoWidth)return'noframes';
 const tc=document.createElement('canvas');tc.width=tc.height=64;const x=tc.getContext('2d');x.fillStyle='#f0f';x.fillRect(16,16,32,32);
 place(tc,g.x0,g.y0,g.x1-g.x0,g.y1-g.y0);top(tc);
 const pc=document.createElement('canvas');pc.width=pc.height=8;const px=pc.getContext('2d',{willReadFrequently:true});
 let bad=false;const t1=Date.now();
 while(Date.now()-t1<1000&&!bad){await wait(70);
  try{let n=0;for(const[fx,fy]of[[.5,.5],[.42,.42],[.58,.58],[.42,.58],[.58,.42]]){
   px.drawImage(vid.frame||vid,vid.videoWidth*fx-1,vid.videoHeight*fy-1,2,2,0,0,2,2);const d=px.getImageData(0,0,1,1).data;if(d[0]>170&&d[2]>170&&d[1]<100)n++}
   if(n>=3)bad=true}catch(e){}}
 unpop(tc);return bad?'feedback':'ok'}
/* Second frame path: read frames straight from the track (WebCodecs) in case the <video> element never paints. */
function stopProc(){if(pr){pr.on=false;try{pr.rd.cancel()}catch(e){}pr=null}}
function startProc(tr){
 try{if(typeof MediaStreamTrackProcessor==='undefined'){note('MediaStreamTrackProcessor missing');return null}
  const sh={readyState:4,videoWidth:0,videoHeight:0,frame:null,n:0,on:true,rd:null};
  sh.rd=new MediaStreamTrackProcessor({track:tr}).readable.getReader();pr=sh;
  (async()=>{try{while(sh.on){const r=await sh.rd.read();if(r.done)break;const f=r.value;if(!sh.on){f.close();break}
    const o=sh.frame;sh.frame=f;sh.videoWidth=f.displayWidth||f.codedWidth;sh.videoHeight=f.displayHeight||f.codedHeight;sh.n++;if(o)try{o.close()}catch(e){}}}catch(e){note('processor: '+errs(e))}})();
  return sh}catch(e){note('processor failed: '+errs(e));return null}}
/* Waits until either the <video> or the track reader delivers a frame; picks the one that works. */
async function firstFrame(ms){const t0=Date.now();let kicked=0;
 while(Date.now()-t0<ms){
  if(rv&&rv.videoWidth>0&&rv.readyState>=2){vid=rv;stopProc();return'video'}
  if(pr&&pr.videoWidth>0){vid=pr;return'processor'}
  const e=Date.now()-t0;if(e>2500*(kicked+1)&&kicked<4){kicked++;rv&&rv.play().catch(()=>{})}
  await wait(80)}
 return''}
/* A permanently animating 1px element inside <body>: forces Chrome to keep producing frames of the restricted capture even on static pages. */
function keepAlive(){if(keep||!document.body)return;keep=document.createElement('i');keep.setAttribute('data-psychtabber','1');
 const id='psychtabber-ka';if(!document.getElementById(id)){const s=document.createElement('style');s.id=id;s.textContent='@keyframes psychka{0%{opacity:.011}100%{opacity:.02}}';document.documentElement.appendChild(s)}
 keep.style.cssText='position:fixed;left:0;top:0;width:2px;height:2px;background:#888;pointer-events:none;z-index:2147483000;animation:psychka .5s linear infinite alternate';document.body.appendChild(keep)}
async function run(st,tr0){ /* stream is already restricted */
 const tr=stream.getVideoTracks()[0];
 stopProc();if(rv){rv.srcObject=null;rv.remove();rv=null}vid=null;
 rv=document.createElement('video');rv.muted=true;rv.playsInline=true;rv.autoplay=true;rv.srcObject=stream;
 rv.style.cssText='position:fixed;left:0;top:0;width:64px;height:64px;opacity:.02;pointer-events:none;z-index:-1';document.documentElement.appendChild(rv);
 rv.play().catch(e=>note('video.play rejected: '+errs(e)));
 startProc(tr);keepAlive();
 const ff=await firstFrame(tr0||8000),se=tr.getSettings?tr.getSettings():{};
 note('first frame: '+(ff||'NONE')+'; size '+(vid?vid.videoWidth+'x'+vid.videoHeight:'-')+'; track '+tr.readyState+(tr.muted?' (muted)':'')+'; settings '+(se.width||'?')+'x'+(se.height||'?')+' @'+(se.frameRate||'?')+'fps');
 if(!ff){stopProc();return{ok:false,nf:1,msg:'No video frame arrived (track '+tr.readyState+(tr.muted?', muted':'')+').'}}
 const t=await selfTest();note('self-test: '+t);
 if(t==='noframes')return{ok:false,msg:'The captured stream delivered no frames.'};
 if(t==='feedback')return{ok:false,fb:1,msg:'Element Capture did not keep the overlay out of its own capture.'};
 cv=document.createElement('canvas');cv.setAttribute('aria-hidden','true');cv.setAttribute('data-psychtabber','1');place(cv,0,0,1,1);top(cv);
 try{eng=new PsychEngine(cv,{geom,onVals:v=>send({t:'vals',val:v}),onError:()=>{stopAll();send({t:'ended'})}})}
 catch(e){return{ok:false,msg:'WebGL: '+errs(e)}}
 eng.setState(st);eng.attach(vid);eng.start();
 tr.onended=()=>{stopAll();send({t:'ended'})};
 return{ok:true}}
async function restrict(tr,el){
 if(typeof RestrictionTarget==='undefined')throw new Error('RestrictionTarget missing (Element Capture needs Chrome 132+ and a secure page)');
 if(typeof tr.restrictTo!=='function')throw new Error('track.restrictTo missing');
 if(!document.body)throw new Error('page has no <body>');
 await tr.restrictTo(await RestrictionTarget.fromElement(el||document.body))}

/* ---- Camera keys + cut-out drawing (feedback effect) ---- */
let camOn=false,drawEl=null;
const KEYS={ArrowLeft:'l',Numpad4:'l',ArrowRight:'r',Numpad6:'r',ArrowUp:'u',Numpad8:'u',ArrowDown:'d',Numpad2:'d',NumpadAdd:'rr',Equal:'rr',NumpadSubtract:'rl',Minus:'rl',PageUp:'zi',Numpad9:'zi',PageDown:'zo',Numpad3:'zo'};
const editable=t=>t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
function toggleCam(){if(!eng){toast('Camera keys need the full shader (press the purple button first).',4000);return false}
 camOn=!camOn;if(!camOn){eng.keys={};toast('Camera keys off. Arrow keys scroll the page again.',3500)}
 else toast('Camera ON: arrows or numpad 8/4/6/2 move, + / - rotate, PgUp/PgDn zoom, Shift = faster, R or numpad 5 resets. Alt+Shift+C exits.',9000);return camOn}
function onKey(e,down){
 if(down&&e.altKey&&e.shiftKey&&e.code==='KeyC'){e.preventDefault();e.stopPropagation();toggleCam();return}
 if(drawEl){if(down&&(e.key==='Escape'||e.key==='Enter')){e.preventDefault();e.stopPropagation();endDraw()}return}
 const k=KEYS[e.code],r=e.code==='KeyR'||e.code==='Numpad5';
 if(!eng||(!k&&!r))return;
 if(!down){if(k)eng.keys[k]=false;return}
 if(!camOn||editable(e.target)||e.ctrlKey||e.metaKey||(e.altKey&&!e.shiftKey))return;
 e.preventDefault();e.stopPropagation();eng.keys.fast=e.shiftKey;if(r)eng.resetCam();else eng.keys[k]=true}
addEventListener('keydown',e=>onKey(e,true),true);addEventListener('keyup',e=>onKey(e,false),true);addEventListener('blur',()=>{if(eng)eng.keys={}});
function endDraw(){if(drawEl){const e=drawEl;drawEl=null;e._off&&e._off();unpop(e)}}
async function saveRects(fn){const st=await getState();fn(st.fb.rects);chrome.storage.local.set({ps_state:st})}
function startDraw(){
 if(!eng||!region()){toast('Cut-outs need the full shader (press the purple button first).',4000);return false}
 endDraw();camOn&&toggleCam();
 const el=document.createElement('div');el.setAttribute('data-psychtabber','1');
 el.style.cssText=FIX+'left:0!important;top:0!important;width:100vw!important;height:100vh!important;pointer-events:auto!important;cursor:crosshair!important;background:rgba(142,60,203,.10)!important;';
 const hint=document.createElement('div');hint.textContent='Drag to cut a see-through window. Right-click removes the last one. Esc or Enter when done.';
 hint.style.cssText='position:fixed;left:50%;top:14px;transform:translateX(-50%);'+CARD+'pointer-events:none;';
 const box=document.createElement('div');box.style.cssText='position:fixed;display:none;border:2px dashed #fff;background:rgba(255,255,255,.18);pointer-events:none;';
 el.append(hint,box);let sx=0,sy=0,dr=false;
 el.onpointerdown=e=>{if(e.button!==0)return;dr=true;sx=e.clientX;sy=e.clientY;try{el.setPointerCapture(e.pointerId)}catch(x){}e.preventDefault()};
 el.onpointermove=e=>{if(!dr)return;const x=Math.min(sx,e.clientX),y=Math.min(sy,e.clientY);box.style.cssText='position:fixed;display:block;border:2px dashed #fff;background:rgba(255,255,255,.18);pointer-events:none;left:'+x+'px;top:'+y+'px;width:'+Math.abs(e.clientX-sx)+'px;height:'+Math.abs(e.clientY-sy)+'px';};
 el.onpointerup=e=>{if(!dr)return;dr=false;box.style.display='none';const g=region();if(!g)return;
  const W=g.x1-g.x0,H=g.y1-g.y0,nx=x=>Math.max(0,Math.min(1,(x-g.x0)/W)),ny=y=>Math.max(0,Math.min(1,(y-g.y0)/H));
  const r=[Math.min(nx(sx),nx(e.clientX)),Math.min(ny(sy),ny(e.clientY)),Math.max(nx(sx),nx(e.clientX)),Math.max(ny(sy),ny(e.clientY))];
  if(r[2]-r[0]>.01&&r[3]-r[1]>.01)saveRects(a=>{if(a.length<6)a.push(r)})};
 el.oncontextmenu=e=>{e.preventDefault();saveRects(a=>a.pop())};
 top(el);drawEl=el;return true}
const getState=async()=>PS.normalize((await chrome.storage.local.get('ps_state')).ps_state);
function startLite(st){stopLite();lite=new PsychLite({onVals:v=>send({t:'vals',val:v})});lite.setState(st);lite.start();mode='lite';note('Reduced mode running')}
/* Route B: Chrome's own "share this tab" prompt, started from the banner click. */
async function bodyTry(){
 const tr=stream.getVideoTracks()[0];
 try{await restrict(tr,document.documentElement);note('B: retargeted to <html>')}catch(e){return{ok:false,msg:'retarget: '+errs(e)}}
 try{return await run(await getState(),12000)}catch(e){return{ok:false,msg:errs(e)}}}
async function routeB(my){
 const track=()=>stream.getVideoTracks()[0];
 stopLite(); /* free the GPU while Chrome shows its prompt; restarted below if the full shader doesn't come up */
 try{
  stream=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:{ideal:30,max:30}},audio:false,preferCurrentTab:true,selfBrowserSurface:'include',surfaceSwitching:'exclude',monitorTypeSurfaces:'exclude'});
  note('B: share granted');
  const bb=document.body.getBoundingClientRect(),tgt=(bb.width<8||bb.height<8)?document.documentElement:document.body;
  await restrict(track(),tgt);note('B: Element Capture accepted ('+(tgt===document.body?'body':'html')+')');
  let r=await run(await getState(),9000);
  if(!r.ok&&r.nf&&my===gen){ /* body produced nothing: retarget the same track at the whole page and wait again */
   note('B: retry with <html> target');const bt=await bodyTry();r=bt}
  if(my!==gen){cleanupFull();return false}
  if(r.ok){stopLite();hideBanner();mode='full';capFps(await getState());note('B: full shader running');send({t:'mode',mode:'full'});return true}
  lastErr=r.msg;note('B: '+r.msg)
 }catch(e){lastErr=errs(e);note('B failed: '+lastErr)}
 cleanupFull();
 if(my===gen&&!lite)startLite(await getState());
 return false}
function showBanner(my,msg,again){
 hideBanner();banner=document.createElement('div');banner.setAttribute('data-psychtabber','1');
 banner.style.cssText=FIX+CARD+'right:16px!important;top:16px!important;pointer-events:auto!important;width:290px!important;';
 const m=document.createElement('div');m.style.cssText='all:revert;display:block;margin-bottom:8px;font:inherit;color:inherit';
 const b0=document.createElement('b');b0.textContent='PsychTabber ';m.append(b0,document.createTextNode(msg));
 const go=document.createElement('button'),no=document.createElement('button');
 go.textContent=again?'Try full shader again':'Full shader';no.textContent='Keep reduced';
 go.style.cssText='all:revert;font:inherit;padding:6px 12px;margin-right:8px;background:#8e3ccb;color:#fff;border:0;border-radius:6px;cursor:pointer';
 no.style.cssText='all:revert;font:inherit;padding:6px 12px;background:#3a3a46;color:#fff;border:0;border-radius:6px;cursor:pointer';
 go.onclick=async()=>{go.disabled=true;go.textContent='Waiting for Chrome…';const ok=await routeB(my);if(!ok&&my===gen)showBanner(my,'Full shader failed: '+(lastErr||'unknown')+' Reduced mode stays on.',true)};
 no.onclick=hideBanner;banner.append(m,go,no);top(banner)}
async function start(quiet){
 stopAll();const my=gen;L=[];lastErr='';note('Start on '+location.host+(isSecureContext?'':' (not a secure page)'));
 const st=await getState();
 startLite(st); /* always something on the tab at once; the full shader is an upgrade */
 if(st.mode==='lite')return{ok:true,mode:'lite',log:L,reason:'You chose reduced mode.'};
 const canB=!!(navigator.mediaDevices&&navigator.mediaDevices.getDisplayMedia&&typeof RestrictionTarget!=='undefined');
 if(canB){if(!quiet)showBanner(my,'is running in reduced mode. Press the button, then choose Share for this tab, to get the full shader.')}
 else note('Full shader unavailable here: '+(navigator.mediaDevices?'this Chrome has no Element Capture (needs 132+)':'page is not HTTPS'));
 return{ok:true,mode:'lite',offer:canB&&!quiet,log:L,reason:canB?'':'full shader unavailable on this page'}}
function stop(){stopAll()}
function capFps(st){const f=st.fps;if(!stream||f===lastFps)return;lastFps=f;try{stream.getVideoTracks()[0].applyConstraints({frameRate:{ideal:f,max:f}}).catch(()=>{})}catch(e){}}
chrome.storage.onChanged.addListener((c,a)=>{if(a==='local'&&c.ps_state){if(eng){eng.setState(c.ps_state.newValue);capFps(PS.normalize(c.ps_state.newValue))}if(lite)lite.setState(c.ps_state.newValue)}});
chrome.runtime.onMessage.addListener((m,s,reply)=>{
 if(!m||!m.t)return;
 if(m.t==='start'){start(m.quiet).then(reply,e=>{note('start crashed: '+errs(e));reply({ok:false,code:'err',msg:errs(e)})});return true}
 if(m.t==='stop'){stop();reply({ok:true})}
 if(m.t==='cam'){reply({ok:true,on:toggleCam()})}
 if(m.t==='draw'){reply({ok:startDraw()})}
 if(m.t==='ping')reply({ok:true,running:!!(eng||lite),pending:!!banner,mode})});
})();
