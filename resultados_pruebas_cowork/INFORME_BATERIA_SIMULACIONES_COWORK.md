
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

## RONDA 4 — Adenda: plataforma de publicación según la entidad
- Nuevo `src/core/domain/plataformas.ts`: SECOP II (Ley 80 / 1150), portal propio de la entidad (manual propio, derecho privado) y plataforma del organismo multilateral. Se elige automáticamente por el régimen de la entidad y se puede cambiar a mano en el Paso 9 («Plataforma de publicación»); la elección se guarda en el expediente.
- Se reemplazaron los textos fijos «SECOP II» de los Pasos 9–13 (botones, cabecera, cierre, adendas, firma, acta de inicio, liquidación) por la plataforma elegida. Con el régimen por defecto el texto no cambia.
- **Verificado:** por defecto SECOP II; al elegir portal propio cambia el botón y la cabecera del Paso 10; persiste tras recargar; regresión t4, t6 y r4 sin errores.
- **Por validar:** si una entidad de régimen especial debe además registrar el contrato en SECOP (Ley 1712 de 2014 y su régimen); la interfaz lo dice como «verifica». Pendiente: TVEC como plataforma propia de flujo (órdenes de compra sin pliego) y los portales concretos de cada entidad (p. ej. los de grandes empresas de servicios públicos).

---

# RONDA 5 — Ecosistema multiplataforma según la entidad

**Compilación:** `tsc -b` y `npm run build` sin errores · **Playwright:** 0 errores de página.

## Qué se hizo
- `PlatformRouterEngine.ts`: sugiere la plataforma según entidad, régimen y modalidad. `plataformas.ts` define 7 canales: SECOP II, Tienda Virtual (TVEC), Suplos, SAP Ariba, SECOP I, portal propio y plataforma multilateral.
- Paso 9: selector «Plataforma de publicación» con la sugerida y su motivo; el usuario puede cambiarla. El botón de publicar y los textos de los Pasos 9–13 (cabecera, adenda, apertura, adjudicación, firma, acta de inicio, liquidación y cierre) se adaptan al canal. Se guarda en el expediente.
- «Ver el simulador de …» abre SECOP II, SECOP I, Suplos, SAP Ariba o TVEC en pantalla completa; «Volver al flujo» (o Esc) regresa sin perder datos.

## Pruebas (navegador)
| Caso | Sugiere | Abre vista | Vuelve con estado |
|---|---|---|---|
| Alcaldía de Neiva, obra | SECOP II | — | sí |
| Empresas Públicas de Medellín (EPM) | Suplos | Suplos | sí |
| Ecopetrol | SAP Ariba | SAP Ariba | sí |
| Alcaldía, suministro (Acuerdo Marco) | TVEC | Tienda Virtual | sí |

## Desviaciones de la orden
- **Ecopetrol → SAP Ariba, no Suplos:** el portal de proveedores de Ecopetrol indica que usa SAP Ariba (proveedores.ecopetrol.com.co). Cenit se asignó igual por ser filial (inferido).
- **Selector en el Paso 9**, donde la decisión tiene efecto, no en los Pasos 3/4.
- **SECOP I no se sugiere automáticamente:** no hay dato confiable de categoría municipal en transición. Queda seleccionable a mano.
- Coupa tiene vista en el proyecto pero no se incluyó como canal (la orden no lo lista).

## Por validar
- ISA, EPM, GEB y demás ESP → Suplos es una **heurística sin confirmar**; la pantalla lo avisa. Confirmar la plataforma real de cada entidad.
- Si una entidad de régimen especial debe además registrar contratos en SECOP (Ley 1712 de 2014).
- El simulador de cada plataforma se abre como pantalla de consulta; no está enlazado a los datos del expediente.

---

# RONDA 6 (tanda 1) — Ruta «Vendo»: tu empresa y estudio del proceso (pasos 1 a 15 de 28)

