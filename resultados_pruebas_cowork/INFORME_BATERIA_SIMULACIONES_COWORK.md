# Informe de batería de simulaciones — ProcureSim v2.0
**Fecha:** 3 de noviembre de 2026 · **Alcance:** Prompt Maestro (Fase 1: 6 correcciones · Fase 2: 12 casos)
**Compilación:** `npx tsc -b` y `npm run build` terminan con **0 errores de TypeScript** (hecho en mi copia de trabajo; en tu equipo debes ejecutar `npm run build` una vez).

> **Nota sobre cómo se probó.** Los casos se corrieron en un navegador automatizado (Playwright) contra la versión compilada, ruta **"Compro"**. Los pasos 1–7 se recorrieron completos para los casos 01–08 y 10. Los pasos 9–13 se recorrieron con un caso de obra (más variantes de consultoría, suministro y servicios). **No** se probó la ruta "Vendo", la consulta en vivo a SECOP II (mi entorno no tiene acceso) ni el celular. Donde algo no se pudo comprobar, lo digo.

---

## 1. Verificación de los 6 puntos críticos

| # | Punto | Resultado | Cómo se verificó |
|---|---|---|---|
| 1 | Dilemas del Paso 10 neutrales | **Corregido** | Los 8 incidentes muestran "Postura A / Postura B" sin emojis ni adjetivos, con el texto completo (ya no se corta). El orden se alterna por incidente (en 5 de 8 la postura correcta queda en A y en 3 en B). El mensaje posterior ya no dice "error fatal" sino "esta postura corresponde a un error frecuente" y explica el riesgo jurídico **propio de ese incidente** (antes era una frase genérica igual para todos). |
| 2 | Cero datos inventados (CDP, RP, supervisor) | **Corregido** | Sin CDP, las pantallas y el Word dicen «CDP: En trámite de expedición ante la Secretaría de Hacienda / Dirección Financiera». El RP ya no trae "RP-2026-0892" (muestra "En trámite"). El supervisor dice "Por designar por el ordenador del gasto". La respuesta a la veeduría ya no afirma que "en el Paso 8 se costearon" las estampillas: ahora dice que la entidad lo verificará y ajustará por adenda si falta. "Paz y Salvo Total" pasó a "Por conciliar en la liquidación". |
| 3 | Verbos de liquidación por objeto | **Corregido** | Motor nuevo `ObjectTypologyEngine`. Se infiere el tipo desde la necesidad que escribe el usuario y se puede cambiar con un selector en el Paso 13. Se comprobaron los 4 textos exactos del Prompt Maestro (obra, consultoría, suministro, servicios profesionales). Si no se puede inferir, usa una cláusula neutra. Además hay un botón nuevo que descarga el **borrador del Acta (bilateral) o la Resolución (unilateral) de Liquidación en .docx**; se abrió el archivo y trae la constancia correcta y las salvedades. |
| 4 | UVT centralizada | **Corregido** | `UVT_2026 = 52.374` en `constants.ts` (Resolución DIAN 000238 de 2025). La pantalla de scoring mostraba $49.799 (valor de 2025) y ahora lee la constante. No encontré otro motor con multas o topes en UVT escritos a mano; el texto del Decreto 957 en `ScoringFormulasEngine` solo menciona "UVT" sin cifra. |
| 5 | Art. 40 Ley 80 en SMMLV | **Corregido** | El valor inicial se convierte con el SMMLV del **año de suscripción** (selector 2020–2026 en el simulador de adiciones; tabla `SMMLV_HISTORICO`) y el tope del 50 % se mide en SMMLV. El mensaje muestra el valor en SMMLV y el tope en pesos. Ejemplo comprobado: contrato de $79 M firmado en 2023 (68,1 SMMLV) admite hasta 34,1 SMMLV ≈ $59,6 M a SMMLV 2026, mientras que firmado en 2026 el tope es $39,5 M. Los botones de ejemplo se renombraron "adición moderada / elevada", porque lo que es ilegal en un año puede ser legal en otro. También corregí la cita: es el **parágrafo** del Art. 40 (antes decía "inciso 2°") y el porcentaje se muestra con 2 decimales (antes "50.0 %" para una adición ilegal). |
| 6 | Bitácora de observaciones | **Corregido** | Nueva pestaña **"Bitácora de observaciones"** en el Legal Watchdog, con fecha, origen (veeduría, Contraloría, Procuraduría, decisión del simulador, otro), norma infringida, nivel de riesgo y descripción. Se alimenta sola cuando (a) se publica la respuesta a la veeduría del Paso 9 y (b) eliges una postura en el Paso 10; también tiene formulario manual. Se guarda en el navegador y queda en el registro de auditoría general. |

