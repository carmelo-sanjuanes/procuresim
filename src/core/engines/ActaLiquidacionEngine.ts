// Generador del borrador de Acta (bilateral) o Resolución (unilateral) de Liquidación en Word.
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { SMMLV_2026 } from '../domain/constants';

export interface DatosActaLiquidacion {
  entidad: string;
  nit: string;
  contratista: string;
  objeto: string;
  numeroContrato: string;
  valorContrato: number;
  tipoLiquidacion: 'BILATERAL_MUTUO_ACUERDO' | 'UNILATERAL_POR_RESOLUCION';
  constanciaRecibo: string;
  etiquetaTipologia: string;
  salvedades: string;
  supervisor: string;
}

const p = (text: string, bold = false) =>
  new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text, bold })] });
const h = (text: string) =>
  new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });

export const construirActaLiquidacion = (d: DatosActaLiquidacion): Document => {
  const bilateral = d.tipoLiquidacion === 'BILATERAL_MUTUO_ACUERDO';
  return new Document({
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: bilateral ? 'ACTA DE LIQUIDACIÓN BILATERAL' : 'RESOLUCIÓN DE LIQUIDACIÓN UNILATERAL',
                bold: true
              })
            ]
          }),
          p(`Entidad contratante: ${d.entidad || 'Por definir'}${d.nit ? ` — NIT ${d.nit}` : ''}`),
          p(`Contratista: ${d.contratista || 'Por definir'}`),
          p(`Contrato N° ${d.numeroContrato}`),
          p(`Objeto: ${d.objeto || 'Por definir'}`),
          p(`Tipología del objeto: ${d.etiquetaTipologia}`),
          p(
            `Valor del contrato: $${d.valorContrato.toLocaleString('es-CO')} COP (${(d.valorContrato / SMMLV_2026).toFixed(1)} SMMLV 2026)`
          ),
          h('Fundamento'),
          p(
            bilateral
              ? 'La liquidación de común acuerdo se realiza dentro del término pactado o, a falta de este, dentro de los cuatro (4) meses siguientes a la terminación (Art. 11 Ley 1150 de 2007).'
              : 'Vencido el término de la liquidación bilateral sin acuerdo, o ante la inasistencia del contratista, la entidad liquida unilateralmente dentro de los dos (2) meses siguientes (Art. 11 Ley 1150 de 2007), mediante acto administrativo motivado sujeto a recurso de reposición.'
          ),
          h('Recibo de la prestación'),
          p(d.constanciaRecibo),
          h('Balance económico'),
          p(
            'Valores ejecutados, pagos realizados, saldos a favor o en contra y liberación de recursos: por conciliar y certificar por la Supervisión y la Tesorería.'
          ),
          h('Salvedades'),
          p(d.salvedades.trim() || 'Sin salvedades registradas.'),
          h('Firmas'),
          p(`Supervisor: ${d.supervisor}`),
          p('Ordenador del gasto: ______________________'),
          p(bilateral ? 'Contratista: ______________________' : 'Notifíquese al contratista y a la aseguradora garante.')
        ]
      }
    ]
  });
};

export const descargarActaLiquidacionWord = async (d: DatosActaLiquidacion) => {
  const bilateral = d.tipoLiquidacion === 'BILATERAL_MUTUO_ACUERDO';
  const blob = await Packer.toBlob(construirActaLiquidacion(d));
  saveAs(blob, `${bilateral ? 'Acta_Liquidacion' : 'Resolucion_Liquidacion'}_${d.numeroContrato.replace(/[^\w-]/g, '_')}.docx`);
};
