# 🏛️ PROMPT MAESTRO INTEGRAL: AUDITORÍA AVANZADA, MODALIDADES ESPECIALES/ATÍPICAS Y CASOS CRÍTICOS EN PROCURESIM v2.0
**Destinatario:** Cowork / Claude Tester / Equipo de Auditoría y QA  
**Proyecto:** *ProcureSim v2.0 - Simulador de Entrenamiento en Contratación Pública Colombiana*  
**Ubicación de trabajo:** `c:\Users\Carmelo\Documents\simmulador par entrenamiento en contratacion publica`  
**Fecha de emisión:** Noviembre 2026  

---

## 📌 INSTRUCCIÓN GENERAL PARA EL AUDITOR (COWORK / CLAUDE)
Actúa como un **Magistrado de la Sección Tercera del Consejo de Estado / Procurador Delegado para la Vigilancia Preventiva de la Función Pública / Auditor Senior de Contratación Estatal en Colombia**, en estrecha sincronía con tu rol de **Arquitecto de Software Senior en TypeScript, React y QA de Misión Crítica**.

Tu misión en esta ronda es exhaustiva:
1. **Auditar y refactorizar los 6 puntos críticos de lógica y pedagogía** identificados en la arquitectura base.
2. **Desatar y documentar una batería completa de 16 simulaciones**, estructuradas en 4 niveles que cubren desde los procesos cotidianos hasta las **Modalidades Especiales y Atípicas** (Convenios Interadministrativos, Decreto 092/ESAL, Urgencia Manifiesta, Cooperación Internacional) y los **Escenarios Altamente Complicados y Litigiosos** (Caducidad contractual, medidas cautelares judiciales, precios predatorios/colusión, procesos desiertos y fiducias obligatorias).

---

## 🧭 MARCO JURÍDICO Y FILOSÓFICO OBLIGATORIO
- **Estatuto General y Reformas:** Ley 80 de 1993, Ley 1150 de 2007, Ley 1474 de 2011 (Estatuto Anticorrupción), Ley 1882 de 2018 (Pliegos Tipo), Ley 2069 de 2020 (Mipymes), Ley 2160 de 2021 / Ley 2166 de 2022 (Juntas de Acción Comunal), Ley 2195 de 2022 (Transparencia y Lucha contra la Corrupción: prohibición expresa de triangulación), Decreto Único Reglamentario 1082 de 2015, Decreto 092 de 2017 (Régimen de ESAL) y CPACA (Ley 1437 de 2011).
- **Constantes Oficiales Centralizadas:** SMMLV 2026 = `$1.750.905` (definido en `src/core/domain/constants.ts`). UVT 2026 unificada en el mismo archivo. Prohibido quemar valores dispersos en componentes o motores.
- **Filosofía de Interacción Humana Progresiva:** Serenidad, orden paso a paso y soberanía del usuario. **Cero alucinaciones:** nunca inventar radicados, números de CDP ficticios o dar por hecho trámites que el usuario no ha realizado. Si un requisito está pendiente, el sistema debe declararlo francamente como «En trámite».

---

## 🛠️ FASE 1: RESOLUCIÓN Y REFACTORIZACIÓN DE LOS 6 PUNTOS CRÍTICOS

Revisa el código en `src/` e implementa las siguientes correcciones de fondo:

### 1. Pedagogía Neutral en los Dilemas Ético-Jurídicos del Paso 10
- **Diagnóstico:** Los títulos actuales en los eventos críticos ("Decisión Intuitiva Rápida ⚠️" vs "Protocolo de Blindaje Legal 🛡️") inducen la respuesta correcta antes de analizar el fondo fáctico.
- **Acción requerida:** Sustituir los títulos por formulaciones neutrales y realistas (ej. `"Postura A: Privilegiar Continuidad del Servicio con Trámite de Convalidación Posterior"` vs `"Postura B: Suspensión Preventiva de Actuaciones y Convocatoria de Comité Extraordinario de Riesgos"`). El usuario debe discernir a partir de los argumentos y del análisis normativo, no por emojis ni calificativos.