---

## 2. Matriz de los 12 casos

Leyenda: ✅ comportamiento correcto · 🔧 estaba mal y lo corregí en esta ronda · ⚠️ parcial / no verificado.

| Caso | Valor | Lo que hizo el simulador | Estado |
|---|---|---|---|
| **01** Mínima cuantía, municipio 6ª cat. (papelería) | $14,5 M = 8,3 SMMLV | Clasifica **Mínima Cuantía** (< 10 % de la menor cuantía), "sin RUP obligatorio, menor precio". Recomienda Acuerdo Marco si existe instrumento para papelería. | ✅ clasificación · ⚠️ El simulador no reconoció la categoría de "Alcaldía de Gigante" (queda "valor de referencia": tope 650 SMMLV en vez de 280 para un municipio pequeño). El resultado (mínima) no cambia, pero el umbral exacto sí. No verifiqué los textos de "publicación de 1 día hábil" ni "comunicación de aceptación como contrato". |
| **02** Contratación directa, servicios profesionales | $58 M = 33,1 SMMLV | 🔧 **Antes** recomendaba Mínima Cuantía. **Ahora** recomienda **Contratación Directa (Art. 2 num. 4 lit. h Ley 1150; Dec. 1082/2015 Art. 2.2.1.2.1.4.9)** con cláusulas de insuficiencia de personal de planta, idoneidad, ausencia de subordinación y SGSSS como condición de pago. | 🔧 ✅ |
| **03** Acuerdo Marco, 40 portátiles | $115 M = 65,7 SMMLV | 🔧 **Antes** recomendaba Menor Cuantía. **Ahora** recomienda **Acuerdo Marco / TVEC**, con la salvedad "si existe instrumento vigente" y la cláusula de CDP previo a la orden de compra. | 🔧 ✅ |
| **04** SAMC con convocatoria a Mipymes, polideportivos | $135 M = 77,1 SMMLV | Recomienda **Selección Abreviada de Menor Cuantía con limitación a Mipymes** (Ley 2069 Art. 34, Dec. 1860/2021). | ✅ ruta · ⚠️ El simulador no verifica las 3 solicitudes territoriales de Mipymes ni el certificado de contador: solo lo menciona como cláusula general. |
| **05** Subasta inversa, combustible | $420 M = 239,9 SMMLV | 🔧 Recomienda Acuerdo Marco (existe instrumento de combustibles en CCE; confírmalo en la TVEC) y deja la **Subasta Inversa** como alternativa. | ✅ ruta · ⚠️ No ejecuté la sala de lances ni el margen mínimo del 1 %; el módulo existe (`ReverseAuctionView`). |
| **06** Convenio con Junta de Acción Comunal, placa huella | $85 M = 48,5 SMMLV | 🔧 **Antes** recomendaba Mínima Cuantía. **Ahora** recomienda contrato con organismo de acción comunal, con cláusulas de personería, cuenta bancaria exclusiva y supervisión técnica. | 🔧 ✅ · ⚠️ No modela el tope de valor del Decreto 142 de 2023 (hay que verificarlo a mano). |
| **07** ESE, manual propio | $780 M = 445,5 SMMLV | El nombre "ESE…" lleva al régimen **Manual de Contratación Propio** ("Solicitud Privada de Ofertas / Invitación Pública Institucional", principios del Art. 209 C.P.), sin aplicar Ley 80. | ✅ |
| **08** Licitación vial con pliegos tipo | $9.200 M = 5.254 SMMLV | **Licitación Pública** obligatoria, aplicación de pliego tipo, audiencia de riesgos y de adjudicación. | ✅ ruta · ⚠️ No existe la "Matriz 1 de riesgos de CCE" como tal ni la cita del **Art. 91 Ley 1474** en el código (búsqueda sin resultados). Hay textos sobre anticipo y fiducia en el flujo, pero no vi el 20 % obligatorio con fiducia irrevocable; queda pendiente. |
| **09** Consorcio 60/40 con inhabilidad sobreviniente | — | 🔧 **Antes** el módulo de consorcios no tenía nada sobre el tema. **Ahora** hay un panel que, al marcar al integrante afectado, explica el Art. 9 Ley 80: cesión de su participación a un **tercero** con autorización escrita previa de la entidad, **nunca a otro integrante**, y renuncia si no hay cesión. Probado con 60/40. | 🔧 ✅ |
| **10** Precio artificialmente bajo (−38 %), consultoría POT | $600 M = 342,7 SMMLV | La consultoría se clasifica en Menor Cuantía y la tipología "Consultoría". El incidente 3 enseña el trámite reglado (requerimiento escrito de APU y costos, decisión motivada) y ya no se puede "rechazar de inmediato" sin que el simulador lo marque. 🔧 El motor estadístico **inventaba** la respuesta del proponente ("economías de escala…") y la aceptaba solo; ya no. | 🔧 ✅ · ⚠️ El incidente usa −55 % fijo, no el −38 % del caso; no se puede parametrizar todavía. |
| **11** Sancionatorio Art. 86 Ley 1474, retraso 42 % | — | 🔧 **Antes** el laboratorio mostraba un caso fijo ("retraso del 30 % en entrega de sensores", multa $7.900.000) que no dependía de nada. **Ahora** tiene entradas editables (retraso, plazo, multa diaria pactada, tope) y calcula días, multa bruta, tope y multa aplicable. Con $79 M, 30 % de 90 días, 0,1 %/día y tope 10 %: multa $2.133.000. | 🔧 ✅ · ⚠️ No modela la objeción de la aseguradora ni el siniestro; las 5 etapas del Art. 86 se muestran como lista fija. |
| **12** Liquidación unilateral litigiosa, obra al 72 % | — | El Paso 13 permite elegir **liquidación unilateral por resolución** (Art. 11 Ley 1150: 4 meses bilateral, 2 meses unilateral), registrar salvedades y descargar la Resolución en Word. | ⚠️ No simula el abandono al 72 %, el cobro de la cláusula penal ni el recurso de reposición; solo el acto de liquidación. |

