import React, { useState } from 'react';
import { 
  Syringe, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  Check, 
  Clock, 
  AlertTriangle, 
  Trash2,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function HealthView({ batch, onUpdateVaccines, onAddTreatment, onDeleteTreatment, metrics }) {
  const [showAddTreatment, setShowAddTreatment] = useState(false);
  const [treatmentName, setTreatmentName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [daysDuration, setDaysDuration] = useState(3);
  const [withdrawalDays, setWithdrawalDays] = useState(5);
  const [notes, setNotes] = useState('');

  const vaccines = batch.vaccines || [];
  const treatments = batch.treatments || [];

  const handleToggleVaccine = (index) => {
    const updated = [...vaccines];
    updated[index].applied = !updated[index].applied;
    onUpdateVaccines(batch.id, updated);
  };

  const handleCreateTreatment = (e) => {
    e.preventDefault();
    if (!treatmentName.trim()) return;

    const newTreatment = {
      id: Date.now(),
      name: treatmentName.trim(),
      startDate,
      daysDuration: Number(daysDuration) || 1,
      withdrawalDays: Number(withdrawalDays) || 0,
      notes: notes.trim()
    };

    onAddTreatment(batch.id, newTreatment);
    setTreatmentName('');
    setNotes('');
    setShowAddTreatment(false);
  };

  return (
    <div className="space-y-4 pb-20 sm:pb-6">
      {/* SEMÁFORO DE RETIRO SANITARIO */}
      <div className={`p-4 rounded-2xl border ${
        metrics.isUnderWithdrawal
          ? 'bg-red-50 border-red-300 text-red-900'
          : 'bg-emerald-50 border-emerald-300 text-emerald-900'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            metrics.isUnderWithdrawal ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'
          }`}>
            {metrics.isUnderWithdrawal ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                metrics.isUnderWithdrawal ? 'bg-red-200 text-red-800' : 'bg-emerald-200 text-emerald-800'
              }`}>
                {metrics.isUnderWithdrawal ? 'En Período de Retiro' : 'Apto Faena y Venta'}
              </span>
            </div>
            <h3 className="text-base font-bold mt-1">
              {metrics.isUnderWithdrawal 
                ? `¡ATENCIÓN! Quedan ${metrics.daysRemainingWithdrawal} días de espera por ${metrics.activeTreatmentName}`
                : 'Lote libre de residuos medicamentosos'}
            </h3>
            <p className="text-xs mt-1 leading-relaxed">
              {metrics.isUnderWithdrawal
                ? 'No se debe faenar pollos para la venta ni enviar a frigorífico hasta que culmine el período de retiro para evitar multas y riesgos a la salud.'
                : 'La carne y los huevos de este lote se pueden consumir y comercializar con total seguridad biológica.'}
            </p>
          </div>
        </div>
      </div>

      {/* PLAN DE VACUNACIÓN */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Syringe className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-800">Plan de Vacunación del Lote</h3>
          </div>
          <span className="text-xs text-slate-500">
            {vaccines.filter(v => v.applied).length} de {vaccines.length} aplicadas
          </span>
        </div>

        <div className="space-y-2">
          {vaccines.map((v, i) => (
            <div
              key={i}
              onClick={() => handleToggleVaccine(i)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                v.applied 
                  ? 'bg-emerald-50/70 border-emerald-200 text-slate-800' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-amber-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs transition ${
                  v.applied ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white text-transparent'
                }`}>
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-xs font-bold block ${v.applied ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                    {v.name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Sugerido al Día {v.day} de vida {v.date ? `(${v.date})` : ''}
                  </span>
                </div>
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                v.applied ? 'bg-emerald-200/80 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {v.applied ? 'Aplicada' : 'Pendiente'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TRATAMIENTOS Y MEDICAMENTOS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-800">Tratamientos y Medicamentos Administrados</h3>
          </div>
          <button
            onClick={() => setShowAddTreatment(!showAddTreatment)}
            className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg border border-amber-200 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Registrar Tratamiento</span>
          </button>
        </div>

        {showAddTreatment && (
          <form onSubmit={handleCreateTreatment} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Nuevo Medicamento / Tratamiento</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nombre o Producto:</label>
                <input
                  type="text"
                  placeholder="ej. Enrofloxacina, Coccidiostato, Vitaminas"
                  value={treatmentName}
                  onChange={(e) => setTreatmentName(e.target.value)}
                  required
                  className="w-full text-xs font-medium p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Fecha de inicio:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs font-medium p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Días de aplicación:</label>
                <input
                  type="number"
                  min="1"
                  value={daysDuration}
                  onChange={(e) => setDaysDuration(e.target.value)}
                  className="w-full text-xs font-medium p-2 bg-white border border-slate-300 rounded-lg text-center"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Días de RETIRO (espera obligatoria):
                </label>
                <input
                  type="number"
                  min="0"
                  value={withdrawalDays}
                  onChange={(e) => setWithdrawalDays(e.target.value)}
                  className="w-full text-xs font-bold p-2 bg-white border border-rose-300 text-rose-700 rounded-lg text-center"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Motivo o Dosis:</label>
              <input
                type="text"
                placeholder="ej. 1ml x litro de agua por heces blandas"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddTreatment(false)}
                className="px-3 py-1.5 text-xs text-slate-500 font-medium hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
              >
                Guardar Tratamiento
              </button>
            </div>
          </form>
        )}

        {treatments.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center p-3">
            No hay tratamientos registrados en este lote. ¡Todo sano!
          </p>
        ) : (
          <div className="space-y-2">
            {treatments.map((t) => (
              <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-800 text-sm">{t.name}</strong>
                    {t.withdrawalDays > 0 ? (
                      <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        Retiro: {t.withdrawalDays} días
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded text-[10px]">
                        Sin retiro
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Inicio: {t.startDate} ({t.daysDuration} días de dosis) {t.notes ? `• "${t.notes}"` : ''}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteTreatment(batch.id, t.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CONSEJOS DE BIOSEGURIDAD */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-2">
        <h4 className="font-bold flex items-center gap-1.5 text-amber-800">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Reglas de Oro de Bioseguridad en Pollos Reis</span>
        </h4>
        <ul className="list-disc pl-4 space-y-1 text-slate-700">
          <li><strong>Pediluvio en la puerta:</strong> Poner un recipiente con desinfectante (cal viva o cloro) para pisar antes de entrar al galpón.</li>
          <li><strong>Agua tratada:</strong> Si usan agua de pozo, clorar suavemente (2 gotas de lavandina por cada 10 litros) para eliminar bacterias.</li>
          <li><strong>Control de roedores y pájaros:</strong> Cerrar aperturas con malla pajarera; los gorriones transmiten moquillo y viruela aviar.</li>
        </ul>
      </div>
    </div>
  );
}

