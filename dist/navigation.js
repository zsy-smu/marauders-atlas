// Page-local reading history. No storage, URL changes, network or animation state.
window.MAPNAV = (() => {
  const copy = value => JSON.parse(JSON.stringify(value));
  function createTrail(limit = 20) {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new RangeError('Invalid trail limit');
    const entries = [];
    return {
      push(entry) {
        const saved = copy(entry);
        if (entries.length && JSON.stringify(entries[entries.length - 1]) === JSON.stringify(saved)) return false;
        entries.push(saved);
        if (entries.length > limit) entries.shift();
        return true;
      },
      pop() { return entries.length ? copy(entries.pop()) : null; },
      peek() { return entries.length ? copy(entries[entries.length - 1]) : null; },
      get size() { return entries.length; }
    };
  }
  function restoreCamera(saved, width, height, fitWidth) {
    if (!saved || ![saved.x,saved.y,saved.w,saved.h,saved.fitWidth,width,height,fitWidth].every(Number.isFinite) ||
      saved.w <= 0 || saved.h <= 0 || saved.fitWidth <= 0 || width <= 0 || height <= 0 || fitWidth <= 0) return null;
    if (saved.width === width && saved.height === height) return { x:saved.x, y:saved.y, w:saved.w, h:saved.h };
    const w = fitWidth / (saved.fitWidth / saved.w), h = w * height / width;
    return { x:saved.x + saved.w/2 - w/2, y:saved.y + saved.h/2 - h/2, w, h };
  }
  return { createTrail, restoreCamera };
})();
