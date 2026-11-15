import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Download, 
  Upload, 
  Database, 
  Check, 
  Copy, 
  Cloud, 
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { formatCurrency } from '../utils/poultryMath';

export default function BackupModal({ 
  isOpen, 
  onClose, 
  batches, 
  onRestoreData, 
  currentBatch, 
  metrics 
}) {
  if (!isOpen) return null;

  const [copiedWA, setCopiedWA] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  // Generar reporte para WhatsApp
  const generateWhatsAppReport = () => {
    if (!currentBatch || !metrics) return '';
    const today = new Date().toLocaleDateString('es-AR');
    
    let text = `🐔 *REPORTE DIARIO - POLLOS REIS* 🐔\n`;
    text += `📅 Fecha: ${today}\n`;
    text += `🏠 Lote: *${currentBatch.name}*\n`;
    text += `🐥 Aves vivas: *${metrics.currentLivingBirds}* de ${metrics.initialQty} (Viabilidad: ${metrics.viabilityPercent}%)\n`;
    text += `⏳ Edad: ${metrics.currentAgeDays} días (${metrics.currentAgeWeeks} semanas)\n`;
    text += `🌾 Alimento hoy: ${metrics.todayFeedKg} kg (Total: ${metrics.totalFeedBags40} bolsas)\n`;

    if (currentBatch.type === 'layer' || currentBatch.type === 'mixed') {
      text += `🥚 Postura de hoy: *${metrics.todayEggRate}%* (${metrics.todayEggs} huevos / ${metrics.todayMaples} maples)\n`;
      text += `📦 Total acumulado: ${metrics.totalMaples} maples (${metrics.totalEggs} huevos)\n`;
    }

    if (currentBatch.type === 'broiler' || currentBatch.type === 'mixed') {
      text += `⚖️ Peso promedio: *${metrics.latestSampleWeightGrams} g* por pollo\n`;
      text += `📊 Conversión (FCR): *${metrics.fcr}* | IEE: *${metrics.epef}*\n`;
    }

    if (metrics.isUnderWithdrawal) {
      text += `⚠️ *ALERTA SANITARIA:* En período de retiro (${metrics.daysRemainingWithdrawal} días restantes).\n`;
    }

    text += `💰 Ventas acumuladas: ${formatCurrency(metrics.totalSales)}\n`;
    text += `✨ _Generado con la App Pollos Reis_`;

    return text;
  };

  const handleShareWhatsApp = () => {
    const text = generateWhatsAppReport();
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleCopyReport = () => {
    const text = generateWhatsAppReport();
    navigator.clipboard.writeText(text);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2500);
  };

  // Descargar JSON de respaldo
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(batches, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pollos_reis_respaldo_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Restaurar JSON
  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          onRestoreData(parsed);
          setRestoreSuccess(true);
          setTimeout(() => {
            setRestoreSuccess(false);
            onClose();
          }, 1500);
        } else {
          alert('El archivo no tiene el formato correcto de lotes.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-800">
              Datos, Respaldos y WhatsApp
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. COMPARTIR REPORTE POR WHATSAPP */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Enviar Reporte Diario por WhatsApp</span>
          </div>
          <p className="text-xs text-slate-600">
            Genera un mensaje prolijo con los datos del día (aves vivas, huevos/kilos, alimento y ventas) para enviarlo a tu mamá o al grupo familiar con 1 solo toque:
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Abrir WhatsApp</span>
            </button>
            <button
              onClick={handleCopyReport}
              className="px-3.5 py-2.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              {copiedWA ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedWA ? '¡Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>
        </div>

        {/* 2. COPIA DE SEGURIDAD / DESCARGA */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Download className="w-4 h-4 text-amber-700" />
            <span>Copia de Seguridad en Archivo</span>
          </h4>
          <p className="text-xs text-slate-600">
            Descarga una copia completa de todos los lotes, registros de mortalidad, postura y finanzas. Puedes guardarla en tu celular o enviarla a la compu:
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleExportJSON}
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Respaldo (.json)</span>
            </button>

            <label className="flex-1 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Restaurar desde Archivo</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>

          {restoreSuccess && (
            <div className="text-xs font-bold text-emerald-700 bg-emerald-100 p-2 rounded-lg text-center animate-pulse">
              ¡Datos restaurados con éxito!
            </div>
          )}
        </div>

        {/* 3. EXPLICACIÓN DE LA BASE DE DATOS Y GIT (Aclaración para el usuario) */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2 text-xs text-slate-700">
          <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>¿Dónde se guardan los datos? (Base de Datos vs Git)</span>
          </h4>
          <p>
            • <strong>Git</strong> guarda el <em>código del programa</em> (la estructura y diseño de la aplicación).
          </p>
          <p>
            • <strong>La Base de Datos</strong> es el libro donde se anotan los números diarios (bajas, huevos, kilos). En esta app, <strong>todo se guarda automáticamente en la memoria del navegador/celular (LocalStorage) sin costo alguno</strong>. No necesitas pagar nada a ninguna empresa.
          </p>
          <p>
            • <strong>Sincronización multi-dispositivo:</strong> Si quieres que lo que anota tu mamá en su celular aparezca al mismo segundo en tu PC, podemos conectar <strong>Google Firebase</strong> (tiene un plan gratuito de por vida que sobra para una granja avícola).
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
}

