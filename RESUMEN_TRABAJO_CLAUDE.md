# Resumen del trabajo realizado — ProcureSim v2.0
**Fecha:** 2 y 3 de noviembre de 2026
**Carpeta del proyecto:** `C:\Users\Carmelo\Documents\simmulador par entrenamiento en contratacion publica\`

---

## 1. Qué me pediste
Probar y terminar el simulador, revisar la carpeta `resultados_pruebas_cowork` y ayudarte a evaluar la ruta de **compra** ("Compro") antes de que el equipo del cowork lo pruebe.

## 2. Cómo trabajé
- **Mi entorno no es tu computador.** Trabajo en un entorno aparte (Linux). Tu `node_modules` es de Windows y no funciona allí.
- **Para compilar y probar** llevé el código fuente a mi entorno, reinstalé las dependencias, compilé y recorrí la aplicación con un navegador automatizado.
- **Para modificar tu proyecto** edité los archivos directamente en tu carpeta, o los edité en mi copia y los guardé después en tu carpeta.
- **Compilación:** `npm run build` (tsc + vite) termina con 0 errores. El lint solo da advertencias de variables sin usar.

## 3. Qué encontré en la carpeta de resultados
`resultados_pruebas_cowork` tenía la plantilla vacía y la guía de prueba (`GUIA_Y_PROTOCOLO_PRUEBA_COWORK.md`). No había respuestas de testers todavía.

## 4. Problemas encontrados y corregidos

### 4.1 Salario mínimo desactualizado (crítico, legal)
- **Problema:** la guía y el código usaban $1.423.500 como SMMLV 2026. Ese es el valor de 2025.
- **Valor correcto:** $1.750.905 (Decreto 1469 de 2025).
- **Efecto:** estaba escrito a mano en 7 archivos de motores y 3 pantallas, y afectaba cuantías, topes y la capacidad residual.
- **Corrección:** archivo nuevo `src/core/domain/constants.ts` con `SMMLV_2026 = 1750905`. Todos los módulos lo leen desde ahí. Corregí también los comentarios y el control deslizante de la configuración regulatoria (ahora de 1,5 a 2 millones).

### 4.2 Tope de menor cuantía (crítico, legal)
- **Problema:** la app lo calculaba por la categoría territorial del municipio, con valores (350 y 200) que no existen en la ley. Además, el código viejo encontraba un "1" dentro del texto "Ley 617" y daba 650 por casualidad.
- **Lo que dice la ley:** el Art. 2, num. 2, lit. b de la Ley 1150 de 2007 lo fija por el **presupuesto anual de la entidad** en SMMLV: 1.000 (≥1.200.000), 850 (≥850.000), 650 (≥400.000), 450 (≥120.000) y 280 (menos).
- **Corrección:** en el Paso 6 hay un campo opcional, "Presupuesto anual de la entidad en COP". Si se llena, aplica la tabla legal. Si no, usa un valor de referencia y lo dice en el texto de la pantalla.

### 4.3 Paso 7 igual para todos los casos (crítico)
- **Problema:** las tres rutas y sus "jueces" eran texto fijo de un proyecto de hardware y antenas en el Huila. Aparecían igual para una vía rural. Con $600 millones el Paso 6 exigía Licitación Pública y el Paso 7 recomendaba Menor Cuantía.
- **Corrección:** las rutas ahora dependen de la cuantía determinada en el Paso 6:
  - **Licitación Pública** si supera la menor cuantía.
  - **Menor Cuantía con limitación a Mipymes** dentro de ese rango.
  - **Mínima Cuantía** para valores muy bajos.
- La ruta recomendada se selecciona sola y los textos son neutros.

### 4.4 Word de Estudios Previos con datos inventados (crítico)
- **Problema:** el documento traía datos de un caso de demostración que el usuario nunca ingresó:
  - proceso "LP-001-2025" con modalidad de menor cuantía;
  - lugar de ejecución "San Pedro del Valle";
  - plazo de 3 meses;
  - un CDP "expedido el 2025-01-15";
  - experiencia de 400 SMMLV para un contrato de 228,5 SMMLV;
  - códigos de equipos de cómputo para una obra vial.
- **Corrección:** ahora usa solo lo que el usuario ingresó.
  - El número de proceso sale según la modalidad (por ejemplo `SAMC-001-2026`).
  - El lugar, el plazo y los códigos UNSPSC dicen "Por definir".
  - El CDP dice "pendiente de incorporar".
  - El presupuesto aparece también en SMMLV 2026.
  - La experiencia queda limitada al 100 % del presupuesto en SMMLV.

### 4.5 Valor adjudicado fijo en $395 millones
- **Problema:** aparecía en unos 10 lugares (resolución, contrato, pólizas, actas parciales, liquidación y botones de adición) sin importar el presupuesto.
- **Corrección:** ahora se calcula del presupuesto ingresado, con una adjudicación simulada del 98,75 %. Con $80 millones, el balance muestra $79.000.000 y los botones de adición proponen valores acordes (24M legal y 44M ilegal).

### 4.6 Otros arreglos pequeños
- **Texto "NIT NIT Oficial en verificación":** ahora dice una sola vez "NIT".
- **Números de resolución y contrato:** salían como "N° ión-2026" y el ID de SECOP como "CO1.BDOS.Ofic". Ahora usan solo dígitos del NIT y caen a valores por defecto.

### 4.7 Seguridad de los documentos privados
- **Problema:** el servidor de desarrollo reparte toda la carpeta del proyecto en la red local. En esa carpeta estaban el RUP, la cédula del representante legal, la declaración de renta y los estados financieros.
- **Corrección:**
  - moví esos archivos y `ALIADOS 2026.zip` a la subcarpeta `_documentos_privados`;
  - bloqueé en `vite.config.ts` la entrega de esa subcarpeta, de los archivos `.env`, de los `.pdf` y de los `.zip`.
- **Importante:** hay que **reiniciar `npm run dev`** para que el bloqueo funcione. Nunca lo probé desde otro equipo.

## 5. Archivos nuevos que generé
| Archivo | Para qué sirve |
|---|---|
| `ProcureSim_portatil.html` | La app completa en un solo archivo, con los logos incrustados. Para enviar por correo o WhatsApp. Las fuentes de Google se cargan con internet; sin conexión se ve con fuentes del sistema. |
| `resultados_pruebas_cowork\INFORME_PRUEBA_RUTA_COMPRA_CLAUDE.md` | Informe detallado con los hallazgos, lo corregido, lo pendiente y lo que no se probó. |
| `src\core\domain\constants.ts` | Fuente única del SMMLV. |
| `RESUMEN_TRABAJO_CLAUDE.md` | Este documento. |

## 6. Qué probé de la ruta de compra
Caso usado: Alcaldía de Neiva, Secretaría de Infraestructura, "Mantenimiento vía rural", $400 millones, sin CDP.
- **Pasos 1 a 13 completos**, sin errores de consola.
- **Paso 6:** el cálculo de cuantía con el SMMLV nuevo.
- **Paso 10:** el escenario 4 (póliza posterior al cierre) con las opciones A y B. El fundamento (Art. 5 de la Ley 1882 de 2018) es correcto.
- **Paso 12:** el tope del 50 % acepta $197.500.000 y rechaza $197.500.001.
- **Paso 13:** la liquidación, el cierre y la descarga del Word.

## 7. Qué NO probé
- La ruta "Vendo".
- Los otros 7 escenarios del inyector de contingencias.
- La audiencia sancionatoria (Art. 86 de la Ley 1474).
- La casilla de salvedades en la liquidación (no vi aparecer el campo de texto).
- La consulta en vivo a SECOP II y a datos.gov.co (mi entorno no tiene acceso).
- La app en celular.
- El bloqueo de archivos privados desde otro equipo de la red.

## 8. Pendientes que necesitan tu decisión
1. **Pedagogía del Paso 10.** Los nombres "Decisión Intuitiva Rápida" y "Protocolo de Blindaje Legal" delatan la respuesta correcta, y el texto de las opciones se corta con puntos suspensivos. Propongo títulos neutros ("Opción 1" y "Opción 2") con el orden aleatorio. La guía de prueba habría que ajustarla, porque hoy dice "elige la Opción A".
2. **Textos que afirman cosas no hechas.** Las respuestas a observaciones dicen "se costeó en el Paso 8" aunque se omita, y el Paso 11 muestra un CDP y un RP inventados con el CDP pendiente.
3. **Textos genéricos de la liquidación.** Hablan de bienes "instalados y probados" para cualquier objeto, y la matriz de riesgos dice "Territorio Nacional" cuando no hay departamento.
4. **UVT desactualizada.** La pantalla de scoring muestra $49.799, que creo que es la de 2025. Falta verificarla.
5. **Salario mínimo 2026.** Una fuente mencionaba que el Consejo de Estado habría suspendido el aumento. Otra no. Conviene confirmarlo en una fuente oficial antes de dar el valor por definitivo.
6. **Art. 40 de la Ley 80.** El tope del 50 % se mide sobre el valor inicial en SMMLV; el simulador compara en pesos. Coincide solo si el contrato y la adición son del mismo año.

## 9. Qué te recomiendo hacer ahora
1. Ejecutar `npm run build` para actualizar `dist\` y `vista_previa_procuresim.html`, que siguen con la versión vieja.
2. Reiniciar `npm run dev`.
3. Borrar `_documentos_privados\_tmp_ps_src.tgz`, un archivo temporal mío.
4. Si el proyecto no está en Git ni en OneDrive, copiar la carpeta completa como respaldo.
5. Revisar los pendientes de la sección 8 y decidir cuáles quieres que corrija.
