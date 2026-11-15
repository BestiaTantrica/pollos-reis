import React, { useState } from 'react';
import { 
  CircleDollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  Receipt, 
  ShoppingBag,
  Egg,
  Scale
} from 'lucide-react';
import { formatCurrency } from '../utils/poultryMath';

export default function FinanceView({ batch, onAddExpense, onDeleteExpense, onAddSale, onDeleteSale, metrics }) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddSale, setShowAddSale] = useState(false);

  // Form states Gasto
  const [expConcept, setExpConcept] = useState('');
  const [expCategory, setExpCategory] = useState('alimento');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);

  // Form states Venta
  const [saleConcept, setSaleConcept] = useState('');
  const [saleQty, setSaleQty] = useState('');
  const [saleUnit, setSaleUnit] = useState(batch.type === 'layer' ? 'maple' : 'pollo');
  const [saleUnitPrice, setSaleUnitPrice] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);

  const expenses = batch.finances?.expenses || [];
  const sales = batch.finances?.sales || [];

  const handleCreateExpense = (e) => {
    e.preventDefault();
    if (!expConcept.trim() || !expAmount) return;

    const newExpense = {
      id: Date.now(),
      concept: expConcept.trim(),
      category: expCategory,
      amount: Number(expAmount) || 0,
      date: expDate
    };

    onAddExpense(batch.id, newExpense);
    setExpConcept('');
    setExpAmount('');
    setShowAddExpense(false);
  };

  const handleCreateSale = (e) => {
    e.preventDefault();
    if (!saleConcept.trim() || !saleQty || !saleUnitPrice) return;

    const qty = Number(saleQty) || 1;
    const unitPrice = Number(saleUnitPrice) || 0;
    const total = qty * unitPrice;

    const newSale = {
      id: Date.now(),
      concept: saleConcept.trim(),
      quantity: qty,
      unit: saleUnit,
      unitPrice,
      total,
      date: saleDate
    };

    onAddSale(batch.id, newSale);
    setSaleConcept('');
    setSaleQty('');
    setSaleUnitPrice('');
    setShowAddSale(false);
  };

  return (
    <div className="space-y-4 pb-20 sm:pb-6">
      {/* TARJETA PRINCIPAL DE RENTABILIDAD */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold">Balance Financiero del Lote</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {batch.name}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-slate-700/60 my-2">
          <div>
            <span className="text-[11px] text-rose-300 block">Total Gastos</span>
            <span className="text-lg sm:text-xl font-black text-rose-400">
              {formatCurrency(metrics.totalExpenses)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-emerald-300 block">Total Ventas</span>
            <span className="text-lg sm:text-xl font-black text-emerald-400">
              {formatCurrency(metrics.totalSales)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-amber-200 block">Ganancia Neta</span>
            <span className={`text-lg sm:text-xl font-black ${
              metrics.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {formatCurrency(metrics.netProfit)}
            </span>
          </div>
        </div>

        {/* Costos Unitarios Clave */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-1 text-xs">
          <div className="bg-white/5 p-2 rounded-xl border border-white/10">
            <span className="text-[10px] text-slate-400 block">Costo por Ave Viva:</span>
            <strong className="text-sm text-white">{formatCurrency(metrics.costPerBird)}</strong>
          </div>

          {batch.type !== 'layer' && (
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 block">Costo por Kg en Pie:</span>
              <strong className="text-sm text-white">{formatCurrency(metrics.costPerKgLive)} / kg</strong>
            </div>
          )}

          {batch.type !== 'broiler' && (
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-slate-400 block">Costo por Maple Huevo:</span>
              <strong className="text-sm text-white">{formatCurrency(metrics.costPerMaple)} / maple</strong>
            </div>
          )}
        </div>
      </div>

      {/* BOTONES DE ACCIÓN RÁPIDA */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => { setShowAddExpense(true); setShowAddSale(false); }}
          className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl flex items-center justify-center gap-2 text-rose-800 font-bold text-xs transition active:scale-95"
        >
          <TrendingDown className="w-4 h-4 text-rose-600" />
          <span>+ Anotar Gasto</span>
        </button>

        <button
          onClick={() => { setShowAddSale(true); setShowAddExpense(false); }}
          className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl flex items-center justify-center gap-2 text-emerald-800 font-bold text-xs transition active:scale-95"
        >
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>+ Anotar Venta</span>
        </button>
      </div>

      {/* FORMULARIO GASTO */}
      {showAddExpense && (
        <form onSubmit={handleCreateExpense} className="bg-white border border-rose-200 rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
            <Receipt className="w-4 h-4" />
            <span>Registrar Nuevo Gasto de la Granja</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Concepto:</label>
              <input
                type="text"
                placeholder="ej. 5 bolsas alimento balanceado, viruta de pino"
                value={expConcept}
                onChange={(e) => setExpConcept(e.target.value)}
                required
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Categoría:</label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="alimento">🌾 Alimento / Ración</option>
                <option value="aves">🐥 Compra de Pollitos / Pollas</option>
                <option value="sanidad">💉 Vacunas y Medicamentos</option>
                <option value="energia">🔥 Gas / Electricidad</option>
                <option value="instalaciones">🪵 Cama / Viruta / Bebederos</option>
                <option value="otros">📦 Otros Gastos</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Monto Total ($):</label>
              <input
                type="number"
                min="0"
                placeholder="ej. 85000"
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                required
                className="w-full text-sm font-bold p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Fecha:</label>
              <input
                type="date"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddExpense(false)}
              className="px-3 py-1.5 text-xs text-slate-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm"
            >
              Guardar Gasto
            </button>
          </div>
        </form>
      )}

      {/* FORMULARIO VENTA */}
      {showAddSale && (
        <form onSubmit={handleCreateSale} className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            <span>Registrar Venta / Cobro</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Cliente / Concepto:</label>
              <input
                type="text"
                placeholder="ej. Venta 10 maples a Don Carlos"
                value={saleConcept}
                onChange={(e) => setSaleConcept(e.target.value)}
                required
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Unidad de Medida:</label>
              <select
                value={saleUnit}
                onChange={(e) => setSaleUnit(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="maple">🥚 Maples (30 huevos)</option>
                <option value="docena">🥚 Docenas de huevos</option>
                <option value="pollo">🍗 Pollo vivo / faenado</option>
                <option value="kg">⚖️ Kilogramos de carne</option>
                <option value="abono">🌱 Bolsa de Guano / Abono</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Cantidad vendida:</label>
              <input
                type="number"
                min="1"
                placeholder="ej. 10"
                value={saleQty}
                onChange={(e) => setSaleQty(e.target.value)}
                required
                className="w-full text-xs font-bold p-2 bg-slate-50 border border-slate-300 rounded-lg text-center"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Precio Unitario ($):</label>
              <input
                type="number"
                min="0"
                placeholder="ej. 4500"
                value={saleUnitPrice}
                onChange={(e) => setSaleUnitPrice(e.target.value)}
                required
                className="w-full text-xs font-bold p-2 bg-slate-50 border border-slate-300 rounded-lg text-center"
              />
            </div>
          </div>

          <div className="bg-emerald-50 p-2 rounded-lg text-xs text-emerald-900 font-bold flex justify-between">
            <span>Total a Cobrar:</span>
            <span>{formatCurrency((Number(saleQty) || 0) * (Number(saleUnitPrice) || 0))}</span>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddSale(false)}
              className="px-3 py-1.5 text-xs text-slate-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
            >
              Guardar Venta
            </button>
          </div>
        </form>
      )}

      {/* LISTADO DE GASTOS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center justify-between">
          <span>Gastos Registrados ({expenses.length})</span>
          <span className="text-rose-600 font-black text-xs">{formatCurrency(metrics.totalExpenses)}</span>
        </h3>

        {expenses.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-2">No hay gastos cargados aún.</p>
        ) : (
          <div className="space-y-1.5">
            {expenses.map(exp => (
              <div key={exp.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <strong className="text-slate-800">{exp.concept}</strong>
                  <span className="text-[11px] text-slate-500 block">
                    {exp.date} • <span className="capitalize">{exp.category}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-rose-700">{formatCurrency(exp.amount)}</span>
                  <button
                    onClick={() => onDeleteExpense(batch.id, exp.id)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LISTADO DE VENTAS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center justify-between">
          <span>Ventas Realizadas ({sales.length})</span>
          <span className="text-emerald-600 font-black text-xs">{formatCurrency(metrics.totalSales)}</span>
        </h3>

        {sales.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-2">No hay ventas registradas aún.</p>
        ) : (
          <div className="space-y-1.5">
            {sales.map(s => (
              <div key={s.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <strong className="text-slate-800">{s.concept}</strong>
                  <span className="text-[11px] text-slate-500 block">
                    {s.date} • {s.quantity} {s.unit}s x {formatCurrency(s.unitPrice)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-700">{formatCurrency(s.total)}</span>
                  <button
                    onClick={() => onDeleteSale(batch.id, s.id)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

