import React, { useState } from 'react';
import { 
  X, 
  Bird, 
  Egg, 
  Flame, 
  PlusCircle, 
  Trash2, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { GENETIC_PRESETS } from '../data/defaultData';

export default function BatchModal({ isOpen, onClose, onSaveBatch, onDeleteBatch, editingBatch }) {
  if (!isOpen) return null;

  const [name, setName] = useState(editingBatch ? editingBatch.name : '');
  const [type, setType] = useState(editingBatch ? editingBatch.type : 'layer');
  const [breed, setBreed] = useState(editingBatch ? editingBatch.breed : 'lohmann-brown');
  const [initialQuantity, setInitialQuantity] = useState(editingBatch ? editingBatch.initialQuantity : 100);
  const [startDate, setStartDate] = useState(editingBatch ? editingBatch.startDate : new Date().toISOString().split('T')[0]);
  const [startAgeDays, setStartAgeDays] = useState(editingBatch ? editingBatch.startAgeDays : (type === 'layer' ? 126 : 1));
  const [notes, setNotes] = useState(editingBatch ? editingBatch.notes : '');

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'layer') {
      setBreed('lohmann-brown');
      setStartAgeDays(126); // 18 semanas
    } else if (newType === 'broiler') {
      setBreed('cobb-500');
      setStartAgeDays(1); // pollitos BB
    } else {
      setBreed('criolla-mixta');
      setStartAgeDays(30);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const batchData = {
      id: editingBatch ? editingBatch.id : `lote-${Date.now()}`,
      name: name.trim(),
      type,
      breed,
      initialQuantity: Number(initialQuantity) || 1,
      startDate,
      startAgeDays: Number(startAgeDays) || 1,
      notes: notes.trim(),
      logs: editingBatch ? editingBatch.logs : [],
      vaccines: editingBatch ? editingBatch.vaccines : [
        { name: 'Marek (incubadora)', day: 1, applied: true },
        { name: 'Newcastle + Bronquitis', day: 14, applied: false },
        { name: 'Gumboro Refuerzo', day: 28, applied: false }
      ],
      treatments: editingBatch ? editingBatch.treatments : [],
      finances: editingBatch ? editingBatch.finances : { expenses: [], sales: [] }
    };

    onSaveBatch(batchData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Bird className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-800">
              {editingBatch ? 'Editar Lote de Aves' : 'Crear Nuevo Lote o Galpón'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Tipo de Aves */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Propósito o Tipo de Aves:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('layer')}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  type === 'layer'
                    ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Egg className="w-4 h-4" />
                <span className="text-xs">Ponedoras</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('broiler')}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  type === 'broiler'
                    ? 'bg-orange-500 text-white border-orange-600 font-bold shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span className="text-xs">Engorde</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('mixed')}
                className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                  type === 'mixed'
                    ? 'bg-emerald-600 text-white border-emerald-700 font-bold shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Bird className="w-4 h-4" />
                <span className="text-xs">Campo/Mixto</span>
              </button>
            </div>
          </div>

          {/* Nombre del Lote */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nombre o Identificador del Lote / Galpón:
            </label>
            <input
              type="text"
              placeholder="ej. Galpón 3 - Ponedoras Jóvenes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Raza o Línea Genética */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Línea Genética o Raza:
            </label>
            <select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            >
              {Object.entries(GENETIC_PRESETS).map(([key, data]) => (
                <option key={key} value={key}>
                  {data.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              {GENETIC_PRESETS[breed]?.desc || 'Línea seleccionada para cálculo de curvas de peso y producción.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Cantidad Inicial */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Cantidad Inicial de Aves:
              </label>
              <input
                type="number"
                min="1"
                value={initialQuantity}
                onChange={(e) => setInitialQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                required
                className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-center"
              />
            </div>

            {/* Edad Inicial en Días */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Edad Inicial (días):
              </label>
              <input
                type="number"
                min="1"
                value={startAgeDays}
                onChange={(e) => setStartAgeDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-xs font-bold p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-center"
              />
              <span className="text-[10px] text-slate-400 block text-center">
                1 para pollitos BB • 126 para pollas
              </span>
            </div>
          </div>

          {/* Fecha de Entrada */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Fecha de Ingreso a la Granja:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          {/* Notas */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Notas u Observaciones:
            </label>
            <input
              type="text"
              placeholder="ej. Proveedor Cabaña El Ombú, lote loteado con viruta nueva."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {editingBatch && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`¿Seguro que deseas eliminar el lote "${editingBatch.name}"? Esta acción borrará sus registros asociados.`)) {
                    onDeleteBatch(editingBatch.id);
                    onClose();
                  }
                }}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1 transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Lote</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                {editingBatch ? 'Guardar Cambios' : 'Crear Lote'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

