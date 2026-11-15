// Datos iniciales y presets para Pollos Reis

export const GENETIC_PRESETS = {
  // Ponedoras
  'lohmann-brown': {
    name: 'Lohmann Brown (Ponedora)',
    type: 'layer',
    desc: 'Excelente ponedora de huevos marrones grandes, muy dócil y resistente.',
    peakProduction: 94, // % postura pico
    targetWeightAdult: 2.0, // kg
    eggsPerYear: 310,
    dailyFeedAdult: 115, // gramos por ave por día
    targetCurves: [
      { week: 18, eggRate: 15, weight: 1.50 },
      { week: 20, eggRate: 50, weight: 1.65 },
      { week: 24, eggRate: 92, weight: 1.85 },
      { week: 30, eggRate: 94, weight: 1.95 },
      { week: 40, eggRate: 88, weight: 2.00 },
      { week: 50, eggRate: 82, weight: 2.05 },
      { week: 60, eggRate: 76, weight: 2.10 },
      { week: 70, eggRate: 70, weight: 2.12 },
    ]
  },
  'hyline-brown': {
    name: 'Hy-Line Brown (Ponedora)',
    type: 'layer',
    desc: 'Líder mundial en conversión para huevos marrones de cáscara muy fuerte.',
    peakProduction: 95,
    targetWeightAdult: 1.95,
    eggsPerYear: 320,
    dailyFeedAdult: 110,
    targetCurves: [
      { week: 18, eggRate: 20, weight: 1.48 },
      { week: 22, eggRate: 85, weight: 1.75 },
      { week: 26, eggRate: 95, weight: 1.90 },
      { week: 35, eggRate: 90, weight: 1.98 },
      { week: 50, eggRate: 84, weight: 2.02 },
      { week: 65, eggRate: 75, weight: 2.05 }
    ]
  },
  // Parrilleros / Engorde
  'cobb-500': {
    name: 'Cobb 500 (Engorde / Parrillero)',
    type: 'broiler',
    desc: 'El pollo parrillero más popular del mundo. Crecimiento rápido, pechuga carnosa y gran conversión.',
    targetFCR: 1.65,
    targetDaysToMarket: 42,
    targetWeightGrams: 2850,
    targetCurves: [
      { day: 7, weight: 190, feedCum: 170 },
      { day: 14, weight: 480, feedCum: 510 },
      { day: 21, weight: 970, feedCum: 1180 },
      { day: 28, weight: 1610, feedCum: 2190 },
      { day: 35, weight: 2320, feedCum: 3480 },
      { day: 42, weight: 3010, feedCum: 5020 }
    ]
  },
  'ross-308': {
    name: 'Ross 308 (Engorde / Parrillero)',
    type: 'broiler',
    desc: 'Excelente rendimiento de pechuga, rusticidad y tasa de crecimiento uniforme.',
    targetFCR: 1.62,
    targetDaysToMarket: 42,
    targetWeightGrams: 2900,
    targetCurves: [
      { day: 7, weight: 195, feedCum: 165 },
      { day: 14, weight: 490, feedCum: 500 },
      { day: 21, weight: 990, feedCum: 1160 },
      { day: 28, weight: 1640, feedCum: 2150 },
      { day: 35, weight: 2360, feedCum: 3420 },
      { day: 42, weight: 3080, feedCum: 4950 }
    ]
  },
  // Variedad de Campo / Criollas
  'criolla-mixta': {
    name: 'Gallina Criolla / Casera de Campo (Mixta)',
    type: 'mixed',
    desc: 'Aves de traspatio muy rústicas, doble propósito (huevo casero y carne de campo sabrosa). Resisten mejor el clima.',
    peakProduction: 65,
    targetWeightAdult: 2.4,
    eggsPerYear: 180,
    dailyFeedAdult: 120,
    targetCurves: [
      { month: 1, weight: 0.35 },
      { month: 2, weight: 0.80 },
      { month: 3, weight: 1.40 },
      { month: 4, weight: 1.90 },
      { month: 5, weight: 2.30 }
    ]
  }
};

