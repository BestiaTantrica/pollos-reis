import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  BookOpen, 
  Lightbulb, 
  Key, 
  Check, 
  CheckCircle2,
  ArrowRight,
  ClipboardCheck
} from 'lucide-react';
import { POULTRY_KNOWLEDGE_BASE, findPoultryAnswer } from '../data/poultryKnowledge';
import { parseNaturalLog } from '../utils/naturalLanguageParser';

export default function AIAssistantView({ batch, metrics, onSaveLog }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `¡Hola familia granjera! Soy el **Asistente Avícola Inteligente de Pollos Reis**. 
      
Ahora cuento con **Carga Conversacional Directa**:
Si me dices cosas como:
* *"Che, hay dos gallinas flacas y tres huevos feos"*
* *"Murieron 2 pollos por calor y sacamos 210 huevos con 1 bolsa de comida"*

...yo mismo detectaré las cantidades y te daré un botón para **cargar la planilla automáticamente** sin que toques ningún formulario técnico.

¿Qué pasó hoy en el galpón o qué duda tienes?`
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('pollos_reis_gemini_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [lastSavedNotice, setLastSavedNotice] = useState(null);

  const quickQuestions = [
    'Che hay dos gallinas flacas y tres huevos feos',
    '¿Cómo cargo los datos de hoy en 30 segundos?',
    '¿Qué es el FCR y cómo sé si mi lote va bien?',
    '¿Cuántas horas de luz necesitan las ponedoras?',
    '¿Qué temperatura necesitan los pollitos BB?',
    '¿Qué hacer en días de calor extremo?',
    '¿Qué significa si veo sangre en la cama (coccidiosis)?'
  ];

  const handleAsk = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    // Agregar mensaje del usuario
    const newHistory = [...messages, { sender: 'user', text: q.trim() }];
    setMessages(newHistory);
    setInputQuery('');
    setIsThinking(true);

    // 1. REVISAR SI ES UNA INSTRUCCIÓN DE CARGA DE DATOS ("che hoy...", "murieron...", "huevos...")
    const parsed = parseNaturalLog(q, batch.type);
    if (parsed && parsed.detected) {
      setTimeout(() => {
        let replyText = `🐔 **¡Entendido perfectamente!** Extraje los siguientes datos para el lote **${batch.name}**:\n\n`;
        parsed.summary.forEach(s => {
          replyText += `• ${s}\n`;
        });
        replyText += `\n¿Deseas guardar este registro ahora mismo en la base de datos de la granja?`;

        setMessages([...newHistory, { 
          sender: 'bot', 
          text: replyText,
          parsedData: parsed
        }]);
        setIsThinking(false);
      }, 350);
      return;
    }

    // 2. SI TIENE GEMINI API KEY EN VIVO
    if (geminiApiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Eres el asesor técnico avícola de la granja familiar "Pollos Reis". Responde en español sencillo, cálido y práctico para personas que atienden galpones de pollos de engorde y gallinas ponedoras.
                
Contexto del lote actual:
- Lote: ${batch.name}
- Tipo: ${batch.type}
- Raza: ${batch.breed}
- Aves vivas: ${metrics.currentLivingBirds}
- Edad: ${metrics.currentAgeDays} días
- FCR actual: ${metrics.fcr}

Pregunta del granjero: "${q}"`
              }]
            }]
          })
        });

        const data = await response.json();
        const geminiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (geminiReply) {
          setMessages([...newHistory, { sender: 'bot', text: geminiReply }]);
          setIsThinking(false);
          return;
        }
      } catch (err) {
        console.warn('Error con API Gemini, usando motor local de conocimiento avícola', err);
      }
    }

    // 3. RESPUESTA DEL MOTOR LOCAL AVÍCOLA
    setTimeout(() => {
      const match = findPoultryAnswer(q);
      const botResponse = match ? match.answer : 'No entendí la consulta, pero recuerda: agua limpia y cama seca siempre.';
      setMessages([...newHistory, { sender: 'bot', text: botResponse }]);
      setIsThinking(false);
    }, 400);
  };

  const handleApplyLogFromBot = (parsedData) => {
    if (!onSaveLog || !parsedData) return;
    const todayStr = new Date().toISOString().split('T')[0];
    
    const newLog = {
      date: todayStr,
      mortality: parsedData.mortality || 0,
      mortalityReason: parsedData.mortalityReason || '',
      feedKg: parsedData.feedKg || (batch.type === 'layer' ? 29 : 35),
      waterLiters: parsedData.waterLiters || (batch.type === 'layer' ? 60 : 70),
      tempC: 24,
      notes: parsedData.notes || 'Cargado vía Asistente IA'
    };

    if (batch.type === 'layer' || batch.type === 'mixed') {
      newLog.eggsTotal = parsedData.eggsTotal || (batch.type === 'layer' ? 215 : 20);
      newLog.eggsBroken = parsedData.eggsBroken || 0;
      newLog.eggsDirty = parsedData.eggsDirty || 0;
    }

    if (parsedData.avgSampleWeightGrams) {
      newLog.avgSampleWeightGrams = parsedData.avgSampleWeightGrams;
    }

    onSaveLog(batch.id, newLog);
    setLastSavedNotice('¡Registro cargado y guardado con éxito en la planilla!');
    setTimeout(() => setLastSavedNotice(null), 3000);
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    localStorage.setItem('pollos_reis_gemini_key', geminiApiKey.trim());
    setShowKeyModal(false);
  };

  return (
    <div className="space-y-4 pb-20 sm:pb-6">
      {/* Encabezado Asistente */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
            <Bot className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-base font-black">Asistente Avícola Virtual</h2>
            <p className="text-xs text-amber-100">
              Carga conversacional ("Che hoy pasó...") y respuestas de galpón
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowKeyModal(!showKeyModal)}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition ${
            geminiApiKey 
              ? 'bg-emerald-600/80 text-white border-emerald-400' 
              : 'bg-white/10 hover:bg-white/20 text-amber-200 border-white/20'
          }`}
          title="Configurar clave gratuita Gemini para respuestas ilimitadas"
        >
          <Key className="w-3.5 h-3.5" />
          <span>{geminiApiKey ? 'IA En Vivo' : 'Modo Offline'}</span>
        </button>
      </div>

      {lastSavedNotice && (
        <div className="bg-emerald-600 text-white p-3 rounded-xl flex items-center gap-2 shadow-md animate-bounce text-sm font-bold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{lastSavedNotice}</span>
        </div>
      )}

      {/* Modal de Configuración de API Key (Opcional) */}
      {showKeyModal && (
        <div className="bg-white border border-amber-300 rounded-2xl p-4 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Potenciar con Inteligencia Artificial Gemini (Gratis)</span>
          </div>
          <p className="text-xs text-slate-600">
            La app ya cuenta con un motor inteligente con decenas de respuestas avícolas precargadas <strong>sin necesidad de internet</strong>. Pero si deseas que la IA responda cualquier consulta personalizada con el modelo Gemini de Google, puedes pegar tu clave gratuita aquí:
          </p>

          <form onSubmit={handleSaveKey} className="flex gap-2">
            <input
              type="password"
              placeholder="Pega tu API Key de Google Gemini aquí..."
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl"
            >
              Guardar
            </button>
          </form>
          <p className="text-[11px] text-slate-400">
            Se obtiene gratis en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-amber-700 underline font-semibold">Google AI Studio</a>. Se guarda únicamente en tu dispositivo.
          </p>
        </div>
      )}

      {/* Preguntas Frecuentes Rápidas */}
      <div>
        <span className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
          <span>Prueba tocando una de estas frases:</span>
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleAsk(q)}
              className="px-3 py-1.5 bg-white hover:bg-amber-50 active:scale-95 border border-slate-200 hover:border-amber-300 rounded-xl text-xs text-slate-700 font-semibold whitespace-nowrap shadow-sm transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Ventana de Conversación */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm min-h-[320px] flex flex-col justify-between">
        <div className="space-y-3 mb-4 max-h-[440px] overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                <div>{m.text}</div>

                {/* BOTÓN DE ACCIÓN SI DETECTÓ DATOS PARA GUARDAR */}
                {m.parsedData && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-end">
                    <button
                      onClick={() => handleApplyLogFromBot(m.parsedData)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition"
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      <span>Guardar en el Lote ({batch.name})</span>
                    </button>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic">
              <Bot className="w-4 h-4 animate-spin text-amber-600" />
              <span>Analizando mensaje y extrayendo datos...</span>
            </div>
          )}
        </div>

        {/* Input para escribir preguntas o dictar el día */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex items-center gap-2 pt-2 border-t border-slate-100"
        >
          <input
            type="text"
            placeholder="Dile a la IA qué pasó hoy o haz una pregunta..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="p-3 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl shadow-sm transition"
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* GLOSARIO RÁPIDO PARA PRINCIPIANTES */}
      <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-amber-700" />
          <span>Glosario Rápido para Principiantes</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <strong className="text-amber-900 block">🥚 1 Maple = 30 Huevos:</strong>
            Bandeja de cartón estándar para almacenar y comercializar huevos.
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <strong className="text-amber-900 block">🌾 FCR (Conversión Alimenticia):</strong>
            Kilos de alimento consumidos para ganar 1 kilo de peso vivo de pollo.
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <strong className="text-amber-900 block">📈 % Postura:</strong>
            Porcentaje de gallinas que pusieron huevo hoy respecto al total de vivas.
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <strong className="text-amber-900 block">💊 Período de Retiro:</strong>
            Días de espera luego de dar un remedio antes de faenar o vender la carne/huevo.
          </div>
        </div>
      </div>
    </div>
  );
}
