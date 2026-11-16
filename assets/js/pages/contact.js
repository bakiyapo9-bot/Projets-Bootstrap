/* ==========================================================================
   pages/contact.js — Formulaire de contact
   - Pré-remplissage depuis l'URL (?modele=...&sujet=...)
   - Brouillon sauvegardé automatiquement (localStorage)
   - Validation en direct + compteur de caractères
   - Statut d'ouverture du showroom en temps réel
   Aucun serveur : l'envoi est simulé côté navigateur.
   ========================================================================== */
'use strict';

(() => {
  const { esc, getParam, storage, debounce, toast } = MAS.utils;

  const DRAFT_KEY = 'mas-brouillon-contact';
  const form = document.getElementById('contactForm');
  const selectModele = document.getElementById('selectModele');
  const selectSujet = document.getElementById('selectSujet');
  const message = document.getElementById('inputMessage');
  const counter = document.getElementById('messageCounter');
  const draftNotice = document.getElementById('draftNotice');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  /* ---------- Liste des modèles (depuis le catalogue) ---------- */
  selectModele.insertAdjacentHTML('beforeend',
    MAS.cars.map((c) => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('') +
    '<option value="autre">Je ne sais pas encore</option>');

  /* ---------- Compteur de caractères ---------- */
  const updateCounter = () => {
    const max = Number(message.getAttribute('maxlength'));
    const len = message.value.length;
    counter.textContent = `${len} / ${max}`;
    counter.classList.toggle('text-danger', len > max * 0.9);
  };

  /* ---------- Brouillon automatique (le consentement n'est jamais sauvegardé) ---------- */
  const FIELDS = ['sujet', 'modele', 'nom', 'prenom', 'email', 'telephone', 'adresse', 'ville', 'pays', 'message'];

  const saveDraft = debounce(() => {
    const data = {};
    FIELDS.forEach((name) => { data[name] = form.elements[name].value; });
    const hasContent = FIELDS.some((name) => data[name]);
    if (hasContent) storage.set(DRAFT_KEY, data); else storage.remove(DRAFT_KEY);
  }, 400);

  const restoreDraft = () => {
    const data = storage.get(DRAFT_KEY, null);
    if (!data || typeof data !== 'object') return false;
    let restored = false;
    FIELDS.forEach((name) => {
      const field = form.elements[name];
      const value = typeof data[name] === 'string' ? data[name] : '';
      if (!value) return;
      if (field.tagName === 'SELECT' && !Array.from(field.options).some((o) => o.value === value)) return;
      field.value = value;
      restored = true;
    });
    return restored;
  };

  if (restoreDraft()) draftNotice.classList.remove('d-none');

  document.getElementById('clearDraft').addEventListener('click', () => {
    storage.remove(DRAFT_KEY);
    form.reset();
    form.classList.remove('was-validated');
    draftNotice.classList.add('d-none');
    updateCounter();
  });

  /* ---------- Pré-remplissage depuis l'URL (prioritaire sur le brouillon) ---------- */
  const modeleParam = getParam('modele');
  const sujetParam = getParam('sujet');
  if (MAS.getCar(modeleParam)) selectModele.value = modeleParam;
  if (sujetParam && Array.from(selectSujet.options).some((o) => o.value === sujetParam)) selectSujet.value = sujetParam;

  if (!message.value.trim() && (modeleParam || sujetParam)) {
    const car = MAS.getCar(modeleParam);
    const phrases = {
      essai: car ? `Bonjour, je souhaite réserver un essai de la Maserati ${car.name}.` : 'Bonjour, je souhaite réserver un essai.',
      financement: car ? `Bonjour, je souhaite recevoir une offre de financement pour la Maserati ${car.name}.` : 'Bonjour, je souhaite recevoir une offre de financement.',
      entretien: "Bonjour, je souhaite prendre rendez-vous pour l'entretien de mon véhicule.",
      personnalisation: car ? `Bonjour, je souhaite personnaliser une Maserati ${car.name}.` : 'Bonjour, je souhaite des informations sur la personnalisation.'
    };
    message.value = phrases[sujetParam] || (car ? `Bonjour, je souhaite des informations sur la Maserati ${car.name}.` : '');
  }
  updateCounter();

  /* ---------- Validation en direct (après la première tentative ou à la sortie du champ) ---------- */
  form.addEventListener('input', (e) => {
    if (e.target === message) updateCounter();
    if (e.target.classList.contains('is-invalid') && e.target.checkValidity()) {
      e.target.classList.remove('is-invalid');
    }
    saveDraft();
  });
  form.addEventListener('change', saveDraft);

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('blur', () => {
      if (field.value === '' && !form.classList.contains('was-validated')) return;
      field.classList.toggle('is-invalid', !field.checkValidity());
      field.classList.toggle('is-valid', field.checkValidity());
    });
  });

  /* ---------- Envoi (simulé) ---------- */
  const setLoading = (loading) => {
    submitBtn.disabled = loading;
    submitBtn.querySelector('.btn-label').classList.toggle('d-none', loading);
    submitBtn.querySelector('.btn-loading').classList.toggle('d-none', !loading);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.classList.add('d-none');

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      toast('Merci de corriger les champs en rouge.', 'danger', 'bi-exclamation-octagon-fill');
      return;
    }

    setLoading(true);
    const prenom = form.elements.prenom.value.trim();

    // Simulation d'un appel serveur
    window.setTimeout(() => {
      setLoading(false);
      document.getElementById('successName').textContent = prenom;
      formSuccess.classList.remove('d-none');
      formSuccess.focus();
      form.reset();
      form.classList.remove('was-validated');
      form.querySelectorAll('.is-valid, .is-invalid').forEach((f) => f.classList.remove('is-valid', 'is-invalid'));
      storage.remove(DRAFT_KEY);
      draftNotice.classList.add('d-none');
      updateCounter();
      toast('Message envoyé avec succès !');
    }, 1200);
  });

  /* ---------- Showroom ouvert / fermé (heure d'Abidjan = UTC) ---------- */
  const openStatus = document.getElementById('openStatus');
  const OPEN_HOUR = 9;
  const CLOSE_HOUR = 19;

  const updateOpenStatus = () => {
    const now = new Date();
    const day = now.getUTCDay();              // 0 = dimanche
    const hour = now.getUTCHours() + now.getUTCMinutes() / 60;
    const open = day !== 0 && hour >= OPEN_HOUR && hour < CLOSE_HOUR;
    openStatus.className = `badge rounded-pill ${open ? 'text-bg-success' : 'text-bg-secondary'}`;
    openStatus.innerHTML = open
      ? '<i class="bi bi-circle-fill me-1 blink" aria-hidden="true"></i>Ouvert maintenant'
      : '<i class="bi bi-moon-fill me-1" aria-hidden="true"></i>Fermé actuellement';
  };
  updateOpenStatus();
  window.setInterval(updateOpenStatus, 60000);
})();
