// Motor Generador de Documentos Precontractuales y Contractuales
// Basado en Ley 80/1993, Ley 1150/2007, Decreto 1082/2015 y Documentos Tipo CCE
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import type { ProcesoContratacion } from '../domain/types';
import { SMMLV_2026 } from '../domain/constants';

const textoPlazo = (p: ProcesoContratacion) =>
  p.plazoMeses > 0 ? `${p.plazoMeses} meses` : p.plazoDias > 0 ? `${p.plazoDias} días` : 'Por definir por la entidad';
const cdpPendiente = (p: ProcesoContratacion) => !p.cdpNumero || p.cdpNumero === 'PENDIENTE_DE_INCORPORACION';
const textoCdp = (p: ProcesoContratacion) =>
  cdpPendiente(p) ? 'CDP: En trámite de expedición ante la Secretaría de Hacienda / Dirección Financiera' : `CDP No. ${p.cdpNumero}${p.cdpFecha ? ` expedido el ${p.cdpFecha}` : ''}`;
const textoUnspsc = (p: ProcesoContratacion) =>
  p.requisitosHabilitantes.codigosUNSPSCExigidos.length > 0 ? p.requisitosHabilitantes.codigosUNSPSCExigidos.join(', ') : 'Por definir según el objeto (clasificador UNSPSC)';
const textoLugar = (p: ProcesoContratacion) => p.lugarEjecucion || 'Por definir por la entidad';

export class DocumentEngine {
  /**
   * Genera el texto estructurado en Markdown de los Estudios Previos para visualización inmediata en pantalla
   */
  public static generarTextoEstudiosPrevios(proceso: ProcesoContratacion): string {
    const fecha = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

    return `# ESTUDIOS Y DOCUMENTOS PREVIOS
**PROCESO DE SELECCIÓN:** ${proceso.numeroProceso}  
**MODALIDAD:** ${proceso.modalidad.replace(/_/g, ' ')}  
**ENTIDAD:** ${proceso.entidad.nombre.toUpperCase()}  
**FECHA DE ELABORACIÓN:** ${fecha}  

---

### 1. DESCRIPCIÓN DE LA NECESIDAD QUE LA ENTIDAD PRETENDE SATISFACER
La ${proceso.entidad.nombre}, en cumplimiento de sus fines misionales consagrados en la Constitución Política y las leyes orgánicas, requiere adelantar la presente contratación con el fin de garantizar el funcionamiento operativo y la atención oportuna a la comunidad.

${proceso.justificacion}

### 2. OBJETO A CONTRATAR Y ESPECIFICACIONES TÉCNICAS
**OBJETO:** "${proceso.objeto}"

**Clasificación UNSPSC:**
${proceso.items.length > 0 ? proceso.items.map((i) => `* **Código ${i.codigoUNSPSC}:** ${i.descripcionUNSPSC} - Cantidad: ${i.cantidad} ${i.unidadMedida}. Detalle: ${i.detalleTecnico}`).join('\n') : '* Por definir según el objeto (clasificador UNSPSC).'}

**Lugar de Ejecución:** ${textoLugar(proceso)}  
**Plazo de Ejecución:** ${textoPlazo(proceso)} contados a partir de la suscripción del acta de inicio y aprobación de pólizas.

### 3. MODALIDAD DE SELECCIÓN Y SU JUSTIFICACIÓN JURÍDICA
De conformidad con el artículo 2° de la Ley 1150 de 2007 y el Decreto 1082 de 2015, la modalidad de selección aplicable para el presente trámite corresponde a **${proceso.modalidad.replace(/_/g, ' ')}**, en razón a la naturaleza del objeto y la cuantía del presupuesto oficial.

### 4. VALOR ESTIMADO DEL CONTRATO Y SU JUSTIFICACIÓN ECONÓMICA
El valor total estimado para la presente contratación se ha fijado en la suma de:
**\$${proceso.presupuestoOficial.toLocaleString('es-CO')} PESOS MONEDA CORRIENTE (COP)**, incluidos todos los costos directos, indirectos, impuestos, tasas, gravámenes e IVA a que haya lugar.

**Soporte Presupuestal:**
* **Certificado de Disponibilidad Presupuestal (CDP):** ${textoCdp(proceso)}
* **Rubro Presupuestal:** Adquisición de Bienes y Servicios Institucionales.

### 5. ANÁLISIS DEL SECTOR Y ESTUDIO DE MERCADO
En acatamiento a la Guía para la Elaboración de Estudios del Sector de Colombia Compra Eficiente, la entidad efectuó el análisis de la demanda histórica y requirió cotizaciones a operadores comerciales del sector. Se concluye que existe pluralidad de oferentes con capacidad técnica y solvencia financiera suficiente en el mercado local y nacional.

### 6. CRITERIOS PARA SELECCIONAR LA OFERTA MÁS FAVORABLE
La entidad seleccionará la oferta que cumpla con los requisitos habilitantes y obtenga el mayor puntaje de acuerdo con los siguientes factores:
* **Factor Económico (Precio):** ${proceso.criteriosPonderacion.puntajeEconomico} puntos
* **Calidad y Soporte Técnico:** ${proceso.criteriosPonderacion.puntajeTecnicoCalidad} puntos
* **Estímulo a la Industria Nacional (Ley 816 de 2002):** ${proceso.criteriosPonderacion.puntajeIndustriaNacional} puntos
* **Vinculación de Personal con Discapacidad (Decreto 392 de 2018):** ${proceso.criteriosPonderacion.puntajeDiscapacidad} puntos
* **Criterio MiPyme (Ley 2069 de 2020):** ${proceso.criteriosPonderacion.puntajeMiPyme} puntos
* **TOTAL:** 100 puntos

### 7. ESTIMACIÓN, TIPIFICACIÓN Y ASIGNACIÓN DE RIESGOS (CONPES 3714 / CCE)
La entidad estructuró la Matriz de Riesgos previsibles de la contratación, asignando las contingencias operacionales y de mercado a quien se encuentra en mejor posición de gestionarlas.
* Número de riesgos identificados y valorados: ${proceso.riesgos.length} riesgos.

### 8. ANÁLISIS DE GARANTÍAS Y AMPAROS EXIGIDOS
El contratista adjudicatario deberá constituir a favor de la ${proceso.entidad.nombre} una Póliza Única de Cumplimiento expedida por una compañía de seguros legalmente constituida en Colombia, que cubra:
* **Cumplimiento del Contrato:** 20% del valor total, con vigencia igual al plazo de ejecución y seis (6) meses más.
* **Pago de Salarios y Prestaciones Sociales:** 10% del valor total, con vigencia igual al plazo y tres (3) años más.
* **Calidad de los Bienes o Servicios:** 20% del valor total, con vigencia de un (1) año a partir del recibo a satisfacción.

### 9. SUPERVISIÓN Y CONTROL
La supervisión de la ejecución del contrato será ejercida por el funcionario que designe el Ordenador del Gasto, quien verificará las entregas, actas de recibo y cumplimiento de parafiscales.

---
**ELABORÓ:** Comité Estructurador Precontractual  
**REVISÓ Y APROBÓ:** ${proceso.entidad.ordenadorGasto} - Ordenador del Gasto`;
  }

