# 🐔 Pollos Reis - Web App de Gestión Avícola Familiar

Una aplicación web moderna, ágil y diseñada específicamente para el trabajo de campo en el celular dentro del galpón, superando a las aplicaciones avícolas de pago y sin costos mensuales.

---

## 🚀 Cómo Usarla Ya Mismo en la Red de la Granja (Módem + Repetidor)

El servidor ya está activo en tu computadora. Desde cualquier celular (Android o iPhone), tablet o notebook conectado al Wi-Fi o repetidor de la casa:

👉 Abre en el navegador del celular:
```text
http://192.168.0.106:3000
```

### 📱 Cómo instalarla como App en el Celular de Mamá:
1. Abre el enlace `http://192.168.0.106:3000` en **Chrome** (Android) o **Safari** (iPhone).
2. Toca los tres puntitos (o el botón compartir en iPhone).
3. Selecciona **"Agregar a la pantalla principal"** o **"Instalar aplicación"**.
4. ¡Listo! Quedará un ícono llamado **"Pollos Reis"** como una app nativa, a pantalla completa y sin barras de navegador.

---

## 🌐 Cómo Publicarla en Surge (En Línea 24/7)

Si quieres que esté accesible desde cualquier lugar fuera de la granja con internet:

```bash
# Compilar la versión final
npm run build

# Publicar en Surge con tu propio subdominio gratuito
npx surge dist pollos-reis.surge.sh
```
*(La primera vez te pedirá un email y una contraseña para crear tu cuenta gratuita de Surge).*

---

## 🗄️ ¿Cómo se guardan los datos? (Base de Datos vs Git)

* **Git:** Guarda el código de programación (el diseño y los botones de la app).
* **Base de Datos:** Guarda los números diarios (bajas, huevos, kilos de ración, ventas).
* **En esta app:** Todo se guarda de forma automática en la **memoria del celular/navegador (LocalStorage / IndexedDB)**.
  * **Cero costo:** No tienes que pagar ninguna base de datos ni suscripción.
  * **Modo Galpón (Offline):** Si vas al fondo del galpón donde no llega la señal de Wi-Fi, la app sigue funcionando al 100% y no pierde ningún dato.
  * **Compartir por WhatsApp:** Botón directo para generar un reporte diario completo y enviárselo a mamá o al grupo familiar con 1 toque.
  * **Copia de Respaldo:** Puedes descargar un archivo `.json` de seguridad o restaurarlo cuando quieras.

---

## ✨ Funciones Incluidas

1. **Gestión de Lotes Especializada:**
   * 🥚 **Ponedoras:** Postura diaria, % de postura, conteo de maples (1 maple = 30 huevos), rotos y sucios.
   * 🍗 **Parrilleros / Engorde:** Pesajes de muestra (balanza grupal automática), FCR (Conversión de alimento), Ganancia Diaria de Peso (GDP) e IEE (Índice Europeo de Eficiencia Productiva).
   * 🐓 **Variedad de Campo / Criollas:** Control mixto de huevo campero y carne de traspatio.
2. **Carga Rápida en 30 Segundos:** Diseñada con botones gigantes para usar con una mano o guantes en el galpón.
3. **Semáforo de Retiro Sanitario:** Alerta en rojo si algún antibiótico/remedio está en período de retiro para evitar faenar o vender animales con residuos químicos.
4. **Finanzas Familiares:**
   * Coste real por ave viva, costo por kg de carne y costo por maple de huevo.
   * Balance en vivo de gastos vs ventas cobradas.
5. **Asistente Avícola IA y Guía:**
   * Respuestas instantáneas sobre temperatura de pollitos BB, manejo de calor extremo, coccidiosis, iluminación y más.
   * Glosario y explicaciones paso a paso para que cualquier miembro de la familia entienda las métricas.