### 2. Textos Condicionales Honestos (Cero Datos Inventados)
- **Diagnóstico:** Cuando el usuario no aporta un CDP en el Paso 8 o avanza con trámites inconclusos, el simulador suele mostrar un código alfanumérico prefabricado o afirma que el trámite presupuestal ya concluyó exitosamente.
- **Acción requerida:** En `DocumentEngine.ts` y en las pantallas de flujo contractual, condicionar dinámicamente: si el CDP no fue aportado o validado, mostrar con total transparencia:  
  *«CDP: En trámite de expedición ante la Secretaría de Hacienda / Dirección Financiera»*.

### 3. Verbos Jurídicos de Liquidación según el Objeto Contractual (Paso 13)
- **Diagnóstico:** El Acta de Liquidación emplea fórmulas genéricas de obra ("obras ejecutadas y recibidas") incluso para contratos de consultoría, servicios o compras.
- **Acción requerida:** En `DocumentEngine.ts` y en la vista del Paso 13, parametrizar la constancia de recibo según la tipología del objeto:
  - **Obra Pública:** *"Constancia de obras ejecutadas a entera satisfacción, planos récord definitivos entregados y bitácora técnica de obra cerrada."*
  - **Consultoría y Estudios:** *"Constancia de recibo y aprobación técnica por la supervisión de los informes finales, memorias de cálculo y productos contractualmente pactados."*
  - **Compraventa y Suministro:** *"Constancia de ingreso físico de los bienes al almacén general e incorporación formal al inventario patrimonial de la entidad."*
  - **Prestación de Servicios Profesionales / Apoyo a la Gestión:** *"Constancia de cumplimiento a satisfacción de las obligaciones concertadas, informe final de actividades y acreditación de paz y salvo en aportes al SGSSS."*

### 4. Unificación de la UVT en `constants.ts`
- Declarar la UVT 2026 en `src/core/domain/constants.ts` y actualizar todos los motores de scoring, multas y topes de menor cuantía o regímenes especiales para que consuman exclusivamente esta fuente.

### 5. Cálculo Estricto de Adiciones Contractuales (Art. 40 Ley 80 de 1993)
- Verificar que el cálculo del tope legal del 50% en valor de adición se efectúe computando el valor original expresado en salarios mínimos legales mensuales vigentes (SMMLV) a la fecha de suscripción del contrato principal.

### 6. Trazabilidad en el Legal Watchdog
- Garantizar que las advertencias de los entes de control, quejas de veedurías ciudadanas y observaciones de proponentes queden consolidadas en el módulo del *Legal Watchdog* con fecha de ocurrencia, base legal infringida y semáforo de riesgo administrativo.

---

## ⚡ FASE 2: BATERÍA INTEGRAL DE 16 SIMULACIONES (DE LO SENCILLO A LO COMPLICADO Y ESPECIAL)

Ejecuta y registra de manera rigurosa las siguientes 16 simulaciones divididas en 4 grandes cuadrantes:

---

### 🟢 BLOQUE I: PROCESOS SENCILLOS Y DE RUTINA (FRECUENCIA DIARIA)

1. **CASO 01 — Mínima Cuantía en Municipio de 6ª Categoría:**
   - *Entidad:* Alcaldía Municipal de El Doncello (Caquetá).
   - *Objeto:* Adquisición de útiles de oficina, papelería y suministros para dependencias municipales.
   - *Presupuesto:* $14.500.000 COP.
   - *Puntos de control:* Término de invitación de 1 día hábil, RUP no exigible, evaluación exclusiva por menor precio que cumpla fichas técnicas, comunicación de aceptación que hace las veces de contrato, garantías potestativas (no obligatorias salvo justificación).

