# Informe de prueba — Ruta "Compro" — ProcureSim v2.0
**Fecha:** 2 de noviembre de 2026 · **Probador:** Claude (automatizado, navegador Chromium, sin conexión a datos.gov.co)
**Caso:** Alcaldía de Neiva · Secretaría de Infraestructura · "Mantenimiento vía rural" · $400.000.000 · sin CDP
**Alcance recorrido:** Pasos 1 a 13 completos (incluye inyector de contingencias, escenario 4, opciones A y B, simulador de adiciones, liquidación y descarga .docx).

## A. Corregido durante la prueba
| # | Hallazgo | Acción |
|---|---|---|
| A1 | SMMLV 2026 fijado en $1.423.500 (es el de 2025). Valor correcto: $1.750.905 (Decreto 1469 de 2025). Estaba escrito a mano en 7 archivos de motores y 3 pantallas. | Fuente única `src/core/domain/constants.ts`; todos los módulos la leen. Slider regulatorio ajustado a 1,5–2 M. |
| A2 | Tope de menor cuantía calculado por categoría territorial (valores 350 y 200 inexistentes en la ley). Art. 2 num. 2 lit. b Ley 1150: depende del **presupuesto anual de la entidad**. | Campo opcional "Presupuesto anual de la entidad" en el Paso 6 y tabla legal 1.000/850/650/450/280. Sin el dato, valor de referencia declarado como tal. |
| A3 | Texto "NIT NIT Oficial en verificación". | Corregido. |
| A4 | Número de resolución "N° ión-2026", número de contrato e ID SECOP ("CO1.BDOS.Ofic") armados con letras del NIT cuando este es un marcador. | Ahora usan solo dígitos y caen a valores por defecto. |
| A5 | Documentos privados (RUP, cédula, renta, estados financieros) accesibles desde la red por el servidor de desarrollo. | Movidos a `_documentos_privados/` y bloqueados en `vite.config.ts`. **Requiere reiniciar `npm run dev`.** |

| A6 | **B1 (Paso 7):** las rutas ahora dependen de la cuantía (Licitación Pública si supera la menor cuantía; Menor Cuantía con Mipymes; Mínima Cuantía) y sus textos son neutros (sin hardware ni Huila). La ruta recomendada se selecciona sola. | Corregido (2 nov, noche). |
| A7 | **B2 (Word):** el Estudios Previos usa solo datos del usuario; lo que falta sale "Por definir" (lugar, plazo, UNSPSC) o "CDP pendiente de incorporar"; número de proceso por modalidad (p. ej. SAMC-001-2026); presupuesto expresado también en SMMLV 2026; experiencia limitada al 100 % del presupuesto en SMMLV. | Corregido. |
| A8 | **B3 (valores fijos):** el valor adjudicado, las pólizas, las actas parciales, el balance de liquidación y los botones de adición ahora se calculan del presupuesto ingresado (98,75 % del presupuesto como adjudicación simulada). | Corregido. |

## B. Pendientes (sin corregir — requieren decisión)
*(B1, B2, B3 y B7-formato-de-miles ya corregidos; ver A6-A8. Persisten B4, B5, B6, B8 y B9.)*
**B1 · Crítico · Paso 7 no depende del caso.** Las tres alternativas y sus "jueces" son texto fijo de un caso de hardware/antenas hidrometeorológicas en el Huila (SLA, "cuadrilla técnica", UNSPSC 4322/4321/8111, Pitalito/Garzón/La Plata). Se muestran igual para una vía rural. Además, con $600 M el Paso 6 exige Licitación Pública y el Paso 7 sigue recomendando Menor Cuantía para Mipymes. Contradice el Contrato de Excelencia (cláusula 2, "Que él la cree").
**B2 · Crítico · El Word entregado contiene datos inventados** (`Estudios_Previos_LP-001-2025.docx`):
- Proceso "LP-001-2025" (LP = licitación) con modalidad Menor Cuantía y año 2025.
- "Lugar de Ejecución: Municipio de San Pedro del Valle (Sedes Educativas)" y "Plazo: 3 meses", que el usuario no ingresó.
- "CDP … PENDIENTE_DE_INCORPORACION expedido el 2025-01-15" (fecha inventada, marcador crudo).
- "Experiencia en SMMLV: 400 SMMLV" para un contrato de 228,5 SMMLV (parece tomar los millones del presupuesto como SMMLV).
- UNSPSC 43211500 (equipos de cómputo) para mantenimiento vial.
- Documento de solo ~1.500 caracteres: sin matriz de riesgos, garantías, estampillas ni análisis del sector que anuncia el Paso 9.
**B3 · Alto · Valor adjudicado fijo en $395.000.000** en unos 10 lugares (resolución, contrato, actas parciales, balance de liquidación), sin importar el presupuesto. Con $400 M el balance cierra en $395 M; con $80 M mostraría lo mismo.
**B4 · Alto · Textos que afirman cosas no hechas:** al omitir el Paso 8, las respuestas a observaciones dicen "se costearon integralmente las retenciones y el flete (Paso 8)"; el Paso 11 muestra "CDP oficial 2026-104" y "RP-2026-0892" aunque el CDP quedó pendiente; supervisor fijo "Ing. Juan Camilo Roa".
**B5 · Medio · Pedagogía del Paso 10.** Las opciones se titulan "Decisión Intuitiva Rápida" (con ⚠️) y "Protocolo de Blindaje Legal": el nombre delata la respuesta correcta, y el texto de cada opción se corta con "…". Sugerencia: títulos neutros, orden aleatorio y texto completo.
**B6 · Medio · Textos de ejemplo del flujo de compra** hablan de "bienes… instalados y probados" (Paso 13) para cualquier objeto, y la matriz de riesgos dice "Territorio Nacional" cuando no hay departamento.
**B7 · Bajo · Formato:** "$400000000 COP" sin separador de miles en el expediente; el mensaje de adición ilegal muestra "50.0%" para $197.500.001.
**B8 · Bajo · UVT** en pantalla de scoring: $49.799 (parece la de 2025; verificar la de 2026).
**B9 · A verificar · Art. 40 Ley 80:** el tope del 50 % se mide sobre el valor inicial en SMMLV, no en pesos; el simulador compara en pesos (equivalente solo si inicial y adición son del mismo año). Verificar además si el Consejo de Estado suspendió el Decreto 1469 de 2025 (una fuente lo mencionaba; otra no).

## C. Lo que funcionó bien
- Flujo de 13 pasos completo, sin errores de consola ni cierres inesperados.
- Escenario 4 (póliza posterior al cierre): fundamento correcto (Art. 5 Ley 1882/2018); Opción A muestra el error fatal y la B el procedimiento.
- Simulador de adiciones: $197.500.000 (50,0 %) viable; $197.500.001 ilegal; alerta de Art. 410 C.P.
- Póliza de RCE usa el SMMLV corregido ($350.181.000 por 200 SMMLV).
- Descarga del .docx y cierre de liquidación funcionan.

## D. No probado
Pasos de la ruta "Vendo"; los otros 7 escenarios del inyector; audiencia sancionatoria (Art. 86); casilla de salvedades en liquidación (no apareció el campo de texto al marcarla); consulta en vivo a SECOP II / datos.gov.co (sin red en el entorno de prueba); prueba en celular.
