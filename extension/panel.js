const $=id=>document.getElementById(id),{N,VISIBLE,BUILTIN}=PS;
let S=PS.normalize(null),USER={},tabId=null,saveT=0,curPre='';
const say=(t,ok)=>{const e=$('st');e.textContent=t||'';e.className='st'+(ok?' ok':'')};
$('fx').innerHTML=VISIBLE.map(i=>`<div class="row"><input type="checkbox" id="c${i}" aria-label="${N[i]} on"><label for="s${i}" title="${N[i]}">${N[i]}</label><input type="range" id="s${i}" min="0" max="1" step=".01"></div>`).join('');
function sync(){$('act').checked=S.act;$('master').value=S.master;$('speed').value=S.speed;$('comp').value=S.comp;$('drift').checked=S.drift;$('scale').value=String(S.scale);$('fps').value=S.fps;$('mode').value=S.mode;
 VISIBLE.forEach(i=>{$('s'+i).value=S.val[i];$('c'+i).checked=S.on[i]});if(window.syncFb)syncFb()}
function save(now){clearTimeout(saveT);const go=()=>chrome.storage.local.set({ps_state:S});if(now)go();else saveT=setTimeout(go,120)}
function fillPresets(){const u=Object.keys(USER).sort((a,b)=>a.localeCompare(b));
 $('pre').innerHTML='<option value="">Choose a preset…</option><optgroup label="Built-in">'+Object.keys(BUILTIN).map(k=>`<option value="b:${k}">${k}</option>`).join('')+'</optgroup>'+
 (u.length?'<optgroup label="My presets">'+u.map(k=>`<option value="u:${k.replace(/"/g,'&quot;')}">${k.replace(/</g,'&lt;')}</option>`).join('')+'</optgroup>':'');
 $('pre').value=curPre;if($('pre').value!==curPre)curPre='';$('pdel').disabled=!curPre.startsWith('u:')}
const saveUser=()=>chrome.storage.local.set({ps_user:USER});
$('pre').onchange=e=>{const v=e.target.value;curPre=v;
 if(v.startsWith('b:')){PS.presetToState(S,{names:N,val:BUILTIN[v.slice(2)],on:null});S.on=S.on.map((x,i)=>!PS.HIDDEN.has(i))}
 else if(v.startsWith('u:')){const p=USER[v.slice(2)];if(p){PS.presetToState(S,p,true);$('pname').value=v.slice(2)}}
 else{fillPresets();return}
 S=PS.normalize(S);sync();save(true);fillPresets()};
$('psave').onclick=()=>{const n=$('pname').value.trim();if(!n){say('Type a name for the preset first.');return}
 if(USER[n]===undefined&&Object.keys(USER).length>=200){say('Too many saved presets. Delete some first.');return}
 USER[n]=PS.stateToPreset(S,n);saveUser();curPre='u:'+n;fillPresets();say('Saved "'+n+'".',true)};
$('pdel').onclick=()=>{if(!curPre.startsWith('u:'))return;const n=curPre.slice(2);delete USER[n];saveUser();curPre='';fillPresets();say('Deleted "'+n+'".',true)};
const dl=(o,n)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o,null,1)],{type:'application/json'}));a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000)};
const fname=n=>(n||'preset').replace(/[^\w\- ]+/g,'').trim().replace(/\s+/g,'-')||'preset';
$('pexp').onclick=()=>{const n=$('pname').value.trim()||(curPre?curPre.slice(2):'')||'my-preset';dl(PS.stateToPreset(S,n),'psychtabber-'+fname(n)+'.json');say('Exported the current settings.',true)};
$('pexpall').onclick=()=>{const k=Object.keys(USER);if(!k.length){say('You have no saved presets yet. Use Save first.');return}
 dl({app:'psychtabber-bundle',v:2,presets:k.map(n=>({...USER[n],name:n}))},'psychtabber-presets.json');say('Exported '+k.length+' preset(s).',true)};
