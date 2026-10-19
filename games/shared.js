// Best scores live in this browser only; the library page reads the same keys.
const Best = {
  get(id) { try { return Number(localStorage.getItem('best:' + id)) || 0; } catch { return 0; } },
  // lowIsBetter: for times and move counts.
  save(id, value, lowIsBetter) {
    const old = Best.get(id);
    if (old && (lowIsBetter ? value >= old : value <= old)) return false;
    try { localStorage.setItem('best:' + id, value); } catch {}
    return true;
  },
  // For games that count wins instead of a score.
  addWin(id) { try { localStorage.setItem('best:' + id, Best.get(id) + 1); } catch {} },
};

// Calls fn('up' | 'down' | 'left' | 'right') on arrow keys, WASD and swipes over el.
function onDirection(el, fn) {
  const keys = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
  addEventListener('keydown', e => {
    const d = keys[e.key.length === 1 ? e.key.toLowerCase() : e.key];
    if (d) { e.preventDefault(); fn(d); }
  });
  let sx, sy;
  el.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  el.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
  el.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    fn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  });
}
