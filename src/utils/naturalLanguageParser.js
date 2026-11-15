// Parser inteligente en español de campo para Pollos Reis
// Permite decir: "Che, hoy murieron 2 pollos aplastados, juntamos 210 huevos con 3 rotos y comieron 30 kilos"

export function parseNaturalLog(text, currentBatchType = 'layer') {
  if (!text || typeof text !== 'string') return null;

  const clean = text.toLowerCase().trim();
  const result = {
    detected: false,
    mortality: 0,
    mortalityReason: '',
    eggsTotal: 0,
    eggsBroken: 0,
    eggsDirty: 0,
    feedKg: 0,
    waterLiters: 0,
    avgSampleWeightGrams: 0,
    notes: text.trim(),
    summary: []
  };

  // 1. Detección de Bajas / Mortalidad
  // Ej: "murieron 2", "2 bajas", "se murio 1", "2 gallinas muertas"
  const mortMatch1 = clean.match(/(?:murieron|murió|murio|bajas?|muert(?:os?|as?))\s*(\d+)/);
  const mortMatch2 = clean.match(/(\d+)\s*(?:bajas?|muert(?:os?|as?)|pollos? muertos?|gallinas? muertas?)/);
  
  if (mortMatch1) {
    result.mortality = parseInt(mortMatch1[1]);
    result.detected = true;
  } else if (mortMatch2) {
    result.mortality = parseInt(mortMatch2[1]);
    result.detected = true;
  }

  // Causa de la baja
  if (result.mortality > 0) {
    if (clean.includes('calor') || clean.includes('asfixia') || clean.includes('ahog')) {
      result.mortalityReason = 'Calor/Asfixia';
    } else if (clean.includes('aplastad') || clean.includes('pisad')) {
      result.mortalityReason = 'Aplastamiento';
    } else if (clean.includes('pata') || clean.includes('coj')) {
      result.mortalityReason = 'Patas';
    } else if (clean.includes('flaca') || clean.includes('débil') || clean.includes('debil') || clean.includes('descarte')) {
      result.mortalityReason = 'Descarte/Débil';
    } else if (clean.includes('respirat') || clean.includes('moquillo') || clean.includes('tos') || clean.includes('estornud')) {
      result.mortalityReason = 'Respiratorio';
    } else if (clean.includes('prolapso')) {
      result.mortalityReason = 'Prolapso';
    } else {
      result.mortalityReason = 'Descarte';
    }
    result.summary.push(`💀 ${result.mortality} bajas (${result.mortalityReason})`);
  }

  // 2. Detección de Huevos
  // Ej: "210 huevos", "juntamos 180", "7 maples", "sacamos 45 huevos"
  const eggsMatch1 = clean.match(/(\d+)\s*(?:huevos?|postura)/);
  const eggsMatch2 = clean.match(/(?:juntamos|sacamos|recolectamos|cosechamos|pusieron)\s*(\d+)/);
  const maplesMatch = clean.match(/(\d+)\s*maples?/);

  if (maplesMatch) {
    result.eggsTotal = parseInt(maplesMatch[1]) * 30;
    result.detected = true;
    result.summary.push(`🥚 ${result.eggsTotal} huevos (${maplesMatch[1]} maples)`);
  } else if (eggsMatch1) {
    result.eggsTotal = parseInt(eggsMatch1[1]);
    result.detected = true;
    result.summary.push(`🥚 ${result.eggsTotal} huevos (${(result.eggsTotal/30).toFixed(1)} maples)`);
  } else if (eggsMatch2 && currentBatchType !== 'broiler') {
    result.eggsTotal = parseInt(eggsMatch2[1]);
    result.detected = true;
    result.summary.push(`🥚 ${result.eggsTotal} huevos (${(result.eggsTotal/30).toFixed(1)} maples)`);
  }

  // Huevos rotos / feos / descartados
  // Ej: "3 rotos", "2 feos", "3 huevos rotos", "1 quebrado"
  const brokenMatch1 = clean.match(/(\d+)\s*(?:rotos?|feos?|quebrados?|partidos?|rajados?)/);
  const brokenMatch2 = clean.match(/(?:rotos?|feos?|quebrados?|rajados?)\s*(\d+)/);
  if (brokenMatch1) {
    result.eggsBroken = parseInt(brokenMatch1[1]);
    result.summary.push(`💔 ${result.eggsBroken} rotos/feos`);
  } else if (brokenMatch2) {
    result.eggsBroken = parseInt(brokenMatch2[1]);
    result.summary.push(`💔 ${result.eggsBroken} rotos/feos`);
  }

  // Huevos sucios
  const dirtyMatch = clean.match(/(\d+)\s*(?:sucios?|manchados?)/);
  if (dirtyMatch) {
    result.eggsDirty = parseInt(dirtyMatch[1]);
    result.summary.push(`🧽 ${result.eggsDirty} sucios`);
  }

  // 3. Detección de Alimento
  // Ej: "comieron 30 kilos", "30 kg de alimento", "1 bolsa de comida"
  const bagsMatch = clean.match(/(\d+)\s*bolsas?\s*(?:de\s*(?:alimento|comida|racion))?/);
  const feedMatch1 = clean.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|kilos?)\s*(?:de\s*(?:alimento|comida|racion))?/);
  const feedMatch2 = clean.match(/(?:comieron|alimento|comida|racion)\s*(\d+(?:[.,]\d+)?)/);

  if (bagsMatch) {
    result.feedKg = parseInt(bagsMatch[1]) * 40; // 40kg por bolsa estándar
    result.detected = true;
    result.summary.push(`🌾 ${result.feedKg} kg de alimento (${bagsMatch[1]} bolsas)`);
  } else if (feedMatch1) {
    result.feedKg = parseFloat(feedMatch1[1].replace(',', '.'));
    result.detected = true;
    result.summary.push(`🌾 ${result.feedKg} kg de alimento`);
  } else if (feedMatch2) {
    result.feedKg = parseFloat(feedMatch2[1].replace(',', '.'));
    result.detected = true;
    result.summary.push(`🌾 ${result.feedKg} kg de alimento`);
  }

  // 4. Detección de Agua
  // Ej: "70 litros", "tomaron 50 litros de agua"
  const waterMatch = clean.match(/(\d+)\s*(?:litros?|lts?|l\b)/);
  if (waterMatch) {
    result.waterLiters = parseInt(waterMatch[1]);
    result.detected = true;
    result.summary.push(`💧 ${result.waterLiters} litros de agua`);
  }

  // 5. Detección de Peso (Parrilleros)
  // Ej: "pesan 950 gramos", "peso 1.2 kg"
  const weightGramsMatch = clean.match(/(\d+)\s*(?:gramos?|grs?|g\b)/);
  const weightKgMatch = clean.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|kilos?)\s*(?:de\s*peso|cada\s*pollo|promedio)?/);
  
  if (weightGramsMatch) {
    result.avgSampleWeightGrams = parseInt(weightGramsMatch[1]);
    result.detected = true;
    result.summary.push(`⚖️ Peso promedio: ${result.avgSampleWeightGrams} g`);
  } else if (weightKgMatch && currentBatchType === 'broiler' && !feedMatch1) {
    result.avgSampleWeightGrams = Math.round(parseFloat(weightKgMatch[1].replace(',', '.')) * 1000);
    result.detected = true;
    result.summary.push(`⚖️ Peso promedio: ${result.avgSampleWeightGrams} g`);
  }

  // Observaciones clínicas / síntomas para la nota
  const symptoms = [];
  if (clean.includes('flaca') || clean.includes('flacas')) symptoms.push('Gallinas flacas');
  if (clean.includes('triste') || clean.includes('decaida') || clean.includes('embolada')) symptoms.push('Aves emboladas/decaídas');
  if (clean.includes('moquillo') || clean.includes('estornudo') || clean.includes('tos')) symptoms.push('Síntomas respiratorios');
  if (clean.includes('sangre') || clean.includes('diarrea')) symptoms.push('Heces anormales');
  if (clean.includes('calor') || clean.includes('jadeo')) symptoms.push('Estrés por calor');

  if (symptoms.length > 0) {
    result.detected = true;
    result.summary.push(`🔍 Observación: ${symptoms.join(', ')}`);
  }

  return result;
}

