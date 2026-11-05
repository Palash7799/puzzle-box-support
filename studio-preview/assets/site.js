// Unrealistic Studio site: scroll reveals, lazy gameplay clips, phone tilt, sticky-nav state.
(() => {
  const $ = (s, r = document) => [...r.querySelectorAll(s)];
  document.getElementById('y').textContent = new Date().getFullYear();

  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('solid', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Fade-in on scroll.
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
  $('.reveal').forEach((el) => io.observe(el));

  // Gameplay clips: load when near the screen, play only while visible.
  const vio = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) {
      if (!v.src && v.dataset.src) v.src = v.dataset.src;
      v.play().catch(() => {});
    } else v.pause();
  }), { rootMargin: '200px', threshold: 0.2 });
  $('video[data-src]').forEach((v) => vio.observe(v));

  // Phone tilt toward the pointer (desktop only).
  if (matchMedia('(hover:hover) and (pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $('[data-tilt]').forEach((p) => {
      const col = p.parentElement;
      col.addEventListener('pointermove', (ev) => {
        const r = col.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - 0.5;
        const y = (ev.clientY - r.top) / r.height - 0.5;
        p.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 12}deg)`;
      });
      col.addEventListener('pointerleave', () => (p.style.transform = ''));
    });
    // Parallax for the floating hero icons.
    const fl = $('.float');
    addEventListener('pointermove', (ev) => {
      const x = ev.clientX / innerWidth - 0.5;
      const y = ev.clientY / innerHeight - 0.5;
      fl.forEach((f, i) => (f.style.marginLeft = `${x * (14 + i * 4)}px`, f.style.marginTop = `${y * (14 + i * 4)}px`));
    }, { passive: true });
  }
})();