**Compilación:** `tsc -b` y `npm run build` sin errores · **Playwright:** recorrido de los pasos 2 a 15, recarga, bandeja y reanudación, 0 errores de página; regresión de «Compro» (t4, t6, r4, mp2, plataformas) sin cambios.

## Diseño
- Vista propia `src/modules/vendo/VendoFlowView.tsx` (no se infló el flujo de «Compro»), mismo estilo, una pregunta a la vez y autoguardado a 350 ms en «Mis expedientes» (`tipoOperacion: 'VENDO'`). Motor de cálculo en `VendoEngine.ts`; modelo y títulos de los 28 pasos en `domain/vendo.ts`. El porcentaje de avance en la bandeja usa 28 pasos para «Vendo» y 13 para «Compro».
- Mapa completo de 28 pasos en 5 fases (empresa, estudio del proceso, construcción de la oferta, evaluación y adjudicación, después de ganar). Esta tanda implementa los pasos 1 a 15.

## Lo construido
2 quién se postula · 3 habilitación · 4 antecedentes e inhabilidades · 5 capacidad jurídica · 6 banco de experiencia (SMMLV por año) · 7 indicadores financieros y capacidad residual · 8 proceso objetivo y plataforma probable · 9 requisitos del pliego comparados con tu empresa (cumple / no cumple / falta dato) · 10 cronograma y alarmas en días hábiles con festivos · 11 matriz de riesgos · 12 redactor de observaciones al pliego · 13 Mipyme y limitación · 14 decisión Go / No-Go · 15 alianza (consorcio o unión temporal) con validaciones y resumen del expediente.

## Verificado (ejemplo numérico)
Contrato de 600 millones en 2024 = 461,5 SMMLV; capacidad residual 2.000 M × 160/100 − 100 M = 3.100 M; liquidez 2,0, endeudamiento 44,4 %; proyecto de pliego 2‑nov + 10 días hábiles = 17‑nov; con experiencia exigida de 500 SMMLV el Go/No-Go recomienda alianza y, al sumar un socio de 300 SMMLV, cumple; participaciones que no suman 100 % se avisan. Todo se conserva tras recargar y al reanudar desde «Mis expedientes».

## Correcciones frente a la orden original
Umbrales de indicadores escritos desde el pliego (no fijos); Art. 50 Ley 789 certificado por revisor fiscal o representante legal (Art. 23 Ley 1150); alianza solo para completar requisitos, nunca para reducir competencia; descarga de la propuesta en el paso 22 (no en el 13).

## Por validar
Renovación del RUP (quinto día hábil de abril), umbral y requisitos de la limitación a Mipyme (Decreto 1082 de 2015), año de conversión a SMMLV según cada pliego, y forma de sumar la experiencia de integrantes plurales: la interfaz los marca como «verifícalo». Pasos 16 a 28 pendientes (tandas 2 y 3).

---

# RONDA 6 (tanda 2) — Ruta «Vendo»: construcción de la oferta (pasos 16 a 22)

**Compilación:** `tsc -b` y `npm run build` sin errores · **Playwright:** recorrido de los pasos 2 a 22, descarga del .docx, recarga con persistencia, 0 errores de página; regresión de «Compro» y de la bandeja sin cambios.

## Lo construido
16 costos directos por partida (materiales, mano de obra con factor prestacional, equipo, transporte) · 17 AIU, IVA solo sobre la utilidad en obra, estampillas, contribución y pólizas, con lo que queda para administración, imprevistos y utilidad · 18 flujo de caja y anticipo (máxima necesidad de financiación y costo financiero; aviso del tope del 50 % y la fiducia, Art. 91 Ley 1474) · 19 simulación de precio contra precios supuestos de competidores con la fórmula elegida (motor `ScoringFormulasEngine`) y sensibilidad ±5 % y −10 % · 20 personal, SST y compromisos · 21 sobre 1 y garantía de seriedad · 22 oferta económica, control previo al cierre y descarga de la propuesta en Word (`PropuestaVendoDocx.ts`).

