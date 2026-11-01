(()=>{
const C=window.SITE_CONFIG||{},H={apikey:C.anonKey,Authorization:'Bearer '+C.anonKey},$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const D={name:'Hamza Muhammad',mark:'H',eyebrow:'Educator · Learner · Builder',h1:'Learning with purpose.',h1b:'Building what matters.',
intro:'Exploring the intersection of faith, education, and technology, and building useful things that genuinely serve people.',
about_sub:'A work in progress, guided by learning, faith, curiosity, and service.',about_title:'Build a life that is useful and meaningful.',
about:'I’m Hamza Muhammad, an educator and lifelong learner. My interests span Quranic studies, the Arabic language, teaching, technology, entrepreneurship, and personal growth.\n\nWhat fascinates me most is the space between knowledge and action: understanding an idea, retaining it, applying it in real situations, measuring the result, and refining the process.\n\nMy aim is to keep learning, build projects that are genuinely useful, and share what I discover in ways that benefit others.',
glance:'Education | Teaching and lifelong learning\nFaith | Quranic studies and everyday practice\nBuilding | Digital products and software ideas\nCuriosity | Reading, languages, and travel',
values:'Clarity | Understand the real problem before choosing a solution.\nConsistency | Prefer repeatable progress over short bursts of activity.\nService | Build and share things that provide genuine value.',
interests:'Knowledge & learning | Study and understanding | Quranic studies, Islamic knowledge, Arabic language, Education, Teaching, Reading, Language learning, Personal growth\nDigital world | Technology & entrepreneurship | Artificial intelligence, Web development, Entrepreneurship, Branding, Product management, Digital products\nLife & experience | People and the world | Travel, Adventure travel, Communication, Relationships, Mindfulness, Culture',
quote:'Learn thoughtfully. Apply consistently. Improve with purpose.',quote_sub:'A personal principle for learning and building.',
accounts_intro:'Find me on the platforms where I share my work and ideas.',contact_intro:'Whether it is a collaboration, a question about education or technology, or simply a thoughtful conversation, you are welcome to reach out in whichever way suits you best.',
footer:'Made with intention.',photo:'assets/hero-cut.webp',photo_cut:true};
const DL=[{platform:'X',url:'https://x.com/Hamza_muhammadd',label:'@Hamza_muhammadd'},{platform:'GitHub',url:'https://github.com/hamza-muhammadd',label:'hamza-muhammadd'}];
const PG=[['index.html','Home'],['about.html','About'],['interests.html','Interests'],['writing.html','Blog'],['projects.html','Projects'],['accounts.html','Accounts'],['contact.html','Contact']];
const L=t=>String(t||'').split('\n').map(x=>x.split('|').map(y=>y.trim())).filter(a=>a[0]);
const mk=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const here=location.pathname.split('/').pop()||'index.html';
async function get(p){const r=await fetch(C.url+'/rest/v1/'+p,{headers:H,cache:'no-store'});if(!r.ok)throw new Error(r.status);return r.json()}
const dt=x=>new Date(x).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
const re=/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)\s]+\))/g;
const clean=t=>String(t==null?'':t).replace(/\*+/g,'').replace(/^\s*[-–—•]+\s+/gm,'').replace(/\s[–—-]\s/g,', ').replace(/\s{2,}/g,' ').trim();
function inl(t,p){for(const s of t.split(re)){if(!s)continue;let m;
  if((m=s.match(/^\*\*(.+)\*\*$/)))p.append(mk('strong','',m[1]));
  else if((m=s.match(/^\*(.+)\*$/)))p.append(mk('em','',m[1]));
  else if((m=s.match(/^\[(.+)\]\((.+)\)$/))&&/^(https?:|mailto:)/i.test(m[2])){const a=mk('a','',m[1]);a.href=m[2];a.rel='noopener noreferrer';p.append(a)}
  else p.append(document.createTextNode(s.replace(/\*/g,'')))}}