---

## 3. Hallazgos adicionales (no estaban en el prompt)

**Corregidos en esta ronda**
1. **Motor de precio bajo inventaba hechos**: generaba la "sustentación" del proponente y la "aceptación con sustento" del comité. Ahora queda "en revisión" y el usuario decide.
2. **Laboratorio sancionatorio con caso fijo** ($7,9 M, "sensores"): reemplazado por cálculo con entradas.
3. **Capacidad residual (K) de consorcios** — ver pendiente 1; solo rotulé la cifra como estimación didáctica.
4. Empate (incidente 6): el texto decía "tras el paso 7" pero enumeraba 5 criterios. Lo reemplacé por "tras agotar los criterios legales aplicables". **Conviene que revises la lista del Art. 35 Ley 2069 con el texto oficial**, porque no la comparé contra la norma.

**Pendientes que necesitan tu decisión**
1. **La fórmula de K-Residual no es la oficial.** El código calcula `experiencia×0,40 + patrimonio×0,25 + participación×4`, que no corresponde al Decreto 1082 de 2015. Lo rotulé como "estimación didáctica", pero lo correcto es implementar la fórmula oficial (ver recomendaciones). ¿Quieres que lo haga?
2. **Umbral de precio bajo**: usa "media − 1,5 desviaciones o 75 % del presupuesto". Es una heurística razonable, pero no es una regla del Decreto 1082 (la norma exige requerir explicación y decidir motivadamente). Habría que decirlo en pantalla.
3. **Categoría del municipio**: la búsqueda de entidades no trae categoría para municipios pequeños, así que la menor cuantía queda con tope de referencia. Mientras tanto, el campo "presupuesto anual de la entidad" del Paso 6 permite fijar el tope exacto.
4. **"Radicado 65.412" del Consejo de Estado (14-mar-2024)** en el Legal Watchdog: no pude verificarlo. Mientras no se confirme, no debería presentarse como jurisprudencia real.
5. **Decreto 1469 de 2025 / SMMLV 2026**: una fuente mencionaba una posible suspensión por el Consejo de Estado; otra no. Antes de dar $1.750.905 por definitivo, confírmalo en una fuente oficial.
6. **Dos "Bitácora" en la barra superior**: ya existía un botón "Bitácora" y ahora hay una pestaña "Bitácora de observaciones" en el Watchdog. No son lo mismo; si te confunde, dime cuál renombrar.
7. **El prompt cita "Ley 2160 de 2021" para convenios con JAC.** La base legal que usé es **Ley 2166 de 2021 (Art. 95) y Decreto 142 de 2023**; no encontré que la 2160 regule el tema. Corrígelo en tus documentos si la copiaste de ahí.
8. **Datos de demostración que siguen en pantalla** (Paso 9): las dos observaciones y los tres oferentes son ejemplos fijos del simulador, no del caso del usuario.

