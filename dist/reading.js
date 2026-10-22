// Presentation-only geometry. Does not change patrols, footsteps or canon data.
window.MAPREAD = (() => {
  function fitFloor(bounds, width, height, fitWidth, footer = false) {
    const side = 10, top = 10, bottom = footer ? 24 : 10;
    const ratio = width / Math.max(1, height);
    const w = Math.min(fitWidth, Math.max(fitWidth / 4.95,
      bounds.width * width / Math.max(1, width - side * 2),
      bounds.height * width / Math.max(1, height - top - bottom)));
    const unit = width / w, h = w / ratio;
    return { x: bounds.x + bounds.width / 2 - w / 2,
      y: bounds.y + bounds.height / 2 - h / 2 + (bottom - top) / (2 * unit), w, h };
  }
  function nameStyle(unit) {
    // Overview: a short, recognisable name. Detail: the existing full name.
    // Hysteresis is handled by the caller so wheel zoom does not flicker at the boundary.
    return { compact: unit < .72, scale: 12 / (13 * Math.max(.01, unit)) };
  }
  return { fitFloor, nameStyle };
})();