$('pimp').onclick=()=>$('pfile').click();
$('pfile').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
 try{const d=JSON.parse(await f.text());let list=[];
  if(Array.isArray(d.presets))list=d.presets.filter(PS.validPreset);else if(PS.validPreset(d))list=[{...d,name:d.name||f.name.replace(/\.json$/i,'').replace(/^psychtabber-/,'')||'Imported'}];
  if(!list.length)throw 0;
  list.forEach(p=>{const n=String(p.name||'Imported').slice(0,40);const t=PS.presetToState(PS.normalize(null),p,true);USER[n]=PS.stateToPreset(t,n)});
  saveUser();const last=String(list[list.length-1].name||'Imported').slice(0,40);curPre='u:'+last;$('pname').value=last;
  PS.presetToState(S,USER[last],true);S=PS.normalize(S);sync();save(true);fillPresets();say('Imported '+list.length+' preset(s). Loaded "'+last+'".',true)}
 catch(x){say('That file is not a PsychTabber / Dream Filter preset.')}};
$('act').onchange=e=>{S.act=e.target.checked;save()};
$('master').oninput=e=>{S.master=+e.target.value;save()};
$('speed').oninput=e=>{S.speed=+e.target.value;save()};
$('comp').oninput=e=>{S.comp=+e.target.value;save()};
$('drift').onchange=e=>{S.drift=e.target.checked;save(true)};
$('scale').onchange=e=>{S.scale=+e.target.value;save(true)};
$('fps').onchange=e=>{S.fps=+e.target.value;save(true)};
$('mode').onchange=e=>{S.mode=e.target.value;save(true);say('Takes effect the next time you start it on a tab.',true)};
VISIBLE.forEach(i=>{$('c'+i).onchange=e=>{S.on[i]=e.target.checked;save()};$('s'+i).oninput=e=>{S.val[i]=+e.target.value;save()}});
$('off').onclick=()=>{S.on=S.on.map(()=>false);sync();save(true)};
$('rnd').onclick=()=>{let n=0;VISIBLE.forEach(i=>{const a=Math.random()<.5;S.val[i]=a?+(Math.random()*.8).toFixed(2):0;S.on[i]=true;if(a)n++});
 for(let k=n;k<3;k++)S.val[VISIBLE[Math.floor(Math.random()*VISIBLE.length)]]=+(.2+Math.random()*.6).toFixed(2);sync();save(true)};
chrome.runtime.onMessage.addListener(m=>{if(m&&m.t==='vals'&&Array.isArray(m.val)&&S.drift){m.val.forEach((v,i)=>{if(!PS.HIDDEN.has(i)){S.val[i]=v;const e=$('s'+i);if(e)e.value=v}})}});
const showDiag=d=>{$('diag').textContent=d&&d.lines?('Page: '+d.host+(d.secure?'':'  (NOT https: capture unavailable)')+'\n'+d.lines.join('\n')):'Nothing yet.'};
chrome.storage.onChanged.addListener((c,a)=>{if(a==='local'&&c.ps_diag)showDiag(c.ps_diag.newValue)});
const WHY={inject:'Chrome only lets PsychTabber touch a tab after you click the PsychTabber toolbar icon on it (or press Alt+Shift+P there). Click the icon once while this tab is in front.',activeTab:'Chrome only lets PsychTabber capture a tab after you invoke it on that tab. Click the PsychTabber toolbar icon once while this tab is in front: that starts it. (Chrome pages, the Web Store and the new tab page can never be captured.)',
 blocked:"Chrome doesn't allow extensions on this page (chrome:// pages, the Web Store, the new tab page). Open a normal website."};
async function refresh(){try{const[t]=await chrome.tabs.query({active:true,currentWindow:true});tabId=t&&t.id;
 const r=tabId==null?{active:false}:await chrome.runtime.sendMessage({t:'status',tabId});
 const b=$('go');b.textContent=r&&r.active?'Stop on this tab':'Start on this tab';b.classList.toggle('stop',!!(r&&r.active));b.classList.toggle('pri',!(r&&r.active))}catch(e){}}