2. **CASO 02 — Contratación Directa de Servicios Profesionales (Art. 2 num 4 lit h Ley 1150 de 2007):**
   - *Entidad:* Instituto Departamental de Tránsito y Transporte.
   - *Objeto:* Prestación de servicios profesionales de asesoría jurídica en cobro coactivo y defensa judicial.
   - *Presupuesto:* $58.000.000 COP (10 meses a $5.800.000/mes).
   - *Puntos de control:* Idoneidad y experiencia técnica del profesional, certificación de insuficiencia o inexistencia de personal de planta, ausencia total de subordinación laboral continuada, pago mensual contra informe y planilla integrada de liquidación de aportes (PILA).

3. **CASO 03 — Compra por Catálogo de Acuerdo Marco de Precios (CCE - TVEC):**
   - *Entidad:* Secretaría de Educación Distrital.
   - *Objeto:* Compra de 45 equipos de cómputo portátiles mediante la Tienda Virtual del Estado Colombiano.
   - *Presupuesto:* $126.000.000 COP.
   - *Puntos de control:* Utilización obligatoria del catálogo electrónico de CCE, cotización automática en el simulador TVEC, expedición de orden de compra en plataforma oficial, verificación de CDP previo y entrega por el proveedor adjudicatario del Acuerdo Marco sin estudios previos ordinarios.

---

### 🟡 BLOQUE II: PROCESOS COMPETITIVOS INTERMEDIOS Y DE BASE COMUNITARIA

4. **CASO 04 — Selección Abreviada de Menor Cuantía con Convocatoria Limitada a Mipymes (Dec. 1860 de 2021):**
   - *Entidad:* Gobernación de Santander.
   - *Objeto:* Mantenimiento y adecuación locativa de 4 polideportivos municipales.
   - *Presupuesto:* $142.000.000 COP.
   - *Puntos de control:* Recepción oportuna de al menos 3 manifestaciones de interés de Mipymes territoriales (departamentales) con certificación de revisor fiscal o contador público acreditando tamaño empresarial, RUP obligatorio, cierre de la convocatoria exclusivamente para el segmento Mipyme.

5. **CASO 05 — Subasta Inversa Electrónica de Bienes y Servicios de Características Técnicas Uniformes:**
   - *Entidad:* Dirección de Gestión del Medio Ambiente y Aseo Municipal.
   - *Objeto:* Suministro de combustible (Gasolina corriente y Diésel B10) para el parque automotor oficial.
   - *Presupuesto:* $480.000.000 COP.
   - *Puntos de control:* Verificación previa de requisitos habilitantes técnicos y jurídicos bajo esquema Pasa / No Pasa, fijación de margen mínimo de mejora de lance (ej. 1%), simulación de lances decrecientes en tiempo real, adjudicación automatizada a la postura más económica.

6. **CASO 06 — Convenio Solidario con Junta de Acción Comunal (Ley 2160/2021 / Ley 2166/2022 / Dec. 142/2023):**
   - *Entidad:* Alcaldía de Viotá (Cundinamarca).
   - *Objeto:* Construcción de 250 metros lineales de placa huella en la vereda La Esperanza mediante Asociación Público-Comunitaria.
   - *Presupuesto:* $88.000.000 COP.
   - *Puntos de control:* Acreditación de personería jurídica de la JAC expedida por la autoridad competente, RUT activo, apertura de cuenta bancaria exclusiva de la JAC, ausencia de ánimo de lucro mercantil, designación obligatoria de supervisor técnico por parte de la Secretaría de Obras y esquema de desembolsos por hitos verificados de avance.

---

### 🟣 BLOQUE III: MODALIDADES ESPECIALES Y ATÍPICAS (LAS 4 FAMILIAS DE PROCURESIM)

