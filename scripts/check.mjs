import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
for (const file of ['data.js', 'art.js', 'reading.js', 'app.js']) {
  execFileSync(process.execPath, ['--check', resolve(dist, file)], { stdio: 'pipe' });
}
const context = { window: {} };
vm.runInNewContext(readFileSync(resolve(dist, 'data.js'), 'utf8'), context);
context.ATLAS = context.window.ATLAS;
vm.runInNewContext(readFileSync(resolve(dist, 'art.js'), 'utf8'), context);
const { places, floors, state } = context.ATLAS;
const art = context.window.MAPART;
assert.equal(new Set(places.map(p => p.id)).size, places.length, 'Place IDs must be unique');
for (const p of places) {
  assert(['world', 'castle', 'village'].includes(p.view), `Unknown view: ${p.id}`);
  assert(p.source.startsWith('https://') && p.book, `Missing source: ${p.id}`);
  assert(p.xy.length === 2 && p.xy.every(Number.isFinite), `Invalid coordinates: ${p.id}`);
  if (p.floor) assert(floors.some(f => f[0] === p.floor), `Unknown floor: ${p.id}`);
}
for (const [floor] of floors) {
  const expected = places.filter(p => p.floor === floor);
  assert(expected.length > 0, `Empty floor: ${floor}`);
  for (const era of ['1976', '1993', '1998']) {
    const result = art.floor(floor, era);
    assert.equal(result.bounds.length, expected.length, `Unmapped rooms: ${floor}/${era}`);
    for (const p of expected) assert(result.svg.includes(`data-place="${p.id}"`));
  }
}
for (const [view, draw] of [['world', art.illustratedWorld], ['village', art.illustratedVillage]]) {
  const svg = draw('1993');
  for (const p of places.filter(p => p.view === view)) assert(svg.includes(`data-place="${p.id}"`), `Unmapped landmark: ${p.id}`);
  assert(!svg.includes('data-route="ariana"'), `Ariana route leaked into 1993 ${view}`);
  assert(draw('1998').includes('data-route="ariana"'), `Missing 1998 route: ${view}`);
}
assert(state(places.find(p => p.id === 'mirror'), '1993').includes('坍塌'));
const sources = readdirSync(dist).filter(f => /\.(?:html|js|css)$/.test(f));
for (const file of sources) {
  const content = readFileSync(resolve(dist, file), 'utf8');
  const paths = [...content.matchAll(/(?:src|href)=["']([^"']+)["']/g), ...content.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)];
  for (const match of paths) {
    const path = match[1];
    if (path.includes('${') || /^(?:#|https?:|data:)/.test(path)) continue;
    assert(existsSync(resolve(dist, path.split(/[?#]/)[0])), `Missing asset in ${file}: ${path}`);
  }
}
assert(!existsSync(resolve(root, '.openai')) && !existsSync(resolve(dist, '.openai')), 'Private hosting metadata must not ship');
console.log(`OK: 4 scripts; ${places.length} unique records; ${floors.length} floor groups; 3 eras; all static references resolve.`);
