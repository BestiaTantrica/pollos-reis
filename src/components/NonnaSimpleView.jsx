import React, { useState } from 'react';
import { 
  Egg, 
  Wheat, 
  Droplets, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Sparkles, 
  Calendar, 
  ClipboardCheck, 
  Heart,
  Truck,
  Check,
  Share2
} from 'lucide-react';
import { parseNaturalLog } from '../utils/naturalLanguageParser';

export default function NonnaSimpleView({ 
  batch, 
  metrics, 
  onSaveLog, 
  onSwitchToAdvanced 
}) {
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Estados simples de campo
  const [eggsToday, setEggsToday] = useState(metrics.todayEggs || 5);
  const [feedKg, setFeedKg] = useState(metrics.todayFeedKg || 4);
  const [waterTankFull, setWaterTankFull] = useState(true);
  const [mortality, setMortality] = useState(0);
  const [naturalVoiceText, setNaturalVoiceText] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  // Lista de tareas diarias de La Estanciera
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Baldeo y limpieza del gallinero', done: true },
    { id: 2, text: 'Revisar agua del tanque y bebederos', done: true },
    { id: 3, text: 'Tratamiento Rumivitam + Piperazina en el agua', done: true },
    { id: 4, text: 'Mover el carro / Cambio de parcela de pastoreo', done: false },
    { id: 5, text: 'Controlar gallina renga (#009)', done: false },
    { id: 6, text: 'Cerrar la minipuerta al atardecer', done: false }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleQuickSave = () => {
    const newLog = {
      date: todayStr,
      mortality: Number(mortality) || 0,
      mortalityReason: mortality > 0 ? 'Descarte' : '',
      feedKg: Number(feedKg) || 4,
      waterLiters: 16,
      eggsTotal: Number(eggsToday) || 0,
      eggsBroken: 0,
      eggsDirty: 0,
      tempC: 22,
      notes: `Registro Modo Fácil. ${tasks.filter(t => t.done).map(t => t.text).join('. ')}`
    };

    onSaveLog(batch.id, newLog);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleApplyVoice = (text) => {
    setNaturalVoiceText(text);
    const parsed = parseNaturalLog(text, batch.type);
    if (parsed) {
      if (parsed.eggsTotal > 0) setEggsToday(parsed.eggsTotal);
      if (parsed.feedKg > 0) setFeedKg(parsed.feedKg);
      if (parsed.mortality > 0) setMortality(parsed.mortality);
    }
  };

  return (
    <div className="space-y-4 pb-24 sm:pb-8 max-w-xl mx-auto font-sans">
      {/* Saludo Cálido y Directo */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-3xl p-5 shadow-sm text-center relative">
        <div className="inline-block bg-white/20 backdrop-blur-sm text-amber-100 text-xs font-bold px-3 py-1 rounded-full mb-1">
          🏡 Modo Galpón Sencillo
        </div>
        <h2 className="text-2xl font-black tracking-tight">
          ¡Hola Nonna! 🐓
        </h2>
        <p className="text-xs text-amber-100 mt-1">
          {batch.name} • <strong>{metrics.currentLivingBirds} gallinas sanas</strong>
        </p>

        <div className="mt-3 pt-3 border-t border-white/20 flex justify-center gap-4 text-xs font-semibold text-amber-100">
          <span>📅 Hoy: {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
      </div>

      {savedNotice && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg animate-bounce">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>¡Guardado! La cosecha y comida quedaron anotadas.</span>
        </div>
      )}

      {/* 1. COSECHA DE HUEVOS (Botones gigantes) */}
      <div className="bg-white border-2 border-amber-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Egg className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">Cosecha de Huevos de Hoy</h3>
              <p className="text-xs text-slate-500">¿Cuántos huevos juntaron hoy en los nidos?</p>
            </div>
          </div>
        </div>

        {/* Botones grandes de tocar con el pulgar */}
        <div className="flex items-center justify-center gap-3 py-3">
          <button
            type="button"
            onClick={() => setEggsToday(Math.max(0, eggsToday - 1))}
            className="w-14 h-14 rounded-2xl bg-slate-100 active:bg-slate-200 text-slate-700 flex items-center justify-center text-2xl font-black shadow-sm"
          >
            -1
          </button>

          <div className="w-32 text-center bg-amber-50 border-2 border-amber-300 rounded-2xl py-2">
            <span className="text-4xl font-black text-amber-900 block leading-none">
              {eggsToday}
            </span>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              {eggsToday === 1 ? 'Huevo' : 'Huevos'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setEggsToday(eggsToday + 1)}
            className="w-14 h-14 rounded-2xl bg-amber-500 active:bg-amber-600 text-white flex items-center justify-center text-2xl font-black shadow-md"
          >
            +1
          </button>
        </div>

        {/* Atajos rápidos */}
        <div className="flex justify-center gap-2 mt-2">
          {[1, 5, 10, 15, 30].map(n => (
            <button
              key={n}
              onClick={() => setEggsToday(n)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                eggsToday === n 
                  ? 'bg-amber-600 text-white border-amber-600' 
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
              }`}
            >
              {n === 30 ? '1 Maple (30)' : `${n}`}
            </button>
          ))}
        </div>
      </div>

      {/* 2. ALIMENTO Y AGUA */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center">
            <Wheat className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">Comida del Día</h3>
            <p className="text-xs text-slate-500">Alimento balanceado La Palmera / Dapa</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[2, 4, 8].map(kg => (
            <button
              key={kg}
              type="button"
              onClick={() => setFeedKg(kg)}
              className={`p-3 rounded-2xl border-2 text-center font-bold transition flex flex-col items-center ${
                feedKg === kg
                  ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <span className="text-xl font-black">{kg} kg</span>
              <span className="text-[10px] opacity-80">{kg === 4 ? 'Normal' : kg === 8 ? 'Doble ración' : 'Media'}</span>
            </button>
          ))}
        </div>

        {/* Estado del agua */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            <span className="text-xs font-bold text-slate-700">Agua del tanque:</span>
          </div>
          <button
            type="button"
            onClick={() => setWaterTankFull(!waterTankFull)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              waterTankFull 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-red-50 text-red-700 border-red-300 animate-pulse'
            }`}
          >
            {waterTankFull ? '💧 Tanque con agua' : '⚠️ ¡Falta agua!'}
          </button>
        </div>
      </div>

      {/* 3. TAREAS DEL DÍA EN EL GALLINERO (Checklist) */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-amber-600" />
          <span>Tareas de Hoy en La Estanciera</span>
        </h3>
        <p className="text-xs text-slate-500 mb-3">Toca las que ya hiciste para tacharlas:</p>

        <div className="space-y-2">
          {tasks.map(t => (
            <div
              key={t.id}
              onClick={() => toggleTask(t.id)}
              className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition select-none ${
                t.done
                  ? 'bg-emerald-50/70 border-emerald-200 text-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-amber-50/50'
              }`}
            >
              <div className={`w-6 h-6 rounded-xl flex items-center justify-center font-bold transition ${
                t.done ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 bg-white'
              }`}>
                {t.done && <Check className="w-4 h-4" />}
              </div>
              <span className={`text-xs font-bold ${t.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                {t.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. DICTADO POR VOZ O TEXTO DIRECTO */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <h4 className="text-xs font-black text-amber-900">
            O decíselo como si fuera un mensaje de WhatsApp:
          </h4>
        </div>
        <input
          type="text"
          placeholder="ej. 'Hoy juntamos 6 huevos y comieron 4 kilos'"
          value={naturalVoiceText}
          onChange={(e) => handleApplyVoice(e.target.value)}
          className="w-full text-xs p-3 bg-white border border-amber-300 rounded-2xl focus:ring-2 focus:ring-amber-500"
        />
        <p className="text-[11px] text-slate-500 mt-1.5">
          Escribe o toca el micrófono del teclado del celular para dictar.
        </p>
      </div>

      {/* BOTÓN GIGANTE PARA GUARDAR */}
      <button
        type="button"
        onClick={handleQuickSave}
        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white rounded-3xl font-black text-lg shadow-xl active:scale-[0.98] transition flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-6 h-6" />
        <span>GUARDAR REPORTE DE HOY</span>
      </button>

      {/* Botón para cambiar a modo avanzado si alguien lo quiere */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onSwitchToAdvanced}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 underline p-2"
        >
          ¿Quieres ver gráficos, costos y estadísticas avanzadas? Toca aquí →
        </button>
      </div>
    </div>
  );
}
