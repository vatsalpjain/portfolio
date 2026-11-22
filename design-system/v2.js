/* Portfolio design system v2.0 — scroll reveal + reading progress.
   Add class="reveal" to elements and <div class="progress" aria-hidden="true"></div> after <body>. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
})();
(function () {
  var bar = document.querySelector('.progress'); if (!bar) return;
  var ticking = false;
  function update() {
    var max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(scrollY / max, 1) : 0) + ')';
    ticking = false;
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
