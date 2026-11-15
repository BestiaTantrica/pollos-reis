import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Plus, 
  Minus, 
  Egg, 
  Scale, 
  Droplets, 
  Wheat, 
  Skull, 
  Thermometer, 
  CheckCircle2, 
  Trash2,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function DailyLogView({ batch, onSaveLog, onDeleteLog, metrics }) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [mortality, setMortality] = useState(0);
  const [mortalityReason, setMortalityReason] = useState('Descarte');
  const [feedKg, setFeedKg] = useState(batch.type === 'layer' ? 29 : 35);
  const [waterLiters, setWaterLiters] = useState(batch.type === 'layer' ? 60 : 70);
  
  // Huevos
  const [eggsTotal, setEggsTotal] = useState(batch.type === 'layer' ? 215 : 20);
  const [eggsBroken, setEggsBroken] = useState(1);
  const [eggsDirty, setEggsDirty] = useState(2);

  // Pesaje (Parrilleros)
  const [sampleTotalWeightKg, setSampleTotalWeightKg] = useState('');
  const [sampleBirdsCount, setSampleBirdsCount] = useState(5);
  const [avgSampleWeightGrams, setAvgSampleWeightGrams] = useState(batch.type === 'broiler' ? 1050 : '');

  // Temperatura y notas
  const [tempC, setTempC] = useState(24);
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Calculadora rápida de pesaje grupal
  const handleCalculateAvgWeight = () => {
    if (Number(sampleTotalWeightKg) > 0 && Number(sampleBirdsCount) > 0) {
      const avg = Math.round((Number(sampleTotalWeightKg) * 1000) / Number(sampleBirdsCount));
      setAvgSampleWeightGrams(avg);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLog = {
      date,
      mortality: Number(mortality) || 0,
      mortalityReason: Number(mortality) > 0 ? mortalityReason : '',
      feedKg: Number(feedKg) || 0,
      waterLiters: Number(waterLiters) || 0,
      tempC: Number(tempC) || 24,
      notes: notes.trim()
    };

    if (batch.type === 'layer' || batch.type === 'mixed') {
      newLog.eggsTotal = Number(eggsTotal) || 0;
      newLog.eggsBroken = Number(eggsBroken) || 0;
      newLog.eggsDirty = Number(eggsDirty) || 0;
    }

    if (avgSampleWeightGrams) {
      newLog.avgSampleWeightGrams = Number(avgSampleWeightGrams);
    }

    onSaveLog(batch.id, newLog);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const logs = [...(batch.logs || [])].reverse();

  return (
    <div className="space-y-4 pb-20 sm:pb-6">
      {/* Encabezado con estado rápido */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Registro diario para:
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-800">
            {batch.name}
          </h2>
          <p className="text-xs text-slate-600">
            Aves vivas hoy: <strong className="text-emerald-700">{metrics.currentLivingBirds}</strong> | Edad: <strong>{metrics.currentAgeDays} días ({metrics.currentAgeWeeks} sem)</strong>
          </p>
        </div>
        <div className="text-right">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-700 focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-600 text-white p-3 rounded-xl flex items-center gap-2 shadow-md animate-bounce text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>¡Registro del día guardado con éxito y métricas actualizadas!</span>
        </div>
      )}

      {/* Formulario Principal de Carga Táctil */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SECCIÓN 1: Bajas / Mortalidad */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                <Skull className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Bajas de Hoy (Mortalidad)</h3>
                <p className="text-xs text-slate-500">¿Murió o se descartó algún pollo hoy?</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">Diario</span>
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            <button
              type="button"
              onClick={() => setMortality(Math.max(0, mortality - 1))}
              className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center font-bold text-xl transition"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="text-center w-28">
              <input
                type="number"
                min="0"
                value={mortality}
                onChange={(e) => setMortality(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full text-center text-3xl font-black text-slate-800 bg-slate-50 border border-slate-300 rounded-xl py-1.5 focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[11px] text-slate-500 font-medium">aves</span>
            </div>
            <button
              type="button"
              onClick={() => setMortality(mortality + 1)}
              className="w-12 h-12 rounded-xl bg-red-100 hover:bg-red-200 active:scale-95 text-red-700 flex items-center justify-center font-bold text-xl transition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {mortality > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Causa aproximada:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {['Aplastamiento', 'Calor/Asfixia', 'Descarte/Débil', 'Patas', 'Respiratorio', 'Prolapso', 'Desconocido'].map(cause => (
                  <button
                    key={cause}
                    type="button"
                    onClick={() => setMortalityReason(cause)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition ${
                      mortalityReason === cause
                        ? 'bg-red-500 text-white border-red-500 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cause}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECCIÓN 2: Ponedoras y Huevos (si aplica) */}
        {(batch.type === 'layer' || batch.type === 'mixed') && (
          <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm bg-gradient-to-b from-amber-50/40 to-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Egg className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Recolección de Huevos</h3>
                  <p className="text-xs text-slate-500">Postura total del día</p>
                </div>
              </div>
              <div className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-xs font-bold">
                {Math.floor(eggsTotal / 30)} maples + {eggsTotal % 30} huevos
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 py-2">
              <button
                type="button"
                onClick={() => setEggsTotal(Math.max(0, eggsTotal - 10))}
                className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm"
              >
                -10
              </button>
              <button
                type="button"
                onClick={() => setEggsTotal(Math.max(0, eggsTotal - 1))}
                className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-center w-32">
                <input
                  type="number"
                  min="0"
                  value={eggsTotal}
                  onChange={(e) => setEggsTotal(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-center text-3xl font-black text-amber-900 bg-amber-50/80 border border-amber-300 rounded-xl py-1.5 focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[11px] text-amber-700 font-semibold">huevos totales</span>
              </div>
              <button
                type="button"
                onClick={() => setEggsTotal(eggsTotal + 1)}
                className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setEggsTotal(eggsTotal + 30)}
                className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs"
                title="+1 Maple (30 huevos)"
              >
                +1 M
              </button>
            </div>

            {/* Clasificación rápida de rotos y sucios */}
            <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-amber-100">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-600 block mb-1">Huevos Rotos:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={eggsBroken}
                    onChange={(e) => setEggsBroken(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-sm font-bold bg-slate-50 border border-slate-300 rounded-lg p-1 text-center"
                  />
                  <span className="text-xs text-slate-500">u.</span>
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-600 block mb-1">Huevos Sucios:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={eggsDirty}
                    onChange={(e) => setEggsDirty(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-sm font-bold bg-slate-50 border border-slate-300 rounded-lg p-1 text-center"
                  />
                  <span className="text-xs text-slate-500">u.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: Alimento y Agua */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Alimento */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wheat className="w-4 h-4 text-amber-600" />
                <label className="text-xs font-bold text-slate-800">
                  Alimento consumido (Kg)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={feedKg}
                  onChange={(e) => setFeedKg(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full text-lg font-bold bg-slate-50 border border-slate-300 rounded-xl p-2 text-center focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-xs font-semibold text-slate-500">kg</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {[10, 20, 40].map(addKg => (
                  <button
                    key={addKg}
                    type="button"
                    onClick={() => setFeedKg((prev) => Math.round((Number(prev) + addKg) * 10) / 10)}
                    className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                  >
                    +{addKg}kg {addKg === 40 ? '(1 bolsa)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Agua */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <label className="text-xs font-bold text-slate-800">
                  Agua de bebida (Litros)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={waterLiters}
                  onChange={(e) => setWaterLiters(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-lg font-bold bg-slate-50 border border-slate-300 rounded-xl p-2 text-center focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-500">litros</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                * Clave sanitaria: Si baja el agua de golpe, revisa los bebederos o posible fiebre.
              </p>
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: Pesaje Muestral (Parrilleros / Engorde) */}
        {(batch.type === 'broiler' || batch.type === 'mixed') && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-800">Pesaje Semanal de Muestra (Opcional)</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Pesa una canasta con varios pollos para calcular el promedio exacto:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-3">
              <div>
                <span className="text-[11px] text-slate-600 font-medium block">Peso total balanza (kg):</span>
                <input
                  type="number"
                  step="0.05"
                  placeholder="ej. 5.2"
                  value={sampleTotalWeightKg}
                  onChange={(e) => setSampleTotalWeightKg(e.target.value)}
                  className="w-full text-xs font-bold p-1.5 bg-white border border-slate-300 rounded-lg text-center"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-600 font-medium block">Cantidad de pollos pesados:</span>
                <input
                  type="number"
                  min="1"
                  value={sampleBirdsCount}
                  onChange={(e) => setSampleBirdsCount(e.target.value)}
                  className="w-full text-xs font-bold p-1.5 bg-white border border-slate-300 rounded-lg text-center"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleCalculateAvgWeight}
                  className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-sm transition mt-3 sm:mt-0"
                >
                  Calcular Promedio
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                Peso promedio por ave:
              </label>
              <input
                type="number"
                placeholder="ej. 980"
                value={avgSampleWeightGrams}
                onChange={(e) => setAvgSampleWeightGrams(e.target.value)}
                className="w-32 text-center text-sm font-black bg-white border border-slate-300 rounded-lg p-1.5 focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-slate-600">gramos</span>
            </div>
          </div>
        )}

        {/* SECCIÓN 5: Clima y Observaciones */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-rose-500" />
              <label className="text-xs font-bold text-slate-800">Temperatura Galpón:</label>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={tempC}
                onChange={(e) => setTempC(e.target.value)}
                className="w-16 text-center text-sm font-bold bg-slate-50 border border-slate-300 rounded-lg p-1"
              />
              <span className="text-xs font-semibold text-slate-600">°C</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">
              Observaciones del día (opcional):
            </label>
            <input
              type="text"
              placeholder="ej. Se agregó viruta seca en comederos. Canto vigoroso."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* BOTÓN GIGANTE DE GUARDADO */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 active:scale-[0.99] text-white rounded-2xl font-black text-base shadow-lg transition flex items-center justify-center gap-2"
        >
          <ClipboardCheck className="w-5 h-5" />
          <span>GUARDAR REGISTRO DE HOY</span>
        </button>
      </form>

      {/* HISTORIAL RECIENTE DE REGISTROS */}
      <div className="mt-8">
        <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-600" />
          <span>Últimos registros cargados en este lote ({logs.length})</span>
        </h3>
        
        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 italic p-4 text-center bg-white rounded-xl border border-slate-200">
            Aún no hay registros en este lote. ¡Carga el primero arriba!
          </p>
        ) : (
          <div className="space-y-2">
            {logs.slice(0, 5).map((log, index) => (
              <div 
                key={log.date || index}
                className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-800 text-sm">{log.date}</strong>
                    {log.mortality > 0 ? (
                      <span className="bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded text-[10px]">
                        💀 {log.mortality} bajas ({log.mortalityReason || 'Sin motivo'})
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-700 font-semibold px-1.5 py-0.5 rounded text-[10px]">
                        0 bajas
                      </span>
                    )}
                  </div>
                  <div className="text-slate-600 mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                    <span>🌾 Alimento: <strong>{log.feedKg} kg</strong></span>
                    <span>💧 Agua: <strong>{log.waterLiters} L</strong></span>
                    {log.eggsTotal !== undefined && (
                      <span className="text-amber-800">🥚 Huevos: <strong>{log.eggsTotal}</strong> ({(log.eggsTotal/30).toFixed(1)} maples)</span>
                    )}
                    {log.avgSampleWeightGrams && (
                      <span className="text-orange-800">⚖️ Peso: <strong>{log.avgSampleWeightGrams} g</strong></span>
                    )}
                  </div>
                  {log.notes && (
                    <p className="text-[11px] text-slate-500 italic mt-0.5">
                      "{log.notes}"
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onDeleteLog(batch.id, log.date)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                  title="Eliminar este registro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