$('go').onclick=async()=>{await refresh();if(tabId==null)return;
 if($('go').classList.contains('stop')){await chrome.runtime.sendMessage({t:'stop',tabId});say('');return refresh()}
 say('Starting…',true);$('go').disabled=true;
 let r;try{r=await chrome.runtime.sendMessage({t:'start',tabId})}catch(e){r={ok:false,msg:String(e)}}
 $('go').disabled=false;
 if(r&&r.ok&&r.mode==='full')say('Running on this tab with the full shader.',true)
 else if(r&&r.ok)say(r.offer?'Running on this tab in reduced mode. Press "Full shader" in the purple box on the page, then choose Share for this tab.':'Running on this tab in reduced mode.'+(r.reason?' ('+r.reason+')':''),true)
 else say(WHY[r&&r.code]||('Could not start: '+((r&&r.msg)||'unknown error')));
 refresh()};
chrome.tabs.onActivated.addListener(()=>{say('');refresh()});chrome.tabs.onUpdated.addListener((id,c)=>{if(c.status)refresh()});setInterval(refresh,4000);
chrome.storage.onChanged.addListener((c,a)=>{if(a==='local'&&c.ps_user){USER=c.ps_user.newValue||{};fillPresets()}});


/* ---- 3D camera rig (reference scene; drives the real feedback camera) ---- */
(()=>{const cv=$('sim'),x=cv.getContext('2d'),W=cv.width,H=cv.height,A=16/9,FL=H*1.25,FLOOR=-.75;
 const E=[2.3,1.1,3.4],TG=[0,-.1,1.1],sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],nrm=a=>{const l=Math.hypot(...a)||1;return a.map(v=>v/l)},crs=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const fw=nrm(sub(TG,E)),rt=nrm(crs(fw,[0,1,0])),up=crs(rt,fw);
 const P=p=>{const v=sub(p,E),z=dot(v,fw);if(z<.2)return null;return[W/2+dot(v,rt)/z*FL,H/2-dot(v,up)/z*FL]};
 const line=(a,b,c,w)=>{const p=P(a),q=P(b);if(!p||!q)return;x.strokeStyle=c;x.lineWidth=w||1;x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(q[0],q[1]);x.stroke()};
 const poly=(pts,fill,stroke)=>{const q=pts.map(P);if(q.some(v=>!v))return;x.beginPath();q.forEach((v,i)=>i?x.lineTo(v[0],v[1]):x.moveTo(v[0],v[1]));x.closePath();if(fill){x.fillStyle=fill;x.fill()}if(stroke){x.strokeStyle=stroke;x.lineWidth=1.2;x.stroke()}};
 window.drawSim=function(){const c=S.fb.cam,M=PS.camMat(c),pos=[c.x,c.y,c.d],tn=Math.tan(c.fov*Math.PI/360);
  const wl=l=>{const o=[M[0]*l[0]+M[1]*l[1]+M[2]*l[2],M[3]*l[0]+M[4]*l[1]+M[5]*l[2],M[6]*l[0]+M[7]*l[1]+M[8]*l[2]];return[pos[0]+o[0],pos[1]+o[1],pos[2]+o[2]]};
  x.clearRect(0,0,W,H);x.fillStyle='#121318';x.fillRect(0,0,W,H);
  for(let g=-3;g<=3.01;g+=.5){line([g,FLOOR,-1],[g,FLOOR,4],'#2a2c36');line([-3,FLOOR,g+1],[3,FLOOR,g+1],'#2a2c36')}
  line([0,-.55,0],[0,FLOOR,-.1],'#555');poly([[-.5,FLOOR,-.35],[.5,FLOOR,-.35],[.5,FLOOR,.25],[-.5,FLOOR,.25]],'#2b2d38','#444');
  poly([[-.96,-.58,0],[.96,-.58,0],[.96,.58,0],[-.96,.58,0]],'#26272e','#555');poly([[-.89,-.5,0],[.89,-.5,0],[.89,.5,0],[-.89,.5,0]],'#0b0b0e','#3a3b46');
  const hit=[];let ok=true;for(const[sx,sy]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const l=[sx*tn*A,sy*tn,-1],d=[M[0]*l[0]+M[1]*l[1]+M[2]*l[2],M[3]*l[0]+M[4]*l[1]+M[5]*l[2],M[6]*l[0]+M[7]*l[1]+M[8]*l[2]];
   if(d[2]>-.02){ok=false;break}const t=-pos[2]/d[2];hit.push([pos[0]+t*d[0],pos[1]+t*d[1],0])}
  if(ok){poly(hit,'rgba(80,200,255,.16)','#5cd0ff');hit.forEach((h,i)=>line(wl([[-1,-1],[1,-1],[1,1],[-1,1]][i].map((v,j)=>v*[.07,.05][j]).concat([-.1])),h,'rgba(92,208,255,.35)'))}
  [[-.4,-.4],[.4,-.4],[0,.4]].forEach(l=>line(pos,[pos[0]+l[0]*.5,FLOOR,pos[2]+l[1]],'#666',1.5));
  const bx=[-.13,.13],by=[-.09,.09],bz=[-.1,.3],cs=[];for(const a of bx)for(const b of by)for(const d of bz)cs.push(wl([a,b,d]));
  [[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]].forEach(e=>line(cs[e[0]],cs[e[1]],'#ffb347',1.6));
  const ring=[];for(let i=0;i<20;i++){const a=i/20*6.283;ring.push(wl([Math.cos(a)*.07,Math.sin(a)*.07,-.16]))}poly(ring,'rgba(40,40,60,.9)','#ddd');
  const ec=wl([0,0,-.16]);line(wl([0,0,-.1]),ec,'#ddd');
  $('simt').textContent=`Aim ${c.yaw.toFixed(0)}° / ${c.pitch.toFixed(0)}°  ·  Roll ${c.roll.toFixed(0)}°  ·  Lens ${c.fov.toFixed(0)}°  ·  Distance ${c.d.toFixed(2)}`};
 let dr=null,t=0;const put=()=>{S.fb.cam=PS.normCam(S.fb.cam);drawSim();if(!t)t=setTimeout(()=>{t=0;chrome.storage.local.set({ps_state:S})},45)};
 cv.addEventListener('pointerdown',e=>{dr={x:e.clientX,y:e.clientY,b:e.button};cv.setPointerCapture(e.pointerId);cv.style.cursor='grabbing';e.preventDefault()});
 cv.addEventListener('pointermove',e=>{if(!dr)return;const dx=e.clientX-dr.x,dy=e.clientY-dr.y;dr.x=e.clientX;dr.y=e.clientY;const c=S.fb.cam;
  if(dr.b===2||e.shiftKey){c.x+=dx*.004;c.y-=dy*.004}else if(dr.b===1||e.altKey){c.roll+=dx*.4}else{c.yaw+=dx*.2;c.pitch-=dy*.2}put()});
 cv.addEventListener('pointerup',()=>{dr=null;cv.style.cursor='grab'});cv.addEventListener('contextmenu',e=>e.preventDefault());
 cv.addEventListener('wheel',e=>{e.preventDefault();const c=S.fb.cam,k=Math.exp(Math.max(-100,Math.min(100,e.deltaY))*.0012);if(e.ctrlKey||e.shiftKey)c.d*=k;else c.fov*=k;put()},{passive:false});
 const reset=()=>{S.fb.cam=PS.normCam(null);put()};cv.addEventListener('dblclick',reset);$('simreset').onclick=reset})();
