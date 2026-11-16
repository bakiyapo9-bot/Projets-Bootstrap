/* ==========================================================================
   pages/services.js — Cartes de services + FAQ filtrable
   ========================================================================== */
'use strict';

(() => {
  const { esc, normalize, debounce } = MAS.utils;

  const SERVICES = [
    { icon: 'bi-speedometer', title: 'Essai routier', sujet: 'essai', text: "Prenez le volant du modèle de votre choix lors d'un essai personnalisé d'une heure avec un conseiller dédié." },
    { icon: 'bi-tools', title: 'Entretien', sujet: 'entretien', text: "Techniciens certifiés, pièces d'origine et diagnostic électronique pour préserver les performances de votre véhicule." },
    { icon: 'bi-palette-fill', title: 'Personnalisation', sujet: 'personnalisation', text: 'Teintes exclusives, cuirs, jantes et finitions carbone : composez une Maserati qui vous ressemble.' },
    { icon: 'bi-truck', title: 'Livraison', sujet: 'information', text: "Livraison à domicile partout en Côte d'Ivoire, en France et en Espagne, avec prise en main complète." },
    { icon: 'bi-arrow-repeat', title: 'Reprise', sujet: 'information', text: 'Estimation gratuite de votre véhicule actuel et reprise immédiate déduite de votre achat.' },
    { icon: 'bi-shield-fill-check', title: 'Assistance 24/7', sujet: 'information', text: 'Assistance routière et véhicule de remplacement, 24 heures sur 24 et 7 jours sur 7.' }
  ];

  document.getElementById('serviceList').innerHTML = SERVICES.map((s) => `
    <div class="col-12 col-sm-6 col-lg-4 reveal">
      <div class="card h-100 border-0 bg-white shadow-sm rounded-4 p-4 service-card">
        <div class="service-icon rounded-4 d-flex align-items-center justify-content-center mb-4">
          <i class="bi ${esc(s.icon)}" aria-hidden="true"></i>
        </div>
        <h2 class="fs-5 fw-bold text-uppercase tracking-wide">${esc(s.title)}</h2>
        <p class="small text-secondary flex-grow-1">${esc(s.text)}</p>
        <a href="contact.html?sujet=${encodeURIComponent(s.sujet)}" class="link-primary fw-semibold small text-decoration-none stretched-link">
          Prendre rendez-vous <i class="bi bi-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
    </div>`).join('');

  /* ---------- FAQ ---------- */
  const FAQ = [
    { q: "L'essai routier est-il gratuit ?", a: "Oui, l'essai est entièrement gratuit et sans engagement. Il suffit de présenter un permis de conduire valide depuis plus de 3 ans." },
    { q: 'Quelle est la garantie de mon véhicule ?', a: 'Tous nos véhicules neufs bénéficient de la garantie constructeur de 3 ans, extensible jusqu\'à 5 ans.' },
    { q: 'Comment fonctionne la remise de 10 % ?', a: "Pour tout achat d'une voiture, une remise de 10 % est appliquée sur le prix catalogue hors options. Elle est cumulable avec la reprise." },
    { q: 'Quels sont les délais de livraison ?', a: 'Comptez 4 à 8 semaines pour un modèle en stock et 4 à 6 mois pour un véhicule personnalisé produit à Modène.' },
    { q: 'Puis-je recharger une Folgore à domicile ?', a: "Oui. Nous vous accompagnons pour l'installation d'une borne murale. Une Folgore se recharge aussi sur les bornes rapides publiques." },
    { q: "Où se trouve l'atelier d'entretien ?", a: "Notre atelier est situé dans la concession, 123 Rue du Trident à Abidjan. Un véhicule de courtoisie peut vous être prêté pendant l'intervention." }
  ];

  const faqEl = document.getElementById('faq');
  faqEl.innerHTML = FAQ.map((item, i) => `
    <div class="accordion-item faq-item">
      <h3 class="accordion-header">
        <button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#faq-${i}" aria-expanded="false" aria-controls="faq-${i}">
          ${esc(item.q)}
        </button>
      </h3>
      <div id="faq-${i}" class="accordion-collapse collapse" data-bs-parent="#faq">
        <div class="accordion-body text-secondary">${esc(item.a)}</div>
      </div>
    </div>`).join('');

  const faqSearch = document.getElementById('faqSearch');
  const faqEmpty = document.getElementById('faqEmpty');
  const items = Array.from(faqEl.querySelectorAll('.faq-item'));

  faqSearch.addEventListener('input', debounce(() => {
    const words = normalize(faqSearch.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    items.forEach((item, i) => {
      const text = normalize(`${FAQ[i].q} ${FAQ[i].a}`);
      const show = words.every((w) => text.includes(w));
      item.classList.toggle('d-none', !show);
      if (show) visible += 1;
    });
    faqEmpty.classList.toggle('d-none', visible > 0);
  }, 150));
})();