7. **CASO 07 — Contrato Interadministrativo y la Prohibición de Triangulación (Ley 2195 de 2022):**
   - *Entidad Contratante:* Secretaría Distrital de Movilidad.
   - *Entidad Ejecutora:* Empresa Pública Departamental / Universidad Pública.
   - *Objeto:* Operación logística y tecnológica del sistema de comparendos de tránsito ($3.200.000.000 COP).
   - *Nudo Crítico:* La entidad pública ejecutora pretende subcontratar el 65% de las actividades tecnológicas con empresas privadas de software cobrando una comisión de administración del 8%.
   - *Puntos de control:* Aplicación estricta de la **Ley 2195 de 2022 (Estatuto Anticorrupción)**: prohibición de subcontratar más del 50% de la ejecución material; acreditación obligatoria de capacidad operativa propia en el objeto social de la entidad pública contratada; blindaje del Ordenador del Gasto frente al delito de *Contrato sin Cumplimiento de Requisitos Legales (Art. 410 Código Penal)*.

8. **CASO 08 — Convenio de Asociación con ESAL y el Dilema del Aporte del 30% (Decreto 092 de 2017):**
   - *Entidad:* Secretaría de Desarrollo Social Departamental.
   - *Sujeto Receptor:* Fundación de Asistencia Social al Adulto Mayor.
   - *Objeto:* Ejecución de programa de atención integral nutricional y psicológica a población vulnerable ($350.000.000 COP).
   - *Nudo Crítico:* La Fundación solicita contratación directa afirmando aportar el 30%, pero al revisar el presupuesto, el aporte consiste en "horas de voluntariado no certificadas" y "uso estimado de un salón parroquial" con valores inflados.
   - *Puntos de control:* Aplicación del **Artículo 5 del Decreto 092 de 2017**: verificación pericial-contable estricta del aporte del 30% en dinero o bienes efectivamente cuantificables. Si el aporte no cumple los estándares, obligatoriedad de adelantar **Convocatoria Competitiva entre ESAL (Art. 4 Decreto 092)** con pluralidad de oferentes del sector social.

9. **CASO 09 — Urgencia Manifiesta y Calamidad Pública con Control Fiscal Obligatorio (Arts. 42 y 43 Ley 80 de 1993):**
   - *Entidad:* Unidad Nacional para la Gestión del Riesgo de Desastres / Municipio ribereño.
   - *Hecho Sobreviviente:* Colapso estructural de jarillón de contención e inundación inminente del casco urbano por creciente extraordinaria de río.
   - *Presupuesto Estimado:* $1.200.000.000 COP en obras inmediatas de dragado y colocación de hexápodos.
   - *Puntos de control:* Acto administrativo debidamente motivado de declaratoria de Urgencia Manifiesta; contratación directa inmediata prescindiendo de formalidades previas y sin exigencia de CDP anticipado (legalización presupuestal posterior); nexo causal estricto entre los contratos suscritos y la superación exclusiva de la crisis; **remisión obligatoria e inmediata de todo el expediente a la Contraloría General dentro de los 3 días hábiles siguientes** para control automático de legalidad.

10. **CASO 10 — Contratación con Organismos de Cooperación Internacional (Art. 20 Ley 1150 de 2007):**
    - *Entidad:* Ministerio de Ambiente y Desarrollo Sostenible.
    - *Organismo Internacional:* Programa de las Naciones Unidas para el Desarrollo (PNUD) / Banco Interamericano de Desarrollo (BID).
    - *Objeto:* Restauración ecológica de cuencas hidrográficas financiadas en un 60% por crédito multilateral y 40% por contrapartida de la Nación ($5.400.000.000 COP).
    - *Puntos de control:* Análisis del régimen aplicable: prevalencia de las políticas de adquisiciones del organismo multilateral según tratados y convenios internacionales (Art. 20 Ley 1150); prohibición de utilizar agencias internacionales como intermediarias para eludir la Ley 80 en recursos propios sin componente de cooperación técnica real.