---

## 4. Registro de cambios en el código (`src/`)

| Archivo | Cambio |
|---|---|
| `core/domain/constants.ts` | + `UVT_2026`, `SMMLV_HISTORICO`, `smmlvDelAnio()` |
| `core/domain/types.ts` | + tipo `ObservacionBitacora` y `OrigenObservacionBitacora` |
| `store/useProcurementStore.ts` | + `bitacoraObservaciones`, `registrarObservacionBitacora()` (persistida) |
| `components/RegulatoryWatchdogModal.tsx` | + pestaña "Bitácora de observaciones" |
| `core/engines/SecopIncidentsSimulatorEngine.ts` | + `posturaTrampa`, `posturaCorrecta`, `peligroJuridico`, `nivelRiesgo` por incidente; texto de empate |
| `core/engines/ObjectTypologyEngine.ts` | **nuevo** — tipología y constancias de recibo |
| `core/engines/ActaLiquidacionEngine.ts` | **nuevo** — borrador .docx de acta/resolución de liquidación |
| `core/engines/ContractExecutionLifecycleEngine.ts` | `validarAdicionPresupuestal` en SMMLV del año de suscripción; + `calcularMultaPorRetraso` |
| `core/engines/DocumentEngine.ts` | texto honesto del CDP |
| `core/engines/AbnormallyLowPriceEngine.ts` | ya no inventa sustentación ni decisión |
| `core/engines/ConsortiumEngine.ts` | + `evaluarInhabilidadSobreviniente` |
| `modules/flowchart/ContractFlowchartView.tsx` | posturas A/B, rutas por tipología (Directa, Acuerdo Marco, JAC), RP/supervisor honestos, selector de tipología, acta de liquidación, selector de año (Art. 40), laboratorio de multas, registro en bitácora |
| `modules/scoring/ScoringSimulatorView.tsx` | UVT desde constante |
| `modules/consortium/ConsortiumView.tsx` | panel de inhabilidad sobreviniente; rótulo de K-Residual |

**Compilación:** `tsc -b` y `vite build` sin errores. No ejecuté `npm run lint`.

---

## 5. Recomendaciones de producto

1. **Simulador de multas con cláusulas del contrato**: que el usuario cargue lo pactado (tasa diaria, tope, cláusula penal pecuniaria) y que el sistema separe *multa* (apremio, Art. 17 Ley 1150) de *cláusula penal* (sanción) y de *siniestro* ante la aseguradora, con las 5 etapas del Art. 86 como lista de chequeo que el usuario marca (no fija).
2. **Capacidad residual (K) oficial para obra pública**: reemplazar la fórmula didáctica por la del Decreto 1082 de 2015 (con capacidad de organización, experiencia, capacidad financiera y saldo de contratos en ejecución), con casos de consorcios.
3. **Verificador de requisitos de Mipymes** (Dec. 1860/2021): contador a cargo, 3 solicitudes territoriales y antigüedad, con semáforo.
4. **Precio bajo parametrizable**: que el usuario ponga el porcentaje (−38 %, −55 %…) y el motor genere el requerimiento y el análisis de sostenibilidad.
5. **Anticipo y fiducia (Art. 91 Ley 1474)**: módulo propio para el anticipo (tope, fiducia o patrimonio autónomo, plan de inversión).
6. **Bitácora exportable** a Excel/Word para auditorías.

---

*Elaborado por Claude. Los textos jurídicos del simulador son material de entrenamiento: verifica cada norma citada contra su fuente oficial antes de usarla en un proceso real.*


---

# RONDA 2 — Orden de continuidad (3 tareas)
**Fecha:** 3 de noviembre de 2026 · **Compilación:** `tsc -b` y `npm run build` sin errores de TypeScript.

## A. Verificación previa: lo que afirmaba el texto de la otra IA frente a lo que hace la aplicación

