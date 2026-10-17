importScripts('shared.js');
const BLOCK=/^(chrome|chrome-extension|edge|about|devtools|view-source|chrome-search|chrome-untrusted):|^https?:\/\/(chromewebstore\.google\.com|chrome\.google\.com\/webstore)/i;
const getA=async()=>(await chrome.storage.session.get('act')).act||{};
const setA=async a=>chrome.storage.session.set({act:a});
const badge=(tabId,on,txt,col)=>{try{chrome.action.setBadgeText({tabId,text:on?(txt||'ON'):''});if(on)chrome.action.setBadgeBackgroundColor({tabId,color:col||'#8e3ccb'})}catch(e){}};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function drop(tabId){const a=await getA();if(!a[tabId])return;delete a[tabId];await setA(a);badge(tabId,false)}
async function startTab(tabId,quiet){
 const tab=await chrome.tabs.get(tabId);
 if(tab.url&&BLOCK.test(tab.url))return{ok:false,code:'blocked',msg:"Chrome doesn't allow extensions on this page (chrome:// pages, the Web Store, new tab page)."};
 const a=await getA();if(a[tabId]){try{const p=await chrome.tabs.sendMessage(tabId,{t:'ping'});if(p&&(p.running||p.pending))return{ok:true,mode:p.mode}}catch(e){}await drop(tabId)}
 let r;
 try{await chrome.scripting.executeScript({target:{tabId},files:['shared.js','engine.js','lite.js','content.js']});r=await chrome.tabs.sendMessage(tabId,{t:'start',quiet:!!quiet})}
 catch(e){r={ok:false,code:'inject',msg:String(e.message||e)}}
 if(r&&r.ok){const x=await getA();x[tabId]={mode:r.mode};await setA(x);badge(tabId,true,r.mode==='lite'?'LITE':'ON');return r}
 return r||{ok:false,msg:'no answer from the page'}}
async function stopTab(tabId){try{await chrome.tabs.sendMessage(tabId,{t:'stop'})}catch(e){}await drop(tabId)}
async function status(tabId){const a=await getA(),e=a[tabId];if(!e)return{active:false};
 try{const p=await chrome.tabs.sendMessage(tabId,{t:'ping'});if(p&&(p.running||p.pending)){if(p.mode&&p.mode!==e.mode){e.mode=p.mode;await setA(a);badge(tabId,true,p.mode==='lite'?'LITE':'ON')}return{active:true,mode:p.mode}}}catch(x){}
 await drop(tabId);return{active:false}}
chrome.runtime.onMessage.addListener((m,s,reply)=>{
 if(!m||!m.t)return;
 if(m.t==='start'){startTab(m.tabId).then(reply,e=>reply({ok:false,code:'err',msg:String(e.message||e)}));return true}
 if(m.t==='stop'){stopTab(m.tabId).then(()=>reply({ok:true}));return true}
 if(m.t==='status'){status(m.tabId).then(reply);return true}
 if(m.t==='ended'&&s.tab){drop(s.tab.id)}
 if(m.t==='mode'&&s.tab){badge(s.tab.id,true,m.mode==='lite'?'LITE':'ON')}
});
const fail=async id=>{badge(id,true,'!','#c0392b');await wait(3000);badge(id,false)};
chrome.commands.onCommand.addListener(async(cmd,tab)=>{
 if(!tab||tab.id==null)return;
 if(cmd==='panic'){await stopTab(tab.id);return}
 if(cmd==='toggle'){const st=await status(tab.id);if(st.active){await stopTab(tab.id);return}
  const r=await startTab(tab.id);if(!r.ok)fail(tab.id)}});
/* Keep the filter when the page reloads or navigates (quietly, no banner). */
chrome.tabs.onUpdated.addListener(async(tabId,c)=>{if(c.status!=='complete')return;const a=await getA(),e=a[tabId];
 if(!e)return;
 try{const p=await chrome.tabs.sendMessage(tabId,{t:'ping'});if(p&&(p.running||p.pending))return}catch(x){}
 delete a[tabId];await setA(a);const r=await startTab(tabId,true).catch(()=>({ok:false}));if(!r.ok)badge(tabId,false)});
chrome.tabs.onRemoved.addListener(tabId=>drop(tabId));
/* Clicking the toolbar icon IS the permission grant Chrome needs: it starts/stops the filter on this tab and opens the controls. */
chrome.action.onClicked.addListener(async tab=>{
 if(!tab||tab.id==null)return;
 chrome.sidePanel.open({tabId:tab.id}).catch(()=>{});
 const st=await status(tab.id);
 if(st.active){await stopTab(tab.id);return}
 const r=await startTab(tab.id);
 if(!r.ok)fail(tab.id)});