## Verificado (ejemplo numérico)
Concreto 100 × (400.000 + 100.000 × 1,5) + excavación 200 × 50.000 = costo directo 65.000.000; AIU 10/3/7 % → 78.000.000; IVA 19 % solo sobre la utilidad = 864.500; total 78.864.500. El Word contiene solo los datos registrados: lo faltante sale como [PENDIENTE], y la declaración de inhabilidades se reemplaza por «NO FIRMAR» si la verificación de antecedentes no está completa.

## Observación sobre un motor existente
`ScoringFormulasEngine` calcula el umbral de precio artificialmente bajo como el menor entre (media − 2σ) y el 80 % del presupuesto oficial; con pocas ofertas puede quedar muy por debajo del 80 %. Para el licitante se agregó aparte una alerta por debajo del 80 % del presupuesto oficial (referencia, no norma). Conviene revisar el motor.

## Por validar
Porcentaje y vigencia de la garantía de seriedad (10 % es el valor habitual en licitación), contribución especial de obra pública y estampillas (dependen de cada entidad), fórmula económica real del pliego, y el tope y manejo del anticipo. Pendientes: pasos 23 a 28 (tanda 3).

## RONDA 6 (tanda 3) — Ruta «Vendo»: pasos 23 a 28 (ruta completa de 28 pasos)

**Construido:** 23 Informe de evaluación y subsanación (distingue lo subsanable de lo que no lo es, alarma de traslado, memorial borrador); 24 Adjudicación y reclamaciones (guía por resultado, alarma de suscripción, acceso al desempate); 25 Contrato, garantía única (valor asegurado por amparo a partir del % del pliego) y lista de Acta de Inicio; 26 Ejecución y pagos (actas con amortización de anticipo, estampillas, neto y avance); 27 Modificaciones, multas y defensa (tope de adición 50 %, multa con tope, descargos borrador); 28 Liquidación y experiencia (plazos de liquidación, lista de cierre, «Agregar este contrato a mi experiencia»).

**Verificado (Playwright, 0 errores de página):** tras la recarga se conserva el paso 28 y la experiencia agregada. Cifras: acta 100 M con anticipo 30 %, estampillas 2 % y contribución 5 % → neto 63.000.000; adición 600 M sobre 1.000 M = 60 % (supera 50 %, máximo 500 M); multa 0,1 %/día × 20 días = 20 M, limitada al tope 1 % = 10 M; terminación 2027-03-31 → liquidación bilateral 2027-07-31 y unilateral 2027-09-30; adjudicación 2026-12-22 + 5 hábiles = 2026-12-30 (festivo del 25 excluido). Regresión: vendo2, t6, t4, r4c y plat2 sin fallos.

**Por validar con abogado (marcado «verifícalo» en la interfaz):** plazos del Art. 11 Ley 1150 (4 meses + 2), caducidad de 4 meses (CPACA Art. 164), tope de adición del 50 % (Art. 40 Ley 80), procedimiento del Art. 86 Ley 1474, renovación del RUP en abril, plazo de suscripción de 5 días hábiles (adoptado por el simulador).

**Límites conocidos:** el pago neto no incluye retención en la fuente; los porcentajes de garantía, multas y vigencias los digita el usuario según su pliego/contrato.

## RONDA 6 (adenda) — Línea de tiempo automática de la venta

**Qué es:** vista a pantalla completa («Línea de tiempo», siempre visible en el encabezado de la ruta «Vendo») que se genera sola con las fechas ya digitadas; no hay que «construirla». Calcula y ordena: publicación del pliego, último día de observaciones, adendas, cierre, informe, fin del traslado, adjudicación, límite de firma, Acta de Inicio, actas de pago, terminación (digitada, o estimada = inicio + plazo en meses), liquidación bilateral y unilateral, y registro de experiencia en el RUP (quinto día hábil de abril). Resalta el «Siguiente» hito con días hábiles restantes, también visible en el encabezado de cada paso. Las fechas de entrada se editan ahí mismo; avisa de fechas incoherentes; exporta todo a calendario (.ics, recordatorio un día antes). Nuevo campo: Fecha del Acta de Inicio (paso 25).

