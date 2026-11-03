
---

# RONDA 4 — Centro de Comunicaciones, alarmas de términos y atajos contextuales

**Fecha:** 3 de noviembre de 2026 · **Compilación:** `tsc -b` y `npm run build` sin errores · **Pruebas:** Playwright/Chromium, 0 errores de página.

## 1. Criterio de diseño (instrucción del usuario)
Las herramientas **no se muestran de entrada**. En el momento oportuno el flujo pregunta *«¿Lo vas a necesitar?»*:
- **Sí** → el botón de la herramienta queda visible en ese paso.
- **No por ahora** → aparece una nota breve que indica cómo llamarla después: **Ctrl + K** y escribir su nombre (con opción «Mostrar aquí»).
La respuesta se guarda dentro del expediente (persiste al recargar y al reanudar). Ctrl + K funciona también desde la vista limpia.

## 2. Tarea 1 — Centro de Comunicaciones
- **Plantillas (4):** citación a audiencia Art. 86 Ley 1474 de 2011; requerimiento por precio artificialmente bajo; aceptación de oferta en mínima cuantía; notificación de caducidad Art. 18 Ley 80 de 1993. Cada una con campos, vista previa, botón «Abrir en mi correo» (`mailto:` con destinatarios, asunto y cuerpo) y «Copiar texto oficial». Si el `mailto` supera ~1900 caracteres se avisa para usar «Copiar».
- **Alarmas con cuenta regresiva (4):** observaciones al prepliego (10 días hábiles), adendas (límite 3 días hábiles antes del cierre), traslado del informe de evaluación (5 días hábiles), suscripción y garantías (5 días hábiles). Estados: sin fecha / en término / urgente / vencido. Días hábiles colombianos: festivos calculados para cualquier año (fijos, traslado Ley Emiliani, ligados a Pascua), validados 18/18 contra el listado oficial 2026. El término vence a las 23:59:59 del día límite.
- **Verificado:** abre desde Ctrl + K en vista limpia; `mailto` correcto (ambos destinatarios, asunto y cuerpo); copiado funcional; las 4 plantillas generan su texto; cierre 2026‑11‑20 → límite de adendas 2026‑11‑17 (9 días hábiles); informe 2026‑11‑03 → traslado hasta 2026‑11‑10; Esc cierra.

## 3. Tarea 2 — Atajos contextuales en el flujo
| Paso | Pregunta | Herramienta |
|---|---|---|
| 8 | Acuerdo Marco de Precios (solo suministro / sin tipología) | Cotizador TVEC |
| 8 | Sustentar presupuesto con cotizaciones | Media, mediana, menor valor |
| 9 | Cronograma legal | Cronograma con festivos (precargado con modalidad y presupuesto) |
| 10 | Empate (solo con sobres abiertos) | Cascada de desempate Ley 2069 |
| 10 | AIU (solo obra) | Desglose AIU, IVA solo sobre utilidad |
| 12 | Comunicaciones oficiales | Centro de Comunicaciones |
Cada herramienta abre a pantalla completa («Volver al flujo» o Esc) **sin perder datos**: se comprobó que el expediente conserva paso y respuestas tras abrir, cerrar y recargar.

## 4. Desviaciones respecto de la orden
- El cronograma se ofrece en el **Paso 9** (modalidad ya definida), no en el Paso 5.
- Empate y AIU se ofrecen en el **Paso 10**, cuando existen ofertas.
- TVEC solo se pregunta para suministro/bienes.
- **Corrección de un defecto previo:** el contenedor del flujo centraba verticalmente (`sm:justify-center`) y recortaba la parte superior de pantallas altas (Paso 10). Se retiró; ahora todo es desplazable.
- **Ctrl + K desde vista limpia:** los módulos completos (p. ej. «consorcios») llevan a la Vista Experta en vez de no hacer nada.

## 5. Pendientes y límites — a validar por el usuario
- **Base legal no confirmada:** artículo de la Ley 1882 de 2018 para adendas (la interfaz dice «verifícalo»); numeración de artículos del Decreto 1082 de 2015 citada (precio artificialmente bajo, mínima cuantía, observaciones) con confianza moderada.
- **Valores adoptados por el simulador, no por norma:** 5 días hábiles para traslado del informe y para suscripción/garantías.
- SECOP II no ofrece API de escritura: el simulador solo genera borradores (`mailto` / texto copiable); **no envía correos ni push**. Las alarmas corren con la aplicación abierta.
- `TimelineGeneratorEngine` (preexistente) mantiene festivos 2026 fijos; el nuevo motor sí cubre cualquier año.

## 6. Regresión
`t4` (modalidades), `t5` (capacidad residual), `t6` (nota Paso 11), `mp2` (Mis Procesos: crear, reanudar, duplicar, recargar) pasan. `mp.cjs` y `mp3.cjs` (Ronda 3) quedaron desactualizados frente a la regla «Mis expedientes solo con varios» y al rótulo `2xl` del encabezado experto; su comportamiento actual (oculto con 0–1 expedientes en vista limpia, visible en Vista Experta) es el esperado.
