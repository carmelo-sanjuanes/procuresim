# 🏛️ ORDEN RONDA 7: GESTOR AVANZADO DE CONSORCIOS, MATCHMAKING DE ALIADOS Y MINUTAS EN LA RUTA «VENDO»
**Destinatario:** Cowork / Claude Tester  
**Proyecto:** *ProcureSim v2.0 - Simulador de Entrenamiento en Contratación Pública Colombiana*  
**Ubicación de trabajo:** `c:\Users\Carmelo\Documents\simmulador par entrenamiento en contratacion publica`  
**Fecha de emisión:** Noviembre 2026  

---

## 📌 CONTEXTO Y BALANCE
En la Ronda 6 completaste los 28 pasos de la ruta **«Vendo»**, con autoguardado, diagnóstico Go/No-Go, cálculo de AIU, propuesta en Word (`.docx`), amortización de anticipos y acumulación en el banco de experiencia.

En el **Paso 14 y 15**, cuando un licitante descubre que solo no cumple los requisitos (le faltan SMMLV de experiencia, liquidez o cupo K-Residual), el sistema le pide estructurar una alianza plural.  
Sin embargo:
1. El usuario debe ingresar los aliados manualmente sin saber quién puede complementarlo.
2. La potente herramienta existente [`ConsortiumView.tsx`](file:///c:/Users/Carmelo/Documents/simmulador%20par%20entrenamiento%20en%20contratacion%20publica/src/modules/consortium/ConsortiumView.tsx) (con minutas de constitución, poderes, MOU y evaluación de inhabilidad sobreviniente) está desconectada del flujo paso a paso de la venta.

---

## 🛠️ TAREA 1: RECOMENDADOR INTELIGENTE DE ALIADOS («MATCHMAKING DE CONSORCIOS»)

Crea un motor sencillo o amplía `ConsortiumEngine.ts` con lógica de matchmaking:
1. **Diagnóstico del Déficit del Licitante:**
   - Detectar qué le falta al licitante frente al pliego:
     - *Déficit de Experiencia:* Cuántos SMMLV le faltan en los códigos UNSPSC exigidos.
     - *Déficit Financiero:* Si no alcanza el índice de liquidez (>= 1.2) o el patrimonio mínimo.
     - *Déficit de Cupo K:* Si no alcanza la capacidad residual de obra.
2. **Sugerencia de Aliados Compatibles:**
   - A partir del directorio de proveedores habilitados (conectando con `PROVEEDORES_DEMO` y `DynamicMarketSupplierEngine`), identificar 2 o 3 perfiles de empresas que cubren exactamente ese faltante.
   - Mostrar en el Paso 15 una tarjeta discreta:  
     *«Aliados estratégicos sugeridos para complementar tu propuesta»*, mostrando:
     - Nombre de la empresa y NIT.
     - Qué aporta (ej. *«Aporta 3.500 SMMLV en obras viales (UNSPSC 72141000)»* o *«Fortalece liquidez y patrimonio»*).
     - Botón **«+ Incorporar a mi Alianza»**: al pulsar, precarga automáticamente al integrante en la lista de consorciados con un porcentaje sugerido (ej. 40% o 50%).
3. **Blindaje Preventivo contra Colusión (Art. 410A Código Penal y Guías SIC):**
   - Incluir una nota pedagógica de advertencia:  
     *«Blindaje de Libre Competencia: La alianza plural debe ser procompetitiva (para sumar capacidades que individualmente no se tienen). Está prohibido consorciarse entre competidores directos con capacidad individual plena con el propósito de repartirse el mercado o eludir la puja (delito de acuerdos restrictivos de la competencia).»*

---

## 🛠️ TAREA 2: ATAJO CONTEXTUAL EN EL PASO 15 DE LA RUTA VENDO

En `src/modules/vendo/VendoFlowView.tsx`, dentro del Paso 15:
1. Incorporar el botón contextual bajo el patrón de ayuda:
   - Pregunta: *«¿Vas a formalizar el acuerdo de consorcio o unión temporal?»*
   - Botón: **«👥 Abrir Gestor Avanzado de Consorcios y Minutas»**.
2. Al hacer clic, abre `ConsortiumView` a pantalla completa mediante `HerramientaModal`:
   - Los datos de los integrantes configurados en el Paso 15 se transfieren a la vista de consorcios.
   - El licitante puede descargar:
     - **Documento de Constitución de Consorcio o Unión Temporal** (con individualización de sanciones si es UT - Art. 7 Ley 80).
     - **Poder Especial al Representante Legal**.
     - **Acuerdo de Confidencialidad y MOU**.
   - El botón superior **«← Volver al flujo»** (o la tecla `Esc`) regresa al Paso 15 conservando el expediente intacto.

---

## 🛠️ TAREA 3: INCORPORACIÓN DEL DOCUMENTO DE ALIANZA EN LA PROPUESTA (.DOCX)

En `src/core/engines/PropuestaVendoDocx.ts`:
- Si el proponente es un Consorcio o Unión Temporal (`tipoAlianza !== 'SOLO'`), incluir en la descarga del Word de la propuesta:
  - Cuadro formal de integrantes con sus NITs, porcentajes de participación y representante designado.
  - Cláusula de responsabilidad solidaria (Consorcio) o discriminación de actividades (Unión Temporal).

---

## 📋 ENTREGABLES EXIGIDOS A COWORK / CLAUDE

1. **Compilación en Limpio:** Ejecutar `npm run build` en el workspace certificando **0 errores de TypeScript**.
2. **Pruebas en Navegador (Playwright):**
   - Iniciar una propuesta en la ruta «Vendo».
   - En el Paso 15, probar la incorporación de un aliado sugerido por el recomendador.
   - Abrir el Gestor Avanzado de Consorcios, verificar la minutas y volver al flujo sin pérdida de datos.
   - Descargar la propuesta en `.docx` y comprobar que incluya el cuadro del consorcio.
3. **Actualización del Informe:**
   - Registrar la sección **«RONDA 7 — Consorcios y Matchmaking»** en `resultados_pruebas_cowork/INFORME_BATERIA_SIMULACIONES_COWORK.md`.
4. **Regeneración del Bundle:**
   - Actualizar `ProcureSim_portatil.html` con todos los cambios incorporados.

---
*¡Inicia la implementación de la Ronda 7!*
