// Utilidades y fórmulas matemáticas avícolas profesionales para Pollos Reis

export function calculateBatchMetrics(batch) {
  if (!batch) return null;

  const logs = batch.logs || [];
  const initialQty = batch.initialQuantity || 1;
  const startDate = new Date(batch.startDate || Date.now());
  const now = new Date();
  
  // Días de crianza desde inicio
  const diffTime = Math.max(0, now - startDate);
  const daysInBatch = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const currentAgeDays = (batch.startAgeDays || 1) + daysInBatch;
  const currentAgeWeeks = Math.floor(currentAgeDays / 7);

  // Mortalidad
  const totalMortality = logs.reduce((acc, log) => acc + (Number(log.mortality) || 0), 0);
  const currentLivingBirds = Math.max(0, initialQty - totalMortality);
  const viabilityPercent = ((currentLivingBirds / initialQty) * 100).toFixed(1);
  const mortalityPercent = ((totalMortality / initialQty) * 100).toFixed(1);

  // Alimento
  const totalFeedKg = logs.reduce((acc, log) => acc + (Number(log.feedKg) || 0), 0);
  const totalFeedBags40 = (totalFeedKg / 40).toFixed(1);

  // Consumo último día
  const lastLog = logs.length > 0 ? logs[logs.length - 1] : null;
  const todayFeedKg = lastLog ? (Number(lastLog.feedKg) || 0) : 0;
  const feedGramsPerBirdDay = currentLivingBirds > 0 ? Math.round((todayFeedKg * 1000) / currentLivingBirds) : 0;
  const todayWaterLiters = lastLog ? (Number(lastLog.waterLiters) || 0) : 0;

  // Específico para Ponedoras (Huevos)
  const totalEggs = logs.reduce((acc, log) => acc + (Number(log.eggsTotal) || 0), 0);
  const totalEggsBroken = logs.reduce((acc, log) => acc + (Number(log.eggsBroken) || 0), 0);
  const totalEggsDirty = logs.reduce((acc, log) => acc + (Number(log.eggsDirty) || 0), 0);
  const totalMaples = (totalEggs / 30).toFixed(1); // 1 maple = 30 huevos
  
  const todayEggs = lastLog ? (Number(lastLog.eggsTotal) || 0) : 0;
  const todayEggRate = currentLivingBirds > 0 ? ((todayEggs / currentLivingBirds) * 100).toFixed(1) : 0;
  const todayMaples = (todayEggs / 30).toFixed(1);

  // Específico para Parrilleros / Engorde (Peso y FCR)
  let latestSampleWeightGrams = 0;
  for (let i = logs.length - 1; i >= 0; i--) {
    if (logs[i].avgSampleWeightGrams) {
      latestSampleWeightGrams = Number(logs[i].avgSampleWeightGrams);
      break;
    }
  }

  // Si no hay pesaje registrado aún, estimar según la curva de edad
  if (latestSampleWeightGrams === 0) {
    if (batch.type === 'broiler') {
      latestSampleWeightGrams = Math.min(3200, Math.round(currentAgeDays * 55));
    } else {
      latestSampleWeightGrams = 1800;
    }
  }

  const latestSampleWeightKg = (latestSampleWeightGrams / 1000).toFixed(2);
  const totalLiveBiomassKg = (currentLivingBirds * (latestSampleWeightGrams / 1000));
  
  // FCR (Conversión alimenticia)
  // FCR = Total alimento consumido / Total biomasa ganada
  const initialWeightTotalKg = (initialQty * 0.042); // 42 gramos pollito BB
  const netWeightGainKg = Math.max(1, totalLiveBiomassKg - initialWeightTotalKg);
  const fcr = totalFeedKg > 0 ? (totalFeedKg / netWeightGainKg).toFixed(2) : '1.65';

  // Ganancia Diaria de Peso (GDP) en gramos
  const gdp = currentAgeDays > 0 ? Math.round((latestSampleWeightGrams - 42) / currentAgeDays) : 0;

  // IEE / EPEF (Índice Europeo de Eficiencia Productiva)
  // Fórmula oficial: (Viabilidad % * Peso vivo medio en kg) / (Edad en días * FCR) * 100
  let epef = 0;
  if (currentAgeDays > 0 && Number(fcr) > 0) {
    epef = Math.round((Number(viabilityPercent) * Number(latestSampleWeightKg) / (currentAgeDays * Number(fcr))) * 100);
  }

  // Estado de Retiro Sanitario (Medicamentos)
  const treatments = batch.treatments || [];
  let isUnderWithdrawal = false;
  let activeTreatmentName = '';
  let daysRemainingWithdrawal = 0;

  treatments.forEach(t => {
    if (t.withdrawalDays && t.withdrawalDays > 0) {
      const treatStart = new Date(t.startDate);
      const totalTreatDays = (t.daysDuration || 1) + t.withdrawalDays;
      const daysPassed = Math.floor((now - treatStart) / (1000 * 60 * 60 * 24));
      const remaining = totalTreatDays - daysPassed;
      if (remaining > 0) {
        isUnderWithdrawal = true;
        activeTreatmentName = t.name;
        daysRemainingWithdrawal = Math.max(daysRemainingWithdrawal, remaining);
      }
    }
  });

  // Finanzas
  const expenses = batch.finances?.expenses || [];
  const sales = batch.finances?.sales || [];

  const totalExpenses = expenses.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const totalSales = sales.reduce((acc, item) => acc + (Number(item.total) || 0), 0);
  const netProfit = totalSales - totalExpenses;

  const costPerBird = currentLivingBirds > 0 ? Math.round(totalExpenses / currentLivingBirds) : 0;
  const costPerKgLive = totalLiveBiomassKg > 0 ? Math.round(totalExpenses / totalLiveBiomassKg) : 0;
  const costPerMaple = Number(totalMaples) > 0 ? Math.round(totalExpenses / Number(totalMaples)) : 0;

  // Control de Stock de Alimento (como en El Capataz)
  const initialStockKg = Number(batch.feedStockKg) || 160; // 4 bolsas x 40kg
  const remainingStockKg = Math.max(0, initialStockKg - totalFeedKg);
  const remainingBags40 = (remainingStockKg / 40).toFixed(1);
  const estimatedDaysOfFeedRemaining = todayFeedKg > 0 
    ? Math.floor(remainingStockKg / todayFeedKg) 
    : (currentLivingBirds > 0 ? Math.floor(remainingStockKg / (currentLivingBirds * 0.11)) : 20);

  return {
    initialQty,
    currentLivingBirds,
    totalMortality,
    viabilityPercent,
    mortalityPercent,
    daysInBatch,
    currentAgeDays,
    currentAgeWeeks,
    totalFeedKg,
    totalFeedBags40,
    todayFeedKg,
    feedGramsPerBirdDay,
    todayWaterLiters,
    totalEggs,
    totalEggsBroken,
    totalEggsDirty,
    totalMaples,
    todayEggs,
    todayEggRate,
    todayMaples,
    latestSampleWeightGrams,
    latestSampleWeightKg,
    totalLiveBiomassKg: Math.round(totalLiveBiomassKg),
    fcr,
    gdp,
    epef,
    isUnderWithdrawal,
    activeTreatmentName,
    daysRemainingWithdrawal,
    totalExpenses,
    totalSales,
    netProfit,
    costPerBird,
    costPerKgLive,
    costPerMaple,
    initialStockKg,
    remainingStockKg,
    remainingBags40,
    estimatedDaysOfFeedRemaining
  };
}

export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '$ 0';
  return '$ ' + Number(amount).toLocaleString('es-AR');
}

