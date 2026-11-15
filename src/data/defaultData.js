// Datos reales de la granja extraídos del chat "LA ESTANCIERA"

export const GENETIC_PRESETS = {
  // Ponedoras
  'hyline-brown': {
    name: 'Hy-Line Brown (Ponedora La Estanciera)',
    type: 'layer',
    desc: 'Líder mundial en postura de huevo marrón. Excelente para pastoreo y carro móvil, muy rústica.',
    peakProduction: 95,
    targetWeightAdult: 1.95,
    eggsPerYear: 320,
    dailyFeedAdult: 110, // gramos por ave por día (~4.4 kg diarios para 40 aves)
    targetCurves: [
      { week: 18, eggRate: 5, weight: 1.50 },
      { week: 20, eggRate: 30, weight: 1.65 },
      { week: 22, eggRate: 75, weight: 1.78 },
      { week: 25, eggRate: 94, weight: 1.88 },
      { week: 35, eggRate: 92, weight: 1.95 },
      { week: 50, eggRate: 85, weight: 2.00 }
    ]
  },
  'lohmann-brown': {
    name: 'Lohmann Brown (Ponedora)',
    type: 'layer',
    desc: 'Excelente ponedora de huevos marrones grandes, muy dócil y resistente.',
    peakProduction: 94,
    targetWeightAdult: 2.0,
    eggsPerYear: 310,
    dailyFeedAdult: 115
  },
  'cobb-500': {
    name: 'Cobb 500 (Engorde / Parrillero)',
    type: 'broiler',
    desc: 'El pollo parrillero más popular del mundo. Crecimiento rápido y pechuga carnosa.',
    targetFCR: 1.65,
    targetDaysToMarket: 42,
    targetWeightGrams: 2850
  },
  'criolla-mixta': {
    name: 'Gallinas Mixtas y Comunes de Corral',
    type: 'mixed',
    desc: 'Gallinas de campo caseras de doble propósito (huevo campero y carne sabrosa).',
    peakProduction: 65,
    targetWeightAdult: 2.4,
    eggsPerYear: 180,
    dailyFeedAdult: 120
  }
};