  /**
   * Genera y descarga un archivo real de Microsoft Word (.docx) formalmente formateado
   */
  public static async descargarEstudiosPreviosWord(proceso: ProcesoContratacion): Promise<void> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: proceso.entidad.nombre.toUpperCase(),
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({
              text: 'DOCUMENTO DE ESTUDIOS Y DOCUMENTOS PREVIOS',
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({
              text: `PROCESO DE SELECCIÓN: ${proceso.numeroProceso} | MODALIDAD: ${proceso.modalidad.replace(/_/g, ' ')}`,
              alignment: AlignmentType.CENTER
            }),
            new Paragraph({ text: '' }),

            new Paragraph({
              text: '1. JUSTIFICACIÓN Y DESCRIPCIÓN DE LA NECESIDAD',
              heading: HeadingLevel.HEADING_3
            }),
            new Paragraph({ text: proceso.justificacion }),
            new Paragraph({ text: '' }),

            new Paragraph({
              text: '2. OBJETO CONTRACTUAL Y ESPECIFICACIONES TÉCNICAS',
              heading: HeadingLevel.HEADING_3
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Objeto: ', bold: true }),
                new TextRun({ text: proceso.objeto })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Lugar de Ejecución: ', bold: true }),
                new TextRun({ text: textoLugar(proceso) })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Plazo: ', bold: true }),
                new TextRun({ text: textoPlazo(proceso) })
              ]
            }),
            new Paragraph({ text: '' }),

            new Paragraph({
              text: '3. VALOR ESTIMADO Y PRESUPUESTO OFICIAL',
              heading: HeadingLevel.HEADING_3
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Presupuesto Oficial Total: ', bold: true }),
                new TextRun({ text: proceso.presupuestoOficial > 0 ? `\$${proceso.presupuestoOficial.toLocaleString('es-CO')} COP (equivale a ${(proceso.presupuestoOficial / SMMLV_2026).toLocaleString('es-CO', { maximumFractionDigits: 1 })} SMMLV; SMMLV 2026 = \$${SMMLV_2026.toLocaleString('es-CO')}, Decreto 1469 de 2025)` : 'Por definir' })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Certificado de Disponibilidad Presupuestal: ', bold: true }),
                new TextRun({ text: textoCdp(proceso) })
              ]
            }),
            new Paragraph({ text: '' }),

            new Paragraph({
              text: '4. REQUISITOS HABILITANTES EXIGIDOS',
              heading: HeadingLevel.HEADING_3
            }),
            new Paragraph({ text: 'Indicadores financieros de referencia: ajústalos con el análisis del sector de la entidad.' }),
            new Paragraph({ text: `• Índice de Liquidez Mínimo: ${proceso.requisitosHabilitantes.indiceLiquidezMinimo}` }),
            new Paragraph({ text: `• Nivel de Endeudamiento Máximo: ${proceso.requisitosHabilitantes.nivelEndeudamientoMaximoPct}%` }),
            new Paragraph({ text: `• Razón de Cobertura de Intereses: >= ${proceso.requisitosHabilitantes.coberturaInteresesMinima}` }),
            new Paragraph({ text: `• Experiencia acreditada (SMMLV): hasta ${proceso.requisitosHabilitantes.sumatoriaSMMLVMinima} SMMLV, proporcional al valor del contrato (máximo 100% del presupuesto oficial en SMMLV)` }),
            new Paragraph({ text: `• Códigos UNSPSC: ${textoUnspsc(proceso)}` }),
            new Paragraph({ text: '' }),

            new Paragraph({
              text: '5. FIRMAS Y APROBACIÓN',
              heading: HeadingLevel.HEADING_3
            }),
            new Paragraph({ text: '' }),
            new Paragraph({ text: '____________________________________________' }),
            new Paragraph({
              children: [
                new TextRun({ text: proceso.entidad.ordenadorGasto, bold: true }),
                new TextRun({ text: `\nOrdenador del Gasto - ${proceso.entidad.nombre}` })
              ]
            })
          ]
        }
      ]
    });

    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, `Estudios_Previos_${proceso.numeroProceso.replace(/\//g, '_')}.docx`);
  }
}
