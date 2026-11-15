import React from 'react';
import { 
  Bird, 
  PlusCircle, 
  Sparkles, 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  Share2, 
  Egg, 
  Flame,
  HelpCircle
} from 'lucide-react';

export default function Header({ 
  batches, 
  activeBatchId, 
  onSelectBatch, 
  onOpenNewBatch, 
  onOpenBackup, 
  onOpenAI, 
  metrics,
  isOnline 
}) {
  const currentBatch = batches.find(b => b.id === activeBatchId) || batches[0];

  const getBatchBadge = (type) => {
    switch (type) {
      case 'layer':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"><Egg className="w-3 h-3" /> Ponedoras</span>;
      case 'broiler':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800"><Flame className="w-3 h-3" /> Engorde</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"><Bird className="w-3 h-3" /> Campo/Mixto</span>;
    }
  };

  return (
    <header className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white shadow-md sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-3 py-2.5 sm:px-4">
        {/* Fila superior: Logo y Acciones Rápidas */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/30 border border-amber-300/40 flex items-center justify-center p-1 shadow-inner">
              <img src="/chicken.svg" alt="Pollos Reis" className="w-8 h-8 drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black tracking-tight leading-none text-amber-50">
                  POLLOS REIS
                </h1>
                <span className="hidden sm:inline-block bg-amber-500/30 text-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                  Granja Familiar
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-tight">
                Control de galpón y postura
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Estado de conexión en la red de la granja */}
            <div 
              title={isOnline ? "Conectado a la red Wi-Fi de la granja" : "Modo Galpón (Trabajando sin conexión)"}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                isOnline ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : 'bg-red-950/60 text-red-300 border border-red-500/30'
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isOnline ? 'Wi-Fi Activo' : 'Offline'}</span>
            </div>

            {/* Botón Asistente IA */}
            <button
              onClick={onOpenAI}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white rounded-lg text-xs font-bold shadow-sm transition active:scale-95 border border-amber-300/40"
              title="Asistente Avícola Virtual y Ayuda para Principiantes"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-yellow-200" />
              <span className="font-semibold">Guía IA</span>
            </button>

            {/* Respaldo / Compartir */}
            <button
              onClick={onOpenBackup}
              className="p-1.5 bg-amber-900/60 hover:bg-amber-800 text-amber-100 rounded-lg text-xs transition border border-amber-700/50"
              title="Copia de seguridad y compartir por WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fila inferior: Selector de Lotes */}
        <div className="mt-2.5 pt-2 border-t border-amber-700/40 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-0">
            <label htmlFor="batchSelect" className="text-xs text-amber-200 whitespace-nowrap font-medium">
              Lote activo:
            </label>
            <div className="relative min-w-[190px] sm:min-w-[240px]">
              <select
                id="batchSelect"
                value={activeBatchId}
                onChange={(e) => onSelectBatch(e.target.value)}
                className="w-full bg-amber-950/70 text-amber-50 text-xs sm:text-sm font-semibold rounded-lg px-2.5 py-1.5 border border-amber-600/60 focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none pr-8 cursor-pointer"
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                    {b.name} ({b.initialQuantity} aves)
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-amber-300 text-xs">
                ▼
              </div>
            </div>
            {currentBatch && getBatchBadge(currentBatch.type)}
          </div>

          <button
            onClick={onOpenNewBatch}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-600/60 hover:bg-amber-600 text-amber-100 rounded-lg text-xs font-semibold whitespace-nowrap border border-amber-500/40 transition active:scale-95"
            title="Agregar un nuevo lote o galpón de aves"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nuevo Lote</span>
          </button>
        </div>

        {/* Alerta de Retiro Sanitario si está en medicamentos */}
        {metrics?.isUnderWithdrawal && (
          <div className="mt-2 bg-red-950/90 border border-red-500 text-red-200 px-3 py-1.5 rounded-lg flex items-center justify-between text-xs animate-pulse">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>
                <strong>ALERTA DE RETIRO SANITARIO:</strong> Tratamiento con <em>{metrics.activeTreatmentName}</em>. Faltan <strong>{metrics.daysRemainingWithdrawal} días</strong> para faena o consumo.
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
