# 🏛️ ORDEN RONDA 5: ECOSISTEMA MULTIPLATAFORMA SEGÚN LA ENTIDAD (SECOP II, SUPLOS, TVEC, SAP ARIBA, SECOP I Y MANUAL PROPIO)
**Destinatario:** Cowork / Claude Tester  
**Proyecto:** *ProcureSim v2.0 - Simulador de Entrenamiento en Contratación Pública Colombiana*  
**Ubicación de trabajo:** `c:\Users\Carmelo\Documents\simmulador par entrenamiento en contratacion publica`  
**Fecha de emisión:** Noviembre 2026  

---

## 📌 VISIÓN Y DIAGNÓSTICO
En Colombia la contratación no ocurre exclusivamente en SECOP II. Dependiendo de la naturaleza jurídica de la entidad, de su régimen legal y del objeto contractual, las compras se gestionan a través de distintas plataformas transaccionales:

| Tipo de Entidad / Régimen | Plataforma Transaccional Oficial | Ejemplos Reales en Colombia |
|---|---|---|
| **Régimen General (Ley 80 / 1150 / 1882)** | **SECOP II** | Ministerios, Gobernaciones, Alcaldías, INVIAS, ICBF, SENA |
| **Compras por Catálogo / Acuerdos Marco** | **Tienda Virtual (TVEC)** | Cualquier entidad comprando computadores, combustible, vehículos |
| **Empresas de Servicios Públicos (Ley 142) y Energía/Petróleo** | **Suplos B2B** | Ecopetrol, Cenit, ISA, Grupo Energía Bogotá (GEB), EPM, Triple A |
| **Empresas Mixtas, Concesionarios y Corporativo Privado** | **SAP Ariba / Coupa** | Grandes contratistas, concesiones viales 4G/5G, filiales mixtas |
| **Empresas Sociales del Estado (Salud) y Universidades** | **Portal Institucional / Convocatoria Manual Propio** | Hospitales departamentales (E.S.E.), Universidad Nacional, U. de Antioquia |
| **Municipios sin conectividad / Publicidad histórica** | **SECOP I** | Municipios 5ª y 6ª categoría en régimen de transición |

**El problema actual:** En el Flujograma (`ContractFlowchartView.tsx`), los pasos 10, 11 y 13 asumen siempre "SECOP II", ignorando que si el usuario eligió Ecopetrol, EPM, un Hospital o una compra por Acuerdo Marco, la plataforma y el flujo documental deben adaptarse.

---

## 🛠️ TAREA 1: MOTOR DE INFERENCIA DE PLATAFORMA SEGÚN LA ENTIDAD (`PlatformRouterEngine.ts`)

Crea un motor sencillo o amplía `NationalEntityClassifierEngine.ts` que determine la plataforma sugerida según los datos de la entidad y el objeto:

```typescript
export type PlataformaTransaccional = 
  | 'SECOP_II' 
  | 'TIENDA_VIRTUAL_TVEC' 
  | 'SUPLOS' 
  | 'SAP_ARIBA' 
  | 'SECOP_I' 
  | 'MANUAL_PROPIO_PORTAL';
```

**Reglas de Inferencia:**
1. Si el tipo de contrato es **Acuerdo Marco de Precios** o se cotiza en TVEC -> `TIENDA_VIRTUAL_TVEC`.
2. Si la entidad es **Ecopetrol, ISA, EPM, Cenit, GEB o una ESP (Ley 142)** -> `SUPLOS`.
3. Si la entidad es una **E.S.E. (Hospital)** o **Universidad Pública** con Manual Propio -> `MANUAL_PROPIO_PORTAL`.
4. Si la operación es del sector corporativo privado / concesión -> `SAP_ARIBA`.
5. Si es municipio pequeño con régimen de publicidad transitorio -> `SECOP_I`.
6. Por defecto para toda entidad estatal ordinaria -> `SECOP_II`.

---

## 🛠️ TAREA 2: ADAPTACIÓN DINÁMICA DEL FLUJOGRAMA PASO A PASO (`ContractFlowchartView.tsx`)

1. **En el Paso 3 / Paso 4 (Entidad y Régimen):**
   - Mostrar una insignia o selector sutil:  
     *«Plataforma sugerida para esta entidad: [SECOP II | Suplos | TVEC | SAP Ariba | Portal Propio]»*.
   - El usuario puede convalidar la plataforma o cambiarla soberanamente.
2. **En el Paso 10 (Publicación y Adjudicación):**
   - Adaptar los textos y acciones al canal seleccionado:
     - **Si es Suplos:** *"Publicar Solicitud de Cotización (RFQ) en Suplos"* + botón para abrir la vista interactiva de `SuplosView`.
     - **Si es TVEC:** *"Colocar Orden de Compra en Tienda Virtual CCE"* + botón para abrir `TvecStoreView`.
     - **Si es SAP Ariba:** *"Lanzar Evento de Sourcing / Subasta Inversa en SAP Ariba"* + botón para abrir `AribaView`.
     - **Si es Manual Propio:** *"Publicar Convocatoria en Portal Institucional según Manual Propio"*.
     - **Si es SECOP II:** *"Publicar y Adjudicar en SECOP II"* + botón para abrir `Secop2EntidadView`.
3. **En el Paso 13 (Liquidación):**
   - El botón final adapta el texto: *"Publicar Acta de Liquidación en [Plataforma Activa] y cerrar expediente"*.

---

## 🛠️ TAREA 3: CONEXIÓN SIN PÉRDIDA DE DATOS

- Al hacer clic en el botón de la plataforma correspondiente (ej. Suplos, TVEC o Ariba), debe abrir el modal o pantalla de la plataforma correspondiente usando el mismo patrón de `HerramientaModal` de la Ronda 4:
  - Pantalla completa con botón superior: **«← Volver al Flujograma»**.
  - **Cero pérdida de datos:** Todos los datos del expediente activo se conservan intactos al entrar y salir.
- La plataforma elegida debe guardarse dentro del objeto `Expediente` en `useProcurementStore.ts`.

---

## 📋 ENTREGABLES EXIGIDOS A COWORK / CLAUDE

1. **Compilación en Limpio:** Ejecutar `npm run build` en el workspace certificando **0 errores de TypeScript**.
2. **Pruebas en Navegador (Playwright):**
   - Probar una entidad ordinaria (Alcaldía) -> verifica que sugiera SECOP II.
   - Probar una empresa de servicios públicos o Ecopetrol -> verifica que sugiera Suplos y permita abrir la vista de Suplos.
   - Probar una compra por catálogo -> verifica que sugiera TVEC y abra la tienda virtual.
   - Confirmar que al volver al flujo el expediente mantenga su estado.
3. **Actualización del Informe:**
   - Registrar la sección **«RONDA 5»** en `resultados_pruebas_cowork/INFORME_BATERIA_SIMULACIONES_COWORK.md`.
4. **Regeneración del Bundle:**
   - Actualizar `ProcureSim_portatil.html` con todos los cambios incorporados.

---
*¡Inicia la implementación de la Ronda 5 multiplataforma!*