11. **CASO 11 — Contratación bajo Régimen Especial Excluido / Manual Propio (E.S.E. Hospitalaria y E.S.P. Ley 142):**
    - *Entidad:* Empresa Social del Estado (E.S.E.) Hospital Universitario de Alta Complejidad.
    - *Objeto:* Suministro continuo de medicamentos especiales, material de osteosíntesis y prótesis ($1.850.000.000 COP).
    - *Puntos de control:* Inaplicabilidad del Estatuto General de Contratación (Ley 80/93) por expresa remisión legal al derecho privado; aplicación rigurosa del Manual Interno de Contratación de la E.S.E.; observancia ineludible de los principios de la función pública (Art. 209 C.P.: igualdad, moralidad, eficacia, economía, celeridad, imparcialidad y publicidad); régimen estricto de inhabilidades e incompatibilidades del sector público.

---

### 🔴 BLOQUE IV: CASOS COMPLICADOS, CRÍTICOS, LITIGIOSOS Y DE MÁXIMO RIESGO

12. **CASO 12 — Licitación Pública con Pliegos Tipo y Fiducia Mercantil Irrevocable (Art. 91 Ley 1474 / Ley 1882):**
    - *Entidad:* Instituto Nacional de Vías (INVÍAS).
    - *Objeto:* Construcción y pavimentación de variante vial en calzada sencilla con obras de drenaje y contención.
    - *Presupuesto Oficial:* $11.800.000.000 COP.
    - *Puntos de control:* Aplicación inalterable de los Documentos Tipo vigentes expedidos por Colombia Compra Eficiente (prohibición de modificar factores de ponderación o requisitos habilitantes); Matriz de Riesgos CCE; fórmula económica mediante media geométrica con presupuesto oficial; pacto de anticipo del 20% con **constitución obligatoria de Patrimonio Autónomo mediante Fiducia Mercantil Irrevocable (Art. 91 Ley 1474 de 2011)**; pagos subordinados a giros aprobados expresamente por la interventoría técnica.

13. **CASO 13 — Oferta con Precio Artificialmente Bajo y Sospecha de Colusión / Prácticas Restrictivas:**
    - *Entidad:* Secretaría de Infraestructura Municipal.
    - *Objeto:* Consultoría especializada para la actualización catastral multipropósito ($950.000.000 COP).
    - *Hecho Crítico:* El consorcio mejor puntuado presenta una propuesta económica por $580.000.000 COP (39% por debajo del presupuesto oficial). Paralelamente, otros dos proponentes presentan pólizas de seriedad emitidas por la misma agencia con numeración consecutiva y exactamente la misma plantilla de propuesta económica.
    - *Puntos de control:* Activación reglada del procedimiento de **Precio Artificialmente Bajo (Decreto 1082 de 2015 y Guía CCE)**: solicitud formal y perentoria de aclaración de costos desglosados (APU, salarios profesionales bajo tablas de gremios, costos de viaje y licencias); informe técnico de sostenibilidad que determine si la oferta pone en riesgo la ejecución; activación de protocolos por posible colusión y traslado preventivo a la Superintendencia de Industria y Comercio (SIC) y a la Fiscalía General.

14. **CASO 14 — Declaratoria de Proceso Desierto en Licitación Pública y Paso a Selección Abreviada (Art. 2 num 2 lit a Ley 1150):**
    - *Entidad:* Departamento Administrativo de Planeación.
    - *Objeto:* Construcción de Centro de Salud Comunitario ($2.400.000.000 COP).
    - *Hecho Crítico:* En la audiencia de adjudicación de la licitación, los 3 únicos proponentes resultan rechazados: uno por no subsanar capacidad residual K, otro por inconsistencia insubsanable en estados financieros y el tercero por sobrepasar el presupuesto oficial.
    - *Puntos de control:* Expedición del Acto Administrativo motivado de Declaratoria de Desierta; apertura posterior mediante **Selección Abreviada por Causal de Proceso Desierto** dentro de los 4 meses siguientes; prohibición taxativa de modificar el objeto, las condiciones esenciales del pliego o los estudios de mercado originales; garantía de publicidad a todos los interesados iniciales.

