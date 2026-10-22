import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const context = { window: {} };
vm.runInNewContext(readFileSync(new URL('../dist/reading.js', import.meta.url), 'utf8'), context);
const { fitFloor, nameStyle } = context.window.MAPREAD;
let checks = 0;
for (const [width, height] of [[274,191], [344,395], [754,227], [944,355], [1500,670]]) {
  for (const bounds of [{ x:145, y:213, width:1245, height:777 }, { x:210, y:250, width:1215, height:829 }, { x:130, y:134, width:1336, height:867 }]) {
    const fitWidth = Math.max(1600, 1100 * width / height);
    for (const footer of [false, true]) {
      const box = fitFloor(bounds, width, height, fitWidth, footer), unit = width / box.w;
      assert(Object.values(box).every(Number.isFinite));
      assert(Math.abs(box.w / box.h - width / height) < 1e-9, 'No stretching');
      assert(bounds.x >= box.x && bounds.x + bounds.width <= box.x + box.w, 'No cropped floor sides');
      assert(bounds.y >= box.y && bounds.y + bounds.height <= box.y + box.h, 'No cropped floor top/bottom');
      if (footer) assert((box.y + box.h - bounds.y - bounds.height) * unit >= 21.99, '44px footer hit area has room below');
      assert(Math.abs(nameStyle(unit).scale * unit * 13 - 12) < 1e-9, 'Name text stays 12 CSS pixels');
      checks++;
    }
  }
}
assert(nameStyle(.4).compact && !nameStyle(1).compact);
// Run the actual name-ribbon updater with a tiny SVG stand-in, not a copied implementation.
const app = readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8');
const parts = Object.fromEntries(['text','.scroll-tail','.name-scroll','.scroll-crease'].map(key=>[key,{textContent:'', attrs:{},setAttribute(k,v){this.attrs[k]=v}}]));
const names = { shortNames: { 'Harry Potter': '哈利' } };
vm.runInNewContext(app.slice(app.indexOf('  function setPersonName('),app.indexOf('  function createPeople(')), names);
const person = { name:'Harry Potter', fullName:'哈利·波特', compact:null, label:{querySelector: s=>parts[s]} };
names.setPersonName(person, true);
const shortWidth = person.width;
assert.equal(parts.text.textContent, '哈利');
names.setPersonName(person, false);
assert.equal(parts.text.textContent, '哈利·波特');
assert(person.width > shortWidth);
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
assert(html.indexOf('reading.js?') < html.indexOf('app.js?'), 'Load presentation geometry before app');
console.log(`OK: ${checks} aspect-ratio/fit/44px-footer/name-size checks; real compact/full ribbon update.`);
