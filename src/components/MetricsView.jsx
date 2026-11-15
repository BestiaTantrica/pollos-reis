import React, { useState } from 'react';
import { 
  LineChart as ChartIcon, 
  Egg, 
  Scale, 
  Wheat, 
  Skull, 
  Calendar, 
  TrendingUp,
  Info
} from 'lucide-react';
import { GENETIC_PRESETS } from '../data/defaultData';

export default function MetricsView({ batch, metrics }) {
  const [activeMetricTab, setActiveMetricTab] = useState(
    batch.type === 'layer' ? 'eggs' : 'weight'
  );

  const logs = [...(batch.logs || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
  const preset = GENETIC_PRESETS[batch.breed] || GENETIC_PRESETS['cobb-500'];

  // Preparar puntos para gráficos SVG
  const maxEggs = Math.max(...logs.map(l => Number(l.eggsTotal) || 0), 10);
  const maxWeight = Math.max(...logs.map(l => Number(l.avgSampleWeightGrams) || 0), 3000);
  const maxFeed = Math.max(...logs.map(l => Number(l.feedKg) || 0), 40);

  return (
    <div className="space-y-4 pb-20 sm:pb-6">
      {/* Selector de tipo de gráfico */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
        {(batch.type === 'layer' || batch.type === 'mixed') && (
          <button
            onClick={() => setActiveMetricTab('eggs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeMetricTab === 'eggs'
                ? 'bg-white text-amber-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Egg className="w-3.5 h-3.5" />
            <span>Curva de Postura (%)</span>
          </button>
        )}

        {(batch.type === 'broiler' || batch.type === 'mixed') && (
          <button
            onClick={() => setActiveMetricTab('weight')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeMetricTab === 'weight'
                ? 'bg-white text-orange-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Curva de Peso vs Estándar</span>
          </button>
        )}

        <button
          onClick={() => setActiveMetricTab('feed')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
            activeMetricTab === 'feed'
              ? 'bg-white text-amber-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wheat className="w-3.5 h-3.5" />
          <span>Consumo de Ración</span>
        </button>

        <button
          onClick={() => setActiveMetricTab('table')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
            activeMetricTab === 'table'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Planilla Diaria Completa</span>
        </button>
      </div>

      {/* 1. GRÁFICO DE POSTURA */}
      {activeMetricTab === 'eggs' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Evolución de Postura Diaria</h3>
              <p className="text-xs text-slate-500">Huevos totales por fecha en este lote</p>
            </div>
            <span className="text-xs font-extrabold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
              Pico esperado: {preset.peakProduction || 92}%
            </span>
          </div>

          {logs.length < 2 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Se necesitan al menos 2 registros diarios para trazar la curva. ¡Carga datos en "Cargar Hoy"!
            </div>
          ) : (
            <div className="mt-4">
              {/* Gráfico SVG interactivo y ultraliviano */}
              <div className="h-48 w-full bg-slate-50 rounded-xl p-2 relative flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${logs.length * 50} 100`} preserveAspectRatio="none">
                  {/* Línea guía 90% */}
                  <line x1="0" y1="15" x2={logs.length * 50} y2="15" stroke="#cbd5e1" strokeDasharray="3 3" />
                  <text x="5" y="12" fill="#94a3b8" fontSize="8" fontWeight="bold">Línea de 90% postura óptima</text>

                  {/* Polígono de área */}
                  <polygon
                    fill="rgba(245, 158, 11, 0.15)"
                    points={`
                      0,100
                      ${logs.map((l, i) => `${i * 50 + 25},${100 - (Number(l.eggsTotal || 0) / maxEggs) * 85}`).join(' ')}
                      ${(logs.length - 1) * 50 + 25},100
                    `}
                  />

                  {/* Línea de datos */}
                  <polyline
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={logs.map((l, i) => `${i * 50 + 25},${100 - (Number(l.eggsTotal || 0) / maxEggs) * 85}`).join(' ')}
                  />

                  {/* Puntos de datos */}
                  {logs.map((l, i) => {
                    const cx = i * 50 + 25;
                    const cy = 100 - (Number(l.eggsTotal || 0) / maxEggs) * 85;
                    return (
                      <g key={i}>
                        <circle cx={cx} cy={cy} r="4" fill="#b45309" stroke="#ffffff" strokeWidth="2" />
                        <text x={cx} y={cy - 8} fill="#78350f" fontSize="7" fontWeight="bold" textAnchor="middle">
                          {l.eggsTotal} u
                        </text>
                        <text x={cx} y="98" fill="#64748b" fontSize="6" textAnchor="middle">
                          {l.date ? l.date.slice(5) : ''}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 mt-2 px-1">
                <span>Total huevos acumulados: <strong>{metrics.totalEggs}</strong></span>
                <span>Maples equivalentes: <strong>{metrics.totalMaples}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. GRÁFICO DE PESO VS ESTÁNDAR GENÉTICO */}
      {activeMetricTab === 'weight' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Crecimiento de Peso vs Guía Genética</h3>
              <p className="text-xs text-slate-500">Comparativa del lote con la tabla de {preset.name}</p>
            </div>
            <span className="text-xs font-bold text-orange-800 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200">
              Objetivo día 42: {preset.targetWeightGrams || 2900} g
            </span>
          </div>

          <div className="mt-4">
            <div className="h-48 w-full bg-slate-50 rounded-xl p-2 relative flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                {/* Curva Teórica Estándar (Gris punteada) */}
                <polyline
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  points="20,95 70,85 120,68 170,48 220,28 280,10"
                />
                <text x="210" y="24" fill="#64748b" fontSize="7">Curva Estándar Genética</text>

                {/* Línea real de peso */}
                <polyline
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="3"
                  strokeLinecap="round"
                  points={`
                    20,95
                    120,${100 - (metrics.latestSampleWeightGrams / 3500) * 90}
                  `}
                />
                <circle cx="120" cy={100 - (metrics.latestSampleWeightGrams / 3500) * 90} r="5" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                <text x="120" y={100 - (metrics.latestSampleWeightGrams / 3500) * 90 - 8} fill="#9a3412" fontSize="8" fontWeight="bold" textAnchor="middle">
                  Peso Real: {metrics.latestSampleWeightGrams} g (Día {metrics.currentAgeDays})
                </text>
              </svg>
            </div>

            <div className="p-3 bg-orange-50 rounded-xl mt-3 text-xs text-orange-900 border border-orange-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Análisis del Técnico Virtual:</strong> Su lote se encuentra en <strong>{metrics.latestSampleWeightGrams} gramos</strong> a los {metrics.currentAgeDays} días de edad con una conversión de <strong>FCR: {metrics.fcr}</strong>. La ganancia diaria promedio es de <strong>{metrics.gdp} g/ave/día</strong>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. GRÁFICO DE ALIMENTO */}
      {activeMetricTab === 'feed' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Consumo Diario de Alimento (Kg)</h3>
          <p className="text-xs text-slate-500 mb-3">Seguimiento de ración suministrada</p>

          <div className="space-y-2">
            {logs.slice(-7).map((l, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="w-20 text-slate-500 font-medium">{l.date}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden relative">
                  <div 
                    className="bg-amber-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (Number(l.feedKg) / maxFeed) * 100)}%` }}
                  />
                </div>
                <span className="w-16 font-bold text-slate-800 text-right">{l.feedKg} kg</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Consumo promedio por ave: <strong>{metrics.feedGramsPerBirdDay} g/día</strong></span>
            <span>Total bolsas de 40kg consumidas: <strong>{metrics.totalFeedBags40}</strong></span>
          </div>
        </div>
      )}

      {/* 4. PLANILLA DIARIA COMPLETA */}
      {activeMetricTab === 'table' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm overflow-x-auto">
          <h3 className="text-sm font-bold text-slate-800 mb-2">Libro de Campo - Historial Diario</h3>
          
          <table className="w-full text-left text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                <th className="p-2">Fecha</th>
                <th className="p-2">Bajas</th>
                <th className="p-2">Alimento</th>
                <th className="p-2">Agua</th>
                {batch.type !== 'broiler' && <th className="p-2">Huevos</th>}
                {batch.type !== 'layer' && <th className="p-2">Peso Muestra</th>}
                <th className="p-2">Temp</th>
                <th className="p-2">Notas</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-2 font-bold text-slate-700">{l.date}</td>
                  <td className="p-2">
                    {l.mortality > 0 ? (
                      <span className="text-red-600 font-bold">{l.mortality} ({l.mortalityReason || '-'})</span>
                    ) : (
                      <span className="text-emerald-600">0</span>
                    )}
                  </td>
                  <td className="p-2 font-semibold">{l.feedKg} kg</td>
                  <td className="p-2">{l.waterLiters} L</td>
                  {batch.type !== 'broiler' && (
                    <td className="p-2 font-bold text-amber-800">{l.eggsTotal || 0}</td>
                  )}
                  {batch.type !== 'layer' && (
                    <td className="p-2 font-bold text-orange-800">{l.avgSampleWeightGrams ? `${l.avgSampleWeightGrams} g` : '-'}</td>
                  )}
                  <td className="p-2">{l.tempC ? `${l.tempC}°C` : '-'}</td>
                  <td className="p-2 text-slate-500 italic max-w-[150px] truncate">{l.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