export const INITIAL_BATCHES = [
  {
    id: 'lote-ponedoras-1',
    name: 'Galpón 1 - Ponedoras Lohmann',
    type: 'layer', // 'layer', 'broiler', 'mixed'
    breed: 'lohmann-brown',
    initialQuantity: 250,
    startDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // hace 25 días
    startAgeDays: 126, // ingresaron a las 18 semanas (126 días) listas para postura
    notes: 'Primer lote de ponedoras marrones. Alimento postura fase 1.',
    logs: [
      {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mortality: 0,
        feedKg: 28.5,
        waterLiters: 55,
        eggsTotal: 205,
        eggsBroken: 2,
        eggsDirty: 3,
        tempC: 22,
        notes: 'Buen consumo. Agua con electrolitos.'
      },
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mortality: 1,
        mortalityReason: 'Prolapso',
        feedKg: 29.0,
        waterLiters: 58,
        eggsTotal: 212,
        eggsBroken: 1,
        eggsDirty: 2,
        tempC: 23,
        notes: 'Postura en alza.'
      },
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mortality: 0,
        feedKg: 29.0,
        waterLiters: 60,
        eggsTotal: 218,
        eggsBroken: 3,
        eggsDirty: 2,
        tempC: 24,
        notes: 'Excelente calidad de cáscara.'
      }
    ],
    vaccines: [
      { name: 'Marek (en incubadora)', day: 1, date: '2026-08-01', applied: true },
      { name: 'Newcastle + Bronquitis', day: 21, date: '2026-08-22', applied: true },
      { name: 'Gumboro Refuerzo', day: 35, date: '2026-09-05', applied: true },
      { name: 'Triple Aviar (Oleosa)', day: 110, date: '2026-11-01', applied: true },
    ],
    treatments: [
      {
        name: 'Complejo Vitamínico AD3E',
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daysDuration: 3,
        withdrawalDays: 0, // no tiene retiro
        notes: 'Estimulante al inicio de postura'
      }
    ],
    finances: {
      expenses: [
        { id: 1, concept: 'Compra de 250 pollas de 18 semanas', category: 'aves', amount: 1250000, date: '2026-10-20' },
        { id: 2, concept: 'Alimento Postura (10 bolsas de 40kg)', category: 'alimento', amount: 320000, date: '2026-10-22' },
        { id: 3, concept: 'Vitaminas y Calcio', category: 'sanidad', amount: 45000, date: '2026-10-25' },
        { id: 4, concept: 'Viruta limpia para nidos', category: 'instalaciones', amount: 30000, date: '2026-10-21' }
      ],
      sales: [
        { id: 101, concept: 'Venta de 15 maples de huevos frescos', quantity: 15, unit: 'maple', unitPrice: 4200, total: 63000, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { id: 102, concept: 'Venta de 18 maples a verdulería vecina', quantity: 18, unit: 'maple', unitPrice: 4200, total: 75600, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
      ]
    }
  },
  {
    id: 'lote-parrilleros-1',
    name: 'Galpón 2 - Parrilleros Cobb 500',
    type: 'broiler',
    breed: 'cobb-500',
    initialQuantity: 300,
    startDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // hace 21 días (día 21 de vida)
    startAgeDays: 1, // entraron como BBs de 1 día
    notes: 'Lote de engorde de verano. Cama de cáscara de arroz nueva.',
    logs: [
      {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mortality: 1,
        mortalityReason: 'Aplastamiento',
        feedKg: 34.0,
        waterLiters: 70,
        avgSampleWeightGrams: 910,
        tempC: 25,
        notes: 'Fin de etapa iniciador, pasando a terminador.'
      },
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mortality: 0,
        feedKg: 36.5,
        waterLiters: 75,
        avgSampleWeightGrams: 985,
        tempC: 24,
        notes: 'Excelente vitalidad. Ganancia de peso en curva ideal.'
      }
    ],
    vaccines: [
      { name: 'Marek (incubadora)', day: 1, date: '2026-10-25', applied: true },
      { name: 'Bronquitis Infecciosa (H120 en gota ocular)', day: 1, date: '2026-10-25', applied: true },
      { name: 'Gumboro intermedia', day: 12, date: '2026-11-06', applied: true },
      { name: 'Newcastle Clon 30', day: 18, date: '2026-11-12', applied: true }
    ],
    treatments: [],
    finances: {
      expenses: [
        { id: 201, concept: 'Compra 300 pollitos BB Cobb 500', category: 'aves', amount: 360000, date: '2026-10-25' },
        { id: 202, concept: 'Alimento Iniciador (6 bolsas x 40kg)', category: 'alimento', amount: 198000, date: '2026-10-25' },
        { id: 203, concept: 'Garrafa gas para campana calefactora', category: 'energia', amount: 35000, date: '2026-10-26' }
      ],
      sales: []
    }
  },
  {
    id: 'lote-variedad-campo',
    name: 'Sector Corral - Gallinas Criollas y Caseras',
    type: 'mixed',
    breed: 'criolla-mixta',
    initialQuantity: 45,
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startAgeDays: 60,
    notes: 'Gallinas criollas de libre pastoreo y corral. Variedad de colores.',
    logs: [
      {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mortality: 0,
        feedKg: 5.5,
        waterLiters: 12,
        eggsTotal: 22,
        eggsBroken: 0,
        eggsDirty: 1,
        tempC: 21,
        notes: 'Pastorean durante la tarde. Grano de maíz molido + sobras de huerta.'
      }
    ],
    vaccines: [
      { name: 'Triple aviar y desparasitante interno', day: 45, date: '2026-10-15', applied: true }
    ],
    treatments: [],
    finances: {
      expenses: [
        { id: 301, concept: 'Maíz partido y núcleo casero', category: 'alimento', amount: 42000, date: '2026-10-10' }
      ],
      sales: [
        { id: 302, concept: 'Venta de 5 docenas huevos camperos', quantity: 5, unit: 'docena', unitPrice: 2000, total: 10000, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
      ]
    }
  }
];

