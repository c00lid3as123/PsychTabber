/* PsychTabber reduced mode: runs ON the tab with no screen capture at all.
   A fixed, click-through layer uses CSS backdrop-filter with a live SVG filter, so the real page underneath
   stays fully interactive. It covers a subset of the effects (warp, melting, breathing, lens, glow, haze,
   detail, chromatic split, double vision, color drift, spectral cycling, thermal, solarize, tint, brightness
   waves, vignette, visual snow). The full WebGL shader (all effects) needs tab capture. */
(function(g){
const NS='http://www.w3.org/2000/svg';
const cl=x=>Math.max(0,Math.min(1,x));
const sm=(a,b,x)=>{x=cl((x-a)/(b-a));return x*x*(3-2*x)};
const BASE='all:unset!important;display:block!important;position:fixed!important;left:0!important;top:0!important;right:0!important;bottom:0!important;margin:0!important;pointer-events:none!important;z-index:2147483647!important;';
const top=el=>{try{el.setAttribute('popover','manual');document.documentElement.appendChild(el);el.showPopover()}catch(e){el.removeAttribute('popover');document.documentElement.appendChild(el)}};
const mapUri=ar=>{const a=ar>=1?1:ar,b=ar>=1?1/ar:1,lo=v=>Math.round(127.5-127.5*v),hi=v=>Math.round(127.5+127.5*v);
 return 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><defs><linearGradient id="r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="rgb(${lo(a)},0,0)"/><stop offset="1" stop-color="rgb(${hi(a)},0,0)"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(0,${lo(b)},0)"/><stop offset="1" stop-color="rgb(0,${hi(b)},0)"/></linearGradient></defs><rect width="256" height="256" fill="#000"/><rect width="256" height="256" fill="url(#r)"/><rect width="256" height="256" fill="url(#g)" style="mix-blend-mode:screen"/></svg>`)};
const SNOW='url("data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="f" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" stitchTiles="stitch"/><feColorMatrix type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 0 1"/></filter><rect width="200" height="200" filter="url(#f)"/></svg>')+'")';
const M=(...v)=>v.join(' ');
class PsychLite{
 constructor(o){this.o=o||{};this.st=PS.normalize(null);this.val=this.st.val.slice();this.tg=null;this.dTick=0;this.tick=0;this.T=0;this.last=0;this.key='';this.e={};this.av={};this.ar=0;this.on=false;
  this.fid='psy'+Math.random().toString(36).slice(2,8);this.s=new Float32Array(46);
  this.svg=document.createElementNS(NS,'svg');this.svg.setAttribute('width','0');this.svg.setAttribute('height','0');this.svg.setAttribute('aria-hidden','true');this.svg.setAttribute('data-psychtabber','1');
  this.svg.style.cssText='position:absolute!important;width:0!important;height:0!important;pointer-events:none!important';
  document.documentElement.appendChild(this.svg);
  this.bd=this.layer('');this.snow=this.layer('background-image:'+SNOW+'!important;background-size:200px 200px!important;mix-blend-mode:overlay!important;display:none!important;');
  this.vig=this.layer('background:radial-gradient(ellipse farthest-corner at 50% 50%,rgba(0,0,0,0) 28%,rgba(0,0,0,1) 88%)!important;display:none!important;');
 }
 layer(css){const d=document.createElement('div');d.setAttribute('data-psychtabber','1');d.setAttribute('aria-hidden','true');d.style.cssText=BASE+css;top(d);return d}
 setState(s){this.st=PS.normalize(s);this.val=this.st.val.slice();if(!this.st.drift)this.tg=null}
 start(){if(this.on)return;this.on=true;this.last=performance.now();this.raf=requestAnimationFrame(t=>this.frame(t));this.tm=setInterval(()=>this.drift(),100)}
 drift(){if(!this.st.drift)return;
  if(!this.tg||++this.dTick>80){this.dTick=0;this.tg=PS.N.map((_,i)=>PS.HIDDEN.has(i)?0:(Math.random()<.5?Math.random()*.8:0))}
  for(let i=0;i<this.val.length;i++)this.val[i]+=(this.tg[i]-this.val[i])*.03;
  if(++this.tick%2===0&&this.o.onVals)this.o.onVals(this.val.map(v=>+v.toFixed(3)))}
 build(f){const id=this.fid;let x='',c='SourceGraphic';
  if(f.w){x+=`<feTurbulence id="tb1" type="fractalNoise" baseFrequency=".006" numOctaves="1" seed="3" result="n1"/><feDisplacementMap id="dw" in="${c}" in2="n1" scale="0" xChannelSelector="R" yChannelSelector="G" result="s1"/>`;c='s1'}
  if(f.cr){x+=`<feTurbulence id="tb2" type="fractalNoise" baseFrequency=".03" numOctaves="1" seed="8" result="n2"/><feDisplacementMap id="dc" in="${c}" in2="n2" scale="0" xChannelSelector="R" yChannelSelector="G" result="s2"/>`;c='s2'}
  if(f.br){x+=`<feImage id="bi" href="${mapUri(1.6)}" preserveAspectRatio="none" result="m"/><feDisplacementMap id="db" in="${c}" in2="m" scale="0" xChannelSelector="R" yChannelSelector="G" result="s3"/>`;c='s3'}
  if(f.gl){x+=`<feGaussianBlur id="gb" in="${c}" stdDeviation="4" result="gbl"/><feComposite id="gc" in="${c}" in2="gbl" operator="arithmetic" k1="0" k2="1" k3="0" k4="0" result="s4"/>`;c='s4'}
  if(f.sh){x+=`<feGaussianBlur in="${c}" stdDeviation="1.4" result="sb"/><feComposite id="sc" in="${c}" in2="sb" operator="arithmetic" k1="0" k2="1" k3="0" k4="0" result="s5"/>`;c='s5'}
  if(f.ch){x+=`<feColorMatrix in="${c}" type="matrix" values="${M(1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0)}" result="cr"/><feColorMatrix in="${c}" type="matrix" values="${M(0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0)}" result="cg"/><feColorMatrix in="${c}" type="matrix" values="${M(0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0)}" result="cb"/><feOffset id="or" in="cr" dx="0" dy="0" result="cr2"/><feOffset id="ob" in="cb" dx="0" dy="0" result="cb2"/><feComposite in="cr2" in2="cg" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="rg"/><feComposite in="rg" in2="cb2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="s6"/>`;c='s6'}
  if(f.dv){x+=`<feOffset id="dvo" in="${c}" dx="0" dy="0" result="dvo"/><feComposite id="dvc" in="${c}" in2="dvo" operator="arithmetic" k1="0" k2=".7" k3=".3" k4="0" result="s7"/>`;c='s7'}
  if(f.co){x+=`<feColorMatrix id="sa" in="${c}" type="saturate" values="1" result="sa1"/><feColorMatrix id="hu" in="sa1" type="hueRotate" values="0" result="s8"/>`;c='s8'}
  if(f.th){x+=`<feColorMatrix id="tm" in="${c}" type="matrix" values="${M(1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0)}" result="tm1"/><feComponentTransfer in="tm1" result="s9"><feFuncR id="tr" type="table" tableValues="0 1"/><feFuncG id="tg" type="table" tableValues="0 1"/><feFuncB id="tbl" type="table" tableValues="0 1"/></feComponentTransfer>`;c='s9'}
  if(f.tn){x+=`<feComponentTransfer in="${c}" result="s10"><feFuncR id="nr" type="table" tableValues="0 1"/><feFuncG id="ng" type="table" tableValues="0 1"/><feFuncB id="nb" type="table" tableValues="0 1"/></feComponentTransfer>`;c='s10'}
  this.svg.innerHTML=`<filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">${x}</filter>`;
  this.e={};for(const k of['tb1','dw','tb2','dc','bi','db','gb','gc','sc','or','ob','dvo','dvc','sa','hu','tm','tr','tg','tbl','nr','ng','nb'])this.e[k]=this.svg.querySelector('#'+k);
  this.ar=0;this.tab={};this.av={}}
 at(k,n,v){const e=this.e[k];if(!e)return;const q=k+n;if(this.av[q]===v)return;this.av[q]=v;e.setAttribute(n,v)}
 table(k,fn){const a=[];for(let i=0;i<33;i++)a.push(cl(fn(i/32)).toFixed(3));const v=a.join(' ');if(this.tab[k]!==v){this.tab[k]=v;this.at(k,'tableValues',v)}}
 frame(now){if(!this.on)return;this.raf=requestAnimationFrame(t=>this.frame(t));
  if(now-this.last<Math.max(60,1000/this.st.fps)-4)return;const dt=Math.min((now-this.last)/1000,.2);this.last=now;
  const st=this.st,s=this.s,mst=st.act?st.master:0;this.T+=dt*st.speed;const T=this.T;
  for(let i=0;i<46;i++)s[i]=(st.on[i]&&!PS.HIDDEN.has(i))?Math.min(1.5,this.val[i]*mst):0;
  const q=.002,f={w:s[1]>q||s[17]>q,cr:s[11]>q,br:s[0]>q||s[16]>q,gl:s[6]>q||s[39]>q,sh:s[9]>q,ch:s[7]>q,dv:s[15]>q,co:s[3]>q||s[38]>q,th:s[34]>q,tn:s[35]>q||s[43]>q||s[23]>q||s[9]>q};
  const key=Object.keys(f).map(k=>f[k]?1:0).join('');
  if(key!==this.key){this.key=key;if(Object.values(f).some(Boolean)){this.build(f);this.set('url(#'+this.fid+')')}else{this.svg.innerHTML='';this.e={};this.set('none')}}
  const de=document.documentElement,vw=de.clientWidth||innerWidth,vh=de.clientHeight||innerHeight,mx=Math.max(vw,vh);
  if(f.w){this.at('tb1','baseFrequency',(.005+.002*Math.sin(T*.5)+s[17]*0)+' '+(.005+.002*Math.cos(T*.4)-s[17]*.002));this.at('dw','scale',((s[1]*.05+s[17]*.07)*vh).toFixed(1))}
  if(f.cr){this.at('tb2','baseFrequency',(.03+.006*Math.sin(T*.3))+' '+(.03+.006*Math.cos(T*.27)));this.at('dc','scale',(s[11]*vh*.006).toFixed(2))}
  if(f.br){const ar=vw/vh;if(Math.abs(ar-this.ar)>.01){this.ar=ar;this.at('bi','href',mapUri(ar))}
   const k=s[0]*(.045+.045*Math.sin(T*.8))+s[16]*(.03+.03*Math.sin(T*.35));this.at('db','scale',(-k*mx).toFixed(1))}
  if(f.gl){const hz=s[39]*.7,gl=s[6]*.6;this.at('gb','stdDeviation',(3+9*Math.max(s[39],s[6])).toFixed(1));this.at('gc','k2',(1-hz).toFixed(3));this.at('gc','k3',(hz*1.1+gl).toFixed(3))}
  if(f.sh){const k=Math.min(2,s[9]*1.2);this.at('sc','k2',(1+k).toFixed(3));this.at('sc','k3',(-k).toFixed(3))}
  if(f.ch){const d=s[7]*.006*vw;this.at('or','dx',d.toFixed(1));this.at('ob','dx',(-d).toFixed(1))}
  if(f.dv){const d=Math.min(1,s[15]),m=.45*d;this.at('dvo','dx',(Math.sin(T*.4)*d*.03*vw).toFixed(1));this.at('dvo','dy',(Math.cos(T*.3)*d*.03*vh).toFixed(1));this.at('dvc','k2',(1-m).toFixed(3));this.at('dvc','k3',m.toFixed(3))}
  if(f.co){this.at('sa','values',(1+s[3]*1.2).toFixed(3));this.at('hu','values',((((s[3]*(1.2*Math.sin(T*.2)+T*.15)+s[38]*T*.3)*180/Math.PI)%360)).toFixed(1))}
  if(f.th){const m=Math.min(1,s[34]),L=[.299,.587,.114];const rows=[0,1,2].map(i=>[0,1,2].map(j=>((i===j?1-m:0)+m*L[j]).toFixed(3)).concat(['0','0']).join(' '));
   this.at('tm','values',rows.join(' ')+' 0 0 0 1 0');
   this.table('tr',x=>(1-m)*x+m*1.2*sm(.2,.7,x));this.table('tg',x=>(1-m)*x+m*1.2*sm(.5,1,x));this.table('tbl',x=>(1-m)*x+m*1.2*sm(0,.4,x)*(1-sm(.4,.8,x)))}
  if(f.tn){const ct=1+.3*s[9],br=1+.25*s[23]*Math.sin(T*.6),sl=Math.min(1,s[35]),thr=.5+.3*Math.sin(T*.2),ti=Math.min(1,s[43]);
   const W=[1,.8,.5],C=[.5,.7,1];
   const mk=ch=>x=>{let v=((x-.5)*ct+.5)*br;v=cl(v);if(sl>0)v=v*(1-sl)+sl*(v>thr?1-v:v);
    if(ti>0){const t=sm(.2,.8,v);v*=1-ti+ti*(C[ch]+(W[ch]-C[ch])*t)*1.15}return v};
   this.table('nr',mk(0));this.table('ng',mk(1));this.table('nb',mk(2))}
  const vg=Math.min(1,s[22]);this.vig.style.setProperty('display',vg>q?'block':'none','important');if(vg>q)this.vig.style.setProperty('opacity',vg.toFixed(3),'important');
  const sn=Math.min(1,s[8]);this.snow.style.setProperty('display',sn>q?'block':'none','important');
  if(sn>q){this.snow.style.setProperty('opacity',(sn*.9).toFixed(3),'important');this.snow.style.setProperty('background-position',Math.floor(Math.random()*200)+'px '+Math.floor(Math.random()*200)+'px','important')}
 }
 set(v){this.cur=v;this.bd.style.setProperty('backdrop-filter',v,'important');this.bd.style.setProperty('-webkit-backdrop-filter',v,'important')}
 destroy(){this.on=false;clearInterval(this.tm);cancelAnimationFrame(this.raf);
  for(const el of[this.bd,this.snow,this.vig]){try{el.matches(':popover-open')&&el.hidePopover()}catch(e){}el.remove()}this.svg.remove()}
}
g.PsychLite=PsychLite;
})(typeof self!=='undefined'?self:window);
