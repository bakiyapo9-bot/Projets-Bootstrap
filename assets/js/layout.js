/* ==========================================================================
   layout.js — Éléments communs à toutes les pages
   - Barre de navigation (vidéo en fond) + menu mobile
   - Pied de page, conteneur de notifications, bouton retour en haut
   - Recherche, compteur de favoris, animations d'apparition, compteurs
   Chaque page contient simplement :
     <div id="site-header"></div> ... <div id="site-footer"></div>
   et <body data-page="accueil|collection|services|solutions|apropos|contact">
   ========================================================================== */
'use strict';

(() => {
  const { esc, normalize } = MAS.utils;

  const PAGES = [
    { id: 'accueil',    href: 'index.html',      label: 'Accueil' },
    { id: 'collection', href: 'collection.html', label: 'Collection' },
    { id: 'services',   href: 'services.html',   label: 'Services' },
    { id: 'solutions',  href: 'solutions.html',  label: 'Solutions' },
    { id: 'apropos',    href: 'apropos.html',    label: 'À propos' },
    { id: 'contact',    href: 'contact.html',    label: 'Contact' }
  ];

  const currentPage = document.body.dataset.page || 'accueil';

  const navLinks = (linkClass) => PAGES.map((p) => {
    const active = p.id === currentPage;
    return `<li class="nav-item">
      <a class="nav-link ${linkClass}${active ? ' active' : ''}" href="${p.href}"${active ? ' aria-current="page"' : ''}>${esc(p.label)}</a>
    </li>`;
  }).join('');

  /* ---------- En-tête : la vidéo est dans la barre de navigation ---------- */
  const headerHTML = `
  <header class="sticky-top site-header">
    <nav class="navbar navbar-dark bg-dark shadow-sm py-4 position-relative overflow-hidden" id="mainNav" aria-label="Navigation principale">

      <video autoplay loop muted playsinline class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover z-0 nav-video" aria-hidden="true">
        <source src="assets/video/grancabrio-folgore.mp4" type="video/mp4">
      </video>
      <div class="position-absolute top-0 start-0 w-100 h-100 nav-video-overlay"></div>

      <div class="container d-flex flex-nowrap align-items-center justify-content-between position-relative z-1">

        <a class="navbar-brand d-flex align-items-center fw-bold fs-4 text-white brand" href="index.html" aria-label="Maserati - Accueil">
          <img src="assets/img/logo.svg" alt="" width="40" height="46" class="me-2 brand-emblem">
          <span class="brand-text">MASERATI</span>
        </a>

        <ul class="nav d-none d-lg-flex flex-nowrap align-items-center gap-xl-1 list-unstyled mb-0 nav-desktop">
          ${navLinks('link-light fw-medium')}
        </ul>

        <div class="d-none d-lg-flex align-items-center gap-3">
          <form class="d-none d-xxl-flex search-form" role="search">
            <div class="input-group">
              <input class="form-control form-control-sm bg-white bg-opacity-25 border-0 text-white px-3 rounded-start-pill shadow-none search-input" type="search" placeholder="Rechercher un modèle..." aria-label="Rechercher un modèle">
              <button class="btn btn-sm btn-light bg-opacity-25 border-0 rounded-end-pill px-3" type="submit" aria-label="Lancer la recherche"><i class="bi bi-search" aria-hidden="true"></i></button>
            </div>
          </form>
          <a href="collection.html#pageSearch" class="btn btn-sm btn-outline-light rounded-circle nav-fav d-xxl-none js-search-shortcut" aria-label="Rechercher un modèle">
            <i class="bi bi-search text-white" aria-hidden="true"></i>
          </a>
          <a href="collection.html?filtre=favoris" class="btn btn-sm btn-outline-light rounded-circle position-relative nav-fav" aria-label="Mes favoris">
            <i class="bi bi-heart-fill" aria-hidden="true"></i>
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fav-count d-none">0</span>
          </a>
          <a href="contact.html" class="btn btn-primary btn-sm px-3 px-xl-4 py-2 rounded-pill shadow-sm fw-medium text-nowrap">Commencer<i class="bi bi-arrow-right ms-1 d-none d-xl-inline" aria-hidden="true"></i></a>
        </div>

        <button class="navbar-toggler border-0 shadow-none p-0 d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#menuMobileCollapse" aria-controls="menuMobileCollapse" aria-expanded="false" aria-label="Ouvrir le menu">
          <span class="navbar-toggler-icon fs-4"></span>
        </button>
      </div>
    </nav>

    <div class="collapse d-lg-none bg-white shadow-sm border-bottom" id="menuMobileCollapse">
      <div class="container py-4">
        <div class="bg-danger rounded-pill mb-4 mx-auto" style="width: 55px; height: 4px;"></div>
        <ul class="list-unstyled text-center d-flex flex-column gap-2 fs-4 mb-4 nav-mobile">
          ${navLinks('link-dark fw-semibold')}
        </ul>
        <form class="search-form mb-3" role="search">
          <div class="input-group">
            <input class="form-control rounded-start-pill px-3 shadow-none search-input" type="search" placeholder="Rechercher un modèle..." aria-label="Rechercher un modèle">
            <button class="btn btn-dark rounded-end-pill px-3" type="submit" aria-label="Lancer la recherche"><i class="bi bi-search" aria-hidden="true"></i></button>
          </div>
        </form>
        <div class="d-flex gap-2">
          <a href="collection.html?filtre=favoris" class="btn btn-outline-dark rounded-pill flex-fill"><i class="bi bi-heart-fill text-danger me-1" aria-hidden="true"></i> Favoris <span class="badge bg-danger rounded-pill fav-count d-none">0</span></a>
          <a href="contact.html" class="btn btn-primary rounded-pill flex-fill">Commencer</a>
        </div>
      </div>
    </div>
  </header>`;

  /* ---------- Pied de page ---------- */
  const SOCIALS = [
    { icon: 'bi-instagram', label: 'Instagram', href: 'https://www.instagram.com/maserati/' },
    { icon: 'bi-facebook',  label: 'Facebook',  href: 'https://www.facebook.com/Maserati' },
    { icon: 'bi-youtube',   label: 'YouTube',   href: 'https://www.youtube.com/@Maserati' },
    { icon: 'bi-linkedin',  label: 'LinkedIn',  href: 'https://www.linkedin.com/company/maserati' }
  ];

  const footerHTML = `
  <footer class="site-footer bg-dark text-white pt-5 pb-4">
    <div class="container">
      <div class="row g-4 pb-4 border-bottom border-secondary border-opacity-25">
        <div class="col-12 col-lg-4">
          <a class="d-flex align-items-center fw-bold fs-4 text-white text-decoration-none mb-3" href="index.html">
            <img src="assets/img/logo.svg" alt="" width="40" height="46" class="me-2">
            MASERATI
          </a>
          <p class="small text-white-50">Luxe, performance et audace italienne depuis 1914. Votre concession de référence pour la gamme au Trident.</p>
          <div class="d-flex gap-2">
            ${SOCIALS.map((s) => `<a class="btn btn-outline-light btn-sm rounded-circle social-btn" href="${s.href}" target="_blank" rel="noopener noreferrer" aria-label="${s.label} (nouvel onglet)"><i class="bi ${s.icon}" aria-hidden="true"></i></a>`).join('')}
          </div>
        </div>
        <div class="col-6 col-lg-2">
          <h2 class="fs-6 text-uppercase fw-bold tracking-wide mb-3">Navigation</h2>
          <ul class="list-unstyled small d-flex flex-column gap-2 mb-0">
            ${PAGES.map((p) => `<li><a class="footer-link" href="${p.href}">${esc(p.label)}</a></li>`).join('')}
          </ul>
        </div>
        <div class="col-6 col-lg-2">
          <h2 class="fs-6 text-uppercase fw-bold tracking-wide mb-3">Modèles</h2>
          <ul class="list-unstyled small d-flex flex-column gap-2 mb-0">
            ${MAS.cars.filter((c) => c.featured).concat(MAS.cars.filter((c) => !c.featured)).slice(0, 5)
              .map((c) => `<li><a class="footer-link" href="collection.html?modele=${encodeURIComponent(c.id)}">${esc(c.name)}</a></li>`).join('')}
          </ul>
        </div>
        <div class="col-12 col-lg-4">
          <h2 class="fs-6 text-uppercase fw-bold tracking-wide mb-3">Contact</h2>
          <ul class="list-unstyled small text-white-50 d-flex flex-column gap-2 mb-0">
            <li><i class="bi bi-geo-alt-fill text-primary me-2" aria-hidden="true"></i>123 Rue du Trident, Abidjan</li>
            <li><i class="bi bi-telephone-fill text-primary me-2" aria-hidden="true"></i>+225 07 00 00 00 00</li>
            <li><i class="bi bi-envelope-fill text-primary me-2" aria-hidden="true"></i>contact@maserati-collection.ci</li>
            <li><i class="bi bi-clock-fill text-primary me-2" aria-hidden="true"></i>Lun - Sam : 9h - 19h</li>
          </ul>
        </div>
      </div>
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 mt-4 small text-white-50">
        <p class="mb-0">&copy; <span class="js-year">2026</span> Maserati - Collection exclusive. Projet pédagogique.</p>
        <a class="footer-link" href="apropos.html#credits"><i class="bi bi-camera me-1" aria-hidden="true"></i>Crédits photos</a>
      </div>
    </div>
  </footer>

  <a href="#" class="btn btn-primary rounded-circle shadow position-fixed d-flex align-items-center justify-content-center back-to-top" id="backToTop" aria-label="Retour en haut de la page">
    <i class="bi bi-arrow-up fs-5" aria-hidden="true"></i>
  </a>
  <div class="toast-container position-fixed bottom-0 start-0 p-3" id="toastContainer"></div>`;

  /* ---------- Injection ---------- */
  const mount = (id, html) => {
    const placeholder = document.getElementById(id);
    if (!placeholder) return;
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    placeholder.replaceWith(template.content);
  };
  mount('site-header', headerHTML);
  mount('site-footer', footerHTML);

  document.querySelectorAll('.js-year').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Vidéo : pas d'animation si l'utilisateur préfère réduire les mouvements ---------- */
  const navVideo = document.querySelector('.nav-video');
  if (navVideo && MAS.utils.prefersReducedMotion()) navVideo.pause();

  /* ---------- Menu mobile ---------- */
  const mobileMenu = document.getElementById('menuMobileCollapse');
  const mobileCollapse = bootstrap.Collapse.getOrCreateInstance(mobileMenu, { toggle: false });
  window.matchMedia('(min-width: 992px)').addEventListener('change', (e) => {
    if (e.matches) mobileCollapse.hide();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('show')) mobileCollapse.hide();
  });

  /* ---------- Barre compacte au défilement + retour en haut ---------- */
  const header = document.querySelector('.site-header');
  const backToTop = document.getElementById('backToTop');
  let ticking = false;
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: MAS.utils.prefersReducedMotion() ? 'auto' : 'smooth' });
  });

  /* ---------- Recherche ----------
     Sur la page Collection : filtrage en direct (évènement "mas:search").
     Ailleurs : redirection vers collection.html?q=...                     */
  const searchInputs = document.querySelectorAll('.search-input');
  const initialQuery = MAS.utils.getParam('q') || '';
  searchInputs.forEach((input) => { input.value = initialQuery; });

  // Suggestions de modèles (datalist native)
  const datalist = document.createElement('datalist');
  datalist.id = 'modelSuggestions';
  datalist.innerHTML = MAS.cars.map((c) => `<option value="${esc(c.name)}"></option>`).join('');
  document.body.appendChild(datalist);

  document.querySelectorAll('.search-form').forEach((form) => {
    const input = form.querySelector('.search-input');
    input.setAttribute('list', 'modelSuggestions');

    if (currentPage === 'collection') {
      input.addEventListener('input', () => {
        searchInputs.forEach((other) => { if (other !== input) other.value = input.value; });
        document.dispatchEvent(new CustomEvent('mas:search', { detail: { query: input.value } }));
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (currentPage === 'collection') {
        mobileCollapse.hide();
        document.dispatchEvent(new CustomEvent('mas:search', { detail: { query, submit: true } }));
        return;
      }
      // Correspondance exacte avec un modèle : on ouvre directement sa fiche
      const exact = MAS.cars.find((c) => normalize(c.name) === normalize(query));
      const url = exact
        ? `collection.html?modele=${encodeURIComponent(exact.id)}`
        : `collection.html${query ? `?q=${encodeURIComponent(query)}` : ''}`;
      window.location.href = url;
    });
  });

  // Raccourci loupe (écrans moyens) : sur la page Collection, on place directement le curseur dans la recherche
  document.querySelectorAll('.js-search-shortcut').forEach((link) => {
    link.addEventListener('click', (e) => {
      const pageSearch = document.getElementById('pageSearch');
      if (!pageSearch) return;
      e.preventDefault();
      pageSearch.scrollIntoView({ behavior: MAS.utils.prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
      pageSearch.focus({ preventScroll: true });
    });
  });
  if (currentPage === 'collection' && window.location.hash === '#pageSearch') {
    document.addEventListener('DOMContentLoaded', () => document.getElementById('pageSearch')?.focus());
  }

  /* ---------- Compteur de favoris dans la barre ---------- */
  const updateFavCount = () => {
    const count = MAS.favorites.list().length;
    document.querySelectorAll('.fav-count').forEach((badge) => {
      badge.textContent = String(count);
      badge.classList.toggle('d-none', count === 0);
    });
  };
  document.addEventListener('mas:favorites', updateFavCount);
  window.addEventListener('storage', updateFavCount); // synchronisation entre onglets
  updateFavCount();

  /* ---------- Apparition au défilement + compteurs animés ---------- */
  const animateCounter = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (MAS.utils.prefersReducedMotion()) { el.textContent = `${target}${suffix}`; return; }
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  MAS.observeReveal = (root = document) => {
    const revealEls = root.querySelectorAll('.reveal:not(.is-visible)');
    const counters = root.querySelectorAll('[data-count]:not(.is-counted)');
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      counters.forEach((el) => { el.classList.add('is-counted'); el.textContent = `${el.dataset.count}${el.dataset.suffix || ''}`; });
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.hasAttribute('data-count')) { el.classList.add('is-counted'); animateCounter(el); }
        else el.classList.add('is-visible');
        obs.unobserve(el);
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => observer.observe(el));
    counters.forEach((el) => observer.observe(el));
  };

  if ('IntersectionObserver' in window) document.documentElement.classList.add('js-reveal');
  document.addEventListener('DOMContentLoaded', () => MAS.observeReveal());
})();
