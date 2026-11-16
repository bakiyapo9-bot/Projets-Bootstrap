/* ==========================================================================
   data.js — Source unique des données du site (catalogue + crédits photos)
   Toutes les pages lisent ces données : pour ajouter un modèle, il suffit
   d'ajouter une entrée dans MAS.cars.
   ========================================================================== */
'use strict';

window.MAS = window.MAS || {};

/** Catégories de motorisation (clé => libellé, icône Bootstrap Icons, couleur Bootstrap) */
MAS.categories = {
  hybride:    { label: 'Hybride',    icon: 'bi-recycle',          color: 'success' },
  thermique:  { label: 'Thermique',  icon: 'bi-fuel-pump-fill',   color: 'danger'  },
  electrique: { label: 'Électrique', icon: 'bi-lightning-charge-fill', color: 'primary' }
};

/**
 * Catalogue des modèles.
 * Les caractéristiques sont indicatives (pédagogiques) et peuvent varier selon la version.
 */
MAS.cars = [
  {
    id: 'grecale',
    name: 'Grecale',
    body: 'SUV',
    category: 'hybride',
    badge: 'MHEV Hybrid',
    price: 85000,
    featured: true,
    tagline: 'Le juste équilibre entre polyvalence urbaine et audace sportive.',
    desc: "Le SUV Grecale associe technologie hybride légère, habitacle raffiné et confort au quotidien. Redéfinissez vos trajets avec l'agilité d'une sportive.",
    images: ['assets/img/voitures/grecale.jpg', 'assets/img/voitures/grecale-trofeo.jpg', 'assets/img/voitures/grecale-gt.jpg'],
    specs: { power: 300, accel: 5.6, vmax: 240, engine: '4 cyl. 2.0 L MHEV' }
  },
  {
    id: 'levante',
    name: 'Levante Trofeo',
    body: 'SUV',
    category: 'thermique',
    badge: 'V8 Biturbo',
    price: 145000,
    featured: false,
    tagline: 'Le SUV de la marque au Trident dans sa version la plus extrême.',
    desc: "Avec son V8 biturbo assemblé par Ferrari, le Levante Trofeo offre des performances de supercar et une présence imposante sur la route.",
    images: ['assets/img/voitures/levante.jpg'],
    specs: { power: 580, accel: 3.9, vmax: 302, engine: 'V8 3.8 L biturbo' }
  },
  {
    id: 'quattroporte',
    name: 'Quattroporte',
    body: 'Berline',
    category: 'thermique',
    badge: 'V8 Trofeo',
    price: 150000,
    featured: false,
    tagline: "La berline de luxe sportive, icône de l'élégance italienne.",
    desc: "Depuis 1963, la Quattroporte réunit luxe à quatre portes et âme de compétition. Cuirs pleine fleur, boiseries et sonorité envoûtante.",
    images: ['assets/img/voitures/quattroporte.jpg', 'assets/img/voitures/interieur-quattroporte.jpg'],
    specs: { power: 580, accel: 4.5, vmax: 326, engine: 'V8 3.8 L biturbo' }
  },
  {
    id: 'granturismo-trofeo',
    name: 'GranTurismo Trofeo',
    body: 'Coupé',
    category: 'thermique',
    badge: 'V6 Nettuno',
    price: 185000,
    featured: false,
    tagline: 'Le coupé Grand Tourisme propulsé par le V6 Nettuno.',
    desc: "Héritière de 75 ans de Grand Tourisme, la GranTurismo Trofeo embarque le V6 Nettuno issu de la MC20 pour des voyages au long cours à haute vitesse.",
    images: ['assets/img/voitures/granturismo-trofeo.jpg'],
    specs: { power: 550, accel: 3.5, vmax: 320, engine: 'V6 3.0 L Nettuno' }
  },
  {
    id: 'granturismo-folgore',
    name: 'GranTurismo Folgore',
    body: 'Coupé',
    category: 'electrique',
    badge: 'Folgore EV',
    price: 205000,
    featured: true,
    tagline: 'La première Maserati 100 % électrique.',
    desc: "Trois moteurs électriques, plus de 750 chevaux et zéro émission : la GranTurismo Folgore ouvre un nouveau chapitre de l'histoire du Trident.",
    images: ['assets/img/voitures/granturismo-folgore.jpg'],
    specs: { power: 761, accel: 2.7, vmax: 320, engine: '3 moteurs électriques', range: 450 }
  },
  {
    id: 'grancabrio',
    name: 'GranCabrio Folgore',
    body: 'Cabriolet',
    category: 'electrique',
    badge: 'Folgore EV',
    price: 210000,
    featured: false,
    tagline: 'Le Grand Tourisme réinventé, à ciel ouvert et sans émission.',
    desc: "Quatre places enveloppées dans un confort souverain, propulsées par une fureur électrique silencieuse. La capote s'ouvre en 14 secondes.",
    images: ['assets/img/voitures/grancabrio-folgore.jpg', 'assets/img/voitures/grancabrio-trofeo.jpg'],
    specs: { power: 761, accel: 2.8, vmax: 290, engine: '3 moteurs électriques', range: 447 }
  },
  {
    id: 'mc20',
    name: 'MC20',
    body: 'Supercar',
    category: 'thermique',
    badge: 'V6 Nettuno',
    price: 240000,
    featured: true,
    tagline: 'La supercar qui marque le retour du Trident à la compétition.',
    desc: "Monocoque en fibre de carbone, portes papillon et moteur V6 Nettuno à préchambre de combustion : la MC20 est une pure-sang conçue à Modène.",
    images: ['assets/img/voitures/mc20.jpg'],
    specs: { power: 630, accel: 2.9, vmax: 325, engine: 'V6 3.0 L Nettuno' }
  },
  {
    id: 'mc20-cielo',
    name: 'MC20 Cielo',
    body: 'Spider',
    category: 'thermique',
    badge: 'V6 Nettuno',
    price: 270000,
    featured: false,
    tagline: 'Une symphonie mécanique à ciel ouvert.',
    desc: "Structure monocoque en fibre de carbone et toit en verre électrochromique : la MC20 Cielo est conçue pour fendre l'air en toute liberté.",
    images: ['assets/img/voitures/mc20-cielo.webp'],
    specs: { power: 630, accel: 3.0, vmax: 320, engine: 'V6 3.0 L Nettuno' }
  },
  {
    id: 'gt2-stradale',
    name: 'GT2 Stradale',
    body: 'Supercar',
    category: 'thermique',
    badge: 'Racing DNA',
    price: 320000,
    featured: false,
    tagline: 'La voiture de course homologuée pour la route.',
    desc: "Dérivée directement de la MC20 GT2 de compétition, la GT2 Stradale gagne en appui aérodynamique, en légèreté et en précision de pilotage.",
    images: ['assets/img/voitures/gt2-stradale.jpg'],
    specs: { power: 640, accel: 2.8, vmax: 324, engine: 'V6 3.0 L Nettuno' }
  }
];