function md(t,root){let inL=false;t=String(t).replace(/\r/g,'').split('\n').filter(l=>!/^\s*([-*_])\1{2,}\s*$/.test(l)).map(l=>{const li=/^\s*[-*•] +/.test(l);const o=(li!==inL&&l.trim()?'\n':'')+(li?l.replace(/^\s*[-*•] +/,'- '):l);if(l.trim())inL=li;return o}).join('\n');for(const b of String(t).split(/\n\s*\n/)){const x=b.trim();if(!x)continue;let e;
  if(x.startsWith('## ')){e=mk('h2');inl(x.slice(3),e)}else if(x.startsWith('### ')){e=mk('h3');inl(x.slice(4),e)}
  else if(x.startsWith('> ')){e=mk('blockquote');inl(x.replace(/^> ?/gm,' ').trim(),e)}
  else if(/^- /.test(x)){e=mk('ul');x.split('\n').forEach(l=>{const li=mk('li');inl(l.replace(/^- /,''),li);e.append(li)})}
  else{e=mk('p');inl(x.replace(/\n/g,' '),e)}root.append(e)}}
const dts=x=>new Date(x).toLocaleDateString('en-GB',{day:'numeric',month:'short'});
const rmin=p=>p.read_min||Math.max(1,Math.round(String(p.body||'').trim().split(/\s+/).length/200))||1;
const cpos=p=>/^\d{1,3}% \d{1,3}%$/.test(p.cover_pos||'')?p.cover_pos:'50% 50%';
const phref=p=>'post.html?p='+encodeURIComponent(p.slug);
const pcat=p=>{if(!p.category)return null;const c=mk('span','pcat');c.append(mk('i'),document.createTextNode(p.category));return c};
const pmeta=p=>{const d=mk('div','pmeta');if(p.published_at)d.append(mk('span','',dts(p.published_at)),mk('b','','•'));d.append(mk('span','',(p.read_min?p.read_min+' min read':rmin(p)+' min read')));return d};
const pimg=(p,c)=>{const w=mk('div',c);if(/^https?:\/\//.test(p.cover_url||'')){const i=mk('img');i.src=p.cover_url;i.alt='';i.loading='lazy';i.style.objectPosition=cpos(p);w.append(i)}else w.classList.add('ph');return w};
async function getPosts(){const base='slug,title,excerpt,cover_url,published_at,featured',tail='&status=eq.published&order=published_at.desc.nullslast';
  try{return await get('posts?select='+base+',category,cover_pos,read_min'+tail)}catch(_){return await get('posts?select='+base+tail)}}
const pcard=p=>{const a=mk('a','bcard rv');a.href=phref(p);a.append(pimg(p,'bc-im'));const b=mk('div','bc-b'),c=pcat(p);if(c)b.append(c);b.append(mk('h3','',clean(p.title)));if(p.excerpt)b.append(mk('p','',clean(p.excerpt)));b.append(pmeta(p));a.append(b);return a};
async function posts(){const box=$('#posts'),lat=$('#latest');if(!box&&!lat)return;const t=box||lat;
  if(!C.url){if(box)t.append(mk('p','','No posts yet.'));return}
  try{const all=await getPosts();
    if(!all.length){if(box)t.append(mk('p','','No blog posts yet. Check back soon.'));return}
    if(lat){const w=$('#latest-wrap');if(w)w.hidden=false;all.slice(0,3).forEach(p=>lat.append(pcard(p)));return}
    const hi=Math.max(0,all.findIndex(p=>p.featured)),hero=all[hi],rest=all.filter((_,i)=>i!==hi),side=rest.slice(0,4),more=rest.slice(4);
    const top=mk('div','btop'),h=mk('a','bhero rv');h.href=phref(hero);h.append(pimg(hero,'bh-im'));
    const ov=mk('div','bh-ov'),hc=pcat(hero);if(hc)ov.append(hc);ov.append(mk('h2','',clean(hero.title)),pmeta(hero));h.append(ov);top.append(h);
    if(side.length){const sd=mk('aside','bside');sd.append(mk('h2','','Latest post'));side.forEach(p=>{const a=mk('a','bl rv');a.href=phref(p);a.append(pimg(p,'bl-im'));const d=mk('div');d.append(mk('h3','',clean(p.title)),pmeta(p));a.append(d);sd.append(a)});top.append(sd)}
    t.append(top);
    if(more.length){const sec=mk('section','bmore'),hd=mk('div','bm-h');hd.append(mk('h2','','More posts'));
      const cats=[...new Set(more.map(p=>p.category).filter(Boolean))];let cur='All',pg=1;const PER=6,grid=mk('div','bgrid'),pager=mk('nav','pager');pager.setAttribute('aria-label','Pages');
      const draw=()=>{const L=more.filter(p=>cur==='All'||p.category===cur),N=Math.max(1,Math.ceil(L.length/PER));pg=Math.min(pg,N);grid.textContent='';L.slice((pg-1)*PER,pg*PER).forEach(p=>{const c=pcard(p);c.classList.add('in');grid.append(c)});
        pager.textContent='';pager.hidden=N<2;const go=n=>{pg=n;draw();sec.scrollIntoView({behavior:'smooth',block:'start'})};
        const ar=(l,n,d)=>{const b=mk('button','pg-a',l);b.type='button';b.disabled=d;b.setAttribute('aria-label',n<pg?'Previous page':'Next page');b.onclick=()=>go(n);return b};
        pager.append(ar('←',pg-1,pg<2));const nums=mk('div','pg-n');for(let i=1;i<=N;i++){const b=mk('button',i===pg?'on':'',String(i));b.type='button';b.onclick=()=>go(i);if(i===pg)b.setAttribute('aria-current','page');nums.append(b)}pager.append(nums,ar('→',pg+1,pg>=N))};
      if(cats.length){const fl=mk('div','flt');['All',...cats].forEach((k,n)=>{const b=mk('button',n?'':'on',k);b.type='button';b.onclick=()=>{cur=k;pg=1;fl.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));draw()};fl.append(b)});hd.append(fl)}
      sec.append(hd,grid,pager);t.append(sec);draw()}
  }catch(e){if(box)t.append(mk('p','err','Could not load posts right now.'))}}
