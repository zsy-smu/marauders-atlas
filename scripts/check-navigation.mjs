import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../dist/navigation.js',import.meta.url),'utf8');
const context={window:{}};
vm.runInNewContext(source,context);
const {createTrail,restoreCamera}=context.window.MAPNAV;
const trail=createTrail(3),entry={location:{view:'castle',floor:'fifth',era:'1993'},camera:{x:10,y:20,w:600,h:400}};
assert.equal(trail.pop(),null);assert.equal(trail.peek(),null);
assert(trail.push(entry));entry.location.floor='second';
assert.equal(trail.peek().location.floor,'fifth','Snapshots do not alias live navigation state');
const peek=trail.peek();peek.location.era='1998';
assert.equal(trail.peek().location.era,'1993','Peek must not mutate the trail');
assert(!trail.push(trail.peek()),'Suppress consecutive exact duplicates');
assert.equal(trail.size,1);
for(const id of ['a','b','c'])trail.push({id});
assert.equal(trail.size,3);
for(const id of ['c','b','a'])assert.equal(trail.pop().id,id);
assert.equal(trail.pop(),null,'Oldest entry is evicted at the limit');
const bounded=createTrail();for(let id=0;id<1000;id++)bounded.push({id});
assert.equal(bounded.size,20);
for(let id=999;id>=980;id--)assert.equal(bounded.pop().id,id);
assert.equal(bounded.size,0);
for(const limit of [0,-1,1.5,101,NaN])assert.throws(()=>createTrail(limit),/Invalid trail limit/);

const camera={x:110,y:220,w:900,h:600,width:600,height:400,fitWidth:1800};
assert.deepEqual({...restoreCamera(camera,600,400,1800)},{x:110,y:220,w:900,h:600},'Same canvas restores the exact viewBox');
for(const [width,height,fitWidth] of [[274,191,1600],[344,377,1600],[944,355,2925],[600,210,3143]]){
  const box=restoreCamera(camera,width,height,fitWidth);
  assert(Math.abs(box.x+box.w/2-560)<1e-9);
  assert(Math.abs(box.y+box.h/2-520)<1e-9);
  assert(Math.abs(box.w/box.h-width/height)<1e-9,'Responsive restoration never stretches the drawing');
  assert(Math.abs(fitWidth/box.w-2)<1e-9,'Responsive restoration preserves normalized zoom');
}
for(const bad of [null,{...camera,w:0},{...camera,x:NaN},{...camera,fitWidth:0}])assert.equal(restoreCamera(bad,600,400,1800),null);
assert.equal(restoreCamera(camera,0,400,1800),null);
assert(!/localStorage|sessionStorage|pushState|fetch\s*\(/.test(source),'History stays page-local');
const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
assert(html.includes('navigation.js?')&&html.indexOf('navigation.js?')<html.indexOf('app.js?'));
const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
assert(app.includes('navigationVersion++')&&app.includes('version===navigationVersion'),'Guard stale deferred navigation');
assert(app.includes('selectPlace(id,true)'),'Capture linked navigation before clearing search');
console.log('OK: detached snapshots; duplicate suppression; 20-entry eviction over 1000 visits; LIFO return; exact/responsive camera restoration; stale-focus guard; no persistent storage.');