| Afirmación | Resultado de la prueba |
|---|---|
| La app abre limpia (modo enfocado, sin barras laterales) | **Cierto.** La pantalla inicial solo tiene "Volver", "Vista Experta", "Cambiar a Producir" y la pregunta "¿Hoy vienes a comprar o a vender?". |
| La complejidad (cuantías, topes, alertas) opera de fondo | **Cierto.** Se comprobó en los casos 01–10: el usuario ve una pregunta por pantalla y el cálculo en SMMLV aparece como resultado, no como formulario. |
| Cada proceso que se crea queda guardado en `procuresim-storage-v3` | **Falso.** Probé 7 pasos de "Compro" y el almacén seguía con los 5 procesos de demostración (LP-001-2025, MC-012-2024, SUPL-EVT-2025-045, ARIBA-RFQ-9902…). Al recargar la página el flujo vuelve al inicio y se pierde lo avanzado. Solo el módulo de tendencias (datos.gov.co) crea procesos en el almacén (`crearProceso`). |
| El selector de proceso de la cabecera lista los procesos acumulados | **Solo en parte.** Aparece únicamente en Vista Experta y lista los 5 procesos de demostración, no los que estructuras en el flujo paso a paso. |
| Hay botones "Exportar / Importar Escenario" | **No están visibles.** El componente `Navbar.tsx` existe, pero `App.tsx` no lo monta. |
| Al terminar, "Estructurar un proceso nuevo desde cero" limpia el formulario | **Cierto**, pero lo que no se descargó se pierde: la única salida es el expediente .docx y, ahora, el acta de liquidación. |

**Conclusión:** hoy la aplicación **no administra la acumulación de procesos**. Es una gran herramienta de ejercicio de un proceso por vez. Recomendación: guardar cada expediente del flujo en el almacén (con "Mis procesos": reanudar, duplicar, exportar/importar). No lo hice porque no estaba en la orden y toca ~50 variables de estado del flujo; dime si lo quieres.

### Herramientas de asistencia: nombres reales en pantalla (Vista Experta)
| En la cabecera | Qué abre |
|---|---|
| **Buscar (Ctrl+K)** — funciona también en la vista limpia | Paleta de comandos: saltar a módulos y proveedores |
| **Radar** (con contador) | Radar Regulatorio: hitos normativos, calibrador de variables, sandbox de reformas y **"Bitácora de Observaciones y Vigilancia"** |
| **Mentor CCE** | Mentor pedagógico y auditor de Colombia Compra Eficiente |
| **Auditoría (26)** | Auditoría multirol con 26 actores |
| **Bitácora OCDS** (con contador) | Registro de trazabilidad de acciones (antes se llamaba solo "Bitácora") |
| **Tutor Didáctico** y **Glosario** (barra guiada) | Explicaciones y términos |

## B. Tarea 1 — Resoluciones de diseño y limpieza normativa
1. **Capacidad residual (K) — implementada con la fórmula de la guía oficial de Colombia Compra Eficiente, NO con la de la orden.**
   - La orden decía `KR = (CO×0,20 + CE×0,40 + CF×0,20) − SCE`. Esa expresión suma pesos y puntos en unidades distintas y no coincide con la guía.
   - La guía de CCE (consultada en esta ronda) establece **`CR = CO × (E + CT + CF) / 100 − SCE`**, con CO = mayor ingreso operacional de los últimos 5 años (COP), E = experiencia (máx. 120 puntos), CT = capacidad técnica (máx. 40), CF = capacidad financiera (máx. 40) y SCE = saldo de contratos en ejecución en los 12 meses siguientes.
   - Implementado en `ConsortiumEngine.calcularCapacidadResidual` y en un panel de `ConsortiumView.tsx` donde el usuario digita CO, E, CT, CF y SCE por integrante (el simulador no inventa esos datos; los puntajes se limitan a sus máximos). Prueba: CO $1.000 M, E 100, CT 30, CF 30, SCE $200 M → **CR = $1.400 M**; con E = 500 se recorta a 120 y da $1.600 M.
   - **Verificar:** el texto de la guía muestra el divisor 100 en sus ejemplos aunque los máximos suman 200; confírmalo con la imagen de la fórmula del PDF. En proponentes plurales sumo la CR de los integrantes; confirma la regla en el pliego aplicable. Si prefieres la fórmula de tu orden, cambia las constantes `CR_*` y la línea de cálculo en el motor.
