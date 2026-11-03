# Guía Maestra del Proyecto y Protocolo de Prueba con Cowork
## ProcureSim v2.0 — Simulador y Entrenador de Contratación Pública con Inteligencia Aumentada

---

### 1. ¿Qué es ProcureSim y qué queremos lograr?

#### El Problema Real en Colombia:
La contratación estatal en Colombia moviliza más de **$150 billones de pesos al año**, pero se ejecuta en medio de un clima de **alto estrés y temor reverencial**:
* Los servidores públicos (alcaldes, secretarios de planeación, directores jurídicos, supervisores) viven bajo permanente zozobra de cometer un error formal que termine en investigación penal (Fiscalía por celebración indebida de contratos Art. 410 C.P.), fiscal (juicios de cuentas de Contraloría) o disciplinaria (suspensión o inhabilidad en Procuraduría).
* Los proponentes y Mipymes muchas veces sienten que el SECOP II es un laberinto hostil y que los pliegos están "amarrados" o llenos de trampas que no comprenden.
* Los software tradicionales de compras públicas son fríos, punitivos, rígidos y asumen que el usuario es un experto en leyes o un ingeniero de sistemas.

#### Nuestro Objetivo Transformador:
**ProcureSim v2.0** no es un simple gestor documental; es un **entrenador y copiloto empático de contratación estatal** diseñado bajo la filosofía de **Interacción Humana Progresiva**:
1. **Desmitificar la contratación:** Llevar al usuario de la mano ("pregunta a pregunta y se va llenando"), en lenguaje humano, natural y sin tecnicismos innecesarios.
2. **Soberanía del usuario:** El sistema orienta, analiza riesgos y sugiere caminos legales viables, pero **nunca impone decisiones autoritarias**. El servidor público mantiene el control de su criterio.
3. **Blindaje preventivo real:** Cada cifra, tope presupuestal (SMMLV 2026: $1.423.500), retención de estampillas territoriales, límite de adiciones (50%) y causal de rechazo está anclada a la Ley 80 de 1993, Ley 1150 de 2007, Ley 1882 de 2018, Ley 2069 de 2020, Decreto 1082 de 2015 y jurisprudencia unificada del Consejo de Estado.
4. **Cero alucinaciones:** Si falta un dato o un CDP no ha sido expedido, la herramienta no inventa ni bloquea; deja recordatorios discretos en la esquina y permite continuar estructurando.

---

### 2. Alcance Completo del Sistema (13 Pasos de Punta a Punta)

El simulador abarca todo el ciclo de vida del contrato estatal colombiano:

```
[ ETAPA PRECONTRACTUAL ]
Paso 1: Rol de Partida (Compro como Entidad Pública o Vendo como Proveedor/Mipyme)
Paso 2: Autoría Institucional y Cuadro de Firmas Oficiales
Paso 3: Identificación Inequívoca de la Entidad (Directorio Nacional con NIT oficial y Centros de Costos)
Paso 4: Verificación Soberana del Régimen (Estatuto General Ley 80 vs. Manual Propio ESE/ESP vs. Multilateral)
Paso 5: Redacción de la Necesidad y Objeto en Lenguaje Natural
Paso 6: Presupuesto Oficial, CDP y Cálculo Dinámico de Cuantías (6ª categoría hasta nivel nacional)
Paso 7: La Mirada Preventiva (Ruta Jurídica Óptima y los 3 Cuidados: Fiscal, Proponentes y Territorio)
Paso 8: Estudio de Mercado Empático (Mipymes BIC, consulta en vivo a SECOP II y retenciones territoriales)
Paso 9: Consolidación y Descarga de Estudios Previos Oficiales en Word (.docx)

[ ETAPA TRANSACCIONAL SECOP II ]
Paso 10: Flujo Transaccional en SECOP II hasta la Adjudicación:
         - Observaciones ciudadanas y expedición de Adendas.
         - Cierre del cronograma y desencriptación de sobres.
         - Evaluación habilitante y económica.
         - LABORATORIO DE CONTINGENCIAS Y RAREZAS REALES (9 escenarios de crisis en vivo: caída de SECOP II
           y protocolo CCE, precio artificialmente bajo -55%, póliza extemporánea Ley 1882, colusión digital
           por IP idéntica, empate de 100 pts y cascada Ley 2069, tutela suspensiva, inhabilidad SIBOR, etc.).
         - Celebración de Audiencia y Resolución Motivada de Adjudicación.

[ ETAPA CONTRACTUAL Y POSTCONTRACTUAL ]
Paso 11: Perfeccionamiento y Legalización (Firma electrónica SECOP II, Registro Presupuestal RP,
         aprobación formal de la Garantía Única y designación de Supervisión/Interventoría Ley 1474).
Paso 12: Gestión de la Ejecución y Sancionatorio:
         - Bitácora de avance físico/financiero (25%, 50%, 75%, 100%) y planillas PILA/ARL.
         - Validador matemático de adiciones (Tope legal infranqueable del 50% Art. 40 Ley 80).
         - Audiencia sancionatoria de multas con aseguradora vinculada (Art. 86 Ley 1474).
Paso 13: Recibo Final a Satisfacción, Liquidación (Bilateral vs. Unilateral con salvedades) y Cierre SECOP II.
```