/** Retrouve un modèle par son identifiant (ou undefined). */
MAS.getCar = (id) => MAS.cars.find((car) => car.id === id);

/**
 * Crédits des photographies (licences libres Wikimedia Commons).
 * Obligatoire pour les licences CC BY-SA : auteur + licence + lien.
 */
MAS.credits = [
  { file: 'grecale-trofeo.jpg', author: 'Alexander Migl', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Maserati_Grecale_Trofeo_1X7A5784.jpg' },
  { file: 'grecale-gt.jpg', author: 'Alexander-93', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Maserati_Grecale_GT_IMG_0544.jpg' },
  { file: 'levante.jpg', author: 'Alexander Migl', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Maserati_Levante_Trofeo_1X7A0371.jpg' },
  { file: 'quattroporte.jpg', author: 'Alexander Migl', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Maserati_Quattroporte_VI_Trofeo_1X7A0312.jpg' },
  { file: 'interieur-quattroporte.jpg', author: 'RpM Tartar', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Maserati_Quattroporte_VI_interior.jpg' },
  { file: 'granturismo-trofeo.jpg', author: 'Alexander-93', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Maserati_GranTurismo_Trofeo_1X7A0829.jpg' },
  { file: 'granturismo-folgore.jpg', author: 'MrWalkr', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:2023_Maserati_GranTurismo_Folgore.jpg' },
  { file: 'grancabrio-trofeo.jpg', author: 'Matti Blume', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Maserati_GranCabrio_Trofeo,_Motortreff_Bella_Italia_2024,_Munich_(P1190428).jpg' },
  { file: 'mc20.jpg', author: 'Alexander Migl', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Maserati_MC20_IAA_2021_1X7A0087.jpg' },
  { file: 'gt2-stradale.jpg', author: 'Charles from Port Chester, New York', license: 'CC0', url: 'https://commons.wikimedia.org/wiki/File:Maserati_GT2Stradale_(2026)_(55082499190).jpg' }
];
