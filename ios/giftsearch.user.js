// ==UserScript==
// @name         선물검색 (아이폰)
// @namespace    growth_er.kakao-gift-search
// @version      1.2
// @description  카카오 선물함 검색: 브랜드, 상품명으로 찾고 바코드 버튼으로 카카오톡에서 바로 열기
// @match        https://gift.kakao.com/*
// @noframes
// @run-at       document-start
// @inject-into  page
// @updateURL    https://raw.githubusercontent.com/CHABUMSUK/kakao-gift-search/main/ios/giftsearch.user.js
// @downloadURL  https://raw.githubusercontent.com/CHABUMSUK/kakao-gift-search/main/ios/giftsearch.user.js
// ==/UserScript==
// 1) 페이지 코드보다 먼저: 사이트가 아이폰을 "휴대폰/아이패드"로 판단해 카톡 앱으로 보내지 않도록 PC 사파리처럼 보이게 함
(function(){try{
var UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
var P=Navigator.prototype;
Object.defineProperty(P,'userAgent',{get:function(){return UA;},configurable:true});
Object.defineProperty(P,'appVersion',{get:function(){return UA.slice(8);},configurable:true});
Object.defineProperty(P,'platform',{get:function(){return 'MacIntel';},configurable:true});
Object.defineProperty(P,'maxTouchPoints',{get:function(){return 0;},configurable:true});
Object.defineProperty(P,'standalone',{get:function(){return undefined;},configurable:true});
window.__kgxSpoof=true;
}catch(e){}})();
// 2) 화면이 준비되면 검색창 띄우기 + 다시 열기 버튼
(function(){
if (window.top !== window.self) return;
const kgxOpen = () => { (async()=>{
if(location.hostname!=='gift.kakao.com')return;
window.kgxLogin=()=>{const el=[...document.querySelectorAll('header a, header button, a, button')].find(e=>!e.closest('#kgx')&&e.textContent.trim()==='로그인');if(el){el.click()}else{location.href='https://gift.kakao.com/home'}};let o=document.getElementById('kgx');if(o){o.style.display='flex';return}
o=document.createElement('div');o.id='kgx';
o.innerHTML='<style>#kgx{position:fixed;inset:0;z-index:2147483646;background:#f6f6f6;display:flex;flex-direction:column;font:15px sans-serif;color:#222}#kgx .h{background:#FEE500;padding:10px;flex:none}#kgx input{width:100%;box-sizing:border-box;padding:11px;font-size:17px;border:1px solid #ccc;border-radius:10px;margin-top:8px}#kgx input::placeholder{font-size:13px;color:#999}#kgx .c{display:flex;gap:6px;overflow-x:auto;padding:8px 10px;background:#fff;flex:none;border-bottom:1px solid #eee}#kgx .c span{white-space:nowrap;padding:7px 11px;border:1px solid #ddd;border-radius:16px;font-size:13px;background:#fafafa}#kgx .c .on{background:#222;color:#fff;border-color:#222}#kgx .l{flex:1;overflow-y:auto;padding:8px 10px}#kgx .s{font-size:12px;color:#555;margin:2px 0 8px}#kgx .g{display:flex;gap:10px;align-items:center;background:#fff;border:1px solid #eee;border-radius:12px;padding:8px;margin-bottom:7px}#kgx img{width:54px;height:54px;border-radius:8px;object-fit:cover;flex:none}#kgx .g div{flex:1;min-width:0}#kgx .g b{font-size:15px}#kgx small{display:block;color:#888;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#kgx .d{font-weight:700}#kgx a{flex:none;padding:11px 10px;border-radius:10px;background:#FEE500;color:#222;font:700 13px sans-serif;text-decoration:none}#kgx a.b{background:#222;color:#FEE500;padding:11px 9px}#kgx button{float:right;padding:6px 12px;border:1px solid #ccc;border-radius:8px;background:#fff;font-size:14px}#kgx .dg{font-size:10px;white-space:pre-wrap;word-break:break-all;color:#666;margin:24px 4px;font-family:monospace}#kgx a.lgb{display:none;float:right;margin-right:8px;padding:7px 12px;font-size:14px}#kgx .lg{display:block;margin:30px auto;text-align:center;width:80%;padding:16px;font-size:17px}#kgx .bn{background:#3C1E1E;text-align:center;padding:9px 10px 8px;flex:none}#kgx .bt{color:#FEE500;font:800 17px sans-serif;letter-spacing:-0.3px}#kgx .bd{color:#e8ddc8;font-size:12px;margin-top:3px}#kgx #nt{flex:none}#kgx .nti{display:flex;align-items:center;gap:8px;padding:7px 10px;border-bottom:1px solid #e6dca0;font-size:13px}#kgx .ntb{flex:none;background:#3C1E1E;color:#FEE500;font-size:11px;font-weight:700;padding:2px 6px;border-radius:4px}#kgx .ntt{flex:1;min-width:0;line-height:1.35}#kgx a.ntl{flex:none;padding:5px 9px;font-size:12px;background:#3C1E1E;color:#FEE500;border-radius:6px}#kgx button.ntx{float:none;border:0;background:none;font-size:18px;color:#888;padding:0 2px}#kgx .bd span{text-decoration:underline;opacity:.85;margin-left:6px}#kgx .dc{position:absolute;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:9}#kgx .dcb{background:#fff;border-radius:16px;width:84%;max-width:340px;padding:22px 18px 16px;text-align:center}#kgx .dcn{font:800 20px sans-serif;color:#3C1E1E}#kgx .dct{font-size:13px;color:#777;margin-top:4px}#kgx .dci{font-size:14px;line-height:1.55;margin:14px 0;white-space:pre-line}#kgx .dcl{display:flex;flex-direction:column;gap:8px}#kgx a.dla{display:block;padding:12px;border-radius:10px;background:#FEE500;color:#222;font-weight:700}#kgx button.dcx{float:none;margin-top:12px;width:100%;padding:10px}</style><div class=bn><div class=bt>함께여서 행복해, 건부대</div><div class=bd id=dv>앱개발자 : 차범석(건개46기)</div></div><div id=nt></div><div class=h><button id=x>닫기</button><a id=lgb class=lgb href="#" onclick="event.preventDefault();kgxLogin()">카카오 로그인</a><b id=n>불러오는 중...</b><input id=q type=search placeholder="선물 검색어를 넣어주세요 : 예)스벅, 아메리카노, 메가, 스타벅스"></div><div class=c id=c></div><div class=l id=l></div>';
document.body.append(o);
(async()=>{try{const NU='https://raw.githubusercontent.com/CHABUMSUK/kakao-gift-search/main/notice.json';
const E=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const XL=u=>{return u||'';};
const TG=' target=_blank';
const r=await fetch(NU+'?t='+Math.floor(Date.now()/60000));if(!r.ok)return;const N=await r.json();
const td=new Date(Date.now()+9*3600e3).toISOString().slice(0,10);let hid=[];try{hid=JSON.parse(localStorage.kgxHide||'[]')}catch(e){}
const act=(N.notices||[]).filter(n=>n&&n.text&&(!n.start||n.start<=td)&&(!n.end||n.end>=td)&&!hid.includes(n.id)).slice(0,3);
const nt=o.querySelector('#nt');
nt.innerHTML=act.map(n=>'<div class=nti style="background:'+E(n.color||'#fff4b8')+'"><span class=ntb>공지</span><span class=ntt>'+E(n.text)+'</span>'+(n.link?'<a class=ntl'+TG+' href="'+E(XL(n.link))+'">'+E(n.linkText||'보기')+'</a>':'')+'<button class=ntx data-id="'+E(n.id)+'">×</button></div>').join('');
nt.querySelectorAll('.ntx').forEach(b=>b.onclick=()=>{hid.push(b.dataset.id);localStorage.kgxHide=JSON.stringify(hid);b.parentNode.remove()});
const V=N.developer;if(V){const dv=o.querySelector('#dv');dv.insertAdjacentHTML('beforeend','<span>소개</span>');dv.style.cursor='pointer';
dv.onclick=()=>{const c=document.createElement('div');c.className='dc';c.innerHTML='<div class=dcb><div class=dcn>'+E(V.name)+'</div><div class=dct>'+E(V.title)+'</div><div class=dci>'+E(V.intro)+'</div><div class=dcl>'+(V.links||[]).map(l=>'<a class=dla'+TG+' href="'+E(XL(l.url))+'">'+E(l.label)+'</a>').join('')+'</div><button class=dcx>닫기</button></div>';
c.onclick=e=>{if(e.target===c||e.target.className==='dcx')c.remove()};o.appendChild(c)}}
}catch(e){}})();
const $=i=>o.querySelector('#'+i);$('x').onclick=()=>o.style.display='none';
const A={'메가MGC커피':'메가커피 메가 mgc','배스킨라빈스':'베스킨라빈스 베라 배라 br 아이스크림','스타벅스':'스벅 starbucks','투썸플레이스':'투썸','컴포즈커피':'컴포즈','이디야커피':'이디야','GS25':'지에스 편의점','CU':'씨유 편의점','세븐일레븐':'세븐 편의점','맥도날드':'맥날','파리바게뜨':'파바','교촌치킨':'교촌 치킨','BHC':'치킨'};
const K=t=>{const u=encodeURIComponent('https://gift.kakao.com/giftbox/inbox/detail/'+t);return['kakaotalk://gift/home?to='+u+'&input_channel_id=17918','https://talk-apps.kakao.com/scheme/kakaotalk://gift/home?to='+u+'&input_channel_id=17918']};
let D=[],B='',NL=false,DGH='';const LG='<a class=lg href="#" onclick="event.preventDefault();kgxLogin()">카카오 로그인하기</a><div class=s style="text-align:center">카카오 계정(이메일/전화번호)과 비밀번호로 로그인하세요</div>';try{D=JSON.parse(localStorage.kgxCache||'[]')}catch(e){}
$('q').value=localStorage.kgxQ||'';
const chips=()=>{const c={};D.forEach(g=>c[g.brandName]=(c[g.brandName]||0)+1);$('c').innerHTML=Object.entries(c).sort((a,b)=>b[1]-a[1]).map(([b,n])=>'<span data-b="'+b+'"'+(b===B?' class=on':'')+'>'+b+' '+n+'</span>').join('')};
const R=()=>{localStorage.kgxQ=$('q').value;if(NL&&!D.length){$('l').innerHTML=LG+DGH;return}const q=$('q').value.toLowerCase().split(/\s+/).filter(x=>x);
const V=D.filter(g=>(!B||g.brandName===B)&&q.every(w=>(g.brandName+' '+(A[g.brandName]||'')+' '+g.itemName+' '+g.senderName).toLowerCase().includes(w)));
const s={};V.forEach(g=>s[g.itemName]=(s[g.itemName]||0)+1);const top=Object.entries(s).sort((x,y)=>y[1]-x[1]).slice(0,4).map(([n,c])=>n+' ×'+c).join(' · ');
$('l').innerHTML='<div class=s>'+V.length+'개'+(top?' · '+top:'')+'</div>'+V.slice(0,300).map(g=>{const k=K(g.tradeNo),st=g.stamp&&g.stamp.value,col=st?'#597ef7':g.remainDay<=7?'#ff4d4f':g.remainDay<=30?'#fa8c16':'#999';
return '<div class=g><img loading=lazy src="'+g.itemImageUrl+'"><div><b>'+g.itemName+'</b><small><span class=d style="color:'+col+'">'+(st||'D-'+g.remainDay)+'</span> · '+g.brandName+'</small><small>'+g.senderName+' · '+g.receivedAt.slice(0,10)+'</small></div><a href="'+k[0]+'">바코드</a><a class=b href="'+k[1]+'">2</a></div>'}).join('')};
$('c').onclick=e=>{const b=e.target.dataset&&e.target.dataset.b;if(b===undefined)return;B=B===b?'':b;chips();R()};
$('q').oninput=R;
if(D.length){$('n').textContent=D.length+'개 (갱신중)';chips();R()}
let DG='';const API='/a/giftbox/v2/giftbox/inbox/OPEN/list?sortType=EXPIRED_AT_AND_PAID_AT&size=100&page=';
const load=async()=>{let N=[],p=0,L=false;while(!L&&p<50){const r=await fetch(API+p+'&uncache='+Date.now(),{credentials:'include'});if(!r.ok){DG='API '+r.status+' '+(await r.text()).slice(0,150);throw 0}const j=await r.json();if(!j.content){DG='API 200 '+JSON.stringify(j).slice(0,150);throw 0}N.push(...j.content);L=j.isLast;p++}return N};
let ok=false;for(let t=0;t<3&&!ok;t++){try{D=await load();ok=true}catch(e){if(!DG)DG='ERR '+e;await new Promise(z=>setTimeout(z,1500))}}
if(ok){NL=false;$('lgb').style.display='none';try{localStorage.kgxCache=JSON.stringify(D)}catch(e){}$('n').textContent='선물 '+D.length+'개';chips();R()}
else{NL=true;$('n').textContent='로그인이 필요해요';$('lgb').style.display='inline-block';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/(code|token|state|auth_tran_id)=[^&\s]+/gi,'$1=***');
let ck='-',nl='-';try{ck='iOS스크립트 v1 | touch='+navigator.maxTouchPoints+' | standalone='+typeof navigator.standalone+' | spoof='+(window.__kgxSpoof||false)+' | UA='+navigator.userAgent.slice(0,70);nl=window.KGX?KGX.navLog():''}catch(e){}
DG='[진단] '+DG+'\n[쿠키] '+ck+'\n[이동]\n'+nl;DGH='<pre class=dg>'+esc(DG)+'</pre>';R()}
})(); };
const addBtn = () => { if (document.getElementById('kgxbtn') || !document.body) return; const bt = document.createElement('button'); bt.id = 'kgxbtn'; bt.textContent = '선물검색';
  bt.style.cssText = 'position:fixed;right:14px;bottom:90px;z-index:2147483645;background:#FEE500;color:#222;border:0;border-radius:28px;padding:14px 18px;font:700 15px -apple-system,sans-serif;box-shadow:0 3px 10px rgba(0,0,0,.3)';
  bt.onclick = kgxOpen; document.body.appendChild(bt); };
const boot = () => { if (!document.body) return setTimeout(boot, 200); addBtn(); setInterval(addBtn, 2000); setTimeout(kgxOpen, 600); };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
