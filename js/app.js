/* Router, window scaling, prototype bar and all interactions (event delegation). */
(function(){
const R=window.SCREENS, ST=window.STATE, $=s=>document.querySelector(s);
const win=$('#win'), stage=$('#stage');
const ORDER=['launcher/login','launcher/events','launcher/main','dm/general','dm/schedule','dm/dota2','db/players','db/player','oc/hub','oc/controller','oc/macros','oc/editor'];
const APPS=[['launcher','Launcher','launcher/login'],['dm','Data Manager','dm/general'],['db','Database Editor','db/players'],['oc','Overlay Controller','oc/hub']];
let cur=null, scale=1, modal=null;

/* ---------- layout ---------- */
function fit(){ document.documentElement.style.setProperty('--pbar-h',$('#pbar').offsetHeight+'px'); }
addEventListener('resize',fit);

/* ---------- routing ---------- */
const toHash=k=>k.replace('/','.'), fromHash=h=>h.replace('.','/');
function go(k,push=true){
  if(!R[k]) return;
  closeDD(); modal=null; cur=k;
  win.innerHTML=`<div class="screen" data-screen="${k}">${R[k].render()}</div>`;
  if(push&&location.hash!=='#'+toHash(k)){ try{history.pushState(null,'','#'+toHash(k))}catch(e){location.hash=toHash(k)} }
  document.querySelectorAll('#pbar .ptab').forEach(b=>b.setAttribute('aria-current',b.dataset.app===R[k].app));
  $('#psel').value=k;
  document.title=R[k].name+' · TinyIO v3.0';
}
function rerender(){ const m=modal; const sc=[...win.querySelectorAll('.content,.sbar,.pal')].map(e=>e.scrollTop); go(cur,false); [...win.querySelectorAll('.content,.sbar,.pal')].forEach((e,n)=>e.scrollTop=sc[n]||0); if(m) openModal(m); }
addEventListener('popstate',()=>{const k=fromHash(location.hash.slice(1)); if(R[k]&&k!==cur) go(k,false);});
addEventListener('hashchange',()=>{const k=fromHash(location.hash.slice(1)); if(R[k]&&k!==cur) go(k,false);});

/* ---------- modal / toast ---------- */
function openModal(id){ const f=R[cur].modals&&R[cur].modals[id]; if(!f) return; closeModal(); modal=id; win.querySelector('.screen').insertAdjacentHTML('beforeend',f()); const inp=win.querySelector('.scrim input'); inp&&inp.focus(); }
function closeModal(){ const s=win.querySelector('.scrim'); s&&s.remove(); modal=null; }
let tt; function toast(t){ document.querySelectorAll('.toast').forEach(e=>e.remove()); document.body.insertAdjacentHTML('beforeend',`<div class="toast" role="status">${i('okc')}<span>${U.esc(t)}</span></div>`); clearTimeout(tt); tt=setTimeout(()=>document.querySelectorAll('.toast').forEach(e=>e.remove()),2400); }

/* ---------- dropdown menu ---------- */
let ddOwner=null;
function openDD(owner,items,onPick,cur){
  closeDD(); ddOwner=owner;
  const r=owner.getBoundingClientRect();
  const m=document.createElement('div'); m.className='ddm'; m.setAttribute('role','listbox');
  m.innerHTML=items.map((it,n)=>typeof it==='string'?`<button data-i="${n}" class="${it===cur?'sel':''}">${U.esc(it)}</button>`:(it.hint?`<div class="hint">${U.esc(it.hint)}</div>`:`<button data-i="${n}" class="${it.cls||''}">${it.ic?i(it.ic):''}${U.esc(it.t)}</button>`)).join('');
  m.style.minWidth=Math.max(160,r.width)+'px';
  document.body.appendChild(m);
  const W=innerWidth,H=innerHeight;
  let top=r.bottom+4; if(top+m.offsetHeight>H-8) top=Math.max(8,r.top-4-m.offsetHeight);
  let left=Math.min(r.left,W-8-m.offsetWidth); left=Math.max(8,left);
  m.style.top=top+'px'; m.style.left=left+'px';
  owner.classList.add('open');
  m.addEventListener('click',e=>{const b=e.target.closest('[data-i]'); if(!b) return; e.stopPropagation(); const it=items[+b.dataset.i]; closeDD(); onPick(it);});
}
function closeDD(){ document.querySelectorAll('.ddm').forEach(e=>e.remove()); if(ddOwner){ddOwner.classList.remove('open'); ddOwner=null;} }

/* ---------- top-bar menus ---------- */
const TODO='Ez a képernyő még nincs HTML-ben megépítve (a Figma-ban megvan)';
const MENU={
  'dm:common':[{t:'General',go:'dm/general'},{t:'Schedule',go:'dm/schedule'},{t:'Activities'},{t:'Standby'},{t:'Playlist'}],
  'dm:tournament':[{t:'Events'},{t:'Groups'},{t:'Brackets'},{t:'Leaderboard'},{t:'Score grid'}],
  'dm:third':[{t:'Merchandise'},{t:'Betting'},{t:'Twitter'}],
  'dm:games':[{t:'Dota2',go:'dm/dota2'},{t:'CS:GO'},{t:'Smash Melee'},{t:'Smash Ultimate'},{t:'Rocket League'},{t:'Fortnite'},{t:'Valorant'},{t:'League of Legends'},{t:'Jeopardy'}],
  'dm:data':[{t:'Overrides'},{t:'Database Editor',go:'db/players'}],
  'dm:settings':[{t:'Customization'},{t:'Launcher',go:'launcher/main'},{t:'Kijelentkezés',go:'launcher/login'}],
  'db:admin':[{t:'Users'},{t:'Kilépés a Launcherbe',go:'launcher/main'}],
  'db:general':[{t:'Merchandise'},{t:'Sponsors'},{t:'Nationalities'}],
  'db:tournament':[{t:'Events'},{t:'Players',go:'db/players'},{t:'Casters'},{t:'Teams'},{t:'Crews'}],
  'db:games':[{t:'CS:GO maps'},{t:'Dota2 heroes'},{t:'Dota2 items'},{t:'Rocket League cards'}],
  'db:overlay':[{t:'Designs'},{t:'Presets'},{t:'Hints'},{t:'Localizations'}]
};
const OCGO={hub:'oc/hub',controller:'oc/controller',macros:'oc/macros'};
function topMenu(btn){
  const key=btn.dataset.menu, [set,k]=key.split(':');
  if(set==='oc'){ if(OCGO[k]) return go(OCGO[k]); if(k==='debug'){ if(cur!=='oc/hub') go('oc/hub'); return openModal('debug'); } return toast(TODO); }
  const items=MENU[key]||[];
  openDD(btn,items.map(x=>({t:x.t,cls:x.go?(x.go===cur?'sel':''):'todo',go:x.go})),it=>it.go?go(it.go):toast(TODO));
  document.querySelectorAll('.ddm .todo').forEach(b=>b.style.color='var(--t-grey)');
}

/* ---------- click delegation ---------- */
win.addEventListener('click',e=>{
  const t=e.target;
  if(!t.closest('.ddm') && !t.closest('[data-opts]') && !t.closest('[data-menu]')) closeDD();
  const q=s=>t.closest(s);
  let el;
  if(el=q('[data-scrim]')){ if(t===el) return closeModal(); }
  if(el=q('[data-menu]')) return topMenu(el);
  if(el=q('[data-step]')){ const inp=el.closest('.box').querySelector('input'); const v=(parseFloat(inp.value)||0)+(+el.dataset.step); inp.value=Math.max(0,v); return; }
  if(el=q('[data-mstep]')){ const [n,d]=el.dataset.mstep.split(':').map(Number); ST.mac[n][2]=Math.max(0,ST.mac[n][2]+d); refreshMacro(); return; }
  if(el=q('[data-mdel]')){ ST.mac.splice(+el.dataset.mdel,1); refreshMacro(); return; }
  if(el=q('[data-madd]')){ const [c,l]=el.dataset.madd.split('|'); ST.mac.push([c,l,3]); refreshMacro(true); return; }
  if(el=q('[data-clr]')){ const inp=el.closest('.box').querySelector('input'); inp.value=''; inp.focus(); if(inp.matches('[data-pq]')){ST.pq='';ST.renderPlayers();} return; }
  if(el=q('[data-opts]')){ if(el.closest('.f.dis')) return; if(el.classList.contains('open')) return closeDD();
    const opts=el.dataset.opts.split('|').filter(Boolean), vEl=el.querySelector('.v')||el.querySelector('span');
    return openDD(el,opts,v=>{ if(vEl){vEl.textContent=v; vEl.classList.remove('ph');}
      const set=el.closest('[data-set]'); if(set){ ST[set.dataset.set]=v; rerender(); }
      const pf=el.closest('[data-pf]'); if(pf){ ST.pf=ST.pf||{}; ST.pf[pf.dataset.pf]=v; ST.renderPlayers(); }
      el.closest('.box')&&el.querySelector('.box').classList.remove('err'); el.querySelector('.box')&&el.querySelector('.box').classList.remove('err');
    }, vEl&&vEl.textContent); }
  if(el=q('.cb')){ const on=!el.classList.contains('on'); el.classList.toggle('on',on); el.setAttribute('aria-checked',on); el.innerHTML=i(on?'checkboxon':'checkbox');
    if(el.dataset.roster!=null) ST.roster[+el.dataset.roster][1]=on?1:0;
    const set=el.closest('[data-set]'); if(set){ ST[set.dataset.set]=on; rerender(); } return; }
  if(el=q('.rd')){ const g=el.dataset.g; if(g) win.querySelectorAll(`.rd[data-g="${g}"]`).forEach(r=>{r.classList.remove('on');r.setAttribute('aria-checked','false')}); el.classList.add('on'); el.setAttribute('aria-checked','true'); return; }
  if(el=q('.sw[role=switch]')){ const on=!el.classList.contains('on'); el.classList.toggle('on',on); el.setAttribute('aria-checked',on); return; }
  if(el=q('[data-coll]')){ const sec=el.closest('.sec'); const hide=!sec.classList.contains('collapsed'); sec.classList.toggle('collapsed',hide); [...sec.children].slice(1).forEach(c=>c.hidden=hide); el.innerHTML=i(hide?'plus':'minus'); return; }
  if(el=q('[data-pg]')){ e.stopPropagation(); const [id,d]=el.dataset.pg.split(/:(?=-?\d+$)/); ST.ocPg[id]=((ST.ocPg[id]||0)+(+d)+5)%5; ST.ocOn[id]=true; rerender(); return; }
  if(el=q('[data-oc]')){ const id=el.dataset.oc; ST.ocOn[id]=!ST.ocOn[id]; el.classList.toggle('on',ST.ocOn[id]); return; }
  if(el=q('[data-hideall]')){ Object.keys(ST.ocOn).forEach(k=>ST.ocOn[k]=false); rerender(); toast('Minden overlay elrejtve'); return; }
  if(el=q('[data-color]')){ ST.color=+el.dataset.color; win.querySelectorAll('[data-color]').forEach(b=>b.classList.toggle('on',b===el)); return; }
  if(el=q('[data-ev]')){ ST.evSel=+el.dataset.ev; win.querySelectorAll('[data-ev]').forEach(c=>c.classList.toggle('sel',c===el)); if(e.detail>1&&el.dataset.dbl) go(el.dataset.dbl); return; }
  if(el=q('[data-swap]')){ const a=ST.rad||'Ninjas in Pyjamas Young', b=ST.dire||'OG'; ST.rad=b; ST.dire=a; rerender(); toast('Oldalak felcserélve'); return; }
  if(el=q('[data-create-event]')){ const n=(win.querySelector('#ev-name')||{}).value||'Dragon Smash of the Ancients: Global Kombat'; ST.events.splice(5,0,['',n,'Mar 1, 2022 - Mar 20, 2022','2022-03-01','2022-03-20']); ST.evSel=5; closeModal(); rerender(); toast('Esemény létrehozva: '+n); return; }
  if(el=q('[data-save-preset]')){ const n=(win.querySelector('#preset-name')||{}).value.trim(); if(!n){ win.querySelector('#preset-name').closest('.box').classList.add('err'); return; } ST.presets=(ST.presets||[]).concat(n); ST.preset=n; closeModal(); rerender(); toast('Preset mentve: '+n); return; }
  if(el=q('[data-save-macro]')){ const n=(win.querySelector('#macro-name')||{}).value.trim(); if(!n){ win.querySelector('#macro-name').closest('.box').classList.add('err'); return; } ST.macros.push(n); go('oc/macros'); toast('Macro mentve: '+n); return; }
  if(el=q('[data-del-macro]')){ e.stopPropagation(); ST.macros.splice(+el.dataset.delMacro,1); rerender(); return; }
  if(el=q('[data-del-sched]')){ ST.sched.splice(+el.dataset.delSched,1); rerender(); return; }
  if(el=q('[data-add-sched]')){ ST.sched.push(['',0,0,'',0,0,'','','0','',0]); rerender(); const b=win.querySelector('.sched').closest('.content'); b.scrollTop=b.scrollHeight; return; }
  if(el=q('[data-add-ticker]')){ el.insertAdjacentHTML('beforebegin',`<div class="f-wrap"><label>Ticker #${win.querySelectorAll('.tick .f-wrap').length+1}</label>${U.rm({w:424},U.txt({w:400,ph:'Ticker text'}).replace('style="width:400px"','style="flex:1"'))}</div>`); el.previousElementSibling.querySelector('input').focus(); return; }
  if(el=q('[data-conn]')){ if(el.classList.contains('dis')) return; ST.connected=el.dataset.conn==='1'; rerender(); toast(ST.connected?'Csatlakozva: 192.168.1.222':'Kapcsolat bontva'); return; }
  if(el=q('[data-play]')){ el.classList.toggle('on'); const bar=el.parentElement.querySelector('.bar i'); bar.style.width=el.classList.contains('on')?'78%':'22%'; el.innerHTML=i(el.classList.contains('on')?'minus':'play'); return; }
  if(el=q('[data-page]')){ ST.page=+el.dataset.page; win.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('on',b===el)); return; }
  if(el=q('[data-reset-filters]')){ ST.pq=''; ST.pf={}; rerender(); return; }
  if(el=q('[data-modal]')){ openModal(el.dataset.modal); return; }
  if(el=q('[data-close]')){ closeModal(); if(el.dataset.toast) toast(el.dataset.toast); return; }
  if(el=q('[data-go]')){ const g=el.dataset.go; if(el.dataset.toast) setTimeout(()=>toast(el.dataset.toast),10); if(g) return go(g); }
  if(el=q('[data-toast]')){ toast(el.dataset.toast); return; }
});
function refreshMacro(added){ const b=win.querySelector('.me-body'); if(!b) return; b.innerHTML=ST.macBody(); win.querySelector('.me-foot').innerHTML=ST.macFoot(); if(added){ b.scrollTop=b.scrollHeight; b.lastElementChild.classList.add('flash'); } }
win.addEventListener('input',e=>{ if(e.target.matches('[data-pq]')){ ST.pq=e.target.value; ST.renderPlayers(); } });
win.addEventListener('submit',e=>{ if(e.target.matches('[data-login]')){ e.preventDefault(); go('launcher/events'); } });
win.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.matches('.cb,.rd,.sw,[data-opts] .box,.box[role=button]')){ e.preventDefault(); e.target.click(); }
  if(e.key==='Enter'&&e.target.id==='macro-name') win.querySelector('[data-save-macro]').click();
  if(e.key==='Enter'&&e.target.id==='preset-name') win.querySelector('[data-save-preset]').click();
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if(document.querySelector('.ddm')) closeDD(); else if(modal) closeModal(); } });
document.addEventListener('click',e=>{ if(!win.contains(e.target)&&!e.target.closest('.ddm')) closeDD(); });
win.addEventListener('scroll',()=>closeDD(),true);

/* ---------- prototype bar ---------- */
$('#ptabs').innerHTML=APPS.map(([k,n,f])=>`<button class="ptab" data-app="${k}" data-first="${f}">${n}</button>`).join('');
$('#ptabs').addEventListener('click',e=>{const b=e.target.closest('.ptab'); if(b) go(b.dataset.first);});
$('#psel').innerHTML=APPS.map(([k,n])=>`<optgroup label="${n}">${ORDER.filter(s=>R[s].app===k).map(s=>`<option value="${s}">${R[s].name}</option>`).join('')}</optgroup>`).join('');
$('#psel').addEventListener('change',e=>go(e.target.value));
const step=d=>{const n=ORDER.indexOf(cur); go(ORDER[(n+d+ORDER.length)%ORDER.length]);};
$('#pprev').onclick=()=>step(-1); $('#pnext').onclick=()=>step(1);

fit();
const start=fromHash(location.hash.slice(1));
go(R[start]?start:'launcher/login',false);
})();
