(() => {
  'use strict';
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const {places,floors,eras}=ATLAS;
  const map=$('#map'),canvas=$('#canvas');
  const passageTrail=document.createElement('section');passageTrail.id='passageTrail';passageTrail.className='passage-trail';passageTrail.hidden=true;passageTrail.setAttribute('aria-label','密道线索两端');canvas.before(passageTrail);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const state={view:'world',floor:'third',era:'1993',filter:'all',query:'',selected:null,active:false,tracks:true,secrets:true,paused:false,zoom:1};
  let base=[2400,1500],box={x:0,y:0,w:2400,h:1500},fitWidth=2400,floorBounds=[],currentFloorPlan=null,labelObstacles=[],toastTimer,wakeTimer,animationFrame,labelFrame,lastFrame=0,simTime=0,dragged=false,returnFocus=null;
  const meta={world:{title:'霍格沃茨魔法学校',sub:'城堡、场地与霍格莫德周边图',index:'霍格沃茨及周边',indexSub:'城堡、湖泊与通往村庄的小径',sheet:'TABULA I · THE SCHOOL & GROUNDS',size:[2400,1500]},village:{title:'霍格莫德村',sub:'主街、商店与村外秘密 · 补充探索图',index:'霍格莫德地方志',indexSub:'十一处店铺与村外地点，沿主街逐一寻找',sheet:'TABULA III · THE VILLAGE OF HOGSMEADE',size:[1800,1350]},castle:{title:'霍格沃茨城堡',sub:'楼层导览 · 房间形状与相对坐标为重建',index:'城堡里的秘密',indexSub:'从地下到塔楼，沿楼层签逐一翻阅',sheet:'TABULA II · WITHIN THE CASTLE',size:[1600,1100]}};
  function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3700)}
  function writeBox(){map.setAttribute('viewBox',`${box.x} ${box.y} ${box.w} ${box.h}`);state.zoom=fitWidth/box.w;$('#zoomLabel').textContent=Math.round(state.zoom*100)+'%';$('#zoomIn').disabled=state.zoom>=4.95;$('#zoomOut').disabled=state.zoom<=1.01;queueReadability()}
  function queueReadability(){cancelAnimationFrame(labelFrame);labelFrame=requestAnimationFrame(updateReadability)}
  function updateReadability(){
    const small=matchMedia('(max-width:800px)').matches,unit=canvas.clientWidth/Math.max(1,box.w);
    // Keep Chinese labels readable at a bounded physical size; English is in the archive.
    if(state.view!=='castle')for(const el of map.querySelectorAll('.landmark')){
      const ribbon=el.querySelector('.ribbon')?.parentElement;if(!ribbon)continue;
      if(!ribbon.dataset.original)ribbon.dataset.original=ribbon.getAttribute('transform')||'';
      const scale=small?Math.max(1,Math.min(3.2,13/(26*unit))):1;
      ribbon.setAttribute('transform',`${ribbon.dataset.original} scale(${scale})`);
      ribbon.classList.add('readable-ribbon');ribbon.style.visibility='visible';
    }
    for(const el of map.querySelectorAll('.room-label'))el.style.fontSize=small?`${Math.min(54,Math.max(23,13/unit))}px`:'';
    for(const el of map.querySelectorAll('.passage-clue')){const label=el.querySelector('.clue-label'),hit=el.querySelector('.clue-hit');label.style.fontSize=small?`${Math.min(42,Math.max(15,11/unit))}px`:'';const w=small?Math.max(180,44/unit):180,h=small?Math.max(88,44/unit):88;hit.setAttribute('x',741-w/2);hit.setAttribute('y',692-h/2);hit.setAttribute('width',w);hit.setAttribute('height',h)}
    // Suppress only colliding/off-screen labels, never the landmark itself or its hit area.
    if(small&&state.view!=='castle'){
      const viewport=canvas.getBoundingClientRect(),used=[];
      const labels=[...map.querySelectorAll('.landmark')].sort((a,b)=>Number(b.dataset.place===state.selected)-Number(a.dataset.place===state.selected));
      for(const el of labels){const label=el.querySelector('.readable-ribbon');if(!label)continue;const r=label.getBoundingClientRect();
        const anchor=new DOMPoint(0,0).matrixTransform(el.getScreenCTM()),visible=anchor.x>=viewport.left&&anchor.x<=viewport.right&&r.bottom>viewport.top&&r.top<viewport.bottom;
        const overlaps=used.some(b=>r.left<b.right+4&&r.right>b.left-4&&r.top<b.bottom+5&&r.bottom>b.top-5);
        if(!visible||(overlaps&&el.dataset.place!==state.selected))label.style.visibility='hidden';else used.push(r);
      }
    }
    const vr=canvas.getBoundingClientRect();labelObstacles=[...map.querySelectorAll('.readable-ribbon,.room-label,.passage-clue .clue-label')].filter(el=>el.style.visibility!=='hidden').map(el=>{const r=el.getBoundingClientRect();return{x:box.x+(r.left-vr.left)/unit,y:box.y+(r.top-vr.top)/unit,w:r.width/unit,h:r.height/unit}});
    updatePeople();syncIndexAccess();
  }
  function syncIndexAccess(){const small=matchMedia('(max-width:800px)').matches,open=$('#indexPanel').classList.contains('mobile-open');$('#indexPanel').inert=small&&!open;$('#indexBackdrop').hidden=!small||!open;$('#mobileIndex').setAttribute('aria-expanded',String(small&&open))}
  function setIndex(open,restore=false){$('#indexPanel').classList.toggle('mobile-open',open);syncIndexAccess();if(restore)$('#mobileIndex').focus()}
  function initialFocus(){const small=canvas.clientWidth<540,c=state.view==='world'?[small?1260:1200,760,small?2.2:1.12]:state.view==='village'?[small?1000:900,small?760:700,small?2:1.1]:[800,610,small?1.55:1.12];focus(...c)}
  function fit(){const ratio=canvas.clientWidth/Math.max(1,canvas.clientHeight);fitWidth=Math.max(base[0],base[1]*ratio);box={x:(base[0]-fitWidth)/2,y:(base[1]-fitWidth/ratio)/2,w:fitWidth,h:fitWidth/ratio};writeBox()}
  function focus(x,y,z=2.2){const ratio=canvas.clientWidth/Math.max(1,canvas.clientHeight),w=fitWidth/z;box={x:x-w/2,y:y-w/ratio/2,w,h:w/ratio};writeBox()}
  function zoom(factor,screenX,screenY){const r=canvas.getBoundingClientRect(),px=screenX==null ? .5 : (screenX-r.left)/r.width,py=screenY==null ? .5 : (screenY-r.top)/r.height;const nextW=Math.max(fitWidth/5,Math.min(fitWidth,box.w*factor));const newH=nextW*box.h/box.w;box.x+=(box.w-nextW)*px;box.y+=(box.h-newH)*py;box.w=nextW;box.h=newH;writeBox()}
  function updateStatus(){const list=state.view==='village'?[]:eras[state.era].people;$('#statusText').textContent=state.view==='village'?'霍格莫德 · 地方志分卷':`${eras[state.era].label} · ${list.length} 组示意足迹`;
    $('#contextNote').textContent=state.view==='village'?'补充街区图 · 建筑位置为重建 · 村内不显示人物追踪':state.view==='castle'?'示意人物只沿公共走廊移动 · 不是原著情节回放':'仅沿插画可见小径示意 · 距离与路线非原著测绘';
    $('#tracksToggle').disabled=state.view==='village';$('#pause').disabled=state.view==='village';
  }
  function renderList(){let list=places.filter(p=>state.query||(p.view===state.view&&(p.view!=='castle'||p.floor===state.floor)));const q=state.query.toLocaleLowerCase().trim();if(q)list=list.filter(p=>[p.name,p.en,p.desc,p.story,...p.details,...p.tags||[]].join(' ').toLocaleLowerCase().includes(q));if(state.filter==='secret')list=list.filter(p=>p.secret);if(state.filter==='story')list=list.filter(p=>p.storyFlag);
    let lastGroup='';let html='';list.forEach((p,i)=>{const group=state.query?meta[p.view].index:p.view==='castle'?floors.find(x=>x[0]===p.floor)?.[1]:p.view==='world'?'THE SCHOOL & ITS ENVIRONS':'SHOPS, INNS & SECRET PLACES';if(group!==lastGroup){html+=`<div class="list-group">${group}</div>`;lastGroup=group}html+=`<button class="place-item ${state.selected===p.id?'selected':''}" data-index-place="${p.id}"><span class="item-no">${String(i+1).padStart(2,'0')}</span><span class="item-name">${p.name}<small>${p.en}</small></span><span class="arrow">↗</span></button>`});
    $('#placeList').innerHTML=html||'<p class="empty">纸上没有找到这个名字。<br>可以试试「蜂蜜公爵」「卢平」或「密道」。</p>';$('#placeCount').textContent=`${list.length} / ${places.length} 处地点`;
  }
  function render(){closePassage();currentFloorPlan=null;const m=meta[state.view];base=m.size;$('#sheetTitle').textContent=m.title;$('#sheetSubtitle').textContent=m.sub;$('#sheetNo').textContent=m.sheet;$('#indexTitle').textContent=m.index;$('#indexSubtitle').textContent=m.indexSub;$$('.views button').forEach(b=>b.classList.toggle('chosen',b.dataset.view===state.view));$('#floorStrip').hidden=state.view!=='castle';document.body.classList.toggle('floor-mode',state.view==='castle');
    if(state.view==='world')map.innerHTML=MAPART.illustratedWorld(state.era);else if(state.view==='village')map.innerHTML=MAPART.illustratedVillage(state.era);else{const r=MAPART.floor(state.floor,state.era);map.innerHTML=r.svg;floorBounds=r.bounds;currentFloorPlan=r.plan;$('#sheetSubtitle').textContent=state.floor==='third'?'三楼 · 独立导览样板 · 连接有据，平面为重建':floors.find(x=>x[0]===state.floor)[1]+' · '+m.sub;}
    installInkEffects();map.setAttribute('aria-label',m.title+'，可拖动缩放，点击建筑查阅档案');map.classList.toggle('tracks-hidden',!state.tracks);$('#routes')?.classList.toggle('hidden',!state.secrets);$$('[data-floor]').forEach(b=>b.classList.toggle('chosen',b.dataset.floor===state.floor));$('#cornerNote').innerHTML=state.view==='village'?'房屋方位为插画重建<br>原著商店名录，点选探索':state.view==='castle'?'空白处不附会房间名称<br>楼层依原著线索与章节索引':'北向与距离为绘图重建<br>点击建筑，展开它的故事';
    renderList();updateStatus();fit();initialFocus();createPeople();highlight();
  }
  function setView(view){closeDetail();state.view=view;state.query='';state.filter='all';$('#search').value='';$$('[data-filter]').forEach(b=>b.classList.toggle('chosen',b.dataset.filter==='all'));state.selected=null;render()}
  function detailIllustration(p){if(p.view==='castle')return `<svg viewBox="-180 -155 360 205" aria-hidden="true">${MAPART.defs}${MAPART.prop(p.icon)}</svg>`;const world=p.view==='world',w=world?(p.id==='hogwarts'?880:550):440,h=world?350:280;return `<svg viewBox="${p.xy[0]-w/2} ${p.xy[1]-h*.85} ${w} ${h}" aria-hidden="true"><image href="assets/${world?'world':'village'}-engraving.png" x="0" y="0" width="${world?2400:1800}" height="${world?1500:1350}" preserveAspectRatio="none"/></svg>`}
  function connectionSection(p){return ATLAS.connections.filter(c=>c.ends.includes(p.id)).map(c=>{const other=places.find(q=>q.id===c.ends.find(id=>id!==p.id));return `<section class="detail-connection" aria-label="关联地点线索"><span class="eyebrow">FOLLOW THE INK</span><h3>${c.title}</h3><p>${c.hint}</p><button class="connection-link" data-linked-place="${other.id}">${other.id==='honeydukes'?'翻到蜂蜜公爵 · 地窖线索':other.id==='witch'?'返回三楼 · 独眼女巫':`接着看 · ${other.name}`} ↗</button><button class="connection-map" data-route-button="${c.id}">在图上对照两端 →</button><small>${c.boundary}</small></section>`}).join('')}
  function openDetail(p){if(!$('#detailPanel').classList.contains('open'))returnFocus=document.activeElement;$('#detailPanel').inert=false;$('#detailPanel').classList.add('open');$('#detailPanel').setAttribute('aria-hidden','false');document.body.classList.add('detail-open');
    const label=p.blind?'图外札记 · 原地图盲区':p.view==='village'?'霍格莫德补充地方志':p.secret?'密道与隐藏入口':'地点档案';
    const route=p.secret&&!ATLAS.connections.some(c=>c.ends.includes(p.id))?`<button class="detail-route" data-route-button="${p.route||p.id}">${p.route==='ariana'?(state.era==='1998'?'查看 1998 年通道附注 →':'这条通道在 1998 年才出现'):p.id==='mirror'&&state.era!=='1976'?'查看坍塌通道 →':'在地图上查看密道 →'}</button>`:'';
    const later=state.era==='1976'?'下述故事是后来发生的回望记录。':state.era==='1993'&&['cave','gladrags','scrivenshaft','puddifoot','hogs-head','prefect-bath','requirement','astronomy','boys-bathroom'].includes(p.id)?'含所选年代之后发生的故事。':'';
    $('#detailContent').innerHTML=`<div class="detail-illustration">${detailIllustration(p)}</div><span class="eyebrow">${p.view==='village'?'HOGSMEADE GAZETTEER':p.view==='castle'?'HOGWARTS · '+floors.find(x=>x[0]===p.floor)?.[2]:'HOGWARTS & ENVIRONS'}</span><h2>${p.name}</h2><div class="detail-en">${p.en}</div><span class="detail-type">${label}</span><p class="detail-description">${p.desc}</p><div class="detail-section"><h3>纸边批注</h3><ul>${p.details.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="detail-section"><h3>${state.era} · 年代状态</h3><p>${ATLAS.state(p,state.era)}</p></div><div class="detail-section"><h3>留在这里的故事</h3>${later?`<p class="detail-note">${later}</p>`:''}<p>${p.story}</p></div>${p.tags?`<div class="detail-section"><div class="detail-facts">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div></div>`:''}${p.action?`<button class="detail-route" data-detail-view="${p.action}">${p.actionLabel}</button>`:route}<div class="detail-source">原著 / 资料依据<br>${p.book}<br><a href="${p.source}" target="_blank" rel="noopener noreferrer">${p.source.includes('hp-lexicon')?'核对章节索引 · Harry Potter Lexicon':'查阅官方相关资料'} ↗</a></div><p class="detail-note">地点资料不等同于精确测绘；建筑样貌、比例与相邻坐标是本图册的插画重建。</p>`;
    const provenance=document.createElement('div');provenance.className='detail-evidence';provenance.innerHTML=`<strong>资料边界</strong><span>原著线索：见下方作品 / 章节</span><span>绘图重建：建筑样貌、位置、比例与行走路线</span>${p.blind?'<span>地图盲区：不显示屋内人物</span>':''}`;$('#detailContent').querySelector('.detail-type').after(provenance);
    const connection=connectionSection(p);if(connection)$('#detailContent').querySelector('.detail-description').insertAdjacentHTML('afterend',connection);
    $('#detailPanel').scrollTop=0;queueReadability();
  }
  function closeDetail(restore=false){if($('#detailPanel').contains(document.activeElement))document.activeElement.blur();$('#detailPanel').classList.remove('open');$('#detailPanel').setAttribute('aria-hidden','true');$('#detailPanel').inert=true;document.body.classList.remove('detail-open');if(restore){const target=returnFocus?.isConnected&&!returnFocus.closest('[inert]')?returnFocus:map.querySelector(`[data-place="${state.selected}"]`)||$('#mobileIndex');target.focus()}queueReadability()}
  function selectPlace(id){const p=places.find(p=>p.id===id);if(!p)return;closePassage();state.selected=id;if(state.view!==p.view||p.floor&&state.floor!==p.floor){state.view=p.view;if(p.floor)state.floor=p.floor;render()}
    openDetail(p);renderList();highlight();setIndex(false);$('#detailClose').focus();requestAnimationFrame(()=>{const b=state.view==='castle'?floorBounds.find(x=>x.id===p.id):null;focus(b?.x??p.xy[0],b?.y??p.xy[1],state.view==='world'?2.8:state.view==='village'?2.6:2.5)});
  }
  function highlight(){$$('.landmark').forEach(el=>el.classList.toggle('selected',el.dataset.place===state.selected));$$('.map-room').forEach(el=>el.classList.toggle('room-selected',el.dataset.room===state.selected))}
  function closePassage(restore=false){passageTrail.hidden=true;document.body.classList.remove('passage-open');map.querySelectorAll('.active-route').forEach(el=>el.classList.remove('active-route'));if(restore){const target=map.querySelector(`[data-place="${state.selected}"]`)||$('#reset');target.focus()}queueReadability()}
  function followClue(id){state.query='';state.filter='all';$('#search').value='';$$('[data-filter]').forEach(b=>b.classList.toggle('chosen',b.dataset.filter==='all'));selectPlace(id)}
  function routeAction(route){if(route==='ariana'&&state.era!=='1998'){toast('这条通道属于1998年的故事。\n切换到1998年，可以查看附加札记。');return}
    state.secrets=true;$('#secretsToggle').setAttribute('aria-pressed','true');$('#secretsToggle').textContent='密道 开';
    if(route==='willow-shack'&&state.view!=='world'){const p=state.selected;state.view='world';render();state.selected=p}
    $('#routes')?.classList.remove('hidden');$$('.route').forEach(x=>x.classList.remove('active-route'));const routeEl=map.querySelector(`[data-route="${route}"]`);if(routeEl){routeEl.classList.add('active-route');const b=routeEl.getBBox();let w=Math.max(b.width*1.6,base[0]*.43),h=Math.max(b.height*1.6,base[1]*.45),ratio=canvas.clientWidth/canvas.clientHeight;w=Math.max(w,h*ratio);box={x:b.x+b.width/2-w/2,y:b.y+b.height/2-w/ratio/2,w,h:w/ratio};writeBox()}
    if(route==='mirror')toast(state.era==='1976'?'坍塌前的旧密道 · 原著未明确它的出口':'镜后密道已经坍塌，不能通行。');else if(route==='ariana')toast('1998年附注：阿利安娜肖像 ↔ 有求必应屋\n这是后来形成的通道，非原地图上的第八条旧密道。');else if(route==='willow-shack')toast('按下打人柳节疤 → 根下通道 → 尖叫棚屋\n人物离开校域边缘后，地图不再显示其位置。');else if(route==='witch-honey')toast('Dissendium · 独眼女巫雕像 → 蜂蜜公爵地窖');else toast('奖品陈列室附近的挂毯 → 魔咒课走廊');
    const connection=ATLAS.connections.find(c=>c.id===route);if(connection){closeDetail();setIndex(false);passageTrail.innerHTML=`<button class="passage-close" data-close-passage aria-label="收起密道线索">×</button><span class="eyebrow">FOLLOW THE INK · 两端对照</span><h3>${connection.title}</h3><div class="passage-ends">${connection.ends.map(id=>{const p=places.find(p=>p.id===id);return `<button data-linked-place="${id}">${id==='honeydukes'?'蜂蜜公爵 · 地窖':p.name} ↗</button>`}).join('<span aria-hidden="true">↔</span>')}</div><p>${connection.boundary}</p>`;passageTrail.hidden=false;document.body.classList.add('passage-open');passageTrail.querySelector('[data-linked-place]').focus();requestAnimationFrame(()=>{if(routeEl){const b=routeEl.getBBox();focus(b.x+b.width/2,b.y+b.height/2,Math.max(1,Math.min(2,fitWidth/Math.max(b.width*1.5,700))))}})}
  }
  // Animation study: icochi/The-Marauders-Map. Original SVG art and implementation;
  // no reference bitmap, footprint sprite or map image is bundled.
  const svgNS='http://www.w3.org/2000/svg';
  const footPath='M-2.8-9.5C-6-8.5-5.8-3-4.2.2L-3 2.4 2.6 2.4 3.4-.2C4.9-4.3 4-10-2.8-9.5ZM-2.7 4.3 2.3 4.3 2 7.8Q-.2 9.4-2.8 7.6Z';
  const footprintLife=14;
  let people=[],inkTransition=null;
  function installInkEffects(){
    inkTransition=null;
    const artwork=document.createElementNS(svgNS,'g');artwork.id='inkArtwork';
    while(map.firstChild)artwork.append(map.firstChild);
    map.append(artwork);
    const defs=document.createElementNS(svgNS,'defs');
    // Shared, deterministic pinholes erode ink locally instead of fading the whole shoe.
    const holes=Array.from({length:52},(_,i)=>({x:((i*47+13)%101)/101*15-7.5,y:((i*31+7)%103)/103*24-12,r:.65+((i*17)%11)/12}));
    defs.innerHTML=Array.from({length:8},(_,stage)=>`<mask id="footWear${stage}" maskUnits="userSpaceOnUse" x="-10" y="-14" width="20" height="28" style="mask-type:luminance"><rect x="-10" y="-14" width="20" height="28" fill="white"/>${holes.map(h=>`<circle cx="${h.x}" cy="${h.y}" r="${stage===7?18:stage===0?h.r*.12:h.r*(.2+stage*.43)}" fill="black"/>`).join('')}</mask>`).join('')+
      '<filter id="atlasInkNoise" x="0" y="0" width="100%" height="100%" primitiveUnits="objectBoundingBox" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="9 13" numOctaves="2" seed="23"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  .33 .34 .33 0 0"/><feComponentTransfer><feFuncA id="inkThreshold" type="linear" slope="18" intercept="1"/></feComponentTransfer></filter><mask id="atlasInkReveal" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox" x="0" y="0" width="1" height="1" style="mask-type:alpha"><rect width="1" height="1" fill="white" filter="url(#atlasInkNoise)"/></mask>';
    map.prepend(defs);
  }
  function transitionInk(opening){
    if(reduced){$('#inkArtwork').removeAttribute('mask');return}
    inkTransition={start:performance.now(),duration:opening?2450:1050,opening};
    $('#inkArtwork').setAttribute('mask','url(#atlasInkReveal)');updateInk(inkTransition.start);
  }
  function updateInk(t){
    if(!inkTransition)return;
    const progress=Math.min(1,Math.max(0,(t-inkTransition.start)/inkTransition.duration));
    const eased=progress*progress*(3-2*progress),amount=inkTransition.opening?eased:1-eased;
    $('#inkThreshold').setAttribute('intercept',String(-18+19*amount));
    if(progress===1){if(inkTransition.opening)$('#inkArtwork').removeAttribute('mask');inkTransition=null}
  }
  const personNames={'James Potter':'詹姆·波特','Sirius Black':'小天狼星','Remus Lupin':'卢平','Peter Pettigrew':'彼得·佩迪鲁','Harry Potter':'哈利·波特','Hermione Granger':'赫敏·格兰杰','Argus Filch':'费尔奇','Neville Longbottom':'纳威·隆巴顿','Ginny Weasley':'金妮·韦斯莱','Luna Lovegood':'卢娜·洛夫古德','Severus Snape':'西弗勒斯·斯内普'};
  function createPeople(){people=[];const holder=$('#people');if(!holder)return;const artwork=$('#inkArtwork'),firstLandmark=artwork.querySelector('.landmark');if(firstLandmark?.parentNode===artwork)artwork.insertBefore(holder,firstLandmark);const routes=state.view==='world'?MAPART.groundsPatrols:currentFloorPlan.patrols;
    eras[state.era].people.forEach((name,i)=>{
      const g=document.createElementNS(svgNS,'g');g.setAttribute('class','person');
      const label=personNames[name]||name,width=Math.max(82,label.length*14+20),speed=state.view==='world'?12:26,spacing=state.view==='world'?14:12,pool=Math.ceil(footprintLife*speed/spacing)+2;
      g.innerHTML=`<title>${label} · ${name} · 示意轨迹</title><g class="foot-trail" aria-hidden="true">${Array.from({length:pool},()=>`<g class="foot-stamp" visibility="hidden"><path class="foot" d="${footPath}"/></g>`).join('')}</g><g class="name-tag" aria-hidden="true"><path class="scroll-tail" d="M-4-12-17-15-13-7-17 0-3-3M${width+3}-12l14-3-4 8 4 7-15-3"/><path class="name-scroll" d="M0-17Q${width/2}-21 ${width}-17L${width} 3Q${width/2}-1 0 3Z"/><path class="scroll-crease" d="M4-16v17M${width-4}-16v17"/><text x="${width/2}" y="-3" text-anchor="middle">${label}</text></g>`;
      holder.append(g);const route=routes[i%routes.length],lengths=route.slice(1).map((p,j)=>Math.hypot(p[0]-route[j][0],p[1]-route[j][1]));
      people.push({g,name,width,route,lengths,total:lengths.reduce((a,b)=>a+b,0),offset:i*.22,speed,spacing,scale:state.view==='world'?1:.9,label:g.querySelector('.name-tag'),stamps:[...g.querySelectorAll('.foot-stamp')].map(el=>({el,ink:el.firstElementChild,step:null,wear:null}))});
    });
    updatePeople();
  }
  function pointOn(p,dist){const cycle=((dist%(p.total*2))+p.total*2)%(p.total*2),back=cycle>p.total,d=back?p.total*2-cycle:cycle;let prev=0;for(let i=0;i<p.lengths.length;i++){if(d<=prev+p.lengths[i]){const t=(d-prev)/p.lengths[i],a=p.route[i],b=p.route[i+1];return{x:a[0]+(b[0]-a[0])*t,y:a[1]+(b[1]-a[1])*t,a:Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI+90+(back?180:0)}}prev+=p.lengths[i]}return {x:p.route[0][0],y:p.route[0][1],a:0}}
  function updatePeople(){const occupied=[...labelObstacles],unit=canvas.clientWidth/Math.max(1,box.w),small=canvas.clientWidth<540;for(const p of people){
    const dist=simTime*p.speed+p.offset*p.total,point=pointOn(p,dist),newest=Math.floor(dist/p.spacing);
    const scale=Math.max(p.scale,(small?1.02:.84)/Math.max(.01,unit)),w=(p.width+34)*scale,h=28*scale;
    const visible=point.x>=box.x&&point.x<=box.x+box.w&&point.y>=box.y&&point.y<=box.y+box.h;
    const candidates=[[point.x+14*scale,point.y-18*scale],[point.x+14*scale,point.y+40*scale],[point.x-w,point.y-18*scale],[point.x-w,point.y+40*scale]];
    let chosen=null;for(const [cx,cy] of candidates){const x=Math.max(box.x+17*scale,Math.min(box.x+box.w-w,cx)),y=Math.max(box.y+23*scale,Math.min(box.y+box.h-8*scale,cy)),r={x,y:y-23*scale,w,h};if(!occupied.some(b=>r.x<b.x+b.w&&r.x+r.w>b.x&&r.y<b.y+b.h&&r.y+r.h>b.y)){chosen={x,y,r};break}}
    p.label.style.visibility=visible&&chosen?'visible':'hidden';if(visible&&chosen){occupied.push(chosen.r);p.label.setAttribute('transform',`translate(${chosen.x} ${chosen.y}) scale(${scale})`)}
    p.stamps.forEach((stamp,j)=>{
      const step=newest-j,age=(dist-step*p.spacing)/p.speed;
      if(step<0||age>=footprintLife){stamp.el.setAttribute('visibility','hidden');return}
      stamp.el.removeAttribute('visibility');
      // Position is sampled once at landing: old impressions never skate with the person.
      if(stamp.step!==step){const pt=pointOn(p,step*p.spacing),side=(step%2?1:-1)*4;stamp.el.setAttribute('transform',`translate(${pt.x} ${pt.y}) rotate(${pt.a}) translate(${side} 0) scale(.76)`);stamp.ink.setAttribute('transform',`scale(${step%2?-1:1} 1)`);stamp.el.dataset.step=step;stamp.step=step}
      const wear=Math.min(7,Math.floor(Math.max(0,age-3.5)/1.5));
      if(stamp.wear!==wear){stamp.ink.setAttribute('mask',`url(#footWear${wear})`);stamp.el.dataset.wear=wear;stamp.wear=wear}
      stamp.ink.setAttribute('opacity',String(.82*Math.min(1,age/.18)));
    });
  }}
  function animate(t){if(!lastFrame)lastFrame=t;const delta=Math.min((t-lastFrame)/1000,.1);lastFrame=t;updateInk(t);if(state.active&&!state.paused&&!reduced&&!document.hidden){simTime+=delta;updatePeople()}animationFrame=requestAnimationFrame(animate)}
  function setAwakeAccess(awake){for(const el of [$('.masthead'),$('.workspace'),$('.statusbar')])el.inert=!awake;$('#coverScreen').inert=awake;$('#coverScreen').setAttribute('aria-hidden',String(awake))}
  function wake(){if(state.active)return;clearTimeout(wakeTimer);document.body.classList.remove('sleeping','closing');document.body.classList.add('awake','waking');state.active=true;setAwakeAccess(true);transitionInk(true);requestAnimationFrame(()=>{fit();initialFocus()});wakeTimer=setTimeout(()=>{document.body.classList.remove('waking');$('#activate').blur()},reduced?0:2550)}
  function sleep(){if(!state.active)return;clearTimeout(wakeTimer);closeDetail();closePassage();state.active=false;document.body.classList.remove('waking');document.body.classList.add('closing');transitionInk(false);wakeTimer=setTimeout(()=>{document.body.classList.remove('awake','closing');document.body.classList.add('sleeping');setAwakeAccess(false);$('#activate').focus()},reduced?0:1150)}
  $('#activate').onclick=wake;$('#sleep').onclick=sleep;$('#mobileIndex').textContent='目录';$('#mobileIndex').setAttribute('aria-controls','indexPanel');
  $('.brand').onclick=e=>{e.preventDefault();setView('world')};$$('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));$('#era').onchange=e=>{state.era=e.target.value;const p=places.find(p=>p.id===state.selected);render();if(p)openDetail(p);toast(`已翻到 ${e.target.selectedOptions[0].textContent}\n人物为该年代的示意轨迹。`)};
  $('#floorStrip').innerHTML=floors.map(f=>`<button data-floor="${f[0]}" class="${f[0]===state.floor?'chosen':''}">${f[1]}</button>`).join('');$('#floorStrip').onclick=e=>{const b=e.target.closest('[data-floor]');if(!b)return;state.floor=b.dataset.floor;state.selected=null;closeDetail();render()};
  $('#placeList').onclick=e=>{const b=e.target.closest('[data-index-place]');if(b)selectPlace(b.dataset.indexPlace)};
  canvas.onclick=e=>{if(dragged)return;const b=e.target.closest('[data-place]'),clue=e.target.closest('[data-route-trigger]');if(b)selectPlace(b.dataset.place);else if(clue)routeAction(clue.dataset.routeTrigger)};
  canvas.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){const b=e.target.closest('[data-place]'),clue=e.target.closest('[data-route-trigger]');if(b||clue){e.preventDefault();if(b)selectPlace(b.dataset.place);else routeAction(clue.dataset.routeTrigger)}}};
  $('#detailClose').onclick=()=>closeDetail(true);$('#detailContent').onclick=e=>{const route=e.target.closest('[data-route-button]'),view=e.target.closest('[data-detail-view]'),linked=e.target.closest('[data-linked-place]');if(linked)followClue(linked.dataset.linkedPlace);else if(route)routeAction(route.dataset.routeButton);else if(view)setView(view.dataset.detailView)};
  passageTrail.onclick=e=>{const linked=e.target.closest('[data-linked-place]');if(linked)followClue(linked.dataset.linkedPlace);else if(e.target.closest('[data-close-passage]'))closePassage(true)};
  $('#search').oninput=e=>{state.query=e.target.value;renderList()};$$('[data-filter]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.classList.toggle('chosen',x===b));renderList()});
  $('#mobileIndex').onclick=()=>{const open=!$('#indexPanel').classList.contains('mobile-open');if(open){closeDetail();closePassage();setIndex(true);$('#search').focus()}else setIndex(false,true)};$('#indexClose').onclick=()=>setIndex(false,true);$('#indexBackdrop').onclick=()=>setIndex(false,true);
  $('#zoomIn').onclick=()=>zoom(.75);$('#zoomOut').onclick=()=>zoom(1.35);$('#reset').onclick=()=>{fit();toast('已回到本卷全图')};
  $('#secretsToggle').onclick=()=>{state.secrets=!state.secrets;$('#routes')?.classList.toggle('hidden',!state.secrets);$('#secretsToggle').setAttribute('aria-pressed',String(state.secrets));$('#secretsToggle').textContent='密道 '+(state.secrets?'开':'关');if(!state.secrets)closePassage()};
  $('#tracksToggle').onclick=()=>{state.tracks=!state.tracks;map.classList.toggle('tracks-hidden',!state.tracks);$('#tracksToggle').setAttribute('aria-pressed',String(state.tracks));$('#tracksToggle').textContent='足迹 '+(state.tracks?'开':'关')};
  $('#pause').onclick=()=>{state.paused=!state.paused;$('#pause').setAttribute('aria-pressed',String(state.paused));$('#pause').textContent=state.paused?'▷':'Ⅱ';$('#pause').setAttribute('aria-label',state.paused?'继续人物足迹':'暂停人物足迹')};
  $('#about').onclick=()=>$('#notesDialog').showModal();$('#notesClose').onclick=()=>$('#notesDialog').close();$('#notesDialog').onclick=e=>{if(e.target===$('#notesDialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}};
  $('#sourceList').innerHTML=[['活点地图 · 官方',ATLAS.sources.map],['霍格莫德 · 官方',ATLAS.sources.hogs],['隐秘通道 · 官方',ATLAS.sources.secrets],['霍格莫德章节索引',ATLAS.sources.hogsIndex]].map(([n,u])=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${n} ↗</a>`).join('');
  $('.cover-castle').setAttribute('viewBox','740 200 1000 740');$('.cover-castle').innerHTML='<image href="assets/world-engraving.png" x="0" y="0" width="2400" height="1500" preserveAspectRatio="none"/>';
  const pointers=new Map();let startPoint=null,pinchDistance=null;
  canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(e.deltaY*.0014),e.clientX,e.clientY)},{passive:false});
  canvas.addEventListener('dblclick',e=>{if(!e.target.closest('[data-place]'))zoom(.65,e.clientX,e.clientY)});
  canvas.addEventListener('pointerdown',e=>{if(e.button&&e.button!==0)return;dragged=false;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});startPoint={x:e.clientX,y:e.clientY};if(pointers.size===2){const a=[...pointers.values()];pinchDistance=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}});
  canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;const prev=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const a=[...pointers.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(pinchDistance&&d>0)zoom(pinchDistance/d,(a[0].x+a[1].x)/2,(a[0].y+a[1].y)/2);pinchDistance=d;dragged=true;return}if(startPoint&&Math.hypot(e.clientX-startPoint.x,e.clientY-startPoint.y)>5)dragged=true;if(dragged){canvas.setPointerCapture(e.pointerId);const r=canvas.getBoundingClientRect();box.x-=(e.clientX-prev.x)*box.w/r.width;box.y-=(e.clientY-prev.y)*box.h/r.height;const pad=base[0]*.25;box.x=Math.max(-box.w+pad,Math.min(base[0]-pad,box.x));box.y=Math.max(-box.h+pad,Math.min(base[1]-pad,box.y));writeBox()}});
  const release=e=>{pointers.delete(e.pointerId);pinchDistance=null;startPoint=null;setTimeout(()=>{dragged=false},50)};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#notesDialog').open)return;if($('#indexPanel').classList.contains('mobile-open'))setIndex(false,true);else if(!passageTrail.hidden)closePassage(true);else if($('#detailPanel').classList.contains('open'))closeDetail(true);else if(state.active)sleep();return}if(e.target.matches('input,select,textarea'))return;if(e.key==='/'){e.preventDefault();if(!state.active)wake();closeDetail();closePassage();setIndex(true);$('#search').focus()}if(!state.active&&e.key==='Enter')wake();if(state.active){if(e.key==='+')zoom(.8);if(e.key==='-')zoom(1.25);if(e.key==='0')fit()}});
  let resizeTimer;new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{const cx=box.x+box.w/2,cy=box.y+box.h/2,z=state.zoom;fit();if(z>1.05)focus(cx,cy,z)},100)}).observe(canvas);
  render();setAwakeAccess(false);animationFrame=requestAnimationFrame(animate);
  window.addEventListener('pagehide',()=>{cancelAnimationFrame(animationFrame);cancelAnimationFrame(labelFrame)});
})();