**Verificado (Playwright, 0 errores de página):** línea vacía con guía al paso 10; 15 hitos en orden (p. ej. pliego 2026-11-02 → observaciones 11-17 → adendas 12-04 → cierre 12-10 → informe 12-15 → traslado 12-22 → firma 12-30 → inicio 2027-01-11 → terminación 07-11 → liquidación 2027-11-11 / 2028-01-11 → RUP 2028-04-07); editar el cierre recalcula adendas; avisos por orden incoherente; .ics con 30 eventos; Esc cierra; «Ver paso N» navega; persiste tras recargar; sin desborde en móvil.

**Límite:** no se enlaza todavía con las alarmas del Centro de Comunicaciones (el .ics cubre el aviso externo). Los plazos supletivos siguen marcados «verifícalo».

## RONDA 7 — Consorcios y alianza en «Vendo» (versión ajustada: sin sugerir aliados)

**Decisión del usuario:** la aplicación NO sugiere empresas aliadas; el operador las busca según su necesidad. Se descartó el «matchmaking» con proveedores de demostración.

**Construido:** (1) Paso 15, tarjeta «Qué necesitas de un aliado»: compara tus datos con el pliego y dice qué falta con cifras (p. ej. 38,5 SMMLV en UNSPSC 721015), dónde buscar (red propia, RUES/Cámara de Comercio, SECOP II, gremios) y qué verificar antes de firmar; ficha de búsqueda copiable; nota de blindaje de libre competencia (Art. 410A C.P.; marcada «verifícalo»). (2) Pregunta «¿Vas a formalizar el acuerdo…?» y botón que abre el Gestor de consorcios y minutas (ConsortiumView) en pantalla completa con los integrantes ya cargados; lo que se cambie allá vuelve al paso 15; Esc/«Volver al flujo» regresa sin pérdida. Disponible también en Ctrl+K («consorcio»). (3) .docx de la propuesta: sección 2.1 con cuadro de integrantes (NIT, %, rol, experiencia, actividades si es unión temporal), aviso si no suman 100 % y cláusula de responsabilidad (Art. 7 Ley 80: solidaria en consorcio; sanciones por participación en unión temporal).

**Verificado (Playwright, 0 errores):** necesidad calculada (38,5 SMMLV), botón del gestor bloqueado sin integrantes, gestor abre con el aliado y las minutas, Esc regresa con 2 integrantes intactos, .docx contiene cuadro y cláusula.

**Aviso de uso:** no digitar la experiencia propia en «Experiencia que aporta» (ya viene del paso 6); se advierte en pantalla.

## RONDA 6 (adenda 2) — Buscador inteligente de oportunidades («Vendo»)

**Qué es:** botón «Oportunidades» en el encabezado de la ruta «Vendo» (todos los pasos) que abre un buscador a pantalla completa.
- **Perfiles configurables y guardados** (se guardan solos; varios perfiles): códigos UNSPSC (acepta 72, 7214 o 72141000), palabras clave, palabras a excluir, departamentos, presupuesto mínimo/máximo, modalidades y antigüedad (7–90 días). «Tomar los códigos de mi experiencia y del pliego» los precarga.
- **SECOP II en vivo:** consulta los datos abiertos del Estado (datos.gov.co, conjunto de procesos de contratación de SECOP II) y trae solo procesos abiertos y publicados. Verificado contra el servicio real desde el navegador (CORS abierto).
- **Puntaje de afinidad 0–100** contra el perfil y tus datos (código, palabras, región, valor frente a tu capacidad residual, recencia) con las razones y las alertas (supera tu capacidad, presupuesto sin definir, cierre no disponible). Marca «Nueva» lo no visto en búsquedas anteriores.
- **Otras plataformas** (TVEC, SECOP I, SAP Ariba, Suplos, portales propios): no publican una consulta abierta que se pueda leer; se ofrece el acceso, cómo buscar y el **registro manual** de lo que encuentres, que entra al mismo seguimiento y puntaje.
- **Mis oportunidades:** seguimiento con estado (Interesante, Evaluando, Postulado, Descartada) y nota.
- **«Usar en mi propuesta»** carga número, entidad, objeto, presupuesto y modalidad en el paso 8; si ya había datos, pide confirmar antes de reemplazarlos.

