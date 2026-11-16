/* ==========================================================================
   components.js — Composants réutilisables
   - MAS.ui.carCard(car, options)  : carte d'un modèle (HTML)
   - MAS.ui.openCar(id)            : fiche détaillée (modal + carrousel photos)
   - Gestion globale des boutons [data-car] (ouvrir) et [data-fav] (favori)
   ========================================================================== */
'use strict';

MAS.ui = (() => {
  const { esc, formatEuro, toast } = MAS.utils;

  const categoryBadge = (car) => {
    const cat = MAS.categories[car.category];
    return `<span class="badge bg-${cat.color} bg-opacity-25 text-${cat.color} border border-${cat.color} border-opacity-50 rounded-pill px-3 py-2 small fw-semibold car-badge car-badge-${cat.color}">
      <i class="bi ${cat.icon} me-1" aria-hidden="true"></i>${esc(car.badge)}
    </span>`;
  };

  const favButton = (car, extraClass = '') => {
    const active = MAS.favorites.has(car.id);
    return `<button type="button" class="btn fav-btn ${active ? 'is-active' : ''} ${extraClass}" data-fav="${esc(car.id)}"
        aria-pressed="${active}" aria-label="${active ? 'Retirer' : 'Ajouter'} ${esc(car.name)} ${active ? 'des' : 'aux'} favoris">
      <i class="bi ${active ? 'bi-heart-fill' : 'bi-heart'}" aria-hidden="true"></i>
    </button>`;
  };

  /**
   * Carte d'un modèle.
   * @param {object} car
   * @param {{compare?: boolean, compared?: boolean, colClass?: string}} options
   */
  const carCard = (car, options = {}) => {
    const { compare = false, compared = false, colClass = 'col-12 col-md-6 col-lg-4' } = options;
    return `
    <div class="${colClass} car-item" data-id="${esc(car.id)}">
      <article class="card h-100 border-0 bg-dark text-white overflow-hidden rounded-4 shadow car-card">
        <div class="overflow-hidden position-relative car-media">
          <img src="${esc(car.images[0])}" class="card-img-top object-fit-cover w-100 h-100" alt="Maserati ${esc(car.name)}" loading="lazy" decoding="async">
          <div class="position-absolute top-0 start-0 w-100 h-100 car-media-overlay"></div>
          <span class="position-absolute top-0 start-0 m-3 badge bg-dark bg-opacity-75 rounded-pill fw-normal">${esc(car.body)}</span>
          ${favButton(car, 'position-absolute top-0 end-0 m-2')}
        </div>
        <div class="card-body p-4 d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center gap-2 mb-3">
            <h3 class="fw-bold mb-0 text-uppercase tracking-wide fs-5">${esc(car.name)}</h3>
            ${categoryBadge(car)}
          </div>
          <p class="small opacity-75 lh-base">${esc(car.tagline)}</p>
          <ul class="list-unstyled d-flex justify-content-between small text-white-50 mb-3 flex-grow-1 align-items-end car-quickspecs">
            <li><i class="bi bi-speedometer2 me-1 text-primary" aria-hidden="true"></i>${car.specs.power} ch</li>
            <li><i class="bi bi-stopwatch me-1 text-primary" aria-hidden="true"></i>${MAS.utils.formatAccel(car.specs.accel)} s</li>
            <li><i class="bi bi-wind me-1 text-primary" aria-hidden="true"></i>${car.specs.vmax} km/h</li>
          </ul>
          <div class="pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
            <div>
              <span class="d-block text-uppercase text-white-50 price-label">À partir de</span>
              <span class="fs-4 fw-bold">${formatEuro(car.price)}</span>
            </div>
            <button type="button" class="btn btn-primary btn-sm rounded-pill px-4 py-2 text-uppercase tracking-wider shadow-sm btn-xs-text" data-car="${esc(car.id)}">Découvrir</button>
          </div>
          ${compare ? `
          <div class="form-check form-switch mt-3 mb-0 small">
            <input class="form-check-input compare-check" type="checkbox" role="switch" id="cmp-${esc(car.id)}" value="${esc(car.id)}" ${compared ? 'checked' : ''}>
            <label class="form-check-label text-white-50" for="cmp-${esc(car.id)}">Comparer</label>
          </div>` : ''}
        </div>
      </article>
    </div>`;
  };

  /* ---------- Fiche détaillée (modal unique, créée à la demande) ---------- */
  let modal = null;
  let modalEl = null;

  const ensureModal = () => {
    if (modalEl) return;
    modalEl = document.createElement('div');
    modalEl.className = 'modal fade';
    modalEl.id = 'carModal';
    modalEl.tabIndex = -1;
    modalEl.setAttribute('aria-labelledby', 'carModalTitle');
    modalEl.setAttribute('aria-hidden', 'true');
    modalEl.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-xl modal-fullscreen-md-down">
        <div class="modal-content border-0 rounded-4 overflow-hidden bg-dark text-white">
          <div class="row g-0">
            <div class="col-12 col-lg-7 position-relative bg-black">
              <div class="carousel slide carousel-fade h-100" id="carModalCarousel">
                <div class="carousel-indicators" id="carModalIndicators"></div>
                <div class="carousel-inner h-100" id="carModalSlides"></div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carModalCarousel" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Photo précédente</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carModalCarousel" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Photo suivante</span>
                </button>
              </div>
            </div>
            <div class="col-12 col-lg-5 p-4 p-xl-5 d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                <div>
                  <span class="small text-white-50 text-uppercase tracking-wider" id="carModalBody"></span>
                  <h2 class="modal-title fw-bold text-uppercase tracking-wide fs-3 mb-0" id="carModalTitle"></h2>
                </div>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fermer"></button>
              </div>
              <div class="mb-3" id="carModalBadge"></div>
              <p class="opacity-75 lh-lg small" id="carModalDesc"></p>
              <div class="row g-2 text-center mb-3" id="carModalSpecs"></div>
              <p class="small text-white-50 mb-4" style="font-size: 0.7rem;">Données indicatives, susceptibles d'évoluer selon la configuration.</p>
              <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-end mb-3">
                  <div>
                    <span class="d-block text-uppercase text-white-50 price-label">À partir de</span>
                    <span class="fs-3 fw-bold" id="carModalPrice"></span>
                  </div>
                  <div id="carModalFav"></div>
                </div>
                <div class="d-grid gap-2 d-sm-flex">
                  <a class="btn btn-primary rounded-pill px-4 flex-fill" id="carModalCta"><i class="bi bi-calendar-check me-2" aria-hidden="true"></i>Réserver un essai</a>
                  <a class="btn btn-outline-light rounded-pill px-4 flex-fill" id="carModalFinance"><i class="bi bi-calculator me-2" aria-hidden="true"></i>Simuler</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modalEl);
    modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  };

  const specBox = (icon, value, label) => `
    <div class="col-6">
      <div class="border border-secondary border-opacity-25 rounded-4 py-3 h-100">
        <i class="bi ${icon} text-primary fs-5 d-block mb-1" aria-hidden="true"></i>
        <span class="d-block fw-bold">${esc(value)}</span>
        <span class="d-block small text-white-50 text-uppercase" style="font-size: 0.65rem;">${esc(label)}</span>
      </div>
    </div>`;

  const openCar = (id) => {
    const car = MAS.getCar(id);
    if (!car) return;
    ensureModal();

    const q = (sel) => modalEl.querySelector(sel);
    q('#carModalTitle').textContent = car.name;
    q('#carModalBody').textContent = `${car.body} · ${MAS.categories[car.category].label}`;
    q('#carModalBadge').innerHTML = categoryBadge(car);
    q('#carModalDesc').textContent = car.desc;
    q('#carModalPrice').textContent = formatEuro(car.price);
    q('#carModalFav').innerHTML = favButton(car, 'fav-btn-lg');
    q('#carModalCta').href = `contact.html?modele=${encodeURIComponent(car.id)}&sujet=essai`;
    q('#carModalFinance').href = `solutions.html?modele=${encodeURIComponent(car.id)}#simulateur`;

    const s = car.specs;
    q('#carModalSpecs').innerHTML = [
      specBox('bi-speedometer2', `${s.power} ch`, 'Puissance'),
      specBox('bi-stopwatch', `${MAS.utils.formatAccel(s.accel)} s`, '0 - 100 km/h'),
      specBox('bi-wind', `${s.vmax} km/h`, 'Vitesse max'),
      s.range ? specBox('bi-battery-charging', `≈ ${s.range} km`, 'Autonomie') : specBox('bi-gear-wide-connected', s.engine, 'Moteur')
    ].join('');

    q('#carModalSlides').innerHTML = car.images.map((src, i) => `
      <div class="carousel-item h-100 ${i === 0 ? 'active' : ''}">
        <img src="${esc(src)}" class="d-block w-100 h-100 object-fit-cover modal-car-img" alt="Maserati ${esc(car.name)} - photo ${i + 1}">
      </div>`).join('');
    q('#carModalIndicators').innerHTML = car.images.length > 1 ? car.images.map((_, i) => `
      <button type="button" data-bs-target="#carModalCarousel" data-bs-slide-to="${i}" class="${i === 0 ? 'active' : ''}" ${i === 0 ? 'aria-current="true"' : ''} aria-label="Photo ${i + 1}"></button>`).join('') : '';
    modalEl.querySelectorAll('.carousel-control-prev, .carousel-control-next').forEach((btn) => {
      btn.classList.toggle('d-none', car.images.length < 2);
    });
    const carousel = bootstrap.Carousel.getOrCreateInstance(q('#carModalCarousel'), { ride: false, interval: false });
    carousel.to(0);

    modal.show();
  };

  /* ---------- Délégation d'évènements (fonctionne pour le contenu généré) ---------- */
  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-car]');
    if (openBtn) { openCar(openBtn.dataset.car); return; }

    const favBtn = e.target.closest('[data-fav]');
    if (favBtn) {
      const id = favBtn.dataset.fav;
      const added = MAS.favorites.toggle(id);
      const car = MAS.getCar(id);
      toast(added ? `${car.name} ajoutée à vos favoris` : `${car.name} retirée de vos favoris`,
        added ? 'danger' : 'secondary', added ? 'bi-heart-fill' : 'bi-heart');
    }
  });

  // Met à jour tous les boutons favoris visibles quand la liste change
  document.addEventListener('mas:favorites', () => {
    document.querySelectorAll('[data-fav]').forEach((btn) => {
      const car = MAS.getCar(btn.dataset.fav);
      const active = MAS.favorites.has(car.id);
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
      btn.setAttribute('aria-label', `${active ? 'Retirer' : 'Ajouter'} ${car.name} ${active ? 'des' : 'aux'} favoris`);
      const icon = btn.querySelector('i');
      icon.className = `bi ${active ? 'bi-heart-fill' : 'bi-heart'}`;
    });
  });

  return { carCard, openCar, categoryBadge };
})();
