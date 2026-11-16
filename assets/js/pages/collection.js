/* ==========================================================================
   pages/collection.js — Catalogue : recherche, filtres, tri, comparateur
   L'état est synchronisé avec l'URL (?q=...&filtre=...&tri=...) : on peut
   partager un lien filtré ou revenir en arrière sans perdre ses choix.
   ========================================================================== */
'use strict';

(() => {
  const { esc, normalize, formatEuro, getParam, debounce, toast } = MAS.utils;

  const list = document.getElementById('carList');
  const emptyState = document.getElementById('emptyState');
  const emptyText = document.getElementById('emptyText');
  const resultCount = document.getElementById('resultCount');
  const pageSearch = document.getElementById('pageSearch');
  const sortSelect = document.getElementById('sortSelect');
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

  const FILTERS = ['tous', 'hybride', 'thermique', 'electrique', 'favoris'];
  const SORTS = {
    'prix-asc': (a, b) => a.price - b.price,
    'prix-desc': (a, b) => b.price - a.price,
    'puissance-desc': (a, b) => b.specs.power - a.specs.power,
    'accel-asc': (a, b) => a.specs.accel - b.specs.accel,
    'nom-asc': (a, b) => a.name.localeCompare(b.name, 'fr')
  };
  const MAX_COMPARE = 3;

  const state = {
    query: getParam('q') || '',
    filter: FILTERS.includes(getParam('filtre')) ? getParam('filtre') : 'tous',
    sort: SORTS[getParam('tri')] ? getParam('tri') : 'prix-asc',
    compare: []
  };

  /* ---------- URL <-> état ---------- */
  const syncUrl = () => {
    const params = new URLSearchParams();
    if (state.query) params.set('q', state.query);
    if (state.filter !== 'tous') params.set('filtre', state.filter);
    if (state.sort !== 'prix-asc') params.set('tri', state.sort);
    const qs = params.toString();
    history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}`);
  };

  /* ---------- Rendu ---------- */
  const matches = (car, query) => {
    if (!query) return true;
    const haystack = normalize([car.name, car.body, car.badge, car.specs.engine, MAS.categories[car.category].label].join(' '));
    return normalize(query).split(/\s+/).every((word) => haystack.includes(word));
  };

  const render = () => {
    const favs = MAS.favorites.list();
    const results = MAS.cars
      .filter((car) => {
        if (state.filter === 'favoris') return favs.includes(car.id);
        return state.filter === 'tous' || car.category === state.filter;
      })
      .filter((car) => matches(car, state.query))
      .sort(SORTS[state.sort]);

    list.innerHTML = results.map((car) => MAS.ui.carCard(car, { compare: true, compared: state.compare.includes(car.id) })).join('');

    const n = results.length;
    resultCount.textContent = `${n} modèle${n > 1 ? 's' : ''} sur ${MAS.cars.length}`;
    emptyState.classList.toggle('d-none', n > 0);
    emptyText.textContent = state.filter === 'favoris' && favs.length === 0
      ? "Vous n'avez pas encore de favori. Cliquez sur le cœur d'un modèle pour l'ajouter."
      : 'Aucun modèle ne correspond à votre recherche.';

    filterButtons.forEach((btn) => {
      const active = btn.dataset.filter === state.filter;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    syncUrl();
  };

  /* ---------- Évènements ---------- */
  const setQuery = (query) => {
    state.query = query.trim();
    if (pageSearch.value !== query) pageSearch.value = query;
    document.querySelectorAll('.search-input').forEach((input) => { if (input.value !== query) input.value = query; });
    render();
  };

  pageSearch.value = state.query;
  sortSelect.value = state.sort;

  pageSearch.addEventListener('input', debounce(() => setQuery(pageSearch.value), 150));

  // Recherche depuis la barre de navigation (évènement émis par layout.js)
  document.addEventListener('mas:search', (e) => {
    setQuery(e.detail.query);
    if (e.detail.submit) list.scrollIntoView({ behavior: MAS.utils.prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  });

  filterButtons.forEach((btn) => btn.addEventListener('click', () => {
    state.filter = btn.dataset.filter;
    render();
  }));

  sortSelect.addEventListener('change', () => {
    state.sort = sortSelect.value;
    render();
  });

  document.getElementById('resetFilters').addEventListener('click', () => {
    state.filter = 'tous';
    setQuery('');
  });

  // En mode "Favoris", retirer un favori le fait disparaître de la liste
  document.addEventListener('mas:favorites', () => { if (state.filter === 'favoris') render(); });

  /* ---------- Comparateur ---------- */
  const compareBar = document.getElementById('compareBar');
  const compareCount = document.getElementById('compareCount');
  const compareModalEl = document.getElementById('compareModal');
  const compareModal = bootstrap.Modal.getOrCreateInstance(compareModalEl);

  const renderCompareBar = () => {
    compareBar.hidden = state.compare.length === 0;
    compareCount.textContent = String(state.compare.length);
    document.getElementById('compareOpen').disabled = state.compare.length < 2;
  };

  list.addEventListener('change', (e) => {
    const check = e.target.closest('.compare-check');
    if (!check) return;
    const id = check.value;
    if (check.checked) {
      if (state.compare.length >= MAX_COMPARE) {
        check.checked = false;
        toast(`Vous pouvez comparer ${MAX_COMPARE} modèles au maximum.`, 'warning', 'bi-exclamation-triangle-fill');
        return;
      }
      state.compare.push(id);
    } else {
      state.compare = state.compare.filter((x) => x !== id);
    }
    renderCompareBar();
  });

  document.getElementById('compareClear').addEventListener('click', () => {
    state.compare = [];
    list.querySelectorAll('.compare-check').forEach((c) => { c.checked = false; });
    renderCompareBar();
  });

  /** Met en évidence la meilleure valeur de chaque ligne. */
  const ROWS = [
    { label: 'Prix', icon: 'bi-tag', get: (c) => c.price, fmt: formatEuro, best: 'min' },
    { label: 'Puissance', icon: 'bi-speedometer2', get: (c) => c.specs.power, fmt: (v) => `${v} ch`, best: 'max' },
    { label: '0 - 100 km/h', icon: 'bi-stopwatch', get: (c) => c.specs.accel, fmt: (v) => `${MAS.utils.formatAccel(v)} s`, best: 'min' },
    { label: 'Vitesse max', icon: 'bi-wind', get: (c) => c.specs.vmax, fmt: (v) => `${v} km/h`, best: 'max' },
    { label: 'Moteur', icon: 'bi-gear-wide-connected', get: (c) => c.specs.engine, fmt: (v) => v },
    { label: 'Carrosserie', icon: 'bi-car-front', get: (c) => c.body, fmt: (v) => v },
    { label: 'Énergie', icon: 'bi-ev-station', get: (c) => MAS.categories[c.category].label, fmt: (v) => v }
  ];

  document.getElementById('compareOpen').addEventListener('click', () => {
    const cars = state.compare.map(MAS.getCar).filter(Boolean);
    const head = cars.map((c) => `
      <th scope="col" class="text-center" style="min-width: 180px;">
        <img src="${esc(c.images[0])}" alt="" class="rounded-3 w-100 object-fit-cover mb-2" style="height: 110px;">
        <span class="d-block fw-bold text-uppercase">${esc(c.name)}</span>
      </th>`).join('');

    const body = ROWS.map((row) => {
      const values = cars.map(row.get);
      let bestValue = null;
      if (row.best) bestValue = row.best === 'max' ? Math.max(...values) : Math.min(...values);
      return `<tr>
        <th scope="row" class="text-secondary small text-nowrap"><i class="bi ${row.icon} me-2 text-primary" aria-hidden="true"></i>${esc(row.label)}</th>
        ${values.map((v) => {
          const isBest = bestValue !== null && v === bestValue;
          return `<td class="text-center ${isBest ? 'fw-bold text-success' : ''}">${esc(row.fmt(v))}${isBest ? ' <i class="bi bi-trophy-fill" aria-label="meilleur"></i>' : ''}</td>`;
        }).join('')}
      </tr>`;
    }).join('');

    const actions = `<tr><td></td>${cars.map((c) => `
      <td class="text-center"><a class="btn btn-primary btn-sm rounded-pill px-3" href="contact.html?modele=${encodeURIComponent(c.id)}&sujet=essai">Essayer</a></td>`).join('')}</tr>`;

    document.getElementById('compareTable').innerHTML = `
      <table class="table align-middle mb-0">
        <thead><tr><th scope="col"><span class="visually-hidden">Caractéristique</span></th>${head}</tr></thead>
        <tbody>${body}${actions}</tbody>
      </table>`;
    compareModal.show();
  });

  /* ---------- Démarrage ---------- */
  render();
  renderCompareBar();

  // Lien direct vers un modèle : collection.html?modele=mc20
  const directModel = getParam('modele');
  if (directModel && MAS.getCar(directModel)) {
    MAS.ui.openCar(directModel);
  }
})();
