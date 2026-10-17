/* PsychTabber render engine: the Dream Filter web app's WebGL2 shader (46 effects), unchanged,
   wrapped so it can render onto a page overlay or into a viewer window. */
(function(g){
const VS=`#version 300 es
out vec2 uv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0,1);}`;
const FS=`#version 300 es
precision highp float;in vec2 uv;out vec4 o;
uniform sampler2D V,P;uniform float T,asp,S[46];uniform vec2 px;
vec3 hue(vec3 c,float a){const mat3 t=mat3(.299,.596,.211,.587,-.274,-.523,.114,-.322,.312);const mat3 ti=mat3(1,1,1,.956,-.272,-1.106,.621,-.647,1.703);vec3 y=t*c;float s=sin(a),k=cos(a);y.yz=mat2(k,s,-s,k)*y.yz;return ti*y;}
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float lm(vec3 c){return dot(c,vec3(.299,.587,.114));}
void main(){
 float t=T;vec2 q=uv-.5;q.x*=asp;float r=length(q);vec2 q0=q;float gt=floor(t*2.5);
 if(S[12]>0.){float a=atan(q.y,q.x)+S[12]*2.5*exp(-r*2.5)*sin(t*.25),rr=pow(r,1.-S[12]*.25);q=rr*vec2(cos(a),sin(a));}
 if(S[10]>0.){float n=floor(3.+S[10]*5.),sg=6.2831853/n,a=atan(q.y,q.x)+t*.08;a=abs(mod(a,sg)-sg*.5);q=mix(q,r*vec2(cos(a),sin(a)),min(1.,S[10]*2.));}
 q*=1.+S[16]*.8*sin(t*.35)*dot(q,q);
 if(S[19]>0.){vec2 z=q;float ca=cos(.6+.1*sin(t*.2)),sa=sin(.6+.1*sin(t*.2));for(int i=0;i<3;i++){z=abs(z)-vec2(.22,.12);z=mat2(ca,sa,-sa,ca)*z*1.25;}q=mix(q,z,S[19]*.6);}
 if(S[36]>0.){for(int i=0;i<2;i++){vec2 cen=vec2(sin(t*.17+float(i)*3.1),cos(t*.13+float(i)*1.7))*.3;vec2 dv=q-cen;float vr=length(dv),an=S[36]*2.5*exp(-vr*4.)*(i==0?1.:-1.);float vc=cos(an),vs=sin(an);q=cen+mat2(vc,vs,-vs,vc)*dv;}}
 q*=1.-S[0]*.06*sin(t*.8)-S[0]*.04*sin(r*6.-t*1.3);
 q+=vec2(sin(q.y*7.+t*.6+sin(q.x*5.-t*.4)*1.5),cos(q.x*7.-t*.5+sin(q.y*6.+t*.3)*1.5))*S[1]*.025;
 q.y-=S[17]*.04*(.5+.5*sin(q.x*12.+t*.5+sin(q.y*4.+t*.3)*2.));
 q+=vec2(sin(q.y*80.+t*1.2+sin(q.x*40.)),cos(q.x*80.-t))*S[11]*.0015;
 vec2 u=vec2(q.x/asp,q.y)+.5;
 float rw=floor(u.y*24.);u.x+=step(.82,h(vec2(rw,gt)))*(h(vec2(gt,rw))-.5)*.25*S[24];
 u.x+=S[30]*(.004*sin(u.y*120.+t*8.)*(.5+.5*sin(t*.7))+(1.-smoothstep(0.,.1,u.y))*.03*sin(u.y*300.+t*20.));
 if(S[33]>0.){float bx=h(vec2(gt,7.)),bw=.08+.12*h(vec2(gt,9.));if(abs(u.x-bx)<bw*.5*step(.5,h(vec2(gt,3.))))u.x=mix(u.x,bx,S[33]);}
 if(S[28]>0.){float bs=mix(512.,24.,S[28]);vec2 pg=vec2(bs*asp,bs);u=(floor(u*pg)+.5)/pg;}
 if(S[37]>0.){vec2 cg=floor(u*vec2(14.*asp,14.));u+=(vec2(h(cg),h(cg+7.))-.5)*S[37]*.04;}
 u.x=mix(u.x,1.-abs(2.*u.x-1.),S[40]*.9);
 if(S[44]>0.){float kt=1.+S[44]*2.;u=abs(fract(u*kt*.5+.5)*2.-1.);}
 vec2 d=(u-.5)*S[7]*.02+vec2(S[26]*.03*step(.7,h(vec2(gt,1.))),0.);
 vec3 c=vec3(texture(V,u+d).r,texture(V,u).g,texture(V,u-d).b);
 c=mix(c,texture(V,u+vec2(sin(t*.4),cos(t*.3))*S[15]*.03).rgb,.45*min(1.,S[15]));
 vec3 n1=texture(V,u+vec2(px.x,0)).rgb,n2=texture(V,u-vec2(px.x,0)).rgb,n3=texture(V,u+vec2(0,px.y)).rgb,n4=texture(V,u-vec2(0,px.y)).rgb;
 c+=(4.*c-n1-n2-n3-n4)*S[9]*1.5;
 float L=lm(c),edge=clamp(length(vec2(lm(n1-n2),lm(n3-n4)))*6.,0.,1.);
 if(S[2]>0.){float ct=.5+.5*sin(L*16.+t*.5+r*8.);vec3 pc=.5+.5*cos(6.2831*(vec3(0,.33,.67)+L*1.5+t*.05+r));c=mix(c,c*(.5+ct)+pc*(edge*1.2+.08*ct),S[2]*.75);}
 if(S[6]>0.){vec3 g=vec3(0);for(int i=0;i<8;i++){float a=float(i)*.7854;g+=texture(V,u+vec2(cos(a),sin(a))*px*18.).rgb;}g/=8.;c+=max(g-.35,0.)*S[6]*1.6;}
 L=lm(c);c=mix(vec3(L),c,1.+S[3]*1.2);c=hue(c,S[3]*(1.2*sin(t*.2)+t*.15+r*3.));
 if(S[12]>0.)c*=1.+S[12]*.35*sin(atan(q0.y,q0.x)*5.+r*25.-t*1.5)*(.3+edge);
 if(S[13]>0.){float lv=0.;for(int i=0;i<3;i++){float a=float(i)*2.0944;lv+=cos(dot(q0,vec2(cos(a),sin(a)))*45.+t*.25);}lv/=3.;c=hue(c*(1.+S[13]*.6*lv),S[13]*lv*1.2);}
 if(S[14]>0.){vec2 g=q0*9.,id=floor(g),f=fract(g)-.5;float hh=h(id),act=step(.5,hh)*smoothstep(.2,.9,sin(t*.3+hh*30.)*.5+.5);float lid=.2*(1.-4.*f.x*f.x),ins=step(abs(f.x),.5)*step(abs(f.y),max(lid,0.));vec2 io=vec2(sin(t*.3+hh*6.)*.06,0.);float ir=1.-smoothstep(.15,.17,length(f-io)),pu=1.-smoothstep(.05,.07,length(f-io)),ln=(1.-smoothstep(0.,.03,abs(abs(f.y)-lid)))*step(abs(f.x),.5);float mk=S[14]*act*smoothstep(.1,.5,edge*2.+.3*(1.-L));vec3 ec=mix(c,vec3(.92,.94,.9),ins*.5)*(1.-.85*pu);ec=mix(ec,.5+.5*cos(6.2831*(vec3(0,.33,.67)+hh)),ir*(1.-pu)*.7);ec*=1.-.9*ln;c=mix(c,ec,mk*max(ins,ln));}
 if(S[25]>0.){vec2 bk=floor(uv*vec2(16.*asp,16.));if(h(bk+gt)>1.-S[25]*.25)c=texture(P,uv+(vec2(h(bk+1.),h(bk+2.))-.5)*.04).rgb;}
 if(S[31]>0.){vec2 ab=floor(uv*vec2(10.*asp,10.));if(h(ab+gt*1.7)>1.-S[31]*.1)c=.5+.5*cos(6.2831*(vec3(0,.33,.67)+h(ab)));}
 if(S[32]>0.){float dr=step(1.-S[32]*.12,h(vec2(floor(uv.y*60.),gt)));c=mix(c,vec3(h(uv*400.+t)*.6),dr);}
 if(S[34]>0.){float tl=lm(c);c=mix(c,vec3(smoothstep(.2,.7,tl),smoothstep(.5,1.,tl),smoothstep(0.,.4,tl)*(1.-smoothstep(.4,.8,tl)))*1.2,S[34]);}
 if(S[35]>0.){c=mix(c,mix(c,1.-c,step(.5+.3*sin(t*.2),c)),S[35]);}
 if(S[29]>0.){float pz=mix(32.,3.,S[29]);c=floor(c*pz+.5)/pz;}
 if(S[39]>0.){vec3 bl=vec3(0);for(int i=0;i<8;i++){float a=float(i)*.7854;bl+=texture(V,u+vec2(cos(a),sin(a))*px*9.).rgb;}bl/=8.;c=mix(c,bl*1.1,S[39]*.7);}
 if(S[41]>0.){vec3 sk=vec3(0);for(int i=-6;i<=6;i++){sk+=max(texture(V,u+vec2(float(i)*px.x*10.,0.)).rgb-.6,0.);}c+=sk/13.*S[41]*3.;}
 if(S[38]>0.){float sl=lm(c);c=mix(c,.5+.5*cos(6.2831*(vec3(0,.33,.67)+sl*1.3+t*.08)),S[38]*.7);}
 if(S[43]>0.){float tl2=lm(c);vec3 wm=hue(vec3(1.,.8,.5),t*.1*S[43]),cl=hue(vec3(.5,.7,1.),t*.1*S[43]);c*=mix(vec3(1.),mix(cl,wm,smoothstep(.2,.8,tl2))*1.15,S[43]);}
 if(S[42]>0.){float nv=sin(q0.x*5.+t*.2+sin(q0.y*6.-t*.15)*2.)+sin(q0.y*4.-t*.1+sin(q0.x*7.+t*.25)*2.)+sin((q0.x+q0.y)*9.+t*.3);float vv=pow(1.-abs(sin(nv*2.)),8.);c+=(.5+.5*cos(6.2831*(vec3(0,.33,.67)+nv*.2+t*.05)))*vv*S[42]*.8*(.4+edge);}
 if(S[45]>0.){float aa=atan(q0.y,q0.x);float cw=smoothstep(.9,1.,abs(sin(aa*8.)))+smoothstep(.9,1.,abs(sin(r*45.-t*.2)));c+=cw*(.3+.7*edge)*S[45]*.5*(.5+.5*cos(6.2831*(vec3(0,.33,.67)+r+t*.05)));}
 c+=(.5+.5*cos(6.2831*(vec3(0,.33,.67)+edge*.8+t*.1+r*2.)))*edge*S[18]*.9;
 if(S[20]>0.){float pl=sin(q0.x*9.+t*.5+sin(q0.y*7.-t*.4)*2.)+sin(q0.y*8.-t*.3+sin(q0.x*6.+t*.35)*2.);c+=(.5+.5*cos(6.2831*(vec3(0,.33,.67)+pl*.25+t*.04)))*(.3+.15*pl)*S[20]*(1.-smoothstep(0.,.5,L));}
 float m=clamp(S[4]*.85+S[5]*.6,0.,.93);
 if(m>0.){vec2 pq=uv-.5;float ra=S[5]*.02*sin(t*.3);pq*=1.-S[5]*.03;pq=mat2(cos(ra),sin(ra),-sin(ra),cos(ra))*pq;vec3 pr=hue(texture(P,pq+.5).rgb,S[5]*.15);c=mix(c,pr,m);}
 c*=1.+S[21]*.25*(sin(r*60.-t*2.)+sin(length(q0-vec2(.3*sin(t*.2),.2))*55.-t*1.5))*(.4+edge);
 c*=1.-S[22]*smoothstep(.25,.85,r*(1.+.15*sin(t*.4)));
 c*=1.+S[23]*.25*sin(q0.x*3.+q0.y*2.-t*.6);
 c*=1.-S[27]*.35*(.5+.5*sin(uv.y*700.));
 c+=(h(uv*1000.+t)-.5)*S[8]*.25;
 o=vec4(clamp(c,0.,1.),1);}`;
const BS=`#version 300 es
precision mediump float;in vec2 uv;out vec4 o;uniform sampler2D P;void main(){o=texture(P,uv);}`;
const CS=`#version 300 es
precision mediump float;in vec2 uv;out vec4 o;uniform sampler2D V;uniform vec4 R;uniform float K;void main(){vec3 c=texture(V,R.xy+uv*R.zw).rgb;c*=1.-K*smoothstep(.4,1.,dot(c,vec3(.299,.587,.114)));o=vec4(c,1);}`;
const FBS=`#version 300 es
precision highp float;in vec2 uv;out vec4 o;
uniform sampler2D P,F;uniform float asp,T,amt,gain,soft,glow,fringe,hue,sat,edge,noise,kz,kr,kt,kf,kon,nR;uniform vec2 ks;uniform vec3 kc,cpos;uniform mat3 crot;uniform float ctan;uniform vec4 R[6];
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec3 hr(vec3 c,float a,float sv){const mat3 t=mat3(.299,.596,.211,.587,-.274,-.523,.114,-.322,.312);const mat3 ti=mat3(1,1,1,.956,-.272,-1.106,.621,-.647,1.703);vec3 y=t*c;float s=sin(a),k=cos(a);y.yz=mat2(k,-s,s,k)*y.yz*sv;return ti*y;}
vec2 persp(vec2 u){vec2 n=(u-.5)*2.;vec3 d=crot*normalize(vec3(n.x*ctan*asp,n.y*ctan,-1.));if(d.z>-.02)return vec2(-9.);float t=-cpos.z/d.z;vec2 hit=cpos.xy+t*d.xy;return vec2(hit.x/asp+.5,hit.y+.5);}
vec2 cam(vec2 u){vec2 p=u-.5;p.x*=asp;p-=ks;float c=cos(kr),s=sin(kr);p=mat2(c,s,-s,c)*p;p/=kz;p*=1.+edge*.1*dot(p,p);p.x/=asp;return p+.5;}
float scr(vec2 q){float rad=.02+.12*edge,w=.004+.06*edge;vec2 d=abs(q-.5)-(vec2(.5)-rad);float sd=length(max(d,0.))+min(max(d.x,d.y),0.)-rad;return 1.-smoothstep(-w,.003,sd);}
vec2 ck(vec3 c){return vec2(-.1687*c.r-.3313*c.g+.5*c.b,.5*c.r-.4187*c.g-.0813*c.b);}
void main(){
 vec3 pc=texture(P,uv).rgb;vec2 q=cam(persp(uv));vec2 ia=vec2(1./asp,1.);
 const vec2 D[8]=vec2[8](vec2(1,0),vec2(.707,.707),vec2(0,1),vec2(-.707,.707),vec2(-1,0),vec2(-.707,-.707),vec2(0,-1),vec2(.707,-.707));
 float rp=soft*.0045+.0008;vec3 e=texture(F,q).rgb*.2;
 for(int i=0;i<8;i++)e+=texture(F,q+D[i]*rp*ia).rgb*.1;
 vec2 cd=((q-.5)+vec2(.004,.002))*fringe*.02;
 e.r=mix(e.r,texture(F,q+cd).r,.6);e.b=mix(e.b,texture(F,q-cd).b,.6);
 vec3 bl=vec3(0);float rw=.02+.03*glow;for(int i=0;i<8;i++)bl+=texture(F,q+D[i]*rw*ia).rgb;bl*=.125;
 e+=glow*1.1*max(bl-.45,0.)+glow*.3*bl*bl;
 e=hr(e,hue,sat);e=clamp(e,0.,1.5);e=mix(e,e*e*(3.-2.*min(e,1.)),.18);e=max(e-.004,0.)*gain;
 vec2 vv=q-.5;e*=scr(q)*(1.-edge*1.1*dot(vv,vv));
 e*=1.+(h(uv*vec2(1733.,907.)+T*7.)-.5)*noise*.3;e=max(e,0.);
 float a=1.;
 if(kon>.5)a=smoothstep(kt,kt+kf+.001,distance(ck(pc),ck(kc)));
 for(int i=0;i<6;i++){if(float(i)>=nR)break;vec4 r=R[i];float f=kf*.25+.002;
  float mx=smoothstep(r.x-f,r.x+f,uv.x)*(1.-smoothstep(r.z-f,r.z+f,uv.x)),my=smoothstep(r.y-f,r.y+f,uv.y)*(1.-smoothstep(r.w-f,r.w+f,uv.y));a*=1.-mx*my;}
 vec3 ep=e*mix(1.,amt,a);vec3 res=1.-(1.-pc*a)*(1.-ep);o=vec4(clamp(res,0.,1.),1);}`;
function mot(n,t){const S=Math.sin,C=Math.cos;switch(n){
 case'handheld':return{x:.004*S(1.3*t)+.003*S(2.9*t+1),y:.004*S(1.1*t+2)+.003*S(3.3*t),r:.014*S(.9*t)+.008*S(2.3*t+.5),z:.006*S(1.7*t)};
 case'breathe':return{x:0,y:0,r:0,z:.07*S(.6*t)};
 case'spiral':return{x:0,y:0,r:.1+.05*S(.3*t),z:-.03};
 case'orbit':return{x:.035*C(.5*t),y:.035*S(.5*t),r:0,z:0};
 case'sway':return{x:.05*S(.4*t),y:.01*S(.8*t),r:.05*S(.7*t),z:0};
 case'dutch':return{x:0,y:0,r:.3*S(.35*t),z:0};
 case'figure8':return{x:.045*S(.5*t),y:.03*S(t),r:.04*S(.5*t),z:.02*S(.5*t)};
 case'drift':return{x:.03*S(.23*t)+.02*S(.51*t),y:.03*C(.19*t),r:.12*S(.17*t),z:.05*S(.29*t+1)};
 default:return{x:0,y:0,r:0,z:0}}}
class PsychEngine{
 constructor(cv,opt){
  this.cv=cv;this.o=opt||{};this.running=false;this.fresh=false;this.last=0;this.T=0;this.cur=0;this.W=0;this.H=0;
  this.st=PS.normalize(null);this.val=this.st.val.slice();this.tg=null;this.dTick=0;this.tick=0;this.tm=0;
  const gl=this.gl=cv.getContext('webgl2',{antialias:false,alpha:false,powerPreference:'low-power'});
  if(!gl)throw new Error('WebGL2 is not available');
  cv.addEventListener('webglcontextlost',e=>{e.preventDefault();this.o.onError&&this.o.onError('WebGL context lost')});
  this.pm=this.prog(FS,true);this.pb=this.prog(BS);this.pc=this.prog(CS);this.pf=this.prog(FBS);gl.uniform1i(gl.getUniformLocation(this.pf,'F'),2);
  this.UF={};['asp','T','amt','gain','soft','glow','fringe','hue','sat','edge','noise','kz','kr','kt','kf','kon','nR','ks','kc','R','cpos','crot','ctan'].forEach(k=>this.UF[k]=gl.getUniformLocation(this.pf,k));
  this.keys={};this.resetCam();this.mt=0;this.gw=0;this.gh=0;this.gt=null;this.gf=null;this.gc=0;this.rbuf=new Float32Array(24);this.m3=new Float32Array(9);
  this.U={};['T','asp','S','px'].forEach(k=>this.U[k]=gl.getUniformLocation(this.pm,k));
  this.UR=gl.getUniformLocation(this.pc,'R');this.UK=gl.getUniformLocation(this.pc,'K');
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
  gl.activeTexture(gl.TEXTURE0);this.vtex=this.mk();
  this.stex=this.mk();this.sfb=gl.createFramebuffer();this.sw=0;this.sh=0;
  this.tex=[];this.fb=[];
 }
 prog(f,main){const gl=this.gl,p=gl.createProgram();
  for(const[t,s]of[[gl.VERTEX_SHADER,VS],[gl.FRAGMENT_SHADER,f]]){const sh=gl.createShader(t);gl.shaderSource(sh,s);gl.compileShader(sh);
   if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error('Shader error: '+gl.getShaderInfoLog(sh));gl.attachShader(p,sh)}
  gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error('Link error: '+gl.getProgramInfoLog(p));
  gl.useProgram(p);const P=gl.getUniformLocation(p,'P'),V=gl.getUniformLocation(p,'V');if(P)gl.uniform1i(P,1);if(V)gl.uniform1i(V,0);return p}
 mk(){const gl=this.gl,t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.MIRRORED_REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.MIRRORED_REPEAT);return t}
 alloc(tex,fb,w,h){const gl=this.gl;gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,tex);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
  gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
  gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT)}
 ensure(w,h){if(w===this.W&&h===this.H)return;const gl=this.gl;this.W=this.cv.width=w;this.H=this.cv.height=h;
  for(let i=0;i<2;i++){if(!this.tex[i]){this.tex[i]=this.mk();this.fb[i]=gl.createFramebuffer()}this.alloc(this.tex[i],this.fb[i],w,h)}
  gl.bindFramebuffer(gl.FRAMEBUFFER,null)}
 setState(s){this.st=PS.normalize(s);this.val=this.st.val.slice();if(!this.st.drift)this.tg=null}
 attach(video){this.vid=video;this.fresh=true;this.cbf=()=>{this.fresh=true;if(this.vid===video&&this.running)video.requestVideoFrameCallback(this.cbf)}}
 start(){if(this.running)return;this.running=true;this.last=performance.now();
  if(this.vid&&this.vid.requestVideoFrameCallback&&this.cbf)this.vid.requestVideoFrameCallback(this.cbf);
  this.raf=requestAnimationFrame(t=>this.loop(t));
  this.tm=setInterval(()=>this.drift(),100)}
 drift(){const s=this.st;if(!s.drift)return;
  if(!this.tg||++this.dTick>80){this.dTick=0;this.tg=PS.N.map((_,i)=>PS.HIDDEN.has(i)?0:(Math.random()<.5?Math.random()*.8:0))}
  for(let i=0;i<this.val.length;i++)this.val[i]+=(this.tg[i]-this.val[i])*.03;
  if(++this.tick%2===0&&this.o.onVals)this.o.onVals(this.val.map(v=>+v.toFixed(3)))}
 loop(now){if(!this.running)return;this.raf=requestAnimationFrame(t=>this.loop(t));
  const st=this.st,iv=1000/st.fps;if(now-this.last<iv-2)return;
  const dt=Math.min((now-this.last)/1000,.1);this.last=now;
  const mst=st.act?st.master:0,s=this.sv||(this.sv=new Float32Array(46));let any=false;
  for(let i=0;i<46;i++){const x=(st.on[i]&&!PS.HIDDEN.has(i))?Math.min(1.5,this.val[i]*mst):0;s[i]=x;if(x>0)any=true}
  const fbOn=st.fb.on&&st.act;if(!any&&!(st.comp>0)&&!fbOn){if(!this.idle){this.idle=true;this.cv.style.setProperty('display','none','important')}return} /* nothing to draw: output would equal the page, so skip all GPU work */
  if(this.idle){this.idle=false;this.cv.style.setProperty('display','block','important');this.W=this.H=0;this.fresh=true}
  const v=this.vid;if(!v||v.readyState<2||!v.videoWidth)return;
  const geo=this.o.geom?this.o.geom():{pw:v.videoWidth,ph:v.videoHeight,R:null};if(!geo)return;
  const gl=this.gl;this.ensure(Math.max(64,Math.round(geo.pw*st.scale)),Math.max(64,Math.round(geo.ph*st.scale)));
  this.T+=dt*st.speed;
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.vtex);
  if(this.fresh||!v.requestVideoFrameCallback){try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,v.frame||v)}catch(e){return}this.fresh=false}
  let src=this.vtex;
  if(geo.R||st.comp>0){ /* pre-pass: crop to the visible region and ease bright pages down so effects have headroom */
   const w=this.W,h=this.H;if(this.sw!==w||this.sh!==h){this.sw=w;this.sh=h;this.alloc(this.stex,this.sfb,w,h)}
   gl.bindFramebuffer(gl.FRAMEBUFFER,this.sfb);gl.viewport(0,0,w,h);gl.useProgram(this.pc);const R=geo.R||[0,0,1,1];gl.uniform4f(this.UR,R[0],R[1],R[2],R[3]);gl.uniform1f(this.UK,st.comp);
   gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.vtex);gl.drawArrays(gl.TRIANGLES,0,3);src=this.stex}
  const cur=this.cur,prev=1-cur;
  gl.bindFramebuffer(gl.FRAMEBUFFER,this.fb[cur]);gl.viewport(0,0,this.W,this.H);gl.useProgram(this.pm);
  gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,src);
  gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.tex[prev]);
  gl.uniform1f(this.U.T,this.T);gl.uniform1f(this.U.asp,geo.pw/geo.ph);gl.uniform1fv(this.U.S,s);gl.uniform2f(this.U.px,1/geo.pw,1/geo.ph);
  gl.drawArrays(gl.TRIANGLES,0,3);
  if(fbOn)this.fbPass(cur,dt);else{gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,this.W,this.H);gl.useProgram(this.pb);gl.bindTexture(gl.TEXTURE_2D,this.tex[cur]);gl.drawArrays(gl.TRIANGLES,0,3)}
  this.cur=prev;
  if(!this.shown){this.shown=true;this.o.onFirstFrame&&this.o.onFirstFrame()}}
 resetCam(){this.cam={x:0,y:0,r:0,z:0,vx:0,vy:0,vr:0,vz:0}}
 camStep(dt){const k=this.keys,c=this.cam,sp=k.fast?2.5:1,t=(a,b)=>(a?1:0)-(b?1:0),a=Math.min(1,dt*7),cl=(v,m)=>Math.max(-m,Math.min(m,v));
  c.vx+=(t(k.r,k.l)*.06*sp-c.vx)*a;c.vy+=(t(k.u,k.d)*.06*sp-c.vy)*a;c.vr+=(t(k.rr,k.rl)*.5*sp-c.vr)*a;c.vz+=(t(k.zi,k.zo)*.25*sp-c.vz)*a;
  c.x=cl(c.x+c.vx*dt,.25);c.y=cl(c.y+c.vy*dt,.25);c.r=cl(c.r+c.vr*dt,.8);c.z=cl(c.z+c.vz*dt,.3)}
 allocF(tex,fb,w,h){const gl=this.gl;gl.activeTexture(gl.TEXTURE3);gl.bindTexture(gl.TEXTURE_2D,tex);
  let ok=false;if(this.f16!==false&&(gl.getExtension('EXT_color_buffer_float')||gl.getExtension('EXT_color_buffer_half_float'))){
   gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F,w,h,0,gl.RGBA,gl.HALF_FLOAT,null);gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);ok=gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE}
  this.f16=ok;if(!ok){gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0)}
  gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT)}
 /* Camera-feedback pass: the page output is shown on a virtual screen, a virtual camera re-films that screen (blur, glow, colour fringe, hue drift, screen curve, vignette, grain) and the result is mixed back with the page. */
 fbPass(cur,dt){const gl=this.gl,f=this.st.fb,W=this.W,H=this.H,U=this.UF;
  if(this.gw!==W||this.gh!==H||!this.gt){if(!this.gt){this.gt=[this.mk(),this.mk()];this.gf=[gl.createFramebuffer(),gl.createFramebuffer()];this.gc=0}
   for(let i=0;i<2;i++)this.allocF(this.gt[i],this.gf[i],W,H);this.gw=W;this.gh=H}
  this.camStep(dt);this.mt+=dt*f.mspeed;const c=this.cam,m=mot(f.move,this.mt);
  const N=f.echoes,g=N>=25?.985:Math.pow(.12,1/N),rot=f.rot*Math.PI/180+c.r+m.r,z=f.zoom*Math.exp(c.z+m.z);
  const k=f.kcol,kc=[parseInt(k.slice(1,3),16)/255,parseInt(k.slice(3,5),16)/255,parseInt(k.slice(5,7),16)/255],rb=this.rbuf;rb.fill(0);
  f.rects.forEach((r,i)=>{rb[i*4]=r[0];rb[i*4+1]=1-r[3];rb[i*4+2]=r[2];rb[i*4+3]=1-r[1]});
  const gc=this.gc;gl.bindFramebuffer(gl.FRAMEBUFFER,this.gf[gc]);gl.viewport(0,0,W,H);gl.useProgram(this.pf);
  gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.tex[cur]);gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,this.gt[1-gc]);
  gl.uniform1f(U.asp,W/H);gl.uniform1f(U.T,this.T);gl.uniform1f(U.amt,f.amt);gl.uniform1f(U.gain,g);gl.uniform1f(U.soft,f.soft);gl.uniform1f(U.glow,f.glow);gl.uniform1f(U.fringe,f.fringe);
  gl.uniform1f(U.hue,f.hue*Math.PI/180);gl.uniform1f(U.sat,1+f.sat*.12);gl.uniform1f(U.edge,f.edge);gl.uniform1f(U.noise,f.noise);gl.uniform1f(U.kz,z);gl.uniform1f(U.kr,-rot);
  gl.uniform2f(U.ks,-(f.x+c.x+m.x),-(f.y+c.y+m.y));gl.uniform1f(U.kt,f.ktol);gl.uniform1f(U.kf,f.ksoft);gl.uniform1f(U.kon,f.kon?1:0);gl.uniform1f(U.nR,f.rects.length);
  gl.uniform3f(U.kc,kc[0],kc[1],kc[2]);gl.uniform4fv(U.R,rb);{const cm=f.cam,M=PS.camMat(cm),o=this.m3;o[0]=M[0];o[1]=M[3];o[2]=M[6];o[3]=M[1];o[4]=M[4];o[5]=M[7];o[6]=M[2];o[7]=M[5];o[8]=M[8];
   gl.uniform3f(U.cpos,cm.x,cm.y,cm.d);gl.uniformMatrix3fv(U.crot,false,o);gl.uniform1f(U.ctan,Math.tan(cm.fov*Math.PI/360))}gl.drawArrays(gl.TRIANGLES,0,3);
  gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,W,H);gl.useProgram(this.pb);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,this.gt[gc]);gl.drawArrays(gl.TRIANGLES,0,3);this.gc=1-gc}
 destroy(){this.running=false;clearInterval(this.tm);cancelAnimationFrame(this.raf);this.vid=null;
  try{const e=this.gl.getExtension('WEBGL_lose_context');e&&e.loseContext()}catch(x){}}
}
g.PsychEngine=PsychEngine;
})(typeof self!=='undefined'?self:window);
