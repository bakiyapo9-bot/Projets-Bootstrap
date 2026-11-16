/* ==========================================================================
   pages/accueil.js — Page d'accueil
   ========================================================================== */
'use strict';

(() => {
  const { esc } = MAS.utils;

  /* ---------- Modèles à la une ---------- */
  const featured = MAS.cars.filter((car) => car.featured);
  document.getElementById('featuredList').innerHTML = featured
    .map((car) => MAS.ui.carCard(car).replace('car-item', 'car-item reveal'))
    .join('');
  document.getElementById('totalModels').textContent = String(MAS.cars.length);

  /* ---------- Tuiles par motorisation (générées depuis le catalogue) ---------- */
  const tiles = Object.entries(MAS.categories).map(([key, cat]) => {
    const cars = MAS.cars.filter((c) => c.category === key);
    const cover = cars[0];
    return `
      <div class="col-12 col-md-4 reveal">
        <a href="collection.html?filtre=${encodeURIComponent(key)}" class="energy-tile d-block position-relative rounded-4 overflow-hidden shadow text-white text-decoration-none">
          <img src="${esc(cover.images[0])}" class="w-100 h-100 object-fit-cover" alt="" loading="lazy">
          <div class="energy-tile-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-4">
            <i class="bi ${cat.icon} fs-2 text-${cat.color}" aria-hidden="true"></i>
            <h3 class="fw-bold text-uppercase tracking-wide fs-4 mb-1">${esc(cat.label)}</h3>
            <span class="small opacity-75">${cars.length} modèle${cars.length > 1 ? 's' : ''} <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i></span>
          </div>
        </a>
      </div>`;
  }).join('');
  document.getElementById('energyTiles').innerHTML = tiles;

  /* ---------- Bouton pause du carrousel (accessibilité) ---------- */
  const carouselEl = document.getElementById('heroCarousel');
  const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
  const pauseBtn = document.getElementById('heroPause');
  let paused = MAS.utils.prefersReducedMotion();

  const renderPause = () => {
    pauseBtn.querySelector('i').className = `bi ${paused ? 'bi-play-fill' : 'bi-pause-fill'}`;
    pauseBtn.setAttribute('aria-label', paused ? 'Relancer le carrousel' : 'Mettre le carrousel en pause');
  };

  if (paused) carousel.pause();
  renderPause();

  pauseBtn.addEventListener('click', () => {
    paused = !paused;
    if (paused) carousel.pause(); else carousel.cycle();
    renderPause();
  });

  // Bootstrap relance le défilement au survol/sortie : on respecte le choix "pause"
  carouselEl.addEventListener('slid.bs.carousel', () => { if (paused) carousel.pause(); });
})();
