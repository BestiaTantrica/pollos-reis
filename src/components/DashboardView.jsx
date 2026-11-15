import React from 'react';
import { 
  Bird, 
  Egg, 
  Scale, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Wheat, 
  Droplets, 
  CircleDollarSign, 
  PlusCircle, 
  Sparkles, 
  Award,
  Calendar,
  HelpCircle
} from 'lucide-react';
import { formatCurrency } from '../utils/poultryMath';

export default function DashboardView({ 
  batch, 
  metrics, 
  onGoToDaily, 
  onGoToAI, 
  onGoToHealth, 
  onGoToFinance 
}) {
  const isLayer = batch.type === 'layer' || batch.type === 'mixed';
  const isBroiler = batch.type === 'broiler' || batch.type === 'mixed';

  return (
    <div className="space-y-4 pb-20 sm:pb-6">
      {/* Banner de Bienvenida y Estado del Lote */}
      <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
          <img src="/chicken.svg" alt="" className="w-48 h-48" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 text-amber-100 px-2 py-0.5 rounded-full">
                {batch.type === 'layer' ? 'Galpón de Postura' : batch.type === 'broiler' ? 'Galpón de Engorde' : 'Corral Mixto'}
              </span>
              <span className="text-xs text-amber-200">
                Iniciado el {batch.startDate}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              {batch.name}
            </h2>
            <p className="text-xs text-amber-100/90 mt-0.5">
              Raza / Línea: <strong className="text-white capitalize">{batch.breed.replace('-', ' ')}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToDaily}
              className="px-4 py-2 bg-white hover:bg-amber-50 active:scale-95 text-amber-900 rounded-xl font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-amber-700" />
              <span>Cargar Hoy</span>
            </button>
            <button
              onClick={onGoToAI}
              className="px-3 py-2 bg-amber-900/60 hover:bg-amber-900 text-amber-100 rounded-xl font-semibold text-xs transition flex items-center gap-1 border border-amber-500/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Dudas IA</span>
            </button>
          </div>
        </div>

        {/* Barra de progreso de edad y viabilidad */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-amber-500/30 text-center">
          <div className="bg-white/10 rounded-xl p-2 backdrop-blur-sm">
            <span className="text-[10px] text-amber-200 font-medium block">Aves Vivas</span>
            <span className="text-lg font-black text-white">{metrics.currentLivingBirds}</span>
            <span className="text-[10px] text-amber-200 block">de {metrics.initialQty} iniciales</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2 backdrop-blur-sm">
            <span className="text-[10px] text-amber-200 font-medium block">Viabilidad</span>
            <span className="text-lg font-black text-emerald-300">{metrics.viabilityPercent}%</span>
            <span className="text-[10px] text-amber-200 block">{metrics.totalMortality} bajas totales</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2 backdrop-blur-sm">
            <span className="text-[10px] text-amber-200 font-medium block">Edad Actual</span>
            <span className="text-lg font-black text-white">{metrics.currentAgeDays} días</span>
            <span className="text-[10px] text-amber-200 block">({metrics.currentAgeWeeks} semanas)</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2 backdrop-blur-sm">
            <span className="text-[10px] text-amber-200 font-medium block">Alimento Total</span>
            <span className="text-lg font-black text-white">{metrics.totalFeedKg} kg</span>
            <span className="text-[10px] text-amber-200 block">({metrics.totalFeedBags40} bolsas)</span>
          </div>
        </div>
      </div>

      {/* METRICAS ESPECÍFICAS SEGÚN TIPO DE AVE */}
      
      {/* 1. MÓDULO PONEDORAS (Huevos) */}
      {isLayer && (
        <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Egg className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Rendimiento de Postura de Huevos</h3>
                <p className="text-xs text-slate-500">Métricas clave para venta y control</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
              1 Maple = 30 huevos
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-center">
              <span className="text-[11px] text-slate-600 block">Postura de Hoy</span>
              <span className="text-2xl font-black text-amber-900">{metrics.todayEggRate}%</span>
              <span className="text-[10px] text-slate-500 block">{metrics.todayEggs} huevos hoy</span>
            </div>

            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-center">
              <span className="text-[11px] text-slate-600 block">Maples de Hoy</span>
              <span className="text-2xl font-black text-amber-900">{metrics.todayMaples}</span>
              <span className="text-[10px] text-slate-500 block">bandejas completas</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-600 block">Huevos Totales Lote</span>
              <span className="text-2xl font-black text-slate-800">{metrics.totalEggs}</span>
              <span className="text-[10px] text-slate-500 block">({metrics.totalMaples} maples)</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-600 block">Huevos Rotos / Sucios</span>
              <span className="text-xl font-bold text-rose-700">
                {metrics.totalEggsBroken + metrics.totalEggsDirty}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {metrics.totalEggs > 0 ? (((metrics.totalEggsBroken + metrics.totalEggsDirty) / metrics.totalEggs) * 100).toFixed(1) : 0}% de pérdida
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Control de Gallinas en Observación por Anillo (Nonna) */}
      {batch.specialObservations && batch.specialObservations.length > 0 && (
        <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-800">Gallinas en Observación (Control por Anillo)</h3>
            </div>
            <span className="text-[11px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
              {batch.specialObservations.length} identificadas
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
            {batch.specialObservations.map((obs, idx) => (
              <div key={idx} className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2 text-center">
                <span className="text-xs font-black text-amber-900 block font-mono">#{obs.tag}</span>
                <span className="text-[11px] text-slate-700 block font-medium">{obs.note}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MÓDULO PARRILLEROS (Engorde y FCR) */}
      {isBroiler && (
        <div className="bg-white border border-orange-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Crecimiento y Conversión Alimenticia</h3>
                <p className="text-xs text-slate-500">Indicadores profesionales de engorde</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-orange-800 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200">
              <Award className="w-3.5 h-3.5" />
              <span>IEE: {metrics.epef}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-200/60 text-center">
              <span className="text-[11px] text-slate-600 block">Peso Promedio Vivo</span>
              <span className="text-2xl font-black text-orange-900">{metrics.latestSampleWeightGrams} g</span>
              <span className="text-[10px] text-slate-500 block">({metrics.latestSampleWeightKg} kg por pollo)</span>
            </div>

            <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-200/60 text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-[11px] text-slate-600 block">FCR (Conversión)</span>
              </div>
              <span className="text-2xl font-black text-orange-900">{metrics.fcr}</span>
              <span className="text-[10px] text-slate-500 block">kg comida por kg carne</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-600 block">Ganancia Diaria (GDP)</span>
              <span className="text-2xl font-black text-slate-800">{metrics.gdp} g</span>
              <span className="text-[10px] text-slate-500 block">por pollo cada día</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[11px] text-slate-600 block">Carne Total en Pie</span>
              <span className="text-2xl font-black text-slate-800">{metrics.totalLiveBiomassKg} kg</span>
              <span className="text-[10px] text-slate-500 block">biomasa viva total</span>
            </div>
          </div>

          {/* Explicación fácil del IEE */}
          <div className="mt-3 p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200 flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Calificación del lote (IEE Europeo: {metrics.epef}):</strong>{' '}
              {metrics.epef >= 350 ? (
                <span className="text-emerald-700 font-bold">¡Excelente rendimiento comercial! Gran conversión de alimento y baja mortalidad.</span>
              ) : metrics.epef >= 280 ? (
                <span className="text-amber-700 font-bold">Buen rendimiento. Dentro de los estándares normales para granja familiar.</span>
              ) : (
                <span className="text-rose-700 font-bold">Se puede mejorar. Revisa comederos o ventilación para aumentar ganancia diaria.</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TARJETA SANITARIA Y RETIRO */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            metrics.isUnderWithdrawal ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
          }`}>
            {metrics.isUnderWithdrawal ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              Estado Sanitario: {metrics.isUnderWithdrawal ? 'Bajo Período de Retiro' : 'Lote Apto para Consumo / Venta'}
            </h4>
            <p className="text-xs text-slate-500">
              {metrics.isUnderWithdrawal 
                ? `Tratamiento: ${metrics.activeTreatmentName}. Esperar ${metrics.daysRemainingWithdrawal} días antes de faenar o vender.`
                : 'No hay antibióticos activos pendientes. Los productos están libres de residuos.'}
            </p>
          </div>
        </div>
        <button
          onClick={onGoToHealth}
          className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline text-left sm:text-right"
        >
          Ver vacunas y tratamientos →
        </button>
      </div>

      {/* RESUMEN FINANCIERO RÁPIDO */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">Finanzas del Lote</h3>
          </div>
          <button
            onClick={onGoToFinance}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Ver detalle completo →
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Gastos Totales</span>
            <span className="text-sm sm:text-base font-black text-rose-700">
              {formatCurrency(metrics.totalExpenses)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Ventas Cobradas</span>
            <span className="text-sm sm:text-base font-black text-emerald-700">
              {formatCurrency(metrics.totalSales)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Balance Actual</span>
            <span className={`text-sm sm:text-base font-black ${
              metrics.netProfit >= 0 ? 'text-emerald-700' : 'text-slate-700'
            }`}>
              {formatCurrency(metrics.netProfit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

