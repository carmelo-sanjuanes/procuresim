# 🏛️ PROMPT MAESTRO PARA AUDITORÍA AVANZADA Y BATERÍA MASIVA DE SIMULACIONES EN PROCURESIM v2.0
**Destinatario:** Cowork / Claude Tester / Equipo de Auditoría y QA  
**Proyecto:** *ProcureSim v2.0 - Simulador de Entrenamiento en Contratación Pública Colombiana*  
**Ubicación de trabajo:** `c:\Users\Carmelo\Documents\simmulador par entrenamiento en contratacion publica`  
**Fecha de emisión:** Noviembre 2026  

---

## 📌 INSTRUCCIÓN GENERAL PARA EL AUDITOR (COWORK / CLAUDE)
Actúa como un **Magistrado del Consejo de Estado / Auditor Senior de Contratación Pública en Colombia** y a la vez como un **Ingeniero de Software Senior especializado en React, TypeScript y QA de Sistemas Críticos**.

Tu misión en esta ronda es doble:
1. **Auditar y refactorizar 6 puntos críticos de lógica y pedagogía** identificados en la primera fase de pruebas.
2. **Desatar y documentar una batería masiva de al menos 12 a 15 simulaciones de procesos de contratación pública**, cubriendo todo el espectro de complejidad (desde lo cotidiano y rural hasta megaobras con pliegos tipo, fiducias, colusiones y audiencias sancionatorias del Art. 86).

---

## 🧭 MARCO JURÍDICO Y FILOSÓFICO OBLIGATORIO
- **Estatuto General de Contratación:** Ley 80 de 1993, Ley 1150 de 2007, Ley 1474 de 2011 (Estatuto Anticorrupción), Ley 1882 de 2018 (Pliegos Tipo), Ley 2069 de 2020 (Mipymes), Ley 2160 de 2021 (Convenios JAC) y Decreto Único Reglamentario 1082 de 2015.
- **Constantes Oficiales Centralizadas:** SMMLV 2026 = `$1.750.905` (definido en `src/core/domain/constants.ts`). Prohibido quemar valores de salario mínimo o UVT dispersos en el código.
- **Filosofía de Interacción Humana Progresiva:** La interfaz debe transmitir serenidad, confianza y soberanía del usuario. **Cero alucinaciones:** el sistema nunca debe inventar radicados, CDP o hechos no acontecidos; si un dato está en trámite, debe declararlo transparentemente.

---

## 🛠️ FASE 1: RESOLUCIÓN Y REFACTORIZACIÓN DE LOS 6 PUNTOS CRÍTICOS

Revisa el código en `src/` e implementa las siguientes correcciones:

### 1. Pedagogía Neutral en los Dilemas del Paso 10
- **Problema actual:** Los títulos de las opciones en los eventos críticos ("Decisión Intuitiva Rápida ⚠️" vs "Protocolo de Blindaje Legal 🛡️") inducen la respuesta correcta antes de leer el caso.
- **Solución requerida:** Renombrar las opciones de forma neutral y profesional (ej. `"Postura A: Privilegiar Continuidad del Servicio con Trámite Posterior"` vs `"Postura B: Suspensión Preventiva y Convocatoria de Comité Extraordinario"`). El funcionario debe evaluar el fondo fáctico y normativo, no guiarse por emojis o adjetivos condenatorios.

### 2. Textos Condicionales Honestos (Cero Datos Inventados)
- **Problema actual:** Si el usuario no carga un CDP en el Paso 8 o salta una fase previa, el simulador genera un código alfanumérico ficticio de CDP o asume que el trámite presupuestal ya concluyó.
- **Solución requerida:** En `DocumentEngine.ts` y en las vistas de flujo, condicionar la visualización del CDP: si no existe valor real cargado, mostrar:  
  *«CDP: En trámite de expedición ante la Secretaría de Hacienda / Dirección Financiera»*.

### 3. Verbos Jurídicos de Liquidación según el Objeto Contractual (Paso 13)
- **Problema actual:** Se usa redacción genérica de obras ("obras recibidas") incluso para consultorías o suministros.
- **Solución requerida:** En la generación del Acta de Liquidación (`DocumentEngine.ts` y Paso 13), dinamizar las cláusulas de recibo según la tipología del objeto:
  - **Obra Pública:** *"Constancia de obras ejecutadas a satisfacción, planos récord entregados y bitácora técnica de obra cerrada."*
  - **Consultoría / Estudios:** *"Constancia de entrega y aprobación por la supervisión de los informes técnicos finales, memorias de cálculo y productos pactados."*
  - **Compraventa / Suministro:** *"Constancia de ingreso de bienes al almacén general e incorporación formal al inventario de la entidad."*
  - **Prestación de Servicios Profesionales:** *"Constancia de cumplimiento a satisfacción de las obligaciones contractuales, informe final de actividades y paz y salvo de aportes al SGSSS."*

