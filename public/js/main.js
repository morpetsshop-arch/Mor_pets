const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// mueve el carrusel; al pasar de la última vuelve a la primera
const go = (track, dir) => {
  const w = track.clientWidth, n = track.children.length;
  const i = Math.round(track.scrollLeft / w);
  track.scrollTo({ left: ((i + dir + n) % n) * w, behavior: 'smooth' });
};

document.querySelectorAll('[data-carousel]').forEach((c, k) => {
  const track = c.querySelector('.track');
  c.querySelector('.prev')?.addEventListener('click', () => go(track, -1));
  c.querySelector('.next')?.addEventListener('click', () => go(track, 1));

  // en el carrito: empezar en el aroma elegido
  if (c.dataset.start) {
    const i = [...track.children].findIndex((s) => s.dataset.aroma === c.dataset.start);
    if (i > 0) track.scrollLeft = i * track.clientWidth;
  }

  // movimiento automático (solo tarjetas y detalle)
  if (c.hasAttribute('data-auto') && !reduce) {
    let paused = false;
    ['mouseenter', 'focusin', 'touchstart'].forEach((e) => c.addEventListener(e, () => (paused = true)));
    ['mouseleave', 'focusout'].forEach((e) => c.addEventListener(e, () => (paused = false)));
    c.addEventListener('touchend', () => setTimeout(() => (paused = false), 4000));
    setTimeout(() => setInterval(() => { if (!paused && !document.hidden) go(track, 1); }, 3500), k * 700);
  }

  // en el carrito: al deslizar, actualiza la lista de aromas
  const select = c.closest('[data-line]')?.querySelector('[data-aroma-select]');
  if (select) track.addEventListener('scrollend', () => {
    const s = track.children[Math.round(track.scrollLeft / track.clientWidth)];
    if (s) select.value = s.dataset.aroma;
  });
});

// en el carrito: al cambiar la lista, el carrusel salta a esa foto
document.querySelectorAll('[data-aroma-select]').forEach((sel) => {
  sel.addEventListener('change', () => {
    const track = sel.closest('[data-line]').querySelector('.track');
    const i = [...track.children].findIndex((s) => s.dataset.aroma === sel.value);
    if (i >= 0) track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
  });
});