export const INITIAL_BATCHES = [
  {
    id: 'lote-la-estanciera-40',
    name: 'La Estanciera - 40 Hy-Line Brown 🐓',
    type: 'layer',
    breed: 'hyline-brown',
    initialQuantity: 40,
    startDate: '2026-11-01',
    startAgeDays: 130, // Alrededor de semana 18-19 (iniciando postura en noviembre)
    notes: 'Plantel de 40 Hy-Line Brown compradas en Cabaña La Escondida. Sistema de carro móvil con pastoreo y redes.',
    // Registro de gallinas identificadas por anillo en observación
    specialObservations: [
      { tag: '072', note: 'Sangre en observación', date: '2026-11-01', status: 'alerta' },
      { tag: '073', note: 'Caidona', date: '2026-11-01', status: 'recuperada' },
      { tag: '080', note: 'Caidona', date: '2026-11-01', status: 'atencion' },
      { tag: '058', note: 'Caidona', date: '2026-11-01', status: 'atencion' },
      { tag: '009', note: 'Gallina renga', date: '2026-11-11', status: 'cuidado' }
    ],
    logs: [
      {
        date: '2026-11-02',
        mortality: 0,
        feedKg: 2.0,
        waterLiters: 15,
        eggsTotal: 0,
        eggsBroken: 0,
        eggsDirty: 0,
        tempC: 22,
        notes: '10:00h Soleado. Levanté cortinas caídas, repuse 2kg balanceado volcado, lavé pisos y bebederos, reparé provisorio comedero.'
      },
      {
        date: '2026-11-03',
        mortality: 0,
        feedKg: 4.0, // 2kg + 1.5kg balanceado + 500g maíz
        waterLiters: 15,
        eggsTotal: 0,
        eggsBroken: 0,
        eggsDirty: 0,
        tempC: 20,
        notes: 'Lluvia 14:00. Se cambió canilla del patito del tanque. Cortinas al sur por lluvia. 1.5kg balanceado + 500g maíz.'
      },
      {
        date: '2026-11-04',
        mortality: 0,
        feedKg: 4.0,
        waterLiters: 18,
        eggsTotal: 0,
        eggsBroken: 0,
        eggsDirty: 0,
        tempC: 23,
        notes: 'Prueba de verduras: Menta picada 👍, Zanahoria rallada 🤏, Repollo blanco 👎. Control de agua y comederos.'
      },
      {
        date: '2026-11-05',
        mortality: 0,
        feedKg: 4.0,
        waterLiters: 18,
        eggsTotal: 0,
        eggsBroken: 0,
        eggsDirty: 0,
        tempC: 24,
        notes: 'Primer día libre. Se movió el carro y se colocaron redes. Apertura de techos. Vigilar chimangos.'
      },
      {
        date: '2026-11-06',
        mortality: 0,
        feedKg: 4.0,
        waterLiters: 16,
        eggsTotal: 0,
        eggsBroken: 0,
        eggsDirty: 0,
        tempC: 21,
        notes: 'Las perchas funcionaron bien, estaban en las más altas. Apertura de techos.'
      },
      {
        date: '2026-11-08',
        mortality: 0,
        feedKg: 8.0, // 4kg a las 07:00 + 4kg a las 12:45
        waterLiters: 20,
        eggsTotal: 0,
        eggsBroken: 0,
        eggsDirty: 0,
        tempC: 22,
        notes: '07:00 fresco. 4kg balanceado + maíz. 12:45 repuse otros 4kg. Baldeo. Salida ordenada por minipuerta.'
      },
      {
        date: '2026-11-09',
        mortality: 0,
        feedKg: 4.0,
        waterLiters: 18,
        eggsTotal: 0,
        eggsBroken: 0,
        eggsDirty: 0,
        tempC: 23,
        notes: '07:00 Soleado. 4kg balanceado + extras. Baldeo del gallinero.'
      },
      {
        date: '2026-11-10',
        mortality: 0,
        feedKg: 4.0,
        waterLiters: 20,
        eggsTotal: 1, // ¡PRIMER HUEVO!
        eggsBroken: 0,
        eggsDirty: 0,
        tempC: 24,
        notes: '🥚 ¡PRIMER HUEVO DE LA COSECHA! Huevo fresco de 47 gramos. Se quitó tabla de los nidos.'
      },
      {
        date: '2026-11-11',
        mortality: 0,
        feedKg: 8.0, // 4kg mañana + 4kg mediodía
        waterLiters: 18,
        eggsTotal: 0,
        eggsBroken: 0,
        eggsDirty: 0,
        tempC: 23,
        notes: '07:00 y 12:00. Ración de conchilla. Numeración de lote. Gallina 009 renga.'
      },
      {
        date: '2026-11-13',
        mortality: 0,
        feedKg: 8.0, // 4kg Dapa + 4kg La Palmera
        waterLiters: 16,
        eggsTotal: 2,
        eggsBroken: 0,
        eggsDirty: 0,
        tempC: 21,
        notes: 'Llovizna. 4kg balanceado Dapa + 4kg La Palmera. Inicio tratamiento: Rumivitam 1cm3/L + Piperazina 1g/L + chorro vinagre.'
      },
      {
        date: '2026-11-14',
        mortality: 0,
        feedKg: 4.0, // 4kg La Palmera
        waterLiters: 16,
        eggsTotal: 5, // ¡5 HUEVOS!
        eggsBroken: 0,
        eggsDirty: 0,
        tempC: 22,
        notes: 'POSTURA: 5 huevos. 4kg balanceado La Palmera. Día 2 tratamiento Rumivitam + Piperazina + vinagre.'
      },
      {
        date: '2026-11-15',
        mortality: 0,
        feedKg: 4.0,
        waterLiters: 16,
        eggsTotal: 6,
        eggsBroken: 0,
        eggsDirty: 0,
        tempC: 21,
        notes: 'Cambio de parcela en pastoreo. Gallinero semi abierto. Día 3 tratamiento Rumivitam 1cm3 + Piperazina 1g/L + vinagre.'
      }
    ],
    vaccines: [
      { name: 'Plan Cabaña La Escondida (Marek)', day: 1, date: '2026-07-01', applied: true },
      { name: 'Newcastle + Bronquitis (La Escondida)', day: 21, date: '2026-07-22', applied: true },
      { name: 'Gumboro (La Escondida)', day: 35, date: '2026-08-05', applied: true },
      { name: 'Triple Aviar (La Escondida)', day: 110, date: '2026-10-15', applied: true }
    ],
    treatments: [
      {
        id: 1,
        name: 'Rumivitam (Vitamina) + Piperazina 100 (Antiparasitario) + Vinagre',
        startDate: '2026-11-13',
        daysDuration: 3,
        withdrawalDays: 1, // Retiro preventivo
        notes: '1 cm3 Rumivitam x litro + 1 g Piperazina 100 x litro de agua + chorrito de vinagre de manzana.'
      }
    ],
    finances: {
      expenses: [
        { id: 1, concept: 'Compra Plantel 40 pollas Hy-Line Brown (La Escondida)', category: 'aves', amount: 240000, date: '2026-10-28' },
        { id: 2, concept: 'Alimento Balanceado Dapa y La Palmera', category: 'alimento', amount: 48000, date: '2026-11-01' },
        { id: 3, concept: 'Maíz partido + Conchilla de calcio', category: 'alimento', amount: 15000, date: '2026-11-03' },
        { id: 4, concept: 'Antiparasitario Piperazina 100 y Rumivitam', category: 'sanidad', amount: 22000, date: '2026-11-12' },
        { id: 5, concept: 'Canilla de repuesto y accesorios tanque', category: 'instalaciones', amount: 8500, date: '2026-11-03' }
      ],
      sales: [
        { id: 101, concept: 'Cosecha inicial de huevos frescos de campo (consumo familiar / primeros maples)', quantity: 14, unit: 'huevo', unitPrice: 350, total: 4900, date: '2026-11-15' }
      ]
    }
  },
  {
    id: 'corral-2-mixtas',
    name: 'Gallinero 2 - Gallinas Mixtas / Comunes 🐓',
    type: 'mixed',
    breed: 'criolla-mixta',
    initialQuantity: 20, // Esperando datos exactos del usuario
    startDate: '2026-11-01',
    startAgeDays: 180,
    notes: 'Segundo corral de gallinas criollas y comunes de campo. Pendiente de cargar cantidades exactas.',
    logs: [],
    vaccines: [
      { name: 'Desparasitante interno y vitaminas', day: 60, applied: true }
    ],
    treatments: [],
    finances: {
      expenses: [],
      sales: []
    }
  }
];
