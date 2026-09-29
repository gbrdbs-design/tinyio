/* Overlay Controller: HUB, Controller, Macros, Macro editor (+ Save macro) */
(function(){
const R=window.SCREENS; const {esc}=U; const ST=window.STATE;

/* ---------------- HUB ---------------- */
ST.tpl=ST.tpl||[['Fullscreen',1,300,0,[1,1,1,1],1],['Media Controller',2,5,0,[0,0,0,0],1],['Lower3rd',1,310,1,[1,1,1,1],1],['Dota2',1,100,0,[1,1,1,1],1],['Activities',1,250,0,[1,1,1,1],0],['Splitscreen',3,105,1,[1,1,1,2],1]];
if(ST.connected==null) ST.connected=true;
const stIc=s=>s===1?`<span class="okc">${i('okc')}</span>`:s===2?`<span class="errc" title="Nem elérhető">${i('errc')}</span>`:`<span class="offc">${i('okc')}</span>`;
R['oc/hub']={app:'oc',name:'HUB',menu:'hub',render:()=>`
${U.topbar('oc','hub')}${U.navOC('hub')}
<div class="main"><div class="content" style="gap:24px">
  <div class="row top" style="gap:24px">
    <section class="sec" style="width:312px;gap:16px">${U.mh('Video server',{meta:'192.168.1.222'})}<div class="row">${U.btn('Connect',{k:'ghost'+(ST.connected?'':''),act:'data-conn="1"'})}${U.btn('Disconnect',{k:'ghost'+(ST.connected?'':' dis'),act:'data-conn="0"'})}</div></section>
    <section class="sec" style="width:205px;gap:16px">${U.mh('Media')}<div class="row">${U.btn('Download media',{k:'ghost',act:'data-toast="Média letöltése elindult"'})}</div></section>
  </div>
  <section class="sec">${U.mh('Templates')}
    <div class="row top" style="gap:0">
      <div class="tbl hub-t" style="width:898px"><div class="th">${[['',16],['#',48],['Template',200],['Channel',80],['Layer',80],['Freeze',72],['CG Main',88],['RU',72],['CN',72],['SA',72],['Load',98]].map(([t,w])=>`<div style="width:${w}px${t&&t!=='Template'?';justify-content:center':''}">${t}</div>`).join('')}</div>
        ${ST.tpl.map(([n,ch,l,fr,s,ld],k)=>`<div class="tr" style="height:56px"><div class="grip" style="width:16px">${i('drag')}</div><div class="num" style="width:48px">${k+1}</div><div style="width:200px">${n}</div>
          <div class="cell-num" style="width:80px"><span>${ch}</span><span class="ud">${i('chevup')}${i('chev')}</span></div><div class="num" style="width:80px">${l}</div>
          <div class="c" style="width:72px">${U.cb(fr)}</div>${s.map((v,j)=>`<div class="c" style="width:${j?72:88}px">${ST.connected?stIc(v):stIc(0)}</div>`).join('')}<div class="c" style="width:98px">${U.sw(ld)}</div></div>`).join('')}
      </div>
      <button class="reload" data-toast="Template-ek újratöltve">Reload</button>
    </div>
    <button class="startc" data-go="oc/controller">Start the controller</button>
  </section>
</div></div>
${U.status()}`,
  modals:{debug:()=>U.modal('Debug',`<div style="padding-top:8px">${U.txt({w:480,label:'Command',v:'play 1-300 honda2head/media/loop_adverts loop'})}</div>`,`${U.btn('Send',{act:'data-toast="Parancs elküldve a CasparCG szervernek"'})}${U.btn('Close',{k:'ghost',act:'data-close'})}`,544)}
};

/* ---------------- Controller ---------------- */
/* button: [label, paged?, active?] */
const CAT={
  media:{n:'Media controller',c:'media',b:[['Bumper - 1s'],['Bumper - 3s'],['Bumper - 5s'],['Replay Bumper'],['Highlights Bumper'],['Loop',0,1],['Clear Loop']],rf:0},
  full:{n:'Fullscreen',c:'full',b:[['Schedule',1,1],['Matchup'],['Team Roster'],['Swap Team Roster'],['Groups',1],['Team List',1],['Standby',0,1],['Fullscreen Twitter'],['Top Bar Schedule'],['Fun Facts'],['MVP'],['MVP Reveal',1],['MVP Reset'],['Trivia'],['Trivia Reveal',1],['Trivia Reset'],['Pre-show Countdown']],rf:1},
  l3:{n:'Lower3rd',c:'l3',b:[['L3 Bar',0,1],['Toggle Now/Next'],['Clock Only'],['News ticker'],['Twitter ticker'],['Nameplates'],['Call-in'],['Score Update'],['Song pop-up'],['Betting'],['Countdown',0,1]],rf:2},
  dota:{n:'Dota2',c:'dota',b:[['Ingame'],['Ingame for GSI',0,1],['Observers'],['Bettings',0,1],['Score Update'],['Pause Bug',0,1],['Replay Bug'],['Highlights Bug'],['Live Bug'],['GSI Draft'],['Fullscreen Draft'],['Lower3rd Draft'],['Team Statistics'],['Head 2 Head Statistics'],['H2H Page',1]],rf:1},
  act:{n:'Activities',c:'act',b:[['MVP',0,1],['MVP Reveal',1],['MVP Reset'],['Role random',0,1],['Mafia',0,1]],rf:2}
};
ST.ocOn=ST.ocOn||{}; ST.ocPg=ST.ocPg||{};
Object.entries(CAT).forEach(([k,c])=>c.b.forEach(([l,,on])=>{const id=k+':'+l; if(ST.ocOn[id]==null) ST.ocOn[id]=!!on;}));
const ocb=(k,[l,paged])=>{const id=k+':'+l,on=ST.ocOn[id],pg=ST.ocPg[id]||0;
  return `<div class="ocb-w">${paged?`<div class="ocb ${CAT[k].c} paged${on?' on':''}" data-oc="${esc(id)}"><button class="pg" data-pg="${esc(id)}:-1" aria-label="Előző">${i('left')}</button><span>${esc(l)}</span><button class="pg" data-pg="${esc(id)}:1" aria-label="Következő">${i('right')}</button></div><div class="dots">${[0,1,2,3,4].map(n=>`<i class="${n<=pg?'on':''}"></i>`).join('')}</div>`
  :`<button class="ocb ${CAT[k].c}${on?' on':''}" data-oc="${esc(id)}">${esc(l)}</button>`}</div>`;};
const rfb=t=>`<button class="ocrf r${t}" data-toast="Adatok újratöltve" title="Load data">${i('refresh')}</button>`;
R['oc/controller']={app:'oc',name:'Controller',menu:'controller',render:()=>`
${U.topbar('oc','controller')}${U.navOC('controller')}
<div class="main"><div class="content oc" style="gap:16px">
  ${Object.entries(CAT).map(([k,c])=>`<section class="ocs">${U.mh(c.n)}<div class="ocrow"><div class="ocbs">${c.b.map(b=>ocb(k,b)).join('')}</div>${rfb(c.rf)}</div></section>`).join('')}
</div>
<div class="ocbar"><div class="row" style="justify-content:space-between;padding:0 24px;height:64px">${U.btn('Hide all',{k:'ghost',act:'data-hideall'})}<div class="row" style="gap:32px">${U.btn('Macros',{act:'data-go="oc/macros"'})}${U.btn('Hotkeys',{act:'data-toast="A Hotkey Editor még nincs HTML-ben megépítve"'})}</div></div>
  <div class="players">
    <div class="pl">${U.mh('Videos',{rf:1})}<div class="row" style="gap:16px">${U.dd({w:216,label:'Playlist',v:'Mate Mate ads',opts:'Mate Mate ads|Long break ads|Best of BTS content|Daily Highlights'})}<button class="play" data-play="v">${i('play')}</button><div class="prog"><span class="fn">ads/ludwig_coinbase_normalized.mp4</span><span class="bar"><i style="width:22%"></i></span></div><span class="tm">03:32 / 05:00</span><span class="tm">#5 / 11</span></div></div>
    <div class="pl">${U.mh('Macros',{rf:1})}<div class="row" style="gap:16px">${U.dd({w:136,label:'Macro',v:'Break',opts:'Break|Long break|Short break|Pre-show'})}${U.num({w:64,label:'No. of plays',v:7})}<button class="play" data-play="m">${i('play')}</button><div class="prog"><span class="bar"><i style="width:22%"></i></span></div><span class="tm">03:32 / 05:00</span><span class="tm">#18 / 34</span></div></div>
  </div></div>
</div>
${U.status()}`};

/* ---------------- Macros ---------------- */
ST.macros=ST.macros||['Long break','Short break','End-game transition','Pre-show'];
R['oc/macros']={app:'oc',name:'Macros',menu:'macros',render:()=>`
${U.topbar('oc','macros')}${U.navOC('macros')}
<div class="main"><div class="content">
  <section class="sec" style="width:352px">${U.mh('Macros')}
    <div class="tbl"><div class="th"><div style="flex:1">Macro name</div></div>
      ${ST.macros.map((m,n)=>`<div class="tr" style="height:49px;cursor:pointer" data-go="oc/editor"><div style="flex:1">${esc(m)}</div><div class="del" style="width:36px"><button data-del-macro="${n}" title="Törlés">${i('trash')}</button></div></div>`).join('')}
      <div class="addrow" data-go="oc/editor" data-new-macro>${i('plus')}</div></div></section>
</div><div class="bottom"><span></span><div class="grp">${U.btn('Cancel',{k:'ghost',act:'data-go="oc/controller"'})}${U.btn('Save',{act:'data-go="oc/controller" data-toast="Macrók mentve"'})}</div></div></div>
${U.status()}`};

/* ---------------- Macro editor ---------------- */
const PAL={
  'Media Controller':['media',['Bumper - 1s','Bumper - 3s','Bumper - 5s','Replay Bumper','Highlights Bumper','Loop','Clear Loop']],
  'Fullscreen':['full',['Schedule','Schedule - Next','Schedule - Previous','Matchup','Team Roster','Swap Team Roster','Groups','Groups - Next','Groups - Previous','Team List','Team List - Next','Team List - Previous','Standby','Fullscreen Twitter','Top Bar Schedule','Fun Facts','MVP','MVP Reveal','MVP Reveal - Next','MVP Reveal - Previous','MVP Reset','Trivia','Trivia Reveal - Next','Trivia Reveal - Previous','Trivia Reset','Pre-show Countdown']],
  'Dota2':['dota',['Ingame','Ingame for GSI','Observers','Bettings','Score Update','Pause Bug','Replay Bug','Highlights Bug','Lower3rd Draft','Team Statistics','Head 2 Head Statistics','H2H Page','H2H Page - Next','H2H Page - Previous','Live Bug','GSI Draft','Fullscreen Draft']],
  'Activities':['act',['MVP','MVP Reveal','MVP Reveal - Next','MVP Reveal - Previous','MVP Reset','Role random','Mafia']],
  'Lower3rd':['l3',['L3 Bar','Toggle Now/Next','Clock Only','News ticker','Twitter ticker','Nameplates','Call-in','Score Update','Song pop-up','Betting','Countdown']]
};
ST.mac=ST.mac||[['media','Bumper - 1s',1],['media','Loop',5],['l3','L3 Bar',5],['l3','News ticker',3],['full','Schedule',30],['full','Schedule - Next',30],['full','Schedule',3],['full','Team Roster',15],['full','Swap Team Roster',15],['full','Team Roster',3],['full','Matchup',30],['full','Matchup',3],['l3','L3 Bar',3],['media','Bumper - 3s',1],['media','Loop',0]];
const mmss=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
ST.macBody=()=>ST.mac.map(([c,l,s],n)=>`<div class="tr mrow" style="height:49px"><div class="grip" style="width:16px">${i('drag')}</div><div class="mcell ${c}" style="width:192px">${esc(l)}</div><div class="cell-num" style="width:88px"><span>${mmss(s)}</span><span class="ud"><button data-mstep="${n}:1">${i('chevup')}</button><button data-mstep="${n}:-1">${i('chev')}</button></span></div><div class="del" style="flex:1"><button data-mdel="${n}" title="Törlés">${i('trash')}</button></div></div>`).join('');
ST.macFoot=()=>{const t=ST.mac.reduce((a,m)=>a+m[2],0);return `<div style="width:208px;padding-left:24px" class="muted hv">Total actions: ${ST.mac.length}</div><div class="muted hv" style="padding-left:16px">${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}</div>`;};
R['oc/editor']={app:'oc',name:'Macro editor',menu:'macros',render:()=>`
${U.topbar('oc','macros')}${U.navOC('editor')}
<div class="main"><div class="content me" style="flex-direction:row;gap:48px">
  <section class="sec" style="width:334px;gap:16px;min-height:0">${U.mh('Macro builder',{sheet:1})}
    <div class="tbl me-t" style="display:flex;flex-direction:column;min-height:0;flex:1"><div class="th"><div style="width:208px;padding-left:24px">Button name</div><div style="flex:1">Length</div></div>
      <div class="me-body sbar" style="flex:1;overflow:auto">${ST.macBody()}</div>
      <div class="th me-foot" style="border-top:1px solid var(--line);border-bottom:0">${ST.macFoot()}</div></div></section>
  <section class="sec" style="flex:1;gap:16px;min-width:0">${U.mh('Controller buttons',{sheet:1})}
    <div class="pal sbar">${Object.entries(PAL).map(([n,[c,bs]])=>`<div class="pal-s"><h4>${n}</h4><div class="ocrow"><div class="ocbs">${bs.map(b=>`<button class="ocb fill ${c}" data-madd="${c}|${esc(b)}">${esc(b)}</button>`).join('')}</div>${n!=='Media Controller'&&n!=='Lower3rd'?rfb(1):'<span style="width:56px"></span>'}</div></div>`).join('')}</div></section>
</div><div class="bottom"><span class="muted" style="font-size:14px">Kattints egy gombra a jobb oldalon, hogy hozzáadd a macróhoz.</span><div class="grp">${U.btn('Cancel',{k:'ghost',act:'data-go="oc/macros"'})}${U.btn('Save',{act:'data-modal="save"'})}</div></div></div>
${U.status()}`,
  modals:{save:()=>U.modal('Save macro',`${U.mh('Macro')}<div style="padding-top:8px">${U.txt({w:320,label:'Macro name',ph:'Enter macro name',noclr:1}).replace('<input','<input id="macro-name"')}</div>`,`${U.btn('Save',{act:'data-save-macro'})}${U.btn('Cancel',{k:'ghost',act:'data-close'})}`,384)}
};
})();