function shareBar(p,site){const url=location.origin+location.pathname+'?p='+encodeURIComponent(p.slug),ttl=clean(p.title),txt=ttl+' · '+site,w=mk('section','share');w.append(mk('h2','','Share this post'));
  const row=mk('div','sh-row');const add=(label,fn,href)=>{const e=href?mk('a','sh-b',label):mk('button','sh-b',label);if(href){e.href=href;e.target='_blank';e.rel='noopener noreferrer'}else{e.type='button';e.onclick=()=>fn(e)}row.append(e);return e};
  if(navigator.share)add('Share…',async()=>{try{await navigator.share({title:ttl,text:txt,url})}catch(_){}}).classList.add('p');
  add('Copy link',async b=>{try{await navigator.clipboard.writeText(url)}catch(_){const t=document.createElement('textarea');t.value=url;document.body.append(t);t.select();try{document.execCommand('copy')}catch(__){}t.remove()}const o=b.textContent;b.textContent='Copied ✓';setTimeout(()=>b.textContent=o,1800)});
  const q=encodeURIComponent;add('WhatsApp',0,'https://wa.me/?text='+q(txt+' '+url));add('X',0,'https://twitter.com/intent/tweet?text='+q(txt)+'&url='+q(url));add('Facebook',0,'https://www.facebook.com/sharer/sharer.php?u='+q(url));add('Telegram',0,'https://t.me/share/url?url='+q(url)+'&text='+q(txt));add('Email',0,'mailto:?subject='+q(ttl)+'&body='+q(txt+'\n'+url));
  w.append(row);return w}