---

### 3. Órdenes e Instrucciones para Realizar la Prueba de Cowork

Pídele al compañero de cowork que actúe con libertad, curiosidad y sentido crítico, siguiendo estas 6 órdenes de prueba:

#### Misión 0: Ingreso al Entorno
* Si está en el mismo Wi-Fi del cowork, dile que abra en su navegador:  
  👉 **`http://192.168.0.13:5173/`**  
  *(o si prefiere abrirlo directamente en tu equipo: `http://localhost:5173/` o el archivo autónomo `vista_previa_procuresim.html`).*

#### Misión 1: Imaginar un Caso de Contratación
* Pídele que elija un caso mental sencillo: por ejemplo, *"Comprar equipos de cómputo para una Alcaldía"*, *"Contratar el mantenimiento de una vía rural"*, o *"Comprar medicamentos para un hospital"*.
* Debe avanzar del Paso 1 al Paso 4 definiendo quién es y para qué entidad contrata.

#### Misión 2: Evaluar la Fricción en el Presupuesto y la Ruta (Pasos 6 y 7)
* En el Paso 6, que ingrese un valor presupuestal (ej. $80 millones o $400 millones).
* Que observe si el cálculo de la cuantía y la recomendación de modalidad en el Paso 7 le resultan comprensibles o intimidantes.

#### Misión 3: El Gran Desafío — Provocar un Error en SECOP II (Paso 10)
* En el **Paso 10**, pídele que despliegue el **"Inyector de Contingencias y Rarezas de SECOP II"**.
* Que seleccione un incidente crítico (ej. *Precio Artificialmente Bajo* o *Póliza Extemporánea Ley 1882*).
* **Orden clave:** Pídele que **elija a propósito la "Opción A: Decisión Intuitiva Rápida (La Trampa)"**.
* Debe evaluar: ¿El mensaje de error fatal fue claro? ¿Entendió por qué esa decisión le acarrearía una sanción disciplinaria o nulidad? Luego, que corrija con la Opción B (Protocolo de Blindaje).

#### Misión 4: Poner a Prueba el Tope Legal del 50% (Paso 12)
* En el Paso 12, que abra el **Simulador de Modificaciones y Adiciones**.
* Que intente ingresar una adición ilegal de más de $200 millones para un contrato de $395 millones.
* Debe evaluar si la alerta roja de advertencia penal (Art. 410 C.P.) es clara y persuasiva.

#### Misión 5: Liquidar y Descargar (Paso 13)
* Que seleccione la modalidad de liquidación (bilateral o unilateral), marque la casilla de salvedades y presione el botón de cierre oficial en SECOP II.
* Finalmente, que pulse el botón de descargar el expediente en Word (.docx) para verificar el producto final.

---

### 4. Dónde Dejar los Resultados
Indícale al tester que cualquier anotación, captura de pantalla o comentario lo guarde en esta misma carpeta:  
📁 `C:\Users\Carmelo\Documents\simmulador par entrenamiento en contratacion publica\resultados_pruebas_cowork\`  
pudiendo editar directamente el archivo:  
📄 `plantilla_retroalimentacion_cowork.md`.
