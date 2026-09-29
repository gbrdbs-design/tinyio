/* Launcher: Login, Event selection (grid / list + Create modal), Main screen */
(function(){
const R=window.SCREENS=window.SCREENS||{};
const {esc}=U;
const ST=window.STATE=window.STATE||{};

ST.events=ST.events||[
  ['bts-america','BTS Pro Series - Season 10 - America','Feb 5, 2022 - Mar 6, 2022','2022-02-05','2022-03-06'],
  ['bts-sea','BTS Pro Series - Season 10 - SEA','Feb 5, 2022 - Mar 6, 2022','2022-02-05','2022-03-06'],
  ['dpc-sea','DPC SEA - Regional Finals','Feb 11, 2022 - Feb 13, 2022','2022-02-11','2022-02-13'],
  ['dpc-eeu','DPC EEU - Regional Finals','Feb 18, 2022 - Feb 20, 2022','2022-02-18','2022-02-20'],
  ['ultimate-summit-4','Smash Ultimate Summit 4','Mar 3, 2022 - Mar 6, 2022','2022-03-03','2022-03-06'],
  ['cs-summit-3','cs_summit 3','Oct 31, 2018 - Nov 4, 2018','2018-10-31','2018-11-04',1],
  ['smash-summit-7','Smash Summit 7','Nov 14, 2018 - Nov 18, 2018','2018-11-14','2018-11-18',1],
  ['artifact-house-party','Artifact House Party','Nov 17, 2018 - Nov 18, 2018','2018-11-17','2018-11-18',1],
  ['legion-bootcamp','Legiojn Bootcamp','Dec 1, 2018 - Dec 2, 2018','2018-12-01','2018-12-02',1],
  ['smash-ultimate-summit','Smash Ultimate Summit','Mar 8, 2019 - Mar 10, 2019','2019-03-08','2019-03-10',1],
  ['openai','OpenAI','Apr 13, 2019 - Apr 13, 2019','2019-04-13','2019-04-13',1],
  ['summit-of-time','Summit of Time','May 9, 2019 - May 12, 2019','2019-05-09','2019-05-12',1]
];
if(ST.evSel==null) ST.evSel=2;
if(ST.showPast==null) ST.showPast=true;
if(!ST.evView) ST.evView='Grid view';

/* ---------------- Login ---------------- */
R['launcher/login']={app:'launcher',name:'Login',render:()=>`
${U.topbar(null)}
<div class="main wide login">
  <img class="lg-logo" src="img/tinyio-logo.png" alt="TinyIO">
  <form class="lg-form" data-login>
    <label class="lg-f">${i('user')}<input id="lg-user" value="mccormic" autocomplete="username" aria-label="Felhasználónév"></label>
    <label class="lg-f">${i('keylock')}<input id="lg-pass" type="password" value="supersecret1" autocomplete="current-password" aria-label="Jelszó"></label>
    <div class="lg-rm">${U.cb(true,'Remember me')}</div>
    <button class="btn pri xl" type="submit">Login</button>
    <button type="button" class="lg-forgot" data-toast="Jelszó-visszaállító e-mail elküldve">Forgot password?</button>
  </form>
</div>
${U.status()}`};

/* ---------------- Event selection ---------------- */
function evCard(e,idx){
  const [img,name,dates,, ,past]=e;
  return `<button class="ev-card${idx===ST.evSel?' sel':''}${past?' past':''}" data-ev="${idx}" data-dbl="launcher/main">
    <span class="ev-img">${img?`<img src="img/ev-${img}.png" alt="">`:`<span class="ev-new">${i('image')}</span>`}</span>
    <span class="ev-meta"><span class="ev-name">${esc(name)}</span><span class="ev-date">${esc(dates)}</span></span></button>`;
}
function evList(){
  const rows=ST.events.map((e,n)=>[e,n]).filter(([e])=>ST.showPast||!e[5]);
  return `<div class="tbl ev-tbl">
    <div class="th"><div style="width:96px;justify-content:center">${i('image')}</div><div style="flex:1">${i('sort')}Event name</div><div style="width:207px">${i('sort')}Start date</div><div style="width:207px">${i('sort')}End date</div></div>
    ${rows.map(([e,n])=>`<div class="tr ev-row${n===ST.evSel?' sel':''}${e[5]?' past':''}" data-ev="${n}" data-dbl="launcher/main" style="height:48px;cursor:pointer"><div style="width:96px;justify-content:center">${e[0]?`<img src="img/ev-${e[0]}.png" style="width:32px;height:32px;object-fit:cover;border-radius:4px">`:''}</div><div style="flex:1">${esc(e[1])}</div><div style="width:207px">${e[3]}</div><div style="width:207px">${e[4]}</div></div>`).join('')}
    <div class="addrow" data-modal="create">${i('plus')}</div></div>`;
}
R['launcher/events']={app:'launcher',name:'Event selection',render:()=>{
  const list=ST.events.map((e,n)=>[e,n]).filter(([e])=>ST.showPast||!e[5]);
  return `
${U.topbar(null)}
<div class="main wide">
  <div class="content" style="padding:24px 24px 0">
    ${ST.evView==='Grid view'
      ?`<div class="ev-grid">${list.map(([e,n])=>evCard(e,n)).join('')}<button class="ev-card add-card" data-modal="create" aria-label="Új esemény">${i('plus')}</button></div>`
      :evList()}
  </div>
  <div class="bottom">
    ${U.dd({w:272,v:'Offbrand Productions',opts:'Offbrand Productions|Beyond The Summit|Mate Mate Studio'})}
    ${U.btn('Select',{act:'data-go="launcher/main"',w:144})}
    <div class="grp" style="gap:24px">${U.dd({w:228,v:ST.evView,opts:'Grid view|List view',st:'evview'}).replace('class="f dd"','class="f dd" data-set="evView"')}${U.cb(ST.showPast,'Show past events').replace('class="cb','data-set="showPast" class="cb')}</div>
  </div>
</div>
${U.status()}`},
  modals:{create:()=>U.modal('Create new event',`
    ${U.mh('Event details',{sheet:1})}
    <div style="display:flex;flex-direction:column;gap:24px;padding-top:8px">
      ${U.txt({w:416,label:'Event name',v:'',ph:'Dragon Smash of the Ancients: Global Kombat',id:'ev-name'}).replace('<input','<input id="ev-name"')}
      <div class="row" style="gap:10px">${U.dd({w:203,label:'From',v:'Feb 31, 2022',cal:1,opts:'Mar 1, 2022|Mar 15, 2022|Apr 1, 2022'})}${U.dd({w:203,label:'To',v:'Mar 20, 2022',cal:1,opts:'Mar 20, 2022|Apr 3, 2022|Apr 30, 2022'})}</div>
    </div>`,
    `${U.btn('Create',{act:'data-create-event'})}${U.btn('Cancel',{k:'ghost',act:'data-close'})}`)}
};

/* ---------------- Main screen ---------------- */
const box=(title,count,items,extra='')=>`<section class="dbox"><h3>${esc(title)} <span>- ${count}</span></h3>${items?`<div class="dlist sbar">${items}</div>`:extra}</section>`;
const li=(t,img,cls='')=>`<div class="dli ${cls}">${img?`<img src="${img}" alt="">`:''}<span>${esc(t)}</span></div>`;
if(ST.color==null) ST.color=1;
R['launcher/main']={app:'launcher',name:'Main screen',render:()=>`
${U.topbar('dm')}
${U.nav([{ev:1},{img:'img/game-melee.png',t:'Smash Melee'},{ic:'calendar',warn:1,go:'dm/schedule',t:'Schedule'},{tab:{img:'img/game-dota.png',label:'Dota2'},go:'dm/dota2'},{ic:'list'},{ic:'bracket'},{ic:'docedit'},{ic:'gear'},{ic:'tv',go:'oc/hub',t:'Overlay Controller'}])}
<div class="main home">
  <aside class="side">
    <div class="side-t"><h2>SEA DPC - Winter Tour - 2022</h2><p>Dec 12, 2021 - Feb 6, 2022</p></div>
    <hr><img src="img/sea-dpc.png" alt="SEA DPC" style="width:270px;height:244px;object-fit:contain">
    <hr><img src="img/dpc-sea-wide.png" alt="DPC SEA" style="width:270px;height:112px;object-fit:contain">
    <hr><div class="side-def"><img src="img/blank-team.png" alt="Default team"><img src="img/blank-player.png" alt="Default player"></div>
    <hr><div class="side-ov"><p><b>Flatbox2</b> <span class="d">-</span> <span class="hl">DPC SEA 2021</span></p>
      <div class="swatches">${[1,2,3,4].map(n=>`<button class="sw${n}${ST.color===n?' on':''}" data-color="${n}">${n}</button>`).join('')}</div></div>
  </aside>
  <div class="databox">
    <div class="dgrid">
      ${box('Players',80,['Nikobaby','Limmp','s4','Handsken','fng','Zai','Puppey'].map(n=>li(n,'img/team-alliance.png')).join(''))}
      ${box('Teams',16,[['Alliance','alliance'],['Complexity','complexity'],['Invictus Gaming','ig'],['Sprout','sprout'],['Team Liquid','liquid']].map(([n,k])=>li(n,'img/team-'+k+'.png')).join(''))}
      ${box('Talent',10,['GoDz','Dakota','HotBid','Jenkins','NatTea','Sheepsticked'].map(n=>li(n,'','pad')).join(''))}
      ${box('Crews',0,'','<div class="dempty"><img src="img/crews-empty.png" alt=""></div>')}
      ${box('Merchandise',14,['Cast Isometric Tee','Frog Stickers','Good Game Tote','Tie-Die Egg Shirt','Wavedash Long Sleeve','Cozy Hoodie'].map(n=>li(n,'','pad')).join(''))}
      ${box('Sponsors',4,[['AOC','aoc'],['EGB','egb'],['HitBox','hitbox'],['MSI','msi']].map(([n,k])=>li(n,'img/sp-'+k+'.png','sp')).join(''))}
      ${box('API',4,`<div class="dli api">${i('okc')}<span>EGB</span></div><div class="dli api">${i('okc')}<span>Twitch</span></div><div class="dli api w">${i('warn')}<span>Twitter</span></div><div class="dli api e">${i('errc')}<span>Waypoint</span></div>`)}
      ${box('Templates',6,['Activities','Dota2','Fullscreen','Lower3rd','Media Controller','Splitscreen'].map(n=>li(n,'','pad')).join(''))}
    </div>
    <div class="appbtns">
      <button class="appbtn data" data-go="dm/general">Data Manager</button>
      <button class="appbtn ctrl" data-go="oc/hub">Overlay Controller</button>
      <button class="appbtn media" data-toast="A Media Player képernyői még nincsenek megtervezve">Media Player</button>
    </div>
  </div>
</div>
${U.status()}`};
})();
