(function () {
  var hdr = document.querySelector('.site-header');
  var btn = document.querySelector('.burger');
  var nav = document.getElementById('main-nav');
  function onScroll() { if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus();
      }
    });
  }
})();

/* Язык, выбранный вручную, запоминается и отключает автовыбор */
(function () {
  document.querySelectorAll('.lang a[data-lang]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('rotodyn-lang', a.getAttribute('data-lang')); } catch (e) {}
    });
  });
})();

/* Плашка cookie: выбор хранится 12 месяцев; необязательные инструменты запускаются только после согласия */
(function () {
  var KEY = 'rotodyn-consent', VER = 1, TTL = 365 * 24 * 3600 * 1000;
  var box = document.getElementById('cookie');
  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (c && c.v === VER && Date.now() - c.ts < TTL) return c;
    } catch (e) {}
    return null;
  }
  function optional() {
    /* Здесь подключаются аналитические сервисы, если они появятся. Сейчас их нет. */
  }
  function show() { if (box) { box.hidden = false; requestAnimationFrame(function () { box.classList.add('on'); }); } }
  function hide() { if (box) { box.classList.remove('on'); box.hidden = true; } }
  function save(all) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: VER, ts: Date.now(), analytics: !!all })); } catch (e) {}
    hide();
    if (all) optional();
  }
  var c = read();
  if (!c) show(); else if (c.analytics) optional();
  if (box) {
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]');
      if (b) save(b.getAttribute('data-consent') === 'all');
    });
  }
  document.querySelectorAll('[data-cookie-settings]').forEach(function (b) {
    b.addEventListener('click', show);
  });
})();

/* При системной настройке «уменьшить движение» останавливаем и SVG-анимацию */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('svg.tech-anim, svg.bg-anim').forEach(function (s) {
      if (s.pauseAnimations) s.pauseAnimations();
    });
  }
})();