15. **CASO 15 — Medida Cautelar Judicial Inminente en Audiencia de Adjudicación (CPACA / Acción Popular):**
    - *Entidad:* Gobernación Departamental.
    - *Objeto:* Concesión para la gestión y recaudo tributario del departamento ($6.500.000.000 COP).
    - *Hecho Crítico:* Faltando 2 horas para instalar la audiencia pública de adjudicación, la entidad es formalmente notificada de un Auto Admisorio de Acción Popular con **Medida Cautelar de Urgencia** decretada por el Tribunal Administrativo ordenando suspender provisionalmente cualquier adjudicación hasta resolver de fondo la presunta vulneración del patrimonio público.
    - *Puntos de control:* Suspensión formal del cronograma y de la audiencia pública en SECOP II; respuesta judicial motivada allegando el expediente administrativo; evaluación de desacato vs principio de legalidad; información a la aseguradora respecto a la extensión de la vigencia de la garantía de seriedad de la oferta.

16. **CASO 16 — Procedimiento Sancionatorio del Art. 86 Ley 1474 y Declaratoria de Caducidad Contractual (Art. 18 Ley 80 de 1993):**
    - *Entidad:* Empresa de Acueducto y Alcantarillado.
    - *Objeto:* Construcción del colector matriz de aguas residuales ($7.200.000.000 COP).
    - *Hecho Crítico:* El contratista paralizó las obras hace 45 días, retiró la maquinaria pesada, adeuda salarios a trabajadores y tiene un atraso insalvable del 55% frente a la ruta crítica, comprometiendo la salubridad pública de la ciudad.
    - *Puntos de control:*
      - *Fase A (Audiencia Art. 86 Ley 1474):* Citación con pliego de cargos sustentado en bitácora e informe del interventor; vinculación formal obligatoria de la Compañía de Seguros garante; garantías del debido proceso y derecho a la contradicción.
      - *Fase B (Declaratoria de Caducidad):* Tipificación de los presupuestos del Art. 18 de la Ley 80 de 1993 (grave incumplimiento que afecte de manera directa la prestación del servicio); expedición de la Resolución motivada de Caducidad; liquidación en el estado en que se encuentre la obra; efectividad inmediata de la póliza de cumplimiento y de la cláusula penal pecuniaria; registro de la inhabilidad sobreviniente por 5 años en el RUP y reporte a la Cámara de Comercio y Procuraduría.

---

## 📋 ENTREGABLES EXIGIDOS A COWORK / CLAUDE

Al concluir la auditoría y la ejecución de la batería de 16 procesos, debes generar en la carpeta `resultados_pruebas_cowork/`:

1. **`INFORME_BATERIA_SIMULACIONES_COWORK.md`:**
   - **Matriz Maestra de los 16 Casos:** Cuadro comparativo con [Caso | Modalidad | Presupuesto | Regla de Oro Jurídica | Comportamiento del Motor | Estado UI].
   - **Informe de Refactorización de los 6 Puntos Críticos:** Evidencias de los cambios en código en `src/` (neutralidad de opciones, textos honestos de CDP, verbos de liquidación, unificación UVT/SMMLV, adición Art. 40 y trazabilidad en el Watchdog).
   - **Reporte de Casos Especiales y Litigiosos:** Evaluación de cómo respondió el sistema a la triangulación de la Ley 2195, al aporte de ESAL del Decreto 092, a la urgencia manifiesta y a la audiencia de caducidad.
2. **Control de Compilación y Calidad:**
   - Ejecutar obligatoriamente `npm run build` en el workspace para certificar **cero errores de compilación TypeScript**.
3. **Plan de Mejoras Futuras:**
   - Recomendaciones para la incorporación de módulos complementarios (calculadora de capacidad residual K con fórmulas de CCE, simulador de audiencias de descargos en vivo).

---
*¡Inicia la auditoría integral y la corrida de simulaciones sobre el entorno de trabajo!*
