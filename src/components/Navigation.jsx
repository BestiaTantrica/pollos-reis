import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardPenLine, 
  LineChart, 
  Syringe, 
  CircleDollarSign, 
  Sparkles 
} from 'lucide-react';

export default function Navigation({ activeTab, onSelectTab, batchType }) {
  const tabs = [
    { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
    { id: 'daily', label: 'Cargar Hoy', icon: ClipboardPenLine, highlight: true },
    { id: 'metrics', label: 'Métricas', icon: LineChart },
    { id: 'health', label: 'Sanidad', icon: Syringe },
    { id: 'finance', label: 'Finanzas', icon: CircleDollarSign },
    { id: 'ai', label: 'Guía IA', icon: Sparkles },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-200 shadow-lg px-2 py-1.5 sm:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-amber-700 font-bold scale-105' 
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg ${
                tab.highlight && !isActive ? 'bg-amber-100 text-amber-800' : ''
              } ${isActive ? 'bg-amber-100 text-amber-800' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-5 h-1 bg-amber-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function DesktopNavigation({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard },
    { id: 'daily', label: 'Carga Rápida Diaria', icon: ClipboardPenLine, highlight: true },
    { id: 'metrics', label: 'Métricas y Gráficos', icon: LineChart },
    { id: 'health', label: 'Sanidad y Vacunas', icon: Syringe },
    { id: 'finance', label: 'Costos y Ganancias', icon: CircleDollarSign },
    { id: 'ai', label: 'Asistente IA y Guía', icon: Sparkles },
  ];

  return (
    <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm mb-4">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              isActive
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            } ${tab.highlight && !isActive ? 'border border-amber-300 text-amber-800 bg-amber-50/60' : ''}`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
