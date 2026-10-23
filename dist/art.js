window.MAPART = (() => {
  const {places}=ATLAS;
  const path=(d,cl='ink',other='')=>`<path d="${d}" class="${cl}" ${other}/>`;
  const line=(x1,y1,x2,y2,cl='ink hair')=>`<path d="M${x1} ${y1}L${x2} ${y2}" class="${cl}"/>`;
  const text=(x,y,t,cl='map-label',other='')=>`<text x="${x}" y="${y}" class="${cl}" ${other}>${t}</text>`;
  const rect=(x,y,w,h,cl='ink',other='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${cl}" ${other}/>`;
  const circle=(x,y,r,cl='ink')=>`<circle cx="${x}" cy="${y}" r="${r}" class="${cl}"/>`;
  function seed(n){let a=n;return()=>{a=(a*1664525+1013904223)>>>0;return a/4294967296}}
  const defs=`<defs><pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(24)"><path d="M0 0V7" stroke="#666148" stroke-width=".75" opacity=".5"/></pattern><pattern id="crosshatch" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M0 9L9 0M-2 2L2 -2M7 11L11 7" stroke="#746c50" stroke-width=".8" opacity=".35"/></pattern><pattern id="water" width="59" height="18" patternUnits="userSpaceOnUse"><path d="M3 5q8 -4 16 0t16 0M32 14q7 -3 16 0" fill="none" stroke="#726d53" stroke-width="1" opacity=".65"/></pattern><pattern id="stone" width="18" height="12" patternUnits="userSpaceOnUse"><path d="M0 0H18M0 6H18M4 0V6M13 6V12" fill="none" stroke="#7b7157" stroke-width=".55" opacity=".4"/></pattern><pattern id="dots" width="12" height="11" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".7" fill="#74694b" opacity=".5"/><circle cx="8" cy="7" r=".5" fill="#74694b" opacity=".4"/></pattern></defs>`;
  function windowAt(x,y,s=1){return `<g transform="translate(${x} ${y}) scale(${s})">${path('M-4 9V-3Q0 -12 4 -3V9Z','shade')}${line(-5,11,5,11)}${line(0,-5,0,9)}</g>`}
  function tower(x,y,w=45,h=130,roof=true){let o=`<g transform="translate(${x} ${y})">${path(`M${-w/2} 0V${-h}Q0 ${-h-8} ${w/2} ${-h}V0Z`,'wash')}`;if(roof)o+=path(`M${-w/2-7} ${-h}L0 ${-h-75}L${w/2+7} ${-h}Z`,'shade')+line(0,-h-75,0,-h-92)+path(`M0 ${-h-90}q22 -9 27 4l-27 6`);else o+=path(`M${-w/2} ${-h}v-13h8v9h10v-10h10v10h10v-9h8v13`);for(let j=25;j<h-6;j+=29)o+=windowAt(0,-j,.75);for(let k=0;k<6;k++)o+=line(-w/2+4,-k*23-3,w/2-3,-k*23-6);o+=path(`M${w/2-7} -2V${-h+3}`,'ink hair');return o+'</g>'}
  function house(x=0,y=0,s=1,v=0){let w=74+v%3*12,h=53+v%2*12;let o=`<g transform="translate(${x} ${y}) scale(${s})">`;
    o+=path(`M${-w/2} 0V${-h}L${w/2} ${-h+4}V0Z`,'wash')+path(`M${-w/2-9} ${-h}L-7 ${-h-42}L${w/2+7} ${-h+4}Z`,'shade');
    o+=path(`M-7 ${-h-42}L${w/2+29} ${-h-31}L${w/2+40} ${-h+7}L${w/2+7} ${-h+4}M${w/2} 0l36 -16v${-h+23}`,'ink');
    o+=path(`M-21 ${-h-26}v-22h12v8M${w/2-10} ${-h-6}l11 -24`,'ink');
    for(let a=0;a<4;a++)o+=line(w/2+11+a*6,-h+5,w/2+4+a*6,-h-24,'ink hair');
    for(let a=0;a<3;a++)o+=windowAt(-w/2+14+a*(w-22)/3,-h+20,.72);
    o+=path('M-9 0v-23q8 -11 16 0V0Z','ink')+circle(3,-9,.8,'solid');
    if(v%2)o+=path(`M${-w/2+3} -9L${w/2-4} ${-h+9}M${-w/2+3} ${-h+7}L${w/2-4} -8M${-w/2} -29h${w}`,'ink hair');
    else for(let a=0;a<4;a++)o+=line(-w/2+5,-8-a*11,w/2-7,-7-a*11,'ink hair');
    o+=line(-w/2-14,2,w/2+34,2)+path(`M${-w/2-11} 8q29 -5 56 1`,'ink hair');return o+'</g>';
  }
  function tree(x,y,s=1,v=0){let o=`<g transform="translate(${x} ${y}) scale(${s})">`;if(v%4===0){o+=path('M-4 0l2 -56M3 0L0 -52M-22 -18l11 -12h-8l12 -14h-6L0 -70l13 26H7l12 14h-8l12 12Z','wash');for(let i=0;i<4;i++)o+=path(`M${-14+i*2} ${-23-i*8}l${12-i*2} 4m4 -5l${9-i} -3`,'ink hair')}
    else{o+=path('M-3 0l2 -38M4 0L1 -40M0 -11l-10 -17m11 9l11 -15');o+=path('M-17 -28q-13 -10 -5 -20q-5 -12 8 -17q4 -14 16 -9q14 -8 19 6q15 3 10 18q10 13 -4 23q-8 9 -19 3q-14 6 -25 -4Z','wash');for(let i=0;i<4;i++)o+=path(`M${-19+i*9} ${-41-i%2*9}q-5 -8 4 -12m1 20q-6 -6 -1 -10`,'ink hair')}
    o+=path('M-16 3q17 -5 32 0','ink hair');return o+'</g>'}
  function forest(x,y,w,h,count,n){const r=seed(n),p=[];for(let i=0;i<count;i++){let xx=x+r()*w,yy=y+r()*h; p.push({xx,yy,s:.5+r()*.5,v:i})}return p.sort((a,b)=>a.yy-b.yy).map(p=>tree(p.xx,p.yy,p.s,p.v)).join('')}
  function mountain(x,y,w,h,n){const r=seed(n);let o=path(`M${x-w/2} ${y}L${x-13} ${y-h+28}L${x} ${y-h}L${x+21} ${y-h+31}L${x+w/2} ${y}`);o+=path(`M${x-13} ${y-h+28}l15 22 13 -8 18 28 12 -4M${x} ${y-h}l5 51 20 30 -2 16 27 37`,'ink hair');for(let i=0;i<15;i++){let yy=y-h+55+i*(h-50)/15; o+=line(x+8+i*.9,yy,x+w*.22+r()*w*.23,yy+20+r()*20,'ink hair')}return o}
  function castle(x=0,y=0,s=1){let o=`<g transform="translate(${x} ${y}) scale(${s})">`;o+=path('M-195 39q-30 -15 1 -40l16 -44q38 -20 76 -11l68 -39q70 -13 110 27l74 9 46 51 21 48Z','shade');
    for(let i=0;i<27;i++)o+=path(`M${-180+i*15} ${i%2?3:-9}l${i%2?-8:6} ${20+i%3*10}m-2 -15l9 -7`,'ink hair');
    o+=house(-81,-25,1.5,1)+house(45,-31,1.25,2)+house(131,-16,.9,3);o+=tower(-130,-36,43,105,false)+tower(-43,-44,45,191)+tower(70,-40,34,151)+tower(131,-24,29,106,false)+tower(-182,-12,29,79)+tower(1,-18,53,82,false);
    o+=path('M-12 -19v-32q14 -24 27 0v32','shade')+path('M-26 -18h55m-50 5h44m-36 6h28');o+=path('M-97 -32h70M18 -31h39','ink hair');return o+'</g>'}
  function willow(){return `<g>${path('M-8 0q17 -29 8 -70q-21 4 -42 -15m44 24q25 -10 33 -37M4 -37q-21 -2 -30 -25M0 -59q17 -27 5 -51M-37 -82l-12 -17m46 -2l-15 -17M29 -91l20 -14M-13 -52l-24 10M9 -88l20 -32M-15 -4q-21 5 -34 0M-3 -4q27 -8 44 6')}${path('M-42 -84q-24 9 -24 39m23 -43q-4 30 -13 48m29 -20q-21 6 -19 25m43 -75q-40 -2 -49 21m60 -20q23 -5 31 12m-4 -3q24 -8 38 11m-32 -13q11 37 30 47m-26 -48q17 26 10 44','ink hair')}${circle(-5,-20,4)}</g>`}
  function greenhouse(){let o=path('M-95 0v-47l25 -32h140l26 32V0Z','wash')+path('M-95 -47h191M-70 -79l25 32V0M-70 -79V-4M-22 -79v77M22 -79v77M66 -79v77M-95 -23H96','ink hair');for(let i=-79;i<90;i+=22)o+=path(`M${i} -6v-18m0 9q-13 -15 -9 -18q8 -2 9 10q10 -14 13 -10q2 6 -13 10`,'ink hair');return o}
  function pitch(){let o=`<ellipse cx="0" cy="-24" rx="184" ry="80" class="ink"/><ellipse cx="0" cy="-27" rx="164" ry="60" class="ink hair"/>`;o+=path('M-184 -24v23q180 120 368 0v-23M-2 -84v120','ink hair')+circle(0,-24,33,'ink hair');for(let i=0;i<18;i++){const a=i*Math.PI*2/18,xx=Math.cos(a)*178, yy=Math.sin(a)*76-24;o+=path(`M${xx-9} ${yy}v-44l9 -14 9 14v44M${xx-9} ${yy-44}h18`,'shade')+line(xx,yy-58,xx,yy-73)+path(`M${xx} ${yy-73}l13 4 -13 5`,'ink hair')}for(const xx of [-118,118])for(let i=-1;i<2;i++)o+=line(xx+i*17,-29,xx+i*17,-86-Math.abs(i)*-9)+circle(xx+i*17,-94+Math.abs(i)*9,8);return o}
  function gate(){return path('M-74 0v-87h17v87m114 0v-87h17v87M-57 -1v-65q57 -41 114 0V-1')+path('M0 -85v83M-40 -63v61m18 -70v70m44 -70v70m18 -61v61M-57 -24H57M-57 -47H57','ink hair')+path('M-88 0h176M-82 -87h32m0 0l-16 -19 -16 19M50 -87h32m0 0l-16 -19 -16 19')}
  function station(){let o=house(-40,0,1.1,1)+house(62,0,.8,2)+path('M-133 8h273M-145 15h294M-147 23h300','ink');for(let i=-130;i<140;i+=12)o+=line(i,15,i-3,23);o+=rect(-13,-22,26,22,'wash')+rect(-9,-16,18,8,'ink hair');return o}
  function boat(){return path('M-50 -7q51 15 100 0l-18 25q-30 15 -64 0Z','wash')+path('M-34 -3l69 1m-59 9h48m-31 -15l28 -30m-30 33l-28 -30','ink hair')}
  function prop(type){let o='';
    if(type==='castle')return castle(0,0,.72);
    if(type==='village')return house(-70,5,.7,1)+house(0,-17,1,2)+house(65,9,.72,3);
    if(['shop','inn','hut','shack','post'].includes(type)){o+=house(-8,3,type==='inn'?1.3:1.05,type==='shack'?3:1);if(type==='post')o+=path('M-13 -85l10 -13 16 13 -4 11H-9Z')+circle(-3,-85,3)+circle(5,-85,3);if(type==='shack')o+=path('M-35 -31l18 -12m-19 6l18 6M13 -30l17 -12m-17 6l17 7');if(type==='shop'||type==='inn')o+=path('M-58 -42h-32v25h32v-21m-16 -4v-9')+line(-85,-10,-57,-10);return o}
    if(type==='tower')return tower(0,5,58,112);
    if(type==='willow')return willow();if(type==='greenhouse')return greenhouse();if(type==='pitch')return pitch();if(type==='gate')return gate();if(type==='station')return station();if(type==='boat')return boat();if(type==='forest')return tree(-44,10,.9,1)+tree(35,-15,1.2,4)+tree(0,25,1.2,2);
    if(type==='lake')return path('M-95 -30q35 -36 89 -10q40 -28 95 6q19 45 -19 54q-42 31 -101 6q-65 2 -64 -56Z','wash')+path('M-70 -13q20 -6 41 0m31 8q27 -7 55 -1m-93 23q25 -4 50 0','ink hair');
    if(type==='cave')return path('M-69 0l26 -67 38 -24 44 12 34 79Z','shade')+path('M-26 0v-30q27 -41 48 0V0Z','solid')+path('M-41 -60l31 3 20 -20M41 -34l12 29','ink');
    if(type==='statue'){return path('M-42 9h84v-12H-42Z','shade')+path('M-29 -3q10 -35 5 -59q-26 4 -26 -19q-1 -17 16 -23q21 -11 33 8q10 -1 21 5l-14 6q-2 18 -13 22l24 60Z','wash')+path('M-33 -91l10 -1m-14 10l-8 2m25 19l-2 44m-3 -70l6 2m-8 26q19 -7 26 8M-38 9v8h76V9','ink hair')}
    if(type==='cauldron'){o+=path('M-52 -35q-6 67 52 65q58 2 52 -65Z','wash')+path('M-57 -35q57 -15 114 0q-57 14 -114 0M-39 25l-8 17m86 -17l8 17M-47 -25q-39 -15 -24 9m117 -9q38 -15 25 9M-32 -51q-13 -19 0 -29m32 26q-12 -27 1 -37m28 39q15 -16 0 -28');return o}
    if(type==='books'){for(let i=0;i<7;i++)o+=rect(-55+i*16,-49-(i%3)*7,13,78+(i%3)*7,'shade');return o+path('M-67 32H70M-67 37H70','ink')}
    if(type==='basin'){return path('M-66 -16q65 -25 132 0q-66 24 -132 0Z','wash')+path('M-66 -16q1 32 26 40h80q24 -8 26 -40M-13 25v24h26V25M-3 -24v-32q0 -11 17 -8M-10 -47H9M-22 -90H42v-39H-22Z','ink')+path('M5 -128l-5 14 10 7 -3 12','ink hair')}
    if(type==='bath'){let bath=rect(-155,-110,310,150,'bath-rim','rx="6"')+rect(-140,-95,280,120,'bath-water');
      for(let j=0;j<16;j++)for(const sy of [-101,32])bath+=path(`M${-130+j*17.3} ${sy}v-6h5v4`,'ink hair');
      return bath+rect(-170,-35,50,13,'wash')+rect(-28,-149,56,31,'shade')+path('M-14 -132q10 -13 19 -2q10 8 16 3m-30 3q-13 5 -13 -2','ink hair');}
    if(type==='trophy'){return path('M-30 -72h60v34q0 28 -30 29q-30 -1 -30 -29ZM-7 -9v30h-21v12h56V21H7V-9M-30 -62h-19v18q0 22 27 26m52 -44h19v18q0 22 -27 26','ink')+path('M-16 -60v20q-1 16 14 18','ink hair')}
    if(type==='mirror'){return rect(-46,-103,92,139,'shade')+rect(-37,-93,74,118,'wash')+path('M-30 13l56 -88m-47 91l45 -72M-35 36v12m70 -12v12','ink hair')}
    if(type==='door'){return path('M-46 33v-98q46 -70 92 0v98ZM-35 33v-96q35 -55 70 0v96','ink')+circle(24,-4,3)+line(-1,-83,-1,32,'ink hair')}
    if(type==='stairs'){for(let i=0;i<8;i++)o+=path(`M${-67+i*8} ${32-i*12}h${138-i*15}v-12h${-130+i*15}`);return o}
    if(type==='hall'){for(let i=0;i<4;i++)o+=rect(-65+i*35,-65,20,102,'shade');return o+rect(-77,-94,163,15,'ink')}
    if(type==='kitchen'){return prop('hall')+path('M-70 5q-6 -12 0 -15m35 15q-6 -12 0 -15m35 15q-6 -12 0 -15m35 15q-6 -12 0 -15','ink hair')}
    if(type==='courtyard'){return rect(-80,-80,160,120,'shade')+rect(-59,-59,118,78,'wash')+circle(0,-18,20)+path('M0 -38v39m-20 -19h40','ink hair')}
    if(type==='barrel'){return path('M-36 -69q-16 50 0 100q36 13 72 0q16 -50 0 -100Z','wash')+path('M-36 -69q36 13 72 0M-41 -49h82m-87 60h90M-19 -66v94M1 -62v94m20 -95v92','ink hair')}
    if(type==='fire'){return path('M-65 30v-101H65V30M-49 30v-77H49V30M-74 -76H74v-17H-74Z','shade')+path('M-26 26q-21 -19 1 -45q-1 14 6 16q24 -21 13 -44q48 42 29 73M-36 30H36','ink')}
    if(type==='serpent'){return path('M-44 23q90 -59 45 -86q-30 -14 -48 2q-14 20 11 28q26 9 48 -8q52 -31 49 -60q-28 -7 -41 16q-9 22 15 28q20 17 -8 30q-25 14 -61 50Z','wash')+circle(48,-89,2,'solid')+path('M60 -96l15 -5m-8 2l6 8','ink hair')}
    if(type==='eagle'){return path('M0 30l-10 -43q-65 -6 -68 -60q25 28 60 26l4 -30 16 -11 19 9 -17 11 11 23q35 2 63 -23q-6 51 -64 56l-12 42 -10 -15Z','shade')}
    if(type==='teacup'){return path('M-50 -48h86q-2 65 -43 65q-40 -1 -43 -65ZM37 -38q50 -16 39 13q-7 22 -43 18M-72 27q65 17 133 0M-65 23q65 -14 128 0M-28 -65q-12 -17 2 -27m27 29q12 -22 0 -36','ink')}
    if(type==='road')return path('M-90 40q12 -49 70 -61q65 -17 89 -65M-67 47q17 -48 70 -58q60 -12 83 -58','ink');
    return house();
  }
  function ribbon(x,y,name,en,w=210){return `<g transform="translate(${x} ${y})">${path(`M${-w/2-21} -16l-28 -6 7 17 -7 15 29 -4M${w/2+21} -16l28 -6 -7 17 7 15 -29 -4`,'ink hair')}${path(`M${-w/2} -27q${w/2} -10 ${w} 0l-3 37q${-w/2} 8 ${-w+6} 0Z`,'ribbon')}${text(0,-1,name)}${en?text(0,33,en,'small-label'):''}</g>`}
  function marker(p,scale=1,labelY=42,w=215){return `<g class="landmark" tabindex="0" role="button" aria-label="${p.name}，查看档案" data-place="${p.id}" transform="translate(${p.xy[0]} ${p.xy[1]})"><ellipse cx="0" cy="-30" rx="${w*.7}" ry="105" class="marker-halo"/><g transform="scale(${scale})">${prop(p.icon)}</g>${ribbon(0,labelY,p.name,p.en,w)}</g>`}
  function compass(x,y,s=1){return `<g class="compass" transform="translate(${x} ${y}) scale(${s})">${circle(0,0,37)}${path('M0 -66l10 49 20 -13 -13 20 49 10 -49 10 13 20 -20 -13 -10 49 -10 -49 -20 13 13 -20 -49 -10 49 -10 -13 -20 20 13Z')}${path('M0 -66V66M-66 0H66','ink hair')}${text(0,-80,'N','small-label')}${text(-81,5,'W','small-label')}${text(81,5,'E','small-label')}${text(0,89,'S','small-label')}</g>`}
  function world(era){let o=defs+`<g id="landscape">`;
    o+=path('M66 183Q600 71 1179 133T2349 147','ink hair')+path('M60 1370Q739 1480 1530 1466T2350 1389','ink hair');
    for(let i=0;i<19;i++)o+=mountain(90+i*128,205+(i%3)*20,220,90+(i%4)*19,i);
    o+=forest(1800,270,485,590,160,445)+forest(135,1070,475,210,90,29)+forest(1900,1120,420,220,60,53);
    const lake='M1032 945Q979 976 941 1048Q891 1130 997 1239Q1024 1344 1154 1349Q1290 1401 1479 1349Q1730 1363 1875 1255Q1997 1120 1880 1031Q1800 940 1646 951Q1581 892 1518 953Q1316 913 1227 956Z';
    o+=path(lake,'wash')+path(lake,'ink','style="fill:url(#water);stroke-width:2"');for(let i=0;i<4;i++)o+=path(`M${1040+i*7} ${1010+i*9}q-80 120 15 202`,'ink hair');
    o+=path('M1290 1184q15 -49 46 -6q-8 25 -23 11q-15 -18 10 -22m-7 27q-40 41 -53 5q-7 -24 10 -15m53 8q58 42 68 7q4 -23 -15 -22m-55 13q44 -42 67 -15m-78 28q0 49 -31 48','ink hair');
    o+=path('M752 413Q933 234 1118 275Q1202 275 1202 356Q1176 460 1240 549Q1330 612 1276 748M1176 372Q1042 441 948 545Q822 659 653 773M1105 303Q884 430 842 702Q724 976 854 1220Q928 1355 1427 1385Q1805 1421 2268 1384','ink','style="stroke-width:7;stroke:#aea186"');
    o+=path('M752 413Q933 234 1118 275Q1202 275 1202 356Q1176 460 1240 549Q1330 612 1276 748M1176 372Q1042 441 948 545Q822 659 653 773M1105 303Q884 430 842 702Q724 976 854 1220Q928 1355 1427 1385Q1805 1421 2268 1384','ink hair');
    o+=path('M55 1340C342 1280 667 1491 1016 1416S1767 1470 2370 1344','ink','style="stroke-width:8;stroke:#8b8165"')+path('M55 1340C342 1280 667 1491 1016 1416S1767 1470 2370 1344','ink','style="stroke-width:12;stroke-dasharray:2 8"');
    for(let i=0;i<4;i++)o+=path(`M${1020-i*10} ${906+i*8}q70 -66 167 -53l124 -29q190 23 221 91`,'ink hair');
    for(let i=0;i<48;i++){const r=seed(i+100);o+=path(`M${r()*2100+120} ${r()*1010+290}l${r()*14+4} -2`,'ink hair')}
    o+=text(2190,920,'SILVA VETITA','calligraphy')+text(1270,1270,'THE GREAT LAKE','calligraphy');
    o+=compass(220,848,.75);
    o+=`</g><g id="routes" class="routes">${path('M1260 724C1180 620 1070 545 963 526S734 459 575 426','route','data-route="witch-honey"')}${path('M1570 464Q1428 217 810 252','route','data-route="willow-shack"')}${era==='1998'?path('M1270 701Q1150 462 690 402','route supplement','data-route="ariana"'):''}</g>`;
    places.filter(p=>p.view==='world').forEach(p=>{const scale={hogwarts:1.8,lake:.5,forest:1.3,hagrid:1.15,willow:1.05,quidditch:.95,greenhouses:1.05,owlery:.85,station:1,gates:.85,boathouse:.85,village:1.55,'shack-world':.9,broomshed:.85}[p.id];if(p.id==='lake')o+=`<g class="landmark" data-place="lake" role="button" tabindex="0" aria-label="黑湖，查看档案">${ribbon(1510,1180,'黑湖 · 大湖','THE GREAT LAKE',230)}</g>`;else if(p.id==='forest')o+=`<g class="landmark" data-place="forest" role="button" tabindex="0" aria-label="禁林，查看档案">${ribbon(2100,670,'禁林','THE FORBIDDEN FOREST',190)}</g>`;else o+=marker(p,scale,p.id==='hogwarts'?100:45,p.id==='hogwarts'?270:p.id==='broomshed'?210:220)});
    o+=`<g transform="translate(200 1180)">${text(0,0,'HOGWARTS','region-title')}${text(0,42,'School of Witchcraft & Wizardry','calligraphy')}${path('M-128 63q128 -18 256 0','ink hair')}</g>`;return o+`<g id="people"></g><g id="selectedOverlay"></g>`;
  }
  function village(era){let o=defs;
    o+=path('M195 1279Q247 1122 424 1099Q570 1072 662 963Q712 842 873 762Q1002 675 1028 551Q1083 431 1197 365Q1367 264 1445 108','ink','style="stroke-width:43;stroke:#b1a98c55"');
    o+=path('M182 1279Q233 1112 421 1081Q555 1055 647 954Q699 830 863 745Q990 660 1008 548Q1065 410 1189 347Q1345 250 1428 101M209 1279Q264 1136 430 1117Q585 1090 678 973Q729 854 883 780Q1019 693 1047 559Q1100 452 1210 383Q1384 283 1462 116','ink hair');
    o+=path('M615 980Q449 928 430 714Q360 418 406 250M1015 563Q824 461 679 488Q527 500 433 705M862 761Q1110 850 1265 778M1207 357Q1111 270 1038 82','ink','style="stroke-width:15;stroke:#b6aa8b77"')+path('M615 980Q449 928 430 714Q360 418 406 250M1015 563Q824 461 679 488Q527 500 433 705M862 761Q1110 850 1265 778M1207 357Q1111 270 1038 82','ink hair');
    o+=path('M70 111Q306 83 486 133M1310 1130Q1439 1185 1647 1079','ink hair');
    for(let i=0;i<12;i++)o+=mountain(115+i*146,83+i%3*11,175,58+i%4*12,i);
    o+=forest(80,360,185,640,47,803)+forest(1420,426,230,700,57,811)+forest(1030,1040,470,180,35,987);
    const houses=[[510,1090,.6],[760,1140,.7],[960,1120,.7],[300,1110,.65],[1200,1030,.55],[1330,947,.6],[1350,690,.6],[1420,590,.65],[1230,610,.55],[1180,492,.5],[1450,317,.65],[1440,127,.6],[1080,272,.58],[734,289,.6],[610,357,.55],[525,478,.54],[570,610,.55],[750,665,.65],[560,860,.52],[330,839,.6],[315,606,.58],[300,471,.6],[701,819,.6]];
    houses.forEach((p,i)=>o+=house(...p,i));
    const r=seed(56);for(let i=0;i<230;i++){let x=290+r()*1080,y=180+r()*1050;o+=path(`M${x} ${y}l${r()*4+1} -1`,'ink hair','style="opacity:.3"')}
    o+=text(1545,867,'Gardens & orchards','calligraphy','transform="rotate(-80 1545 867)"')+text(239,1040,'To the School Gates','calligraphy','transform="rotate(-62 239 1040)"');
    o+=`<g id="routes" class="routes">${path('M1162 770q135 163 68 349q-15 86 -30 181','route','data-route="witch-honey"')}${path('M420 242Q220 151 70 308','route','data-route="willow-shack"')}${era==='1998'?path('M480 720Q183 679 26 796','route supplement','data-route="ariana"'):''}</g>`;
    places.filter(p=>p.view==='village').forEach(p=>{if(p.id==='high-street'){o+=`<g class="landmark" data-place="high-street" role="button" tabindex="0" aria-label="主街，查看档案">${text(895,643,'HIGH STREET','calligraphy','transform="rotate(-39 895 643)"')}</g>`}else o+=marker(p,p.id==='cave'?.65:p.id==='shrieking-shack'?1.15:1.25,p.id==='cave'?33:48,p.name.length>7?240:210)});
    o+=compass(1550,198,.7)+text(1330,1245,'补充街区图 · 村内不显示人物追踪','no-tracking');
    o+=`<g transform="translate(240 1230)">${ribbon(0,0,'霍格莫德','HOGSMEADE',230)}</g>`;return o+`<g id="selectedOverlay"></g>`;
  }
  function furniture(p,x,y,w,h){let o='';const id=p.id;const usableH=h-68;
    const desk=(dx,dy,wide=40)=>rect(dx,dy,wide,17,'shade')+rect(dx+7,dy+23,wide-14,8,'ink hair');
    const bookcase=(dx,dy,wide=105)=>{let q=rect(dx,dy,wide,20,'ink');for(let a=6;a<wide-4;a+=6)q+=line(dx+a,dy+2,dx+a+1,dy+18,'ink hair');return q};
    if(['history','charms','defence','potions'].includes(id)){for(let row=0;row<3;row++)for(let col=0;col<4;col++){const dx=x+38+col*(w-110)/3,dy=y+46+row*36;o+=desk(dx,dy);if(id==='potions')o+=circle(dx+20,dy+7,6)}o+=desk(x+w/2-58,y+15,116)+bookcase(x+18,y+h-56,95);}
    else if(['great-hall','kitchen'].includes(id)){for(let col=0;col<4;col++){let dx=x+50+col*85;o+=rect(dx,y+39,33,usableH-21,'shade');for(let row=0;row<5;row++)o+=rect(dx-8,y+44+row*20,6,12,'ink hair')+rect(dx+35,y+44+row*20,6,12,'ink hair')}o+=rect(x+29,y+15,w-58,15,'shade');}
    else if(id==='library'){for(let col=0;col<3;col++)for(let row=0;row<3;row++)o+=bookcase(x+25+col*126,y+22+row*45,106);o+=rect(x+w-45,y+12,23,h-60,'ink hair');}
    else if(['myrtle','boys-bathroom'].includes(id)){for(let col=0;col<5;col++){const xx=x+28+col*72;o+=rect(xx,y+22,55,77,'ink hair')+path(`M${xx+10} ${y+99}q32 -2 33 -28`,'ink hair')+circle(xx+27,y+49,12);o+=`<ellipse cx="${xx+28}" cy="${y+usableH+8}" rx="15" ry="9" class="ink"/>`+line(xx+28,y+usableH-3,xx+28,y+usableH+3)}o+=rect(x+15,y+usableH-8,w-30,39,'ink hair')}
    else if(id==='prefect-bath'){o+=rect(x+62,y+29,w-124,usableH-12,'wash','rx="13"')+rect(x+75,y+42,w-150,usableH-38,'ink hair','rx="8"');for(let a=0;a<15;a++){o+=circle(x+75+a*18,y+35,2);o+=circle(x+75+a*18,y+usableH+13,2)}for(let a=0;a<7;a++)o+=path(`M${x+90+a*30} ${y+70}q12 -5 24 0`,'ink hair');}
    else if(['gryffindor','slytherin','hufflepuff','ravenclaw'].includes(id)){o+=rect(x+w/2-36,y+14,72,17,'shade');o+=rect(x+w/2-30,y+37,60,45,'ink hair');for(const [dx,dy] of [[x+43,y+46],[x+w-100,y+46],[x+60,y+110],[x+w-110,y+110]])o+=rect(dx,dy,49,23,'wash','rx="6"')+rect(dx+4,dy+4,41,15,'ink hair','rx="4"');o+=circle(x+w/2,y+111,25)+circle(x+w/2,y+111,21,'ink hair');}
    else if(id==='trophy'){for(let col=0;col<7;col++){o+=rect(x+23+col*53,y+20,37,20,'shade')+circle(x+42+col*53,y+30,4)}for(let row=0;row<2;row++)for(let col=0;col<4;col++)o+=rect(x+35+col*91,y+65+row*52,69,29,'ink hair')+circle(x+54+col*91,y+79+row*52,5)+circle(x+84+col*91,y+79+row*52,5);}
    else if(id==='courtyard'){o+=rect(x+35,y+30,w-70,usableH-9,'ink hair');for(let col=0;col<11;col++)o+=circle(x+28+col*35,y+23,3)+circle(x+28+col*35,y+usableH+24,3);o+=circle(x+w/2,y+h/2-10,31)+circle(x+w/2,y+h/2-10,24);}
    else if(id==='requirement'){o+=text(x+w/2,y+usableH/2+24,'?', 'floor-letter')+path(`M${x+21} ${y+usableH+4}h${w-42}`,'ink hair','style="stroke-dasharray:3 7"');}
    else if(id==='witch'){o+=path(`M${x+70} ${y+25}v${usableH+6}h${w-140}v${-usableH-6}`,'ink hair');o+=`<g transform="translate(${x+w/2} ${y+usableH-6}) scale(.7)">${prop('statue')}</g>`;}
    else if(id==='mirror'){o+=rect(x+43,y+26,w-86,usableH-12,'shade');o+=path(`M${x+56} ${y+38}h${w-112}v${usableH-36}h${-w+112}Z`,'ink hair');for(let i=0;i<6;i++)o+=path(`M${x+60+i*40} ${y+45}l32 17 -19 27 22 28`,'ink hair');}
    else if(id==='forbidden-corridor'){o+=rect(x+65,y+24,w-130,usableH-5,'ink hair')+rect(x+w/2-28,y+35,56,56,'shade')+circle(x+w/2+18,y+62,3);}
    else if(['astronomy','headmaster','divination'].includes(id)){o+=circle(x+w/2,y+usableH/2+20,Math.min(usableH/2-8,w/2-35))+circle(x+w/2,y+usableH/2+20,usableH/2-20,'ink hair');for(let i=0;i<8;i++){let a=i*Math.PI/4,xx=x+w/2+Math.cos(a)*usableH*.32,yy=y+usableH/2+20+Math.sin(a)*usableH*.32;o+=circle(xx,yy,7);if(id==='astronomy')o+=line(xx-9,yy+8,xx+13,yy-14)}}
    else o+=`<g transform="translate(${x+w/2} ${y+h/2-5}) scale(.65)">${prop(p.icon)}</g>`;
    return o;
  }
  // One geometry contract for the drawing, patrols and collision checks. This is
  // an original guide plan, not a canonical blueprint or a reconstruction of events.
  const floorPlan={
    corridors:[[260,588,1075,58],[758,235,62,695]],
    cells:[[285,300,410,237],[880,300,410,237],[285,700,410,182],[880,700,410,182]],
    patrols:[[[337,608],[790,608],[1250,608]],[[1240,630],[790,630],[350,630]],[[778,850],[778,617],[778,370]],[[802,350],[802,608],[390,608]]]
  };
  // Third-floor pilot: only the named connections are evidence-based. Wing shape,
  // doors, distances and furnishing positions remain original guide reconstruction.
  const thirdPlan={
    corridors:[[230,550,1140,80],[550,300,80,330],[1270,300,80,630],[530,390,100,70],[935,500,80,50],[410,630,80,90],[1210,770,60,60]],
    rooms:[{id:'witch',rect:[260,315,270,180],door:[530,390,530,460]},
      {id:'trophy',rect:[730,265,480,235],door:[935,500,1015,500]},
      {id:'charms',rect:[880,710,330,200],door:[1210,770,1210,830]},
      {id:'forbidden-corridor',rect:[255,720,380,175],door:[410,720,490,720]}],
    patrols:[[[280,574],[1310,574],[1310,350]],[[1230,608],[590,608],[590,325]],
      [[1292,888],[1292,600],[850,600]],[[610,330],[610,590],[350,590]]]
  };
  thirdPlan.cells=thirdPlan.rooms.map(room=>room.rect);
  const fourthPlan={
    corridors:[[230,900,1180,70],[975,280,80,690],[915,650,140,80],[1055,450,75,70]],
    rooms:[{id:'library',rect:[245,300,670,560],door:[915,650,915,730]},
      {id:'mirror',rect:[1130,300,250,260],door:[1130,450,1130,520]}],
    patrols:[[[260,925],[1010,925],[1010,320]],[[1370,946],[1035,946],[1035,335]],
      [[993,340],[993,920],[440,920]],[[1030,850],[1030,680],[940,680]]]
  };
  fourthPlan.cells=fourthPlan.rooms.map(room=>room.rect);
  // The Entrance Hall and cloisters are public circulation spaces. `cells` is
  // the non-walkable envelope here, not a claim that all named spaces are closed.
  const groundPlan={
    rooms:[{id:'courtyard',rect:[210,310,390,450],door:[600,690,600,750]},
      {id:'entrance',rect:[650,350,245,410],door:[650,690,650,750]},
      {id:'great-hall',rect:[940,270,470,500],door:[940,505,940,585]}],
    corridors:[[220,320,370,60],[220,690,370,60],[220,320,60,430],[530,320,60,430],
      [590,690,150,70],[650,470,245,290],[740,470,80,450],[895,505,45,80],
      [210,810,1220,80],[210,690,70,200]],
    garden:[280,385,250,300],stairs:[700,365,160,105],hourglasses:[660,490,42,185],
    patrols:[[[250,345],[560,345],[560,720],[775,720],[775,850]],
      [[1375,850],[795,850],[795,520]],
      [[240,845],[240,720],[560,720],[560,345]],
      [[915,545],[770,545],[770,845],[1190,845]]]
  };
  groundPlan.cells=[groundPlan.rooms.find(room=>room.id==='great-hall').rect,
    groundPlan.garden,groundPlan.stairs,groundPlan.hourglasses];
  const dungeonPlan={
    rooms:[{id:'potions',rect:[220,285,500,260],door:[440,545,520,545]},
      {id:'slytherin',rect:[230,750,440,220],door:[590,750,650,750]},
      {id:'kitchen',rect:[965,285,450,345],door:[965,470,965,540]},
      {id:'hufflepuff',rect:[1010,780,370,205],door:[1095,780,1165,780]}],
    corridors:[[780,235,80,760],[290,585,570,80],[440,545,80,40],
      [590,665,70,85],[860,470,105,70],[860,665,520,70],[1095,735,70,45]],
    fruitFrame:[938,472,30,64],barrels:[1164,733,96,44],
    patrols:[[[815,255],[815,950]],[[330,610],[805,610],[805,280]],
      [[1370,700],[835,700],[835,505],[925,505]],
      [[620,720],[620,640],[835,640],[835,700],[1130,700],[1130,755]]]
  };
  dungeonPlan.cells=[...dungeonPlan.rooms.map(room=>room.rect),dungeonPlan.fruitFrame,dungeonPlan.barrels];
  // The Requirement record is a margin note, not a mapped room. Its rectangle
  // is only a focus/hit region; it must never become a floor cell or a doorway.
  const seventhPlan={
    rooms:[{id:'gryffindor',rect:[195,275,470,470],door:[665,470,665,550]}],
    notes:[{id:'requirement',rect:[1000,710,400,160]}],
    corridors:[[665,470,240,80],[825,270,80,650],[825,610,590,90],[825,840,300,80]],
    portrait:[645,458,50,100],tapestry:[1060,515,270,65],blankWall:[1000,710,400,30],stairs:[[843,273,44,44],[1057,852,56,56]],
    patrols:[[[865,345],[865,880],[1035,880]],
      [[1380,640],[845,640],[845,330]],
      [[745,510],[885,510],[885,670],[1375,670]],
      [[1010,860],[875,860],[875,495],[735,495]]]
  };
  seventhPlan.cells=[seventhPlan.rooms[0].rect,seventhPlan.portrait,seventhPlan.tapestry,seventhPlan.blankWall,...seventhPlan.stairs];
  // Four doors are an address clue. Only the bath has a named interior;
  // the other three door backs deliberately have no invented rooms.
  const fifthPlan={
    rooms:[{id:'prefect-bath',rect:[210,270,610,490],door:[710,760,790,760]}],
    corridors:[[140,810,1310,80],[140,720,70,170],[1380,300,70,590],[710,760,80,50],
      [920,770,60,40],[1120,770,60,40],[1320,770,60,40]],
    pool:[285,400,450,235],boris:[1450,700,70,105],
    doors:[{number:1,x:1350},{number:2,x:1150},{number:3,x:950},{number:4,x:750}],
    patrols:[[[175,755],[175,845],[1420,845],[1420,340]],
      [[1400,380],[1400,870],[265,870]],
      [[350,832],[1230,832]],
      [[1280,865],[755,865],[755,785]]]
  };
  fifthPlan.cells=[fifthPlan.rooms[0].rect,fifthPlan.boris,...fifthPlan.doors.filter(d=>d.number!==4).map(d=>[d.x-25,752,50,18])];
  const planFor=f=>f==='dungeon'?dungeonPlan:f==='ground'?groundPlan:f==='third'?thirdPlan:f==='fourth'?fourthPlan:f==='fifth'?fifthPlan:f==='seventh'?seventhPlan:floorPlan;
  function dungeonInterior(p,x,y,w,h){let o='';
    if(p.id==='potions'){
      o+=rect(x+22,y+17,w-44,25,'shade','data-potions-shelf="true"');
      for(let j=0;j<23;j++){const bx=x+33+j*19;o+=path(`M${bx} ${y+34}v-10h4v-4h5v4h4v10Z`,'ink hair')}
      for(let row=0;row<2;row++)for(let col=0;col<4;col++){const dx=x+44+col*109,dy=y+70+row*77;
        o+=rect(dx,dy,66,42,'wash')+circle(dx+33,dy+21,15,'shade')+circle(dx+33,dy+21,10,'ink hair');
        o+=path(`M${dx+15} ${dy+15}q-12 7 0 14m36 -14q12 7 0 14M${dx+25} ${dy+5}l-4 -14`,'ink hair');
      }
      o+=text(x+w/2,y+h-61,'材料架 · 坩埚课桌','ground-caption');
    }else if(p.id==='kitchen'){
      o+=rect(x+22,y+20,w-44,40,'shade','data-kitchen-hearth="true"');
      for(let j=0;j<7;j++)o+=circle(x+47+j*58,y+40,10,'ink hair');
      for(let col=0;col<4;col++){const dx=x+52+col*98,dy=y+90;
        o+=rect(dx,dy,36,160,'wash',`data-kitchen-table="${col}"`);
        for(let row=0;row<6;row++)o+=circle(dx+18,dy+15+row*25,7,'ink hair');
      }
      o+=text(x+w/2,y+h-59,'餐桌与楼上礼堂相对应','ground-caption');
    }else if(p.id==='slytherin'){
      o+=rect(x+25,y+23,w-50,32,'shade')+rect(x+38,y+31,w-76,16,'ink hair');
      for(const dx of [x+45,x+w-120])o+=rect(dx,y+83,76,35,'wash','rx="5"')+rect(dx+8,y+89,60,22,'ink hair');
      o+=rect(x+w/2-51,y+84,102,45,'wash','rx="3"');
      for(let j=0;j<4;j++)o+=circle(x+45+j*116,y+64,5,'ink hair');
      o+=text(x+w/2,y+h-56,'湖下石室 · 壁炉与皮沙发','ground-caption');
    }else{
      for(let j=0;j<5;j++){const a=(j+1)*Math.PI/6,px=x+w/2+Math.cos(a)*w*.35,py=y+66-Math.sin(a)*22;
        o+=circle(px,py,9,'ink hair')+path(`M${px-5} ${py+1}l5 -8 5 8`,'ink hair');}
      for(const dx of [x+57,x+w-99])o+=rect(dx,y+87,42,27,'wash','rx="9"');
      o+=circle(x+w/2,y+110,26,'wash')+circle(x+w/2,y+110,21,'ink hair');
      for(const dx of [x+93,x+w-93])o+=circle(dx,y+37,11,'wash');
      o+=text(x+w/2,y+h-57,'圆窗 · 植物 · 圆桌','ground-caption');
    }
    return o;
  }
  function dungeonFloor(){let o=defs+'<g class="dungeon-floor">',bounds=[];
    o+=path('M195 260H745V210H885V260H1440V655H1405V760H1400V1008H985V760H885V1015H755V690H695V995H205V725H265V560H195Z','shade');
    for(const c of dungeonPlan.corridors)o+=rect(...c,'ground-walk');
    o+=text(800,172,'THE DUNGEONS','region-title')+text(800,209,'地下 · 石墙、坩埚与厨房走廊','third-subtitle');
    for(const room of dungeonPlan.rooms){const p=places.find(p=>p.id===room.id),[x,y,w,h]=room.rect,cx=x+w/2;
      bounds.push({id:p.id,x:cx,y:y+h/2,w,h});
      const outline=p.id==='hufflepuff'?`<ellipse cx="${cx}" cy="${y+h/2}" rx="${w/2}" ry="${h/2}" class="map-room" data-room="${p.id}"/>`:rect(x,y,w,h,'map-room',`data-room="${p.id}"`);
      o+=`<g class="landmark" tabindex="0" role="button" data-place="${p.id}" aria-label="${p.name}，查看档案">${outline}`;
      if(p.id==='hufflepuff')o+=`<ellipse cx="${cx}" cy="${y+h/2}" rx="${w/2-9}" ry="${h/2-9}" class="ink hair"/>`;else o+=rect(x+9,y+9,w-18,h-18,'ink hair');
      o+=dungeonInterior(p,x,y,w,h);
      const shortName=p.id==='slytherin'?'斯莱特林':p.id==='hufflepuff'?'赫奇帕奇':p.name;
      o+=text(cx,y+h-28,shortName,'room-label')+text(cx,y+h-10,p.en,'room-en')+'</g>';
      const [ax,ay,bx,by]=room.door;
      o+=path(`M${ax} ${ay}L${bx} ${by}`,'door-opening');
      if(p.id==='slytherin')o+=path(`M${ax} ${ay}h60m-53 -5h48m-47 10h46`,'ink hair','data-hidden-stone-wall="true"');
      else o+=path(ax===bx?`M${ax} ${ay}h-35q0 35 35 35`:`M${ax} ${ay}v-35q35 0 35 35`,'ink hair');
    }
    // These two entrance symbols follow official descriptions; their exact
    // coordinates are original guide reconstruction, not canonical door positions.
    o+=`<g class="landmark" tabindex="0" role="button" data-place="kitchen" aria-label="查看水果画中的厨房入口" data-kitchen-fruit="true">${rect(938,472,30,64,'wash')}${rect(942,477,22,54,'ink hair')}`;
    o+=path('M951 513q-12 2 -8 -10l6 -8q-2 -9 4 -10q6 2 4 10l6 8q4 12 -12 10ZM951 487l5 -6','ink hair')+'</g>';
    o+=`<g class="landmark" tabindex="0" role="button" data-place="hufflepuff" aria-label="查看木桶后的赫奇帕奇入口" data-hufflepuff-barrels="true">`;
    for(const [bx,by] of [[1180,744],[1212,744],[1244,744],[1196,766],[1228,766]])o+=`<ellipse cx="${bx}" cy="${by}" rx="14" ry="10" class="wash"/>`+path(`M${bx-12} ${by-4}h24m-24 8h24`,'ink hair');
    o+='</g>'+text(1194,662,'厨房与木桶入口在同一条走廊','ground-caption');
    o+=text(622,735,'口令石墙','ground-caption')+text(888,302,'往门厅','ground-caption');
    for(let j=0;j<6;j++)o+=line(788,241+j*7,852,241+j*7,'ink hair');
    o+=`<g class="landmark floor-index-link" tabindex="0" role="button" data-place="entrance" data-index-x="815" data-index-y="1048" aria-label="返回地面层门厅档案">${rect(650,1017,330,62,'clue-hit')}${text(815,1054,'回到地面层 · 门厅 ↗','clue-label')}</g>`;
    o+=text(800,1090,'厨房与木桶入口同廊有官方依据 · 两翼、距离与门位为导览重建','small-label floor-boundary-note');
    return {svg:o+'</g><g id="routes" class="routes"></g><g id="people"></g><g id="selectedOverlay"></g>',bounds,plan:dungeonPlan};
  }
  function greatHallInterior(x,y,w,h){let o='';
    o+=rect(x+25,y+25,w-50,62,'shade')+rect(x+35,y+84,w-70,9,'ink hair');
    o+=rect(x+45,y+38,w-90,22,'wash','data-teachers-table="true"');
    for(let i=0;i<11;i++)o+=rect(x+54+i*32,y+27,17,7,'ink hair');
    o+=text(x+w/2,y+78,'教师席','ground-caption');
    for(let col=0;col<4;col++){const sx=x+56+col*98,sy=y+130;
      o+=rect(sx,sy,38,263,'wash',`data-dining-table="${col}"`);
      for(const bx of [sx-13,sx+45])o+=rect(bx,sy+7,6,249,'shade');
      for(let row=0;row<10;row++){const yy=sy+15+row*25;
        o+=circle(sx+9,yy,3.5,'ink hair')+circle(sx+29,yy,3.5,'ink hair');
        o+=line(sx+17,yy-5,sx+17,yy+4,'ink hair')+line(sx+21,yy-5,sx+21,yy+4,'ink hair');
      }
      // Candle glyphs are an overhead decoration, not floor obstacles.
      const cx=sx+19,cy=y+112;
      o+=path(`M${cx-3} ${cy}v-12h6v12ZM${cx} ${cy-13}q-6 -6 0 -12q6 6 0 12`,'ink hair');
    }
    o+=text(x+w/2,y+h-61,'四张学院长桌 · 上方为魔法天花板','ground-caption');
    for(let j=0;j<6;j++)o+=rect(x+w-6,y+110+j*51,12,23,'wash');
    return o;
  }
  function entranceInterior(){let o='';const [x,y,w,h]=groundPlan.stairs;
    o+=`<g data-marble-staircase="true">${rect(x,y,w,h,'wash')}`;
    for(let i=0;i<10;i++)o+=line(x+6,y+8+i*9,x+w-6,y+8+i*9,'ink hair');
    o+=path(`M${x-9} ${y+h}V${y-9}H${x+w+9}V${y+h}`,'ink')+'</g>';
    o+=text(x+w/2,y+h+22,'大理石楼梯','ground-caption');
    const houseLabels=['狮','獾','鹰','蛇'];
    for(let i=0;i<4;i++){const hx=667,hy=496+i*44;
      o+=`<g data-house-hourglass="${i}">${rect(hx,hy,28,35,'wash')}`;
      o+=path(`M${hx+4} ${hy+4}h20l-9 13 9 14h-20l9 -14Z`,'ink hair');
      o+=path(`M${hx+8} ${hy+27}h12l-6 -8Z`,'shade')+'</g>';
      o+=text(hx-11,hy+23,houseLabels[i],'ground-caption');
    }
    o+=text(820,673,'学院沙漏','ground-caption');
    // No point totals are fabricated for any of the three eras.
    return o;
  }
  function groundFloor(){let o=defs+'<g class="ground-floor">',bounds=[];
    o+=path('M180 275H620V320H915V245H1435V795H1455V915H845V950H715V915H185V790H180Z','shade');
    for(const c of groundPlan.corridors)o+=rect(...c,'ground-walk');
    o+=text(800,172,'GROUND FLOOR','region-title')+text(800,209,'地面层 · 门厅、礼堂与回廊','third-subtitle');
    for(const room of groundPlan.rooms){const p=places.find(p=>p.id===room.id),[x,y,w,h]=room.rect,cx=x+w/2;
      bounds.push({id:p.id,x:cx,y:y+h/2,w,h});
      o+=`<g class="landmark" tabindex="0" role="button" data-place="${p.id}" aria-label="${p.name}，查看档案">${rect(x,y,w,h,'map-room',`data-room="${p.id}"`)}${rect(x+9,y+9,w-18,h-18,'ink hair')}`;
      if(p.id==='great-hall')o+=greatHallInterior(x,y,w,h);
      else if(p.id==='entrance')o+=entranceInterior();
      else{const [gx,gy,gw,gh]=groundPlan.garden;
        o+=rect(gx,gy,gw,gh,'ground-garden')+rect(gx+9,gy+9,gw-18,gh-18,'ink hair');
        for(let i=0;i<6;i++)for(const yy of [331,735])o+=circle(245+i*61,yy,5,'wash');
        for(let i=0;i<5;i++)for(const xx of [235,575])o+=circle(xx,405+i*60,5,'wash');
        for(let i=0;i<5;i++)o+=path(`M${282+i*49} 379q24 -22 48 0M${282+i*49} 692q24 22 48 0`,'ink hair');
        o+=text(cx,gy+gh/2-15,'露天庭院','room-label')+text(cx,gy+gh/2+18,'COURTYARD','room-en');
        o+=text(cx,gy+gh/2+59,'四面回廊','ground-caption');
      }
      if(p.id==='entrance')o+=text(cx,y-24,'门厅','room-label')+text(cx,y-6,p.en,'room-en');
      if(p.id==='great-hall')o+=text(cx,y+h-28,p.name,'room-label')+text(cx,y+h-10,p.en,'room-en');
      o+='</g>';
      const [ax,ay,bx,by]=room.door;
      o+=path(`M${ax} ${ay}L${bx} ${by}`,'door-opening')+path(`M${ax} ${ay}h-35q0 35 35 35M${bx} ${by}h-35q0 -35 35 -35`,'ink hair');
    }
    o+=path('M735 917h80M735 917v-23h39v23m2 0v-23h39v23','ink');
    o+=text(775,974,'橡木大门','floor-feature-label')+text(1188,929,'PUBLIC GALLERY','small-label');
    // These are archive/floor-index links, not invented physical passages.
    o+=`<g class="landmark ground-index-link floor-index-link" tabindex="0" role="button" data-place="kitchen" data-index-x="1205" aria-label="翻到地下厨房档案">${rect(1040,975,330,62,'clue-hit')}${text(1205,1012,'楼下厨房 · 翻到地下 ↗','clue-label')}</g>`;
    o+=`<g class="landmark ground-index-link floor-index-link" tabindex="0" role="button" data-place="history" data-index-x="375" aria-label="翻到一楼魔法史教室档案">${rect(210,975,330,62,'clue-hit')}${text(375,1012,'上一楼 · 魔法史 ↗','clue-label')}</g>`;
    o+=text(800,1090,'门厅与礼堂连接有原著依据 · 庭院位置、比例与门位为导览重建','small-label floor-boundary-note');
    return {svg:o+'</g><g id="routes" class="routes"></g><g id="people"></g><g id="selectedOverlay"></g>',bounds,plan:groundPlan};
  }
  function thirdFloor(){let o=defs,bounds=[];
    o+=path('M225 300H650V235H1235V275H1390V955H1245V930H835V990H220V690H180V510H225Z','shade');
    // One continuous outline, without false walls through corridor intersections.
    o+=path('M230 550H550V460H530V390H550V300H630V550H935V500H1015V550H1270V300H1350V550H1370V630H1350V930H1270V830H1210V770H1270V630H490V720H410V630H230Z','wash');
    o+=text(800,172,'THIRD FLOOR','region-title')+text(800,209,'三楼 · 雕像、陈列廊与挂毯后的近路','third-subtitle');
    // Hatched, unnamed spaces are not extra invented rooms.
    o+=path('M670 675H810V925H670Z','ink hair','style="stroke-dasharray:3 8;opacity:.3"');
    for(const room of thirdPlan.rooms){const p=places.find(p=>p.id===room.id),[x,y,w,h]=room.rect,cx=x+w/2;
      bounds.push({id:p.id,x:cx,y:y+h/2,w,h});
      const outline=p.id==='witch'?path(`M${x} ${y+h}V${y+40}Q${x} ${y} ${x+40} ${y}H${x+w-40}Q${x+w} ${y} ${x+w} ${y+40}V${y+h}Z`,'map-room',`data-room="${p.id}"`):rect(x,y,w,h,'map-room',`data-room="${p.id}"`);
      o+=`<g class="landmark" tabindex="0" role="button" data-place="${p.id}" aria-label="${p.name}，查看档案">${outline}${rect(x+9,y+9,w-18,h-18,'ink hair')}${furniture(p,x,y,w,h)}${text(cx,y+h-26,p.name,'room-label')}${text(cx,y+h-9,p.en,'room-en')}</g>`;
      const [ax,ay,bx,by]=room.door;
      o+=path(`M${ax} ${ay}L${bx} ${by}`,'door-opening')+path(ax===bx?`M${ax} ${ay}h-40q0 40 40 40`:`M${ax} ${ay}v-40q40 0 40 40`,'ink hair');
      for(let j=0;j<Math.floor(w/72)-1;j++)o+=rect(x+35+j*72,y-6,23,12,'wash');
    }
    o+=text(395,290,'走廊雕像 · 非独立教室','small-label')+text(445,928,'1991—92 年历史地点 · 当前不放置路威','small-label');
    o+=text(920,659,'PUBLIC CORRIDOR','small-label')+text(1390,801,'通行廊 · 导览重建','small-label','transform="rotate(-90 1390 801)"');
    for(let j=0;j<16;j++)for(const y of [553,623])o+=rect(260+j*68,y,5,4,'ink hair');
    // Illustrative stair links; these do not assert a canonical staircase location.
    for(const [sx,sy] of [[590,282],[1310,948]]){o+=circle(sx,sy,30,'wash');for(let j=0;j<6;j++)o+=line(sx-20+j*2,sy-12+j*5,sx+20-j*2,sy-12+j*5,'ink hair')}
    o+=`<g id="routes" class="routes">${path('M730 432H692V672H844V780H880','route','data-route="tapestry"')}${path('M395 330V255Q360 230 265 230H145','route','data-route="witch-honey"')}</g>`;
    o+=`<g class="passage-clue" role="button" tabindex="0" data-route-trigger="tapestry" aria-label="展开挂毯捷径，查看奖品陈列室与魔咒课走廊两端">${rect(651,648,180,88,'clue-hit')}${path('M727 415h9v37h-9m-5 -35v32m17 -32v32','ink hair')}${text(741,692,'挂毯捷径 ↗','clue-label')}</g>`;
    o+=text(205,213,'通往蜂蜜公爵地窖 ↗','clue-label')+text(800,1040,'连接关系有原著依据 · 翼廊、门位与路径曲折为导览重建','small-label floor-boundary-note');
    return {svg:o+'<g id="people"></g><g id="selectedOverlay"></g>',bounds,plan:thirdPlan};
  }
  function libraryInterior(x,y,w,h){let o='';
    const shelf=(sx,sy,sw)=>{let q=rect(sx,sy,sw,25,'shade');for(let j=8;j<sw-5;j+=9)q+=line(sx+j,sy+3,sx+j+(j%3),sy+22,'ink hair');return q};
    // The rope, books and permission rule are sourced; their drawn positions are not.
    o+=rect(x+22,y+22,w-44,154,'wash');
    for(let row=0;row<2;row++)for(let col=0;col<4;col++)o+=shelf(x+38+col*150,y+36+row*42,132);
    o+=text(x+w/2,y+146,'禁书区 · 教师书面许可','floor-feature-label');
    for(const sx of [x+27,x+w/2,x+w-27])o+=circle(sx,y+181,4)+line(sx,y+177,sx,y+194,'ink hair');
    o+=path(`M${x+27} ${y+181}q${w/4-14} 17 ${w/2-27} 0q${w/4-14} 17 ${w/2-27} 0`,'ink hair');
    for(let row=0;row<2;row++)for(let col=0;col<4;col++)o+=shelf(x+42+col*149,y+235+row*65,122);
    for(let col=0;col<3;col++){const sx=x+58+col*196,sy=y+405;o+=rect(sx,sy,146,57,'wash','rx="4"');for(const dy of [-12,63])for(const dx of [18,92])o+=rect(sx+dx,sy+dy,30,6,'ink hair');o+=path(`M${sx+48} ${sy+17}q12 -5 24 0q12 -5 24 0v22q-12 -5 -24 0q-12 -5 -24 0ZM${sx+72} ${sy+17}v22`,'ink hair')}
    o+=text(x+w/2,y+493,'阅览区 · 请勿带入食物','small-label');return o;
  }
  function fourthFloor(era){const earlier=era==='1976';let o=defs,bounds=[];
    o+=path('M220 275H940V250H1080V275H1405V590H1080V875H1435V995H205V880H220Z','shade');
    o+=path('M975 280H1055V450H1130V520H1055V900H1410V970H230V900H975V730H915V650H975Z','wash');
    o+=text(800,172,'FOURTH FLOOR','region-title')+text(800,209,'四楼 · 书页深处与镜后旧路','third-subtitle');
    for(const room of fourthPlan.rooms){const p=places.find(p=>p.id===room.id),[x,y,w,h]=room.rect,cx=x+w/2;
      bounds.push({id:p.id,x:cx,y:y+h/2,w,h});
      o+=`<g class="landmark" tabindex="0" role="button" data-place="${p.id}" aria-label="${p.name}，查看档案">${rect(x,y,w,h,'map-room',`data-room="${p.id}"`)}${rect(x+10,y+10,w-20,h-20,'ink hair')}`;
      if(p.id==='library')o+=libraryInterior(x,y,w,h);
      else{o+=rect(cx-43,y+25,86,128,'shade')+rect(cx-32,y+37,64,103,'wash')+path(`M${cx-24} ${y+117}l45 -65m-34 72l35 -50`,'ink hair')+path(`M${cx-53} ${y+24}q53 -32 106 0M${cx-38} ${y+156}v17m76 -17v17`,'ink hair');o+=text(cx,y+202,earlier?'较早年代 · 推定示意':'旧路已坍塌','floor-feature-label')}
      o+=text(cx,y+h-28,p.name,'room-label',p.id==='library'?'style="font-size:30px"':'')+text(cx,y+h-10,p.en,'room-en')+'</g>';
      const [ax,ay,bx,by]=room.door;o+=path(`M${ax} ${ay}L${bx} ${by}`,'door-opening')+path(`M${ax} ${ay}h-40q0 40 40 40`,'ink hair');
      if(p.id==='library')for(let j=0;j<8;j++)o+=rect(x+35+j*77,y-6,25,12,'wash');
    }
    o+=text(1110,1004,'PUBLIC GALLERY','small-label');
    for(let j=0;j<17;j++)for(const y of [903,963])o+=rect(260+j*66,y,5,4,'ink hair');
    o+=circle(1015,263,30,'wash');for(let j=0;j<6;j++)o+=line(995+j*2,250+j*5,1035-j*2,250+j*5,'ink hair');
    o+=`<g id="routes" class="routes">${path('M1255 332V245H1460',earlier?'route historic':'route blocked','data-route="mirror"')}`;
    if(!earlier){o+=`<g class="rubble" aria-hidden="true">`;for(const [x,y,r] of [[1322,242,12],[1336,254,10],[1311,256,9],[1338,235,8]])o+=path(`M${x-r} ${y}l${r*.6} ${-r} ${r} 2 ${r*.4} ${r} ${-r} ${r*.6}Z`,'shade');o+=path('M1311 226l32 35m-30 -1l29 -33','ink')+'</g>'}
    o+='</g>'+text(1460,224,'? 出口未详','small-label');
    o+=`<g class="passage-clue" tabindex="0" role="button" data-route-trigger="mirror" data-clue-x="1255" data-clue-y="616" aria-label="对照镜后旧密道的年代状态">${rect(1165,572,180,88,'clue-hit')}${text(1255,616,'对照年代 ↗','clue-label')}</g>`;
    o+=text(800,1040,'同层收录不表示相邻 · 书架、门位、距离与走廊为导览重建','small-label floor-boundary-note');
    return {svg:o+'<g id="people"></g><g id="selectedOverlay"></g>',bounds,plan:fourthPlan};
  }
  function fifthFloor(){let o=defs+'<g class="fifth-floor">',bounds=[];
    o+=path('M120 700H230V250H840V740H1360V280H1470V910H120Z','shade');
    for(const c of fifthPlan.corridors)o+=rect(...c,'ground-walk');
    o+=path('M140 720V890H1450V300M210 720V810H1380V300M210 890H1380','ink');
    const room=fifthPlan.rooms[0],[x,y,w,h]=room.rect;
    bounds.push({id:room.id,x:x+w/2,y:y+h/2,w,h});
    o+=`<g class="landmark" role="button" tabindex="0" data-place="prefect-bath" aria-label="级长浴室，查看档案">${rect(x,y,w,h,'map-room','data-room="prefect-bath" rx="7"')}${rect(x+12,y+12,w-24,h-24,'ink hair','rx="4"')}`;
    // Sparse engraved veins suggest marble without changing the newsprint palette.
    for(let j=0;j<5;j++)o+=path(`M${x+26+j*116} ${y+23}l-7 33 19 18 -9 26m-3 240l8 -24 -13 -17`,'ink hair','style="opacity:.22"');
    for(const sy of [375,505,635]){o+=rect(214,sy-25,18,50,'wash')+path(`M238 ${sy-35}q22 7 0 35q22 28 0 35m5 -67q9 26 0 32q9 21 0 32`,'ink hair')}
    o+=rect(265,380,490,275,'bath-rim')+rect(...fifthPlan.pool,'bath-water','data-prefect-pool="true"');
    o+=rect(292,407,436,221,'ink hair');
    // A reduced symbol field, not a claim to reproduce every canonical tap.
    const tap=(tx,ty,a)=>`<g transform="translate(${tx} ${ty}) rotate(${a})" data-bath-tap="true">${path('M-4 1v-6h8v6m-6 -9h4M0 -11v5M-3 -11h6','ink hair')}${circle(0,-11,1.5,'solid')}</g>`;
    for(let j=0;j<24;j++){o+=tap(294+j*18.7,390,0)+tap(294+j*18.7,645,180)}
    for(let j=0;j<12;j++){o+=tap(275,410+j*18.7,-90)+tap(745,410+j*18.7,90)}
    o+=rect(245,500,80,20,'wash','data-diving-board="true"')+line(251,505,318,505)+line(251,515,318,515);
    for(let j=0;j<4;j++)o+=rect(736+j*2,313-j*5,51-j*4,11,'wash',`data-bath-towel="${j}" rx="3"`);
    o+=text(515,700,'大浴池 · 魔法龙头群','floor-feature-label')+text(515,735,'级长浴室','room-label')+'</g>';
    // A modest, original line drawing of the framed mermaid; nobody is bathing.
    o+=`<g class="landmark mermaid-clue" role="button" tabindex="0" data-place="prefect-bath" aria-label="查看级长浴室的美人鱼画像线索" data-feature-hit="true" data-mermaid-portrait="true">${rect(445,278,140,105,'clue-hit')}${rect(460,285,110,90,'shade')}${rect(467,292,96,76,'wash')}${circle(493,310,7,'ink hair')}${path('M488 303q-12 8 -4 25m13 -25q12 8 3 23M488 319q12 -2 13 15l15 8q22 -7 31 10q-18 -6 -25 6q-14 2 -26 -18h-13l2 -15ZM480 347l17 -7 19 17 -34 3ZM493 334l-6 -10 -11 4','ink hair')}</g>`;
    // Four numbered door positions to the statue's left. No room behind 1–3 is named.
    let edge='M865 704';for(let j=0;j<28;j++)edge+=`l20 ${j%2?7:-7}`;o+=path(edge+'V760H865Z','shade');
    o+=text(1140,350,'从雕像左边数','floor-feature-label')+text(1140,402,'第四扇门 · 级长浴室','floor-feature-label');
    o+=text(1140,469,'其余门后不补画房间','floor-feature-label');
    for(const d of fifthPlan.doors){
      o+=`<g data-address-door="${d.number}">${path(`M${d.x-28} 760v-17h56v17`,'ink')}${text(d.x,725,String(d.number),'door-number')}</g>`;
      if(d.number!==4)o+=rect(d.x-25,752,50,18,'wash')+circle(d.x+15,760,2,'solid');
    }
    o+=path('M710 760H790','door-opening')+path('M710 760v-39q39 0 39 39','ink hair');
    o+=`<g class="landmark bath-entry" role="button" tabindex="0" data-place="prefect-bath" aria-label="查看雕像左边第四扇门的级长浴室入口" data-feature-hit="true" data-bath-entry="true">${rect(700,715,100,92,'clue-hit')}${text(750,795,'入口 ↗','clue-label')}</g>`;
    o+=`<g class="landmark boris-clue" role="button" tabindex="0" data-place="prefect-bath" aria-label="查看糊涂波里斯的入口线索" data-feature-hit="true" data-boris-statue="true">${rect(1395,690,180,125,'clue-hit')}${circle(1485,716,11,'shade')}${path('M1470 743q14 -17 30 0l15 43h-59ZM1474 739l-13 -9 10 -15m25 24l13 -9 -10 -15M1455 790h61v9h-61Z','ink')}${text(1485,665,'波里斯','floor-feature-label')}</g>`;
    for(let j=0;j<20;j++)for(const sy of [818,882])o+=rect(270+j*53,sy,4,4,'ink hair');
    o+=text(1120,923,'公共走廊 · 不进入浴室','floor-feature-label');
    o+=`<g class="landmark floor-index-link" role="button" tabindex="0" data-place="myrtle" data-index-x="515" data-index-y="1000" aria-label="翻阅桃金娘的关联故事档案">${rect(350,969,330,62,'clue-hit')}${text(515,1006,'关联故事 · 桃金娘 ↗','clue-label')}</g>`;
    o+=text(800,1070,'门位线索有依据 · 走廊、比例、陈设位置与龙头符号数量为缩略重建','small-label floor-boundary-note');
    return {svg:o+'</g><g id="routes" class="routes"></g><g id="people"></g><g id="selectedOverlay"></g>',bounds,plan:fifthPlan};
  }
  function seventhFloor(era){let o=defs+'<g class="seventh-floor">',bounds=[];
    o+=path('M185 255H690V450H805V250H925V590H1435V720H925V820H1145V940H805V570H690V775H185Z','shade');
    for(const c of seventhPlan.corridors)o+=rect(...c,'ground-walk');
    o+=path('M695 470H825V270H905V610H1415V700H905V840H1125V920H825V550H695','ink');
    o+=line(825,550,825,610)+line(905,700,905,840);
    const room=seventhPlan.rooms[0],[x,y,w,h]=room.rect,cx=x+w/2,cy=y+h/2;
    bounds.push({id:room.id,x:cx,y:cy,w,h});
    o+=`<g class="landmark" role="button" tabindex="0" data-place="gryffindor" aria-label="格兰芬多公共休息室，查看档案"><circle cx="${cx}" cy="${cy}" r="235" class="map-room" data-room="gryffindor"/>${circle(cx,cy,223,'ink hair')}`;
    for(const a of [205,235,265,295,325,145]){const angle=a*Math.PI/180,wx=cx+Math.cos(angle)*228,wy=cy+Math.sin(angle)*228;o+=`<g transform="translate(${wx} ${wy}) rotate(${a+90})">${rect(-19,-6,38,12,'wash')}${line(-12,0,12,0)}</g>`}
    // A circular sitting room; no invented dormitory rooms behind the spiral.
    o+=rect(cx-72,y+34,144,34,'shade','data-gryffindor-hearth="true"')+rect(cx-58,y+44,116,30,'ink hair');
    for(let j=0;j<5;j++)o+=path(`M${cx-40+j*20} ${y+66}q-8 -9 0 -17q8 8 0 17`,'ink hair');
    o+=circle(cx,cy-18,104,'ink hair')+circle(cx,cy-18,97,'ink hair')+circle(cx,cy-18,43,'wash');
    o+=path(`M${cx-22} ${cy-29}q11 -5 22 0q11 -5 22 0v26q-11 -5 -22 0q-11 -5 -22 0ZM${cx} ${cy-29}v26`,'ink hair');
    for(const [sx,sy,a] of [[cx-151,cy-60,90],[cx+107,cy-60,-90],[cx-75,cy+75,0],[cx+25,cy+75,0]]){
      o+=`<g transform="translate(${sx} ${sy}) rotate(${a} 25 17)" data-gryffindor-chair="true">${rect(0,0,50,34,'wash','rx="7"')}${rect(5,6,40,22,'ink hair','rx="4"')}${line(5,34,5,41)}${line(45,34,45,41)}</g>`;
    }
    o+=circle(305,625,40,'wash')+circle(305,625,10,'ink hair');
    for(let j=0;j<11;j++){const a=j*Math.PI/6;o+=line(305+Math.cos(a)*11,625+Math.sin(a)*11,305+Math.cos(a)*36,625+Math.sin(a)*36,'ink hair')}
    o+=text(445,640,'寝室旋梯','floor-feature-label')+text(cx,697,'格兰芬多公共休息室','room-label')+text(cx,719,'GRYFFINDOR TOWER','room-en')+'</g>';
    // A password portrait, not an open gate for every illustrative patrol.
    o+=path('M665 470V550','door-opening');
    o+=`<g class="landmark portrait-clue" role="button" tabindex="0" data-place="gryffindor" aria-label="查看胖夫人肖像入口" data-fat-lady-portrait="true" data-feature-hit="true">${rect(635,445,70,126,'clue-hit')}${rect(...seventhPlan.portrait,'shade')}${rect(651,464,38,88,'wash')}${circle(670,488,9,'ink hair')}${path('M655 537q-1 -28 15 -32q16 4 15 32ZM660 478q10 -10 20 0M656 542h28','ink hair')}</g>`;
    o+=text(735,430,'肖像入口','floor-feature-label');
    // The tapestry is opposite the blank wall, not a secret passage itself.
    o+=`<g class="landmark tapestry-clue" role="button" tabindex="0" data-place="requirement" aria-label="查看疯子巴拿巴挂毯线索" data-barnabas-tapestry="true" data-feature-hit="true">${rect(1045,500,300,95,'clue-hit')}${rect(...seventhPlan.tapestry,'wash')}${rect(1067,522,256,51,'ink hair')}`;
    for(let j=0;j<3;j++){const tx=1100+j*82;o+=circle(tx,534,7,'ink hair')+path(`M${tx-9} 546q9 -7 18 0l-4 13h-10ZM${tx-8} 542l-14 -11m32 11l14 -11M${tx-3} 559l-12 11m18 -11l12 11`,'ink hair')}
    o+=line(1070,511,1320,511)+text(1195,485,'疯子巴拿巴挂毯','floor-feature-label')+'</g>';
    for(let j=0;j<15;j++)o+=rect(930+j*31,618,4,4,'ink hair')+rect(930+j*31,687,4,4,'ink hair');
    const note=seventhPlan.notes[0];bounds.push({id:note.id,x:1200,y:790,w:400,h:160});
    o+=`<g class="landmark blind-note floor-index-link" role="button" tabindex="0" data-place="requirement" data-index-x="1200" data-index-y="814" aria-label="查看有求必应屋盲区札记" data-blind-note="true">${rect(...seventhPlan.blankWall,'blind-wall','data-blank-wall="true"')}${line(1000,710,1400,710)}${rect(1000,774,400,80,'clue-hit')}${text(1200,792,'?','blind-question')}${text(1200,832,'有求必应屋 ↗','clue-label')}</g>`;
    o+=text(1200,890,'图外札记 · 原图盲区','floor-feature-label')+text(1200,940,'屋内不测绘、不追踪','floor-feature-label');
    o+=text(765,775,'七楼公共走廊','small-label','transform="rotate(-90 765 775)"');
    o+=circle(865,295,22,'ink hair');for(let j=0;j<6;j++)o+=line(851+j,285+j*4,879-j,285+j*4,'ink hair');
    o+=circle(1085,880,28,'ink hair');for(let j=0;j<6;j++)o+=line(1067+j,870+j*4,1103-j,870+j*4,'ink hair');
    o+=`<g class="landmark floor-index-link" role="button" tabindex="0" data-place="boys-bathroom" data-index-x="435" data-index-y="945" aria-label="翻到六楼男生盥洗室档案">${rect(270,914,330,62,'clue-hit')}${text(435,951,'下一层 · 六楼盥洗室 ↗','clue-label')}</g>`;
    o+='</g><g id="routes" class="routes">';
    if(era==='1998')o+=path('M1400 790H1480V400H1415','route supplement','data-route="ariana" data-ariana-note="true"')+`<g class="passage-clue" role="button" tabindex="0" data-route-trigger="ariana" data-clue-x="1200" data-clue-y="350" aria-label="查看1998年阿利安娜通道附注">${rect(1070,306,260,88,'clue-hit')}${text(1200,356,'1998 · 通道附注 ↗','clue-label')}</g>`;
    o+='</g>'+text(800,1030,'挂毯与墙面相对有依据 · 翼廊、距离、家具位置为导览重建','small-label floor-boundary-note');
    return {svg:o+'<g id="people"></g><g id="selectedOverlay"></g>',bounds,plan:seventhPlan};
  }
  // Short sections traced against visible paths in our own grounds illustration.
  // Do not extrapolate paths behind perspective buildings, into the lake or village.
  const groundsPatrols=[
    [[1115,291],[1095,303],[1107,317],[1142,327],[1170,334]],
    [[826,688],[815,710],[804,738],[809,759],[830,777],[866,792],[906,816]]
  ];
  function floor(f,era){if(f==='dungeon')return dungeonFloor();if(f==='ground')return groundFloor();if(f==='third')return thirdFloor();if(f==='fourth')return fourthFloor(era);if(f==='fifth')return fifthFloor();if(f==='seventh')return seventhFloor(era);let o=defs;const rooms=places.filter(p=>p.floor===f);let bounds=[];
    o+=path('M185 214H1415V952H185ZM207 235H1392V930H207Z','shade','fill-rule="evenodd"');
    for(const c of floorPlan.corridors)o+=rect(...c,'wash');
    for(const [x,y] of [[205,242],[1395,242],[205,930],[1395,930]]){o+=circle(x,y,71,'shade')+circle(x,y,55,'ink');for(let i=0;i<18;i++){let a=i*Math.PI/9;o+=line(x+Math.cos(a)*20,y+Math.sin(a)*20,x+Math.cos(a)*53,y+Math.sin(a)*53,'ink hair')}o+=circle(x,y,19)}
    o+=text(800,172,ATLAS.floors.find(x=>x[0]===f)[2],'region-title')+text(800,1040,'房间与通行关系为导览重建 · 空白房间不附会名称','small-label floor-boundary-note');
    const cells=floorPlan.cells;
    for(let i=0;i<cells.length;i++){const [x,y,w,h]=cells[i],p=rooms[i];if(!p){o+=rect(x,y,w,h,'shade')+rect(x+11,y+11,w-22,h-22,'ink hair');o+=path(`M${x+21} ${y+22}h${w-42}v${h-44}H${x+21}Z`,'ink hair','style="stroke-dasharray:3 9;opacity:.25"');continue}
      const cx=x+w/2,cy=y+h/2; bounds.push({id:p.id,x:cx,y:cy,w,h});o+=`<g class="landmark" tabindex="0" role="button" data-place="${p.id}" aria-label="${p.name}，查看档案">${rect(x,y,w,h,'map-room',`data-room="${p.id}"`)}${rect(x+8,y+8,w-16,h-16,'ink hair')}${furniture(p,x,y,w,h)}${text(cx,y+h-26,p.name,'room-label')}${text(cx,y+h-9,p.en,'room-en')}${p.blind?text(cx,y+24,'此处为图外附注 · 不显示屋内人物','room-tag'):''}</g>`;
      const doorX=x+w/2;if(y<550){o+=path(`M${doorX-18} ${y+h}v50m36 -50v50M${doorX-18} ${y+h+40}q36 0 36 -36`,'ink hair')}else o+=path(`M${doorX-18} 646v54m36 -54v54M${doorX-18} 664q36 0 36 36`,'ink hair');
      for(let j=0;j<5;j++)o+=rect(x+35+j*73,y-6,25,12,'wash');
    }
    for(let i=0;i<16;i++)for(const y of [591,639])o+=rect(330+i*63,y,5,4,'ink hair');o+=text(1140,680,'CORRIDOR','small-label')+text(735,871,'旋转楼梯','small-label','transform="rotate(-90 735 871)"');
    o+=`<g transform="translate(800 614)">${circle(0,0,36)}${path('M-24 -5h48m-45 7h42m-36 7h30m-25 7h20','ink hair')}</g>`;
    o+=`<g id="routes" class="routes">`;
    o+=`</g><g id="people"></g><g id="selectedOverlay"></g>`;return {svg:o,bounds,plan:floorPlan};
  }
  function illustratedWorld(era){let o=defs+'<image href="assets/world-engraving.png" x="0" y="0" width="2400" height="1500" preserveAspectRatio="none"/>';
    o+=`<g transform="translate(1700 1340) scale(.44)">${station()}</g>`;
    o+=`<g id="routes" class="routes">${path('M1260 724C1180 620 1070 545 963 526S734 459 575 426','route','data-route="witch-honey"')}${path('M1550 350Q1428 190 740 190','route','data-route="willow-shack"')}${era==='1998'?path('M1270 701Q1150 462 690 402','route supplement','data-route="ariana"'):''}</g>`;
    for(const p of places.filter(p=>p.view==='world')){let [x,y]=p.xy;let ly=45,w=215;if(p.id==='hogwarts'){ly=90;w=270}if(p.id==='forest'){x=2100;y=595;ly=40}if(p.id==='lake'){x=1450;y=1120;ly=50;w=220}o+=`<g class="landmark" tabindex="0" role="button" aria-label="${p.name}，查看档案" data-place="${p.id}" transform="translate(${x} ${y})"><ellipse cx="0" cy="-30" rx="130" ry="100" class="marker-halo"/><rect x="-120" y="-120" width="240" height="180" fill="transparent"/>${ribbon(0,ly,p.name,p.en,w)}</g>`}
    return o+compass(215,920,.7)+'<g id="people"></g><g id="selectedOverlay"></g>';
  }
  function illustratedVillage(era){let o=defs+'<image href="assets/village-engraving.png" x="0" y="0" width="1800" height="1350" preserveAspectRatio="none"/>';
    o+=`<g id="routes" class="routes">${path('M1205 760q135 163 68 349q-15 86 -30 181','route','data-route="witch-honey"')}${path('M350 185Q220 151 70 308','route','data-route="willow-shack"')}${era==='1998'?path('M480 965Q183 979 26 1100','route supplement','data-route="ariana"'):''}</g>`;
    for(const p of places.filter(p=>p.view==='village')){if(p.id==='high-street')continue;const [x,y]=p.xy;const w=p.name.length>7?240:210;o+=`<g class="landmark" tabindex="0" role="button" aria-label="${p.name}，查看档案" data-place="${p.id}" transform="translate(${x} ${y})"><ellipse cx="0" cy="-25" rx="120" ry="90" class="marker-halo"/><rect x="-110" y="-105" width="220" height="155" fill="transparent"/>${ribbon(0,p.id==='cave'?32:52,p.name,p.en,w)}</g>`}
    o+=`<g class="landmark" data-place="high-street" role="button" tabindex="0" aria-label="主街，查看档案">${text(1000,780,'HIGH STREET','calligraphy','transform="rotate(-39 1000 780)"')}</g>`;
    return o+'<g id="selectedOverlay"></g>';
  }
  return {world,village,illustratedWorld,illustratedVillage,floor,prop,castle,defs,ribbon,seed,floorPlan,planFor,groundsPatrols};
})();
