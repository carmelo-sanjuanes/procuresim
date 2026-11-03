# ProcureSim: Suite Universal de Contratación Pública & Privada

[![GitHub Pages Deployment](https://img.shields.io/badge/Demo%20en%20Vivo-GitHub%20Pages-2ea44f?style=for-the-badge&logo=github)](https://carmelo-sanjuanes.github.io/procuresim/)
[![Versión Portátil](https://img.shields.io/badge/Versi%C3%B3n%20Offline-ProcureSim__portatil.html-blue?style=for-the-badge)](ProcureSim_portatil.html)

**ProcureSim** es una plataforma integral desarrollada para el entrenamiento, simulación y gestión de procesos contractuales tanto en el **sector público colombiano (SECOP I y SECOP II)** como en las **tres plataformas privadas más populares (Suplos, SAP Ariba y Coupa)**.

🌐 **Demo en vivo:** [https://carmelo-sanjuanes.github.io/procuresim/](https://carmelo-sanjuanes.github.io/procuresim/)  
📁 **Versión Autónoma Offline:** Puedes descargar y abrir [`ProcureSim_portatil.html`](ProcureSim_portatil.html) directamente en cualquier navegador (Chrome, Edge, Safari, Firefox) sin internet ni instalación.

Diseñada con **Clean Architecture (Domain-Driven Design)** en TypeScript y React, la aplicación funciona como un entorno de entrenamiento interactivo y, al mismo tiempo, como un **motor de contratación listo para ser conectado a bases de datos relacionales o APIs reales de producción**.

---

## 🚀 Módulos Integrados

### 1. Contratación Pública Colombiana (Ley 80 / Ley 1150 / Dcto 1082)
* **SECOP II (Vista Entidad Compradora):** Replicación de la interfaz transaccional oficial de Colombia Compra Eficiente. Permite crear procesos, gestionar cronogramas, revisar y evaluar requisitos habilitantes, responder observaciones ciudadanas y realizar la audiencia de adjudicación.
* **SECOP II (Vista Proveedor / Licitante):** Búsqueda de convocatorias, manifestación formal de interés, radicación de observaciones y presentación de ofertas con sobres electrónicos y sello de tiempo criptográfico.
* **SECOP I (Portal Tradicional de Publicidad):** Búsqueda geográfica por departamentos y municipios, consulta histórica de procesos y descargue de pliegos y resoluciones.

### 2. Plataformas de Contratación Privada y Corporativa (Top 3)
* **Suplos B2B (Líder en Colombia y LatAm):** Homologación y debida diligencia de proveedores (SAGRILAFT/PTEE/SST), eventos privados de cotización (RFx) y mesa de negociación de mejores ofertas finales (BAFO).
* **SAP Ariba Sourcing (Estándar Global):** Simulador de **Subasta Inversa Electrónica en Vivo (*Live Reverse Auction*)** con cronómetro regresivo, posturas decrecientes en tiempo real y cálculo dinámico de posición (Rango #1).
* **Coupa Spend Management:** Gestión integral del gasto corporativo, control de presupuesto asignado vs. comprometido, y flujo de aprobación multinivel (Jefe de Área -> Gerente Financiero -> Vicepresidencia/CFO) para emisión de Órdenes de Compra (PO).

### 3. Motores Inteligentes Especializados
* **Módulo de Cotizaciones y Estudio de Mercado (CCE):**
  * Solicitud de cotizaciones con codificación oficial **UNSPSC**.
  * Generador automático de cotizaciones simuladas (3 a 5 propuestas realistas con NIT, contacto, desglose de costos directos, IVA y AIU).
  * Matriz comparativa y cálculo estadístico en vivo: Media aritmética, Mediana, Desviación estándar y Coeficiente de variación.
  * Redacción justificada del Presupuesto Oficial para los Estudios Previos.
* **Motor Generador de Documentos Precontractuales:**
  * Generador de **Estudios y Documentos Previos**, **Pliegos de Condiciones**, **Matriz de Riesgos (CONPES 3714)** y **Minutas Contractuales**.
  * Previsualización instantánea y **descarga directa en Microsoft Word (.docx)** formalmente diagramado.
* **Asistente de Presentación de Propuestas (Lado Licitante 360°):**
  * Auditoría previa a la radicación: Validador de capacidad jurídica, verificación de índices financieros RUP (Liquidez, Endeudamiento, Cobertura de Intereses) y experiencia acreditada en SMMLV y códigos UNSPSC.
  * Validador de oferta económica con alerta de precios artificialmente bajos (<80%) o sobrecostos sobre el presupuesto oficial.
  * Predictor de puntaje ponderado sobre 100 puntos.
  * Generador de formatos oficiales: Carta de Presentación de la Propuesta (Documento Tipo CCE), Documento de Conformación de Consorcios/UT y Certificación de Parafiscales (Art. 50 Ley 789 de 2002).
* **Bitácora de Auditoría y Trazabilidad (OCDS):**
  * Registro inmutable de eventos con fecha, hora, rol y módulo. Exportable a formato JSON conforme al estándar internacional de compras abiertas (*Open Contracting Data Standard*).

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS.
* **Componentes e Iconografía:** Lucide React.
* **Gestión de Estado y Persistencia:** Zustand.
* **Motor de Exportación Word:** `docx` + `file-saver`.
* **Arquitectura:** Domain-Driven Design (Separación de Dominio, Motores de Negocio, Adaptadores y Vistas).

---

## 💻 Instrucciones para Ejecutar en Desarrollo

1. Instalar dependencias (ya instaladas en este entorno):
   ```bash
   npm install
   ```

2. Iniciar el servidor local de desarrollo:
   ```bash
   npm run dev
   ```

3. Abrir en el navegador la dirección local (por defecto `http://localhost:5173`).

4. Compilar para producción:
   ```bash
   npm run build
   ```

---

## 🔄 Transición de Entrenamiento a Producción Real

El núcleo de negocio (`src/core/engines/`) es agnóstico del modo de visualización:
* **Modo Entrenamiento:** Utiliza adaptadores en memoria y persistencia local (`IndexedDB` / `LocalStorage`) con entidades y empresas colombianas ficticias precargadas.
* **Modo Producción Real:** La capa de estado (`useProcurementStore`) puede conectarse directamente a un backend REST/GraphQL en Node.js o Python con PostgreSQL para operar en una entidad pública real o empresa privada, o consumir datos abiertos del SECOP a través de la API Socrata (`datos.gov.co`).
