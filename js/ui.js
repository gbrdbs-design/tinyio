/* Component builders. Every helper returns an HTML string; behaviour is wired by event delegation in app.js. */
(function(){
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const px=v=>typeof v==='number'?v+'px':v;
const U={esc};

/* ---------- chrome ---------- */
const MENUS={
  dm:[['common','COMMON','common'],['tournament','TOURNAMENT','trophy'],['third','THIRD PARTY','pie2'],['games','GAMES','rocket'],['data','DATA','lock'],['settings','SETTINGS','gearfill']],
  oc:[['hub','HUB','server'],['controller','CONTROLLER','grid9'],['macros','MACROS','macro'],['scripts','SCRIPTS','script'],['hotkeys','HOTKEYS','keyboard'],['debug','DEBUG','debug']],
  db:[['admin','ADMIN','logout'],['general','GENERAL','common'],['tournament','TOURNAMENT','trophy'],['games','GAMES','rocket'],['overlay','OVERLAY','grid9']]
};
U.topbar=(set,active)=>{
  const logo=`<button class="tlogo" data-go="launcher/main" title="Launcher"><img src="img/tinyio-wordmark.png" alt="TinyIO"></button>`;
  const menu=set?`<nav class="tmenu">${MENUS[set].map(([k,t,ic])=>`<button data-menu="${set}:${k}" class="${k===active?'on':''}">${i(ic)}<span>${t}</span></button>`).join('')}</nav>`:'';
  const right=set==='db'
    ?`<button class="tlogo" data-go="launcher/main" style="width:auto"><img src="img/tinyio-wordmark.png" alt="TinyIO"></button>`
    :`<button class="refresh" data-toast="Adatok frissítve">${i('refresh')}<span>Refresh</span></button><div class="sizers"><span>${i('min')}</span><span>${i('restore')}</span><span>${i('close')}</span></div>`;
  return `<header class="topbar"><div class="l">${set&&set!=='db'?logo:''}${menu}</div><div class="r">${set===null?`<div class="sizers"><span>${i('min')}</span><span>${i('restore')}</span><span>${i('close')}</span></div>`:right}</div></header>`;
};
/* nav items: {k:'event'|'icon', ic, go, on, warn, tab:{img,label}} */
U.nav=(items)=>`<aside class="nav"><button class="sc" aria-label="Görgetés fel">${i('up')}</button><div class="items">${items.map((it,n)=>{
  if(it.ev) return `<button class="nb ev first" data-go="launcher/main" title="Esemény"><img src="img/nav-event.png" alt="SEA DPC"></button>`;
  if(it.tab) return `<button class="nb tab" data-go="${it.go||''}" title="${esc(it.tab.label)}"><img src="${it.tab.img}" alt=""><span>${esc(it.tab.label)}</span><span class="x">${i('x')}</span></button>`;
  if(it.img) return `<button class="nb${it.on?' on':''}" data-go="${it.go||''}"><img src="${it.img}" alt="" style="width:40px"></button>`;
  return `<button class="nb${it.on?' on':''}" ${it.go?`data-go="${it.go}"`:`data-toast="${esc(it.t||'Ez a nézet még nincs HTML-ben megépítve')}"`} title="${esc(it.t||'')}">${i(it.ic)}${it.warn?`<span class="warn">${i('warn')}</span>`:''}</button>`;
}).join('')}</div><button class="sc" aria-label="Görgetés le">${i('down')}</button></aside>`;
U.status=()=>`<footer class="status"><div class="l"><span style="padding:0 8px">${i('arrowup')}</span><span class="sep"></span>${i('okc')}<span>[13:44:15] <b>Login successful</b></span></div><div class="r"><span>DPC SEA - Winter Tour - 2021   |   November 29, 2021 - January 24, 2022   |   gabor_dobos</span>${i('cloud')}</div></footer>`;

/* standard app nav sets */
U.navDM=(active)=>U.nav([{ev:1},
  {ic:active==='general'?'cube':'cube',on:active==='general',go:'dm/general',t:'General'},
  {ic:active==='schedule'?'clock':'calendar',on:active==='schedule',go:'dm/schedule',warn:active!=='schedule',t:'Schedule'},
  {tab:{img:'img/game-dota.png',label:'Dota2'},go:'dm/dota2'},
  {ic:'list',t:'Playlist'},{ic:'bracket',t:'Brackets'},{ic:'docedit',t:'Customization'},{ic:'gear',t:'Beállítások'},{ic:'tv',go:'oc/hub',t:'Overlay Controller'}]);
U.navOC=(active)=>U.nav([{ev:1},
  {ic:{hub:'server',controller:'grid9',macros:'macro',editor:'macroadd'}[active]||'server',on:1,go:'oc/'+(active==='editor'?'macros':active)},
  {ic:'calendar',warn:1,go:'dm/schedule',t:'Schedule'},
  {tab:{img:'img/game-dota.png',label:'Dota2'},go:'dm/dota2'},
  {ic:'list',t:'Playlist'},{ic:'bracket',t:'Brackets'},{ic:'docedit',t:'Customization'},{ic:'gear',t:'Beállítások'},{ic:'tv',go:'oc/controller',t:'Controller'}]);

/* ---------- module header ---------- */
U.mh=(label,o={})=>`<div class="mh"${o.w?` style="width:${px(o.w)}"`:''}><span class="pill">${esc(label)}</span>${o.sheet?`<button class="sheet" data-toast="Külső sheet összekapcsolása" title="Link external sheet">${i('ext')}</button>`:`<span style="width:0"></span>`}<span class="ln"></span>${o.meta?`<span class="meta">${esc(o.meta)}</span>`:''}${o.rf?`<button class="rf" data-toast="Frissítve">${i('refresh')}</button>`:''}${o.coll?`<button class="coll" data-coll title="Összecsukás">${i('minus')}</button>`:''}</div>`;

/* ---------- fields ---------- */
const wrap=(o,inner,cls='',attrs='')=>`<div class="f ${cls}${o.dis?' dis':''}" ${attrs} style="width:${px(o.w||216)}">${o.label!=null?`<label>${esc(o.label)}</label>`:''}${inner}</div>`;
U.txt=(o)=>wrap(o,`<div class="box${o.err?' err':''}${o.ov?' ov':''}">${o.icon?i(o.icon):''}<input value="${esc(o.v||'')}" placeholder="${esc(o.ph||'')}"${o.dis?' disabled':''}>${o.search?`<span style="color:var(--t-grey)">${i('search','')}</span>`:(o.noclr?'':`<button class="clr" data-clr tabindex="-1">${i('x')}</button>`)}</div>`);
U.dd=(o)=>wrap(o,`<div class="box${o.err?' err':''}${o.ov?' ov':''}" tabindex="0" role="button">${o.icon?`<span class="icn">${i(o.icon)}<span class="v${o.v?'':' ph'}">${esc(o.v||o.ph||'Select')}</span></span>`:`<span class="v${o.v?'':' ph'}">${esc(o.v||o.ph||'Select')}</span>`}${i(o.cal?'calendar':'chev','chev')}</div>`,'dd',`data-opts="${esc(o.opts||'')}"`);
U.num=(o)=>wrap(Object.assign({w:80},o),`<div class="box"><input value="${esc(o.v==null?0:o.v)}" inputmode="numeric"${o.dis?' disabled':''}${o.grey?' style="color:var(--t-inactive)"':''}><span class="ud"><button data-step="1" tabindex="-1">${i('chevup')}</button><button data-step="-1" tabindex="-1">${i('chev')}</button></span></div>`,'num');
U.rm=(o,inner)=>`<div class="rm" style="width:${px(o.w||424)}">${inner}<span class="hd" title="Áthelyezés">${i('dotsv')}</span></div>`;
U.add=(w,h=40,act='')=>`<button class="add" style="width:${px(w)};height:${px(h)}" ${act||'data-toast="Új elem hozzáadva"'}>${i('plus')}</button>`;

/* ---------- controls ---------- */
U.cb=(on,label)=>label?`<label class="cbl"><span class="cb${on?' on':''}" role="checkbox" aria-checked="${!!on}" tabindex="0">${i(on?'checkboxon':'checkbox')}</span>${esc(label)}</label>`:`<span class="cb${on?' on':''}" role="checkbox" aria-checked="${!!on}" tabindex="0">${i(on?'checkboxon':'checkbox')}</span>`;
U.rd=(on,g,sm)=>`<span class="rd${sm?' sm':''}${on?' on':''}" role="radio" aria-checked="${!!on}" data-g="${g||''}" tabindex="0"></span>`;
U.sw=(on)=>`<span class="sw${on?' on':''}" role="switch" aria-checked="${!!on}" tabindex="0"></span>`;
U.btn=(t,o={})=>`<button class="btn ${o.k||'pri'}${o.lg?' lg':''}${o.xl?' xl':''}${o.dis?' dis':''}" style="${o.w?`width:${px(o.w)};`:''}${o.st||''}" ${o.act||''}>${o.ic?i(o.ic):''}<span>${esc(t)}</span>${o.plus?`<span class="plus">${i('plus')}</span>`:''}</button>`;
U.bottomSend=()=>`<div class="bottom">${U.btn('Send all',{k:'ghost',ic:'sendall',act:'data-toast="Minden modul elküldve az overlay-re"'})}${U.btn('Send',{ic:'send',plus:1,act:'data-toast="Elküldve az overlay-re"'})}</div>`;

/* ---------- modal ---------- */
U.modal=(title,body,foot,w=480)=>`<div class="scrim" data-scrim><div class="modal" style="width:${px(w)}" role="dialog" aria-label="${esc(title)}"><div class="mhd"><span>${esc(title)}</span><button data-close aria-label="Bezárás">${i('close')}</button></div><div class="mbd">${body}</div>${foot?`<div class="mft">${foot}</div>`:''}</div></div>`;

window.U=U;
})();
