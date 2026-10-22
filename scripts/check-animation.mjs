import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8');
const start = source.indexOf('  function pointOn(');
const end = source.indexOf('  function animate(', start);
assert(start > 0 && end > start, 'Animation functions must exist');
const element = () => ({
  attrs: {}, dataset: {}, style: {},
  setAttribute(key, value) { this.attrs[key] = String(value); },
  removeAttribute(key) { delete this.attrs[key]; },
});
const person = {
  route: [[0, 0], [100, 0], [100, 100]], lengths: [100, 100], total: 200,
  speed: 24, spacing: 14, offset: 0.22, scale: 1, width: 82, label: element(),
  stamps: Array.from({ length: 26 }, () => ({ el: element(), ink: element(), step: null, wear: null })),
};
const context = vm.createContext({ people: [person], labelObstacles: [], simTime: 20, footprintLife: 14, canvas: { clientWidth: 1000 }, box: { x: -500, y: -500, w: 2000, h: 2000 }, setPersonName() {} });
vm.runInContext(readFileSync(new URL('../dist/reading.js', import.meta.url), 'utf8').replace('window.MAPREAD', 'MAPREAD'), context);
vm.runInContext(source.slice(start, end), context);
const point = distance => context.pointOn(person, distance);
assert.equal(point(25).x, 25);
assert.equal(point(125).y, 25);
assert.equal(point(225).y, 75, 'The walker turns back instead of teleporting');
assert.equal(point(400).x, 0);
assert.equal(point(-25).x, 25, 'Negative distance remains well-defined');
assert.equal(point(199).y, point(201).y, 'The route is continuous at the turnaround');

context.updatePeople();
const snapshot = () => new Map(person.stamps.filter(s => !s.el.attrs.visibility).map(s => [s.step, s.el.attrs.transform]));
const before = snapshot();
context.simTime += 0.3;
context.updatePeople();
let shared = 0;
for (const [step, transform] of snapshot()) {
  if (before.has(step)) { shared++; assert.equal(transform, before.get(step), 'Planted footprints must not slide'); }
}
assert(shared > 10);
const paused = JSON.stringify(person);
context.updatePeople();
assert.equal(JSON.stringify(person), paused, 'No simulation-time change must freeze footprints and names');
assert(person.stamps.some(s => s.wear >= 3), 'Old ink must use erosion masks');
for (let t = 0; t < 600; t += 0.7) {
  context.simTime = t;
  context.updatePeople();
  assert.equal(person.stamps.length, 26, 'The footprint pool must stay bounded');
  assert(!JSON.stringify(person).includes('NaN'));
}
assert.equal((source.match(/id="footWear\$\{stage\}"/g) || []).length, 1);
console.log(`OK: continuous return paths; ${shared} planted impressions; frozen pause state; erosion stages; bounded pool over 600 simulated seconds.`);