2. **Cita de Juntas de Acción Comunal:** quedó **Ley 2166 de 2021 (Art. 95) y Decreto 142 de 2023**. La orden dice "Ley 2166 de 2022"; la ley es del 18 de diciembre de **2021**, así que mantuve 2021 (corrígelo si tu fuente dice otra cosa).
3. **Bitácoras:** la de la barra superior se llama ahora **"Bitácora OCDS"** y la pestaña del Radar **"Bitácora de Observaciones y Vigilancia"**.

## C. Tarea 2 — Anticipo y fiducia (Art. 91 Ley 1474 de 2011)
Nuevo `AnticipoFiduciaEngine` y tarjeta en el Paso 12, más un recordatorio en el Paso 11 para obras de mayor cuantía.
- **Tope legal: 50 %** del valor del contrato (Concepto C-814 de 2025 de CCE). El **20 %** de la orden figura como **referencia sugerida**, no como límite legal; el simulador avisa si lo superas y marca en rojo si superas el 50 %.
- **Fiducia o patrimonio autónomo irrevocable obligatorio** si se pacta anticipo en obra, concesión o salud que no sean de menor o mínima cuantía, y en toda licitación pública. Con la vía de $9.200 M (caso 08) la tarjeta dice que es obligatoria; con un suministro de $80 M dice que no lo es.
- **Desembolsos sujetos a la aprobación de la interventoría:** lo incluí como práctica que el pliego y el contrato deben fijar. El concepto de CCE que revisé **no** dice quién aprueba los desembolsos, por lo que no lo presento como texto de la ley.
- Prueba (caso 08): anticipo 20 % = $1.817 M sobre $9.085 M adjudicados; con 60 % el mensaje dice que supera el tope legal del 50 %.

## D. Tarea 3 — Las 4 modalidades especiales
Los controles ya existían como banderas en los arquetipos (`mostrarVerificacionLey2195`, `mostrarBalanceAporteEsal`…) pero **la interfaz nunca los mostraba**. Ahora:

| Modalidad | Qué hace el simulador | Estado |
|---|---|---|
| **Contrato interadministrativo / triangulación** | Pide valor del contrato y la parte subcontratada con privados; alerta si pasa del 50 %. Prueba: 60 % → "Posible triangulación", 40 % → dentro del límite. | ✅ funciona · ⚠️ **No pude confirmar el texto de la Ley 2195 de 2022 que fija ese 50 %.** Lo dejé como regla adoptada por tu orden, con esa advertencia en pantalla. |
| **Convenio con ESAL (Decreto 092 de 2017)** | Verifica el aporte: ≥ 30 % del valor total **en dinero** (Art. 5). Prueba: 20 % en dinero + 15 % en especie → "Aporte insuficiente", debe haber proceso competitivo (Art. 4); 30 % → cumple. | ✅ · La orden dice "real y cuantificable"; el decreto, según lo consultado, exige aporte **en dinero**: el aporte en especie no completa el mínimo. Verifícalo con el concepto de CCE sobre el cálculo del 30 %. |
| **Urgencia manifiesta (Arts. 42 y 43 Ley 80)** | Se muestra al detectar emergencia en la necesidad ("derrumbe", "calamidad"…): contratación inmediata, objeto limitado y remisión del expediente al control fiscal. | ✅ · ⚠️ **No pude confirmar el plazo de "3 días hábiles".** El Art. 43 dice que el expediente se remite "inmediatamente" y que el órgano de control se pronuncia en 2 meses. Lo escribí así (y corregí el recordatorio anterior del arquetipo que decía "dentro de los 2 meses", que confundía los dos plazos). Si tienes la norma del plazo de 3 días, dime y lo agrego. |
| **Sancionatorio con aseguradora y caducidad** | En el laboratorio del Paso 12, selector "Multa (Art. 86 Ley 1474) / Caducidad (Art. 18 Ley 80)". Caducidad: informe del supervisor, citación a contratista **y aseguradora**, audiencia, acto motivado, declaratoria del siniestro, **inhabilidad de 5 años** desde la ejecutoria (Art. 8 Ley 80) y registro en RUP/SECOP. | ✅ |

## E. Archivos de esta ronda
Nuevos: `SpecialModalitiesEngine.ts`, `AnticipoFiduciaEngine.ts`. Modificados: `ConsortiumEngine.ts`, `ConsortiumView.tsx`, `types.ts` (campos opcionales de capacidad residual), `ContractFlowchartView.tsx` (paneles de modalidades, tarjeta de anticipo, selector multa/caducidad), `StructuringArchetypesEngine.ts` (recordatorio de urgencia), `TopHeader.tsx` y `RegulatoryWatchdogModal.tsx` (nombres de bitácoras).

