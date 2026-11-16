/* ==========================================================================
   pages/solutions.js — Simulateur de financement (crédit et LLD)
   Les calculs sont indicatifs et pédagogiques.
   ========================================================================== */
'use strict';

(() => {
  const { esc, formatEuro, getParam, monthlyPayment, storage } = MAS.utils;

  const CREDIT_RATE = 0.049;   // taux annuel fixe du crédit
  const LLD_RATE = 0.055;      // taux implicite de la location
  const STORAGE_KEY = 'mas-simulation';

  /** Valeur résiduelle estimée en LLD : la voiture perd de la valeur avec le temps. */
  const residualRatio = (months) => Math.max(0.35, 0.7 - months * 0.005);

  /**
   * Loyer de location longue durée (méthode amortissement + frais financiers).
   * @returns {{monthly:number, depreciation:number, finance:number}}
   */
  const leasePayment = (price, apport, months, annualRate) => {
    const residual = price * residualRatio(months);
    const capital = Math.max(price - apport, residual);
    const depreciation = (capital - residual) / months;
    const finance = (capital + residual) * (annualRate / 24);
    return { monthly: depreciation + finance, residual };
  };

  const el = (id) => document.getElementById(id);
  const form = el('simulator');
  const model = el('simModel');

  model.innerHTML = MAS.cars
    .slice()
    .sort((a, b) => a.price - b.price)
    .map((c) => `<option value="${esc(c.id)}">${esc(c.name)} - ${formatEuro(c.price)}</option>`)
    .join('');

  /* ---------- Restauration : URL (?modele=) puis dernière simulation ---------- */
  const saved = storage.get(STORAGE_KEY, {});
  const fromUrl = getParam('modele');
  if (MAS.getCar(fromUrl)) model.value = fromUrl;
  else if (MAS.getCar(saved.model)) model.value = saved.model;
  if (Number.isFinite(saved.apport)) el('simApport').value = saved.apport;
  if (Number.isFinite(saved.duree)) el('simDuree').value = saved.duree;
  if (saved.type === 'lld') el('simLld').checked = true;

  const update = () => {
    const car = MAS.getCar(model.value);
    const type = form.elements.simType.value;
    const apportPct = Number(el('simApport').value);
    const months = Number(el('simDuree').value);
    const apport = Math.round(car.price * (apportPct / 100));

    el('simThumb').src = car.images[0];
    el('simThumb').alt = `Maserati ${car.name}`;
    el('simApportValue').textContent = `${apportPct} % · ${formatEuro(apport)}`;
    el('simDureeValue').textContent = `${months} mois (${months / 12} an${months > 12 ? 's' : ''})`;

    let monthly;
    let capital;
    let interest;

    if (type === 'credit') {
      capital = car.price - apport;
      monthly = monthlyPayment(capital, CREDIT_RATE, months);
      interest = monthly * months - capital;
      el('simLabel').textContent = 'Votre mensualité de crédit estimée';
      el('simCapitalLabel').textContent = 'Montant financé';
      el('simInterestLabel').textContent = 'Coût des intérêts';
      el('simLegal').textContent = `Crédit à taux fixe indicatif de ${String(CREDIT_RATE * 100).replace('.', ',')} %. Simulation non contractuelle, sous réserve d'acceptation du dossier.`;
    } else {
      const lease = leasePayment(car.price, apport, months, LLD_RATE);
      monthly = lease.monthly;
      capital = car.price - apport - lease.residual;
      interest = monthly * months - Math.max(capital, 0);
      el('simLabel').textContent = 'Votre loyer mensuel estimé';
      el('simCapitalLabel').textContent = 'Usage du véhicule';
      el('simInterestLabel').textContent = 'Frais de location';
      el('simLegal').textContent = `Valeur de rachat en fin de contrat : ${formatEuro(lease.residual)}. Entretien inclus. Simulation non contractuelle.`;
    }

    capital = Math.max(capital, 0);
    interest = Math.max(interest, 0);
    const total = apport + monthly * months;

    el('simResult').textContent = `${formatEuro(Math.round(monthly))} / mois`;
    el('simCapital').textContent = formatEuro(Math.round(capital));
    el('simInterest').textContent = formatEuro(Math.round(interest));
    el('simApportAmount').textContent = formatEuro(apport);
    el('simTotal').textContent = formatEuro(Math.round(total));

    const sum = capital + interest || 1;
    el('simBarCapital').style.width = `${(capital / sum) * 100}%`;
    el('simBarInterest').style.width = `${(interest / sum) * 100}%`;

    el('simCta').href = `contact.html?sujet=financement&modele=${encodeURIComponent(car.id)}`;

    storage.set(STORAGE_KEY, { model: car.id, type, apport: apportPct, duree: months });
  };

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', (e) => e.preventDefault());
  update();
})();