async function comments(p,el){if(!p.id||!C.url)return;const w=mk('section','cm'),hd=mk('h2','','Comments'),list=mk('div','cm-list'),form=mk('form','cm-form');form.noValidate=true;
  form.innerHTML='<h3>Leave a comment</h3><label>Your name<input name="cname" maxlength="60" required autocomplete="name"></label><label>Email (optional, never shown)<input name="cemail" type="email" maxlength="200" autocomplete="email"></label><label>Your comment<textarea name="cbody" rows="4" maxlength="1000" required></textarea></label><input id="hp2" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button class="btn p" type="submit">Post comment</button><div class="cm-msg" role="status"></div>';
  w.append(hd,list,form);el.append(w);
  const draw=async()=>{let cs=[];try{cs=await get('comments?select=name,body,created_at&post_id=eq.'+p.id+'&status=eq.approved&order=created_at.asc')}catch(_){list.append(mk('p','cm-empty','Comments are not available right now.'));return}
    list.textContent='';hd.textContent=cs.length?'Comments ('+cs.length+')':'Comments';
    if(!cs.length){list.append(mk('p','cm-empty','No comments yet. Be the first to share a thought.'));return}
    cs.forEach(c=>{const i=mk('div','cm-item'),av=mk('span','cm-av',(c.name||'?')[0].toUpperCase()),b=mk('div','cm-b'),h=mk('div','cm-h');h.append(mk('b','',c.name),mk('time','',dt(c.created_at)));b.append(h,mk('p','',c.body));i.append(av,b);list.append(i)})};
  await draw();
  form.addEventListener('submit',async e=>{e.preventDefault();const m=form.querySelector('.cm-msg'),b=form.querySelector('button');if(form.website.value)return;
    const name=form.cname.value.trim(),body=form.cbody.value.trim(),email=form.cemail.value.trim();
    if(!name||body.length<2){m.className='cm-msg err';m.textContent='Please add your name and a comment.';return}
    if(email&&!form.cemail.checkValidity()){m.className='cm-msg err';m.textContent='That email does not look right.';return}
    let last=0;try{last=+localStorage.getItem('cm_t')||0}catch(_){}if(Date.now()-last<20000){m.className='cm-msg err';m.textContent='Please wait a few seconds before posting again.';return}
    b.disabled=true;m.className='cm-msg';m.textContent='Sending…';
    try{const r=await fetch(C.url+'/rest/v1/comments',{method:'POST',headers:{...H,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({post_id:p.id,name,email:email||null,body,status:'pending'})});
      if(!r.ok)throw 0;try{localStorage.setItem('cm_t',String(Date.now()))}catch(_){}form.cbody.value='';m.className='cm-msg ok';m.textContent='Thank you. Your comment will appear after it is reviewed.'}
    catch(_){m.className='cm-msg err';m.textContent='Your comment could not be sent. Please try again.'}
    b.disabled=false})}
async function article(name){const el=$('#article');if(!el)return;
  const nf=()=>el.append(mk('h1','','Post not found'),mk('p','','This post does not exist or is not published.'));
  const slug=new URLSearchParams(location.search).get('p')||'';if(!C.url||!/^[a-z0-9-]+$/.test(slug))return nf();
  try{const r=await get('posts?select=*&status=eq.published&slug=eq.'+slug);if(!r[0])return nf();const p=r[0];
    document.title=p.title+' · '+name;const m=$('meta[name=description]');if(m)m.content=p.excerpt||p.title;
    const bk=mk('a','back','← Back to blog');bk.href='writing.html';el.append(bk);const c=pcat(p);if(c)el.append(c);
    el.append(mk('h1','',clean(p.title)),pmeta(p));
    if(/^https?:\/\//.test(p.cover_url||'')){const w=pimg(p,'a-cover');el.append(w)}
    const b=mk('div','md');md(p.body,b);el.append(b);try{el.append(shareBar(p,name));await comments(p,el)}catch(_){}}catch(e){nf()}}
const SL={live:'Live',building:'In progress',planned:'Planned'};
let PM=null,lastF=null;
function pclose(){const o=PM;if(!o||o.hidden)return;o.classList.remove('open');document.documentElement.classList.remove('pm-lock');setTimeout(()=>{if(!o.classList.contains('open'))o.hidden=true},300);if(lastF)try{lastF.focus({preventScroll:true})}catch(e){}}
function pmodal(){if(PM)return PM;const o=mk('div','pm');o.hidden=true;o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-labelledby','pm-t');
  o.innerHTML='<div class="pm-bg" data-x></div><div class="pm-sheet" tabindex="-1"><button class="pm-x" type="button" aria-label="Close" data-x>✕</button><div class="pm-body"></div><div class="pm-bar"></div></div>';
  document.body.append(o);o.addEventListener('click',e=>{if(e.target.closest('[data-x]'))pclose()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!o.hidden)pclose()});return PM=o}
const chip=p=>mk('span','chip2 '+p.status,SL[p.status]||'');
function popen(p,trg){const o=pmodal(),b=o.querySelector('.pm-body'),bar=o.querySelector('.pm-bar'),ok=/^https?:\/\//.test(p.url||'');b.textContent='';bar.textContent='';lastF=trg;
  if(/^https?:\/\//.test(p.image_url||'')){const w=mk('div','pm-im'),i=mk('img');i.src=p.image_url;i.alt=p.title;w.append(i);b.append(w)}
  const t=mk('div','tg');t.append(chip(p));if(p.category)t.append(mk('span','chip2',p.category));b.append(t);
  const h=mk('h2','',clean(p.title));h.id='pm-t';b.append(h);
  if(p.description)b.append(mk('p','pm-lead',clean(p.description)));
  if(p.details){const m=mk('div','md pm-md');md(String(p.details).replace(/\r/g,'').replace(/\n(?=#{2,3} )/g,'\n\n').replace(/^(#{2,3} .*)\n(?!\n)/gm,'$1\n\n').replace(/([^\n-].*)\n(?=- )/g,'$1\n\n'),m);b.append(m)}
  if(ok){let host=p.url;try{host=new URL(p.url).hostname.replace(/^www\./,'')}catch(e){}const a=mk('a','btn p','Visit '+host+' ↗');a.href=p.url;a.target='_blank';a.rel='noopener noreferrer';bar.append(a)}else bar.append(mk('span','pm-nolink','No public link yet'));
  const c=mk('button','btn g','Close');c.type='button';c.setAttribute('data-x','');bar.append(c);
  b.scrollTop=0;o.hidden=false;document.documentElement.classList.add('pm-lock');requestAnimationFrame(()=>requestAnimationFrame(()=>{o.classList.add('open');o.querySelector('.pm-sheet').focus({preventScroll:true})}))}
async function projects(){const box=$('#projects'),ft=$('#featured');if(!box&&!ft)return;
  if(!C.url){if(box)box.append(mk('p','','Projects will appear here soon.'));return}
  try{let ps;const q='title,description,url,category,status,image_url,featured',f='&enabled=eq.true&order=sort.asc';
    try{ps=await get('projects?select='+q+',details'+f)}catch(_){ps=await get('projects?select='+q+f)}
    const card=p=>{const a=mk('button','card pj rv');a.type='button';a.dataset.cat=p.category||'';a.setAttribute('aria-haspopup','dialog');a.onclick=()=>popen(p,a);
      a.addEventListener('pointermove',e=>{const r=a.getBoundingClientRect();a.style.setProperty('--mx',(e.clientX-r.left)+'px');a.style.setProperty('--my',(e.clientY-r.top)+'px')});
      if(/^https?:\/\//.test(p.image_url||'')){const w=mk('div','im'),i=mk('img');i.src=p.image_url;i.alt='';i.loading='lazy';w.append(i);a.append(w)}
      const t=mk('div','tg');t.append(chip(p));if(p.category)t.append(mk('span','chip2',p.category));
      a.append(t,mk('h3','',clean(p.title)));if(p.description)a.append(mk('p','',clean(p.description)));a.append(mk('span','more','View details →'));return a};
    if(ft){const f2=ps.filter(x=>x.featured).slice(0,3);if(f2.length){$('#featured-wrap').hidden=false;f2.forEach(p=>ft.append(card(p)))}}
    if(box){if(!ps.length){box.append(mk('p','','No projects yet.'));return}
      const cats=[...new Set(ps.map(p=>p.category).filter(Boolean))];
      const gr=mk('div','pjg');
      if(cats.length>1){const fl=mk('div','flt');['All',...cats].forEach((k,n)=>{const b=mk('button',n?'':'on',k);b.type='button';b.onclick=()=>{fl.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));gr.querySelectorAll('.pj').forEach(c=>{c.hidden=n>0&&c.dataset.cat!==k})};fl.append(b)});box.append(fl)}
      ps.forEach(p=>gr.append(card(p)));box.append(gr)}
  }catch(e){if(box)box.append(mk('p','err','Could not load projects right now.'))}}
const ver=(u,v)=>!v||/[?&]v=/.test(u)||/^https?:\/\/res\.cloudinary\.com/.test(u)?u:u+(u.includes('?')?'&':'?')+'v='+encodeURIComponent(v);
function favicons(d){const m=[['16',d.favicon_16],['32',d.favicon_32],['48',d.favicon_48]],a=d.favicon_180;
  if(!m.some(x=>/^https?:\/\//.test(x[1]||'')))return;
  $$('link[rel="icon"],link[rel="shortcut icon"],link[rel="apple-touch-icon"]').forEach(l=>l.remove());
  m.forEach(([z,u])=>{if(/^https?:\/\//.test(u||'')){const l=mk('link');l.rel='icon';l.type='image/png';l.sizes=z+'x'+z;l.href=u;document.head.append(l)}});
  if(/^https?:\/\//.test(a||'')){const l=mk('link');l.rel='apple-touch-icon';l.sizes='180x180';l.href=a;document.head.append(l)}}
function glassWord(){const w=$('.gx-word');if(!w)return;const ws=(w.dataset.words||'').split(',').map(x=>x.trim()).filter(Boolean);if(!ws.length)return;const dots=$$('.gx-dots i');let n=0,cur=w.querySelector('.gxw');
  const fit=s=>{s.style.fontSize='34cqw';const av=w.clientWidth*.82,wd=s.offsetWidth;if(wd>av)s.style.fontSize=(34*av/wd).toFixed(2)+'cqw'};
  const make=t=>{const s=mk('span','gxw');[...t].forEach((c,i)=>{const l=mk('i','',c);l.style.setProperty('--k',i);s.append(l)});return s};
  const show=i=>{const old=cur;cur=make(ws[i]);cur.classList.add('in');w.append(cur);fit(cur);if(old){old.classList.remove('in');old.classList.add('out');setTimeout(()=>old.remove(),1200)}dots.forEach((d,k)=>d.classList.toggle('on',k===i))};
  dots.forEach((d,k)=>d.classList.toggle('on',k===0));if(cur)fit(cur);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>cur&&fit(cur));let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>cur&&fit(cur),150)});if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  setInterval(()=>{if(document.hidden)return;n=(n+1)%ws.length;show(n)},3000)}
function heroGuard(){const ph=$('#photo');if(!ph)return;const st=ph.closest('.stage'),chain=['assets/hero-cut.webp','assets/profile.jpg'];let k=0;
  const next=()=>{if(k>=chain.length){ph.style.visibility='hidden';return}const u=chain[k++];console.warn('Hero photo could not load, trying',u);if(st&&u.endsWith('.jpg')){st.classList.remove('cut');st.classList.add('framed')}ph.removeAttribute('srcset');ph.src=u};
  ph.addEventListener('error',next);if(ph.complete&&ph.naturalWidth===0&&ph.getAttribute('src'))next()}
function heroReady(){const st=$('.hero .stage');if(!st)return;const ph=$('#photo');let done=false;
  const go=()=>{if(done)return;done=true;requestAnimationFrame(()=>st.classList.add('rdy'))};setTimeout(go,3500);if(!ph)return go();
  const dec=()=>{ph.decode?ph.decode().then(go,go):go()};
  if(ph.complete&&ph.naturalWidth)dec();else ph.addEventListener('load',dec,{once:true})}
async function boot(){
  let d={...D},ls=DL;
  if(C.url&&C.anonKey){try{const[s,l]=await Promise.all([get('site_settings?select=data&id=eq.1'),get('social_links?select=platform,url,label&enabled=eq.true&order=sort.asc')]);
    const o=(s[0]||{}).data||{};for(const k in o)if(o[k]!==''&&o[k]!=null)d[k]=o[k];ls=l}catch(e){console.warn('Using built-in content',e)}}
  if(/^#[0-9a-f]{6}$/i.test(d.accent||'')&&d.accent.toLowerCase()!=='#8c7a52')document.documentElement.style.setProperty('--acc',d.accent);
  const pn=(PG.find(p=>p[0]===here)||PG[0])[1];document.title=(pn==='Home'?d.name:pn+' · '+d.name);
  const nav=$('#nav');if(nav){const n=mk('nav');n.setAttribute('aria-label','Main');const cur=here==='post.html'?'writing.html':here;
    const lst=mk('div','nv-l'),tg=mk('button','nv-t');tg.type='button';tg.setAttribute('aria-expanded','false');tg.setAttribute('aria-label','Menu');const tl=mk('span','',(PG.find(p=>p[0]===cur)||PG[0])[1]),ti=mk('i');ti.append(mk('b'),mk('b'));tg.append(tl,ti);
    PG.forEach((p,i)=>{const a=mk('a','l'+(p[0]===cur?' on':'')+(i===PG.length-1?' cta':''),p[1]);a.href=p[0];if(p[0]===cur)a.setAttribute('aria-current','page');lst.append(a)});n.append(tg,lst);nav.replaceWith(n);
    const so=o=>{n.classList.toggle('open',o);tg.setAttribute('aria-expanded',String(o))};tg.onclick=e=>{e.stopPropagation();so(!n.classList.contains('open'))};
    document.addEventListener('click',e=>{if(!n.contains(e.target))so(false)});addEventListener('scroll',()=>{if(n.classList.contains('open'))so(false)},{passive:true});const on=n.querySelector('.on');if(on)requestAnimationFrame(()=>{n.scrollLeft=on.offsetLeft-n.clientWidth/2+on.offsetWidth/2})}
  const f=$('#foot');if(f){const fo=mk('footer');fo.append(mk('span','','© '+new Date().getFullYear()+' '+d.name),mk('span','',d.footer));const r=mk('span');PG.slice(3).forEach(p=>{const a=mk('a','',p[1]);a.href=p[0];r.append(a)});fo.append(r);f.replaceWith(fo)}
  $$('[data-k]').forEach(e=>{if(d[e.dataset.k]!=null)e.textContent=d[e.dataset.k]});
  $$('[data-p]').forEach(e=>{e.textContent='';String(d[e.dataset.p]).split(/\n\s*\n/).forEach(t=>e.append(mk('p','',t.trim())))});
  const ph=$('#photo');if(ph){const u=ver(d.photo,d.photo_v);if(ph.getAttribute('src')!==u)ph.src=u;const st=ph.closest('.stage');if(st){const c=d.photo_cut!==false&&d.photo_cut!=='false'&&d.photo_cut!==0;st.classList.toggle('cut',c);st.classList.toggle('framed',!c)}}
  favicons(d);glassWord();heroGuard();
  const gl=$('#glance');if(gl)L(d.glance).forEach(a=>{const li=mk('li');li.append(mk('b','',a[0]),mk('span','',a[1]||''));gl.append(li)});
  const va=$('#values');if(va)L(d.values).forEach(a=>{const c=mk('div','card rv');c.append(mk('h3','',a[0]),mk('p','',a[1]||''));va.append(c)});
  const it=$('#interests');if(it)L(d.interests).forEach(a=>{const c=mk('div','card rv');c.append(mk('p','eyebrow',a[0]),mk('h2','',a[1]||''));const t=mk('div','tags');(a[2]||'').split(',').map(x=>x.trim()).filter(Boolean).forEach(x=>t.append(mk('span','',x)));c.append(t);it.append(c)});
  const ok=ls.filter(x=>/^(https?:|mailto:)/i.test(x.url));
  $$('#socials').forEach(b=>ok.forEach(x=>{const a=mk('a','',x.platform);a.href=x.url;a.target='_blank';a.rel='noopener noreferrer';b.append(a)}));
  $$('#accounts').forEach(b=>{if(!ok.length)b.append(mk('p','','No accounts have been added yet.'));ok.forEach(x=>{const a=mk('a','card acct rv');a.href=x.url;a.target='_blank';a.rel='noopener noreferrer';const w=mk('div');w.append(mk('b','',x.platform),mk('span','',(x.label||x.url.replace(/^https?:\/\//,''))+' ↗'));a.append(mk('div','ic',x.platform[0].toUpperCase()),w);b.append(a)})});
  await Promise.all([posts(),article(d.name),projects()]);
  const pr=mk('div','prog');pr.setAttribute('aria-hidden','true');document.body.append(pr);
  /* ---- guiding values (home) ---- */
  const hv=$('#hvalues');if(hv)L(d.values).slice(0,3).forEach((a,i)=>{const t=mk('div','tile t-val rv');t.dataset.a='pop';t.append(mk('span','num','0'+(i+1)),(()=>{const w=mk('div');w.append(mk('h3','',a[0]),mk('p','',a[1]||''));return w})());hv.append(t)});
  /* ---- interests marquee ---- */
  const mq=$('#marq');if(mq){const tags=L(d.interests).flatMap(a=>(a[2]||'').split(',').map(x=>x.trim()).filter(Boolean));
    [tags.filter((_,i)=>i%2===0),tags.filter((_,i)=>i%2===1)].forEach((row,n)=>{if(!row.length)return;const r=mk('div','mq-row'+(n?' rev':'')),tr=mk('div','mq-track');
      for(let k=0;k<2;k++){const g=mk('div','mq-grp');if(k)g.setAttribute('aria-hidden','true');row.concat(row).forEach(x=>g.append(mk('span','',x)));tr.append(g)}r.append(tr);mq.append(r)})}
  /* ---- hero headline: word-by-word ---- */
  $$('.hero h1 [data-k]').forEach(e=>{const ws=e.textContent.split(/\s+/).filter(Boolean);e.textContent='';ws.forEach((w,i)=>{const sp=mk('span','w',w);sp.style.setProperty('--i',i+(e.tagName==='EM'?3:0));e.append(sp,' ')})});
  /* ---- pointer parallax (hero) + gloss on blocks ---- */
  $$('.tile').forEach(t=>t.addEventListener('pointermove',e=>{const r=t.getBoundingClientRect();t.style.setProperty('--mx',(e.clientX-r.left)+'px');t.style.setProperty('--my',(e.clientY-r.top)+'px')}));
  /* ---- scroll reveal: staggered, with count-up ---- */
  const kids=new Map();$$('.rv').forEach(n=>{const p=n.parentElement,i=kids.get(p)||0;kids.set(p,i+1);n.style.setProperty('--d',Math.min(i,8)*70+'ms')});
  const count=e=>{const to=+e.dataset.to||0,t0=performance.now(),du=1100;const f=t=>{const k=Math.min(1,(t-t0)/du);e.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');x.target.querySelectorAll('[data-to]').forEach(count);if(x.target.dataset.to)count(x.target);const t=x.target;setTimeout(()=>{t.classList.add('done');t.style.removeProperty('--d')},1700);io.unobserve(t)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});$$('.rv').forEach(n=>io.observe(n));
}
heroReady();boot();
const fm=$('#f');if(fm)fm.addEventListener('submit',async e=>{
  e.preventDefault();const m=$('#msg'),b=fm.querySelector('button');if(fm.website.value)return;
  if(!fm.checkValidity()){m.className='err';m.textContent='Please add your name, a valid email and a message of at least 5 characters.';return}
  if(!C.url){m.className='err';m.textContent='Messaging is not set up yet.';return}
  b.disabled=true;m.className='';m.textContent='Sending…';
  try{const r=await fetch(C.url+'/rest/v1/contact_messages',{method:'POST',headers:{...H,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({name:fm.name.value.trim(),email:fm.email.value.trim(),subject:fm.subject.value.trim()||null,message:fm.message.value.trim()})});
    if(!r.ok)throw 0;fm.reset();m.className='ok';m.textContent='Message sent. Thank you.'}catch(x){m.className='err';m.textContent='Your message could not be sent. Please try again.'}
  b.disabled=false});
})();
