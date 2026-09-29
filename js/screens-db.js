/* Database Editor: Players list (live filters, paging) and Player editor (+ Games played modal) */
(function(){
const R=window.SCREENS; const {esc}=U; const ST=window.STATE;
const P=[
 ['23savage','Team Liquid (Player)','375507918','Nuengnara','Teeramahanon','Thailand','@23savagedota',0],
 ['acoR','Mad Dogz (Player), Mousesports (Player)','42677035','Frederik','Gyldstrand','Denmark','@acoRCS',1],
 ['Aimen','','','Aiden','Calvin','United States of America','@aidencalvin',2],
 ['aMSa','RedBull (Player), VGBC (Player)','','Masaya','Chikamoto','Japan','@aMSaRedYoshi',3],
 ['Avery','','','Avery','Avery','','',4],
 ['bnans','','','Hannah','Bananas','United States of America','@bnans',5],
 ['boombell','Mith Gaming.Trust (Player)','101460882','Anurat','Praianun','Thailand','',6],
 ['Captain L','Hungry Bears (Player)','','Landon','Trybuch','Canada','@captainplika',7],
 ['CemaTheSlayer','Mind Games (Player)','91460772','Semion','Krivulya','Ukraine','@c_slayerRR',8],
 ['CeRq','Evil Geniuses (Captain)','196088155','Tsvetelin','Mangalski','Bulgaria','@cerq',9],
 ['Chris Luck','Beastcoast (Coach)','153836240','Jean Pierre','Gonzales','Puerto Rico','',10],
 ['coldzera','FaZe Clan (Player)','79720871','Marcelo','Augosto David','Brazil','@coldzera',11],
 ['Commandment','Team SoloMid (Player)','','Josh','Roach','United States of America','@TSM_Commandment',12],
 ['DFlash','Infamous (Captain)','97366926','Bruno','de Souze Oliveira','Brazil','@Brn_Flash',13],
 ['epileptick1d','Virtus Pro.Prodigy (Player)','124801257','Egor','Grigorenko','','',14],
 ['esK','Black and Yellow (Player)','412758827','Jose','Esau Perez Coronel','Spain','',15],
 ['Fatality','Furia (Player)','','Griffin','Miller','United States of America','@FatalityFalcon',16],
 ['Fiction','','','Shephard','Lima','United States of America','@FictionIRL',17]
];
ST.pq=ST.pq||''; ST.page=ST.page||1;
const teamRole=s=>s.split(', ').filter(Boolean).map(t=>{const m=t.match(/^(.*) \((.*)\)$/);return m?`${esc(m[1])} <span class="muted">(${esc(m[2])})</span>`:esc(t)}).join(', ');
function rows(){
  const q=ST.pq.toLowerCase(), f=ST.pf||{};
  return P.filter(p=>(!q||p.slice(0,7).join(' ').toLowerCase().includes(q))
    &&(!f.teams||f.teams==='Any'||(f.teams==='Yes')===!!p[1])
    &&(!f.api||f.api==='Any'||(f.api==='Yes')===!!p[2])
    &&(!f.tw||f.tw==='Any'||(f.tw==='Yes')===!!p[6])
    &&(!f.nat||f.nat==='Any'||p[5]===f.nat));
}
const COLS=[['Player name',466,1],['Team & Role',321],['API ID',145],['First Name',193,1],['Last Name',193,1],['Nationality',193],['Twitter',193],['Games played',0]];
function tableBody(){
  const r=rows();
  if(!r.length) return `<div class="empty-t">Nincs a szűrőknek megfelelő játékos. <button data-reset-filters>Szűrők törlése</button></div>`;
  return r.map(p=>`<div class="tr pl-row" data-go="db/player" style="height:40px;cursor:pointer">
    <div style="width:466px" class="hv">${esc(p[0])}</div><div style="width:321px">${teamRole(p[1])}</div><div style="width:145px">${p[2]}</div>
    <div style="width:193px">${esc(p[3])}</div><div style="width:193px">${esc(p[4])}</div><div style="width:193px">${esc(p[5])}</div><div style="width:193px">${esc(p[6])}</div>
    <div style="flex:1;padding:0 8px"><img src="img/pl-games-${p[7]}.png" alt="" style="height:38px;display:block"></div></div>`).join('');
}
ST.renderPlayers=()=>{const b=document.querySelector('.pl-body'); if(b) b.innerHTML=tableBody();};
const filt=(k,label,w,opts)=>U.dd({w,label,v:(ST.pf||{})[k]||'Any',opts}).replace('class="f dd"',`class="f dd" data-pf="${k}"`);
R['db/players']={app:'db',name:'Players',menu:'tournament',render:()=>`
${U.topbar('db','tournament')}
<div class="main wide db">
  <div class="content" style="padding:16px 16px 0;gap:24px">
    <div class="mh"><span class="pill">Players</span><button class="sheet" data-toast="Külső sheet összekapcsolása">${i('ext')}</button><span class="ln"></span><button class="addc" data-go="db/player" title="Új játékos">${i('plus')}</button></div>
    <div class="row" style="margin-top:-4px">
      ${U.txt({w:280,label:'Search',v:ST.pq,ph:'Filters in all fields',search:1}).replace('<input','<input data-pq')}
      ${filt('teams','Has teams',96,'Any|Yes|No')}${filt('api','Has API',96,'Any|Yes|No')}${filt('nat','Nationality',216,'Any|Thailand|Denmark|United States of America|Japan|Canada|Ukraine|Bulgaria|Brazil|Spain|Puerto Rico')}
      ${filt('tw','Has twitter',96,'Any|Yes|No')}${filt('game','Game played',216,'Any|Dota2|CS:GO|Smash Melee|Smash Ultimate|Fortnite|Rocket League')}
      <span style="flex:1 1 0"></span>${U.btn('Reset filters',{k:'ghost',lg:1,w:160,act:'data-reset-filters'})}
    </div>
    <div class="tbl pl-tbl" style="flex:1;min-height:0">
      <div class="th">${COLS.map(([t,w,s])=>`<div style="${w?`width:${w}px`:'flex:1'}">${s?`<span class="sort">${i('sort')}</span>`:''}${t}</div>`).join('')}</div>
      <div class="pl-body">${tableBody()}</div>
    </div>
  </div>
  <div class="bottom pager">
    <div class="pages">${i('left')}${[1,2,3,4,5].map(n=>`<button data-page="${n}" class="${n===ST.page?'on':''}">${n}</button>`).join('')}<span>…</span><button data-page="320" class="${ST.page===320?'on':''}">320</button>${i('right')}</div>
    <span class="vdiv" style="height:56px"></span>
    <div class="row" style="gap:16px">${U.txt({w:80,label:'Go to page',ph:'Page #',noclr:1})}<button class="gobtn" data-toast="Oldalra ugrás">${i('right')}</button></div>
  </div>
</div>`};

/* ---------------- Player editor ---------------- */
ST.games=ST.games||[['CS:GO',1],['Dota2',1],['Fortnite',1],['League of Legends',1],['Smash Melee',0],['Smash Ultimate',1],['Valorant',1],['Rocket League',0]];
const circ=(img,cls='')=>`<button class="circ ${cls}" data-toast="${cls?'Elem eltávolítva':'Kattints jobb gombbal a törléshez'}"><img src="img/${img}.png" alt=""></button>`;
const slot=(label,w,img,empty)=>`<div class="slot"><label>${label}</label><div class="sl${empty?' empty':''}" style="width:${w}px">${img?`<img src="img/${img}.png" alt="">`:i('image')}<span class="sl-h"><button data-toast="Kép feltöltése">${i('upload')}</button><button data-toast="Kép megnyitása">${i('search')}</button><button data-toast="Kép törölve">${i('trashfill')}</button></span></div></div>`;
R['db/player']={app:'db',name:'Player editor',menu:'tournament',render:()=>`
${U.topbar('db','tournament')}
<div class="main wide db">
  <div class="ed-head"><button class="back" data-go="db/players">${i('left')}<span>Back</span></button><h2>TORONTOTOKYO</h2><span style="width:80px"></span></div>
  <div class="content" style="padding:16px 16px 24px;gap:24px">
    <section class="sec">${U.mh('Personal info',{sheet:1})}<div class="row">${U.txt({w:452,label:'Nickname',v:'enkay J'})}${U.txt({w:452,label:'First Name',v:'Niclas'})}${U.txt({w:452,label:'Last Name',v:'Krumhorn'})}${U.dd({w:452,label:'Nationality',v:'Germany',opts:'Germany|Hungary|Russia|Ukraine|United States of America'})}</div></section>
    <section class="sec">${U.mh('Social media',{sheet:1})}<div class="row">${[['Twitter','@enkay_J','Twitter handle'],['Twitch','','Twitch channel'],['Instagram','','Instagram profile'],['Facebook','','Facebook profile'],['VKontakte','','VKontakte profile'],['YouTube','','YouTube page'],['Weibo','','Weibo profile']].map(([l,v,ph])=>U.txt({w:251,label:l,v,ph})).join('')}</div></section>
    <section class="sec">${U.mh('API & Betting',{sheet:1})}<div class="row">${U.txt({w:608,label:'General API name',ph:'API name'})}${U.txt({w:608,label:'Steam ID',v:'115482211'})}${U.txt({w:608,label:'Betting ID',ph:'Betting IDs, comma separated'})}</div></section>
    <div class="row top" style="gap:24px">
      <section class="sec" style="width:591px">${U.mh('Games played',{sheet:1})}<div class="row" style="gap:24px">${circ('g-dota')}${circ('g-csgo')}${circ('g-removed','rem')}<button class="circ addc2" data-modal="games" title="Játék hozzáadása">${i('plus')}</button></div></section>
      <section class="sec" style="width:591px">${U.mh('Teams',{sheet:1})}<div class="row" style="gap:24px">${circ('t-1')}${circ('t-2')}${circ('t-removed','rem')}</div></section>
      <section class="sec" style="width:626px">${U.mh('Images',{sheet:1})}<div class="row top" style="gap:29px;margin-top:-4px">${slot('Main',80,'img-main')}${slot('Portrait',56,'img-portrait')}${slot('Wide',104,'img-wide')}${slot('Extra - 1',80,'',1)}${slot('Extra - 2',80,'blank-player')}${slot('Extra - 3',80,'',1)}</div></section>
    </div>
  </div>
  <div class="bottom">${U.btn('Delete',{k:'alert',act:'data-go="db/players" data-toast="Játékos törölve"'})}<div class="grp">${U.btn('Cancel',{k:'ghost',act:'data-go="db/players"'})}${U.btn('Save',{act:'data-go="db/players" data-toast="TORONTOTOKYO mentve"'})}</div></div>
</div>`,
  modals:{games:()=>U.modal('Games played',`<div class="tbl"><div class="th"><div style="width:64px;justify-content:center">Active</div><div style="flex:1;justify-content:center">Game</div></div>
    <div class="sbar" style="max-height:252px;overflow:auto">${ST.games.map(([g,on],n)=>`<div class="tr" style="height:36px"><div style="width:64px" class="c">${U.cb(on)}</div><div style="flex:1">${esc(g)}</div></div>`).join('')}</div></div>`,
    `${U.btn('Save',{act:'data-close data-toast="Játékok mentve"'})}${U.btn('Cancel',{k:'ghost',act:'data-close'})}`,400)}
};
})();