/* ---- camera feedback + cut-outs ---- */
const FSL=[['echoes','Echoes (25 = endless)',2,25,1],['amt','Feedback strength',0,1,.01],['zoom','Zoom per pass',.7,1.3,.005],['rot','Rotation per pass (°)',-60,60,.5],['x','Shift X',-.15,.15,.005],['y','Shift Y',-.15,.15,.005],['soft','Lens softness',0,1,.01],['glow','Glow / halation',0,1,.01],['fringe','Colour fringe',0,1,.01],['hue','Hue shift per pass (°)',-30,30,.5],['sat','Colour build-up',0,1,.01],['edge','Screen curve + vignette',0,1,.01],['noise','Sensor grain',0,1,.01],['mspeed','Movement speed',.2,3,.05]];
const KSL=[['ktol','Key tolerance',0,.6,.005],['ksoft','Key softness / edge feather',0,.3,.005]];
const rowH=a=>`<div class="row g"><label for="f_${a[0]}">${a[1]} <b id="v_${a[0]}"></b></label><input type="range" id="f_${a[0]}" min="${a[2]}" max="${a[3]}" step="${a[4]}"></div>`;
$('fbx').innerHTML=FSL.slice(0,13).map(rowH).join('');$('fbk').innerHTML=KSL.map(rowH).join('');
$('f_move').innerHTML=PS.MOVES.map(m=>`<option value="${m}">${m==='none'?'None (static camera)':m[0].toUpperCase()+m.slice(1)}</option>`).join('');
$('fbx').insertAdjacentHTML('beforeend',rowH(FSL[13]).replace(/(<div class="row g">)/,'$1'));
const lab=k=>{const e=$('v_'+k);if(e)e.textContent=k==='echoes'&&S.fb.echoes>=25?'∞':S.fb[k]};
window.syncFb=function(){const f=S.fb;$('f_on').checked=f.on;$('f_kon').checked=f.kon;$('f_kcol').value=f.kcol;$('f_move').value=f.move;
 FSL.concat(KSL).forEach(a=>{$('f_'+a[0]).value=f[a[0]];lab(a[0])});if(window.drawSim)drawSim();$('rcount').textContent=f.rects.length?f.rects.length+' cut-out(s) active (max 6).':'No cut-outs yet.'};const syncFb=window.syncFb;