### 4. Unificación de la UVT en `constants.ts`
- Centralizar la UVT en `src/core/domain/constants.ts` (ej. `UVT_2026`) y migrar cualquier cálculo de multas o topes en los motores de scoring para que dependa exclusivamente de esa constante.

### 5. Cálculo Estricto de Adiciones Contractuales (Art. 40 Ley 80 de 1993)
- Validar que el tope máximo del 50% de adición en valor no supere el equivalente al 50% del valor del contrato expresado en SMMLV de la fecha de suscripción original.

### 6. Robustecimiento de la Bitácora de Observaciones y Auditoría
- Asegurar que cualquier observación de veeduría ciudadana o advertencia de la Contraloría quede registrada en la pestaña del *Legal Watchdog* con trazabilidad de fecha, norma infringida y nivel de riesgo.

---

## ⚡ FASE 2: BATERÍA MASIVA DE SIMULACIONES (12 A 15 CASOS DE PRUEBA)

Debes ejecutar y registrar el comportamiento del simulador frente a la siguiente matriz de complejidad gradual:

### 🟢 BLOQUE A: PROCESOS SENCILLOS Y COTIDIANOS (ALTA FRECUENCIA)
1. **CASO 01 - Mínima Cuantía en Municipio de 6ª Categoría:**  
   - *Objeto:* Adquisición de papelería y suministros de oficina para la Alcaldía de El Doncello (Caquetá).  
   - *Presupuesto:* $14.500.000 COP.  
   - *Reto a evaluar:* Publicación de invitación por 1 día hábil, no exigencia de RUP, comunicación de aceptación que hace las veces de contrato, garantías no obligatorias salvo justificación expresa.
2. **CASO 02 - Contratación Directa de Servicios Profesionales (Art. 2 num 4 lit h Ley 1150):**  
   - *Objeto:* Asesoría jurídica especializada en derecho urbanístico y defensa judicial.  
   - *Presupuesto:* $58.000.000 COP (10 meses a $5.800.000/mes).  
   - *Reto a evaluar:* Verificación de idoneidad, acreditación de títulos y experiencia, certificado de no existencia de personal de planta suficiente, no subordinación laboral y pago de aportes a salud/pensión/ARL.
3. **CASO 03 - Compra por Catálogo de Acuerdo Marco de Precios (CCE - TVEC):**  
   - *Objeto:* Adquisición de 40 computadores portátiles para colegios oficiales mediante la Tienda Virtual del Estado Colombiano.  
   - *Presupuesto:* $115.000.000 COP.  
   - *Reto a evaluar:* Selección de proveedor con orden de compra en TVEC, sin necesidad de estudios previos complejos tradicionales, verificación de catálogo vigente y CDP previo.

---

### 🟡 BLOQUE B: PROCESOS MEDIOS, TÁCTICOS Y DE RÉGIMEN ESPECIAL
4. **CASO 04 - Selección Abreviada de Menor Cuantía con Convocatoria a Mipymes (Dec. 1860 de 2021):**  
   - *Objeto:* Mantenimiento preventivo y correctivo de sedes comunales y polideportivos.  
   - *Presupuesto:* $135.000.000 COP.  
   - *Reto a evaluar:* Recepción de 3 solicitudes válidas de limitación territorial de Mipymes departamentales con certificación de contador, RUP obligatorio, exclusión de grandes empresas en la puja.
5. **CASO 05 - Subasta Inversa Electrónica de Bienes Uniformes:**  
   - *Objeto:* Suministro de combustible (Gasolina corriente y ACPM) para el parque automotor de la Secretaría de Movilidad.  
   - *Presupuesto:* $420.000.000 COP.  
   - *Reto a evaluar:* Habilitación técnica previa (pasa/no pasa), margen mínimo de mejora de lances (1%), lances dinámicos y adjudicación en tiempo real al precio más bajo.
6. **CASO 06 - Convenio Solidario con Junta de Acción Comunal (Ley 2160 de 2021 / Dec. 142 de 2023):**  
   - *Objeto:* Construcción de 200 metros de placa huella en vereda La Esmeralda.  
   - *Presupuesto:* $85.000.000 COP.  
   - *Reto a evaluar:* Acreditación de personería jurídica de la JAC, RUT, cuenta bancaria comunitaria, ausencia de ánimo de lucro, designación de supervisor técnico idóneo de la Alcaldía.
