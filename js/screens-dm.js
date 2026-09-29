/* Data Manager: General, Schedule (+ Save preset), Dota2 (+ Team roster) */
(function(){
const R=window.SCREENS; const {esc}=U; const ST=window.STATE;
const TEAMS='Moist Moguls|The Yard|Team Beer|Team Kindergarden|Storm Spirit|Kinguin|Invictus Gaming|Ninjas in Pyjamas';
const TIMES='11:45 am|12:00 pm|12:30 pm|01:00 pm|02:45 pm|04:55 pm';

/* ---------------- General ---------------- */
const NP=[
  {n:'Properties',rows:[['user','Nickname'],['idcard','Full name'],['x','None',1],['shield','Prediction',1]],props:1},
  {n:'Nameplate - 1',r:2,rows:[['user','Light of Heaven'],['idcard','Dimitry Kupriyanov'],['twitter','@LighTofHeaveNX'],['shield','Prediction',1]]},
  {n:'Nameplate - 2',r:2,act:1,rows:[['user','LD'],['idcard','David Gorman'],['twitter','@LDeeep'],['shield','Prediction',1]]},
  {n:'Nameplate - 3',r:1,rows:[['user','Ludwig'],['idcard','Ludwig Ahgren'],['twitter','@LudwigAhgren'],['shield','Prediction',1]]},
  {n:'Nameplate - 4',r:0,rows:[['user','Pokimane'],['idcard','pokimane'],['twitter','@PokimaneLoL'],['shield','Prediction',1]]},
  {n:'Nameplate - 5',r:0,rows:[['user','ironmouse'],['x','None',1],['twitter','@ironmouse'],['shield','Prediction',1]]}
];
function nameplate(p,k){
  const head=p.props?`<div class="np-h"><span class="np-lbl" style="margin-left:0">Properties</span></div>`
    :`<div class="np-h"><span class="np-r">${[0,1,2].map(n=>U.rd(n===p.r,'np'+k,1)).join('')}</span><span class="np-lbl">${esc(p.n)}</span><button class="np-drag${p.act?' on':''}" title="Áthelyezés">${i('dotsh')}</button></div>`;
  return `<div class="np">${head}<div class="np-t">
    <div class="np-th"><span class="${p.props?'ph':''}">Name</span>${p.props?'':i('chev')}</div>
    ${p.rows.map(([ic,t,m])=>`<div class="np-tr ddt" data-opts="${p.props?'Nickname|Full name|Twitter|Prediction|None':'Light of Heaven|LD|Ludwig|Pokimane|ironmouse|None'}"><span class="icn">${i(ic)}<span class="v${m?' ph':''}">${esc(t)}</span></span>${i('chev','chev')}</div>`).join('')}
  </div></div>`;
}
function matchRow(o){
  return `<div class="row">
    ${U.dd({w:216,label:'Fighter - 1',v:o.f1,opts:TEAMS,dis:o.dis})}${U.num({label:'Score',v:0,dis:o.dis,grey:o.dis})}<span class="vs">vs</span>
    ${U.dd({w:216,label:o.l2||'Fighter - 2',v:o.f2,opts:TEAMS,dis:o.dis,ov:o.ov2})}${U.num({label:'Score',v:0,dis:o.dis,grey:o.dis})}
    <span class="vdiv"></span>${U.txt({w:536,label:'Override info',v:o.ovr||'',ph:'Override info'})}<span class="vdiv"></span>
    ${U.dd({w:120,label:'Start time',v:o.t,opts:TIMES})}${U.txt({w:152,label:'Info - Line #1',v:o.i1||'',ph:'Info #1'})}
    ${o.load?`<div class="row" style="gap:8px">${U.txt({w:120,label:'Info - Line #2',v:o.i2||'',ph:'Info #2'})}<button class="loadd" data-toast="Adat betöltve" title="Load data">${i('sendall')}</button></div>`:U.txt({w:152,label:'Info - Line #2',v:o.i2||'',ph:'Info #2'})}
  </div>`;
}
const ticker=(t)=>U.rm({w:424},U.txt({w:400,v:t,ph:'Ticker text'}).replace('style="width:400px"','style="flex:1"'));
R['dm/general']={app:'dm',name:'General',menu:'common',render:()=>`
${U.topbar('dm','common')}${U.navDM('general')}
<div class="main"><div class="content gen">
  <section class="sec" style="gap:0">${U.mh('Nameplates',{sheet:1,coll:1})}
    <div class="row top" style="margin-top:0;gap:16px">${nameplate(NP[0],0)}<span class="vdiv" style="margin-top:36px"></span>${NP.slice(1).map((p,k)=>nameplate(p,k+1)).join('')}<button class="add" style="width:232px;height:196px;margin-top:28px" data-toast="Új nameplate hozzáadva">${i('plus')}</button></div></section>
  <section class="sec">${U.mh('Currently on',{sheet:1})}${matchRow({f1:'Moist Moguls',f2:'The Yard',t:'11:45 am'})}</section>
  <section class="sec">${U.mh('Up next',{sheet:1,coll:1})}${matchRow({f1:'Team Beer',f2:'Team Kindergarden',l2:"Leffen's Friends",ov2:1,t:'02:45 pm',i1:'Showmatch at',i2:'04:00 PM',load:1})}</section>
  <section class="sec">${U.mh('Score update',{sheet:1,coll:1})}${matchRow({f1:'Storm Spirit',f2:'Kinguin',dis:1,ovr:'Crew drafts',t:'04:55 pm',i1:"Don't miss it!",load:1})}</section>
  <section class="sec">${U.mh('News ticker',{sheet:1,coll:1})}
    <div class="tick">
      ${['Welcome to the biggest tournament of the century!','Make sure to check out our merch at: obp.gg/merch','Type !gigaway in chat to enter the Gigabyte Giveaway','Who will win? Tweet with the hashtag #idklol to participate!','Ludwig vs Tarik at 08:00pm PDT','Donate $322 to request a song on stream!'].map((t,n)=>`<div class="f-wrap"><label>Ticker #${[1,2,3,4,5,6][n]}</label>${ticker(t)}</div>`).join('')}
      <button class="add" style="width:424px" data-add-ticker>${i('plus')}</button>
    </div></section>
  <div class="row top" style="gap:24px">
    <section class="sec" style="width:272px">${U.mh('Countdown',{sheet:1})}<div class="row">${U.num({label:'Hours',v:0})}${U.num({label:'Minutes',v:7})}${U.num({label:'Seconds',v:0})}</div></section>
    <section class="sec" style="width:216px">${U.mh('Call in',{sheet:1})}<div class="row">${U.dd({w:216,label:'Person',v:'Sheepsticked',opts:'Sheepsticked|GoDz|Dakota Cox|Weppas|Skrff'})}</div></section>
    <section class="sec" style="width:312px">${U.mh('Standby',{sheet:1})}<div class="row">${U.txt({w:312,label:'Standby text',v:'We will be back after a quck break'})}</div></section>
  </div>
</div>${U.bottomSend()}</div>
${U.status()}`};

/* ---------------- Schedule ---------------- */
ST.sched=ST.sched||[
  ['T1',0,0,'OB.Neon Esports',2,1,'','08:00 am',0,'SEA - DIV I - Week #5 - Game #1',0],
  ['Fnatic',2,1,'Motivate.Trust Gaming',1,0,'','10:00 am',0,'SEA - DIV I - Week #5 - Game #2',0],
  ['BOOM Esports',1,0,'Execration',2,1,'','12:00 pm',0,'SEA - DIV I - Week #5 - Game #3',0],
  ['TNC Predator',0,0,'Team SMG',2,1,'','02:00 pm',0,'SEA - DIV I - Week #5 - Game #4',0],
  ['',0,0,'',2,0,'Switching over to EEU region','04:00 pm',1,'',0],
  ['Team Spirit',0,0,'PuckChamp',2,0,'','04:30 pm',1,'EEU - DIV I - Week #5 - Game #1',1],
  ['AS Monaco Gambit',0,0,'HellRaisers',2,0,'','06:30 pm',1,'EEU - DIV I - Week #5 - Game #2',1],
  ['B8',0,0,'HYDRA',2,0,'','08:30 pm',1,'EEU - DIV II - Week #5 - Game #1',1]
];
const SCOLS=[['',16],['#',48],['Fighter 1',240],['Score',72],['Winner',72],['',56],['Fighter 2',240],['Score',72],['Winner',72],['Override info',248],['Start time',120],['Show time',104],['Header info',248],['On top bar',104],['',36]];
const SCHTEAMS='T1|Fnatic|BOOM Esports|TNC Predator|Team Spirit|AS Monaco Gambit|B8|OB.Neon Esports|Motivate.Trust Gaming|Execration|Team SMG|PuckChamp|HellRaisers|HYDRA';
function schedRow(r,n){
  const [a,sa,wa,b,sb,wb,ov,t,show,h,top]=r, dis=!a&&!b;
  const cell=(w,html,cls='')=>`<div class="${cls}" style="width:${w}px">${html}</div>`;
  const dd=(v,ph)=>`<span class="${v?'':'ph'}">${esc(v||ph)}</span>${i('chev')}`;
  const nm=(v)=>`<span>${v}</span><span class="ud">${i('chevup')}${i('chev')}</span>`;
  return `<div class="tr${dis?' dis':''}" style="height:64px">
    ${cell(16,i('drag'),'grip')}${cell(48,n+1,'num')}
    ${cell(240,dd(a,'Fighter 1'),'cell-dd ddt" data-opts="'+SCHTEAMS)}${cell(72,nm(sa),'cell-num')}${cell(72,U.rd(wa,'w'+n),'c')}
    ${cell(56,'vs','c muted')}
    ${cell(240,dd(b,'Fighter 2'),'cell-dd ddt" data-opts="'+SCHTEAMS)}${cell(72,nm(sb),'cell-num')}${cell(72,U.rd(wb,'w'+n),'c')}
    ${cell(248,`<input value="${esc(ov)}" placeholder="This info shows up instead of VS">`,'cell-in')}
    ${cell(120,dd(t,'Time'),'cell-dd ddt" data-opts="'+TIMES)}${cell(104,U.cb(show),'c')}
    ${cell(248,`<input value="${esc(h)}" placeholder="Extra information for the viewers">`,'cell-in')}
    ${cell(104,U.cb(top),'c')}${cell(36,`<button data-del-sched="${n}" title="Törlés">${i('trash')}</button>`,'del')}
  </div>`;
}
R['dm/schedule']={app:'dm',name:'Schedule',menu:'common',render:()=>`
${U.topbar('dm','common')}${U.navDM('schedule')}
<div class="main"><div class="content">
  <div class="row top" style="gap:24px">
    <section class="sec" style="width:432px">${U.mh('Preset')}<div class="row nw">${U.dd({w:312,label:'Current preset',v:ST.preset||'SEA Playoffs - Division II',opts:'SEA Playoffs - Division II|SEA Playoffs - Division I|EEU Regular Season'+(ST.presets||[]).map(p=>'|'+p).join('')}).replace('class="f dd"','class="f dd" data-set="preset"')}
      <button class="ibtn" data-toast="Preset mentve" title="Mentés">${i('save')}</button><button class="ibtn" data-modal="preset" title="Mentés másként">${i('saveas')}</button><button class="ibtn" data-toast="Preset törölve" title="Törlés">${i('trashfill')}</button></div></section>
    <section class="sec" style="width:360px">${U.mh('Main header',{sheet:1})}<div class="row">${U.txt({w:360,label:'Header text',v:'SEA Playoffs - Division II - Top 8'})}</div></section>
  </div>
  <section class="sec" style="gap:24px">${U.mh('Schedule',{sheet:1})}
    <div class="tbl sched"><div class="th">${SCOLS.map(([t,w])=>`<div style="width:${w}px">${t}</div>`).join('')}</div>
    <div class="tb">${ST.sched.map(schedRow).join('')}</div>
    <div class="addrow" data-add-sched style="height:64px">${i('plus')}</div></div>
  </section>
</div>${U.bottomSend()}</div>
${U.status()}`,
  modals:{preset:()=>U.modal('Save preset',`${U.mh('Preset')}<div style="padding-top:8px">${U.txt({w:320,label:'Preset name',ph:'Enter preset name',noclr:1}).replace('<input','<input id="preset-name"')}</div>`,`${U.btn('Save',{act:'data-save-preset'})}${U.btn('Cancel',{k:'ghost',act:'data-close'})}`,384)}
};

/* ---------------- Dota2 ---------------- */
const STATS=[[36,'Kills',9],[9,'Deaths',37],[78,'Assists',17],[742,'Last hits',661],[589,'Average XPM','368.8'],['467.2','Average GPM','326.2'],[72405,'Gold earned',49693],[59945,'Scaled Hero Damage',25737],[8005,'Scaled Tower Damage',513],[1833,'Scaled Tower Healing',2748]];
const PLAYERS=[['ztr','Carry','Yuragi'],['phzy','Mid','bzm'],['Sapec','Offlane','ATF'],['LNZ','Support','Taiga'],['ro1f','Hard Support','Misha']];
ST.roster=ST.roster||[['ztr',1],['phzy',1],['Sapec',1],['LNZ',1],['slap',0],['ro1f',1]];
const talent=(t,n)=>`<div class="f-wrap"><label>Talent - ${n}</label>${U.rm({w:224},U.dd({w:200,v:t,opts:'GoDz|Dakota Cox|Weppas|Skrff|Machine|Andres'}).replace('style="width:200px"','style="flex:1"'))}</div>`;
R['dm/dota2']={app:'dm',name:'Dota2',menu:'games',render:()=>`
${U.topbar('dm','games')}
${U.nav([{ev:1},{img:'img/game-dota.png',on:1,go:'dm/dota2'},{ic:'calendar',warn:1,go:'dm/schedule'},{ic:'gear',go:'dm/general',t:'General'},{ic:'list'},{ic:'bracket'},{ic:'docedit'},{ic:'gear'},{ic:'tv',go:'oc/hub'}]).replace('<button class="nb" data-go="dm/general" title="General">','<button class="nb tab" data-go="dm/general" title="Settings">').replace(`${i('gear')}</button>`,`${i('gear')}<span>Settings</span><span class="x">${i('x')}</span></button>`)}
<div class="main"><div class="content">
  <section class="sec">${U.mh('Game info',{sheet:1})}<div class="row">
    ${U.dd({w:160,label:'Best of type',v:'Best of 3',opts:'Best of 1|Best of 3|Best of 5'})}${U.txt({w:384,label:'Match info',ph:'Extra information, ie: Upper Bracket Finals'})}
    ${U.dd({w:200,label:'Minimap size',ph:'Minimap size',v:'',err:1,opts:'Small|Medium|Large'})}<span class="vdiv"></span>
    ${U.dd({w:472,label:'Load from bracket',v:'Natus Vincere vs Invictus Gaming - Lower Bracket Semifinals',opts:'Natus Vincere vs Invictus Gaming - Lower Bracket Semifinals|OG vs Team Spirit - Grand Finals'})}
    ${U.btn('Update bracket',{k:'ghost',lg:1,act:'data-toast="Bracket frissítve"'})}</div></section>
  <section class="sec">${U.mh('Teams',{sheet:1})}<div class="row">
    ${U.dd({w:232,label:'Radiant team',v:ST.rad||'Ninjas in Pyjamas Young',opts:'Ninjas in Pyjamas Young|OG|Team Spirit|Tundra Esports'}).replace('class="f dd"','class="f dd" data-set="rad"')}<button class="ibtn" data-modal="roster" title="Team roster" style="color:var(--t-hl)">${i('users')}</button>
    ${U.dd({w:176,label:'Radiant drafter',v:'LightOfHeaven',opts:'LightOfHeaven|KVM'})}${U.num({label:'Radiant score',v:0})}
    ${U.btn('Swap fighters',{k:'ghost',lg:1,act:'data-swap'})}
    ${U.dd({w:232,label:'Dire team',v:ST.dire||'OG',opts:'Ninjas in Pyjamas Young|OG|Team Spirit|Tundra Esports'}).replace('class="f dd"','class="f dd" data-set="dire"')}<button class="ibtn" data-modal="roster" title="Team roster" style="color:var(--st-red)">${i('users')}</button>
    ${U.dd({w:176,label:'Dire drafter',v:'KVM',opts:'LightOfHeaven|KVM'})}${U.num({label:'Dire score',v:1})}</div></section>
  <section class="sec">${U.mh('Talent',{sheet:1,coll:1})}<div class="row">${['GoDz','Dakota Cox','Weppas','Skrff'].map((t,n)=>talent(t,n+1)).join('')}<button class="add" style="width:224px" data-toast="Új talent hely">${i('plus')}</button></div></section>
  <section class="sec">${U.mh('Post game stats',{coll:1})}
    <div class="row">${U.txt({w:300,label:'Match ID',ph:'Match ID from Dota2'})}${U.btn('Load manually',{k:'ghost dis',lg:1})}${U.btn('Load ID from GSI',{k:'ghost',lg:1,act:'data-toast="Match ID betöltve a GSI-ből"'})}</div>
    <div class="row top" style="gap:24px">
      <div class="tbl" style="width:560px"><div class="th"><div style="width:200px;justify-content:center">Ninjas in Pyjamas Young</div><div style="width:160px;justify-content:center">Stat</div><div style="flex:1;justify-content:center">OG</div></div>
        ${STATS.map(([a,s,b])=>`<div class="tr" style="height:36px"><div style="width:200px" class="c">${a}</div><div style="width:160px" class="c">${s}</div><div style="flex:1" class="c">${b}</div></div>`).join('')}</div>
      <span style="color:var(--t-grey);align-self:center">${i('sendall')}</span>
      <div class="tbl" style="width:560px"><div class="th"><div style="width:200px;justify-content:center">NIP.Young Players</div><div style="width:160px;justify-content:center">Role</div><div style="flex:1;justify-content:center">OG Players</div></div>
        ${PLAYERS.map(([a,r,b])=>`<div class="tr" style="height:36px"><div style="width:200px" class="cell-dd ddt" data-opts="ztr|phzy|Sapec|LNZ|ro1f|slap"><span>${a}</span>${i('chev')}</div><div style="width:160px" class="c">${r}</div><div style="flex:1" class="cell-dd ddt" data-opts="Yuragi|bzm|ATF|Taiga|Misha"><span>${b}</span>${i('chev')}</div></div>`).join('')}</div>
    </div></section>
</div>${U.bottomSend()}</div>
${U.status()}`,
  modals:{roster:()=>U.modal(ST.rad||'Ninjas in Pyjamas Young',`${U.mh('Team roster',{sheet:1})}
    <div class="tbl"><div class="th"><div style="width:64px;justify-content:center">Active</div><div style="flex:1;justify-content:center">Player</div></div>
    ${ST.roster.map(([p,on],n)=>`<div class="tr" style="height:36px"><div style="width:64px" class="c">${U.cb(on).replace('class="cb','data-roster="'+n+'" class="cb')}</div><div style="flex:1">${esc(p)}</div></div>`).join('')}
    <div class="addrow" style="height:36px" data-toast="Új játékos hozzáadva a rosterhez">${i('plus')}</div></div>`,
    `${U.btn('Save',{act:'data-close data-toast="Roster mentve"'})}${U.btn('Cancel',{k:'ghost',act:'data-close'})}`,384)}
};
})();
