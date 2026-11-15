// Base de conocimiento y motor de respuestas del Asistente Avícola IA para Pollos Reis

export const POULTRY_KNOWLEDGE_BASE = [
  {
    keywords: ['fcr', 'conversion', 'alimento por kilo', 'indice de conversion', 'que es fcr'],
    question: '¿Qué es el FCR o Conversión Alimenticia y por qué es tan importante?',
    category: 'Métricas Técnicas',
    answer: `El **FCR (Feed Conversion Ratio o Índice de Conversión Alimenticia)** mide cuántos kilogramos de alimento necesita comer un pollo para ganar 1 kilogramo de peso vivo.
    
**Fórmula:**
\`FCR = Total de alimento consumido (kg) / Peso total ganado (kg)\`

**Ejemplo simple:**
Si un lote comió 5.000 kg de alimento y produjo 3.000 kg de carne, su FCR es:
5000 / 3000 = **1.66**.

*En avicultura: ¡mientras MENOR sea el número, MEJOR!*
- Un FCR de 1.55 a 1.68 en parrilleros modernos (Cobb 500 / Ross 308) es excelente.
- Si sube a más de 1.85, significa que el alimento se está desperdiciando (comederos mal regulados, frío excesivo o problemas digestivos).`
  },
  {
    keywords: ['postura', 'porcentaje de postura', 'huevos por dia', 'baja postura', 'cuantos huevos'],
    question: '¿Cómo se calcula el % de postura y qué es normal en ponedoras?',
    category: 'Ponedoras y Huevos',
    answer: `El **% de postura** indica la productividad de las gallinas cada día:

**Fórmula:**
\`% Postura = (Huevos recolectados hoy / Cantidad de gallinas vivas) × 100\`

**¿Qué es normal en ponedoras comerciales (Lohmann / Hy-Line)?**
- Inicio de postura: Semana 18 a 20 (empiezan con 10% a 30%).
- Pico de postura: Semana 26 a 32 (alcanzan entre **92% y 96%**).
- A partir de la semana 40 va bajando suavemente un 0.5% por semana.

*Tip familiar:* Si la postura cae repentinamente más de un 5% en 2 días, revisa de inmediato:
1. ¿Tuvieron agua limpia todo el día? (si se quedan sin agua 6 horas, cortan la postura por días).
2. ¿Hubo algún ruido fuerte o susto?
3. ¿Faltaron horas de luz?`
  },
  {
    keywords: ['luz', 'fotoperiodo', 'horas de luz', 'iluminacion'],
    question: '¿Cuántas horas de luz necesitan las gallinas ponedoras?',
    category: 'Manejo en Galpón',
    answer: `Las gallinas ponedoras necesitan **entre 15 y 16 horas de luz continua por día** (sumando la luz natural del sol más focos artificiales).

**¿Por qué?**
La luz estimula la glándula pineal en el ojo y cerebro de la gallina, liberando las hormonas que producen la yema del huevo.

**Regla de oro de la luz:**
- NUNCA reduzcas las horas de luz durante la etapa de postura (hacerlo provocará pelecha/muda y dejarán de poner).
- Pon un temporizador (timer) para prender las luces a las 5:00 AM para que aprovechen la frescura de la mañana.`
  },
  {
    keywords: ['temperatura', 'calor', 'frio', 'clima', 'grados', 'pollito bebe', 'bb'],
    question: '¿Qué temperatura necesitan los pollitos según su edad?',
    category: 'Manejo de Pollitos BB',
    answer: `Los pollitos BB recién nacidos no regulan su propia temperatura corporal. Necesitan una fuente de calor (campana a gas o eléctrica):

- **Días 1 a 3:** 32°C a 34°C (al nivel del piso, donde están ellos).
- **Días 4 a 7:** 30°C a 32°C.
- **Semana 2:** 28°C a 30°C.
- **Semana 3:** 25°C a 27°C.
- **Semana 4 en adelante:** 20°C a 22°C (temperatura ambiente normal).

**El termómetro más exacto es el comportamiento del pollito:**
- *Pollitos amontonados bajo la campana y piando fuerte:* Tienen FRÍO.
- *Pollitos pegados a las paredes con el pico abierto:* Tienen CALOR.
- *Pollitos distribuidos uniformemente, comiendo y jugando:* Temperatura IDEAL.`
  },
  {
    keywords: ['calor', 'verano', 'golpe de calor', 'asfixia', 'mucho calor'],
    question: '¿Qué hacer en días de calor extremo para que no mueran por asfixia?',
    category: 'Urgencias y Clima',
    answer: `El calor es el enemigo #1 del pollo grande en etapa final (más de 30 días):

1. **Retirar la comida en las horas más calurosas:** Levantar comederos de 11:00 AM a 17:00 PM. La digestión genera mucho calor interno. Alimentar de noche o temprano en la mañana.
2. **Agua helada / fresca:** Abrir las canillas para purgar las cañerías calientes. Añadir electrolitos o bicarbonato de sodio al agua.
3. **Mojar el techo del galpón:** Por fuera, para bajar hasta 4°C el ambiente interior.
4. **No mover ni asustar a los animales** en horas de pico térmico.`
  },
  {
    keywords: ['coccidiosis', 'sangre', 'caca con sangre', 'diarrea roja', 'enfermedad'],
    question: '¿Qué significa si veo manchas de sangre en las heces (coccidiosis)?',
    category: 'Salud Aviar',
    answer: `Casi con total certeza es **Coccidiosis**, un parásito protozoario muy común cuando la cama está húmeda.

**Qué hacer de inmediato:**
1. Tratar con un coccidicida en el agua de bebida (como Toltrazuril, Amprolio o Sulfaquinoxalina) según indicación veterinaria.
2. Retirar inmediatamente la cama apelmazada y húmeda alrededor de los bebederos y reponer viruta seca y limpia.
3. Dar vitaminas con Vitamina K para ayudar a la coagulación intestinal.`
  },
  {
    keywords: ['retiro', 'dias de retiro', 'periodo de retiro', 'antibiotico faena', 'vender'],
    question: '¿Qué es el "Período de Retiro" y por qué la app lo avisa con alerta roja?',
    category: 'Sanidad y Seguridad',
    answer: `El **Período de Retiro** es el tiempo mínimo (en días) que debe pasar entre la última dosis de un medicamento (antibiótico, antiparasitario) y el momento en que se puede faenar el pollo o consumir sus huevos.

- Si vendes o consumes carne antes de que termine el retiro, contendrá residuos químicos dañinos.
- En la app, cuando cargas un medicamento, te calcula automáticamente el semáforo:
  - 🔴 **EN RETIRO:** Prohibido faenar o vender.
  - 🟢 **APTO CONSUMO:** Libre de residuos.`
  },
  {
    keywords: ['cobb', 'ross', 'lineas', 'razas', 'genetica', 'lohmann', 'hyline'],
    question: '¿Cuáles son las diferencias entre las líneas genéticas?',
    category: 'Genética Aviar',
    answer: `En avicultura no se habla de "razas" sino de "líneas genéticas seleccionadas":

- **Cobb 500 (Parrillero):** Muy veloz, excelente pechuga, patas fuertes. Llega a 3 kg en 42 días.
- **Ross 308 (Parrillero):** Muy noble, gran resistencia y mejor adaptación a cambios de temperatura.
- **Lohmann Brown (Ponedora):** Huevo marrón clásico, cáscara dura, temperamento muy tranquilo, pone más de 300 huevos al año.
- **Hy-Line Brown (Ponedora):** Gran productividad con poco consumo de alimento.
- **Gallinas Criollas / Camperas:** Aves rústicas. Crecen más despacio (4 a 6 meses), pero son resistentes a enfermedades y su carne/huevo tiene gran sabor campestre cotizado.`
  },
  {
    keywords: ['como cargar', 'como usar', 'tutorial', 'primeros pasos', 'novatos', 'que hago'],
    question: '¿Cómo cargo los datos de cada día en 30 segundos desde mi celular?',
    category: 'Guía de la App',
    answer: `¡Es súper fácil! Sigue estos 3 pasos:

1. Entra a la pestaña **"Carga Rápida"** (el botón grande con lápiz 📝).
2. Si hubo bajas, pon cuántas. Si recolectaron huevos o pesaron pollos, anota el número.
3. Dale al botón verde **"Guardar Registro de Hoy"**.

¡Listo! La app calcula automáticamente el porcentaje de postura, el peso ganado, la conversión alimenticia y actualiza todos los gráficos al instante.`
  }
];

export function findPoultryAnswer(query) {
  if (!query || typeof query !== 'string') return null;
  const clean = query.toLowerCase().trim();

  // Score matches
  let bestMatch = null;
  let highestScore = 0;

  for (const item of POULTRY_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of item.keywords) {
      if (clean.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (highestScore > 0 && bestMatch) {
    return bestMatch;
  }

  return {
    question: `Consulta sobre: "${query}"`,
    category: 'Asesoría General',
    answer: `No encontré una ficha exacta para esa frase específica, pero aquí van las 3 reglas de oro para cualquier duda en el galpón:
    
1. **Agua limpia y fresca siempre:** Si las aves no beben, no comen ni ponen huevos.
2. **Ventilación sin corrientes directas:** El amoníaco de las heces daña sus ojos y pulmones. El aire debe renovarse constantemente.
3. **Cama seca:** Cama seca es igual a 90% menos enfermedades intestinales.

*Tip:* Prueba preguntando por: "FCR", "Postura", "Horas de luz", "Temperatura", "Calor", "Coccidiosis", "Retiro" o "Cómo cargar datos".`
  };
}

