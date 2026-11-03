# 🏛️ ORDEN RONDA 4: CENTRO DE COMUNICACIONES, ALARMAS DE TÉRMINOS Y ATAJOS CONTEXTUALES EN EL FLUJOGRAMA
**Destinatario:** Cowork / Claude Tester  
**Proyecto:** *ProcureSim v2.0 - Simulador de Entrenamiento en Contratación Pública Colombiana*  
**Ubicación de trabajo:** `c:\Users\Carmelo\Documents\simmulador par entrenamiento en contratacion publica`  
**Fecha de emisión:** Noviembre 2026  

---

## 📌 CONTEXTO Y BALANCE DE LA RONDA 3
En la Ronda 3 lograste un hito fundamental:
- **«Mis Procesos»** quedó plenamente operativo con autoguardado reactivo (espera de 350 ms), bandeja de expedientes con avance por pasos, reanudación fiel de las 68 variables, duplicación y exportación/importación en formato `.json`.
- Compilación verificada con `tsc -b` y `vite build` con **0 errores de TypeScript**.

Para esta **Ronda 4**, el objetivo es cerrar la experiencia del funcionario integrando **dos capacidades clave**:
1. El **Centro de Comunicaciones, Notificaciones Oficiales y Alarmas de Términos**.
2. Los **Atajos Contextuales Directos en el Flujograma Paso a Paso** para conectar las ayudas especializadas (Línea de Tiempo con festivos, Cotizador TVEC, Desempates Ley 2069 y Calculadora de AIU) sin romper la serenidad de la vista limpia.

---

## 🛠️ TAREA 1: CENTRO DE COMUNICACIONES, NOTIFICACIONES Y ALARMAS DE TÉRMINOS

Crea un módulo o modal accesible (`src/components/CentroComunicacionesModal.tsx` o similar, integrable vía `TopHeader.tsx` o paleta `Ctrl + K`):

### 1. Generador de Notificaciones Oficiales por Correo (Formato Legal Colombiano)
Debe permitir generar 4 plantillas de correo formal de la administración pública:
1. **Citación a Audiencia Sancionatoria (Art. 86 Ley 1474 de 2011):**  
   - Destinatarios: Representante Legal del Contratista y Representante Legal / Apoderado de la Compañía Aseguradora Garante.  
   - Contenido: Fecha y hora de la audiencia, radicado del contrato, informe suscrito por la interventoría y término de descargos.
2. **Requerimiento de Explicación de Precio Artificialmente Bajo (Decreto 1082 de 2015):**  
   - Destinatario: Proponente con oferta bajo sospecha.  
   - Contenido: Detalle de la desviación estadística, requerimiento formal de análisis de precios unitarios (APU), costos laborales y término perentorio para allegar la justificación técnica.
3. **Comunicación de Aceptación de la Oferta en Mínima Cuantía:**  
   - Destinatario: Oferente adjudicatario.  
   - Contenido: Notificación oficial de adjudicación que hace las veces de contrato estatal según el Estatuto, recordatorio de presentación de garantías (si aplican) y designación de supervisión.
4. **Notificación de Resolución de Declaratoria de Caducidad Contractual (Art. 18 Ley 80 de 1993):**  
   - Destinatarios: Contratista, Aseguradora y Cámara de Comercio (para anotación en RUP).  
   - Contenido: Notificación del acto administrativo motivado, fecha de ejecutoria, declaratoria del siniestro e inhabilidad sobreviniente por 5 años.

### 2. Disparadores de Correo y Copia Rápida
- **Botón «Abrir en mi Correo (Outlook / Gmail)»:** Enlace `mailto:` que cargue automáticamente el destinatario (`to`), copia (`cc` si aplica), asunto codificado (`subject`) y el cuerpo formal (`body`).
- **Botón «Copiar Texto Oficial»:** Para pegar en el módulo de mensajería de SECOP II o en el gestor documental institucional (Orfeo, SGD).

### 3. Alarmas Procesales y Cuenta Regresiva de Términos
- Tarjeta de monitoreo con cuenta regresiva visual (días hábiles y horas) para los términos perentorios más críticos:
  - Límite de observaciones al prepliego (mínimo 10 días hábiles en licitación).
  - Límite fatal de expedición de adendas (hasta 3 días hábiles antes del cierre).
  - Límite de traslado del informe de evaluación (5 días hábiles obligatorios bajo pena de nulidad).
  - Plazo para suscripción del contrato y aprobación de pólizas (usualmente 5 días hábiles).

---

## 🛠️ TAREA 2: ATAJOS CONTEXTUALES EN EL FLUJOGRAMA PASO A PASO (`ContractFlowchartView.tsx`)

Sin romper el principio de diseño de *Interacción Humana Progresiva* (pantallas limpias, fondo blanco, serenidad y cero saturación), incorpora botones discretos y elegantes en los pasos pertinentes:

1. **En el Paso 5 (Plazo y Cronograma):**  
   - Botón sutil: **«⏱️ Calcular Cronograma Legal con Festivos de Colombia»**.  
   - Al pulsar, abre o consulta el motor de `TimelineGeneratorEngine`, mostrando los plazos legales sugeridos para la modalidad y permitiendo adoptar las fechas calculadas.
2. **En el Paso 8 (Estudio de Mercado y Presupuesto):**  
   - Botón sutil: **«🛒 ¿Este bien está en Acuerdo Marco? Abrir Cotizador TVEC»**.  
   - Permite consultar el catálogo de CCE (computadores, combustible, vehículos) y ver el precio de referencia para no sobreestimar el presupuesto.  
   - Botón sutil: **«📊 Analizar Cotizaciones (Media / Mediana / Menor Valor)»**.  
   - Conecta con la lógica del `MarketStudyEngine`.
3. **En el Paso 10 / 11 (Evaluación y Adjudicación):**  
   - Botón sutil: **«⚖️ Resolver Empate con Criterios de la Ley 2069 de 2020»**.  
   - Abre el simulador de desempates de `EconomicAuditToolsView` con los 10 criterios legales en orden de prelación.  
   - Botón sutil: **«🏗️ Desglosar AIU e IVA sobre Utilidad»**.  
   - Permite calcular la retención y el IVA del 19% exclusivo sobre la U.

---

## 📋 ENTREGABLES EXIGIDOS A COWORK / CLAUDE

1. **Compilación en Limpio:** Ejecutar `npm run build` en el workspace certificando **0 errores de TypeScript**.
2. **Pruebas en Navegador (Playwright):**
   - Verificar la apertura del Centro de Comunicaciones y la generación de enlaces `mailto:`.
   - Verificar que los atajos en los Pasos 5, 8 y 11 abran las herramientas y regresen al flujo sin perder los datos guardados en «Mis Expedientes».
3. **Actualización del Informe:**
   - Registrar la sección **«RONDA 4»** en `resultados_pruebas_cowork/INFORME_BATERIA_SIMULACIONES_COWORK.md`.
4. **Regeneración del Bundle:**
   - Actualizar `ProcureSim_portatil.html` con todos los cambios incorporados.

---
*¡Inicia la implementación de la Ronda 4 en tu entorno de trabajo!*
