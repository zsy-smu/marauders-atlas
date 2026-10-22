import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const context = { window: {} };
vm.runInNewContext(readFileSync(new URL('../dist/data.js', import.meta.url), 'utf8'), context);
context.ATLAS = context.window.ATLAS;
vm.runInNewContext(readFileSync(new URL('../dist/art.js', import.meta.url), 'utf8'), context);
const art = context.window.MAPART;
const inRect = (x, y, [rx, ry, w, h]) => x >= rx && x <= rx + w && y >= ry && y <= ry + h;
let samples = 0;
for (const [floor] of context.ATLAS.floors) for (const era of ['1976', '1993', '1998']) {
  const { svg, plan } = art.floor(floor, era);
  assert(plan, `Missing shared drawing/patrol geometry: ${floor}`);
  assert.equal(plan, art.planFor(floor), 'Drawing and animation must select the same floor plan');
  for (const route of plan.patrols) for (let i = 1; i < route.length; i++) {
    const [ax, ay] = route[i - 1], [bx, by] = route[i];
    assert(ax === bx || ay === by, 'Floor patrols turn at corridor intersections, not diagonal shortcuts');
    const length = Math.hypot(bx - ax, by - ay);
    for (let d = 0; d <= Math.ceil(length); d++) {
      const t = Math.min(1, d / length), x = ax + (bx - ax) * t, y = ay + (by - ay) * t;
      // Conservative 9.5-unit envelope contains either shoe + lateral step offset.
      for (const dx of [-9.5, 0, 9.5]) for (const dy of [-9.5, 0, 9.5]) {
        assert(plan.corridors.some(r => inRect(x + dx, y + dy, r)), `Footprint outside corridor: ${floor}/${era}/${x}/${y}`);
        assert(!plan.cells.some(r => inRect(x + dx, y + dy, r)), `Patrol enters a room: ${floor}/${era}`);
      }
      samples++;
    }
  }
  if (floor === 'fourth') assert(svg.includes('M1085 300'), 'Mirror route must start in the mirror cell, not the library');
  if (floor === 'third') {
    assert.notEqual(plan, art.floorPlan, 'Third floor must not fall back to the shared guide grid');
    assert.equal(plan.rooms.length, 4);
    for (const room of plan.rooms) {
      assert(context.ATLAS.places.some(p => p.id === room.id && p.floor === floor));
      const { bounds } = art.floor(floor, era);
      const b = bounds.find(b => b.id === room.id), [x, y, w, h] = room.rect;
      assert.equal(b.x, x + w / 2); assert.equal(b.y, y + h / 2);
      assert.equal(b.w, w); assert.equal(b.h, h);
    }
    assert(svg.includes('data-route-trigger="tapestry"'));
    assert(svg.includes('M730 432H692V672H844V780H880'), 'Tapestry links the actual new trophy and charms boundaries');
    assert(svg.includes('M395 330'), 'The outbound passage begins at the actual statue niche');
    assert(svg.includes('1991—92 年历史地点 · 当前不放置路威'), 'Keep the guard as a historical note, not a current character');
  }
  if (floor === 'seventh') assert.equal(svg.includes('data-route="ariana"'), era === '1998');
}
assert.equal(art.groundsPatrols.length, 2);
for (const route of art.groundsPatrols) {
  assert(route.length >= 3);
  for (const [x, y] of route) assert(x >= 0 && x <= 2400 && y >= 0 && y <= 1500);
}
assert(!art.illustratedVillage('1993').includes('id="people"'), 'Village remains outside person tracking');
for (const c of context.ATLAS.connections) {
  assert.equal(c.ends.length, 2);
  assert.notEqual(c.ends[0], c.ends[1]);
  for (const id of c.ends) assert(context.ATLAS.places.some(p => p.id === id), `Dangling connection: ${c.id}/${id}`);
}
const app = readFileSync(new URL('../dist/app.js', import.meta.url), 'utf8');
assert(app.includes('currentFloorPlan=r.plan'), 'Retain the plan used by the rendered floor');
assert(app.includes(':currentFloorPlan.patrols'), 'Animate on that floor, not the default shared grid');
console.log(`OK: ${samples} floor-route samples across 10 floors × 3 eras, including both-shoe clearance; independent third-floor geometry, connection endpoints and matching patrol selection; village tracking excluded. Grounds traces require visual review, not blueprint proof.`);
