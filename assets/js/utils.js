/* ==========================================================================
   utils.js — Fonctions utilitaires partagées par toutes les pages
   ========================================================================== */
'use strict';

window.MAS = window.MAS || {};

MAS.utils = (() => {
  const euroFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const numberFormatter = new Intl.NumberFormat('fr-FR');

  /** Échappe le HTML pour insérer du texte sans risque (protection XSS). */
  const esc = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  /** Supprime les accents et met en minuscules (recherche tolérante). */
  const normalize = (str) => String(str ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  const formatEuro = (n) => euroFormatter.format(n);
  const formatNumber = (n) => numberFormatter.format(n);
  /** Temps d'accélération : 3 -> "3,0" ; 2.85 -> "2,9" */
  const formatAccel = (seconds) => Number(seconds).toFixed(1).replace('.', ',');

  /** Lit un paramètre d'URL (?cle=valeur). */
  const getParam = (name) => new URLSearchParams(window.location.search).get(name);

  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Accès sécurisé au localStorage (peut être bloqué : navigation privée, file://...). */
  const storage = {
    get(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    remove(key) {
      try { window.localStorage.removeItem(key); } catch { /* stockage indisponible : rien à nettoyer */ }
    }
  };

  /**
   * Mensualité d'un prêt à taux fixe (formule d'annuité constante).
   * @param {number} principal  montant emprunté
   * @param {number} annualRate taux annuel (ex : 0.049)
   * @param {number} months     durée en mois
   */
  const monthlyPayment = (principal, annualRate, months) => {
    if (principal <= 0 || months <= 0) return 0;
    const r = annualRate / 12;
    if (r === 0) return principal / months;
    return (principal * r) / (1 - Math.pow(1 + r, -months));
  };

  /** Débounce : retarde l'exécution tant que l'utilisateur tape. */
  const debounce = (fn, delay = 250) => {
    let timer;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn(...args), delay);
    };
  };

  /** Affiche une notification (toast Bootstrap). type : success | danger | info | warning */
  const toast = (message, type = 'success', icon = 'bi-check-circle-fill') => {
    const container = document.getElementById('toastContainer');
    if (!container || !window.bootstrap) return;
    const el = document.createElement('div');
    el.className = 'toast align-items-center border-0 shadow-lg';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    el.innerHTML = `
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi ${esc(icon)} text-${esc(type)} fs-5" aria-hidden="true"></i>
          <span>${esc(message)}</span>
        </div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Fermer"></button>
      </div>`;
    container.appendChild(el);
    el.addEventListener('hidden.bs.toast', () => el.remove());
    bootstrap.Toast.getOrCreateInstance(el, { delay: 3500 }).show();
  };

  return { esc, normalize, formatEuro, formatNumber, formatAccel, getParam, prefersReducedMotion, storage, monthlyPayment, debounce, toast };
})();

/* --------------------------------------------------------------------------
   Favoris (persistés dans le navigateur)
   Émet l'évènement "mas:favorites" à chaque changement.
   -------------------------------------------------------------------------- */
MAS.favorites = (() => {
  const KEY = 'mas-favoris';
  const validIds = () => new Set(MAS.cars.map((c) => c.id));

  const list = () => {
    const ids = MAS.utils.storage.get(KEY, []);
    if (!Array.isArray(ids)) return [];
    const valid = validIds();
    return ids.filter((id) => valid.has(id));
  };

  const has = (id) => list().includes(id);

  const toggle = (id) => {
    const ids = list();
    const index = ids.indexOf(id);
    if (index === -1) ids.push(id); else ids.splice(index, 1);
    MAS.utils.storage.set(KEY, ids);
    const added = index === -1;
    document.dispatchEvent(new CustomEvent('mas:favorites', { detail: { id, added, ids } }));
    return added;
  };

  return { list, has, toggle };
})();