## F. Pendientes que necesitan tu decisión
1. ¿Mantengo la fórmula de CCE para la capacidad residual o prefieres la de tu orden? (recomiendo la de CCE).
2. Fuente del límite del 50 % de subcontratación (Ley 2195) y del plazo de 3 días hábiles de la urgencia manifiesta.
3. ¿Implemento "Mis procesos" para que el flujo guarde, reanude y exporte expedientes?
4. El Art. 35 Ley 2069 (desempate) y el radicado 65.412 siguen sin verificar (ronda 1).


---

# RONDA 3 — «Mis Procesos»: persistencia y gestión multi-expediente
**Fecha:** 3 de noviembre de 2026 · **Compilación:** `tsc -b` y `npm run build` sin errores de TypeScript.

## A. Qué se implementó (los 5 puntos de la orden)

| # | Requisito | Cómo quedó |
|---|---|---|
| 1 | Persistencia reactiva del flujo | Cada cambio del flujo paso a paso se guarda solo (espera de 350 ms) en el almacén `useProcurementStore`, que ya persistía en `procuresim-storage-v3`. Se guardan 68 campos del flujo más la ruta jurídica y el arquetipo elegidos. Cada expediente tiene: identificador único (`EXP-…`), fecha de creación y de actualización, entidad, objeto/necesidad, presupuesto, modalidad, paso actual y etiqueta del paso. |
| 2 | Bandeja «Mis expedientes» | Botón discreto «Mis expedientes (n)» en la cabecera (vista limpia y Vista Experta). Cada tarjeta muestra objeto, entidad y presupuesto, rol y modalidad, barra y etiqueta del paso (p. ej. «Paso 9: Estudios previos», «Paso 13: Recibo y liquidación», «Paso 8: Estudio de mercado (CDP en trámite)») y los botones **Reanudar, Duplicar, Exportar y Eliminar** (la eliminación pide una segunda pulsación para confirmar). |
| 3 | Selector de cabecera sincronizado | El selector «Proceso» tiene dos grupos: «Mis expedientes» (los reales) y «Casos de demostración». Al elegir un expediente, el flujo se remonta y reanuda en su paso. En Modo Aprendizaje, si hay expedientes guardados, el selector reemplaza la etiqueta fija «LP-001-2025». |
| 4 | Exportar / importar | Exportar uno o todos a `.json` (formato `procuresim-expedientes`, versión 1) e importar. La importación valida el formato, limita el tamaño (8 MB) y la cantidad (200), elimina claves de prototipo y, si un identificador ya existe, crea una copia «(importado)» en lugar de pisar el original. |
| 5 | «Estructurar un proceso nuevo desde cero» | Guarda el expediente actual y abre un lienzo en blanco. Los anteriores no se tocan. |

## B. Pruebas en navegador (Playwright, Chromium)

| Prueba | Resultado |
|---|---|
| Pantalla inicial | Sin expedientes guardados; solo aparece el enlace discreto «Mis expedientes» además de lo que ya había. |
| Avanzar al Paso 5 y recargar | Se conservan rol, autor, entidad y régimen, y se reabre en «¿Qué necesitas contratar hoy?». El contador pasa a «Mis expedientes (1)». |
| Avanzar al Paso 8 con $180 M y recargar | Reabre en el Paso 8 con el CDP marcado «en trámite»; la bandeja muestra «Paso 8: Estudio de mercado (CDP en trámite)». Continuar desde ahí funciona y actualiza a «Paso 9». |
| Escribir en la necesidad y recargar de inmediato (sin esperar el guardado) | El texto se conserva (guardado al cerrar la pestaña). |
| Duplicar / Exportar todos / Eliminar con confirmación / Importar | 1→2 expedientes; el `.json` trae 2 expedientes; tras eliminar 1; tras importar 3 (sin colisión de identificadores). Un archivo inválido muestra «no es un respaldo de expedientes de ProcureSim». |
| Selector de cabecera | Lista «Mis expedientes» y «Casos de demostración»; al conmutar, el expediente activo cambia. |
| Paso 13 + «Estructurar un proceso nuevo desde cero» | El expediente queda guardado en «Paso 13: Recibo y liquidación» y se abre el lienzo en blanco. Un segundo proceso (papelería $40 M) convive con el primero y sobrevive a la recarga con su valor. |
| Reanudar un expediente liquidado | Vuelve al Paso 13. |
| Errores de página (`pageerror`) | 0 en todas las pruebas. |
| Regresión de rondas anteriores | Triangulación (60 % alerta / 40 % ok), ESAL (20 % insuficiente / 30 % cumple), nota de anticipo en Paso 11, fiducia obligatoria/no obligatoria, capacidad residual ($1.400 M y recorte E = 500 → $1.600 M), barra de herramientas: sin cambios. |