**Verificado (Playwright, 0 errores):** consulta armada con todos los filtros (código, palabras, departamento, tope, exclusión); orden por puntaje (100 / 77 / 9); alerta de capacidad; «Nueva» desaparece en la segunda búsqueda; registro manual; estado y persistencia tras recargar; «Usar» salta al paso 8 con los datos; confirmación antes de reemplazar; mensaje de error de red; sin desborde en móvil. Consulta real: devolvió procesos reales de SECOP II.

**Límites (a la vista del usuario):** los datos abiertos no traen la fecha de cierre ni son instantáneos (se actualizan con retraso), así que cada resultado dice que se confirme en el proceso; cobertura limitada a SECOP II; el puntaje es una guía, no una decisión (el Go/No-Go sigue en el paso 14).

**Adenda 2b — Buscador ↔ línea de tiempo:** «Usar en mi propuesta» ahora carga también la fecha de publicación y la de cierre (si existe) y la línea de tiempo se arma sola con ellas (nuevo hito «Publicación del proceso»). Los datos abiertos de SECOP II no traen el cierre: la línea de tiempo avisa «Falta la fecha de cierre» hasta que se digite (paso 8, o al registrar la oportunidad manualmente, que ahora pide «Cierre de ofertas»). En «Mis oportunidades» cada una muestra cuántos días hábiles faltan para el cierre. Al usar otra oportunidad se limpia el cierre anterior (no se arrastran fechas de otro proceso). Verificado: cierre manual → paso 8 → línea de tiempo (publicación, adendas, cierre); SECOP sin cierre → aviso; regresión vendo4, línea y buscador sin errores.

## ANÁLISIS ADVERSARIAL — pasos 23–28, línea de tiempo, consorcios y buscador

Entradas hostiles (Playwright, script `adv.cjs`): estado guardado corrupto o con nulos, fechas imposibles o absurdas, plazos negativos/enormes/no numéricos, números en formatos raros (1e9, `$ 1.000.000,50`, dígitos árabes), comillas e inyección SQL/SoQL en palabras clave, respuestas del servicio mal formadas (objeto de error, HTML, 500, registros nulos), HTML/JS en textos y enlaces, almacenamiento local dañado y texto con caracteres de control en la propuesta Word.

**Defectos reales encontrados y corregidos**
1. **Pantalla en blanco** al guardar una fecha no válida («abc») o un plazo enorme: la línea de tiempo y las alarmas ahora ignoran fechas que no existen o están fuera de 1990–2100, y limitan el plazo de ejecución a 600 meses.
2. **Propuesta Word que no abría:** caracteres de control en nombres o textos dejaban el XML inválido. Ahora se eliminan antes de generar el .docx (verificado: XML válido).
3. **Un solo registro dañado del servicio tumbaba todos los resultados** del buscador; ahora se descartan los registros inválidos y se muestran los buenos. Además solo se aceptan enlaces http/https (se bloquea `javascript:`).
4. **Buscador se caía con perfiles guardados incompletos o corruptos:** ahora se normalizan con valores por defecto.

**Resistió sin cambios:** comillas e inyección en la consulta (se escapan), HTML/JS en textos (no se ejecuta; 0 diálogos), respuesta 500/HTML/objeto de error (mensaje de error), doble clic en Buscar, números hostiles en adición, multa y actas (sin caída), fechas como 0001 y 9999.

**Pendiente menor:** cifras absurdamente grandes se muestran tal cual (p. ej. un valor de 10^21); no rompen nada.
