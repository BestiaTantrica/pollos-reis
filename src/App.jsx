import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation, { DesktopNavigation } from './components/Navigation';
import DashboardView from './components/DashboardView';
import DailyLogView from './components/DailyLogView';
import MetricsView from './components/MetricsView';
import HealthView from './components/HealthView';
import FinanceView from './components/FinanceView';
import AIAssistantView from './components/AIAssistantView';
import BatchModal from './components/BatchModal';
import BackupModal from './components/BackupModal';
import { INITIAL_BATCHES } from './data/defaultData';
import { calculateBatchMetrics } from './utils/poultryMath';

export default function App() {
  // Cargar lotes guardados en el almacenamiento del navegador o migrar a datos reales de La Estanciera
  const [batches, setBatches] = useState(() => {
    try {
      const dataVersion = localStorage.getItem('pollos_reis_data_version');
      if (dataVersion !== 'v2_la_estanciera') {
        localStorage.setItem('pollos_reis_data_version', 'v2_la_estanciera');
        localStorage.setItem('pollos_reis_batches', JSON.stringify(INITIAL_BATCHES));
        localStorage.setItem('pollos_reis_active_batch', 'lote-la-estanciera-40');
        return INITIAL_BATCHES;
      }
      const saved = localStorage.getItem('pollos_reis_batches');
      return saved ? JSON.parse(saved) : INITIAL_BATCHES;
    } catch (e) {
      console.error('Error al cargar datos locales:', e);
      return INITIAL_BATCHES;
    }
  });

  const [activeBatchId, setActiveBatchId] = useState(() => {
    const savedId = localStorage.getItem('pollos_reis_active_batch');
    if (savedId && batches.some(b => b.id === savedId)) {
      return savedId;
    }
    return batches[0]?.id || 'lote-la-estanciera-40';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Modales
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Guardar en localStorage cada vez que cambien los lotes
  useEffect(() => {
    try {
      localStorage.setItem('pollos_reis_batches', JSON.stringify(batches));
    } catch (e) {
      console.error('Error al persistir lotes:', e);
    }
  }, [batches]);

  // Guardar lote activo seleccionado
  useEffect(() => {
    localStorage.setItem('pollos_reis_active_batch', activeBatchId);
  }, [activeBatchId]);

  // Detector de conectividad a la red Wi-Fi
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const currentBatch = batches.find(b => b.id === activeBatchId) || batches[0];
  const metrics = calculateBatchMetrics(currentBatch);

  // --- Handlers de Registros Diarios ---
  const handleSaveLog = (batchId, newLog) => {
    setBatches(prevBatches => prevBatches.map(b => {
      if (b.id !== batchId) return b;
      const existingLogs = b.logs || [];
      // Si ya hay un registro para esa fecha, actualizarlo; si no, agregar
      const filtered = existingLogs.filter(l => l.date !== newLog.date);
      return {
        ...b,
        logs: [...filtered, newLog].sort((x, y) => new Date(x.date) - new Date(y.date))
      };
    }));
  };

  const handleDeleteLog = (batchId, logDate) => {
    setBatches(prevBatches => prevBatches.map(b => {
      if (b.id !== batchId) return b;
      return {
        ...b,
        logs: (b.logs || []).filter(l => l.date !== logDate)
      };
    }));
  };

  // --- Handlers de Lotes ---
  const handleSaveBatch = (batchData) => {
    setBatches(prevBatches => {
      const exists = prevBatches.some(b => b.id === batchData.id);
      if (exists) {
        return prevBatches.map(b => b.id === batchData.id ? { ...b, ...batchData } : b);
      } else {
        return [...prevBatches, batchData];
      }
    });
    setActiveBatchId(batchData.id);
  };

  const handleDeleteBatch = (batchId) => {
    setBatches(prev => {
      const remaining = prev.filter(b => b.id !== batchId);
      if (remaining.length > 0) {
        setActiveBatchId(remaining[0].id);
      }
      return remaining;
    });
  };

  // --- Handlers de Sanidad ---
  const handleUpdateVaccines = (batchId, updatedVaccines) => {
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, vaccines: updatedVaccines } : b));
  };

  const handleAddTreatment = (batchId, treatment) => {
    setBatches(prev => prev.map(b => {
      if (b.id !== batchId) return b;
      return { ...b, treatments: [...(b.treatments || []), treatment] };
    }));
  };

  const handleDeleteTreatment = (batchId, treatmentId) => {
    setBatches(prev => prev.map(b => {
      if (b.id !== batchId) return b;
      return { ...b, treatments: (b.treatments || []).filter(t => t.id !== treatmentId) };
    }));
  };

  // --- Handlers de Finanzas ---
  const handleAddExpense = (batchId, expense) => {
    setBatches(prev => prev.map(b => {
      if (b.id !== batchId) return b;
      const fin = b.finances || { expenses: [], sales: [] };
      return {
        ...b,
        finances: {
          ...fin,
          expenses: [...(fin.expenses || []), expense]
        }
      };
    }));
  };

  const handleDeleteExpense = (batchId, expenseId) => {
    setBatches(prev => prev.map(b => {
      if (b.id !== batchId) return b;
      const fin = b.finances || { expenses: [], sales: [] };
      return {
        ...b,
        finances: {
          ...fin,
          expenses: (fin.expenses || []).filter(e => e.id !== expenseId)
        }
      };
    }));
  };

  const handleAddSale = (batchId, sale) => {
    setBatches(prev => prev.map(b => {
      if (b.id !== batchId) return b;
      const fin = b.finances || { expenses: [], sales: [] };
      return {
        ...b,
        finances: {
          ...fin,
          sales: [...(fin.sales || []), sale]
        }
      };
    }));
  };

  const handleDeleteSale = (batchId, saleId) => {
    setBatches(prev => prev.map(b => {
      if (b.id !== batchId) return b;
      const fin = b.finances || { expenses: [], sales: [] };
      return {
        ...b,
        finances: {
          ...fin,
          sales: (fin.sales || []).filter(s => s.id !== saleId)
        }
      };
    }));
  };

  // Restaurar datos completos
  const handleRestoreData = (newBatches) => {
    setBatches(newBatches);
    if (newBatches.length > 0) {
      setActiveBatchId(newBatches[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Barra Superior con Selector de Lotes y Accesos Rápidos */}
      <Header
        batches={batches}
        activeBatchId={activeBatchId}
        onSelectBatch={setActiveBatchId}
        onOpenNewBatch={() => {
          setEditingBatch(null);
          setIsBatchModalOpen(true);
        }}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenAI={() => setActiveTab('ai')}
        metrics={metrics}
        isOnline={isOnline}
      />

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-4">
        {/* Navegación para Pantallas Medianas y Grandes */}
        <DesktopNavigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* VISTAS DE CONTENIDO */}
        {activeTab === 'dashboard' && (
          <DashboardView
            batch={currentBatch}
            metrics={metrics}
            onGoToDaily={() => setActiveTab('daily')}
            onGoToAI={() => setActiveTab('ai')}
            onGoToHealth={() => setActiveTab('health')}
            onGoToFinance={() => setActiveTab('finance')}
          />
        )}

        {activeTab === 'daily' && (
          <DailyLogView
            batch={currentBatch}
            metrics={metrics}
            onSaveLog={handleSaveLog}
            onDeleteLog={handleDeleteLog}
          />
        )}

        {activeTab === 'metrics' && (
          <MetricsView
            batch={currentBatch}
            metrics={metrics}
          />
        )}

        {activeTab === 'health' && (
          <HealthView
            batch={currentBatch}
            metrics={metrics}
            onUpdateVaccines={handleUpdateVaccines}
            onAddTreatment={handleAddTreatment}
            onDeleteTreatment={handleDeleteTreatment}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceView
            batch={currentBatch}
            metrics={metrics}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onAddSale={handleAddSale}
            onDeleteSale={handleDeleteSale}
          />
        )}

        {activeTab === 'ai' && (
          <AIAssistantView
            batch={currentBatch}
            metrics={metrics}
            onSaveLog={handleSaveLog}
          />
        )}
      </main>

      {/* Barra de Navegación Inferior Móvil (Sticky) */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        batchType={currentBatch?.type}
      />

      {/* Modal de Crear / Editar Lote */}
      <BatchModal
        isOpen={isBatchModalOpen}
        onClose={() => {
          setIsBatchModalOpen(false);
          setEditingBatch(null);
        }}
        onSaveBatch={handleSaveBatch}
        onDeleteBatch={handleDeleteBatch}
        editingBatch={editingBatch}
      />

      {/* Modal de Copia de Seguridad y WhatsApp */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        batches={batches}
        onRestoreData={handleRestoreData}
        currentBatch={currentBatch}
        metrics={metrics}
      />
    </div>
  );
}