## C. Decisiones de diseño y limitaciones (léelas)
1. **Dónde se guarda:** en el almacenamiento local de este navegador (`localStorage`). No hay servidor: si cambias de navegador, de equipo o borras los datos del sitio, los expedientes no viajan. Para eso sirve **Exportar**. Recomiendo exportar un respaldo al terminar cada proceso.
2. **Cuándo nace un expediente:** cuando el usuario ya escribió algo real (nombre del autor, entidad, necesidad o presupuesto). Pulsar solo «Compro» o «Vendo» no crea expediente (corregido el 3 nov, 05:15, tras ver un expediente vacío «Paso 1» en la bandeja).
3. **Límite del almacenamiento local:** ~5 MB por sitio. Un expediente pesa pocos KB, pero los respaldos conviene archivarlos fuera del navegador.
4. **Compatibilidad:** los campos se restauran por nombre. Si en el futuro se agrega un campo al flujo, un expediente antiguo simplemente lo abre con su valor por defecto. Un archivo importado con tipos de datos incorrectos se ignora campo a campo.
5. **Ruta jurídica:** se guarda solo su identificador y se vuelve a buscar en el catálogo actual al reanudar, de modo que el texto normativo que se muestra siempre es el vigente en la aplicación.
6. **Pantalla limpia:** la vista inicial agrega un único enlace discreto («Mis expedientes») en la cabecera. Si prefieres que aparezca solo cuando ya exista al menos un expediente, es un cambio de una línea (en ese caso no habría forma de importar desde la pantalla limpia).
7. **No incluido (no estaba en la orden):** los 5 procesos de demostración siguen siendo datos de ejemplo del almacén; no se mezclaron con los expedientes. No hay sincronización en la nube ni edición simultánea.

## D. Archivos de esta ronda
Nuevos: `src/core/domain/expedientes.ts` (modelo, etiquetas de paso, validación de importación), `src/components/MisExpedientesModal.tsx` (bandeja).
Modificados: `src/store/useProcurementStore.ts` (expedientes, expediente activo, acciones guardar/reanudar/nuevo/duplicar/eliminar/exportar/importar), `src/modules/flowchart/ContractFlowchartView.tsx` (autoguardado, reanudación, botón «nuevo desde cero»), `src/components/TopHeader.tsx` (botón y selector), `src/App.tsx` (bandeja y remontaje del flujo por lienzo).

## E. Pendientes que necesitan tu decisión
1. ¿Mostrar «Mis expedientes» siempre (como está) o solo cuando exista alguno?
2. Fuente del límite del 50 % de subcontratación (Ley 2195) y del plazo de 3 días hábiles de la urgencia manifiesta (ronda 2).
3. Confirmar el divisor 100 de la fórmula de capacidad residual con la imagen del PDF de CCE (ronda 2).
4. El Art. 35 Ley 2069 (desempate) y el radicado 65.412 siguen sin verificar (ronda 1).

## F. Ajuste por el Contrato de Excelencia (3 nov 2026, 05:00)
Decisión del usuario y principios 3, 4 y 5 de `CONTRATO_DE_EXCELENCIA.md`:
- «Mis expedientes» ya **no aparece en la vista limpia** hasta que haya varios (2 o más; también con 1 si el lienzo actual está en blanco, para no perder el acceso). El selector del Modo Aprendizaje sigue la misma regla. En Vista Experta el botón se mantiene siempre disponible; allí se puede importar un respaldo desde cero.
- Bandeja: se quitaron el texto explicativo y el aviso largo (principio 5); fondo claro en lugar de oscuro (principio 3).
- Verificado en navegador: sin expedientes y con uno activo la cabecera limpia no muestra el botón; en Vista Experta sí. `tsc -b` y `npm run build` sin errores.