7. **CASO 07 - Contratación bajo Régimen Especial / Manual Propio de E.S.E. Hospitalaria:**  
   - *Objeto:* Suministro de medicamentos oncológicos y material médico-quirúrgico para el Hospital Departamental.  
   - *Presupuesto:* $780.000.000 COP.  
   - *Reto a evaluar:* Inaplicabilidad de Ley 80 en el procedimiento de selección, aplicación del Manual Interno de Contratación de la E.S.E. y principios constitucionales del Art. 209 C.P.

---

### 🔴 BLOQUE C: PROCESOS COMPLEJOS, LITIGIOSOS Y DE MÁXIMO RIESGO
8. **CASO 08 - Licitación Pública de Infraestructura Vial con Pliegos Tipo Obligatorios (CCE):**  
   - *Objeto:* Pavimentación en concreto asfáltico del corredor vial intermunicipal ($9.200.000.000 COP).  
   - *Reto a evaluar:* Obligatoriedad de Pliegos Tipo CCE Versión vigente, matriz 1 de riesgos, asignación de puntajes por factor técnico y económico (fórmula de media geométrica con presupuesto oficial), y anticipo del 20% condicionado a Fiducia Mercantil Irrevocable (Art. 91 Ley 1474).
9. **CASO 09 - Consorcio Vial con Causal Sobreviviente de Inhabilidad:**  
   - *Objeto:* Construcción de puente vehicular por Consorcio "Puente Seguro" (Socio A: 60%, Socio B: 40%).  
   - *Evento crítico:* A mitad de obra, el Socio B aparece con fallo con responsabilidad fiscal ejecutoriado en el Boletín de la Contraloría.  
   - *Reto a evaluar:* Aplicación del Art. 9 de la Ley 80 de 1993. Obligación de ceder la participación a un tercero idóneo con visto bueno de la entidad; consecuencias jurídicas si no cede dentro de los 10 días hábiles.
10. **CASO 10 - Oferta con Precio Artificialmente Bajo y Sospecha de Colusión:**  
    - *Objeto:* Consultoría para formulación del Plan de Ordenamiento Territorial (POT).  
    - *Evento crítico:* El proponente A cotiza un 38% por debajo del presupuesto oficial estimado.  
    - *Reto a evaluar:* Procedimiento reglado del Decreto 1082 de 2015: solicitud formal de aclaración de la estructura de costos (APU, salarios de expertos, costos indirectos), análisis técnico de sostenibilidad y decisión fundamentada de aceptación o rechazo.
11. **CASO 11 - Procedimiento Sancionatorio del Art. 86 Ley 1474 de 2011 (Audiencia de Incumplimiento):**  
    - *Objeto:* Construcción de Colegio Megacolegio con retraso injustificado del 42% en la ruta crítica.  
    - *Reto a evaluar:* Citación motivada con informe del interventor, vinculación formal de la Compañía de Seguros, objeción de la aseguradora, descargos del contratista, imposición de multa conminatoria y declaratoria de siniestro de incumplimiento.
12. **CASO 12 - Liquidación Unilateral Litigiosa con Recurso de Reposición:**  
    - *Objeto:* Contrato de obra abandonado por el contratista en el 72% de ejecución. Plazo contractual vencido.  
    - *Reto a evaluar:* Agotamiento del término de 4 meses para liquidación bilateral sin acuerdo. Expedición del Acto Administrativo de Liquidación Unilateral dentro de los 2 meses siguientes (Art. 11 Ley 1150 de 2007). Cobro de cláusula penal pecuniaria, balance de cuentas a favor de la entidad y resolución de recurso de reposición.

---

## 📋 ENTREGABLES EXIGIDOS A COWORK / CLAUDE

Al finalizar la auditoría y ejecución de pruebas, debes generar en la carpeta `resultados_pruebas_cowork/`:

1. **`INFORME_BATERIA_SIMULACIONES_COWORK.md`:**  
   - Matriz comparativa de los 12 casos probados (Modalidad, Cuantía, Entidad, Hallazgos de UI, Comportamiento del Motor Jurídico).
   - Verificación de los 6 puntos críticos refactorizados.
   - Detección de posibles inconsistencias residuales en plazos, fórmulas o reportes de SECOP II.
2. **Registro de Cambios en Código (`src/`):**  
   - Indicar claramente qué archivos modificaste (rutas relativas a `src/`), qué funciones o componentes se tocaron y el porqué.
   - Ejecutar obligatoriamente `npm run build` para verificar **cero errores de compilación de TypeScript**.
3. **Recomendaciones de Producto:**  
   - Sugerencias sobre qué nuevos módulos o herramientas de apoyo (ej. simulador de multas, calculador de capacidad residual K) potenciarían aún más la plataforma.

---
*¡Inicia de inmediato la auditoría y ejecución sobre el entorno de trabajo!*
