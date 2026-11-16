/* ==========================================================================
   pages/apropos.js — Frise chronologique, galerie + visionneuse, crédits
   ========================================================================== */
'use strict';

(() => {
  const { esc } = MAS.utils;

  /* ---------- Frise chronologique ---------- */
  const TIMELINE = [
    { year: 1914, icon: 'bi-flag-fill', title: 'Fondation à Bologne', text: 'Les frères Maserati ouvrent leur atelier, la « Società Anonima Officine Alfieri Maserati ».' },
    { year: 1926, icon: 'bi-trophy-fill', title: 'Tipo 26', text: 'Première voiture portant le trident, victorieuse dans sa catégorie à la Targa Florio.' },
    { year: 1957, icon: 'bi-award-fill', title: 'Champion du monde', text: 'Juan Manuel Fangio remporte le championnat du monde de Formule 1 au volant de la 250F.' },
    { year: 1963, icon: 'bi-car-front-fill', title: 'Quattroporte', text: 'Naissance de la première berline de luxe sportive à quatre portes.' },
    { year: 2020, icon: 'bi-rocket-takeoff-fill', title: 'MC20', text: 'La supercar à moteur V6 Nettuno ouvre une nouvelle ère pour la marque.' },
    { year: 2023, icon: 'bi-lightning-charge-fill', title: 'Folgore', text: 'La GranTurismo Folgore devient la première Maserati 100 % électrique.' }
  ];

  document.getElementById('timeline').innerHTML = TIMELINE.map((item, i) => `
    <li class="timeline-item ${i % 2 ? 'is-right' : 'is-left'} reveal">
      <div class="timeline-dot"><i class="bi ${esc(item.icon)}" aria-hidden="true"></i></div>
      <div class="timeline-card rounded-4 p-4">
        <span class="timeline-year fw-bold text-primary">${item.year}</span>
        <h3 class="fs-5 fw-bold text-uppercase mt-1">${esc(item.title)}</h3>
        <p class="small text-white-50 mb-0">${esc(item.text)}</p>
      </div>
    </li>`).join('');

  /* ---------- Galerie (toutes les photos du catalogue) ---------- */
  const photos = MAS.cars.flatMap((car) => car.images.map((src, i) => ({
    src,
    caption: `Maserati ${car.name}${car.images.length > 1 ? ` (${i + 1}/${car.images.length})` : ''}`
  })));

  const gallery = document.getElementById('gallery');
  gallery.innerHTML = photos.map((p, i) => `
    <div class="col-6 col-md-4 col-lg-3 reveal">
      <button type="button" class="gallery-item border-0 p-0 rounded-4 overflow-hidden w-100 position-relative" data-index="${i}" aria-label="Agrandir : ${esc(p.caption)}">
        <img src="${esc(p.src)}" alt="${esc(p.caption)}" class="w-100 h-100 object-fit-cover" loading="lazy" decoding="async">
        <span class="gallery-zoom position-absolute top-50 start-50 translate-middle"><i class="bi bi-arrows-fullscreen" aria-hidden="true"></i></span>
      </button>
    </div>`).join('');

  /* ---------- Visionneuse (flèches, clavier, glissement tactile) ---------- */
  const lightboxEl = document.getElementById('lightbox');
  const lightbox = bootstrap.Modal.getOrCreateInstance(lightboxEl);
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  let current = 0;

  const show = (index) => {
    current = (index + photos.length) % photos.length;
    img.src = photos[current].src;
    img.alt = photos[current].caption;
    caption.textContent = `${photos[current].caption} — ${current + 1} / ${photos.length}`;
  };

  gallery.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    show(Number(item.dataset.index));
    lightbox.show();
  });

  document.getElementById('lightboxPrev').addEventListener('click', () => show(current - 1));
  document.getElementById('lightboxNext').addEventListener('click', () => show(current + 1));

  lightboxEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  let touchStartX = null;
  lightboxEl.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightboxEl.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    touchStartX = null;
  });

  /* ---------- Crédits photos ---------- */
  document.getElementById('creditsTable').innerHTML = MAS.credits.map((c) => `
    <tr>
      <td><code>${esc(c.file)}</code></td>
      <td>${esc(c.author)}</td>
      <td><span class="badge text-bg-light border">${esc(c.license)}</span></td>
      <td><a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">Wikimedia Commons <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a></td>
    </tr>`).join('');
})();
