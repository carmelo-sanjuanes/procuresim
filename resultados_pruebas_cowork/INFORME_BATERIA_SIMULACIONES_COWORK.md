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