FSL.concat(KSL).forEach(a=>{$('f_'+a[0]).oninput=e=>{S.fb[a[0]]=+e.target.value;lab(a[0]);save()}});
$('f_on').onchange=e=>{S.fb.on=e.target.checked;save(true)};$('f_kon').onchange=e=>{S.fb.kon=e.target.checked;save(true)};
$('f_kcol').oninput=e=>{S.fb.kcol=e.target.value;save()};$('f_move').onchange=e=>{S.fb.move=e.target.value;save(true)};
$('eye').onclick=async()=>{try{const r=await new EyeDropper().open();S.fb.kcol=r.sRGBHex;S.fb.kon=true;syncFb();save(true)}catch(x){say('Colour picker cancelled or not available. Use the colour box instead.')}};
const toTab=async(t,okTxt)=>{await refresh();if(tabId==null)return;try{const r=await chrome.tabs.sendMessage(tabId,{t});say(r&&r.ok?okTxt:'Start the filter on this tab first (full shader).',!!(r&&r.ok))}catch(x){say('Start the filter on this tab first (full shader).')}};
$('camk').onclick=()=>toTab('cam','Camera keys toggled. Click the page first if keys do nothing.');
$('rdraw').onclick=()=>toTab('draw','Drag on the page to cut out windows. Esc or Enter when done.');
$('rundo').onclick=()=>{S.fb.rects.pop();syncFb();save(true)};$('rclear').onclick=()=>{S.fb.rects=[];syncFb();save(true)};
chrome.storage.onChanged.addListener((c,a)=>{if(a==='local'&&c.ps_state&&c.ps_state.newValue&&c.ps_state.newValue.fb){const r=c.ps_state.newValue.fb.rects||[];if(JSON.stringify(r)!==JSON.stringify(S.fb.rects)){S.fb.rects=r;syncFb()}}});
(async()=>{const r=await chrome.storage.local.get(['ps_state','ps_user','ps_diag']);showDiag(r.ps_diag);S=PS.normalize(r.ps_state);USER=r.ps_user||{};sync();fillPresets();refresh()})();
